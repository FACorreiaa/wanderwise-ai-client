// LLM and chat queries and mutations
import { useMutation } from "@tanstack/solid-query";
import { apiRequest, API_BASE_URL } from "./shared";
import {
  defaultLLMRateLimiter,
  RateLimitError,
  showRateLimitNotification,
} from "../rate-limiter";
//import { createGraphQLClient, gql } from '@solid-primitives/graphql';
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

// ==================
// CHAT/LLM TYPES
// ==================

export type ChatContextType =
  | "hotels"
  | "restaurants"
  | "itineraries"
  | "general";

// Rate-limited fetch function for streaming endpoints
async function rateLimitedFetch(
  url: string,
  options: RequestInit,
  endpoint: string,
): Promise<Response> {
  // Apply client-side rate limiting for LLM endpoints
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

  const response = await fetch(url, options);

  // Handle server-side rate limiting
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
}

export interface StartChatRequest {
  profileId: string;
  contextType: ChatContextType;
  cityName?: string;
  initialMessage?: string;
}

export interface ContinueChatRequest {
  sessionId: string;
  message: string;
  cityName?: string;
  contextType: ChatContextType;
}

// ==================
// CHAT/LLM QUERIES
// ==================

export const useCreateChatSessionMutation = () => {
  return useMutation(() => ({
    mutationFn: (profileId: string) =>
      apiRequest<ChatSession>(
        `/llm/prompt-response/chat/sessions/${profileId}`,
        { method: "POST" },
      ),
  }));
};

