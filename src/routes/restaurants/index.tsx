import { createSignal, createEffect, For, Show, onMount } from 'solid-js';
import { useLocation, useSearchParams } from '@solidjs/router';
import { MapPin, Clock, Star, Filter, Heart, Share2, Download, Edit3, Plus, X, Navigation, Calendar, Users, DollarSign, Camera, Coffee, Utensils, Wifi, CreditCard, Loader2, MessageCircle, Send, ChefHat, Wine, UtensilsCrossed, Smartphone } from 'lucide-solid';
import MapComponent from '~/components/features/Map/Map';
// Removed old API imports - now using unified streaming endpoint only
import type { DiningResponse, RestaurantDetailedInfo } from '~/lib/api/types';
import { RestaurantResults } from '~/components/results';
import { TypingAnimation } from '~/components/TypingAnimation';
import { useChatSession } from '~/lib/hooks/useChatSession';
import ChatInterface from '~/components/ui/ChatInterface';
import { useAuth } from '~/contexts/AuthContext';
import { useFavorites, useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '~/lib/api/pois';
import RegisterBanner from '~/components/ui/RegisterBanner';
import { SkeletonRestaurantGrid } from '~/components/ui/SkeletonRestaurantCard';

export default function RestaurantsPage() {
    const location = useLocation();
    const [urlSearchParams] = useSearchParams();
    const [selectedRestaurant, setSelectedRestaurant] = createSignal(null);
    const [showFilters, setShowFilters] = createSignal(false);
    const [viewMode, setViewMode] = createSignal('split'); // 'map', 'list', 'split'
    const [streamingData, setStreamingData] = createSignal<DiningResponse | null>(null);
    const [fromChat, setFromChat] = createSignal(false);

    // Chat functionality using the reusable hook
    const chatSession = useChatSession({
        sessionIdPrefix: 'restaurants',
        getStreamingData: () => streamingData(),
        setStreamingData: setStreamingData,
        enableNavigation: true, // Enable URL navigation
        onNavigationData: (navigation) => {
            console.log('Navigation data received in restaurants:', navigation);
        },
        onStreamingComplete: (data) => {
            if (data && data.restaurants) {
                setFromChat(true);
            }
        }
    });

    // Auth and favorites hooks
    const { isAuthenticated } = useAuth();
    const favoritesQuery = useFavorites();
    const addToFavoritesMutation = useAddToFavoritesMutation();
    const removeFromFavoritesMutation = useRemoveFromFavoritesMutation();

    // Filter states
    const [activeFilters, setActiveFilters] = createSignal({
        cuisines: [], // Start with no filters active so all restaurants show initially
        priceRange: [],
        features: [],
        rating: 0
    });

    // Sample restaurants data for Porto
    const [searchParams, setSearchParams] = createSignal({
        location: "Porto, Portugal",
        checkIn: "2024-01-15",
        checkOut: "2024-01-18",
        guests: 2,
        centerLat: 41.1579,
        centerLng: -8.6291
    });

    // Removed old API hooks - now using unified streaming endpoint only

    // Initialize with streaming data on mount
    onMount(() => {
        console.log('=== RESTAURANTS PAGE MOUNT ===');
        console.log('Location state:', location.state);
        console.log('URL search params:', urlSearchParams);
        
        // Check for URL parameters first (priority for deep linking)
        const urlSessionId = urlSearchParams.sessionId;
        const urlCityName = urlSearchParams.cityName;
        const urlDomain = urlSearchParams.domain;

        // Try to get session ID from URL params or session storage
        let resolvedSessionId = urlSessionId;

        if (resolvedSessionId) {
            console.log('Found session ID in URL parameters:', resolvedSessionId);
            chatSession.setSessionId(resolvedSessionId);
        } else {
            // Try to get session ID from storage if not in URL
            console.log('No session ID in URL, checking session storage...');
            const storedSession = sessionStorage.getItem('completedStreamingSession');
            if (storedSession) {
                try {
                    const session = JSON.parse(storedSession);
                    resolvedSessionId = session.sessionId || session.data?.session_id || session.data?.sessionId;
                    if (resolvedSessionId) {
                        console.log('✅ Found session ID in session storage:', resolvedSessionId);
                        chatSession.setSessionId(resolvedSessionId);
                    }
                } catch (error) {
                    console.error('Error parsing session storage:', error);
                }
            }
        }

        // Try to retrieve session data based on session ID
        if (resolvedSessionId) {
            const sessionKey = `session_${resolvedSessionId}`;
            const storedSessionData = sessionStorage.getItem(sessionKey);
            if (storedSessionData) {
                try {
                    const sessionData = JSON.parse(storedSessionData);
                    console.log('Loading restaurants session data:', sessionData);
                    if (sessionData.restaurants) {
                        setStreamingData(sessionData);
                        setFromChat(true);
                    }
                } catch (error) {
                    console.error('Error parsing restaurants session data:', error);
                }
            }
        }
        
        // Check for streaming data from route state  
        if (location.state?.streamingData) {
            console.log('Found dining streaming data in route state');
            setStreamingData(location.state.streamingData as DiningResponse);
            setFromChat(true);
            console.log('Received dining data:', location.state.streamingData);
        } else {
            console.log('No streaming data in route state, checking session storage');
            // Try to get data from session storage
            const storedSession = sessionStorage.getItem('completedStreamingSession');
            console.log('Session storage content:', storedSession);
            
            if (storedSession) {
                try {
                    const session = JSON.parse(storedSession);
                    console.log('Parsed session:', session);
                    
                    if (session.data && session.data.restaurants) {
                        console.log('Setting dining data from session storage');
                        setStreamingData(session.data as DiningResponse);
                        setFromChat(true);
                        console.log('Loaded dining data from session storage:', session.data);
                    } else {
                        console.log('No dining data found in session');
                    }
                } catch (error) {
                    console.error('Error parsing stored session:', error);
                }
            } else {
                console.log('No stored session found');
            }
        }
    });

    const restaurants = () => {
        // Prioritize streaming data if available
        const streaming = streamingData();
        if (streaming && streaming.restaurants && streaming.restaurants.length > 0) {
            console.log('Using streaming restaurants data:', streaming.restaurants);
            return streaming.restaurants.map(convertRestaurantToDisplayFormat);
        }
        
        // No fallback API data - only streaming data is used
        return [];
    };

    // Convert streaming restaurant data to display format
    const convertRestaurantToDisplayFormat = (restaurant: RestaurantDetailedInfo) => {
        return {
            id: restaurant.id || `restaurant-${Math.random().toString(36).substr(2, 9)}`,
            name: restaurant.name || 'Unknown Restaurant',
            cuisine: restaurant.cuisine_type || restaurant.category || 'Restaurant',
            description: restaurant.description || 'No description available',
            latitude: restaurant.latitude || 0,
            longitude: restaurant.longitude || 0,
            address: restaurant.address || 'Address not available',
            priceRange: restaurant.price_level || '€€',
            rating: restaurant.rating || 4.0,
            reviewCount: 0, // Not available in streaming data
            features: Array.isArray(restaurant.tags) ? restaurant.tags : [],
            specialties: Array.isArray(restaurant.tags) ? restaurant.tags : [],
            tags: Array.isArray(restaurant.tags) ? restaurant.tags : [],
            phone: restaurant.phone_number || 'Not available',
            website: restaurant.website || '',
            openingHours: restaurant.opening_hours || 'Hours not available',
            reservationRequired: false, // Default
            takeaway: true, // Default
            delivery: true // Default
        };
    };

    // All chat logic is now handled by the useChatSession hook

    const filterOptions = {
        cuisines: [
            { id: 'portuguese', label: 'Portuguese', icon: ChefHat },
            { id: 'seafood', label: 'Seafood', icon: Coffee },
            { id: 'international', label: 'International', icon: Utensils },
            { id: 'vegetarian', label: 'Vegetarian', icon: UtensilsCrossed },
            { id: 'finedining', label: 'Fine Dining', icon: Wine }
        ],
        priceRange: ['€', '€€', '€€€', '€€€€'],
        features: ['Michelin Star', 'River View', 'Live Music', 'Vegetarian Options', 'Reservations Required', 'Outdoor Seating']
    };

    const getCuisineIcon = (cuisine: any) => {
        const iconMap = {
            'Portuguese': ChefHat,
            'Contemporary Portuguese': ChefHat,
            'Seafood': Coffee,
            'International': Utensils,
            'Vegetarian': UtensilsCrossed,
            'Fine Dining': Wine
        };
        return iconMap[cuisine] || Utensils;
    };

    const getPriceColor = (price) => {
        const colorMap = {
            '€': 'text-green-600',
            '€€': 'text-blue-600',
            '€€€': 'text-orange-600',
            '€€€€': 'text-red-600'
        };
        return colorMap[price] || 'text-gray-600';
    };

    // Helper functions for streaming state
    const isStreaming = () => urlSearchParams.streaming === 'true';
    const hasData = () => streamingData()?.restaurants && streamingData().restaurants.length > 0;
    const isLoading = () => isStreaming() && !chatSession.isComplete() && !hasData();
    const isLoadingMore = () => isStreaming() && !chatSession.isComplete() && hasData();

    const filteredRestaurants = () => {
        return restaurants().filter(restaurant => {
            const filters = activeFilters();
            // Safety check for restaurant properties
            const restaurantTags = restaurant.tags || [];
            const restaurantFeatures = restaurant.features || [];
            const restaurantPriceRange = restaurant.priceRange || '';
            const restaurantRating = restaurant.rating || 0;

            // Cuisine filter
            if (filters.cuisines.length > 0 && !filters.cuisines.some(cuisine => restaurantTags.includes(cuisine))) return false;
            // Price range filter
            if (filters.priceRange.length > 0 && !filters.priceRange.includes(restaurantPriceRange)) return false;
            // Features filter
            if (filters.features.length > 0 && !filters.features.some(feature => restaurantFeatures.includes(feature))) return false;
            // Rating filter
            if (filters.rating > 0 && restaurantRating < filters.rating) return false;
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

    // Favorites functionality - use API instead of local state
    const isFavorite = (restaurantName: string) => {
        const favs = favoritesQuery.data || [];
        return favs.some(poi => poi.name === restaurantName);
    };

    const toggleFavorite = (restaurantName: string, restaurant: any) => {
        if (!isAuthenticated()) {
            console.log("User not authenticated, cannot toggle favorite");
            return;
        }

        console.log("Toggle favorite for restaurant:", { restaurantName, isFavorite: isFavorite(restaurantName) });

        // Convert restaurant to POI format for consistency
        const poiData = {
            id: restaurant.name,
            city: selectedCityData().city || "Unknown",
            name: restaurant.name,
            latitude: restaurant.latitude || 0,
            longitude: restaurant.longitude || 0,
            category: "restaurant",
            description: restaurant.description_poi || restaurant.description || "",
            rating: restaurant.rating || 4.0,
            address: restaurant.address || "",
            website: restaurant.website || "",
            phone_number: restaurant.phone_number || "",
            opening_hours: restaurant.opening_hours || {},
            price_level: restaurant.price_level || "€€",
            images: restaurant.images || [],
            reviews: restaurant.reviews || [],
            tags: restaurant.tags || [],
            priority: restaurant.priority || 1,
            cuisine_type: restaurant.cuisine_type || "",
            llm_interaction_id: "",
            city_id: selectedCityData().id || "",
            distance: restaurant.distance || 0,
            created_at: new Date().toISOString(),
        };

        if (isFavorite(restaurantName)) {
            // Remove from favorites
            removeFromFavoritesMutation.mutate({ poiId: restaurant.name, poiData });
        } else {
            // Add to favorites
            addToFavoritesMutation.mutate({ poiId: restaurant.name, poiData });
        }
    };

    const renderRestaurantCard = (restaurant) => {
        const IconComponent = getCuisineIcon(restaurant.cuisine);
        return (
            <div
                class={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${selectedRestaurant()?.id === restaurant.id ? 'ring-2 ring-orange-500 shadow-md' : 'border-gray-200'}`}
                onClick={() => setSelectedRestaurant(restaurant)}
            >
                <div class="flex items-start gap-3">
                    <div class="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                        <IconComponent class="w-6 h-6 text-white" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex-1 min-w-0">
                                <h3 class="font-semibold text-gray-900 text-base mb-1">{restaurant.name}</h3>
                                
                                {/* Enhanced Filter Labels */}
                                <div class="flex flex-wrap items-center gap-2 mb-2">
                                    {/* Cuisine Type Label */}
                                    <span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                        🍽️ {restaurant.cuisine}
                                    </span>
                                    
                                    {/* Price Range with Enhanced Styling */}
                                    <span class={`px-3 py-1 rounded-full text-xs font-bold border ${getPriceColor(restaurant.priceRange).includes('green') ? 'bg-green-50 text-green-700 border-green-200' : 
                                        getPriceColor(restaurant.priceRange).includes('blue') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        getPriceColor(restaurant.priceRange).includes('orange') ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                        'bg-red-50 text-red-700 border-red-200'}`}>
                                        {restaurant.priceRange} {restaurant.priceRange === '€' ? 'Budget' : restaurant.priceRange === '€€' ? 'Moderate' : restaurant.priceRange === '€€€' ? 'Fine Dining' : 'Luxury'}
                                    </span>
                                    
                                    {/* Rating/Popularity Label */}
                                    <Show when={restaurant.rating >= 4.5}>
                                        <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                            ⭐ Highly Rated
                                        </span>
                                    </Show>
                                    <Show when={restaurant.rating >= 4.0 && restaurant.rating < 4.5}>
                                        <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            ✓ Popular
                                        </span>
                                    </Show>
                                    
                                    {/* Featured Special Labels */}
                                    <Show when={restaurant.features.includes('Vegetarian') || restaurant.features.includes('Vegan')}>
                                        <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                            🌱 Vegetarian
                                        </span>
                                    </Show>
                                    <Show when={restaurant.features.includes('Outdoor') || restaurant.features.includes('Terrace')}>
                                        <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                            🌤️ Terrace
                                        </span>
                                    </Show>
                                    <Show when={restaurant.features.includes('Wine') || restaurant.features.includes('Bar')}>
                                        <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                            🍷 Wine Bar
                                        </span>
                                    </Show>
                                </div>
                            </div>
                            
                            {/* Rating Badge */}
                            <div class="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                                <Star class="w-3 h-3 text-yellow-500 fill-current" />
                                <span class="text-yellow-800 font-medium text-xs">{restaurant.rating}</span>
                                <span class="text-yellow-600 text-xs">({restaurant.reviewCount})</span>
                            </div>
                        </div>
                        
                        <p class="text-sm text-gray-600 mb-3 line-clamp-2">{restaurant.description}</p>
                        
                        {/* Enhanced Footer with Better Visual Hierarchy */}
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="text-lg font-bold text-gray-900">
                                    {restaurant.averagePrice || restaurant.priceRange}/person
                                </div>
                            </div>
                            
                            {/* Feature Tags */}
                            <div class="flex items-center gap-1">
                                {restaurant.features.slice(0, 3).map(feature => (
                                    <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                                        {feature}
                                    </span>
                                ))}
                                <Show when={restaurant.features.length > 3}>
                                    <span class="bg-gray-100 text-gray-500 px-2 py-1 rounded-md text-xs">
                                        +{restaurant.features.length - 3}
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
                        <h4 class="font-semibold text-gray-900 mb-2 text-sm">Cuisine</h4>
                        <div class="space-y-1">
                            <For each={filterOptions.cuisines}>
                                {(cuisine) => {
                                    const IconComponent = cuisine.icon;
                                    return (
                                        <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                            <input
                                                type="checkbox"
                                                class="rounded border-gray-300"
                                                checked={activeFilters().cuisines.includes(cuisine.label)}
                                                onChange={() => toggleFilter('cuisines', cuisine.label)}
                                            />
                                            <IconComponent class="w-4 h-4 text-gray-500" />
                                            <span class="text-gray-700">{cuisine.label}</span>
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


    // Get display location
    const displayLocation = () => {
        const streaming = streamingData();
        if (streaming && streaming.restaurants && streaming.restaurants.length > 0) {
            return streaming.restaurants[0].city || 'Restaurants';
        }
        return searchParams().location;
    };

    return (
        <div class="min-h-screen relative">
            {/* Chat Success Banner */}
            <Show when={fromChat()}>
                <div class="px-4 py-3 sm:px-6">
                    <div class="max-w-7xl mx-auto">
                        <div class="flex items-center gap-3 glass-panel gradient-border rounded-xl p-3">
                            <div class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white shadow">
                                <ChefHat class="w-4 h-4 text-white" />
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-amber-900 dark:text-amber-100">
                                    ✨ <TypingAnimation text="Your restaurant recommendations are ready!" />
                                </p>
                                <p class="text-xs text-slate-700 dark:text-slate-300">
                                    Generated from your chat: "{location.state?.originalMessage || 'Restaurant search'}"
                                </p>
                            </div>
                            <button
                                onClick={() => setFromChat(false)}
                                class="p-1 text-amber-700 hover:text-amber-800 dark:text-amber-200 dark:hover:text-amber-100"
                            >
                                <X class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </Show>

            {/* Header - Mobile First */}
            <div class="px-4 py-3 sm:px-6 sm:py-4">
                <div class="max-w-7xl mx-auto">
                    <div class="loci-hero">
                        <div class="loci-hero__content p-6 sm:p-8 flex flex-col gap-4">
                            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div class="space-y-2">
                                    <div class="flex items-center gap-2">
                                        <span class="loci-chip uppercase tracking-wide text-[10px] sm:text-xs">Dining</span>
                                        <Show when={isAuthenticated()}>
                                            <span class="loci-chip bg-white/25 text-white">
                                                <Heart class="w-4 h-4" />
                                                {favoritesQuery.data?.length || 0} favorites
                                            </span>
                                        </Show>
                                    </div>
                                    <h1 class="text-3xl sm:text-4xl font-bold leading-tight">Restaurants · {displayLocation()}</h1>
                                    <p class="text-white/80 text-sm sm:text-base">
                                        {filteredRestaurants().length} dining recommendations tuned to your profile
                                    </p>
                                    <div class="flex flex-wrap gap-2 text-sm">
                                        <span class="loci-chip">
                                            <Utensils class="w-4 h-4" />
                                            {viewMode() === 'split' ? 'Map + List' : viewMode()}
                                        </span>
                                        <span class="loci-chip">
                                            <Calendar class="w-4 h-4" />
                                            {searchParams().checkIn} - {searchParams().checkOut}
                                        </span>
                                        <span class="loci-chip">
                                            <Users class="w-4 h-4" />
                                            {searchParams().guests} guests
                                        </span>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                                    {/* View Mode Toggle */}
                                    <div class="flex bg-white/15 border border-white/30 rounded-xl p-1 w-full sm:w-auto shadow-inner">
                                        <button
                                            onClick={() => setViewMode('map')}
                                            class={`flex-1 px-3 py-1 rounded text-sm font-medium transition-colors sm:flex-initial ${viewMode() === 'map' ? 'bg-white/90 text-gray-900 shadow-sm' : 'text-white/80 hover:bg-white/10'}`}
                                            title="Show only map"
                                        >
                                            Map
                                        </button>
                                        <button
                                            onClick={() => setViewMode('split')}
                                            class={`flex-1 px-3 py-1 rounded text-sm font-medium transition-colors sm:flex-initial ${viewMode() === 'split' ? 'bg-white/90 text-gray-900 shadow-sm' : 'text-white/80 hover:bg-white/10'}`}
                                            title="Split view: Map + Cards"
                                        >
                                            Split
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            class={`flex-1 px-3 py-1 rounded text-sm font-medium transition-colors sm:flex-initial ${viewMode() === 'list' ? 'bg-white/90 text-gray-900 shadow-sm' : 'text-white/80 hover:bg-white/10'}`}
                                            title="Show only cards"
                                        >
                                            List
                                        </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div class="flex flex-col gap-2 sm:flex-row sm:gap-3">
                                        <button
                                            onClick={() => chatSession.setShowChat(true)}
                                            class="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg transition-all text-sm font-semibold shadow-[0_12px_28px_rgba(12,125,242,0.25)] border border-white/40 hover:-translate-y-0.5"
                                        >
                                            <MessageCircle class="w-4 h-4 text-blue-600" />
                                            Get Recommendations
                                        </button>

                                        <div class="flex gap-2">
                                            <button class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-white bg-white/10 border border-white/20 rounded-lg transition-colors text-sm sm:flex-initial hover:bg-white/20">
                                                <Heart class="w-4 h-4" />
                                                <span class="hidden sm:inline">Favorites</span>
                                            </button>
                                            <button class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-white bg-white/10 border border-white/20 rounded-lg transition-colors text-sm sm:flex-initial hover:bg-white/20">
                                                <Share2 class="w-4 h-4" />
                                                <span class="hidden sm:inline">Share</span>
                                            </button>
                                        </div>
                                    </div>
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
                                class={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${showFilters() ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-400' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                <Filter class="w-4 h-4" />
                                Filters
                            </button>
                            <div class="text-sm text-gray-600 dark:text-gray-300">
                                {filteredRestaurants().length} restaurants
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
                                pointsOfInterest={filteredRestaurants()}
                            />
                        </div>
                    </Show>

                    <Show when={viewMode() === 'list' || viewMode() === 'split'}>
                        <div class={viewMode() === 'list' ? 'col-span-full' : ''}>
                            <div class="space-y-4">
                                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Available Restaurants</h2>
                                    <p class="text-sm text-gray-600 dark:text-gray-300 self-start sm:self-auto">
                                        Found {filteredRestaurants().length} restaurants
                                    </p>
                                </div>
                                {/* Show skeleton while loading */}
                                <Show when={isLoading()}>
                                    <SkeletonRestaurantGrid count={6} />
                                </Show>

                                {/* Show real data when available */}
                                <Show when={!isLoading() && filteredRestaurants().length > 0}>
                                    <RestaurantResults 
                                        restaurants={filteredRestaurants().map(restaurant => ({
                                            name: restaurant.name,
                                            latitude: restaurant.latitude,
                                            longitude: restaurant.longitude,
                                            category: restaurant.cuisine,
                                            description_poi: restaurant.description,
                                            address: restaurant.address,
                                            website: restaurant.website,
                                            rating: restaurant.rating,
                                            price_range: restaurant.priceRange,
                                            cuisine_type: restaurant.cuisine,
                                            distance: 0 // Calculate if needed
                                        }))}
                                        compact={false}
                                        showToggle={filteredRestaurants().length > 5}
                                        initialLimit={5}
                                        onToggleFavorite={(restaurantName, restaurant) => {
                                            toggleFavorite(restaurantName, restaurant);
                                        }}
                                        onShareClick={(restaurant) => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: restaurant.name,
                                                    text: `Check out ${restaurant.name} - ${restaurant.description_poi}`,
                                                    url: window.location.href
                                                });
                                            } else {
                                                navigator.clipboard.writeText(`Check out ${restaurant.name}: ${restaurant.description_poi}`);
                                            }
                                        }}
                                        favorites={isAuthenticated() ? (favoritesQuery.data || []).map(fav => fav.name) : []}
                                        isLoadingFavorites={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
                                        showAuthMessage={!isAuthenticated()}
                                    />

                                    {/* Progressive loading indicator */}
                                    <Show when={isLoadingMore()}>
                                        <div class="flex items-center justify-center gap-3 py-4 px-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <Loader2 class="w-5 h-5 animate-spin text-blue-600" />
                                            <span class="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                Loading more restaurants... ({filteredRestaurants().length} found so far)
                                            </span>
                                        </div>
                                    </Show>
                                </Show>

                                {/* No data fallback */}
                                <Show when={!isLoading() && !hasData()}>
                                    <div class="text-center py-12">
                                        <Utensils class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No restaurants found</h3>
                                        <p class="text-gray-600 dark:text-gray-300 mb-4">Start a new search to find restaurants</p>
                                        <button
                                            onClick={() => chatSession.setShowChat(true)}
                                            class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
                                        >
                                            <MessageCircle class="w-4 h-4" />
                                            Find Restaurants
                                        </button>
                                    </div>
                                </Show>
                            </div>
                        </div>
                    </Show>
                </div>

                {/* Fixed loading indicator for mobile */}
                <Show when={isLoadingMore()}>
                    <div class="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 sm:hidden">
                        <Loader2 class="w-4 h-4 animate-spin" />
                        <span class="text-sm font-medium">{filteredRestaurants().length} restaurants</span>
                    </div>
                </Show>
            </div>

            {/* Chat Interface */}
            <Show
                when={isAuthenticated()}
                fallback={
                    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <RegisterBanner
                            title="Register to keep the dinner conversation going"
                            description="Preview restaurant searches now. Unlock chat tweaks, saves, and sharing once you sign in."
                            helper={
                                <p class="text-xs text-slate-600">
                                    Favorites and downloads need an account.
                                </p>
                            }
                        />
                    </div>
                }
            >
                <ChatInterface
                    showChat={chatSession.showChat()}
                    chatMessage={chatSession.chatMessage()}
                    chatHistory={chatSession.chatHistory()}
                    isLoading={chatSession.isLoading()}
                    setShowChat={chatSession.setShowChat}
                    setChatMessage={chatSession.setChatMessage}
                    sendChatMessage={chatSession.sendChatMessage}
                    handleKeyPress={chatSession.handleKeyPress}
                    title="Restaurant Recommendations"
                    placeholder="Ask for restaurant recommendations..."
                    emptyStateIcon={Utensils}
                    emptyStateTitle="Ask me for restaurant recommendations!"
                    emptyStateSubtitle='Try: "Find me a romantic dinner spot" or "Vegetarian restaurants with good reviews"'
                    loadingMessage="Finding perfect restaurants..."
                    headerColor="bg-orange-600"
                    userMessageColor="bg-orange-600"
                    floatingButtonColor="bg-orange-600 hover:bg-orange-700"
                    focusRingColor="focus:ring-orange-500"
                />
            </Show>

            {/* Selected Restaurant Details Modal */}
            <Show when={selectedRestaurant()}>
                <div class="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
                    <div class="bg-white rounded-t-lg sm:rounded-lg max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
                        <div class="p-4 sm:p-6">
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-lg font-bold text-gray-900 sm:text-xl pr-2">{selectedRestaurant().name}</h3>
                                    <p class="text-gray-600 text-sm sm:text-base">{selectedRestaurant().cuisine}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedRestaurant(null)}
                                    class="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                                >
                                    <X class="w-5 h-5" />
                                </button>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 text-sm">
                                <div class="flex items-center gap-2">
                                    <Star class="w-4 h-4 text-yellow-500 fill-current" />
                                    <span>{selectedRestaurant().rating}/5 ({selectedRestaurant().reviewCount} reviews)</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <DollarSign class="w-4 h-4 text-gray-500" />
                                    <span class={getPriceColor(selectedRestaurant().priceRange)}>{selectedRestaurant().priceRange} • {selectedRestaurant().averagePrice}</span>
                                </div>
                                <div class="flex items-center gap-2 col-span-1 sm:col-span-2">
                                    <MapPin class="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <span class="text-xs sm:text-sm">{selectedRestaurant().address}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Clock class="w-4 h-4 text-gray-500" />
                                    <span>{selectedRestaurant().openingHours}</span>
                                </div>
                            </div>

                            <p class="text-gray-700 mb-4 text-sm sm:text-base">{selectedRestaurant().description}</p>

                            <div class="mb-4">
                                <h4 class="font-semibold text-gray-900 mb-2">Specialties</h4>
                                <div class="flex flex-wrap gap-2">
                                    <For each={selectedRestaurant().specialties}>
                                        {(specialty) => (
                                            <span class="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                                                {specialty}
                                            </span>
                                        )}
                                    </For>
                                </div>
                            </div>

                            <div class="mb-4">
                                <h4 class="font-semibold text-gray-900 mb-2">Features</h4>
                                <div class="flex flex-wrap gap-2">
                                    <For each={selectedRestaurant().features}>
                                        {(feature) => (
                                            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                                {feature}
                                            </span>
                                        )}
                                    </For>
                                </div>
                            </div>

                            <div class="border-t pt-4">
                                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div class="text-sm text-gray-600">
                                        <p><strong>Phone:</strong> {selectedRestaurant().phone}</p>
                                        <p><strong>Website:</strong> {selectedRestaurant().website}</p>
                                    </div>
                                    <div class="flex flex-col gap-2 sm:flex-row">
                                        <button
                                            onClick={() => toggleFavorite(selectedRestaurant().name, selectedRestaurant())}
                                            disabled={!isAuthenticated() || addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
                                            class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                !isAuthenticated() 
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                    : isFavorite(selectedRestaurant().name) 
                                                        ? 'bg-red-600 text-white hover:bg-red-700' 
                                                        : 'bg-orange-600 text-white hover:bg-orange-700'
                                            } disabled:opacity-50`}
                                        >
                                            <Show 
                                                when={!addToFavoritesMutation.isPending && !removeFromFavoritesMutation.isPending}
                                                fallback={<Loader2 class="w-4 h-4 animate-spin inline mr-1" />}
                                            >
                                                <Heart class={`w-4 h-4 inline mr-1 ${isFavorite(selectedRestaurant().name) ? 'fill-current' : ''}`} />
                                            </Show>
                                            {!isAuthenticated() 
                                                ? 'Login to Favorite' 
                                                : isFavorite(selectedRestaurant().name) 
                                                    ? 'Remove Favorite' 
                                                    : 'Add to Favorites'
                                            }
                                        </button>
                                        <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                                            Make Reservation
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
