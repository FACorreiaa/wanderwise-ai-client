import { createSignal, createEffect } from 'solid-js';
import { useAuth } from '~/contexts/AuthContext';
import { API_BASE_URL } from '~/lib/api/shared';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface UseChatSessionOptions {
  sessionIdPrefix?: string;
  onStreamingComplete?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useChatSession(options: UseChatSessionOptions = {}) {
  const auth = useAuth();
  const [showChat, setShowChat] = createSignal(false);
  const [chatMessage, setChatMessage] = createSignal('');
  const [chatHistory, setChatHistory] = createSignal<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [streamingData, setStreamingData] = createSignal(null);
  const [sessionId, setSessionId] = createSignal<string | null>(null);

  // Initialize session ID
  createEffect(() => {
    if (!sessionId() && options.sessionIdPrefix) {
      setSessionId(`${options.sessionIdPrefix}-${Date.now()}`);
    }
  });

  const sendChatMessage = async () => {
    const message = chatMessage().trim();
    if (!message || isLoading()) return;

    const profile = auth.profile();
    if (!profile?.id) {
      console.error('No user profile available');
      return;
    }

    setIsLoading(true);
    const userMessage = { role: 'user' as const, content: message, timestamp: new Date().toISOString() };
    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');

    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const endpoint = `/llm/prompt-response/chat/sessions/${profile.id}/continue`;

      console.log('=== CHAT HOOK API CALL ===');
      console.log('Endpoint:', endpoint);
      console.log('Message:', message);
      console.log('Token available:', !!token);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      let assistantMessage = '';
      let currentStreamingData = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              console.log('Received streaming data:', data);

              if (data.type === 'message') {
                assistantMessage += data.content;
                setChatHistory(prev => {
                  const updated = [...prev];
                  const lastMessage = updated[updated.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content = assistantMessage;
                  } else {
                    updated.push({
                      role: 'assistant',
                      content: assistantMessage,
                      timestamp: new Date().toISOString()
                    });
                  }
                  return updated;
                });
              } else if (data.type === 'result') {
                currentStreamingData = data.data;
                setStreamingData(data.data);
                console.log('Received final streaming data:', data.data);
              }
            } catch (parseError) {
              console.error('Error parsing streaming data:', parseError);
            }
          }
        }
      }

      // Store final streaming data in session storage
      if (currentStreamingData) {
        sessionStorage.setItem('completedStreamingSession', JSON.stringify({
          sessionId: sessionId(),
          data: currentStreamingData,
          timestamp: new Date().toISOString()
        }));

        // Call completion callback if provided
        if (options.onStreamingComplete) {
          options.onStreamingComplete(currentStreamingData);
        }
      }

    } catch (error) {
      console.error('Error sending chat message:', error);
      
      const errorMessage = {
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);

      if (options.onError) {
        options.onError(error as Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setStreamingData(null);
    sessionStorage.removeItem('completedStreamingSession');
  };

  const toggleChat = () => {
    setShowChat(prev => !prev);
  };

  return {
    // State
    showChat,
    chatMessage,
    chatHistory,
    isLoading,
    streamingData,
    sessionId,
    
    // Actions
    setShowChat,
    setChatMessage,
    sendChatMessage,
    clearChat,
    toggleChat,
    setStreamingData,
    
    // Derived state
    hasMessages: () => chatHistory().length > 0,
    hasStreamingData: () => !!streamingData(),
  };
}