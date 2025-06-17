import { createSignal, For, Show, createEffect, onMount } from 'solid-js';
import { useLocation } from '@solidjs/router';
import { Search, Filter, MapPin, Star, Heart, Bookmark, Clock, DollarSign, Users, Wifi, Camera, Grid, List, SortAsc, SortDesc, X, Compass } from 'lucide-solid';
import { useNearbyPOIs, useSearchPOIs, useFavorites, useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '~/lib/api/pois';
import type { ActivitiesResponse, POIDetailedInfo } from '~/lib/api/types';

export default function DiscoverPage() {
    const [searchQuery, setSearchQuery] = createSignal('');
    const [selectedCity, setSelectedCity] = createSignal('all');
    const [selectedCategory, setSelectedCategory] = createSignal('all');
    const [selectedRating, setSelectedRating] = createSignal('all');
    const [selectedPrice, setSelectedPrice] = createSignal('all');
    const [sortBy, setSortBy] = createSignal('popularity'); // 'popularity', 'rating', 'distance', 'price'
    const [sortOrder, setSortOrder] = createSignal('desc');
    const [viewMode, setViewMode] = createSignal('grid'); // 'grid', 'list'
    const [showFilters, setShowFilters] = createSignal(false);
    const [streamingData, setStreamingData] = createSignal<ActivitiesResponse | null>(null);
    const [fromChat, setFromChat] = createSignal(false);

    // Current location for nearby search (could come from geolocation)
    const [currentLocation, setCurrentLocation] = createSignal({ lat: 41.1579, lng: -8.6291 });

    // API hooks
    const favoritesQuery = useFavorites();
    const addToFavoritesMutation = useAddToFavoritesMutation();
    const removeFromFavoritesMutation = useRemoveFromFavoritesMutation();
    
    const nearbyPOIsQuery = useNearbyPOIs(
        currentLocation().lat,
        currentLocation().lng,
        10000 // 10km radius
    );
    
    const searchPOIsQuery = useSearchPOIs(
        searchQuery(),
        {
            category: selectedCategory() !== 'all' ? selectedCategory() : undefined,
            price_range: selectedPrice() !== 'all' ? selectedPrice() : undefined,
            city: selectedCity() !== 'all' ? selectedCity() : undefined
        }
    );

    // Initialize with streaming data on mount
    onMount(() => {
        console.log('=== DISCOVER PAGE MOUNT ===');
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

    // Get POIs from appropriate source
    const pois = () => {
        // Prioritize streaming data if available
        const streaming = streamingData();
        if (streaming && streaming.activities && streaming.activities.length > 0) {
            console.log('Using streaming activities data:', streaming.activities);
            return streaming.activities.map(convertPOIToDisplayFormat);
        }
        
        // Fallback to search or nearby data
        if (searchQuery().trim()) {
            return searchPOIsQuery.data || [];
        }
        return nearbyPOIsQuery.data || [];
    };

    // Convert streaming POI data to display format
    const convertPOIToDisplayFormat = (poi: POIDetailedInfo) => {
        return {
            id: poi.id,
            name: poi.name,
            category: poi.category,
            description: poi.description,
            latitude: poi.latitude,
            longitude: poi.longitude,
            address: poi.address || 'Address not available',
            price: poi.price_level || 'Free',
            rating: poi.rating || 4.0,
            reviewCount: 0, // Not available in streaming data
            tags: poi.tags || [],
            amenities: poi.tags || [],
            distance: '0.5 km', // Default value
            city: poi.city,
            country: 'Portugal', // Default
            timeToSpend: poi.time_to_spend || '1-2 hours',
            budget: poi.budget || poi.price_level || 'Free',
            priority: poi.priority || 1,
            featured: false, // Default
            openNow: true // Default
        };
    };

    // Check if POI is in favorites
    const isFavorite = (poiId: string) => {
        return favoritesQuery.data?.some(poi => poi.id === poiId) || false;
    };

    const cities = [
        { id: 'all', label: 'All Cities', count: pois().length },
        { id: 'porto', label: 'Porto', count: 4 },
        { id: 'lisbon', label: 'Lisbon', count: 0 },
        { id: 'barcelona', label: 'Barcelona', count: 0 }
    ];

    const categories = [
        { id: 'all', label: 'All Categories', count: pois().length },
        { id: 'cultural', label: 'Cultural', count: 1 },
        { id: 'landmark', label: 'Landmarks', count: 1 },
        { id: 'market', label: 'Markets', count: 1 },
        { id: 'entertainment', label: 'Entertainment', count: 1 }
    ];

    const priceRanges = [
        { id: 'all', label: 'All Prices' },
        { id: 'free', label: 'Free' },
        { id: '€', label: 'Budget (€)' },
        { id: '€€', label: 'Moderate (€€)' },
        { id: '€€€', label: 'Expensive (€€€)' }
    ];

    const sortOptions = [
        { id: 'popularity', label: 'Popularity' },
        { id: 'rating', label: 'Rating' },
        { id: 'distance', label: 'Distance' },
        { id: 'price', label: 'Price' }
    ];

    // Filter and sort POIs
    const filteredPois = () => {
        let filtered = pois();

        // Search filter
        if (searchQuery()) {
            const query = searchQuery().toLowerCase();
            filtered = filtered.filter(poi =>
                poi.name.toLowerCase().includes(query) ||
                poi.description.toLowerCase().includes(query) ||
                poi.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // City filter
        if (selectedCity() !== 'all') {
            filtered = filtered.filter(poi => poi.city.toLowerCase() === selectedCity());
        }

        // Category filter
        if (selectedCategory() !== 'all') {
            filtered = filtered.filter(poi => poi.category.toLowerCase() === selectedCategory());
        }

        // Rating filter
        if (selectedRating() !== 'all') {
            const minRating = parseInt(selectedRating());
            filtered = filtered.filter(poi => poi.rating >= minRating);
        }

        // Price filter
        if (selectedPrice() !== 'all') {
            filtered = filtered.filter(poi => poi.price === selectedPrice());
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal, bVal;
            switch (sortBy()) {
                case 'rating':
                    aVal = a.rating;
                    bVal = b.rating;
                    break;
                case 'distance':
                    aVal = parseFloat(a.distance);
                    bVal = parseFloat(b.distance);
                    break;
                case 'price':
                    const priceValues = { 'Free': 0, '€': 1, '€€': 2, '€€€': 3 };
                    aVal = priceValues[a.price] || 0;
                    bVal = priceValues[b.price] || 0;
                    break;
                case 'popularity':
                default:
                    aVal = a.reviewCount;
                    bVal = b.reviewCount;
                    break;
            }

            if (sortOrder() === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return filtered;
    };

    const toggleFavorite = (poiId: string) => {
        if (isFavorite(poiId)) {
            removeFromFavoritesMutation.mutate(poiId);
        } else {
            addToFavoritesMutation.mutate(poiId);
        }
    };

    const getPriceColor = (price: string) => {
        const colorMap = {
            'Free': 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900',
            '€': 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900',
            '€€': 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900',
            '€€€': 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900'
        };
        return colorMap[price] || 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
    };

    const renderGridCard = (poi) => (
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 group">
            {/* Image */}
            <div class="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                <div class="absolute inset-0 flex items-center justify-center text-4xl">
                    🏛️
                </div>
                
                {/* Badges */}
                <div class="absolute top-3 left-3 flex flex-col gap-1">
                    <Show when={poi.featured}>
                        <span class="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
                            Featured
                        </span>
                    </Show>
                    <Show when={poi.openNow}>
                        <span class="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                            Open Now
                        </span>
                    </Show>
                </div>

                {/* Action buttons */}
                <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="flex flex-col gap-1">
                        <button
                            onClick={() => toggleFavorite(poi.id)}
                            class={`p-2 rounded-lg ${isFavorite(poi.id) ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700'} hover:scale-110 transition-transform`}
                        >
                            <Heart class={`w-4 h-4 ${isFavorite(poi.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button class="p-2 bg-white/90 text-gray-700 rounded-lg hover:scale-110 transition-transform">
                            <Bookmark class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Rating badge */}
                <div class="absolute bottom-3 left-3">
                    <div class="flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 rounded-full px-2 py-1 text-sm font-medium">
                        <Star class="w-3 h-3 text-yellow-500 fill-current" />
                        <span class="text-gray-900 dark:text-white">{poi.rating}</span>
                        <span class="text-gray-600 dark:text-gray-400">({poi.reviewCount})</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div class="p-4">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 dark:text-white text-base mb-1 truncate">{poi.name}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">{poi.category} • {poi.city}</p>
                    </div>
                    <span class={`px-2 py-1 rounded-full text-xs font-medium ${getPriceColor(poi.price)}`}>
                        {poi.price}
                    </span>
                </div>

                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{poi.description}</p>

                {/* Details */}
                <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500 mb-3">
                    <div class="flex items-center gap-1">
                        <MapPin class="w-3 h-3" />
                        <span>{poi.distance}</span>
                    </div>
                    <Show when={poi.amenities.length > 0}>
                        <div class="flex items-center gap-1">
                            <Clock class="w-3 h-3" />
                            <span>{poi.amenities[0]}</span>
                        </div>
                    </Show>
                </div>

                {/* Tags */}
                <div class="flex flex-wrap gap-1 mb-3">
                    {poi.tags.slice(0, 3).map(tag => (
                        <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                            {tag}
                        </span>
                    ))}
                    {poi.tags.length > 3 && (
                        <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                            +{poi.tags.length - 3}
                        </span>
                    )}
                </div>

                {/* Footer */}
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 text-sm">
                        <Show when={poi.amenities.includes('Wifi')}>
                            <Wifi class="w-4 h-4 text-gray-400" />
                        </Show>
                        <Show when={poi.amenities.includes('Parking')}>
                            <MapPin class="w-4 h-4 text-gray-400" />
                        </Show>
                    </div>
                    <button class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
                        View Details →
                    </button>
                </div>
            </div>
        </div>
    );

    const renderListItem = (poi) => (
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
            <div class="flex gap-4">
                {/* Image */}
                <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    🏛️
                </div>

                {/* Content */}
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between mb-2">
                        <div>
                            <h3 class="font-semibold text-gray-900 dark:text-white text-lg">{poi.name}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">{poi.category} • {poi.city}, {poi.country}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="flex items-center gap-1">
                                <Star class="w-4 h-4 text-yellow-500 fill-current" />
                                <span class="text-sm font-medium text-gray-900 dark:text-white">{poi.rating}</span>
                                <span class="text-sm text-gray-600 dark:text-gray-400">({poi.reviewCount})</span>
                            </div>
                            <span class={`px-2 py-1 rounded-full text-xs font-medium ${getPriceColor(poi.price)}`}>
                                {poi.price}
                            </span>
                        </div>
                    </div>

                    <p class="text-gray-600 dark:text-gray-400 mb-3">{poi.description}</p>

                    <div class="flex items-center justify-between">
                        <div class="flex flex-wrap gap-1">
                            {poi.tags.slice(0, 4).map(tag => (
                                <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div class="flex items-center gap-2">
                            <button
                                onClick={() => toggleFavorite(poi.id)}
                                class={`p-2 rounded-lg ${isFavorite(poi.id) ? 'text-red-600 dark:text-red-400' : 'text-gray-400'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                            >
                                <Heart class={`w-4 h-4 ${isFavorite(poi.id) ? 'fill-current' : ''}`} />
                            </button>
                            <button class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
                                View Details →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
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

            {/* Header */}
            <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Discover {displayLocation()}</h1>
                            <p class="text-gray-600 dark:text-gray-400 mt-1">{pois().length} amazing places to visit</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div class="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Search */}
                        <div class="relative flex-1 max-w-md">
                            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search places..."
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.target.value)}
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filters */}
                        <div class="flex items-center gap-4 overflow-x-auto">
                            <select
                                value={selectedCity()}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <For each={cities}>
                                    {(city) => <option value={city.id}>{city.label} ({city.count})</option>}
                                </For>
                            </select>

                            <select
                                value={selectedCategory()}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <For each={categories}>
                                    {(category) => <option value={category.id}>{category.label} ({category.count})</option>}
                                </For>
                            </select>

                            <select
                                value={selectedPrice()}
                                onChange={(e) => setSelectedPrice(e.target.value)}
                                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <For each={priceRanges}>
                                    {(price) => <option value={price.id}>{price.label}</option>}
                                </For>
                            </select>

                            {/* Sort */}
                            <div class="flex items-center gap-2">
                                <select
                                    value={sortBy()}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <For each={sortOptions}>
                                        {(option) => <option value={option.id}>{option.label}</option>}
                                    </For>
                                </select>
                                <button
                                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                    class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-700"
                                >
                                    {sortOrder() === 'asc' ? <SortAsc class="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <SortDesc class="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                                </button>
                            </div>

                            {/* View mode */}
                            <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-1 bg-white dark:bg-gray-700">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    class={`p-2 rounded ${viewMode() === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                                >
                                    <Grid class="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    class={`p-2 rounded ${viewMode() === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                                >
                                    <List class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="flex items-center justify-between mb-6">
                    <p class="text-gray-600 dark:text-gray-400">
                        {filteredPois().length} place{filteredPois().length !== 1 ? 's' : ''} found
                    </p>
                </div>

                <Show
                    when={filteredPois().length > 0}
                    fallback={
                        <div class="text-center py-12">
                            <Search class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No places found</h3>
                            <p class="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or filters</p>
                        </div>
                    }
                >
                    <div class={viewMode() === 'grid' 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                        : "space-y-4"
                    }>
                        <For each={filteredPois()}>
                            {(poi) => viewMode() === 'grid' ? renderGridCard(poi) : renderListItem(poi)}
                        </For>
                    </div>
                </Show>
            </div>
        </div>
    );

    // Get display location
    const displayLocation = () => {
        const streaming = streamingData();
        if (streaming && streaming.activities && streaming.activities.length > 0) {
            return streaming.activities[0].city || 'Places';
        }
        return 'Places';
    };
}