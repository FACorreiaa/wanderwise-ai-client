import { Component, createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Send, Loader2, MapPin } from 'lucide-solid';
import { sendUnifiedChatMessageStream, detectDomain, domainToContextType } from '~/lib/api/llm';
import { streamingService, createStreamingSession, getDomainRoute } from '~/lib/streaming-service';
import type { StreamingSession } from '~/lib/api/types';
import CTA from '~/components/features/Home/CTA';
import ContentGrid from '~/components/features/Home/ContentGrid';
import RealTimeStats from '~/components/features/Home/RealTimeStats';
import MobileAppAnnouncement from '~/components/features/Home/MobileAppAnnouncement';
import LocationPermissionPrompt from '~/components/LocationPermissionPrompt';
import { useUserLocation } from '~/contexts/LocationContext';
import { useDefaultSearchProfile } from '~/lib/api/profiles';


const statsData = {
    badgeText: "This month on Loci",
    items: [
        { value: "69,420", label: "Users registered" },
        { value: "12,109", label: "Personalized Itineraries Saved" },
        { value: "41,004", label: "Unique Points of Interest" },
        // { value: "50+", label: "Supported Cities & Growing" },
    ]
};

const contentData = [
    {
        logo: <span class="text-5xl">🗺️</span>,
        title: "New in Paris: Hidden Gems",
        description: "Our AI has uncovered 15 new unique spots in Le Marais, from artisan shops to quiet courtyards.",
        tag: "New Itinerary",
        tagColorClass: "bg-blue-100 text-blue-800",
        imageUrl: ""
    },
    {
        logo: <span class="text-5xl">🤖</span>,
        title: "AI-Curated: A Foodie's Weekend in Lisbon",
        description: "From classic Pastéis de Nata to modern seafood, let our AI guide your taste buds through Lisbon's best.",
        tag: "AI-Powered",
        tagColorClass: "bg-purple-100 text-purple-800",
        imageUrl: ""
    },
    {
        logo: <span class="text-5xl">⭐️</span>,
        title: "User Favorite: The Ancient Rome Route",
        description: "Explore the Colosseum, Forum, and Palatine Hill with a personalized route optimized for a 4-hour window.",
        tag: "Top Rated",
        tagColorClass: "bg-amber-100 text-amber-800",
        imageUrl: ""
    }
];