export const useSendMessageMutation = () => {
  return useMutation(() => ({
    mutationFn: ({
      sessionId,
      message,
    }: {
      sessionId: string;
      message: string;
    }) =>
      apiRequest<ChatMessage>(
        `/llm/prompt-response/chat/sessions/${sessionId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ message }),
        },
      ),
  }));
};

export const useGetRecommendationsMutation = () => {
  return useMutation(() => ({
    mutationFn: ({ profileId, query }: { profileId: string; query: string }) =>
      apiRequest<UnifiedChatResponse>(
        `/llm/prompt-response/profile/${profileId}`,
        {
          method: "POST",
          body: JSON.stringify({ query }),
        },
      ),
  }));
};

// ==================
// ENHANCED CHAT SERVICES
// ==================

export const StartChat = async (
  request: StartChatRequest,
): Promise<ChatSession> => {
  const endpoint = getContextualEndpoint("sessions", request.contextType);

  return apiRequest<ChatSession>(`${endpoint}/${request.profileId}`, {
    method: "POST",
    body: JSON.stringify({
      context_type: request.contextType,
      city_name: request.cityName,
      initial_message: request.initialMessage,
    }),
  });
};

export const StartChatStream = async (
  request: StartChatRequest,
): Promise<Response> => {
  const endpoint = getContextualEndpoint(
    "sessions/stream",
    request.contextType,
  );
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  const fullEndpoint = `${endpoint}/${request.profileId}`;

  return rateLimitedFetch(
    `${API_BASE_URL}/${fullEndpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        context_type: request.contextType,
        city_name: request.cityName,
        initial_message: request.initialMessage,
      }),
    },
    fullEndpoint,
  );
};

export const ContinueChat = async (
  request: ContinueChatRequest,
): Promise<ChatMessage> => {
  const endpoint = getContextualEndpoint(
    `sessions/${request.sessionId}/messages`,
    request.contextType,
  );

  return apiRequest<ChatMessage>(endpoint, {
    method: "POST",
    body: JSON.stringify({
      message: request.message,
      city_name: request.cityName,
      context_type: request.contextType,
    }),
  });
};

export const ContinueChatStream = async (
  request: ContinueChatRequest,
): Promise<Response> => {
  const endpoint = getContextualEndpoint(
    `sessions/${request.sessionId}/messages/stream`,
    request.contextType,
  );
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  return rateLimitedFetch(
    `${API_BASE_URL}/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        message: request.message,
        city_name: request.cityName,
        context_type: request.contextType,
      }),
    },
    endpoint,
  );
};

// ==================
// HELPER FUNCTIONS
// ==================

function getContextualEndpoint(
  basePath: string,
  contextType: ChatContextType,
): string {
  const contextMap = {
    hotels: `/llm/hotels/chat/${basePath}`,
    restaurants: `/llm/restaurants/chat/${basePath}`,
    itineraries: `/llm/itineraries/chat/${basePath}`,
    general: `/llm/prompt-response/chat/${basePath}`,
  };

  return contextMap[contextType];
}

// ==================
// MUTATION HOOKS FOR ENHANCED SERVICES
// ==================

export const useStartChatMutation = () => {
  return useMutation(() => ({
    mutationFn: StartChat,
  }));
};

export const useContinueChatMutation = () => {
  return useMutation(() => ({
    mutationFn: ContinueChat,
  }));
};

// ==================
// UNIFIED STREAMING CHAT
// ==================

export interface UnifiedChatRequest {
  profileId: string;
  message: string;
  userLocation?: {
    userLat: number;
    userLon: number;
  };
}

export interface UnifiedChatStreamRequest extends UnifiedChatRequest {}

// Unified chat service - sends message and gets streaming response
export const sendUnifiedChatMessage = async (
  request: UnifiedChatRequest,
): Promise<Response> => {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  const endpoint = `/llm/prompt-response/chat/sessions/${request.profileId}`;

  return rateLimitedFetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        message: request.message,
        user_location: request.userLocation,
      }),
    },
    endpoint,
  );
};

// Unified chat streaming service
export const sendUnifiedChatMessageStream = async (
  request: UnifiedChatStreamRequest,
): Promise<Response> => {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  const endpoint = `/llm/prompt-response/chat/sessions/stream/${request.profileId}`;

  console.log("=== STREAMING API CALL ===");
  console.log("Token found:", !!token);
  console.log("Request:", request);

  return rateLimitedFetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        message: request.message,
        user_location: request.userLocation,
      }),
    },
    endpoint,
  );
};

export const sendUnifiedChatMessageStreamFree = async (
  request: UnifiedChatStreamRequest,
): Promise<Response> => {
  //const token =
  //  localStorage.getItem("access_token") ||
  //  sessionStorage.getItem("access_token");
  const endpoint = `/llm/chat/stream/free`;

  console.log("=== STREAMING API CALL ===");
  //console.log("Token found:", !!token);
  console.log("Request:", request);

  return rateLimitedFetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        message: request.message,
        user_location: request.userLocation,
      }),
    },
    endpoint,
  );
};

// GraphQL alternative to streaming service
// const PROCESS_UNIFIED_CHAT_MESSAGE = gql`
//   mutation ProcessUnifiedChatMessage($profileId: String!, $input: ChatMessageInput!) {
//     processUnifiedChatMessage(profileId: $profileId, input: $input) {
//       sessionId
//       success
//       error
//       events {
//         type
//         message
//         data
//         error
//         timestamp
//         eventId
//         isFinal
//         navigation {
//           url
//           routeType
//           queryParams
//         }
//       }
//     }
//   }
// `;

// Create GraphQL client instance
// const createAuthenticatedGraphQLClient = () => {
//   const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

//   return createGraphQLClient(`${API_BASE_URL}/graphql`, {
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }),
//     },
//   });
// };

// export const sendUnifiedChatMessageGraphQL = async (request: UnifiedChatStreamRequest): Promise<any> => {
//   console.log('=== GRAPHQL API CALL ===');
//   console.log('Request:', request);

//   const client = createAuthenticatedGraphQLClient();

//   try {
//     const result = await client(PROCESS_UNIFIED_CHAT_MESSAGE, {
//       profileId: request.profileId,
//       input: {
//         message: request.message,
//         userLocation: request.userLocation,
//       },
//     });

//     console.log('=== GRAPHQL RESPONSE ===');
//     console.log('Result:', result);
//     console.log('Result structure:', Object.keys(result || {}));

//     // Extract navigation data from events for redirect
//     const processResult = result?.data?.processUnifiedChatMessage;
//     console.log('processUnifiedChatMessage:', processResult);

//     const events = processResult?.events || [];
//     console.log('GraphQL Events count:', events.length);
//     console.log('First few events:', events.slice(0, 3));
//     console.log('Last few events:', events.slice(-3));

//     // Find navigation data in the complete event
//     const navigationEvent = events.find((event: any) => event.navigation && event.navigation.url);
//     if (navigationEvent) {
//       console.log('🧭 GraphQL Navigation found:', navigationEvent.navigation);

//       // Add navigation data to result for easy access
//       result.navigationData = navigationEvent.navigation;
//       console.log('✅ Navigation data added to result:', result.navigationData);
//     } else {
//       console.log('❌ No navigation event found');
//       // Debug: check if any events have navigation
//       const eventsWithNav = events.filter((event: any) => event.navigation);
//       console.log('Events with navigation field:', eventsWithNav);

//       // Additional debugging - check if result structure is different
//       console.log('Full result keys:', Object.keys(result || {}));
//       console.log('Result.data keys:', Object.keys(result?.data || {}));
//     }

//     return result;
//   } catch (error) {
//     console.error('GraphQL Error:', error);
//     throw error;
//   }
// };

// Domain detection utility (client-side)
export const detectDomain = (message: string): import("./types").DomainType => {
  const lowerMessage = message.toLowerCase();

  // Accommodation domain keywords
  if (
    /hotel|hostel|accommodation|stay|sleep|room|booking|airbnb|lodge|resort|guesthouse/.test(
      lowerMessage,
    )
  ) {
    return "accommodation";
  }

  // Dining domain keywords
  if (
    /restaurant|food|eat|dine|meal|cuisine|drink|cafe|bar|lunch|dinner|breakfast|brunch/.test(
      lowerMessage,
    )
  ) {
    return "dining";
  }

  // Activity domain keywords
  if (
    /activity|museum|park|attraction|tour|visit|see|do|experience|adventure|shopping|nightlife/.test(
      lowerMessage,
    )
  ) {
    return "activities";
  }

  // Itinerary domain keywords
  if (
    /itinerary|plan|schedule|trip|day|week|journey|route|organize|arrange/.test(
      lowerMessage,
    )
  ) {
    return "itinerary";
  }

  // Default to general domain
  return "general";
};

// ==================
// MUTATION HOOKS FOR UNIFIED CHAT
// ==================

export const useUnifiedChatMutation = () => {
  return useMutation(() => ({
    mutationFn: sendUnifiedChatMessage,
  }));
};

// ==================
// CHAT SESSIONS RETRIEVAL
// ==================

export interface ChatSessionSummary {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messageCount: number;
  hasItinerary: boolean;
  lastMessage?: string;
  cityName?: string;
  performanceMetrics?: SessionPerformanceMetrics;
  contentMetrics?: SessionContentMetrics;
  engagementMetrics?: SessionEngagementMetrics;
  // Include full conversation data for loading sessions
  conversationHistory?: ChatMessage[];
  created_at?: string;
  updated_at?: string;
}

// Paginated response type for transformed chat sessions
export interface ChatSessionSummaryResponse {
  sessions: ChatSessionSummary[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// Get paginated chat sessions for a user
export const getUserChatSessions = async (
  profileId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ChatSessionSummaryResponse> => {
  try {
    console.log("🔍 Fetching paginated chat sessions for profile:", profileId, { page, limit });
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await apiRequest<ChatSessionsResponse>(
      `/llm/prompt-response/chat/sessions/user/${profileId}?${params.toString()}`,
      {
        method: "GET",
      },
    );

    console.log(
      "✅ Successfully fetched paginated chat sessions:",
      {
        sessions: response.sessions?.length || 0,
        total: response.total,
        page: response.page,
        limit: response.limit,
        hasMore: response.has_more,
      }
    );

    // Transform the sessions to our expected format
    const transformedSessions = response.sessions.map((session: ChatSessionResponse) => ({
      id: session.id,
      title: generateSessionTitle(
        session.conversation_history,
        session.city_name,
        session.content_metrics,
      ),
      preview: generatePreview(session.conversation_history),
      timestamp: session.updated_at || session.created_at,
      messageCount: session.conversation_history?.length || 0,
      hasItinerary:
        session.content_metrics?.has_itinerary ||
        hasItineraryInMessages(session.conversation_history),
      lastMessage: getLastMessage(session.conversation_history),
      cityName: session.city_name,
      performanceMetrics: session.performance_metrics,
      contentMetrics: session.content_metrics,
      engagementMetrics: session.engagement_metrics,
      // Include the conversation history for session loading
      conversationHistory: session.conversation_history,
      created_at: session.created_at,
      updated_at: session.updated_at,
    }));

    return {
      sessions: transformedSessions,
      total: response.total,
      page: response.page,
      limit: response.limit,
      has_more: response.has_more,
    };
  } catch (error) {
    console.error("❌ Failed to fetch chat sessions:", error);

    // Check if it's the specific SQL error
    if (
      error?.message?.includes("COALESCE types uuid and text cannot be matched")
    ) {
      console.warn(
        "🔧 Database type mismatch error detected - backend needs to fix COALESCE query",
      );
    }

    // Return empty paginated response when backend endpoint has issues
    // This allows the chat to still work even if history loading fails
    return {
      sessions: [],
      total: 0,
      page: 1,
      limit: 10,
      has_more: false,
    };
  }
};

// Helper function to generate session title from conversation
const generateSessionTitle = (
  conversationHistory: ChatMessage[],
  cityName?: string,
  contentMetrics?: SessionContentMetrics,
): string => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return cityName ? `Trip to ${cityName}` : "New Conversation";
  }

  // Use content metrics for smarter title generation
  if (contentMetrics) {
    const {
      dominant_categories,
      complexity_score,
      total_pois,
      total_hotels,
      total_restaurants,
    } = contentMetrics;

    // Generate title based on dominant categories
    if (dominant_categories.length > 0) {
      const primaryCategory = dominant_categories[0];
      const categoryNames = {
        accommodation: "Hotels",
        dining: "Restaurants",
        attractions: "Attractions",
        itinerary: "Itinerary Planning",
      };

      const categoryName =
        categoryNames[primaryCategory as keyof typeof categoryNames] ||
        "Recommendations";
      const cityPart = cityName ? ` in ${cityName}` : "";

      // Add complexity indicator for rich sessions
      if (complexity_score >= 8) {
        return `Complete ${categoryName}${cityPart}`;
      } else if (complexity_score >= 6) {
        return `${categoryName} Guide${cityPart}`;
      } else {
        return `${categoryName}${cityPart}`;
      }
    }
  }

  // Look for first user message (role can be 'user' or type can be 'user')
  const firstUserMessage = conversationHistory.find(
    (msg) => msg.role === "user" || msg.type === "user",
  );
  if (firstUserMessage) {
    const content = firstUserMessage.content || "";

    // Try to detect the intent from the message content
    const lowerContent = content.toLowerCase();

    // Check for specific intents and create meaningful titles
    if (
      lowerContent.includes("hotel") ||
      lowerContent.includes("accommodation")
    ) {
      return cityName ? `Hotels in ${cityName}` : "Hotel Search";
    }
    if (
      lowerContent.includes("restaurant") ||
      lowerContent.includes("food") ||
      lowerContent.includes("eat")
    ) {
      return cityName ? `Dining in ${cityName}` : "Restaurant Search";
    }
    if (
      lowerContent.includes("activity") ||
      lowerContent.includes("visit") ||
      lowerContent.includes("see")
    ) {
      return cityName ? `Activities in ${cityName}` : "Activity Search";
    }
    if (
      lowerContent.includes("itinerary") ||
      lowerContent.includes("plan") ||
      lowerContent.includes("trip")
    ) {
      return cityName ? `${cityName} Itinerary` : "Trip Planning";
    }

    // Fallback: Use first meaningful words + city
    const words = content
      .split(" ")
      .filter((word) => word.length > 2)
      .slice(0, 3);
    const baseTitle = words.join(" ");

    if (cityName && !baseTitle.toLowerCase().includes(cityName.toLowerCase())) {
      return `${baseTitle} - ${cityName}`;
    }

    return baseTitle || (cityName ? `Trip to ${cityName}` : "Chat Session");
  }

  return cityName ? `Trip to ${cityName}` : "Chat Session";
};

// Helper function to generate preview from conversation
const generatePreview = (conversationHistory: ChatMessage[]): string => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return "Start a new conversation...";
  }

  // Get the last assistant message for preview
  const lastAssistantMessage = [...conversationHistory]
    .reverse()
    .find((msg) => msg.role === "assistant" || msg.type === "assistant");
  if (lastAssistantMessage) {
    const content = lastAssistantMessage.content || "";
    return content.length > 60 ? content.substring(0, 60) + "..." : content;
  }

  // Fallback to last message
  const lastMessage = conversationHistory[conversationHistory.length - 1];
  if (lastMessage) {
    const content = lastMessage.content || "";
    return content.length > 60 ? content.substring(0, 60) + "..." : content;
  }

  return "Continue conversation...";
};

