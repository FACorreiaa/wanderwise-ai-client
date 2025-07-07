// SolidStart-enhanced authentication API
import { query, action, revalidate } from "@solidjs/router";
import { createQuery, createMutation } from "@tanstack/solid-query";
import { solidStartApiRequest, createQueryWithPreload, createActionWithMutation } from './solidstart';
import { queryClient } from '../query-client';

// =======================
// TYPE DEFINITIONS
// =======================

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  access_token: string;
  message: string;
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

interface RegisterResponse {
  message: string;
  user_id?: string;
}

interface SessionValidation {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    username: string;
  };
  expires_at?: string;
}

interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// =======================
// SOLIDSTART QUERIES
// =======================

// Session validation with SolidStart caching
export const validateSession = createQueryWithPreload(
  "session-validation",
  async (): Promise<SessionValidation> => {
    return solidStartApiRequest<SessionValidation>("/api/auth/validate-session", {
      timeout: 10000, // Shorter timeout for auth
    });
  },
  {
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry auth failures
  }
);

// User profile data (loaded after successful auth)
export const getCurrentUser = createQueryWithPreload(
  "current-user",
  async (): Promise<any> => {
    return solidStartApiRequest("/api/auth/user");
  },
  {
    staleTime: 1000 * 60 * 10, // 10 minutes
  }
);

// =======================
// SOLIDSTART ACTIONS
// =======================

// Login action with automatic session revalidation
export const loginUser = createActionWithMutation(
  "login-user",
  async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await solidStartApiRequest<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    // Store token based on rememberMe preference
    const { setAuthToken } = await import('../api');
    setAuthToken(response.access_token, data.rememberMe || false);

    return response;
  },
  {
    invalidates: ["session-validation", "current-user"],
    onSuccess: (data, params) => {
      console.log(`✅ User ${params.email} logged in successfully`);
      
      // Prefetch user data after login
      setTimeout(() => {
        getCurrentUser.preload();
      }, 100);
    },
    onError: (error) => {
      console.error("❌ Login failed:", error.message);
    },
  }
);

// Register action
export const registerUser = createActionWithMutation(
  "register-user",
  async (data: RegisterRequest): Promise<RegisterResponse> => {
    return solidStartApiRequest<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role || "user",
      }),
    });
  },
  {
    invalidates: ["session-validation"],
    onSuccess: (data, params) => {
      console.log(`✅ User ${params.username} registered successfully`);
    },
  }
);

// Logout action with complete cache clearing
export const logoutUser = createActionWithMutation(
  "logout-user",
  async (): Promise<{ message: string }> => {
    const response = await solidStartApiRequest<{ message: string }>("/api/auth/logout", {
      method: "POST",
    });

    // Clear authentication token
    const { clearAuthToken } = await import('../api');
    clearAuthToken();

    return response;
  },
  {
    invalidates: [], // We'll manually clear everything
    onSuccess: () => {
      console.log("✅ User logged out successfully");
      
      // Clear all cached data
      queryClient.clear();
      
      // Revalidate to clear SolidStart cache
      revalidate("session-validation");
      revalidate("current-user");
    },
    onError: async () => {
      // Force logout even if API call fails
      const { clearAuthToken } = await import('../api');
      clearAuthToken();
      queryClient.clear();
    },
  }
);

// Password update action
export const updatePassword = createActionWithMutation(
  "update-password",
  async (data: UpdatePasswordRequest): Promise<{ message: string }> => {
    return solidStartApiRequest<{ message: string }>("/api/auth/update-password", {
      method: "PUT",
      body: JSON.stringify({
        old_password: data.oldPassword,
        new_password: data.newPassword,
      }),
    });
  },
  {
    onSuccess: () => {
      console.log("✅ Password updated successfully");
    },
  }
);

// =======================
// ENHANCED HOOKS
// =======================

// Enhanced session validation hook
export const useSessionValidation = () => {
  return validateSession.useQuery();
};

// Enhanced current user hook with automatic prefetching
export const useCurrentUser = () => {
  return getCurrentUser.useQuery();
};

// Enhanced login mutation with loading state
export const useLoginMutation = () => {
  return loginUser.useMutation();
};

// Enhanced register mutation
export const useRegisterMutation = () => {
  return registerUser.useMutation();
};

// Enhanced logout mutation
export const useLogoutMutation = () => {
  return logoutUser.useMutation();
};

// Enhanced password update mutation
export const useUpdatePasswordMutation = () => {
  return updatePassword.useMutation();
};

// =======================
// UTILITY FUNCTIONS
// =======================

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  try {
    const sessionData = validateSession.query();
    return sessionData?.valid ?? false;
  } catch {
    return false;
  }
};

// Get current user data synchronously from cache
export const getCurrentUserSync = () => {
  try {
    return getCurrentUser.query();
  } catch {
    return null;
  }
};

// Prefetch authentication data
export const prefetchAuthData = async () => {
  try {
    await Promise.allSettled([
      validateSession.preload(),
      // Only prefetch user data if session is valid
      validateSession.query()?.valid ? getCurrentUser.preload() : Promise.resolve(),
    ]);
  } catch (error) {
    console.warn("Failed to prefetch auth data:", error);
  }
};

// Auth route configuration helper
export const createAuthRoute = (path: string, requireAuth = false) => ({
  path,
  preload: requireAuth ? prefetchAuthData : undefined,
});

// =======================
// BACKWARDS COMPATIBILITY
// =======================

// Export legacy hooks for gradual migration
export const useValidateSession = useSessionValidation;