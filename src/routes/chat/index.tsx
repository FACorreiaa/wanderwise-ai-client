import { createSignal, createEffect, For, Show, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { MessageCircle, Send, Bot, User, MapPin, Clock, Star, Heart, Download, Share2, Copy, Trash2, Plus, Loader2, Sparkles, Globe, Calendar, Users } from 'lucide-solid';
import { sendUnifiedChatMessageStream, detectDomain } from '~/lib/api/llm';
import { streamingService, createStreamingSession, getDomainRoute } from '~/lib/streaming-service';
import type { StreamingSession, DomainType, UnifiedChatResponse } from '~/lib/api/types';
import { useUserLocation } from '~/contexts/LocationContext';

export default function ChatPage() {
    const navigate = useNavigate();
    const [messages, setMessages] = createSignal([]);
    const [currentMessage, setCurrentMessage] = createSignal('');
    const [isLoading, setIsLoading] = createSignal(false);
    const [sessionId, setSessionId] = createSignal(null);
    const [activeProfile, setActiveProfile] = createSignal('Solo Explorer');
    const [showProfileSelector, setShowProfileSelector] = createSignal(false);
    const [generatedItinerary, setGeneratedItinerary] = createSignal(null);
    const [chatSessions, setChatSessions] = createSignal([]);
    const [selectedSession, setSelectedSession] = createSignal(null);
    const [streamingSession, setStreamingSession] = createSignal(null);
    const [streamProgress, setStreamProgress] = createSignal('');


    const { userLocation } = useUserLocation()
    const userLatitude = userLocation()?.latitude || 38.7223;
    const userLongitude = userLocation()?.longitude || -9.1393;
    // Sample chat sessions
    const [sessions] = createSignal([
        {
            id: 'session-1',
            title: 'Porto Weekend Trip',
            preview: 'Looking for hidden gems in Porto...',
            timestamp: '2024-01-20T14:30:00Z',
            messageCount: 8,
            hasItinerary: true
        },
        {
            id: 'session-2',
            title: 'Family Trip to London',
            preview: 'Planning activities for kids...',
            timestamp: '2024-01-18T10:15:00Z',
            messageCount: 12,
            hasItinerary: true
        },
        {
            id: 'session-3',
            title: 'Food Tour Barcelona',
            preview: 'Best tapas restaurants...',
            timestamp: '2024-01-15T16:45:00Z',
            messageCount: 6,
            hasItinerary: false
        }
    ]);

    const profiles = [
        { id: 'solo', name: 'Solo Explorer', icon: '🎒', description: 'Independent travel focused' },
        { id: 'foodie', name: 'Foodie Adventure', icon: '🍽️', description: 'Culinary experiences' },
        { id: 'family', name: 'Family Fun', icon: '👨‍👩‍👧‍👦', description: 'Family-friendly activities' },
        { id: 'culture', name: 'Culture Seeker', icon: '🎨', description: 'Museums and arts' }
    ];

    const quickPrompts = [
        {
            icon: '🌟',
            text: 'Hidden gems in Paris',
            description: 'Discover off-the-beaten-path spots'
        },
        {
            icon: '🍕',
            text: 'Best food markets in Italy',
            description: 'Authentic local markets and food'
        },
        {
            icon: '🏛️',
            text: '3-day cultural tour of Rome',
            description: 'Museums, history, and architecture'
        },
        {
            icon: '👨‍👩‍👧‍👦',
            text: 'Family weekend in Amsterdam',
            description: 'Kid-friendly activities and places'
        },
        {
            icon: '📸',
            text: 'Instagram spots in Santorini',
            description: 'Most photogenic locations'
        },
        {
            icon: '🎭',
            text: 'Nightlife in Berlin',
            description: 'Bars, clubs, and entertainment'
        }
    ];

    // Initialize chat
    onMount(() => {
        // Add welcome message
        setMessages([
            {
                id: 'welcome',
                type: 'assistant',
                content: `Hello! I'm your AI travel assistant. I'll help you discover amazing places and create personalized itineraries based on your preferences.\n\nCurrently using your "${activeProfile()}" profile. What would you like to explore today?`,
                timestamp: new Date(),
                hasItinerary: false
            }
        ]);
    });

    const sendMessage = async () => {
        if (!currentMessage().trim() || isLoading()) return;

        const userMessage = {
            id: `msg-${Date.now()}`,
            type: 'user',
            content: currentMessage().trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const messageContent = currentMessage().trim();
        setCurrentMessage('');
        setIsLoading(true);
        setStreamProgress('Analyzing your request...');

        try {
            // Detect domain from the message
            const domain = detectDomain(messageContent);
            console.log('Detected domain:', domain);

            // Create streaming session
            const session = createStreamingSession(domain);
            session.query = messageContent;
            setStreamingSession(session);

            // Store session in localStorage for persistence
            sessionStorage.setItem('currentStreamingSession', JSON.stringify(session));

            // Start streaming request
            const response = await sendUnifiedChatMessageStream({
                profileId: '6ee5dc90-dd72-4dc8-b064-4ecbdd35d845', // TODO: Get from auth context
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

                    // Update progress message based on domain and progress
                    const domain = updatedSession.domain;
                    if (updatedSession.data.general_city_data) {
                        setStreamProgress(`Found information about ${updatedSession.data.general_city_data.city}...`);
                    } else if (domain === 'accommodation') {
                        setStreamProgress('Finding hotels...');
                    } else if (domain === 'dining') {
                        setStreamProgress('Searching restaurants...');
                    } else if (domain === 'activities') {
                        setStreamProgress('Discovering activities...');
                    } else {
                        setStreamProgress('Creating your itinerary...');
                    }

                    // Update session storage
                    sessionStorage.setItem('currentStreamingSession', JSON.stringify(updatedSession));
                },
                onComplete: (completedSession) => {
                    setStreamingSession(completedSession);
                    setIsLoading(false);
                    setStreamProgress('');

                    // Add assistant message
                    const assistantMessage = {
                        id: `msg-${Date.now()}-response`,
                        type: 'assistant',
                        content: getCompletionMessage(completedSession.domain, completedSession.city),
                        timestamp: new Date(),
                        hasItinerary: true,
                        streamingData: completedSession.data
                    };

                    setMessages(prev => [...prev, assistantMessage]);

                    // Store completed session
                    sessionStorage.setItem('completedStreamingSession', JSON.stringify(completedSession));

                    // Navigate to appropriate page after a short delay
                    setTimeout(() => {
                        const route = getDomainRoute(completedSession.domain);
                        navigate(route, { state: { streamingData: completedSession.data, fromChat: true } });
                    }, 2000);
                },
                onError: (error) => {
                    console.error('Streaming error:', error);
                    setIsLoading(false);
                    setStreamProgress('');

                    const errorMessage = {
                        id: `msg-${Date.now()}-error`,
                        type: 'error',
                        content: `Sorry, there was an error processing your request: ${error}`,
                        timestamp: new Date()
                    };
                    setMessages(prev => [...prev, errorMessage]);
                },
                onRedirect: (domain, data) => {
                    // This will be called when streaming completes
                    console.log('Streaming complete, redirecting to:', domain, data);
                }
            });

        } catch (error) {
            console.error('Error sending message:', error);
            setIsLoading(false);
            setStreamProgress('');

            const errorMessage = {
                id: `msg-${Date.now()}-error`,
                type: 'error',
                content: 'Sorry, there was an error processing your request. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    const getCompletionMessage = (domain: DomainType, city?: string) => {
        const cityText = city ? `for ${city}` : '';

        switch (domain) {
            case 'accommodation':
                return `Great! I've found some excellent hotel options ${cityText}. Click below to view all recommendations and book your stay.`;
            case 'dining':
                return `Perfect! I've discovered amazing restaurants ${cityText} that match your preferences. Explore the full list to find your next dining experience.`;
            case 'activities':
                return `Wonderful! I've curated exciting activities and attractions ${cityText}. Check out all the options to plan your perfect day.`;
            case 'itinerary':
            case 'general':
            default:
                return `Excellent! I've created a personalized itinerary ${cityText} based on your preferences. View the complete plan with all the details, maps, and recommendations.`;
        }
    };

    const generateResponse = (userInput) => {
        const input = userInput.toLowerCase();

        if (input.includes('porto') || input.includes('portugal')) {
            return {
                text: `Great choice! Porto is a fantastic destination. Based on your "${activeProfile()}" profile, I've created a personalized itinerary focusing on cultural experiences and local favorites.\n\nHere's what I recommend for your Porto adventure:`,
                hasItinerary: true,
                itinerary: {
                    title: "Porto Cultural Discovery",
                    duration: "3 days",
                    description: "A perfect blend of history, culture, and local experiences in Porto",
                    places: [
                        {
                            name: "Livraria Lello",
                            category: "Bookstore & Architecture",
                            description: "One of the world's most beautiful bookstores with stunning neo-gothic architecture.",
                            timeToSpend: "1-2 hours",
                            budget: "€€",
                            rating: 4.2,
                            priority: 1
                        },
                        {
                            name: "Ponte Luís I",
                            category: "Landmark",
                            description: "Iconic double-deck iron bridge offering spectacular views.",
                            timeToSpend: "30-60 minutes",
                            budget: "Free",
                            rating: 4.6,
                            priority: 1
                        },
                        {
                            name: "Cais da Ribeira",
                            category: "Historic District",
                            description: "UNESCO World Heritage waterfront district with colorful buildings.",
                            timeToSpend: "2-3 hours",
                            budget: "€€",
                            rating: 4.5,
                            priority: 1
                        }
                    ]
                }
            };
        }

        if (input.includes('food') || input.includes('restaurant') || input.includes('eat')) {
            return {
                text: `I love helping food enthusiasts! Based on your preferences, here are some amazing culinary experiences I recommend. These places offer authentic local flavors and memorable dining experiences.\n\nWould you like me to create a detailed food tour itinerary for any specific city?`,
                hasItinerary: false
            };
        }

        if (input.includes('family') || input.includes('kids') || input.includes('children')) {
            return {
                text: `Perfect! Family travel requires special considerations. I'll focus on kid-friendly activities, accessible locations, and places that keep everyone entertained.\n\nWhich destination are you considering for your family trip? I can create an itinerary with activities suitable for all ages.`,
                hasItinerary: false
            };
        }

        // Default response
        return {
            text: `Thanks for your question! I'm here to help you plan amazing travel experiences. I can assist with:\n\n• Finding hidden gems and popular attractions\n• Creating personalized itineraries\n• Restaurant and accommodation recommendations\n• Local insights and travel tips\n\nWhat specific destination or type of experience are you interested in exploring?`,
            hasItinerary: false
        };
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const useQuickPrompt = (prompt) => {
        setCurrentMessage(prompt.text);
        sendMessage();
    };

    const saveItinerary = () => {
        if (!generatedItinerary()) return;
        // Implement save functionality
        console.log('Saving itinerary:', generatedItinerary());
    };

    const shareItinerary = () => {
        if (!generatedItinerary()) return;
        // Implement share functionality
        console.log('Sharing itinerary:', generatedItinerary());
    };

    const downloadItinerary = () => {
        if (!generatedItinerary()) return;
        // Implement download functionality
        console.log('Downloading itinerary:', generatedItinerary());
    };

    const newChat = () => {
        setMessages([
            {
                id: 'welcome-new',
                type: 'assistant',
                content: `Hello! I'm ready to help you plan your next adventure. What would you like to explore today?`,
                timestamp: new Date(),
                hasItinerary: false
            }
        ]);
        setGeneratedItinerary(null);
        setSessionId(null);
        setSelectedSession(null);
    };

    const loadSession = (session) => {
        setSelectedSession(session);
        // In a real app, you would load the session messages from the backend
        setMessages([
            {
                id: 'session-loaded',
                type: 'assistant',
                content: `Continuing our conversation about "${session.title}". How can I help you further with this trip?`,
                timestamp: new Date(),
                hasItinerary: session.hasItinerary
            }
        ]);
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderMessage = (message) => (
        <div class={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.type === 'assistant' && (
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot class="w-4 h-4 text-white" />
                </div>
            )}

            <div class={`max-w-[70%] ${message.type === 'user' ? 'order-1' : ''}`}>
                <div class={`rounded-2xl px-4 py-3 ${message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'error'
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                    <p class="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Streaming data preview */}
                <Show when={message.hasItinerary && (message.itinerary || message.streamingData)}>
                    <div class="mt-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <Show when={message.streamingData} fallback={
                            // Legacy itinerary display
                            <div>
                                <div class="flex items-center justify-between mb-3">
                                    <div>
                                        <h4 class="font-semibold text-gray-900 dark:text-white">{message.itinerary?.title}</h4>
                                        <p class="text-sm text-gray-600 dark:text-gray-300">{message.itinerary?.duration} • {message.itinerary?.places?.length} places</p>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button
                                            onClick={saveItinerary}
                                            class="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                            title="Save itinerary"
                                        >
                                            <Heart class="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={shareItinerary}
                                            class="p-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                                            title="Share itinerary"
                                        >
                                            <Share2 class="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={downloadItinerary}
                                            class="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg"
                                            title="Download itinerary"
                                        >
                                            <Download class="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <For each={message.itinerary?.places?.slice(0, 3)}>
                                        {(place) => (
                                            <div class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <div class={`w-6 h-6 rounded-full ${place.priority === 1 ? 'bg-red-500' : 'bg-blue-500'} flex items-center justify-center text-white text-xs`}>
                                                    {place.priority}
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{place.name}</p>
                                                    <p class="text-xs text-gray-500 dark:text-gray-400">{place.category} • {place.timeToSpend}</p>
                                                </div>
                                                <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                    <Star class="w-3 h-3 text-yellow-500 dark:text-yellow-400 fill-current" />
                                                    <span>{place.rating}</span>
                                                </div>
                                            </div>
                                        )}
                                    </For>

                                    <Show when={message.itinerary?.places?.length > 3}>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                                            +{message.itinerary.places.length - 3} more places
                                        </p>
                                    </Show>
                                </div>

                                <button class="w-full mt-3 cb-button cb-button-primary py-2 text-sm">
                                    View Full Itinerary
                                </button>
                            </div>
                        }>
                            {/* New streaming data display */}
                            <div>
                                <Show when={message.streamingData.general_city_data}>
                                    <div class="flex items-center justify-between mb-3">
                                        <div>
                                            <h4 class="font-semibold text-gray-900 dark:text-white">
                                                {message.streamingData.itinerary_response?.itinerary_name || `${message.streamingData.general_city_data.city} Guide`}
                                            </h4>
                                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                                {message.streamingData.general_city_data.city}, {message.streamingData.general_city_data.country}
                                                {message.streamingData.points_of_interest && ` • ${message.streamingData.points_of_interest.length} places`}
                                            </p>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <button class="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Save">
                                                <Heart class="w-4 h-4" />
                                            </button>
                                            <button class="p-2 text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Share">
                                                <Share2 class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Preview of POIs */}
                                    <Show when={message.streamingData.points_of_interest || message.streamingData.itinerary_response?.points_of_interest}>
                                        <div class="space-y-2 mb-3">
                                            <For each={(message.streamingData.itinerary_response?.points_of_interest || message.streamingData.points_of_interest)?.slice(0, 3)}>
                                                {(poi) => (
                                                    <div class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                                                            <MapPin class="w-3 h-3" />
                                                        </div>
                                                        <div class="flex-1 min-w-0">
                                                            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{poi.name}</p>
                                                            <p class="text-xs text-gray-500 dark:text-gray-400">{poi.category}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </For>

                                            <Show when={(message.streamingData.itinerary_response?.points_of_interest || message.streamingData.points_of_interest)?.length > 3}>
                                                <p class="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                                                    +{(message.streamingData.itinerary_response?.points_of_interest || message.streamingData.points_of_interest).length - 3} more places
                                                </p>
                                            </Show>
                                        </div>
                                    </Show>
                                </Show>

                                {/* Domain-specific previews */}
                                <Show when={message.streamingData.hotels}>
                                    <div class="mb-3">
                                        <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Hotel Recommendations</h4>
                                        <div class="space-y-2">
                                            <For each={message.streamingData.hotels.slice(0, 3)}>
                                                {(hotel) => (
                                                    <div class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <div class="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                                                            🏨
                                                        </div>
                                                        <div class="flex-1 min-w-0">
                                                            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{hotel.name}</p>
                                                            <p class="text-xs text-gray-500 dark:text-gray-400">{hotel.category} • {hotel.price_range}</p>
                                                        </div>
                                                        <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                            <Star class="w-3 h-3 text-yellow-500 dark:text-yellow-400 fill-current" />
                                                            <span>{hotel.rating}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </For>
                                        </div>
                                    </div>
                                </Show>

                                <Show when={message.streamingData.restaurants}>
                                    <div class="mb-3">
                                        <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Restaurant Recommendations</h4>
                                        <div class="space-y-2">
                                            <For each={message.streamingData.restaurants.slice(0, 3)}>
                                                {(restaurant) => (
                                                    <div class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <div class="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">
                                                            🍽️
                                                        </div>
                                                        <div class="flex-1 min-w-0">
                                                            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{restaurant.name}</p>
                                                            <p class="text-xs text-gray-500 dark:text-gray-400">{restaurant.cuisine_type} • {restaurant.price_range}</p>
                                                        </div>
                                                        <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                            <Star class="w-3 h-3 text-yellow-500 dark:text-yellow-400 fill-current" />
                                                            <span>{restaurant.rating}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </For>
                                        </div>
                                    </div>
                                </Show>

                                <Show when={message.streamingData.activities}>
                                    <div class="mb-3">
                                        <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Activity Recommendations</h4>
                                        <div class="space-y-2">
                                            <For each={message.streamingData.activities.slice(0, 3)}>
                                                {(activity) => (
                                                    <div class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                                                            🎯
                                                        </div>
                                                        <div class="flex-1 min-w-0">
                                                            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.name}</p>
                                                            <p class="text-xs text-gray-500 dark:text-gray-400">{activity.category} • {activity.budget}</p>
                                                        </div>
                                                        <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                            <Star class="w-3 h-3 text-yellow-500 dark:text-yellow-400 fill-current" />
                                                            <span>{activity.rating}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </For>
                                        </div>
                                    </div>
                                </Show>

                                <button
                                    class="w-full mt-3 cb-button cb-button-primary py-2 text-sm"
                                    onClick={() => {
                                        // Navigate to appropriate page with streaming data
                                        const session = JSON.parse(sessionStorage.getItem('completedStreamingSession') || '{}');
                                        if (session.data) {
                                            const route = getDomainRoute(session.domain);
                                            navigate(route, { state: { streamingData: session.data, fromChat: true } });
                                        }
                                    }}
                                >
                                    View Full Results →
                                </button>
                            </div>
                        </Show>
                    </div>
                </Show>

                <p class={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100 text-right' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formatTimestamp(message.timestamp)}
                </p>
            </div>

            {message.type === 'user' && (
                <div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <User class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
            )}
        </div>
    );

    return (
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            {/* Sidebar - Chat History */}
            <div class="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                {/* Sidebar Header */}
                <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h2>
                        <button
                            onClick={newChat}
                            class="cb-button cb-button-primary p-2"
                            title="New chat"
                        >
                            <Plus class="w-4 h-4" />
                        </button>
                    </div>

                    {/* Profile Selector */}
                    <div class="relative">
                        <button
                            onClick={() => setShowProfileSelector(!showProfileSelector())}
                            class="w-full flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                                🎒
                            </div>
                            <div class="flex-1 text-left">
                                <p class="text-sm font-medium text-gray-900 dark:text-white">{activeProfile()}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Active profile</p>
                            </div>
                        </button>

                        <Show when={showProfileSelector()}>
                            <div class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                <For each={profiles}>
                                    {(profile) => (
                                        <button
                                            onClick={() => {
                                                setActiveProfile(profile.name);
                                                setShowProfileSelector(false);
                                            }}
                                            class={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${activeProfile() === profile.name ? 'bg-blue-50 text-blue-700' : 'text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            <span class="text-lg">{profile.icon}</span>
                                            <div class="flex-1 text-left">
                                                <p class="text-sm font-medium">{profile.name}</p>
                                                <p class="text-xs text-gray-500 dark:text-gray-400">{profile.description}</p>
                                            </div>
                                        </button>
                                    )}
                                </For>
                            </div>
                        </Show>
                    </div>
                </div>

                {/* Chat Sessions */}
                <div class="flex-1 overflow-y-auto">
                    <div class="p-4">
                        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Conversations</h3>
                        <div class="space-y-2">
                            <For each={sessions()}>
                                {(session) => (
                                    <button
                                        onClick={() => loadSession(session)}
                                        class={`w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${selectedSession()?.id === session.id ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                                            }`}
                                    >
                                        <div class="flex items-start justify-between mb-1">
                                            <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">{session.title}</h4>
                                            <Show when={session.hasItinerary}>
                                                <Sparkles class="w-3 h-3 text-purple-500 dark:text-purple-400 flex-shrink-0 ml-2" />
                                            </Show>
                                        </div>
                                        <p class="text-xs text-gray-600 dark:text-gray-300 truncate mb-2">{session.preview}</p>
                                        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>{formatTimestamp(session.timestamp)}</span>
                                            <span>{session.messageCount} messages</span>
                                        </div>
                                    </button>
                                )}
                            </For>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div class="flex-1 flex flex-col">
                {/* Chat Header */}
                <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <Bot class="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 class="text-lg font-semibold text-gray-900 dark:text-white">AI Travel Assistant</h1>
                                <p class="text-sm text-gray-600 dark:text-gray-300">Get personalized travel recommendations</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="text-xs text-gray-500 dark:text-gray-400">Using:</span>
                            <span class="text-xs font-medium text-blue-600">{activeProfile()}</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div class="flex-1 overflow-y-auto p-4 space-y-4">
                    <For each={messages()}>
                        {(message) => renderMessage(message)}
                    </For>

                    {/* Loading indicator with streaming progress */}
                    <Show when={isLoading()}>
                        <div class="flex gap-3 justify-start">
                            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <Bot class="w-4 h-4 text-white" />
                            </div>
                            <div class="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 max-w-md">
                                <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                                    <Loader2 class="w-4 h-4 animate-spin" />
                                    <span class="text-sm">
                                        {streamProgress() || 'Processing your request...'}
                                    </span>
                                </div>

                                {/* Streaming session progress */}
                                <Show when={streamingSession()}>
                                    <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                        <div class="flex items-center gap-2">
                                            <span class="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                            <span>Domain: {streamingSession()?.domain}</span>
                                        </div>
                                        <Show when={streamingSession()?.city}>
                                            <div class="flex items-center gap-2">
                                                <MapPin class="w-3 h-3" />
                                                <span>City: {streamingSession()?.city}</span>
                                            </div>
                                        </Show>
                                        <Show when={streamingSession()?.sessionId}>
                                            <div class="flex items-center gap-2">
                                                <span class="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                                <span>Session: Active</span>
                                            </div>
                                        </Show>
                                    </div>
                                </Show>
                            </div>
                        </div>
                    </Show>

                    {/* Quick Prompts - Show when no conversation */}
                    <Show when={messages().length <= 1 && !isLoading()}>
                        <div class="max-w-4xl mx-auto">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Try asking about:</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <For each={quickPrompts}>
                                    {(prompt) => (
                                        <button
                                            onClick={() => useQuickPrompt(prompt)}
                                            class="cb-card hover:shadow-md transition-all duration-200 p-4 text-left"
                                        >
                                            <div class="flex items-start gap-3">
                                                <span class="text-2xl">{prompt.icon}</span>
                                                <div>
                                                    <h4 class="font-medium text-gray-900 dark:text-white mb-1">{prompt.text}</h4>
                                                    <p class="text-sm text-gray-600 dark:text-gray-300">{prompt.description}</p>
                                                </div>
                                            </div>
                                        </button>
                                    )}
                                </For>
                            </div>
                        </div>
                    </Show>
                </div>

                {/* Message Input */}
                <div class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                    <div class="max-w-4xl mx-auto">
                        <div class="flex items-end gap-3">
                            <div class="flex-1">
                                <textarea
                                    value={currentMessage()}
                                    onInput={(e) => setCurrentMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me about destinations, activities, or let me create an itinerary for you..."
                                    class="w-full resize-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                                    rows="2"
                                    disabled={isLoading()}
                                />
                            </div>
                            <button
                                onClick={sendMessage}
                                disabled={!currentMessage().trim() || isLoading()}
                                class="cb-button cb-button-primary px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send class="w-4 h-4" />
                                Send
                            </button>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                            Press Enter to send, Shift+Enter for new line
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}