// Helper function to get last message
const getLastMessage = (conversationHistory: ChatMessage[]): string => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return "";
  }

  const lastMessage = conversationHistory[conversationHistory.length - 1];
  return lastMessage?.content || "";
};

// Helper function to check if conversation contains itinerary content
const hasItineraryInMessages = (
  conversationHistory: ChatMessage[],
): boolean => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return false;
  }

  // Look for itinerary-related keywords in assistant messages
  const itineraryKeywords = [
    "itinerary",
    "recommendations",
    "places to visit",
    "day 1",
    "day 2",
    "restaurants",
    "hotels",
    "activities",
  ];

  return conversationHistory.some((message: ChatMessage) => {
    if (message.role === "assistant" && message.content) {
      const content = message.content.toLowerCase();
      return itineraryKeywords.some((keyword) => content.includes(keyword));
    }
    return false;
  });
};

// Query hook for getting paginated chat sessions
export const useGetChatSessionsQuery = (
  profileId: string | undefined,
  page: number = 1,
  limit: number = 10
) => {
  return {
    queryKey: ["chatSessions", profileId, page, limit],
    queryFn: () => {
      if (!profileId) {
        return Promise.resolve({
          sessions: [],
          total: 0,
          page: 1,
          limit: 10,
          has_more: false,
        } as ChatSessionSummaryResponse);
      }
      return getUserChatSessions(profileId, page, limit);
    },
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Excellent for pagination UX
  };
};
