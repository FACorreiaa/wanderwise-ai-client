import { createSignal, createEffect, For, Show, onMount } from 'solid-js';
import { useLocation } from '@solidjs/router';
import { MapPin, Clock, Star, Filter, Heart, Share2, Download, Edit3, Plus, X, Navigation, Calendar, Users, DollarSign, Camera, Coffee, Utensils, Wifi, CreditCard, Loader2, MessageCircle, Send, Compass, Map, Zap, Mountain, Palette, Music } from 'lucide-solid';
import MapComponent from '~/components/features/Map/Map';
// Removed old API imports - now using unified streaming endpoint only
import type { ActivitiesResponse, POIDetailedInfo } from '~/lib/api/types';
import { useUserLocation } from '@/contexts/LocationContext';
import { ActivityResults } from '~/components/results';

export default function ActivitiesPage() {
    const location = useLocation();
    const [selectedActivity, setSelectedActivity] = createSignal(null);
    const [showFilters, setShowFilters] = createSignal(false);
    const [viewMode, setViewMode] = createSignal('split'); // 'map', 'list', 'split'
    const [myFavorites, setMyFavorites] = createSignal([]); // Track favorite activities
    const [streamingData, setStreamingData] = createSignal<ActivitiesResponse | null>(null);
    const [fromChat, setFromChat] = createSignal(false);

    // Chat functionality
    const [showChat, setShowChat] = createSignal(false);
    const [chatMessage, setChatMessage] = createSignal('');
    const [chatHistory, setChatHistory] = createSignal([]);
    const [isLoading, setIsLoading] = createSignal(false);
    const [sessionId, setSessionId] = createSignal('activities-session-id');


    const { userLocation } = useUserLocation()
    const userLatitude = userLocation()?.latitude || 38.7223;
    const userLongitude = userLocation()?.longitude || -9.1393;
    // Filter states
    const [activeFilters, setActiveFilters] = createSignal({
        categories: [], // Start with no filters active so all activities show initially
        priceRange: [],
        features: [],
        rating: 0
    });

    // Search parameters
    const [searchParams, setSearchParams] = createSignal({
        location: "Lisboa, Portugal",
        centerLat: userLatitude,
        centerLng: userLongitude
    });

    // Removed old API hooks - now using unified streaming endpoint only

    // Initialize with streaming data on mount
    onMount(() => {
        console.log('=== ACTIVITIES PAGE MOUNT ===');
        console.log('Location state:', location.state);

        // Check for streaming data from route state  
        if (location.state?.streamingData) {
            console.log('Found activities streaming data in route state');
            setStreamingData(location.state.streamingData as ActivitiesResponse);
            setFromChat(true);
            console.log('Received activities data:', location.state.streamingData);
        } else {
            console.log('No streaming data in route state, checking session storage');
            // Try to get data from session storage
            const storedSession = sessionStorage.getItem('completedStreamingSession');
            console.log('Session storage content:', storedSession);

            if (storedSession) {
                try {
                    const session = JSON.parse(storedSession);
                    console.log('Parsed session:', session);

                    if (session.data && session.data.activities) {
                        console.log('Setting activities data from session storage');
                        setStreamingData(session.data as ActivitiesResponse);
                        setFromChat(true);
                        console.log('Loaded activities data from session storage:', session.data);
                    } else {
                        console.log('No activities data found in session');
                    }
                } catch (error) {
                    console.error('Error parsing stored session:', error);
                }
            } else {
                console.log('No stored session found');
            }
        }
    });

    const activities = () => {
        // Prioritize streaming data if available
        const streaming = streamingData();
        if (streaming && streaming.activities && streaming.activities.length > 0) {
            console.log('Using streaming activities data:', streaming.activities);
            return streaming.activities.map(convertActivityToDisplayFormat);
        }

        // No fallback API data - only streaming data is used
        return [];
    };

    // Convert streaming activity data to display format
    const convertActivityToDisplayFormat = (activity: POIDetailedInfo) => {
        return {
            id: activity.id,
            name: activity.name,
            category: activity.category,
            description: activity.description,
            latitude: activity.latitude,
            longitude: activity.longitude,
            address: activity.address || 'Address not available',
            price: activity.price_level || 'Free',
            rating: activity.rating || 4.0,
            reviewCount: 0, // Not available in streaming data
            tags: activity.tags || [],
            features: activity.tags || [],
            phone: activity.phone_number || 'Not available',
            website: activity.website || '',
            openingHours: activity.opening_hours || 'Hours not available',
            timeToSpend: activity.time_to_spend || '1-2 hours',
            budget: activity.budget || activity.price_level || 'Free',
            priority: activity.priority || 1,
            featured: false, // Default
            openNow: true // Default
        };
    };

    // Chat logic
    const sendChatMessage = async () => {
        if (!chatMessage().trim() || isLoading()) return;

        const userMessage = chatMessage().trim();
        setChatMessage('');
        setIsLoading(true);

        setChatHistory(prev => [...prev, { type: 'user', content: userMessage, timestamp: new Date() }]);

        try {
            // Simulate API call for activity recommendations
            await new Promise(resolve => setTimeout(resolve, 1500));

            setChatHistory(prev => [...prev, {
                type: 'assistant',
                content: "I'd be happy to help you discover amazing activities! I can recommend cultural sites, entertainment venues, outdoor adventures, or unique experiences based on your interests. What type of activity are you looking for?",
                timestamp: new Date()
            }]);

        } catch (error) {
            console.error('Error sending message:', error);
            setChatHistory(prev => [...prev, {
                type: 'error',
                content: 'Sorry, there was an error processing your request. Please try again.',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
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
            { id: 'cultural', label: 'Cultural', icon: Palette },
            { id: 'entertainment', label: 'Entertainment', icon: Music },
            { id: 'outdoor', label: 'Outdoor', icon: Mountain },
            { id: 'adventure', label: 'Adventure', icon: Zap },
            { id: 'sightseeing', label: 'Sightseeing', icon: Camera }
        ],
        priceRange: ['Free', '€', '€€', '€€€'],
        features: ['Family Friendly', 'Pet Friendly', 'Accessible', 'Photography', 'Educational', 'Outdoor Seating']
    };

    const getActivityIcon = (category: any) => {
        const iconMap = {
            'Cultural': Palette,
            'Entertainment': Music,
            'Outdoor': Mountain,
            'Adventure': Zap,
            'Sightseeing': Camera
        };
        return iconMap[category] || Compass;
    };

    const getPriceColor = (price) => {
        const colorMap = {
            'Free': 'text-green-600',
            '€': 'text-blue-600',
            '€€': 'text-orange-600',
            '€€€': 'text-red-600'
        };
        return colorMap[price] || 'text-gray-600';
    };

    const filteredActivities = () => {
        return activities().filter(activity => {
            const filters = activeFilters();
            // Safety check for activity properties
            const activityTags = activity.tags || [];
            const activityFeatures = activity.features || [];
            const activityPrice = activity.price || '';
            const activityRating = activity.rating || 0;

            // Category filter
            if (filters.categories.length > 0 && !filters.categories.some(category => activityTags.includes(category))) return false;
            // Price range filter
            if (filters.priceRange.length > 0 && !filters.priceRange.includes(activityPrice)) return false;
            // Features filter
            if (filters.features.length > 0 && !filters.features.some(feature => activityFeatures.includes(feature))) return false;
            // Rating filter
            if (filters.rating > 0 && activityRating < filters.rating) return false;
            return true;
        });
    };

    const toggleFilter = (filterType, value) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter(v => v !== value)
                : [...prev[filterType], value]
        }));
    };

    const addToFavorites = (activity) => {
        setMyFavorites(prev => prev.some(item => item.id === activity.id) ? prev : [...prev, activity]);
    };

    const renderActivityCard = (activity) => {
        const IconComponent = getActivityIcon(activity.category);
        return (
            <div
                class={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${selectedActivity()?.id === activity.id ? 'ring-2 ring-green-500 shadow-md' : 'border-gray-200'}`}
                onClick={() => setSelectedActivity(activity)}
            >
                <div class="flex items-start gap-3">
                    <div class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <IconComponent class="w-6 h-6 text-white" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex-1 min-w-0">
                                <h3 class="font-semibold text-gray-900 text-base mb-1">{activity.name}</h3>
                                
                                {/* Enhanced Filter Labels */}
                                <div class="flex flex-wrap items-center gap-2 mb-2">
                                    {/* Activity Category Label */}
                                    <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                        🎯 {activity.category}
                                    </span>
                                    
                                    {/* Price Range with Enhanced Styling */}
                                    <span class={`px-3 py-1 rounded-full text-xs font-bold border ${getPriceColor(activity.price).includes('green') ? 'bg-green-50 text-green-700 border-green-200' : 
                                        getPriceColor(activity.price).includes('blue') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        getPriceColor(activity.price).includes('orange') ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                        'bg-red-50 text-red-700 border-red-200'}`}>
                                        {activity.price} {activity.price === 'Free' ? 'Cost' : activity.price === '€' ? 'Budget' : activity.price === '€€' ? 'Moderate' : 'Premium'}
                                    </span>
                                    
                                    {/* Rating/Popularity Label */}
                                    <Show when={activity.rating >= 4.5}>
                                        <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                            ⭐ Top Rated
                                        </span>
                                    </Show>
                                    <Show when={activity.rating >= 4.0 && activity.rating < 4.5}>
                                        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                            ✓ Popular
                                        </span>
                                    </Show>
                                    
                                    {/* Duration Label */}
                                    <Show when={activity.timeToSpend}>
                                        <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                            🕒 {activity.timeToSpend}
                                        </span>
                                    </Show>
                                    
                                    {/* Featured Activity Labels */}
                                    <Show when={activity.features.includes('Family Friendly')}>
                                        <span class="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                                            👨‍👩‍👧‍👦 Family
                                        </span>
                                    </Show>
                                    <Show when={activity.features.includes('Educational')}>
                                        <span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                                            📚 Educational
                                        </span>
                                    </Show>
                                    <Show when={activity.features.includes('Photography')}>
                                        <span class="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs">
                                            📸 Photo Spot
                                        </span>
                                    </Show>
                                </div>
                            </div>
                            
                            {/* Rating Badge */}
                            <div class="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                                <Star class="w-3 h-3 text-yellow-500 fill-current" />
                                <span class="text-yellow-800 font-medium text-xs">{activity.rating}</span>
                                <span class="text-yellow-600 text-xs">({activity.reviewCount})</span>
                            </div>
                        </div>
                        
                        <p class="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
                        
                        {/* Enhanced Footer with Better Visual Hierarchy */}
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="text-lg font-bold text-gray-900">
                                    {activity.budget || activity.price}
                                </div>
                            </div>
                            
                            {/* Feature Tags */}
                            <div class="flex items-center gap-1">
                                {activity.features.slice(0, 3).map(feature => (
                                    <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                                        {feature}
                                    </span>
                                ))}
                                <Show when={activity.features.length > 3}>
                                    <span class="bg-gray-100 text-gray-500 px-2 py-1 rounded-md text-xs">
                                        +{activity.features.length - 3}
                                    </span>
                                </Show>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderFiltersPanel = () => (
        <Show when={showFilters()}>
            <div class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-gray-200 shadow-lg p-4 z-10">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <h4 class="font-semibold text-gray-900 mb-2 text-sm">Category</h4>
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
                        <h4 class="font-semibold text-gray-900 mb-2 text-sm">Price Range</h4>
                        <div class="space-y-1">
                            <For each={filterOptions.priceRange}>
                                {(price) => (
                                    <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300"
                                            checked={activeFilters().priceRange.includes(price)}
                                            onChange={() => toggleFilter('priceRange', price)}
                                        />
                                        <span class={`font-medium ${getPriceColor(price)}`}>{price}</span>
                                    </label>
                                )}
                            </For>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900 mb-2 text-sm">Features</h4>
                        <div class="space-y-1">
                            <For each={filterOptions.features}>
                                {(feature) => (
                                    <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300"
                                            checked={activeFilters().features.includes(feature)}
                                            onChange={() => toggleFilter('features', feature)}
                                        />
                                        <span class="text-gray-700">{feature}</span>
                                    </label>
                                )}
                            </For>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900 mb-2 text-sm">Minimum Rating</h4>
                        <div class="space-y-1">
                            {[4.5, 4.0, 3.5, 3.0].map(rating => (
                                <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                    <input
                                        type="radio"
                                        name="rating"
                                        class="rounded border-gray-300"
                                        checked={activeFilters().rating === rating}
                                        onChange={() => setActiveFilters(prev => ({ ...prev, rating }))}
                                    />
                                    <Star class="w-4 h-4 text-yellow-500 fill-current" />
                                    <span class="text-gray-700">{rating}+ stars</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Show>
    );

    const renderChatInterface = () => (
        <Show when={showChat()}>
            <div class="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
                <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-green-600 text-white rounded-t-lg">
                    <div class="flex items-center gap-2">
                        <MessageCircle class="w-5 h-5" />
                        <span class="font-medium">Activity Recommendations</span>
                    </div>
                    <button
                        onClick={() => setShowChat(false)}
                        class="p-1 hover:bg-green-700 rounded"
                    >
                        <X class="w-4 h-4" />
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto p-4 space-y-4">
                    <Show when={chatHistory().length === 0}>
                        <div class="text-center text-gray-500 py-8">
                            <Compass class="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p class="text-sm">Ask me for activity recommendations!</p>
                            <p class="text-xs mt-2 text-gray-400">
                                Try: "Museums in the city center" or "Outdoor activities for families"
                            </p>
                        </div>
                    </Show>

                    <For each={chatHistory()}>
                        {(message) => (
                            <div class={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div class={`max-w-[80%] p-3 rounded-lg text-sm ${message.type === 'user'
                                    ? 'bg-green-600 text-white'
                                    : message.type === 'error'
                                        ? 'bg-red-100 text-red-800 border border-red-200'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    <p class="whitespace-pre-wrap">{message.content}</p>
                                    <p class={`text-xs mt-1 opacity-70 ${message.type === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
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
                                <span>Finding amazing activities...</span>
                            </div>
                        </div>
                    </Show>
                </div>

                <div class="p-4 border-t border-gray-200">
                    <div class="flex items-end gap-2">
                        <textarea
                            value={chatMessage()}
                            onInput={(e) => setChatMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask for activity recommendations..."
                            class="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            rows="2"
                            disabled={isLoading()}
                        />
                        <button
                            onClick={sendChatMessage}
                            disabled={!chatMessage().trim() || isLoading()}
                            class="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </Show>
    );

    // Get display location
    const displayLocation = () => {
        const streaming = streamingData();
        if (streaming && streaming.activities && streaming.activities.length > 0) {
            return streaming.activities[0].city || 'Activities';
        }
        return searchParams().location;
    };

    return (
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Chat Success Banner */}
            <Show when={fromChat()}>
                <div class="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200 px-4 py-3 sm:px-6">
                    <div class="max-w-7xl mx-auto">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <Compass class="w-4 h-4 text-white" />
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-green-900">
                                    ✨ Your activity recommendations are ready!
                                </p>
                                <p class="text-xs text-green-700">
                                    Generated from your chat: "{location.state?.originalMessage || 'Activity search'}"
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
                            <h1 class="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Activities in {displayLocation()}</h1>
                            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 sm:text-base">{activities().length} amazing things to do</p>
                        </div>
                        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                            {/* View Mode Toggle */}
                            <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 w-full sm:w-auto">
                                <button
                                    onClick={() => setViewMode('map')}
                                    class={`flex-1 px-3 py-1 rounded text-sm font-medium transition-colors sm:flex-initial ${viewMode() === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
                                >
                                    Map
                                </button>
                                <button
                                    onClick={() => setViewMode('split')}
                                    class={`flex-1 px-3 py-1 rounded text-sm font-medium transition-colors sm:flex-initial ${viewMode() === 'split' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
                                >
                                    Split
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    class={`flex-1 px-3 py-1 rounded text-sm font-medium transition-colors sm:flex-initial ${viewMode() === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
                                >
                                    List
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div class="flex flex-col gap-2 sm:flex-row sm:gap-3">
                                <button
                                    onClick={() => setShowChat(true)}
                                    class="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm text-sm font-medium"
                                >
                                    <MessageCircle class="w-4 h-4" />
                                    Get Recommendations
                                </button>

                                <div class="flex gap-2">
                                    <button class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:flex-initial">
                                        <Heart class="w-4 h-4" />
                                        <span class="hidden sm:inline">Favorites</span>
                                    </button>
                                    <button class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:flex-initial">
                                        <Share2 class="w-4 h-4" />
                                        <span class="hidden sm:inline">Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 relative sm:px-6">
                <div class="max-w-7xl mx-auto">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div class="flex items-center gap-4">
                            <button
                                onClick={() => setShowFilters(!showFilters())}
                                class={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${showFilters() ? 'bg-green-50 border-green-200 text-green-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <Filter class="w-4 h-4" />
                                Filters
                            </button>
                            <div class="text-sm text-gray-600">
                                {filteredActivities().length} activities
                            </div>
                        </div>
                    </div>
                    {renderFiltersPanel()}
                </div>
            </div>

            {/* Main Content */}
            <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
                <div class={`grid gap-4 sm:gap-6 ${viewMode() === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                    <Show when={viewMode() === 'map' || viewMode() === 'split'}>
                        <div class={viewMode() === 'map' ? 'col-span-full h-[400px] sm:h-[600px]' : 'h-[300px] sm:h-[500px]'}>
                            <MapComponent
                                center={[searchParams().centerLng, searchParams().centerLat]}
                                zoom={12}
                                minZoom={10}
                                maxZoom={22}
                                pointsOfInterest={filteredActivities()}
                            />
                        </div>
                    </Show>

                    <Show when={viewMode() === 'list' || viewMode() === 'split'}>
                        <div class={viewMode() === 'list' ? 'col-span-full' : ''}>
                            <div class="space-y-4">
                                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Available Activities</h2>
                                    <p class="text-sm text-gray-600 self-start sm:self-auto">
                                        Found {filteredActivities().length} activities
                                    </p>
                                </div>
                                <Show when={filteredActivities().length > 0} fallback={
                                    <div class="text-center py-12">
                                        <Compass class="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No activities found</h3>
                                        <p class="text-gray-600 mb-4">Start a new search from the home page to find activities</p>
                                        <button
                                            onClick={() => window.location.href = '/'}
                                            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Start New Search
                                        </button>
                                    </div>
                                }>
                                    <ActivityResults 
                                        activities={filteredActivities().map(activity => ({
                                            name: activity.name,
                                            latitude: activity.latitude,
                                            longitude: activity.longitude,
                                            category: activity.category,
                                            description_poi: activity.description,
                                            address: activity.address,
                                            website: activity.website,
                                            rating: activity.rating,
                                            budget: activity.budget,
                                            duration: activity.timeToSpend,
                                            distance: 0 // Calculate if needed
                                        }))}
                                        compact={false}
                                        showToggle={filteredActivities().length > 5}
                                        initialLimit={5}
                                    />
                                </Show>
                            </div>
                        </div>
                    </Show>
                </div>
            </div>

            {/* Chat Interface */}
            {renderChatInterface()}

            {/* Floating Chat Button */}
            <Show when={!showChat()}>
                <button
                    onClick={() => setShowChat(true)}
                    class="fixed bottom-4 right-4 w-12 h-12 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-105 flex items-center justify-center z-40 sm:bottom-6 sm:right-6 sm:w-14 sm:h-14"
                >
                    <Compass class="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </Show>

            {/* Selected Activity Details Modal */}
            <Show when={selectedActivity()}>
                <div class="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
                    <div class="bg-white rounded-t-lg sm:rounded-lg max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
                        <div class="p-4 sm:p-6">
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-lg font-bold text-gray-900 sm:text-xl pr-2">{selectedActivity().name}</h3>
                                    <p class="text-gray-600 text-sm sm:text-base">{selectedActivity().category}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedActivity(null)}
                                    class="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                                >
                                    <X class="w-5 h-5" />
                                </button>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 text-sm">
                                <div class="flex items-center gap-2">
                                    <Star class="w-4 h-4 text-yellow-500 fill-current" />
                                    <span>{selectedActivity().rating}/5 ({selectedActivity().reviewCount} reviews)</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <DollarSign class="w-4 h-4 text-gray-500" />
                                    <span class={getPriceColor(selectedActivity().price)}>{selectedActivity().price}</span>
                                </div>
                                <div class="flex items-center gap-2 col-span-1 sm:col-span-2">
                                    <MapPin class="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <span class="text-xs sm:text-sm">{selectedActivity().address}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Clock class="w-4 h-4 text-gray-500" />
                                    <span>{selectedActivity().openingHours}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Clock class="w-4 h-4 text-gray-500" />
                                    <span>Time needed: {selectedActivity().timeToSpend}</span>
                                </div>
                            </div>

                            <p class="text-gray-700 mb-4 text-sm sm:text-base">{selectedActivity().description}</p>

                            <div class="mb-4">
                                <h4 class="font-semibold text-gray-900 mb-2">Features</h4>
                                <div class="flex flex-wrap gap-2">
                                    <For each={selectedActivity().features}>
                                        {(feature) => (
                                            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                {feature}
                                            </span>
                                        )}
                                    </For>
                                </div>
                            </div>

                            <div class="border-t pt-4">
                                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div class="text-sm text-gray-600">
                                        <p><strong>Phone:</strong> {selectedActivity().phone}</p>
                                        <p><strong>Website:</strong> {selectedActivity().website}</p>
                                    </div>
                                    <div class="flex flex-col gap-2 sm:flex-row">
                                        <button
                                            onClick={() => addToFavorites(selectedActivity())}
                                            class={`px-4 py-2 rounded-lg text-sm font-medium ${myFavorites().some(item => item.id === selectedActivity().id) ? 'bg-red-600 text-white' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                        >
                                            {myFavorites().some(item => item.id === selectedActivity().id) ? 'Favorited' : 'Add to Favorites'}
                                        </button>
                                        <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                                            Plan Visit
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