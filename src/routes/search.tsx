import { createSignal, createEffect, For, Show, onMount } from 'solid-js';
import { useLocation, useSearchParams } from '@solidjs/router';
import { MapPin, Clock, Star, Filter, Heart, Share2, Download, Edit3, Plus, X, Navigation, Calendar, Users, DollarSign, Camera, Coffee, Utensils, Wifi, CreditCard, Loader2, MessageCircle, Send, Bed, Building2, Car, Waves, Dumbbell, UtensilsCrossed, Shield, Phone } from 'lucide-solid';
import MapComponent from '~/components/features/Map/Map';
import type { AccommodationResponse, HotelDetailedInfo } from '~/lib/api/types';
import { HotelResults } from '~/components/results';
import { TypingAnimation } from '~/components/TypingAnimation';
import ChatInterface from '~/components/ui/ChatInterface';
import { API_BASE_URL } from '~/lib/api/shared';
import { sendUnifiedChatMessageStream } from '~/lib/api/llm';
import { streamingService, createStreamingSession, getDomainRoute } from '~/lib/streaming-service';
import type { StreamingSession, DomainType, UnifiedChatResponse } from '~/lib/api/types';
import { useUserLocation } from '~/contexts/LocationContext';

// Public search interface - no authentication required
export default function PublicSearchPage() {
    const location = useLocation();
    const [urlSearchParams] = useSearchParams();
    const [selectedHotel, setSelectedHotel] = createSignal(null);
    const [showFilters, setShowFilters] = createSignal(false);
    const [viewMode, setViewMode] = createSignal('split'); // 'map', 'list', 'split'
    const [streamingData, setStreamingData] = createSignal<AccommodationResponse | null>(null);
    const [fromChat, setFromChat] = createSignal(false);

    // Chat functionality - simplified for public use
    const [showChat, setShowChat] = createSignal(false);
    const [chatMessage, setChatMessage] = createSignal('');
    const [chatHistory, setChatHistory] = createSignal([]);
    const [isLoading, setIsLoading] = createSignal(false);
    const [sessionId, setSessionId] = createSignal<string | null>(null);
    const [streamingSession, setStreamingSession] = createSignal<StreamingSession | null>(null);

    const { userLocation } = useUserLocation();
    const userLatitude = userLocation()?.latitude || 38.7223;
    const userLongitude = userLocation()?.longitude || -9.1393;

    // Filter states
    const [activeFilters, setActiveFilters] = createSignal({
        types: [],
        priceRange: [],
        amenities: [],
        rating: 0
    });

    // Initialize with streaming data on mount
    onMount(() => {
        console.log('=== PUBLIC SEARCH PAGE MOUNT ===');
        console.log('Location state:', location.state);
        console.log('URL search params:', urlSearchParams);
        
        // Check for URL parameters first (priority for deep linking)
        const urlSessionId = urlSearchParams.sessionId;
        const urlCityName = urlSearchParams.cityName;
        const urlDomain = urlSearchParams.domain;
        
        if (urlSessionId) {
            console.log('Found session ID in URL parameters:', urlSessionId);
            setSessionId(urlSessionId);
            
            // Try to retrieve session data based on URL parameters
            const sessionKey = `public_session_${urlSessionId}`;
            const storedSessionData = sessionStorage.getItem(sessionKey);
            if (storedSessionData) {
                try {
                    const sessionData = JSON.parse(storedSessionData);
                    console.log('Loading public session data from URL parameters:', sessionData);
                    if (sessionData.hotels || sessionData.restaurants || sessionData.activities) {
                        setStreamingData(sessionData);
                        setFromChat(true);
                    }
                } catch (error) {
                    console.error('Error parsing public session data from URL:', error);
                }
            }
        }
        
        // Check for streaming data from route state  
        if (location.state?.streamingData) {
            console.log('Found streaming data in route state');
            setStreamingData(location.state.streamingData as AccommodationResponse);
            setFromChat(true);
            console.log('Received streaming data:', location.state.streamingData);
        } else {
            console.log('No streaming data in route state, checking session storage');
            // Try to get data from session storage
            const storedSession = sessionStorage.getItem('publicStreamingSession');
            console.log('Session storage content:', storedSession);
            
            if (storedSession) {
                try {
                    const session = JSON.parse(storedSession);
                    console.log('Parsed session:', session);
                    
                    if (session.data && (session.data.hotels || session.data.restaurants || session.data.activities)) {
                        console.log('Setting streaming data from session storage');
                        setStreamingData(session.data);
                        setFromChat(true);
                        setStreamingSession(session);
                        setSessionId(session.sessionId);
                    }
                } catch (error) {
                    console.error('Error parsing stored session:', error);
                    sessionStorage.removeItem('publicStreamingSession');
                }
            }
        }

        // Add welcome message to chat
        setChatHistory([
            {
                id: 'welcome-public',
                type: 'assistant',
                content: `Welcome to our public search! I can help you discover amazing places, hotels, restaurants, and activities. Start by typing your destination or what you're looking for.`,
                timestamp: new Date(),
                hasItinerary: false
            }
        ]);
    });

    const sendChatMessage = async () => {
        if (!chatMessage().trim() || isLoading()) return;

        const userMessage = {
            id: `msg-${Date.now()}`,
            type: 'user',
            content: chatMessage().trim(),
            timestamp: new Date()
        };

        setChatHistory(prev => [...prev, userMessage]);
        const messageContent = chatMessage().trim();
        setChatMessage('');
        setIsLoading(true);

        try {
            // Start new public session with guest profile
            console.log('🆕 Starting new public session');
            await startNewPublicSession(messageContent);

        } catch (error) {
            console.error('Error sending message:', error);
            setIsLoading(false);

            const errorMessage = {
                id: `msg-${Date.now()}-error`,
                type: 'error',
                content: 'Sorry, there was an error processing your request. Please try again.',
                timestamp: new Date()
            };
            setChatHistory(prev => [...prev, errorMessage]);
        }
    };

    // Function to start a new public session (no user profile required)
    const startNewPublicSession = async (messageContent: string) => {
        // Create streaming session
        const session = createStreamingSession('general');
        session.query = messageContent;
        setStreamingSession(session);

        // Store session in sessionStorage for persistence
        sessionStorage.setItem('publicStreamingSession', JSON.stringify(session));

        // Start streaming request with guest profile
        const response = await sendUnifiedChatMessageStream({
            profileId: 'guest', // Use guest profile ID
            message: messageContent,
            userLocation: {
                userLat: userLatitude,
                userLon: userLongitude
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Set up streaming manager
        streamingService.startStream(response, {
            session,
            onProgress: (updatedSession) => {
                setStreamingSession(updatedSession);
                sessionStorage.setItem('publicStreamingSession', JSON.stringify(updatedSession));
            },
            onComplete: (completedSession) => {
                setStreamingSession(completedSession);
                setIsLoading(false);

                // Capture session ID from new session
                if (completedSession.sessionId) {
                    console.log('✅ Captured public session ID:', completedSession.sessionId);
                    setSessionId(completedSession.sessionId);
                }

                // Add assistant message with results
                const assistantMessage = {
                    id: `msg-${Date.now()}-response`,
                    type: 'assistant',
                    content: getCompletionMessage(completedSession.domain, completedSession.city),
                    timestamp: new Date(),
                    hasItinerary: true,
                    streamingData: completedSession.data,
                    showResults: true
                };

                setChatHistory(prev => [...prev, assistantMessage]);

                // Store completed session
                sessionStorage.setItem('publicStreamingSession', JSON.stringify(completedSession));

                // Set streaming data for results display
                setStreamingData(completedSession.data);
                setFromChat(true);
            },
            onError: (error) => {
                console.error('Streaming error:', error);
                setIsLoading(false);

                const errorMessage = {
                    id: `msg-${Date.now()}-error`,
                    type: 'error',
                    content: `Sorry, there was an error processing your request: ${error}`,
                    timestamp: new Date()
                };
                setChatHistory(prev => [...prev, errorMessage]);
            }
        });
    };

    const getCompletionMessage = (domain: DomainType, city?: string) => {
        const cityText = city ? `for ${city}` : '';

        switch (domain) {
            case 'accommodation':
                return `Great! I've found some excellent hotel options ${cityText}. Check out the recommendations below.`;
            case 'dining':
                return `Perfect! I've discovered amazing restaurants ${cityText} that you might enjoy. Explore the options below.`;
            case 'activities':
                return `Wonderful! I've curated exciting activities and attractions ${cityText}. Check out the suggestions below.`;
            case 'itinerary':
            case 'general':
            default:
                return `Excellent! I've created recommendations ${cityText} based on your query. Explore the results below.`;
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    };

    return (
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="py-6">
                        <div class="text-center">
                            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                                Discover Amazing Places
                            </h1>
                            <p class="mt-2 text-lg text-gray-600 dark:text-gray-300">
                                Search for hotels, restaurants, activities, and more
                            </p>
                            <p class="mt-1 text-sm text-blue-600 dark:text-blue-400">
                                Public search - no account required
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Interface */}
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="flex-1">
                            <textarea
                                value={chatMessage()}
                                onInput={(e) => setChatMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me about any destination, hotels, restaurants, or activities... (e.g., 'Best hotels in Paris' or 'Things to do in Tokyo')"
                                class="w-full resize-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                                rows="2"
                                disabled={isLoading()}
                            />
                        </div>
                        <button
                            onClick={sendChatMessage}
                            disabled={!chatMessage().trim() || isLoading()}
                            class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            {isLoading() ? (
                                <Loader2 class="w-5 h-5 animate-spin" />
                            ) : (
                                <Send class="w-5 h-5" />
                            )}
                            Search
                        </button>
                    </div>

                    {/* Chat History */}
                    <Show when={chatHistory().length > 0}>
                        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Conversation
                            </h3>
                            <div class="space-y-4 max-h-96 overflow-y-auto">
                                <For each={chatHistory()}>
                                    {(message) => (
                                        <div class={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div class={`max-w-[70%] rounded-lg px-4 py-2 ${
                                                message.type === 'user'
                                                    ? 'bg-blue-600 text-white'
                                                    : message.type === 'error'
                                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                            }`}>
                                                <p class="text-sm">
                                                    <TypingAnimation text={message.content} />
                                                </p>
                                                <p class={`text-xs mt-1 ${
                                                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                    {new Date(message.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                    </Show>
                </div>
            </div>

            {/* Results Section */}
            <Show when={streamingData() && fromChat()}>
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                                Search Results
                            </h2>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                Public search results
                            </div>
                        </div>

                        {/* Display results based on what's available */}
                        <Show when={streamingData()?.hotels && streamingData()?.hotels.length > 0}>
                            <div class="mb-8">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Hotels ({streamingData()?.hotels.length})
                                </h3>
                                <HotelResults
                                    hotels={streamingData()?.hotels}
                                    compact={false}
                                    showToggle={false}
                                    onItemClick={(hotel) => console.log('Hotel clicked:', hotel)}
                                />
                            </div>
                        </Show>

                        <Show when={streamingData()?.restaurants && streamingData()?.restaurants.length > 0}>
                            <div class="mb-8">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Restaurants ({streamingData()?.restaurants.length})
                                </h3>
                                {/* Add RestaurantResults component here */}
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <For each={streamingData()?.restaurants}>
                                        {(restaurant) => (
                                            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                                <h4 class="font-semibold text-gray-900 dark:text-white">
                                                    {restaurant.name}
                                                </h4>
                                                <p class="text-sm text-gray-600 dark:text-gray-300">
                                                    {restaurant.cuisine_type}
                                                </p>
                                                <Show when={restaurant.rating}>
                                                    <div class="flex items-center gap-1 mt-2">
                                                        <Star class="w-4 h-4 text-yellow-500 fill-current" />
                                                        <span class="text-sm text-gray-600 dark:text-gray-300">
                                                            {restaurant.rating}
                                                        </span>
                                                    </div>
                                                </Show>
                                            </div>
                                        )}
                                    </For>
                                </div>
                            </div>
                        </Show>

                        <Show when={streamingData()?.activities && streamingData()?.activities.length > 0}>
                            <div class="mb-8">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Activities ({streamingData()?.activities.length})
                                </h3>
                                {/* Add ActivityResults component here */}
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <For each={streamingData()?.activities}>
                                        {(activity) => (
                                            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                                <h4 class="font-semibold text-gray-900 dark:text-white">
                                                    {activity.name}
                                                </h4>
                                                <p class="text-sm text-gray-600 dark:text-gray-300">
                                                    {activity.category}
                                                </p>
                                                <Show when={activity.rating}>
                                                    <div class="flex items-center gap-1 mt-2">
                                                        <Star class="w-4 h-4 text-yellow-500 fill-current" />
                                                        <span class="text-sm text-gray-600 dark:text-gray-300">
                                                            {activity.rating}
                                                        </span>
                                                    </div>
                                                </Show>
                                            </div>
                                        )}
                                    </For>
                                </div>
                            </div>
                        </Show>

                        <Show when={!streamingData()?.hotels?.length && !streamingData()?.restaurants?.length && !streamingData()?.activities?.length}>
                            <div class="text-center py-8">
                                <div class="text-gray-500 dark:text-gray-400">
                                    No results found. Try a different search query.
                                </div>
                            </div>
                        </Show>
                    </div>
                </div>
            </Show>

            {/* Call-to-action for registration */}
            <div class="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div class="text-center">
                        <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100">
                            Want to save your searches and get personalized recommendations?
                        </h3>
                        <p class="mt-2 text-blue-700 dark:text-blue-200">
                            Create an account to save favorites, access your search history, and get tailored suggestions.
                        </p>
                        <div class="mt-4 space-x-4">
                            <a
                                href="/auth/signup"
                                class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                Sign Up Free
                            </a>
                            <a
                                href="/auth/signin"
                                class="inline-block bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 px-6 py-2 rounded-lg transition-colors"
                            >
                                Sign In
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}