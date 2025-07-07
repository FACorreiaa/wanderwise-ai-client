// SolidStart-enhanced LLM and chat API
import { query, action, revalidate } from "@solidjs/router";
import { createQuery, createMutation } from "@tanstack/solid-query";
import { solidStartApiRequest, createQueryWithPreload, createActionWithMutation } from './solidstart';
import {
  defaultLLMRateLimiter,
  RateLimitError,
  showRateLimitNotification,
} from "../rate-limiter";
import { API_BASE_URL } from "./shared";
import type {
  ChatSession,
  ChatMessage,
  ChatSessionResponse,
  StreamEvent,
  UnifiedChatResponse,
  ApiResponse,
  SessionPerformanceMetrics,
  SessionContentMetrics,
  SessionEngagementMetrics,
} from "./types";

// =======================
// TYPE DEFINITIONS
// =======================

export type ChatContextType = "hotels" | "restaurants" | "itineraries" | "general";

export interface StartChatRequest {
  profileId: string;
  contextType: ChatContextType;
  cityName?: string;
  initialMessage?: string;
  userLocation?: {
    userLat: number;
    userLon: number;
  };
}

export interface ContinueChatRequest {
  sessionId: string;
  message: string;
  cityName?: string;
  contextType: ChatContextType;
  userLocation?: {
    userLat: number;
    userLon: number;
  };
}

export interface UnifiedChatRequest {
  profileId: string;
  message: string;
  userLocation?: {
    userLat: number;
    userLon: number;
  };
}

