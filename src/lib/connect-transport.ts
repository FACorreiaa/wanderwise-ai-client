// Connect RPC transport configuration for the Loci app
import { createConnectTransport } from "@connectrpc/connect-web";
import type { Interceptor, Transport } from "@connectrpc/connect";
import { ConnectError, Code } from "@connectrpc/connect";
import {
  getAuthToken,
  getRefreshToken,
  setAuthToken,
  isPersistentSession,
  clearAuthToken,
} from "./auth/tokens";

// Connect RPC base URL (without /api/v1 prefix - Connect appends service paths)
const API_BASE_URL = import.meta.env.VITE_CONNECT_BASE_URL;

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Attempt to refresh the access token using the refresh token.
 * Returns true if successful, false otherwise.
 */
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.warn("No refresh token available for token refresh");
    return false;
  }

  try {
    // Make a direct fetch to the refresh endpoint to avoid circular interceptor calls
    const response = await fetch(`${API_BASE_URL}/loci.auth.AuthService/RefreshToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.error("Token refresh failed with status:", response.status);
      return false;
    }

    const data = (await response.json()) as { accessToken?: string; refreshToken?: string };

    if (data.accessToken) {
      // Preserve the remember me preference
      const shouldPersist = isPersistentSession();
      setAuthToken(data.accessToken, shouldPersist, data.refreshToken || refreshToken);
      console.log("Token refreshed successfully");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Token refresh error:", error);
    return false;
  }
}

/**
 * Interceptor that adds authentication headers to requests.
 */
const authInterceptor: Interceptor = (next) => async (req) => {
  const token = getAuthToken();
  if (token) {
    req.header.set("Authorization", `Bearer ${token}`);
  }
  return await next(req);
};

/**
 * Interceptor that automatically refreshes tokens on 401 Unauthenticated errors.
 * If refresh succeeds, it retries the original request with the new token.
 */
const tokenRefreshInterceptor: Interceptor = (next) => async (req) => {
  try {
    return await next(req);
  } catch (error) {
    // Only handle ConnectError with Unauthenticated code
    if (error instanceof ConnectError && error.code === Code.Unauthenticated) {
      // Check if the error indicates an expired token (not invalid credentials)
      const message = error.message.toLowerCase();
      if (
        message.includes("expired") ||
        message.includes("invalid token") ||
        message.includes("token")
      ) {
        // Prevent multiple simultaneous refresh attempts
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshAccessToken().finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
        }

        // Wait for the refresh to complete
        const refreshed = await refreshPromise;

        if (refreshed) {
          // Retry the original request with the new token
          const newToken = getAuthToken();
          if (newToken) {
            req.header.set("Authorization", `Bearer ${newToken}`);
          }
          return await next(req);
        } else {
          // Refresh failed - clear tokens and let the error propagate
          clearAuthToken();
          // Redirect to login
          if (typeof window !== "undefined" && !window.location.pathname.includes("/auth/")) {
            window.location.href = "/auth/signin";
          }
        }
      }
    }

    // Re-throw the original error
    throw error;
  }
};

/**
 * Creates a Connect transport with authentication and token refresh interceptors.
 * This transport is used by all Connect-Query hooks to make RPC calls.
 */
export function createAuthenticatedTransport(): Transport {
  return createConnectTransport({
    baseUrl: API_BASE_URL,
    // Interceptors run in order: auth first (adds token), then refresh (handles 401)
    interceptors: [authInterceptor, tokenRefreshInterceptor],
  });
}

/**
 * Default transport instance for the application.
 * Export this to use with TransportProvider.
 */
export const transport = createAuthenticatedTransport();
