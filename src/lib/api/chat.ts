import { useQuery } from "@tanstack/solid-query";
import { apiRequest } from "./shared";
import type { 
  ChatSessionsResponse, 
  ChatSessionResponse,
  ChatSessionSummary,
  SessionPerformanceMetrics,
  SessionContentMetrics,
  SessionEngagementMetrics,
  ChatMessage 
} from "./types";

export const queryKeys = {
  all: ["chatSessions"] as const,
  lists: () => [...queryKeys.all, "list"] as const,
  list: (profileId: string, page: number, limit: number) =>
    [...queryKeys.lists(), { profileId, page, limit }] as const,
};

// Transformation functions (imported from llm.ts logic)
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

  // Look for first user message
  const firstUserMessage = conversationHistory.find(
    (msg) => msg.role === "user" || msg.type === "user",
  );
  if (firstUserMessage) {
    const content = firstUserMessage.content || "";
    const lowerContent = content.toLowerCase();

    // Check for specific intents and create meaningful titles
    if (lowerContent.includes("hotel") || lowerContent.includes("accommodation")) {
      return cityName ? `Hotels in ${cityName}` : "Hotel Search";
    }
    if (lowerContent.includes("restaurant") || lowerContent.includes("food") || lowerContent.includes("eat")) {
      return cityName ? `Dining in ${cityName}` : "Restaurant Search";
    }
    if (lowerContent.includes("activity") || lowerContent.includes("visit") || lowerContent.includes("see")) {
      return cityName ? `Activities in ${cityName}` : "Activity Search";
    }
    if (lowerContent.includes("itinerary") || lowerContent.includes("plan") || lowerContent.includes("trip")) {
      return cityName ? `${cityName} Itinerary` : "Trip Planning";
    }

    // Fallback: Use first meaningful words + city
    const words = content.split(" ").filter((word) => word.length > 2).slice(0, 3);
    const baseTitle = words.join(" ");

    if (cityName && !baseTitle.toLowerCase().includes(cityName.toLowerCase())) {
      return `${baseTitle} - ${cityName}`;
    }

    return baseTitle || (cityName ? `Trip to ${cityName}` : "Chat Session");
  }

  return cityName ? `Trip to ${cityName}` : "Chat Session";
};

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

const getLastMessage = (conversationHistory: ChatMessage[]): string => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return "";
  }

  const lastMessage = conversationHistory[conversationHistory.length - 1];
  return lastMessage?.content || "";
};

const hasItineraryInMessages = (conversationHistory: ChatMessage[]): boolean => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return false;
  }

  const itineraryKeywords = [
    "itinerary", "recommendations", "places to visit", "day 1", "day 2",
    "restaurants", "hotels", "activities",
  ];

  return conversationHistory.some((message: ChatMessage) => {
    if (message.role === "assistant" && message.content) {
      const content = message.content.toLowerCase();
      return itineraryKeywords.some((keyword) => content.includes(keyword));
    }
    return false;
  });
};

// Paginated response type for transformed chat sessions
export interface ChatSessionSummaryResponse {
  sessions: ChatSessionSummary[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// Fetcher function for paginated chat sessions
const fetchChatSessions = async (
  profileId: string,
  page: number,
  limit: number,
): Promise<ChatSessionSummaryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const url = `/llm/prompt-response/chat/sessions/user/${profileId}?${params.toString()}`;
  
  try {
    console.log("🔍 Fetching paginated chat sessions for profile:", profileId, { page, limit });
    
    const response = await apiRequest<ChatSessionsResponse>(url);

    console.log("✅ Successfully fetched paginated chat sessions:", {
      sessions: response.sessions?.length || 0,
      total: response.total,
      page: response.page,
      limit: response.limit,
      hasMore: response.has_more,
    });

    // Transform the sessions to our expected format
    const transformedSessions: ChatSessionSummary[] = response.sessions.map((session: ChatSessionResponse) => ({
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

    // Return empty paginated response when backend endpoint has issues
    return {
      sessions: [],
      total: 0,
      page: 1,
      limit: 10,
      has_more: false,
    };
  }
};

// Hook for paginated chat sessions - accepts signals for reactivity
export const useChatSessions = (
  profileId: () => string | undefined,
  page: () => number = () => 1,
  limit: () => number = () => 10,
) => {
  const queryResult = useQuery(() => ({
    queryKey: queryKeys.list(profileId() || "", page(), limit()),
    queryFn: () => {
      if (!profileId()) {
        return Promise.resolve({
          sessions: [],
          total: 0,
          page: 1,
          limit: 10,
          has_more: false,
        } as ChatSessionSummaryResponse);
      }
      return fetchChatSessions(profileId()!, page(), limit());
    },
    enabled: !!profileId(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Excellent choice for pagination UX
  }));

  return queryResult;
};

// Direct function to get chat sessions (for compatibility)
export const getUserChatSessions = async (
  profileId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ChatSessionSummaryResponse> => {
  return fetchChatSessions(profileId, page, limit);
};