const LandingPage: Component = () => {
    const navigate = useNavigate();
    const [currentMessage, setCurrentMessage] = createSignal('');
    const [isLoading, setIsLoading] = createSignal(false);
    const [streamingSession, setStreamingSession] = createSignal<StreamingSession | null>(null);
    const [streamProgress, setStreamProgress] = createSignal('');
    const { userLocation } = useUserLocation()
    const userLatitude = userLocation()?.latitude || 38.7223;
    const userLongitude = userLocation()?.longitude || -9.1393;

    // Get default search profile
    const defaultProfileQuery = useDefaultSearchProfile();
    const profileId = () => defaultProfileQuery.data?.id;



    const sendMessage = async () => {
        if (!currentMessage().trim() || isLoading()) return;

        const messageContent = currentMessage().trim();
        setCurrentMessage('');
        setIsLoading(true);
        setStreamProgress('Analyzing your request...');

        // Clear any previous session data
        sessionStorage.removeItem('currentStreamingSession');
        sessionStorage.removeItem('completedStreamingSession');
        console.log('Cleared previous session data');

        try {
            // Detect domain from the message
            const domain = detectDomain(messageContent);
            console.log('Detected domain:', domain);

            // Create streaming session
            const session = createStreamingSession(domain);
            session.query = messageContent; // Store the user's message
            setStreamingSession(session);

            // Store session in localStorage for persistence
            sessionStorage.setItem('currentStreamingSession', JSON.stringify(session));

            // Get current profile ID
            const currentProfileId = profileId();
            if (!currentProfileId) {
                throw new Error('No default search profile found');
            }

            //Start streaming request
            // const response = await sendUnifiedChatMessageStream({
            //     profileId: currentProfileId,
            //     message: messageContent,
            //     userLocation: {
            //         userLat: userLatitude,
            //         userLon: userLongitude
            //     }
            // });

            const response = await sendUnifiedChatMessageStream({
                profileId: currentProfileId,
                message: messageContent,
                contextType: domainToContextType(domain),
                userLocation: {
                    userLat: userLatitude,
                    userLon: userLongitude
                }
            });

            // Check for navigation data and handle redirect
            // if (response.navigationData) {
            //     console.log('🧭 Navigation data found, redirecting:', response.navigationData);
            //     setIsLoading(false);
            //     setStreamProgress('');

            //     // Extract session data from GraphQL response for state passing
            //     const sessionData = {
            //         sessionId: response.data?.processUnifiedChatMessage?.sessionId,
            //         events: response.data?.processUnifiedChatMessage?.events || [],
            //         fromChat: true,
            //         originalMessage: messageContent
            //     };

            //     // Navigate to the specified URL with session data
            //     navigate(response.navigationData.url, {
            //         state: {
            //             streamingData: sessionData,
            //             fromChat: true,
            //             originalMessage: messageContent
            //         }
            //     });
            //     return; // Exit early to prevent further processing
            // }

            console.log('No navigation data found, continuing with normal flow...');

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

                    // Store completed session
                    sessionStorage.setItem('completedStreamingSession', JSON.stringify(completedSession));

                    // Navigate to appropriate page based on domain
                    const route = getDomainRoute(completedSession.domain);
                    navigate(route, {
                        state: {
                            streamingData: completedSession.data,
                            fromChat: true,
                            originalMessage: messageContent
                        }
                    });
                },
                onError: (error) => {
                    console.error('Streaming error:', error);
                    setIsLoading(false);
                    setStreamProgress('');
                    setStreamingSession(null);
                }
            });

        } catch (error) {
            console.error('Error sending message:', error);
            setIsLoading(false);
            setStreamProgress('');
            setStreamingSession(null);
        }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div class="min-h-screen bg-white dark:bg-slate-950 transition-colors">

            {/* Main Hero Section with Chat Input */}
            <div class="relative">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
                    <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        Discover your next adventure,{' '}
                        <span class="text-sky-700 dark:text-sky-300">
                            smarter
                        </span>
                    </h1>
                    <p class="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
                        Tired of generic city guides? Loci creates hyper-personalized travel plans based on your unique interests and real-time context.
                    </p>

                    {/* Main Chat Input */}
                    <div class="max-w-2xl mx-auto mb-8">
                        <div class="flex items-end gap-3 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div class="flex-1">
                                <textarea
                                    value={currentMessage()}
                                    onInput={(e) => setCurrentMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Where to? e.g., 'art museums in Paris', 'walk in Madrid', 'best food in Tokyo'"
                                    class="w-full resize-none border-0 bg-transparent focus:ring-0 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    rows="2"
                                    disabled={isLoading()}
                                />
                            </div>
                            <button
                                onClick={sendMessage}
                                disabled={!currentMessage().trim() || isLoading()}
                                class="bg-[#0c7df2] text-white p-3 rounded-xl hover:bg-[#0a6ed6] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-[0_12px_32px_rgba(12,125,242,0.22)] border border-white/30 dark:border-slate-800/60"
                            >
                                <Show when={isLoading()} fallback={<Send class="w-5 h-5" />}>
                                    <Loader2 class="w-5 h-5 animate-spin" />
                                </Show>
                            </button>
                        </div>

                        {/* Streaming Progress */}
                        <Show when={isLoading() && streamProgress()}>
                            <div class="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
                                <div class="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <Loader2 class="w-5 h-5 animate-spin text-blue-600" />
                                    <span class="text-sm font-medium">{streamProgress()}</span>
                                </div>

                                <Show when={streamingSession()}>
                                    <div class="mt-3 text-xs text-gray-500 dark:text-gray-400 space-y-1">
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
                                    </div>
                                </Show>
                            </div>
                        </Show>

                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-3">
                            Press Enter to send, Shift+Enter for new line
                        </p>
                    </div>

                    {/* Quick Prompt Cards */}
                    <Show when={!isLoading()}>
                        <div class="max-w-4xl mx-auto mt-12">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
                                Try these popular searches:
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <button
                                    onClick={() => {
                                        setCurrentMessage("Hidden gems in Paris");
                                        sendMessage();
                                    }}
                                    class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group text-left"
                                >
                                    <div class="flex items-start gap-3">
                                        <span class="text-2xl">🌟</span>
                                        <div>
                                            <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                Hidden gems in Paris
                                            </h4>
                                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Discover off-the-beaten-path spots
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        setCurrentMessage("Best food markets in Italy");
                                        sendMessage();
                                    }}
                                    class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group text-left"
                                >
                                    <div class="flex items-start gap-3">
                                        <span class="text-2xl">🍕</span>
                                        <div>
                                            <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                Best food markets in Italy
                                            </h4>
                                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Authentic local markets and food
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        setCurrentMessage("3-day cultural tour of Rome");
                                        sendMessage();
                                    }}
                                    class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group text-left"
                                >
                                    <div class="flex items-start gap-3">
                                        <span class="text-2xl">🏛️</span>
                                        <div>
                                            <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                3-day cultural tour of Rome
                                            </h4>
                                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Museums, history, and architecture
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        setCurrentMessage("Family weekend in Amsterdam");
                                        sendMessage();
                                    }}
                                    class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group text-left"
                                >
                                    <div class="flex items-start gap-3">
                                        <span class="text-2xl">👨‍👩‍👧‍👦</span>
                                        <div>
                                            <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                Family weekend in Amsterdam
                                            </h4>
                                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Kid-friendly activities and places
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* Additional row of prompt cards */}
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                <button
                                    onClick={() => {
                                        setCurrentMessage("Instagram spots in Santorini");
                                        sendMessage();
                                    }}
                                    class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group text-left"
                                >
                                    <div class="flex items-start gap-3">
                                        <span class="text-2xl">📸</span>
                                        <div>
                                            <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                Instagram spots in Santorini
                                            </h4>
                                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Most photogenic locations
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        setCurrentMessage("Best hotels in Tokyo");
                                        sendMessage();
                                    }}
                                    class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group text-left"
                                >
                                    <div class="flex items-start gap-3">
                                        <span class="text-2xl">🏨</span>
                                        <div>
                                            <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                Best hotels in Tokyo
                                            </h4>
                                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Accommodation recommendations
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        setCurrentMessage("Walk in Madrid");
                                        sendMessage();
                                    }}
                                    class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group text-left"
                                >
                                    <div class="flex items-start gap-3">
                                        <span class="text-2xl">🚶‍♂️</span>
                                        <div>
                                            <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                Walk in Madrid
                                            </h4>
                                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Explore the city on foot
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        setCurrentMessage("Nightlife in Berlin");
                                        sendMessage();
                                    }}
                                    class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group text-left"
                                >
                                    <div class="flex items-start gap-3">
                                        <span class="text-2xl">🎭</span>
                                        <div>
                                            <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                Nightlife in Berlin
                                            </h4>
                                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Bars, clubs, and entertainment
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </Show>
                </div>
            </div>

            <RealTimeStats badgeText={statsData.badgeText} />
            <ContentGrid items={contentData} />
            <MobileAppAnnouncement />
            <CTA />

            {/* Location Permission Prompt */}
            <LocationPermissionPrompt
                onPermissionGranted={() => {
                    console.log('Location permission granted');
                }}
                onPermissionDenied={() => {
                    console.log('Location permission denied');
                }}
            />
        </div>
    );
};

export default LandingPage;
