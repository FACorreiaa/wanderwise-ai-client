// LLM and chat queries and mutations
import { useMutation } from '@tanstack/solid-query';
import { apiRequest, API_BASE_URL } from './shared';
import { defaultLLMRateLimiter, RateLimitError, showRateLimitNotification } from '../rate-limiter';
import type { ChatSession, ChatMessage, ChatSessionResponse, StreamEvent, UnifiedChatResponse, ApiResponse } from './types';

// ==================
// CHAT/LLM TYPES
// ==================

export type ChatContextType = 'hotels' | 'restaurants' | 'itineraries' | 'general';

// Rate-limited fetch function for streaming endpoints
async function rateLimitedFetch(url: string, options: RequestInit, endpoint: string): Promise<Response> {
  // Apply client-side rate limiting for LLM endpoints
  const rateLimitCheck = await defaultLLMRateLimiter.checkRateLimit(endpoint);
  if (!rateLimitCheck.allowed) {
    const retryAfter = rateLimitCheck.retryAfter || 60;
    showRateLimitNotification(retryAfter, endpoint);
    throw new RateLimitError(
      `Rate limit exceeded for ${endpoint}. Retry after ${retryAfter} seconds.`,
      retryAfter,
      endpoint
    );
  }

  const response = await fetch(url, options);

  // Handle server-side rate limiting
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
    showRateLimitNotification(retryAfter, endpoint);
    throw new RateLimitError(
      `Server rate limit exceeded for ${endpoint}. Retry after ${retryAfter} seconds.`,
      retryAfter,
      endpoint
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
      apiRequest<ChatSession>(`/llm/prompt-response/chat/sessions/${profileId}`, { method: 'POST' }),
  }));
};

export const useSendMessageMutation = () => {
  return useMutation(() => ({
    mutationFn: ({ sessionId, message }: { sessionId: string; message: string }) =>
      apiRequest<ChatMessage>(`/llm/prompt-response/chat/sessions/${sessionId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
  }));
};

export const useGetRecommendationsMutation = () => {
  return useMutation(() => ({
    mutationFn: ({ profileId, query }: { profileId: string; query: string }) =>
      apiRequest<UnifiedChatResponse>(`/llm/prompt-response/profile/${profileId}`, {
        method: 'POST',
        body: JSON.stringify({ query }),
      }),
  }));
};

// ==================
// ENHANCED CHAT SERVICES
// ==================

export const StartChat = async (request: StartChatRequest): Promise<ChatSession> => {
  const endpoint = getContextualEndpoint('sessions', request.contextType);

  return apiRequest<ChatSession>(`${endpoint}/${request.profileId}`, {
    method: 'POST',
    body: JSON.stringify({
      context_type: request.contextType,
      city_name: request.cityName,
      initial_message: request.initialMessage,
    }),
  });
};

export const StartChatStream = async (request: StartChatRequest): Promise<Response> => {
  const endpoint = getContextualEndpoint('sessions/stream', request.contextType);
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  const fullEndpoint = `${endpoint}/${request.profileId}`;

  return rateLimitedFetch(`${API_BASE_URL}/${fullEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      context_type: request.contextType,
      city_name: request.cityName,
      initial_message: request.initialMessage,
    }),
  }, fullEndpoint);
};

export const ContinueChat = async (request: ContinueChatRequest): Promise<ChatMessage> => {
  const endpoint = getContextualEndpoint(`sessions/${request.sessionId}/messages`, request.contextType);

  return apiRequest<ChatMessage>(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      message: request.message,
      city_name: request.cityName,
      context_type: request.contextType,
    }),
  });
};

export const ContinueChatStream = async (request: ContinueChatRequest): Promise<Response> => {
  const endpoint = getContextualEndpoint(`sessions/${request.sessionId}/messages/stream`, request.contextType);
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  return rateLimitedFetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      message: request.message,
      city_name: request.cityName,
      context_type: request.contextType,
    }),
  }, endpoint);
};

// ==================
// HELPER FUNCTIONS
// ==================

function getContextualEndpoint(basePath: string, contextType: ChatContextType): string {
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

export interface UnifiedChatStreamRequest extends UnifiedChatRequest { }

// Unified chat service - sends message and gets streaming response
export const sendUnifiedChatMessage = async (request: UnifiedChatRequest): Promise<Response> => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  const endpoint = `/llm/prompt-response/chat/sessions/${request.profileId}`;

  return rateLimitedFetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      message: request.message,
      user_location: request.userLocation,
    }),
  }, endpoint);
};

// Unified chat streaming service
export const sendUnifiedChatMessageStream = async (request: UnifiedChatStreamRequest): Promise<Response> => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  const endpoint = `/llm/prompt-response/chat/sessions/stream/${request.profileId}`;

  console.log('=== STREAMING API CALL ===');
  console.log('Token found:', !!token);
  console.log('Request:', request);

  return rateLimitedFetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      message: request.message,
      user_location: request.userLocation,
    }),
  }, endpoint);
};

