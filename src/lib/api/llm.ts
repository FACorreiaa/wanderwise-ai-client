// LLM and chat queries and mutations
import { useMutation } from '@tanstack/solid-query';
import { apiRequest, API_BASE_URL } from './shared';
import type { ChatSession, ChatMessage } from './types';

// ==================
// CHAT/LLM TYPES
// ==================

export type ChatContextType = 'hotels' | 'restaurants' | 'itineraries' | 'general';

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
      apiRequest<any>(`/llm/prompt-response/profile/${profileId}`, {
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

  return fetch(`${API_BASE_URL}/${endpoint}/${request.profileId}`, {
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
  });
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

  return fetch(`${API_BASE_URL}/${endpoint}`, {
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
  });
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

  return fetch(`${API_BASE_URL}/llm/prompt-response/chat/sessions/${request.profileId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      message: request.message,
      user_location: request.userLocation,
    }),
  });
};

// Unified chat streaming service
export const sendUnifiedChatMessageStream = async (request: UnifiedChatStreamRequest): Promise<Response> => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  console.log('=== STREAMING API CALL ===');
  console.log('Token found:', !!token);
  console.log('Request:', request);

  return fetch(`${API_BASE_URL}/llm/prompt-response/chat/sessions/stream/${request.profileId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      message: request.message,
      user_location: request.userLocation,
    }),
  });
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
}

// Get chat sessions for a user
export const getUserChatSessions = async (profileId: string): Promise<ChatSessionSummary[]> => {
  try {
    const response = await apiRequest<any[]>(`/llm/prompt-response/chat/sessions/user/${profileId}`, {
      method: 'GET',
    });
    
    // Transform the response to our expected format
    return response.map((session: any) => ({
      id: session.id,
      title: session.title || generateSessionTitle(session.conversation_history),
      preview: session.preview || generatePreview(session.conversation_history),
      timestamp: session.updated_at || session.created_at,
      messageCount: session.conversation_history?.length || 0,
      hasItinerary: session.current_itinerary ? true : false,
      lastMessage: getLastMessage(session.conversation_history)
    }));
  } catch (error) {
    console.warn('Chat sessions endpoint not available yet, using mock data');
    // Return mock data for now until backend endpoint is implemented
    return getMockChatSessions();
  }
};

// Helper function to generate session title from conversation
const generateSessionTitle = (conversationHistory: any[]): string => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return 'New Conversation';
  }
  
  const firstUserMessage = conversationHistory.find(msg => msg.type === 'user');
  if (firstUserMessage) {
    const content = firstUserMessage.content || '';
    // Extract location or main topic
    const words = content.split(' ').slice(0, 4);
    return words.join(' ') + (content.split(' ').length > 4 ? '...' : '');
  }
  
  return 'Chat Session';
};

// Helper function to generate preview from conversation
const generatePreview = (conversationHistory: any[]): string => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return 'Start a new conversation...';
  }
  
  const lastMessage = conversationHistory[conversationHistory.length - 1];
  if (lastMessage) {
    const content = lastMessage.content || '';
    return content.length > 60 ? content.substring(0, 60) + '...' : content;
  }
  
  return 'Continue conversation...';
};

// Helper function to get last message
const getLastMessage = (conversationHistory: any[]): string => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return '';
  }
  
  const lastMessage = conversationHistory[conversationHistory.length - 1];
  return lastMessage?.content || '';
};

// Mock data for development - will be removed once backend endpoint is ready
const getMockChatSessions = (): ChatSessionSummary[] => {
  return [
    {
      id: 'session-1',
      title: 'Porto Weekend Trip',
      preview: 'Looking for hidden gems in Porto...',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      messageCount: 8,
      hasItinerary: true,
      lastMessage: 'Great! I found some amazing recommendations for Porto.'
    },
    {
      id: 'session-2',
      title: 'Family Trip to London',
      preview: 'Planning activities for kids...',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      messageCount: 12,
      hasItinerary: true,
      lastMessage: 'Here are some family-friendly activities in London.'
    },
    {
      id: 'session-3',
      title: 'Food Tour Barcelona',
      preview: 'Best tapas restaurants...',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      messageCount: 6,
      hasItinerary: false,
      lastMessage: 'I recommend these authentic tapas places.'
    }
  ];
};

// Query hook for getting chat sessions
export const useGetChatSessionsQuery = (profileId: string) => {
  return {
    queryKey: ['chatSessions', profileId],
    queryFn: () => getUserChatSessions(profileId),
    enabled: !!profileId,
  };
};