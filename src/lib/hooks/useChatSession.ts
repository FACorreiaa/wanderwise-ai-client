import { createSignal, batch } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '~/contexts/AuthContext';
import { ContinueChatStream, detectDomain, domainToContextType, sendUnifiedChatMessageStream } from '~/lib/api/llm';
import {
  setStreamingSession,
  updateStreamingData,
  markStreamingComplete,
  clearStreamingSession,
} from '~/lib/streaming-state';
import type { POIDetailedInfo } from '../api/types';

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

// Derive domain-specific lists from mixed POI payloads so Hotels/Restaurants/Activities pages can render them
const deriveDomainLists = (data: any) => {
  const points: POIDetailedInfo[] = [
    ...(data?.points_of_interest || data?.pointsOfInterest || []),
    ...(data?.itinerary_response?.points_of_interest || data?.itineraryResponse?.pointsOfInterest || []),
  ].filter(Boolean);

  const isHotel = (poi: POIDetailedInfo) => {
    const cat = (poi.category || '').toLowerCase();
    return (
      cat.includes('hotel') ||
      cat.includes('hostel') ||
      cat.includes('lodg') || // lodge/lodging
      cat.includes('resort') ||
      cat.includes('bnb') ||
      cat.includes('inn') ||
      cat.includes('accommodation') ||
      cat.includes('guesthouse') ||
      cat.includes('guest house') ||
      cat.includes('stay') ||
      cat.includes('sleep') ||
      cat.includes('room') ||
      cat.includes('booking') ||
      cat.includes('bookings')
    );
  };

  const isRestaurant = (poi: POIDetailedInfo) =>
    (poi.category || '').toLowerCase().includes('restaurant') ||
    Boolean((poi as any).cuisine_type || (poi as any).cuisineType);

  const hotels = points.filter(isHotel);
  const restaurants = points.filter(isRestaurant);
  const activities = points.filter((poi) => !isHotel(poi) && !isRestaurant(poi));

  return { hotels, restaurants, activities };
};

const mergeUniqueById = (prev: any[] = [], next: any[] = []) => {
  const map = new Map<string, any>();
  const keyFor = (item: any) => {
    const placeholderId = item?.id === '00000000-0000-0000-0000-000000000000';
    return (!placeholderId && item?.id) ? item.id : item?.name || item?.llm_interaction_id || Math.random().toString(36).slice(2);
  };
  prev.forEach((item) => map.set(keyFor(item), item));
  next.forEach((item) => map.set(keyFor(item), item));
  return Array.from(map.values());
};

