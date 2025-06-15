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
    credentials: 'include',
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
    credentials: 'include',
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