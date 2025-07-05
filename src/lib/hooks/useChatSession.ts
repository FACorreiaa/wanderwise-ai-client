import { createSignal, batch } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '~/contexts/AuthContext';
import { API_BASE_URL } from '~/lib/api/shared';

export interface ChatMessage {
  type: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
}

export interface UseChatSessionOptions {
  sessionIdPrefix?: string;
  onStreamingComplete?: (data: any) => void;
  onError?: (error: Error) => void;
  onUpdateStart?: () => void;
  onUpdateComplete?: () => void;
  getStreamingData?: () => any;
  setStreamingData?: (data: any) => void;
  mapDisabled?: boolean;
  setMapDisabled?: (disabled: boolean) => void;
  poisUpdateTrigger?: () => void;
  setPoisUpdateTrigger?: (fn: (prev: number) => number) => void;
  enableNavigation?: boolean; // New option to enable URL navigation
  onNavigationData?: (navigation: any) => void; // Callback for navigation data
}

export function useChatSession(options: UseChatSessionOptions = {}) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [showChat, setShowChat] = createSignal(false);
  const [chatMessage, setChatMessage] = createSignal('');
  const [chatHistory, setChatHistory] = createSignal<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [sessionId, setSessionId] = createSignal<string | null>(null);
  const [isUpdatingItinerary, setIsUpdatingItinerary] = createSignal(false);

  const sendChatMessage = async () => {
    if (!chatMessage().trim() || isLoading()) return;

    const currentSessionId = sessionId();
    console.log('🔍 sendChatMessage - Current session ID:', currentSessionId);
    console.log('🔍 sendChatMessage - Session storage:', sessionStorage.getItem('completedStreamingSession'));
    console.log('🔍 sendChatMessage - Streaming data present:', !!options.getStreamingData?.());

    // If no session ID in signal, try to extract from session storage as fallback
    let workingSessionId = currentSessionId;
    if (!workingSessionId) {
      console.log('No session ID in signal, trying session storage fallback...');
      const storedSession = sessionStorage.getItem('completedStreamingSession');
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          workingSessionId = session.sessionId || session.data?.session_id || session.data?.sessionId;
          if (workingSessionId) {
            console.log('✅ Found session ID in storage fallback:', workingSessionId);
            setSessionId(workingSessionId); // Update the signal
          }
        } catch (error) {
          console.error('Error parsing stored session for fallback:', error);
        }
      }
    }

    if (!workingSessionId) {
      console.log('No session ID found after fallback attempts, starting new session...');

      // Check if we have streaming data to work with
      const streaming = options.getStreamingData?.();
      if (streaming && (streaming.general_city_data?.city || streaming.activities || streaming.restaurants)) {
        console.log('Have streaming data, starting new session for chat...');

        // Add a message showing we're starting a new session
        setChatHistory(prev => [...prev, {
          type: 'assistant',
          content: 'Starting a new session to continue your conversation...',
          timestamp: new Date()
        }]);

        // Start new session with the user message
        const userMessage = chatMessage().trim();
        await startNewSession(userMessage);
        return;
      } else {
        // No streaming data available
        setChatHistory(prev => [...prev, {
          type: 'error',
          content: 'No active session found. Please refresh the page to start a new conversation.',
          timestamp: new Date()
        }]);
        return;
      }
    }

    const userMessage = chatMessage().trim();
    setChatMessage('');
    setIsLoading(true);
    setIsUpdatingItinerary(false);

    // Add user message to chat history
    setChatHistory(prev => [...prev, { type: 'user', content: userMessage, timestamp: new Date() }]);

    let eventSource = null;

    try {
      // Create request payload
      const requestPayload = {
        message: userMessage,
        user_location: null // Add user location if available
      };

      // Try to continue the existing session
      console.log('🚀 Making request to continue session:', workingSessionId);
      const response = await fetch(`${API_BASE_URL}/llm/prompt-response/chat/sessions/${workingSessionId}/continue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || ''}`,
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle Server-Sent Events (SSE) streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let assistantMessage = '';
      let isComplete = false;
      let needsNewSession = false;

      try {
        while (!isComplete) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const eventData = JSON.parse(line.slice(6));
                console.log('Received SSE event:', eventData);

                // Handle different event types
                switch (eventData.Type || eventData.type) {
                  case 'start':
                    // Extract session ID from start event when a new session is created
                    const startData = eventData.Data || eventData.data;
                    if (startData && startData.session_id) {
                      console.log('New session started with ID:', startData.session_id);
                      setSessionId(startData.session_id);

                      // Update session storage with new session ID - ensure consistency
                      const storedSession = sessionStorage.getItem('completedStreamingSession');
                      if (storedSession) {
                        try {
                          const session = JSON.parse(storedSession);
                          session.sessionId = startData.session_id;
                          // Also store in data.session_id for consistency
                          if (session.data) {
                            session.data.session_id = startData.session_id;
                            session.data.sessionId = startData.session_id;
                          }
                          sessionStorage.setItem('completedStreamingSession', JSON.stringify(session));
                          console.log('✅ Updated session storage with session ID:', startData.session_id);
                        } catch (error) {
                          console.error('Error updating session storage with new session ID:', error);
                        }
                      } else {
                        // Create a new session storage entry if none exists
                        const newSession = {
                          sessionId: startData.session_id,
                          data: {
                            session_id: startData.session_id,
                            sessionId: startData.session_id
                          }
                        };
                        sessionStorage.setItem('completedStreamingSession', JSON.stringify(newSession));
                        console.log('✅ Created new session storage with session ID:', startData.session_id);
                      }
                    }
                    break;

                  case 'session_validated':
                    console.log('Session validated:', eventData.Data || eventData.data);
                    break;

                  case 'progress':
                    // Show progress updates
                    const progressData = eventData.Data || eventData.data;
                    console.log('Progress:', progressData);

                    // Set updating indicator for POI-related progress
                    if (typeof progressData === 'string' &&
                      (progressData.includes('Adding Point of Interest') ||
                        progressData.includes('extracting_poi_name') ||
                        progressData.includes('generating_poi_data'))) {
                      setIsUpdatingItinerary(true);
                      options.onUpdateStart?.();
                    }
                    break;

                  case 'intent_classified':
                    console.log('Intent classified:', eventData.Data || eventData.data);
                    break;

                  case 'semantic_context_generated':
                    console.log('Semantic context generated:', eventData.Data || eventData.data);
                    break;

                  case 'itinerary':
                    // This is the key event - update the itinerary data
                    const itineraryData = eventData.Data || eventData.data;
                    const message = eventData.Message || eventData.message;

                    console.log('Received itinerary update:', itineraryData);
                    console.log('Itinerary message:', message);

                    if (itineraryData) {
                      // Batch all related updates to prevent multiple re-renders
                      batch(() => {
                        // Temporarily disable map during updates if available
                        if (options.setMapDisabled) {
                          options.setMapDisabled(true);
                        }

                        // Show update indicator
                        setIsUpdatingItinerary(true);
                        options.onUpdateStart?.();

                        // Update the streaming data with new itinerary information
                        if (options.setStreamingData) {
                          options.setStreamingData((prev: any) => {
                            if (!prev) return itineraryData;

                            return {
                              ...prev,
                              // Update general city data if provided
                              ...(itineraryData.general_city_data && {
                                general_city_data: itineraryData.general_city_data
                              }),
                              // Update points of interest if provided
                              ...(itineraryData.points_of_interest && {
                                points_of_interest: itineraryData.points_of_interest
                              }),
                              // Update itinerary response if provided
                              ...(itineraryData.itinerary_response && {
                                itinerary_response: itineraryData.itinerary_response
                              }),
                              // Update activities if provided
                              ...(itineraryData.activities && {
                                activities: itineraryData.activities
                              }),
                              // Update restaurants if provided
                              ...(itineraryData.restaurants && {
                                restaurants: itineraryData.restaurants
                              })
                            };
                          });
                        }

                        // Trigger POI update without causing full re-render
                        if (options.setPoisUpdateTrigger) {
                          options.setPoisUpdateTrigger(prev => prev + 1);
                        }
                      });

                      // Re-enable map after a short delay
                      setTimeout(() => {
                        if (options.setMapDisabled) {
                          options.setMapDisabled(false);
                        }
                        options.onUpdateComplete?.();
                      }, 1000);

                      // Use the message from the server if available
                      if (message) {
                        assistantMessage += message + ' ';
                      } else {
                        assistantMessage += 'Your request has been updated. ';
                      }

                      console.log('Content updated successfully');
                    }
                    break;

                  case 'complete':
                    isComplete = true;
                    const completeMessage = eventData.Message || eventData.message;
                    if (completeMessage && completeMessage !== 'Turn completed.') {
                      assistantMessage += completeMessage;
                    }
                    
                    // Handle navigation data if present
                    const navigationData = eventData.Navigation || eventData.navigation;
                    if (navigationData && options.enableNavigation) {
                      console.log('Received navigation data:', navigationData);
                      
                      if (options.onNavigationData) {
                        options.onNavigationData(navigationData);
                      }
                      
                      // Navigate to the specified URL if present
                      if (navigationData.url || navigationData.URL) {
                        const targetUrl = navigationData.url || navigationData.URL;
                        console.log('Navigating to:', targetUrl);
                        navigate(targetUrl);
                      }
                    }
                    
                    console.log('Streaming complete');
                    break;

                  case 'error':
                    const errorMessage = eventData.Error || eventData.error || 'Unknown error occurred';
                    console.error('🚨 Received error event:', errorMessage);
                    console.log('🔍 Full error event data:', eventData);

                    // Only treat as session error if it's SPECIFICALLY about session not being found
                    // Be very specific to avoid false positives
                    if ((errorMessage.includes('failed to get session') && errorMessage.includes('no rows in result set')) ||
                      (errorMessage.includes('session') && errorMessage.includes('not found') && errorMessage.includes('database'))) {
                      console.log('❌ Confirmed session database error detected, attempting to start new session...');

                      // Set flags to trigger new session creation
                      needsNewSession = true;
                      isComplete = true;
                      assistantMessage += 'Session expired. Starting new session... ';

                      // We'll handle the new session creation after this stream ends
                      // Don't throw error here, let it complete gracefully
                      break;
                    }

                    // For other errors (like POI processing errors), just log them but continue
                    console.log('⚠️  Non-session error, continuing processing:', errorMessage);
                    assistantMessage += `Note: ${errorMessage} `;
                    break;

                  default:
                    // Handle other event types or partial responses
                    if (eventData.Message || eventData.message) {
                      assistantMessage += eventData.Message || eventData.message;
                    }
                    console.log('Unhandled event type:', eventData.Type || eventData.type, eventData);
                    break;
                }
              } catch (parseError) {
                console.warn('Failed to parse SSE data:', line, parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Check if we need to start a new session
      if (needsNewSession) {
        console.log('Starting new session after session not found error...');
        await startNewSession(userMessage);
        return; // Exit early, new session will handle the response
      }

      // Add final assistant response to chat history
      if (assistantMessage.trim()) {
        setChatHistory(prev => [...prev, {
          type: 'assistant',
          content: assistantMessage.trim(),
          timestamp: new Date()
        }]);
      } else {
        // If no specific message, provide a generic success message
        setChatHistory(prev => [...prev, {
          type: 'assistant',
          content: 'Your request has been processed successfully.',
          timestamp: new Date()
        }]);
      }

      // Call completion callback if provided
      if (options.onStreamingComplete) {
        options.onStreamingComplete(options.getStreamingData?.());
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [...prev, {
        type: 'error',
        content: `Sorry, there was an error processing your request: ${error.message}`,
        timestamp: new Date()
      }]);

      if (options.onError) {
        options.onError(error as Error);
      }
    } finally {
      if (eventSource) {
        eventSource.close();
      }
      setIsLoading(false);
      setIsUpdatingItinerary(false);
    }
  };

  // Function to start a new session when the old one is not found
  const startNewSession = async (userMessage: string) => {
    try {
      console.log('Starting new chat session...');

      const streaming = options.getStreamingData?.();
      const cityName = streaming?.general_city_data?.city || 
                       streaming?.activities?.[0]?.city || 
                       streaming?.restaurants?.[0]?.city || 
                       'Unknown';

      // Get user ID from auth context
      const userId = auth.user()?.id;
      if (!userId) {
        throw new Error('User not authenticated - cannot start new session');
      }

      const newSessionPayload = {
        message: `Continue planning for ${cityName}. ${userMessage}`,
        user_location: null
      };

      const response = await fetch(`${API_BASE_URL}/llm/prompt-response/chat/sessions/stream/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || ''}`,
        },
        body: JSON.stringify(newSessionPayload)
      });

      if (!response.ok) {
        throw new Error(`New session failed with status: ${response.status}`);
      }

      console.log('New session started successfully');

      // Process the new session's streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable for new session');
      }

      const decoder = new TextDecoder();
      let newSessionMessage = '';
      let isComplete = false;

      try {
        while (!isComplete) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const eventData = JSON.parse(line.slice(6));
                console.log('New session event:', eventData);

                // Handle events similar to the main function, but focused on key events
                switch (eventData.Type || eventData.type) {
                  case 'start':
                    const startData = eventData.Data || eventData.data;
                    if (startData && startData.session_id) {
                      console.log('New session ID:', startData.session_id);
                      setSessionId(startData.session_id);

                      // Update session storage with consistent data structure
                      const storedSession = sessionStorage.getItem('completedStreamingSession');
                      if (storedSession) {
                        try {
                          const session = JSON.parse(storedSession);
                          session.sessionId = startData.session_id;
                          // Also store in data.session_id for consistency
                          if (session.data) {
                            session.data.session_id = startData.session_id;
                            session.data.sessionId = startData.session_id;
                          }
                          sessionStorage.setItem('completedStreamingSession', JSON.stringify(session));
                          console.log('✅ Updated session storage in new session with ID:', startData.session_id);
                        } catch (error) {
                          console.error('Error updating session storage in new session:', error);
                        }
                      } else {
                        // Create a new session storage entry if none exists
                        const newSession = {
                          sessionId: startData.session_id,
                          data: {
                            session_id: startData.session_id,
                            sessionId: startData.session_id
                          }
                        };
                        sessionStorage.setItem('completedStreamingSession', JSON.stringify(newSession));
                        console.log('✅ Created new session storage in new session with ID:', startData.session_id);
                      }
                    }
                    break;

                  case 'itinerary':
                    const itineraryData = eventData.Data || eventData.data;
                    const message = eventData.Message || eventData.message;

                    if (itineraryData) {
                      if (options.setStreamingData) {
                        options.setStreamingData((prev: any) => ({
                          ...prev,
                          ...(itineraryData.general_city_data && {
                            general_city_data: itineraryData.general_city_data
                          }),
                          ...(itineraryData.points_of_interest && {
                            points_of_interest: itineraryData.points_of_interest
                          }),
                          ...(itineraryData.itinerary_response && {
                            itinerary_response: itineraryData.itinerary_response
                          }),
                          ...(itineraryData.activities && {
                            activities: itineraryData.activities
                          }),
                          ...(itineraryData.restaurants && {
                            restaurants: itineraryData.restaurants
                          })
                        }));
                      }

                      if (message) {
                        newSessionMessage += message + ' ';
                      }
                    }
                    break;

                  case 'complete':
                    isComplete = true;
                    const completeMessage = eventData.Message || eventData.message;
                    if (completeMessage && completeMessage !== 'Turn completed.') {
                      newSessionMessage += completeMessage;
                    }
                    
                    // Handle navigation data if present for new session
                    const navigationData = eventData.Navigation || eventData.navigation;
                    if (navigationData && options.enableNavigation) {
                      console.log('Received navigation data in new session:', navigationData);
                      
                      if (options.onNavigationData) {
                        options.onNavigationData(navigationData);
                      }
                      
                      // Navigate to the specified URL if present
                      if (navigationData.url || navigationData.URL) {
                        const targetUrl = navigationData.url || navigationData.URL;
                        console.log('Navigating to (new session):', targetUrl);
                        navigate(targetUrl);
                      }
                    }
                    break;

                  case 'error':
                    throw new Error(eventData.Error || eventData.error || 'New session error');
                }
              } catch (parseError) {
                console.warn('Failed to parse new session SSE data:', line, parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Add response from new session to chat
      if (newSessionMessage.trim()) {
        setChatHistory(prev => [...prev, {
          type: 'assistant',
          content: `New session started. ${newSessionMessage.trim()}`,
          timestamp: new Date()
        }]);
      } else {
        setChatHistory(prev => [...prev, {
          type: 'assistant',
          content: 'New session started successfully.',
          timestamp: new Date()
        }]);
      }

    } catch (error) {
      console.error('Error starting new session:', error);
      setChatHistory(prev => [...prev, {
        type: 'error',
        content: `Failed to start new session: ${error.message}`,
        timestamp: new Date()
      }]);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    // Clear all session-related storage to prevent data bleed between city searches
    sessionStorage.removeItem('completedStreamingSession');
    sessionStorage.removeItem('currentStreamingSession');
    sessionStorage.removeItem('localChatSessions');
    sessionStorage.removeItem('lastKnownSessionId');
    sessionStorage.removeItem('fallbackSessionId');
    // Reset session ID to force new session creation
    setSessionId("");
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
    sessionId,
    isUpdatingItinerary,
    
    // Actions
    setShowChat,
    setChatMessage,
    sendChatMessage,
    clearChat,
    toggleChat,
    handleKeyPress,
    setSessionId,
    
    // Derived state
    hasMessages: () => chatHistory().length > 0,
  };
}