const persistCompletedSession = (sessionIdValue: string | null, data: any) => {
  if (!data) return;

  const resolvedSessionId =
    sessionIdValue ||
    data?.session_id ||
    data?.sessionId ||
    data?.itinerary_response?.session_id ||
    data?.itineraryResponse?.sessionId;

  if (!resolvedSessionId) return;

  const wrapper = {
    sessionId: resolvedSessionId,
    data,
    timestamp: new Date().toISOString(),
  };

  sessionStorage.setItem('completedStreamingSession', JSON.stringify(wrapper));
  // Store a data-only payload for deep links expecting direct domain data
  sessionStorage.setItem(`session_${resolvedSessionId}`, JSON.stringify(data));
};

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

    try {
      const streamingData = options.getStreamingData?.();
      const domain = streamingData?.domain || 'general';

      // Extract city name from various possible sources in the streaming data
      const cityName = streamingData?.general_city_data?.city ||
                       streamingData?.activities?.[0]?.city ||
                       streamingData?.restaurants?.[0]?.city ||
                       streamingData?.hotels?.[0]?.city ||
                       streamingData?.points_of_interest?.[0]?.city;

      console.log('🏙️ Extracted city name for continue chat:', cityName);

      if (!cityName) {
        console.warn('⚠️ No city name found in streaming data. API may require it.');
      }

      const response = await ContinueChatStream({
        sessionId: workingSessionId,
        message: userMessage,
        cityName: cityName,
        contextType: domainToContextType(domain),
      });

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
                      console.log('🚀 New session started with ID:', startData.session_id);
                      setSessionId(startData.session_id);

                      // Initialize streaming session for progressive loading
                      const domain = startData.domain || 'general';
                      const city = startData.city || cityName;

                      setStreamingSession({
                        sessionId: startData.session_id,
                        domain: domain,
                        city: city,
                        isComplete: false,
                        data: {
                          session_id: startData.session_id,
                          sessionId: startData.session_id,
                          domain: domain,
                        },
                      });

                      // Early navigation if enabled and we have a domain
                      if (options.enableNavigation && domain !== 'general') {
                        const domainRoutes: Record<string, string> = {
                          accommodation: '/hotels',
                          dining: '/restaurants',
                          itinerary: '/itinerary',
                        };

                        const targetRoute = domainRoutes[domain];
                        if (targetRoute) {
                          const navUrl = `${targetRoute}?sessionId=${startData.session_id}&cityName=${encodeURIComponent(city || 'Unknown')}&domain=${domain}&streaming=true`;
                          console.log('🧭 Early navigation to:', navUrl);
                          navigate(navUrl);
                        }
                      }

                      // Also update legacy session storage for backward compatibility
                      const storedSession = sessionStorage.getItem('completedStreamingSession');
                      if (storedSession) {
                        try {
                          const session = JSON.parse(storedSession);
                          session.sessionId = startData.session_id;
                          if (session.data) {
                            session.data.session_id = startData.session_id;
                            session.data.sessionId = startData.session_id;
                          }
                          sessionStorage.setItem('completedStreamingSession', JSON.stringify(session));
                        } catch (error) {
                          console.error('Error updating session storage with new session ID:', error);
                        }
                      } else {
                        const newSession = {
                          sessionId: startData.session_id,
                          data: {
                            session_id: startData.session_id,
                            sessionId: startData.session_id
                          }
                        };
                        sessionStorage.setItem('completedStreamingSession', JSON.stringify(newSession));
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

                  case 'restaurants': {
                    const restaurantsData = eventData.Data || eventData.data;
                    console.log('🍽️ Received restaurants data:', restaurantsData);

                    if (restaurantsData) {
                      const currentSession =
                        sessionId() ||
                        eventData.SessionId ||
                        eventData.sessionId ||
                        (Array.isArray(restaurantsData) && restaurantsData[0]?.session_id);
                      let mergedRestaurants = restaurantsData;
                      if (options.setStreamingData) {
                        options.setStreamingData((prev: any) => {
                          mergedRestaurants = mergeUniqueById(prev?.restaurants, restaurantsData);
                          return {
                            ...prev,
                            domain: 'dining',
                            session_id: prev?.session_id || currentSession,
                            restaurants: mergedRestaurants,
                          };
                        });
                      }

                      updateStreamingData({
                        session_id: currentSession,
                        restaurants: mergedRestaurants,
                      });

                      // Persist for deep links
                      const snapshot = {
                        session_id: currentSession,
                        ...(options.getStreamingData?.() || {}),
                        restaurants: mergedRestaurants,
                      };
                      persistCompletedSession(currentSession || sessionId(), snapshot);
                      assistantMessage += 'Updated restaurant picks. ';
                    }
                    break;
                  }

                  case 'hotels': {
                    const hotelsData = eventData.Data || eventData.data;
                    console.log('🏨 Received hotels data:', hotelsData);

                    if (hotelsData) {
                      const currentSession =
                        sessionId() ||
                        eventData.SessionId ||
                        eventData.sessionId ||
                        (Array.isArray(hotelsData) && hotelsData[0]?.session_id);
                      let mergedHotels = hotelsData;
                      if (options.setStreamingData) {
                        options.setStreamingData((prev: any) => ({
                          ...prev,
                          domain: 'accommodation',
                          session_id: prev?.session_id || currentSession,
                          hotels: mergeUniqueById(prev?.hotels, hotelsData),
                        }));
                      }

                      updateStreamingData({
                        session_id: currentSession,
                        hotels: mergeUniqueById(
                          options.getStreamingData?.()?.hotels,
                          hotelsData,
                        ),
                      });

                      // Persist for deep links
                      mergedHotels = mergeUniqueById(
                        options.getStreamingData?.()?.hotels,
                        hotelsData,
                      );
                      const snapshot = {
                        session_id: currentSession,
                        ...(options.getStreamingData?.() || {}),
                        hotels: mergedHotels,
                      };
                      persistCompletedSession(currentSession || sessionId(), snapshot);
                      assistantMessage += 'Updated hotel options. ';
                    }
                    break;
                  }

                  case 'activities': {
                    const activitiesData = eventData.Data || eventData.data;
                    console.log('🎯 Received activities data:', activitiesData);

                    if (activitiesData) {
                      const currentSession =
                        sessionId() ||
                        eventData.SessionId ||
                        eventData.sessionId ||
                        (Array.isArray(activitiesData) && activitiesData[0]?.session_id);
                      let mergedActivities = activitiesData;
                      if (options.setStreamingData) {
                        options.setStreamingData((prev: any) => ({
                          ...prev,
                          domain: 'activities',
                          session_id: prev?.session_id || currentSession,
                          activities: mergeUniqueById(prev?.activities, activitiesData),
                        }));
                      }

                      mergedActivities = mergeUniqueById(
                        options.getStreamingData?.()?.activities,
                        activitiesData,
                      );

                      updateStreamingData({
                        session_id: currentSession,
                        activities: mergedActivities,
                      });

                      // Persist for deep links
                      const snapshot = {
                        session_id: currentSession,
                        ...(options.getStreamingData?.() || {}),
                        activities: mergedActivities,
                      };
                      persistCompletedSession(currentSession || sessionId(), snapshot);
                      assistantMessage += 'Updated activities list. ';
                    }
                    break;
                  }

                  case 'itinerary':
                    // This is the key event - update the itinerary data
                    const itineraryData = eventData.Data || eventData.data;
                    const message = eventData.Message || eventData.message;
                    const derivedLists = deriveDomainLists(itineraryData);

                    console.log('📦 Received itinerary update:', itineraryData);
                    console.log('Itinerary message:', message);
                    console.log('Updated POIs count:', itineraryData?.itinerary_response?.points_of_interest?.length);
                    console.log('Updated POIs:', itineraryData?.itinerary_response?.points_of_interest);

                    if (itineraryData) {
                      // Store partial data in streaming session for progressive loading
                      updateStreamingData(itineraryData);

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

                            // Check if this is an incremental update (adding to itinerary)
                            // vs a full new query response
                            const isIncrementalUpdate =
                              itineraryData.itinerary_response &&
                              !itineraryData.general_city_data;

                            console.log('🔍 Update type:', isIncrementalUpdate ? 'INCREMENTAL (add to itinerary)' : 'FULL (new query)');
                            if (isIncrementalUpdate) {
                              console.log('✅ Updating ONLY custom itinerary, preserving general POIs');
                            }

                            const mergedHotels = mergeUniqueById(
                              prev?.hotels,
                              itineraryData.hotels || derivedLists.hotels,
                            );

                            const mergedRestaurants = mergeUniqueById(
                              prev?.restaurants,
                              itineraryData.restaurants || derivedLists.restaurants,
                            );

                            const mergedActivities = mergeUniqueById(
                              prev?.activities,
                              itineraryData.activities || derivedLists.activities,
                            );

                            const updatedData = {
                              ...prev,
                              // Update general city data if provided
                              ...(itineraryData.general_city_data && {
                                general_city_data: itineraryData.general_city_data
                              }),
                              // Only update general points of interest for NEW queries, not incremental updates
                              // This prevents new POIs from appearing in the general list when they should only be in the custom itinerary
                              ...(!isIncrementalUpdate && itineraryData.points_of_interest && {
                                points_of_interest: itineraryData.points_of_interest
                              }),
                              // ALWAYS update itinerary response (this is the custom itinerary)
                              ...(itineraryData.itinerary_response && {
                                itinerary_response: itineraryData.itinerary_response
                              }),
                              // Update activities if provided (for restaurants page)
                              ...(itineraryData.activities && {
                                activities: itineraryData.activities
                              }),
                              // Update restaurants if provided (for restaurants page)
                              ...(itineraryData.restaurants && {
                                restaurants: itineraryData.restaurants
                              }),
                              ...(derivedLists.restaurants?.length && {
                                restaurants: mergedRestaurants
                              }),
                              // Update hotels if provided (for hotels page)
                              ...(itineraryData.hotels && {
                                hotels: mergedHotels
                              }),
                              ...(derivedLists.hotels?.length && {
                                hotels: mergedHotels
                              }),
                              ...(mergedActivities.length && {
                                activities: mergedActivities
                              })
                            };

                            // Persist for cross-page usage
                            persistCompletedSession(
                              sessionId() || workingSessionId || itineraryData.session_id,
                              updatedData
                            );

                            // Keep streaming state in sync for cross-page navigation
                            updateStreamingData(updatedData);

                            return updatedData;
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

                      console.log('✅ Content updated successfully');
                    }
                    break;

                  case 'complete':
                    isComplete = true;
                    const completeMessage = eventData.Message || eventData.message;
                    if (completeMessage && completeMessage !== 'Turn completed.') {
                      assistantMessage += completeMessage;
                    }

                    // Mark streaming as complete
                    markStreamingComplete();
                    console.log('✅ Streaming complete - data finalized');

                    // Handle navigation data if present (fallback for late navigation)
                    const navigationData = eventData.Navigation || eventData.navigation;
                    if (navigationData && options.enableNavigation) {
                      console.log('Received navigation data:', navigationData);

                      if (options.onNavigationData) {
                        options.onNavigationData(navigationData);
                      }

                      // Only navigate if we haven't already (for sessions that didn't get early navigation)
                      // Check if we're already on the target page
                      if (navigationData.url || navigationData.URL) {
                        const targetUrl = navigationData.url || navigationData.URL;
                        const currentPath = window.location.pathname + window.location.search;

                        // Only navigate if we're not already there
                        if (!currentPath.includes(new URL(targetUrl, window.location.origin).pathname)) {
                          console.log('🧭 Late navigation to:', targetUrl);
                          navigate(targetUrl);
                        } else {
                          console.log('📍 Already on target page, skipping navigation');
                        }
                      }
                    }
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

      // Handle token expiration errors specifically
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isTokenExpired = errorMessage.includes('token is expired') ||
                            errorMessage.includes('invalid token') ||
                            errorMessage.includes('unauthenticated');

      if (isTokenExpired) {
        setChatHistory(prev => [...prev, {
          type: 'error',
          content: 'Your session has expired. Please refresh the page to continue.',
          timestamp: new Date()
        }]);
      } else {
        setChatHistory(prev => [...prev, {
          type: 'error',
          content: `Sorry, there was an error processing your request: ${errorMessage}`,
          timestamp: new Date()
        }]);
      }

      if (options.onError) {
        options.onError(error as Error);
      }
    } finally {
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

      const response = await sendUnifiedChatMessageStream({
        profileId: userId,
        message: newSessionPayload.message,
        cityName,
        contextType: domainToContextType(detectDomain(userMessage)),
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
                    const derivedLists = deriveDomainLists(itineraryData);

                    if (itineraryData) {
                      if (options.setStreamingData) {
                        options.setStreamingData((prev: any) => {
                          const mergedHotels = hasAuthoritativeList
                            ? derivedLists.hotels
                            : mergeUniqueById(
                                prev?.hotels,
                                itineraryData.hotels || derivedLists.hotels,
                              );

                          const mergedRestaurants = hasAuthoritativeList
                            ? derivedLists.restaurants
                            : mergeUniqueById(
                                prev?.restaurants,
                                itineraryData.restaurants || derivedLists.restaurants,
                              );

                          const mergedActivities = hasAuthoritativeList
                            ? derivedLists.activities
                            : mergeUniqueById(
                                prev?.activities,
                                itineraryData.activities || derivedLists.activities,
                              );

                          return {
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
                            ...(mergedActivities.length && {
                              activities: mergedActivities
                            }),
                            ...(mergedRestaurants.length && {
                              restaurants: mergedRestaurants
                            }),
                            ...(mergedHotels.length && {
                              hotels: mergedHotels
                            })
                          };
                        });
                      }

                      const mergedHotels = mergeUniqueById(
                        (options.getStreamingData?.() as any)?.hotels,
                        itineraryData.hotels || derivedLists.hotels,
                      );
                      const mergedRestaurants = mergeUniqueById(
                        (options.getStreamingData?.() as any)?.restaurants,
                        itineraryData.restaurants || derivedLists.restaurants,
                      );
                      const mergedActivities = mergeUniqueById(
                        (options.getStreamingData?.() as any)?.activities,
                        itineraryData.activities || derivedLists.activities,
                      );

                      const mergedDataForPersistence = {
                        ...(options.getStreamingData?.() || {}),
                        ...itineraryData,
                        hotels: mergedHotels,
                        restaurants: mergedRestaurants,
                        activities: mergedActivities,
                      };

                      persistCompletedSession(
                        sessionId() || itineraryData.session_id,
                        mergedDataForPersistence
                      );

                      // Persist derived lists for navigation/storage consistency
                      updateStreamingData(mergedDataForPersistence);

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