export interface ChatSessionsResponse {
  sessions: ChatSessionResponse[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// =======================
// RATE LIMITING UTILITIES
// =======================

async function rateLimitedSolidStartRequest<T>(
  endpoint: string,
  options: RequestInit & { params?: Record<string, any> },
  rateLimitKey: string,
): Promise<T> {
  // Apply client-side rate limiting for LLM endpoints
  const rateLimitCheck = await defaultLLMRateLimiter.checkRateLimit(rateLimitKey);
  if (!rateLimitCheck.allowed) {
    const retryAfter = rateLimitCheck.retryAfter || 60;
    showRateLimitNotification(retryAfter, rateLimitKey);
    throw new RateLimitError(
      `Rate limit exceeded for ${rateLimitKey}. Retry after ${retryAfter} seconds.`,
      retryAfter,
      rateLimitKey,
    );
  }

  try {
    const response = await solidStartApiRequest<T>(endpoint, options);
    return response;
  } catch (error: any) {
    // Handle server-side rate limiting
    if (error.status === 429) {
      const retryAfter = parseInt(error.headers?.get?.("Retry-After") || "60");
      showRateLimitNotification(retryAfter, rateLimitKey);
      throw new RateLimitError(
        `Server rate limit exceeded for ${rateLimitKey}. Retry after ${retryAfter} seconds.`,
        retryAfter,
        rateLimitKey,
      );
    }
    throw error;
  }
}

// =======================
// SOLIDSTART QUERIES
// =======================

// Get user chat sessions with pagination
export const getChatSessions = createQueryWithPreload(
  "chat-sessions",
  async (params?: { page?: number; limit?: number }): Promise<ChatSessionsResponse> => {
    const searchParams = {
      ...(params?.page && { page: params.page.toString() }),
      ...(params?.limit && { limit: params.limit.toString() }),
    };

    return rateLimitedSolidStartRequest<ChatSessionsResponse>(
      "/api/llm/prompt-response/chat/sessions",
      { params: searchParams },
      "get-chat-sessions"
    );
  },
  {
    staleTime: 1000 * 60 * 5, // 5 minutes
  }
);

// Get specific chat session details
export const getChatSession = createQueryWithPreload(
  "chat-session-details",
  async (sessionId: string): Promise<ChatSessionResponse> => {
    return rateLimitedSolidStartRequest<ChatSessionResponse>(
      `/api/llm/prompt-response/chat/sessions/${sessionId}`,
      {},
      `get-chat-session-${sessionId}`
    );
  },
  {
    staleTime: 1000 * 60 * 10, // 10 minutes
  }
);

// Get session performance metrics
export const getSessionMetrics = createQueryWithPreload(
  "session-metrics",
  async (sessionId: string): Promise<{
    performance: SessionPerformanceMetrics;
    content: SessionContentMetrics;
    engagement: SessionEngagementMetrics;
  }> => {
    return rateLimitedSolidStartRequest(
      `/api/llm/prompt-response/chat/sessions/${sessionId}/metrics`,
      {},
      `get-session-metrics-${sessionId}`
    );
  },
  {
    staleTime: 1000 * 60 * 15, // 15 minutes
  }
);

// =======================
// SOLIDSTART ACTIONS
// =======================

// Create new chat session
export const createChatSession = createActionWithMutation(
  "create-chat-session",
  async (data: { profileId: string; contextType?: ChatContextType }): Promise<ChatSession> => {
    const endpoint = getContextualEndpoint("sessions", data.contextType || "general");
    
    return rateLimitedSolidStartRequest<ChatSession>(
      `/api/${endpoint}/${data.profileId}`,
      {
        method: "POST",
        body: JSON.stringify({
          context_type: data.contextType || "general",
        }),
      },
      `create-chat-session-${data.profileId}`
    );
  },
  {
    invalidates: ["chat-sessions"],
    onSuccess: (data, params) => {
      console.log(`✅ Created chat session for profile ${params.profileId}`);
    },
  }
);

// Send message to existing session
export const sendChatMessage = createActionWithMutation(
  "send-chat-message",
  async (data: {
    sessionId: string;
    message: string;
    contextType?: ChatContextType;
  }): Promise<ChatMessage> => {
    const endpoint = getContextualEndpoint(
      `sessions/${data.sessionId}/messages`,
      data.contextType || "general"
    );

    return rateLimitedSolidStartRequest<ChatMessage>(
      `/api/${endpoint}`,
      {
        method: "POST",
        body: JSON.stringify({
          message: data.message,
          context_type: data.contextType || "general",
        }),
      },
      `send-message-${data.sessionId}`
    );
  },
  {
    invalidates: ["chat-session-details", "chat-sessions"],
    onSuccess: (data, params) => {
      console.log(`✅ Sent message to session ${params.sessionId}`);
      // Revalidate specific session
      revalidate(`chat-session-details-${params.sessionId}`);
    },
  }
);

// Start unified chat (new session with message)
export const startUnifiedChat = createActionWithMutation(
  "start-unified-chat",
  async (data: UnifiedChatRequest): Promise<UnifiedChatResponse> => {
    return rateLimitedSolidStartRequest<UnifiedChatResponse>(
      `/api/llm/prompt-response/chat/sessions/${data.profileId}`,
      {
        method: "POST",
        body: JSON.stringify({
          message: data.message,
          user_location: data.userLocation,
        }),
      },
      `start-unified-chat-${data.profileId}`
    );
  },
  {
    invalidates: ["chat-sessions"],
    onSuccess: (data, params) => {
      console.log(`✅ Started unified chat for profile ${params.profileId}`);
    },
  }
);

// Continue chat session
export const continueUnifiedChat = createActionWithMutation(
  "continue-unified-chat",
  async (data: {
    sessionId: string;
    message: string;
    cityName?: string;
    contextType?: string;
    userLocation?: { userLat: number; userLon: number };
  }): Promise<UnifiedChatResponse> => {
    return rateLimitedSolidStartRequest<UnifiedChatResponse>(
      `/api/llm/prompt-response/chat/sessions/${data.sessionId}/continue`,
      {
        method: "POST",
        body: JSON.stringify({
          message: data.message,
          city_name: data.cityName,
          context_type: data.contextType || "modify_itinerary",
          user_location: data.userLocation,
        }),
      },
      `continue-chat-${data.sessionId}`
    );
  },
  {
    invalidates: ["chat-session-details", "chat-sessions"],
    onSuccess: (data, params) => {
      console.log(`✅ Continued chat for session ${params.sessionId}`);
      revalidate(`chat-session-details-${params.sessionId}`);
    },
  }
);

// =======================
// STREAMING FUNCTIONS
// =======================

// These remain similar to original but with enhanced error handling
export const startChatStream = async (request: StartChatRequest): Promise<Response> => {
  const endpoint = getContextualEndpoint("sessions/stream", request.contextType);
  const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
  const fullEndpoint = `${endpoint}/${request.profileId}`;

  // Apply rate limiting
  const rateLimitCheck = await defaultLLMRateLimiter.checkRateLimit(fullEndpoint);
  if (!rateLimitCheck.allowed) {
    const retryAfter = rateLimitCheck.retryAfter || 60;
    showRateLimitNotification(retryAfter, fullEndpoint);
    throw new RateLimitError(
      `Rate limit exceeded for ${fullEndpoint}. Retry after ${retryAfter} seconds.`,
      retryAfter,
      fullEndpoint,
    );
  }

  const response = await fetch(`${API_BASE_URL}/${fullEndpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      context_type: request.contextType,
      city_name: request.cityName,
      initial_message: request.initialMessage,
      user_location: request.userLocation,
    }),
  });

  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get("Retry-After") || "60");
    showRateLimitNotification(retryAfter, fullEndpoint);
    throw new RateLimitError(
      `Server rate limit exceeded for ${fullEndpoint}. Retry after ${retryAfter} seconds.`,
      retryAfter,
      fullEndpoint,
    );
  }

  return response;
};

export const continueChatStream = async (request: ContinueChatRequest): Promise<Response> => {
  const endpoint = getContextualEndpoint(
    `sessions/${request.sessionId}/messages/stream`,
    request.contextType,
  );
  const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

  // Apply rate limiting
  const rateLimitCheck = await defaultLLMRateLimiter.checkRateLimit(endpoint);
  if (!rateLimitCheck.allowed) {
    const retryAfter = rateLimitCheck.retryAfter || 60;
    showRateLimitNotification(retryAfter, endpoint);
    throw new RateLimitError(
      `Rate limit exceeded for ${endpoint}. Retry after ${retryAfter} seconds.`,
      retryAfter,
      endpoint,
    );
  }

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      message: request.message,
      city_name: request.cityName,
      context_type: request.contextType,
      user_location: request.userLocation,
    }),
  });

  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get("Retry-After") || "60");
    showRateLimitNotification(retryAfter, endpoint);
    throw new RateLimitError(
      `Server rate limit exceeded for ${endpoint}. Retry after ${retryAfter} seconds.`,
      retryAfter,
      endpoint,
    );
  }

  return response;
};

export const sendUnifiedChatMessageStream = async (
  request: UnifiedChatRequest,
): Promise<Response> => {
  const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
  const endpoint = `/llm/prompt-response/chat/sessions/stream/${request.profileId}`;

  // Apply rate limiting
  const rateLimitCheck = await defaultLLMRateLimiter.checkRateLimit(endpoint);
  if (!rateLimitCheck.allowed) {
    const retryAfter = rateLimitCheck.retryAfter || 60;
    showRateLimitNotification(retryAfter, endpoint);
    throw new RateLimitError(
      `Rate limit exceeded for ${endpoint}. Retry after ${retryAfter} seconds.`,
      retryAfter,
      endpoint,
    );
  }

  console.log("=== SOLIDSTART STREAMING API CALL ===");
  console.log("Token found:", !!token);
  console.log("Request:", request);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      message: request.message,
      user_location: request.userLocation,
    }),
  });

  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get("Retry-After") || "60");
    showRateLimitNotification(retryAfter, endpoint);
    throw new RateLimitError(
      `Server rate limit exceeded for ${endpoint}. Retry after ${retryAfter} seconds.`,
      retryAfter,
      endpoint,
    );
  }

  return response;
};

// =======================
// ENHANCED HOOKS
// =======================

// Enhanced chat sessions hook
export const useChatSessions = (page?: number, limit?: number) => {
  return getChatSessions.useQuery({ page, limit });
};

// Enhanced chat session details hook
export const useChatSession = (sessionId: string) => {
  return getChatSession.useQuery(sessionId);
};

// Enhanced session metrics hook
export const useSessionMetrics = (sessionId: string) => {
  return getSessionMetrics.useQuery(sessionId);
};

// Enhanced mutation hooks
export const useCreateChatSessionMutation = () => {
  return createChatSession.useMutation();
};

export const useSendChatMessageMutation = () => {
  return sendChatMessage.useMutation();
};

export const useStartUnifiedChatMutation = () => {
  return startUnifiedChat.useMutation();
};

export const useContinueUnifiedChatMutation = () => {
  return continueUnifiedChat.useMutation();
};

// =======================
// UTILITY FUNCTIONS
// =======================

function getContextualEndpoint(basePath: string, contextType: ChatContextType): string {
  const contextMap = {
    hotels: `llm/hotels/chat/${basePath}`,
    restaurants: `llm/restaurants/chat/${basePath}`,
    itineraries: `llm/itineraries/chat/${basePath}`,
    general: `llm/prompt-response/chat/${basePath}`,
  };

  return contextMap[contextType];
}

// Domain detection function for client-side routing
export const detectDomain = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hotel') || lowerMessage.includes('accommodation') || lowerMessage.includes('stay')) {
    return 'accommodation';
  }
  
  if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('dining')) {
    return 'dining';
  }
  
  if (lowerMessage.includes('activity') || lowerMessage.includes('activities') || lowerMessage.includes('things to do') || lowerMessage.includes('attractions')) {
    return 'activities';
  }
  
  if (lowerMessage.includes('itinerary') || lowerMessage.includes('plan') || lowerMessage.includes('trip')) {
    return 'itinerary';
  }
  
  return 'general';
};

// Prefetch chat data
export const prefetchChatData = async (profileId?: string) => {
  try {
    await Promise.allSettled([
      getChatSessions.preload(),
      ...(profileId ? [getChatSessions.preload({ limit: 10 })] : []),
    ]);
  } catch (error) {
    console.warn("Failed to prefetch chat data:", error);
  }
};

// =======================
// ROUTE HELPERS
// =======================

// Create chat route with preloading
export const createChatRoute = (path: string) => ({
  path,
  preload: () => prefetchChatData(),
});

// Create chat session route
export const createChatSessionRoute = (path: string) => ({
  path,
  preload: async (params: { sessionId: string }) => {
    await Promise.allSettled([
      getChatSession.preload(params.sessionId),
      getSessionMetrics.preload(params.sessionId),
    ]);
  },
});

// =======================
// BACKWARDS COMPATIBILITY
// =======================

// Export legacy functions for gradual migration
export {
  startChatStream as StartChatStream,
  continueChatStream as ContinueChatStream,
  sendUnifiedChatMessageStream,
} from './llm';