// Legacy API Service for Loci Travel App
// NOTE: This file contains legacy API functions. For new development, prefer using
// the query-based functions from './api-queries.ts' which provide better caching,
// optimistic updates, and error handling with @tanstack/solid-query.

// Import Connect RPC client for auth
import { createClient } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
import { AuthService } from "@buf/loci_loci-proto.bufbuild_es/loci/auth/auth_pb.js";
import { ChatService } from "@buf/loci_loci-proto.bufbuild_es/loci/chat/chat_pb.js";
import {
  LoginRequestSchema,
  RegisterRequestSchema,
  ValidateSessionRequestSchema,
  LogoutRequestSchema,
  RefreshTokenRequestSchema,
} from "@buf/loci_loci-proto.bufbuild_es/loci/auth/auth_pb.js";
import { transport } from "./connect-transport";

const API_BASE_URL = import.meta.env.VITE_CONNECT_BASE_URL || "http://localhost:8000";

// Create auth client once
const authClient = createClient(AuthService, transport);
export const chatService = createClient(ChatService, transport);

// Token management functions - moved to top to avoid circular dependency
export const getAuthToken = (): string | null => {
  // Check localStorage first (persistent), then sessionStorage (temporary)
  return localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token");
};

export const setAuthToken = (
  token: string,
  rememberMe: boolean = false,
  refreshToken?: string,
): void => {
  const primaryStorage = rememberMe ? localStorage : sessionStorage;
  const secondaryStorage = rememberMe ? sessionStorage : localStorage;

  primaryStorage.setItem("access_token", token);
  if (refreshToken) {
    primaryStorage.setItem("refresh_token", refreshToken);
  }

  secondaryStorage.removeItem("access_token");
  secondaryStorage.removeItem("refresh_token");
};

export const clearAuthToken = (): void => {
  localStorage.removeItem("access_token");
  sessionStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  sessionStorage.removeItem("refresh_token");
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Helper to parse JWT
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (_e) {
    return null;
  }
};

// Authentication API
export const authAPI = {
  async login(email: string, password: string) {
    // Demo mode: Allow hardcoded test user to login without backend
    if (import.meta.env.DEV && email === "test@email.com" && password === "test12345") {
      console.log("🎭 Demo mode: Logging in test user without backend authentication");
      return {
        access_token: "demo-token-" + Date.now(),
        refresh_token: "demo-refresh-" + Date.now(),
        message: "Demo login successful",
      };
    }

    // Use Connect RPC
    const request = create(LoginRequestSchema, { email, password });
    const response = await authClient.login(request);

    // The RPC response uses camelCase field names
    // Note: TypeScript types may lag behind proto definition, using type assertion
    const loginResponse = response as unknown as {
      accessToken: string;
      refreshToken: string;
      message: string;
      userId?: string;
      username?: string;
      email?: string;
    };

    return {
      access_token: loginResponse.accessToken,
      refresh_token: loginResponse.refreshToken,
      message: loginResponse.message,
      // Pass through user details from login response
      user_id: loginResponse.userId || "",
      username: loginResponse.username || "",
      email: loginResponse.email || email, // Fallback to input email
    };
  },

  async register(username: string, email: string, password: string, role: string = "user") {
    const request = create(RegisterRequestSchema, { username, email, password, role });
    const response = await authClient.register(request);

    return {
      success: response.success,
      message: response.message,
    };
  },

  async logout() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available for logout");
    }

    const request = create(LogoutRequestSchema, { refreshToken });
    const response = await authClient.logout(request);

    return {
      success: response.success,
      message: response.message,
    };
  },

  async validateSession() {
    const token = getAuthToken();
    console.log("validateSession: Token available?", !!token);
    if (!token) {
      console.log("validateSession: No token, returning invalid");
      return { valid: false };
    }

    // Demo mode: Validate demo token without backend call
    if (import.meta.env.DEV && token.startsWith("demo-token-")) {
      console.log("🎭 Demo mode: Validating demo token without backend call");
      return {
        valid: true,
        user_id: "demo-user",
        username: "Test User",
        email: "test@email.com",
      };
    }

    console.log("validateSession: Making Connect RPC call to validate JWT...");
    try {
      // Extract JTI (JWT ID) to use as session ID
      // This satisfies length constraints (UUID) and gives the backend the correct ID to check
      const payload = parseJwt(token);
      const sessionId = payload?.jti || "current";

      console.log("validateSession: Using sessionId from JWT:", sessionId);

      const request = create(ValidateSessionRequestSchema, { sessionId });
      const response = await authClient.validateSession(request);

      console.log("validateSession: API response:", response);
      return {
        valid: response.valid,
        user_id: response.userId,
        username: response.username,
        email: response.email,
      };
    } catch (error) {
      console.error("validateSession: API error:", error);
      // If it's unauthorized, return invalid
      if ((error as any)?.code === "unauthenticated") {
        return { valid: false };
      }
      throw error;
    }
  },

  async refreshToken() {
    console.log("refreshToken: Attempting to refresh token using refresh_token...");
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    try {
      const request = create(RefreshTokenRequestSchema, { refreshToken });
      const response = await authClient.refreshToken(request);

      console.log("refreshToken: Refresh successful");
      return {
        access_token: response.accessToken,
        refresh_token: response.refreshToken,
      };
    } catch (error) {
      console.error("refreshToken: Refresh failed:", error);
      throw error;
    }
  },

  async updatePassword(_oldPassword: string, _newPassword: string) {
    // Migrated to ConnectRPC or similar if applicable, but for now just removing REST fallback
    console.warn("updatePassword: REST implementation removed");
    throw new Error("updatePassword not implemented via RPC yet");
  },

  async getCurrentUser() {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token available");
    }

    // Demo mode: Return hardcoded user profile for demo token
    if (import.meta.env.DEV && token.startsWith("demo-token-")) {
      console.log("🎭 Demo mode: Returning hardcoded user profile for demo token");
      return {
        id: "demo-user",
        email: "test@email.com",
        username: "testuser",
        firstname: "Test",
        lastname: "User",
        display_name: "Test User",
        is_active: true,
        role: "user",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };
    }

    const session = await authAPI.validateSession();
    if (!session.valid) {
      throw new Error("Session invalid");
    }

    // Use session data as primary source
    const username = session.username || session.email?.split("@")[0] || "";
    const displayName = session.username || username;

    return {
      id: session.user_id || "",
      email: session.email || "",
      username: username,
      display_name: displayName,
      firstname: "",
      lastname: "",
      profile_image_url: undefined,
      is_active: true,
      created_at: "",
      updated_at: "",
    };
  },
};

// Type definitions for better TypeScript support
export interface LoginResponse {
  access_token: string;
  message: string;
}

export interface UserProfile {
  id: string;
  name: string;
  description: string;
  is_default: boolean;
  search_radius: number;
  preferred_time: string;
  budget_level: string;
  pace: string;
  accessibility_needs: string[];
  interests: string[];
  created_at: string;
}

export interface POI {
  id: string;
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  timeToSpend: string;
  budget: string;
  rating: number;
  tags: string[];
  priority: number;
}

export interface ChatMessage {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  hasItinerary?: boolean;
  itinerary?: any;
}

export interface ItineraryList {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  isPublic: boolean;
  allowCollaboration: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  owner: string;
  collaborators: string[];
}

// Error handling utility
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Utility functions
export const uploadFile = async (file: File, endpoint: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include", // Include HttpOnly cookies
    body: formData,
  });

  if (!response.ok) {
    throw new APIError(`Upload failed: ${response.statusText}`, response.status);
  }

  const result: any = await response.json();
  return result.url || result.path;
};