// Domain detection utility (client-side)
export const detectDomain = (message: string): import('./types').DomainType => {
  const lowerMessage = message.toLowerCase();

  // Accommodation domain keywords
  if (/hotel|hostel|accommodation|stay|sleep|room|booking|airbnb|lodge|resort|guesthouse/.test(lowerMessage)) {
    return 'accommodation';
  }

  // Dining domain keywords
  if (/restaurant|food|eat|dine|meal|cuisine|drink|cafe|bar|lunch|dinner|breakfast|brunch/.test(lowerMessage)) {
    return 'dining';
  }

  // Activity domain keywords
  if (/activity|museum|park|attraction|tour|visit|see|do|experience|adventure|shopping|nightlife/.test(lowerMessage)) {
    return 'activities';
  }

  // Itinerary domain keywords
  if (/itinerary|plan|schedule|trip|day|week|journey|route|organize|arrange/.test(lowerMessage)) {
    return 'itinerary';
  }

  // Default to general domain
  return 'general';
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
}

// Get chat sessions for a user
export const getUserChatSessions = async (profileId: string): Promise<ChatSessionSummary[]> => {
  try {
    const response = await apiRequest<ChatSessionResponse[]>(`/llm/prompt-response/chat/sessions/user/${profileId}`, {
      method: 'GET',
    });

    // Transform the response to our expected format
    return response.map((session: ChatSessionResponse) => ({
      id: session.id,
      title: generateSessionTitle(session.conversation_history, session.city_name),
      preview: generatePreview(session.conversation_history),
      timestamp: session.updated_at || session.created_at,
      messageCount: session.conversation_history?.length || 0,
      hasItinerary: hasItineraryInMessages(session.conversation_history),
      lastMessage: getLastMessage(session.conversation_history),
      cityName: session.city_name
    }));
  } catch (error) {
    console.warn('Chat sessions endpoint not available, returning empty array');
    // Return empty array when backend endpoint is not available
    return [];
  }
};

// Helper function to generate session title from conversation
const generateSessionTitle = (conversationHistory: ChatMessage[], cityName?: string): string => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return cityName ? `Trip to ${cityName}` : 'New Conversation';
  }

  // Look for first user message (role can be 'user' or type can be 'user')
  const firstUserMessage = conversationHistory.find(msg => msg.role === 'user' || msg.type === 'user');
  if (firstUserMessage) {
    const content = firstUserMessage.content || '';
    
    // Try to detect the intent from the message content
    const lowerContent = content.toLowerCase();
    
    // Check for specific intents and create meaningful titles
    if (lowerContent.includes('hotel') || lowerContent.includes('accommodation')) {
      return cityName ? `Hotels in ${cityName}` : 'Hotel Search';
    }
    if (lowerContent.includes('restaurant') || lowerContent.includes('food') || lowerContent.includes('eat')) {
      return cityName ? `Dining in ${cityName}` : 'Restaurant Search';
    }
    if (lowerContent.includes('activity') || lowerContent.includes('visit') || lowerContent.includes('see')) {
      return cityName ? `Activities in ${cityName}` : 'Activity Search';
    }
    if (lowerContent.includes('itinerary') || lowerContent.includes('plan') || lowerContent.includes('trip')) {
      return cityName ? `${cityName} Itinerary` : 'Trip Planning';
    }
    
    // Fallback: Use first meaningful words + city
    const words = content.split(' ').filter(word => word.length > 2).slice(0, 3);
    const baseTitle = words.join(' ');
    
    if (cityName && !baseTitle.toLowerCase().includes(cityName.toLowerCase())) {
      return `${baseTitle} - ${cityName}`;
    }
    
    return baseTitle || (cityName ? `Trip to ${cityName}` : 'Chat Session');
  }

  return cityName ? `Trip to ${cityName}` : 'Chat Session';
};

// Helper function to generate preview from conversation
const generatePreview = (conversationHistory: ChatMessage[]): string => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return 'Start a new conversation...';
  }

  // Get the last assistant message for preview
  const lastAssistantMessage = [...conversationHistory].reverse().find(msg => msg.role === 'assistant' || msg.type === 'assistant');
  if (lastAssistantMessage) {
    const content = lastAssistantMessage.content || '';
    return content.length > 60 ? content.substring(0, 60) + '...' : content;
  }

  // Fallback to last message
  const lastMessage = conversationHistory[conversationHistory.length - 1];
  if (lastMessage) {
    const content = lastMessage.content || '';
    return content.length > 60 ? content.substring(0, 60) + '...' : content;
  }

  return 'Continue conversation...';
};

// Helper function to get last message
const getLastMessage = (conversationHistory: ChatMessage[]): string => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return '';
  }

  const lastMessage = conversationHistory[conversationHistory.length - 1];
  return lastMessage?.content || '';
};

// Helper function to check if conversation contains itinerary content
const hasItineraryInMessages = (conversationHistory: ChatMessage[]): boolean => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return false;
  }

  // Look for itinerary-related keywords in assistant messages
  const itineraryKeywords = ['itinerary', 'recommendations', 'places to visit', 'day 1', 'day 2', 'restaurants', 'hotels', 'activities'];

  return conversationHistory.some((message: ChatMessage) => {
    if (message.role === 'assistant' && message.content) {
      const content = message.content.toLowerCase();
      return itineraryKeywords.some(keyword => content.includes(keyword));
    }
    return false;
  });
};


// Query hook for getting chat sessions
export const useGetChatSessionsQuery = (profileId: string | undefined) => {
  return {
    queryKey: ['chatSessions', profileId],
    queryFn: () => {
      if (!profileId) {
        return Promise.resolve([]);
      }
      return getUserChatSessions(profileId);
    },
    enabled: !!profileId,
  };
};