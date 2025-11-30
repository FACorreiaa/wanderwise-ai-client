// Connect RPC transport configuration for the Loci app
import { createConnectTransport } from "@connectrpc/connect-web";
import type { Transport } from "@connectrpc/connect";
import { getAuthToken } from "./auth/tokens";

// Connect RPC base URL (without /api/v1 prefix - Connect appends service paths)
const API_BASE_URL = import.meta.env.VITE_CONNECT_BASE_URL
/**
 * Creates a Connect transport with authentication interceptor.
 * This transport is used by all Connect-Query hooks to make RPC calls.
 */
export function createAuthenticatedTransport(): Transport {
  return createConnectTransport({
    baseUrl: API_BASE_URL,
    // Add authentication header to all requests
    interceptors: [
      (next) => async (req) => {
        const token = getAuthToken();
        if (token) {
          req.header.set("Authorization", `Bearer ${token}`);
        }
        return await next(req);
      },
    ],
  });
}

/**
 * Default transport instance for the application.
 * Export this to use with TransportProvider.
 */
export const transport = createAuthenticatedTransport();
