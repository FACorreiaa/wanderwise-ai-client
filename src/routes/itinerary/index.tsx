import { createSignal, createEffect, For, Show, onMount, batch } from 'solid-js';
import { useLocation } from '@solidjs/router';
import mapboxgl from 'mapbox-gl';
import { MapPin, Clock, Star, Filter, Heart, Share2, Download, Edit3, Plus, X, Navigation, Calendar, Users, DollarSign, Camera, Coffee, Utensils, Building, TreePine, ShoppingBag, Loader2, MessageCircle, Send, Compass, Palette, Cloud } from 'lucide-solid';
import MapComponent from '~/components/features/Map/Map';
import { useItineraries, useItinerary, useUpdateItineraryMutation, useSaveItineraryMutation } from '~/lib/api/itineraries';
import type { AiCityResponse, POIDetail } from '~/lib/api/types';
import { ItineraryResults } from '~/components/results';
import { TypingAnimation } from '~/components/TypingAnimation';
import { API_BASE_URL } from '~/lib/api/shared';
import { useAuth } from '~/contexts/AuthContext';

export default function ItineraryResultsPage() {
    const location = useLocation();
    const auth = useAuth();
    const [map, setMap] = createSignal(null);
    const [selectedPOI, setSelectedPOI] = createSignal(null);
    const [showFilters, setShowFilters] = createSignal(false);
    const [viewMode, setViewMode] = createSignal('split'); // 'map', 'list', 'split'
    const [myTrip, setMyTrip] = createSignal([]); // Track selected POIs for the trip
    const [currentItineraryId, setCurrentItineraryId] = createSignal(null);
    const [streamingData, setStreamingData] = createSignal(null);
    const [fromChat, setFromChat] = createSignal(false);
    
    // Separate signal for POI updates to prevent map re-render issues
    const [poisUpdateTrigger, setPoisUpdateTrigger] = createSignal(0);
    const [showAllGeneralPOIs, setShowAllGeneralPOIs] = createSignal(false);

    // Chat functionality
    const [showChat, setShowChat] = createSignal(false);
    const [chatMessage, setChatMessage] = createSignal('');
    const [chatHistory, setChatHistory] = createSignal([]);
    const [isLoading, setIsLoading] = createSignal(false);
    const [sessionId, setSessionId] = createSignal(null);
    const [isUpdatingItinerary, setIsUpdatingItinerary] = createSignal(false);

    // API hooks
    const itinerariesQuery = useItineraries();
    const itineraryQuery = useItinerary(currentItineraryId() || '');
    const updateItineraryMutation = useUpdateItineraryMutation();
    const saveItineraryMutation = useSaveItineraryMutation();

    // Filter states - more inclusive when we have streaming data
    const [activeFilters, setActiveFilters] = createSignal({
        categories: [], // Start with empty categories to show all streaming POIs
        timeToSpend: [],
        budget: [],
        accessibility: [],
        dogFriendly: true
    });

    // Initialize with streaming data on mount
    onMount(() => {
        console.log('=== ITINERARY PAGE MOUNT ===');
        console.log('Location state:', location.state);
        console.log('Session storage keys:', Object.keys(sessionStorage));

        // Check for streaming data from route state
        if (location.state?.streamingData) {
            console.log('Found streaming data in route state');
            setStreamingData(location.state.streamingData);
            setFromChat(true);
            console.log('Received streaming data from chat:', location.state.streamingData);
            console.log('Points of interest:', location.state.streamingData.points_of_interest);
            console.log('Itinerary POIs:', location.state.streamingData.itinerary_response?.points_of_interest);
            
            // Extract session ID from streaming data if available
            if (location.state?.sessionId) {
                setSessionId(location.state.sessionId);
                console.log('Found session ID from route state:', location.state.sessionId);
            }
        } else {
            console.log('No streaming data in route state, checking session storage');
            // Try to get data from session storage
            const storedSession = sessionStorage.getItem('completedStreamingSession');
            console.log('Session storage content:', storedSession);

            if (storedSession) {
                try {
                    const session = JSON.parse(storedSession);
                    console.log('Parsed session:', session);
                    console.log('Session keys:', Object.keys(session));

                    if (session.data) {
                        console.log('Setting streaming data from session storage');
                        setStreamingData(session.data);
                        setFromChat(true);
                        console.log('Loaded streaming data from session storage:', session.data);
                        console.log('Points of interest:', session.data.points_of_interest);
                        console.log('Itinerary POIs:', session.data.itinerary_response?.points_of_interest);
                    } else {
                        console.log('No data found in session');
                    }
                    
                    // Extract session ID from stored session - check multiple possible locations
                    let extractedSessionId = null;
                    
                    console.log('🔍 Extracting session ID from stored session...');
                    console.log('Session object keys:', Object.keys(session));
                    console.log('Session.sessionId:', session.sessionId);
                    console.log('Session.data:', session.data);
                    if (session.data) {
                        console.log('Session.data keys:', Object.keys(session.data));
                        console.log('Session.data.session_id:', session.data.session_id);
                        console.log('Session.data.sessionId:', session.data.sessionId);
                    }
                    
                    if (session.sessionId) {
                        extractedSessionId = session.sessionId;
                        console.log('✅ Found session ID from session.sessionId:', extractedSessionId);
                    } else if (session.data?.session_id) {
                        extractedSessionId = session.data.session_id;
                        console.log('✅ Found session ID from session.data.session_id:', extractedSessionId);
                    } else if (session.data?.sessionId) {
                        extractedSessionId = session.data.sessionId;
                        console.log('✅ Found session ID from session.data.sessionId:', extractedSessionId);
                    } else {
                        console.warn('❌ No session ID found in stored session. Available keys:', Object.keys(session));
                        if (session.data) {
                            console.warn('Session data keys:', Object.keys(session.data));
                        }
                    }
                    
                    if (extractedSessionId) {
                        setSessionId(extractedSessionId);
                        console.log('Set session ID:', extractedSessionId);
                    }
                } catch (error) {
                    console.error('Error parsing stored session:', error);
                }
            } else {
                console.log('No stored session found');
            }
        }

        // Debug current streaming data state and session ID
        setTimeout(() => {
            console.log('=== STREAMING DATA STATE AFTER MOUNT ===');
            console.log('Current streamingData():', streamingData());
            console.log('Current sessionId():', sessionId());
            console.log('Map POIs:', mapPointsOfInterest());
            console.log('Filtered Map POIs:', filteredMapPOIs());
            
            // If we have streaming data but no session ID, only warn (don't auto-create)
            if (streamingData() && !sessionId()) {
                console.warn('Have streaming data but no session ID - user will need to start new session if they want to chat');
            }
        }, 100);
    });

    // Fallback function to create a new session when session ID is missing
    const createFallbackSession = async () => {
        const streaming = streamingData();
        if (!streaming || !streaming.general_city_data?.city) {
            console.warn('Cannot create fallback session - missing city data');
            return;
        }

        try {
            console.log('Creating fallback session for city:', streaming.general_city_data.city);
            
            // Create a fallback session ID (UUID v4)
            const fallbackSessionId = crypto.randomUUID();
            setSessionId(fallbackSessionId);
            
            console.log('Generated fallback session ID:', fallbackSessionId);
            
            // Update session storage with the new session ID
            const storedSession = sessionStorage.getItem('completedStreamingSession');
            if (storedSession) {
                try {
                    const session = JSON.parse(storedSession);
                    session.sessionId = fallbackSessionId;
                    sessionStorage.setItem('completedStreamingSession', JSON.stringify(session));
                    console.log('Updated session storage with fallback session ID');
                } catch (error) {
                    console.error('Error updating session storage:', error);
                }
            }
        } catch (error) {
            console.error('Error creating fallback session:', error);
            // Fallback to a simple UUID if crypto.randomUUID is not available
            const simpleUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            setSessionId(simpleUuid);
            console.log('Created simple fallback session ID:', simpleUuid);
        }
    };

    // Get current itinerary data from streaming data, API, or fallback
    const itinerary = () => {
        const streaming = streamingData();

        if (streaming && streaming.general_city_data) {
            // Map streaming data to itinerary format
            const itineraryName = streaming.itinerary_response?.itinerary_name;
            console.log('Raw itinerary name:', itineraryName);

            // Handle case where itinerary_name might be a JSON string or object
            let parsedName = itineraryName;
            if (typeof itineraryName === 'string' && itineraryName.startsWith('{')) {
                try {
                    const parsed = JSON.parse(itineraryName);
                    parsedName = parsed.itinerary_name || parsed.name || `${streaming.general_city_data.city} Adventure`;
                } catch (e) {
                    console.warn('Failed to parse itinerary name JSON:', e);
                    parsedName = `${streaming.general_city_data.city} Adventure`;
                }
            } else if (typeof itineraryName === 'object' && itineraryName?.itinerary_name) {
                parsedName = itineraryName.itinerary_name;
            }

            console.log('Parsed itinerary name:', parsedName);

            return {
                name: parsedName || `${streaming.general_city_data.city} Adventure`,
                description: streaming.itinerary_response?.overall_description || streaming.general_city_data.description,
                city: streaming.general_city_data.city,
                country: streaming.general_city_data.country,
                duration: "Personalized", // TODO: Extract from data
                centerLat: streaming.general_city_data.center_latitude,
                centerLng: streaming.general_city_data.center_longitude,
                pois: [],
                streamingData: streaming
            };
        }

        if (itineraryQuery.data) {
            return itineraryQuery.data;
        }

        // Fallback data for demo
        return {
            name: "Porto's Charms: Sightseeing & Local Delights (Dog-Friendly)",
            description: "This itinerary focuses on showcasing Porto's key landmarks and offering authentic local experiences, all while keeping your furry friend in mind.",
            city: "Porto",
            country: "Portugal",
            duration: "3 days",
            centerLat: 41.1579,
            centerLng: -8.6291,
            pois: []
        };
    };

    // Convert streaming POI data to itinerary format
    const convertPOIToItineraryFormat = (poi: POIDetail) => {
        // Infer time to spend based on category
        const getTimeToSpend = (category: string) => {
            const lowerCategory = category.toLowerCase();
            if (lowerCategory.includes('museum') || lowerCategory.includes('palace')) return '2-3 hours';
            if (lowerCategory.includes('market') || lowerCategory.includes('restaurant')) return '1-2 hours';
            if (lowerCategory.includes('viewpoint') || lowerCategory.includes('plaza')) return '30-60 minutes';
            if (lowerCategory.includes('park') || lowerCategory.includes('garden')) return '1-2 hours';
            return '1-2 hours'; // Default
        };

        // Infer budget based on category
        const getBudget = (category: string) => {
            const lowerCategory = category.toLowerCase();
            if (lowerCategory.includes('free') || lowerCategory.includes('park') || lowerCategory.includes('plaza')) return 'Free';
            if (lowerCategory.includes('museum') || lowerCategory.includes('palace')) return '€€';
            if (lowerCategory.includes('restaurant') || lowerCategory.includes('market')) return '€€€';
            return '€€'; // Default
        };

        // Generate a reasonable rating based on category
        const getRating = (category: string) => {
            // Most tourist attractions have good ratings
            return 4.2 + (Math.random() * 0.6); // Random between 4.2 and 4.8
        };

        return {
            id: poi.id || `poi-${Math.random().toString(36).substr(2, 9)}`,
            name: poi.name || 'Unknown Location',
            category: poi.category || 'Attraction',
            description: poi.description_poi || 'No description available',
            latitude: poi.latitude,
            longitude: poi.longitude,
            timeToSpend: getTimeToSpend(poi.category || ''),
            budget: getBudget(poi.category || ''),
            rating: Number(getRating(poi.category || '').toFixed(1)),
            tags: [poi.category || 'Attraction'],
            priority: 1,
            dogFriendly: true, // Default to true
            address: poi.address || 'Address not available',
            website: poi.website || '',
            openingHours: poi.opening_hours || 'Hours not available'
        };
    };

    // POIs for the MAP - these should be the curated itinerary POIs
    const mapPointsOfInterest = () => {
        // Include poisUpdateTrigger to react to updates
        poisUpdateTrigger(); // Access trigger to create dependency
        
        const streaming = streamingData();

        console.log('=== MAP POIs DEBUG ===');
        console.log('Streaming data:', streaming);

        if (streaming) {
            // Use ITINERARY POIs for the map (these are the curated selection)
            const itineraryPois = streaming.itinerary_response?.points_of_interest;

            console.log('Raw itinerary POIs:', itineraryPois);
            console.log('Itinerary POIs type:', typeof itineraryPois);
            console.log('Itinerary POIs is array:', Array.isArray(itineraryPois));
            console.log('Itinerary POIs length:', itineraryPois?.length);

            if (itineraryPois && Array.isArray(itineraryPois) && itineraryPois.length > 0) {
                console.log('Processing each POI for map:');
                const convertedPOIs = itineraryPois.map((poi, index) => {
                    console.log(`POI ${index}:`, poi);
                    console.log(`  - Name: ${poi.name}`);
                    console.log(`  - Lat: ${poi.latitude} (${typeof poi.latitude})`);
                    console.log(`  - Lng: ${poi.longitude} (${typeof poi.longitude})`);
                    const converted = convertPOIToItineraryFormat(poi);
                    console.log(`  - Converted:`, converted);
                    return converted;
                });
                console.log('Final converted POIs for MAP:', convertedPOIs);
                return convertedPOIs;
            }

            console.log('No itinerary POIs found for map - checking fallbacks');
            const generalPois = streaming.points_of_interest;
            console.log('General POIs as fallback:', generalPois);

            if (generalPois && Array.isArray(generalPois) && generalPois.length > 0) {
                const convertedPOIs = generalPois.map(convertPOIToItineraryFormat);
                console.log('Using GENERAL POIs as fallback for MAP:', convertedPOIs);
                return convertedPOIs;
            }
        }

        console.log('Returning empty array for map POIs');
        return [];
    };

    // POIs for the CARDS - these should be the general POIs for context
    const cardPointsOfInterest = () => {
        const streaming = streamingData();

        if (streaming) {
            // Use GENERAL POIs for the cards (these provide more context)
            const generalPois = streaming.points_of_interest;
            const itineraryPois = streaming.itinerary_response?.points_of_interest;

            console.log('Cards - General POIs:', generalPois);
            console.log('Cards - Itinerary POIs:', itineraryPois);

            // Combine both general and itinerary POIs for cards, but prioritize itinerary
            let allPois = [];

            if (itineraryPois && Array.isArray(itineraryPois)) {
                allPois = [...itineraryPois];
            }

            if (generalPois && Array.isArray(generalPois)) {
                // Add general POIs that aren't already in itinerary
                const itineraryNames = new Set(allPois.map(poi => poi.name));
                const additionalPois = generalPois.filter(poi => !itineraryNames.has(poi.name));
                allPois = [...allPois, ...additionalPois];
            }

            if (allPois.length > 0) {
                const convertedPOIs = allPois.map(convertPOIToItineraryFormat);
                console.log('Using COMBINED POIs for CARDS:', convertedPOIs);
                return convertedPOIs;
            }

            console.log('No POIs found for cards');
        }

        console.log('Returning fallback POIs for cards');
        return itinerary().pois || [];
    };

    // Legacy function for backwards compatibility - now uses card POIs
    const pointsOfInterest = () => cardPointsOfInterest();

    // chat logic
    // Chat functionality
    const sendChatMessage = async () => {
        if (!chatMessage().trim() || isLoading()) return;

        const currentSessionId = sessionId();
        console.log('🔍 sendChatMessage - Current session ID:', currentSessionId);
        console.log('🔍 sendChatMessage - Session storage:', sessionStorage.getItem('completedStreamingSession'));
        console.log('🔍 sendChatMessage - Streaming data present:', !!streamingData());
        
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
            const streaming = streamingData();
            if (streaming && streaming.general_city_data?.city) {
                console.log('Have streaming data, starting new session for chat...');
                
                // Add a message showing we're starting a new session
                setChatHistory(prev => [...prev, { 
                    type: 'assistant', 
                    content: 'Starting a new session to continue your conversation...', 
                    timestamp: new Date() 
                }]);
                
                // Start new session with the user message
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
                                                // Show update indicator
                                                setIsUpdatingItinerary(true);
                                                
                                                // Update the streaming data with new itinerary information
                                                setStreamingData(prev => {
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
                                                        })
                                                    };
                                                });
                                                
                                                // Trigger POI update without causing full re-render
                                                setPoisUpdateTrigger(prev => prev + 1);
                                            });
                                            
                                            // Use the message from the server if available
                                            if (message) {
                                                assistantMessage += message + ' ';
                                            } else {
                                                assistantMessage += 'Your itinerary has been updated. ';
                                            }
                                            
                                            console.log('Itinerary updated successfully');
                                        }
                                        break;
                                    
                                    case 'complete':
                                        isComplete = true;
                                        const completeMessage = eventData.Message || eventData.message;
                                        if (completeMessage && completeMessage !== 'Turn completed.') {
                                            assistantMessage += completeMessage;
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

        } catch (error) {
            console.error('Error sending message:', error);
            setChatHistory(prev => [...prev, {
                type: 'error',
                content: `Sorry, there was an error processing your request: ${error.message}`,
                timestamp: new Date()
            }]);
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
            
            const streaming = streamingData();
            const cityName = streaming?.general_city_data?.city || 'Unknown';
            
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
                                            setStreamingData(prev => ({
                                                ...prev,
                                                ...(itineraryData.general_city_data && {
                                                    general_city_data: itineraryData.general_city_data
                                                }),
                                                ...(itineraryData.points_of_interest && {
                                                    points_of_interest: itineraryData.points_of_interest
                                                }),
                                                ...(itineraryData.itinerary_response && {
                                                    itinerary_response: itineraryData.itinerary_response
                                                })
                                            }));
                                            
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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    };


    const filterOptions = {
        categories: [
            { id: 'historic', label: 'Historic Sites', icon: Building },
            { id: 'cuisine', label: 'Local Cuisine', icon: Utensils },
            //{ id: 'museums', label: 'Museums', icon: Museum },
            { id: 'architecture', label: 'Architecture', icon: Building },
            { id: 'nature', label: 'Nature & Parks', icon: TreePine },
            { id: 'shopping', label: 'Shopping', icon: ShoppingBag }
        ],
        timeToSpend: ['30-60 minutes', '1-2 hours', '2-3 hours', 'Half day', 'Full day'],
        budget: ['Free', '€', '€€', '€€€'],
        accessibility: ['Wheelchair Accessible', 'Dog Friendly', 'Family Friendly', 'Public Transport']
    };

    const getCategoryIcon = (category: any) => {
        const iconMap = {
            'Bookstore & Architecture': Building,
            'Bridge & Landmark': Navigation,
            'Historical District': Building,
            //'Palace & Museum': Museum,
            'Parks & Gardens': TreePine,
            'Wine Tasting': Coffee
        };
        return iconMap[category] || MapPin;
    };

    const getBudgetColor = (budget) => {
        const colorMap = {
            'Free': 'text-green-600',
            '€': 'text-blue-600',
            '€€': 'text-orange-600',
            '€€€': 'text-red-600'
        };
        return colorMap[budget] || 'text-gray-600';
    };

    const getPriorityColor = (priority) => {
        return priority === 1 ? 'bg-red-500' : 'bg-blue-500';
    };

    // Filtered POIs for CARDS (applies filters to card POIs)
    const filteredCardPOIs = () => {
        const pois = cardPointsOfInterest();
        console.log('Filtering Card POIs:', pois);

        const filtered = pois.filter(poi => {
            const filters = activeFilters();

            // Dog-friendly filter
            if (filters.dogFriendly && !poi.dogFriendly) return false;

            // Category filter - make it more flexible for streaming data
            if (filters.categories.length > 0) {
                const poiCategory = poi.category?.toLowerCase() || '';
                const poiTags = poi.tags?.map(tag => tag.toLowerCase()) || [];

                const hasMatchingCategory = filters.categories.some(filterCategory => {
                    const lowerFilterCategory = filterCategory.toLowerCase();

                    // Direct match
                    if (poiTags.includes(lowerFilterCategory) || poiCategory.includes(lowerFilterCategory)) {
                        return true;
                    }

                    // Fuzzy matching for common categories
                    if (lowerFilterCategory.includes('historic') && (poiCategory.includes('historic') || poiCategory.includes('heritage') || poiCategory.includes('monument'))) return true;
                    if (lowerFilterCategory.includes('cuisine') && (poiCategory.includes('restaurant') || poiCategory.includes('food') || poiCategory.includes('market'))) return true;
                    if (lowerFilterCategory.includes('museum') && poiCategory.includes('museum')) return true;
                    if (lowerFilterCategory.includes('architecture') && (poiCategory.includes('building') || poiCategory.includes('palace') || poiCategory.includes('cathedral'))) return true;

                    return false;
                });

                if (!hasMatchingCategory) return false;
            }

            // Time to spend filter
            if (filters.timeToSpend.length > 0 && !filters.timeToSpend.includes(poi.timeToSpend)) return false;

            // Budget filter
            if (filters.budget.length > 0 && !filters.budget.includes(poi.budget)) return false;

            return true;
        });

        console.log('Filtered Card POIs result:', filtered);
        return filtered;
    };

    // Filtered POIs for MAP (applies filters to map POIs)
    const filteredMapPOIs = () => {
        const pois = mapPointsOfInterest();
        console.log('Filtering Map POIs:', pois);

        // For now, don't filter map POIs too heavily - show the full itinerary
        // You can add filtering here if needed
        console.log('Map POIs (unfiltered):', pois);
        return pois;
    };

    // Legacy function for backwards compatibility - now uses card POIs
    const filteredPOIs = () => filteredCardPOIs();

    const toggleFilter = (filterType, value) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter(v => v !== value)
                : [...prev[filterType], value]
        }));
    };

    const movePOI = (poiId, direction) => {
        const currentPOIs = pointsOfInterest();
        const index = currentPOIs.findIndex(poi => poi.id === poiId);
        if (direction === 'up' && index > 0) {
            const newPOIs = [...currentPOIs];
            [newPOIs[index], newPOIs[index - 1]] = [newPOIs[index - 1], newPOIs[index]];
            setPointsOfInterest(newPOIs);
        } else if (direction === 'down' && index < currentPOIs.length - 1) {
            const newPOIs = [...currentPOIs];
            [newPOIs[index], newPOIs[index + 1]] = [newPOIs[index + 1], newPOIs[index]];
            setPointsOfInterest(newPOIs);
        }
    };

    const renderMap = () => {
        console.log('Rendering map container');
        return <div id="map-container" class="h-full rounded-lg overflow-hidden" />;
    };

    const renderPOICard = (poi) => {
        const IconComponent = getCategoryIcon(poi.category);
        return (
            <div
                class={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${selectedPOI()?.id === poi.id ? 'ring-2 ring-blue-500 shadow-md' : 'border-gray-200'}`}
                onClick={() => setSelectedPOI(poi)}
            >
                <div class="flex items-start gap-3">
                    <div class={`w-12 h-12 rounded-full ${getPriorityColor(poi.priority)} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent class="w-6 h-6 text-white" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex-1 min-w-0">
                                <h3 class="font-semibold text-gray-900 text-base mb-1">{poi.name}</h3>

                                {/* Enhanced Filter Labels */}
                                <div class="flex flex-wrap items-center gap-2 mb-2">
                                    {/* POI Category Label */}
                                    <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                        📍 {poi.category}
                                    </span>

                                    {/* Budget/Price Range with Enhanced Styling */}
                                    <span class={`px-3 py-1 rounded-full text-xs font-bold border ${getBudgetColor(poi.budget).includes('green') ? 'bg-green-50 text-green-700 border-green-200' :
                                        getBudgetColor(poi.budget).includes('blue') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            getBudgetColor(poi.budget).includes('orange') ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                'bg-red-50 text-red-700 border-red-200'}`}>
                                        {poi.budget} {poi.budget === 'Free' ? 'Entry' : poi.budget === '€' ? 'Budget' : poi.budget === '€€' ? 'Moderate' : 'Premium'}
                                    </span>

                                    {/* Rating/Popularity Label */}
                                    <Show when={poi.rating >= 4.5}>
                                        <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                            ⭐ Must Visit
                                        </span>
                                    </Show>
                                    <Show when={poi.rating >= 4.0 && poi.rating < 4.5}>
                                        <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            ✓ Recommended
                                        </span>
                                    </Show>

                                    {/* Time to Spend Label */}
                                    <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                        🕒 {poi.timeToSpend}
                                    </span>

                                    {/* Priority Label */}
                                    <Show when={poi.priority === 1}>
                                        <span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                                            🔥 Priority
                                        </span>
                                    </Show>

                                    {/* Dog Friendly Label */}
                                    <Show when={poi.dogFriendly}>
                                        <span class="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                                            🐕 Pet Friendly
                                        </span>
                                    </Show>
                                </div>
                            </div>

                            {/* Rating Badge */}
                            <div class="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                                <Star class="w-3 h-3 text-yellow-500 fill-current" />
                                <span class="text-yellow-800 font-medium text-xs">{poi.rating}</span>
                            </div>
                        </div>

                        <p class="text-sm text-gray-600 mb-3 line-clamp-2">{poi.description}</p>

                        {/* Enhanced Footer with Better Visual Hierarchy */}
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="text-lg font-bold text-gray-900">
                                    {poi.budget}
                                </div>
                            </div>

                            {/* Control Buttons */}
                            <div class="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); movePOI(poi.id, 'up'); }}
                                    class="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Move up"
                                >
                                    ↑
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); movePOI(poi.id, 'down'); }}
                                    class="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Move down"
                                >
                                    ↓
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // chat component

    const renderFiltersPanel = () => (
        <Show when={showFilters()}>
            <div class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-gray-200 shadow-lg p-4 z-10">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <h4 class="font-semibold text-gray-900 mb-2 text-sm">Categories</h4>
                        <div class="space-y-1">
                            <For each={filterOptions.categories}>
                                {(category) => {
                                    const IconComponent = category.icon;
                                    return (
                                        <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                            <input
                                                type="checkbox"
                                                class="rounded border-gray-300"
                                                checked={activeFilters().categories.includes(category.label)}
                                                onChange={() => toggleFilter('categories', category.label)}
                                            />
                                            <IconComponent class="w-4 h-4 text-gray-500" />
                                            <span class="text-gray-700">{category.label}</span>
                                        </label>
                                    );
                                }}
                            </For>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900 mb-2 text-sm">Time to Spend</h4>
                        <div class="space-y-1">
                            <For each={filterOptions.timeToSpend}>
                                {(time) => (
                                    <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300"
                                            checked={activeFilters().timeToSpend.includes(time)}
                                            onChange={() => toggleFilter('timeToSpend', time)}
                                        />
                                        <span class="text-gray-700">{time}</span>
                                    </label>
                                )}
                            </For>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900 mb-2 text-sm">Budget</h4>
                        <div class="space-y-1">
                            <For each={filterOptions.budget}>
                                {(budget) => (
                                    <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300"
                                            checked={activeFilters().budget.includes(budget)}
                                            onChange={() => toggleFilter('budget', budget)}
                                        />
                                        <span class={`font-medium ${getBudgetColor(budget)}`}>{budget}</span>
                                    </label>
                                )}
                            </For>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900 mb-2 text-sm">Accessibility</h4>
                        <div class="space-y-1">
                            <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                <input
                                    type="checkbox"
                                    class="rounded border-gray-300"
                                    checked={activeFilters().dogFriendly}
                                    onChange={() => setActiveFilters(prev => ({ ...prev, dogFriendly: !prev.dogFriendly }))}
                                />
                                <span class="text-gray-700">🐕 Dog Friendly</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </Show>
    );

    const addToTrip = (poi) => {
        setMyTrip(prev => prev.some(item => item.id === poi.id) ? prev : [...prev, poi]);
    };

    const saveItinerary = () => {
        const itineraryData = {
            ...itinerary(),
            pois: pointsOfInterest()
        };
        saveItineraryMutation.mutate(itineraryData);
    };

    const updateItinerary = (updates) => {
        if (currentItineraryId()) {
            updateItineraryMutation.mutate({
                itineraryId: currentItineraryId(),
                data: updates
            });
        }
    };

    // chat component
    const renderChatInterface = () => (
        <Show when={showChat()}>
            <div class="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
                {/* Chat Header */}
                <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
                    <div class="flex items-center gap-2">
                        <MessageCircle class="w-5 h-5" />
                        <span class="font-medium">Continue Planning</span>
                    </div>
                    <button
                        onClick={() => setShowChat(false)}
                        class="p-1 hover:bg-blue-700 rounded"
                    >
                        <X class="w-4 h-4" />
                    </button>
                </div>

                {/* Chat Messages */}
                <div class="flex-1 overflow-y-auto p-4 space-y-4">
                    <Show when={chatHistory().length === 0}>
                        <div class="text-center text-gray-500 py-8">
                            <MessageCircle class="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p class="text-sm">Ask me to modify your itinerary!</p>
                            <p class="text-xs mt-2 text-gray-400">
                                Try: "Add the Eiffel Tower" or "Remove expensive activities"
                            </p>
                        </div>
                    </Show>

                    <For each={chatHistory()}>
                        {(message) => (
                            <div class={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div class={`max-w-[80%] p-3 rounded-lg text-sm ${message.type === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : message.type === 'error'
                                        ? 'bg-red-100 text-red-800 border border-red-200'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    <p class="whitespace-pre-wrap">{message.content}</p>
                                    <p class={`text-xs mt-1 opacity-70 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                                        }`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        )}
                    </For>

                    <Show when={isLoading()}>
                        <div class="flex justify-start">
                            <div class="bg-gray-100 p-3 rounded-lg flex items-center gap-2 text-sm text-gray-600">
                                <Loader2 class="w-4 h-4 animate-spin" />
                                <span>Updating your itinerary...</span>
                            </div>
                        </div>
                    </Show>
                </div>

                {/* Chat Input */}
                <div class="p-4 border-t border-gray-200">
                    <div class="flex items-end gap-2">
                        <textarea
                            value={chatMessage()}
                            onInput={(e) => setChatMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me to modify your itinerary..."
                            class="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="2"
                            disabled={isLoading()}
                        />
                        <button
                            onClick={sendChatMessage}
                            disabled={!chatMessage().trim() || isLoading()}
                            class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </Show>
    );

    return (
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Chat Success Banner */}
            <Show when={fromChat()}>
                <div class="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200 px-4 py-3 sm:px-6">
                    <div class="max-w-7xl mx-auto">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <MessageCircle class="w-4 h-4 text-white" />
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-green-900">
                                    ✨ <TypingAnimation text="Your personalized itinerary is ready!" />
                                </p>
                                <p class="text-xs text-green-700">
                                    Generated from your chat: "{location.state?.originalMessage || 'Walk in Madrid'}"
                                </p>
                            </div>
                            <button
                                onClick={() => setFromChat(false)}
                                class="p-1 text-green-600 hover:text-green-700"
                            >
                                <X class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </Show>

            {/* Header - Mobile First */}
            <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4">
                <div class="max-w-7xl mx-auto">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 class="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">{itinerary().name}</h1>
                            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 sm:text-base">{itinerary().city}, {itinerary().country} • {itinerary().duration}</p>
                        </div>
                        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                            {/* View Mode Toggle - Stack on Mobile */}
                            <div class="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
                                <button
                                    onClick={() => setViewMode('map')}
                                    class={`flex-1 px-3 py-1 rounded text-sm font-medium transition-colors sm:flex-initial ${viewMode() === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
                                    title="Show only map"
                                >
                                    Map
                                </button>
                                <button
                                    onClick={() => setViewMode('split')}
                                    class={`flex-1 px-3 py-1 rounded text-sm font-medium transition-colors sm:flex-initial ${viewMode() === 'split' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
                                    title="Split view: Map + Cards"
                                >
                                    Split
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    class={`flex-1 px-3 py-1 rounded text-sm font-medium transition-colors sm:flex-initial ${viewMode() === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
                                    title="Show only cards"
                                >
                                    List
                                </button>
                            </div>

                            {/* Action Buttons - Stack on Mobile */}
                            <div class="flex flex-col gap-2 sm:flex-row sm:gap-3">
                                <button
                                    onClick={() => setShowChat(true)}
                                    class="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm text-sm font-medium"
                                >
                                    <MessageCircle class="w-4 h-4" />
                                    Continue Planning
                                </button>

                                <div class="flex gap-2">
                                    <button
                                        onClick={saveItinerary}
                                        disabled={saveItineraryMutation.isPending}
                                        class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:flex-initial disabled:opacity-50"
                                    >
                                        <Heart class="w-4 h-4" />
                                        <span class="hidden sm:inline">{saveItineraryMutation.isPending ? 'Saving...' : 'Save'}</span>
                                    </button>
                                    <button class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:flex-initial">
                                        <Share2 class="w-4 h-4" />
                                        <span class="hidden sm:inline">Share</span>
                                    </button>
                                    <button class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:flex-initial">
                                        <Download class="w-4 h-4" />
                                        <span class="hidden sm:inline">Export</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar - Mobile First */}
            <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 relative sm:px-6">
                <div class="max-w-7xl mx-auto">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div class="flex items-center gap-4">
                            <button
                                onClick={() => setShowFilters(!showFilters())}
                                class={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${showFilters() ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <Filter class="w-4 h-4" />
                                Filters
                            </button>
                            <div class="text-sm text-gray-600">
                                {filteredCardPOIs().length} places in cards, {filteredMapPOIs().length} on map
                            </div>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar class="w-4 h-4" />
                            <span class="hidden sm:inline">Best visited: May - September</span>
                            <span class="sm:hidden">May - Sep</span>
                        </div>
                    </div>
                    {renderFiltersPanel()}
                </div>
            </div>

            {/* City Information and General POIs - Only show when we have streaming data */}
            <Show when={streamingData() && streamingData().general_city_data}>
                <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6">
                        <div class="grid gap-6 lg:grid-cols-3">
                            {/* City Information */}
                            <div class="lg:col-span-2">
                                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <MapPin class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        About {streamingData()?.general_city_data?.city}
                                    </h2>
                                    <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">
                                        {streamingData()?.general_city_data?.description}
                                    </p>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <Users class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            <div>
                                                <div class="text-xs font-medium text-gray-600 dark:text-gray-300">Population</div>
                                                <div class="text-sm text-gray-900 dark:text-white">{streamingData()?.general_city_data?.population}</div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <MessageCircle class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            <div>
                                                <div class="text-xs font-medium text-gray-600 dark:text-gray-300">Language</div>
                                                <div class="text-sm text-gray-900 dark:text-white">{streamingData()?.general_city_data?.language}</div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <Cloud class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            <div>
                                                <div class="text-xs font-medium text-gray-600 dark:text-gray-300">Weather</div>
                                                <div class="text-sm text-gray-900 dark:text-white">{streamingData()?.general_city_data?.weather}</div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <Clock class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            <div>
                                                <div class="text-xs font-medium text-gray-600 dark:text-gray-300">Timezone</div>
                                                <div class="text-sm text-gray-900 dark:text-white">{streamingData()?.general_city_data?.timezone}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                                <h3 class="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Star class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    Quick Stats
                                </h3>
                                <div class="space-y-4">
                                    <Show when={streamingData()?.points_of_interest}>
                                        <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <span class="text-sm text-gray-700 dark:text-gray-300">Places to explore</span>
                                            <span class="font-semibold text-blue-600 dark:text-blue-400">{streamingData()?.points_of_interest?.length || 0}</span>
                                        </div>
                                    </Show>
                                    <Show when={streamingData()?.itinerary_response?.points_of_interest}>
                                        <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <span class="text-sm text-gray-700 dark:text-gray-300">In your itinerary</span>
                                            <span class="font-semibold text-green-600 dark:text-green-400">{streamingData()?.itinerary_response?.points_of_interest?.length || 0}</span>
                                        </div>
                                    </Show>
                                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <span class="text-sm text-gray-700 dark:text-gray-300">Total area</span>
                                        <span class="font-semibold text-gray-900 dark:text-white">{streamingData()?.general_city_data?.area}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* General POIs Summary */}
                        <Show when={streamingData()?.points_of_interest && streamingData().points_of_interest.length > 0}>
                            <div class="mt-6">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Compass class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        All Points of Interest in {streamingData()?.general_city_data?.city}
                                    </h3>
                                    <span class="text-sm text-gray-500 dark:text-gray-400">
                                        {streamingData()?.points_of_interest?.length} places
                                    </span>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <For each={showAllGeneralPOIs() ? streamingData()?.points_of_interest : streamingData()?.points_of_interest?.slice(0, 6)}>
                                        {(poi) => (
                                            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group">
                                                <div class="flex items-start gap-3">
                                                    <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                                                        {(() => {
                                                            const category = poi.category?.toLowerCase() || '';
                                                            if (category.includes('museum') || category.includes('cultural')) return <Palette class="w-4 h-4 text-blue-600 dark:text-blue-400" />;
                                                            if (category.includes('park') || category.includes('garden')) return <TreePine class="w-4 h-4 text-green-600 dark:text-green-400" />;
                                                            if (category.includes('restaurant') || category.includes('food')) return <Utensils class="w-4 h-4 text-orange-600 dark:text-orange-400" />;
                                                            if (category.includes('hotel') || category.includes('accommodation')) return <Building class="w-4 h-4 text-purple-600 dark:text-purple-400" />;
                                                            return <MapPin class="w-4 h-4 text-blue-600 dark:text-blue-400" />;
                                                        })()}
                                                    </div>
                                                    <div class="flex-1 min-w-0">
                                                        <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{poi.name}</h4>
                                                        <p class="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full w-fit mb-2">{poi.category}</p>
                                                        <p class="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{poi.description_poi}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </For>
                                </div>
                                <Show when={streamingData()?.points_of_interest?.length > 6}>
                                    <div class="mt-4 text-center">
                                        <button
                                            onClick={() => setShowAllGeneralPOIs(!showAllGeneralPOIs())}
                                            class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                                        >
                                            {showAllGeneralPOIs()
                                                ? 'Show less places ↑'
                                                : `View all ${streamingData().points_of_interest.length - 6} remaining places →`
                                            }
                                        </button>
                                    </div>
                                </Show>
                            </div>
                        </Show>
                    </div>
                </div>
            </Show>

            {/* Main Content - Mobile First */}
            <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
                <div class={`grid gap-4 sm:gap-6 ${viewMode() === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                    <Show when={viewMode() === 'map' || viewMode() === 'split'}>
                        <div class={viewMode() === 'map' ? 'col-span-full h-[400px] sm:h-[600px]' : 'h-[300px] sm:h-[500px]'}>
                            {(() => {
                                const mapPOIs = filteredMapPOIs();
                                console.log('=== RENDERING MAP COMPONENT ===');
                                console.log('Map POIs being passed to MapComponent:', mapPOIs);
                                console.log('Map POIs length:', mapPOIs.length);
                                console.log('Center coordinates:', [itinerary().centerLng, itinerary().centerLat]);

                                return (
                                    <MapComponent
                                        center={[itinerary().centerLng, itinerary().centerLat]}
                                        zoom={12}
                                        minZoom={10}
                                        maxZoom={22}
                                        pointsOfInterest={mapPOIs}
                                        style="mapbox://styles/mapbox/streets-v12"
                                    />
                                );
                            })()}
                        </div>
                    </Show>

                    <Show when={viewMode() === 'list' || viewMode() === 'split'}>
                        <div class={viewMode() === 'list' ? 'col-span-full' : ''}>
                            <div class="space-y-4">
                                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div class="flex items-center gap-2">
                                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Your Curated Itinerary</h2>
                                            <Show when={isUpdatingItinerary()}>
                                                <div class="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                                    <Loader2 class="w-4 h-4 animate-spin" />
                                                    <span>Updating...</span>
                                                </div>
                                            </Show>
                                        </div>
                                        <p class="text-sm text-gray-600 dark:text-gray-300">Personalized places to visit based on your preferences</p>
                                    </div>
                                    <button class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 self-start sm:self-auto">
                                        <Edit3 class="w-4 h-4" />
                                        Customize Order
                                    </button>
                                </div>
                                <ItineraryResults
                                    pois={filteredPOIs().map(poi => ({
                                        name: poi.name,
                                        latitude: poi.latitude,
                                        longitude: poi.longitude,
                                        category: poi.category,
                                        description_poi: poi.description,
                                        address: poi.address,
                                        website: poi.website,
                                        opening_hours: poi.openingHours,
                                        rating: poi.rating,
                                        priority: poi.priority,
                                        timeToSpend: poi.timeToSpend,
                                        budget: poi.budget,
                                        distance: 0 // Calculate if needed
                                    }))}
                                    compact={false}
                                    showToggle={filteredPOIs().length > 5}
                                    initialLimit={5}
                                    onFavoriteClick={(poi) => {
                                        console.log('Add to favorites:', poi.name);
                                        // Add your favorite logic here
                                    }}
                                    onShareClick={(poi) => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: poi.name,
                                                text: `Check out ${poi.name} - ${poi.description_poi}`,
                                                url: window.location.href
                                            });
                                        } else {
                                            navigator.clipboard.writeText(`Check out ${poi.name}: ${poi.description_poi}`);
                                        }
                                    }}
                                    favorites={[]} // Add your favorites state here
                                />
                            </div>
                        </div>
                    </Show>
                </div>
            </div>

            {/* Chat Interface - Mobile Optimized */}
            {renderChatInterface()}

            {/* Floating Chat Button - Mobile First */}
            <Show when={!showChat()}>
                <button
                    onClick={() => setShowChat(true)}
                    class="fixed bottom-4 right-4 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center justify-center z-40 sm:bottom-6 sm:right-6 sm:w-14 sm:h-14"
                >
                    <MessageCircle class="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </Show>

            {/* Selected POI Details - Mobile First Modal */}
            <Show when={selectedPOI()}>
                <div class="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
                    <div class="bg-white rounded-t-lg sm:rounded-lg max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
                        <div class="p-4 sm:p-6">
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-lg font-bold text-gray-900 sm:text-xl pr-2">{selectedPOI().name}</h3>
                                    <p class="text-gray-600 text-sm sm:text-base">{selectedPOI().category}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedPOI(null)}
                                    class="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                                >
                                    <X class="w-5 h-5" />
                                </button>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 text-sm">
                                <div class="flex items-center gap-2">
                                    <Clock class="w-4 h-4 text-gray-500" />
                                    <span>{selectedPOI().timeToSpend}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <DollarSign class="w-4 h-4 text-gray-500" />
                                    <span class={getBudgetColor(selectedPOI().budget)}>{selectedPOI().budget}</span>
                                </div>
                                <div class="flex items-center gap-2 col-span-1 sm:col-span-2">
                                    <MapPin class="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <span class="text-xs sm:text-sm">{selectedPOI().address}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Star class="w-4 h-4 text-yellow-500 fill-current" />
                                    <span>{selectedPOI().rating}/5</span>
                                </div>
                            </div>

                            <p class="text-gray-700 mb-4 text-sm sm:text-base">{selectedPOI().description}</p>

                            <div class="flex flex-wrap gap-2 mb-4">
                                <For each={selectedPOI().tags}>
                                    {(tag) => (
                                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                            {tag}
                                        </span>
                                    )}
                                </For>
                            </div>

                            <div class="border-t pt-4">
                                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div class="text-sm text-gray-600">
                                        <p><strong>Hours:</strong> {selectedPOI().openingHours}</p>
                                    </div>
                                    <div class="flex flex-col gap-2 sm:flex-row">
                                        <button
                                            onClick={() => addToTrip(selectedPOI())}
                                            class={`px-4 py-2 rounded-lg text-sm font-medium ${myTrip().some(item => item.id === selectedPOI().id) ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                        >
                                            {myTrip().some(item => item.id === selectedPOI().id) ? 'Added' : 'Add to My Trip'}
                                        </button>
                                        <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                                            Get Directions
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    );
}