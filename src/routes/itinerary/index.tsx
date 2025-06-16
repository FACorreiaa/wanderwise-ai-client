import { createSignal, createEffect, For, Show, onMount } from 'solid-js';
import { useLocation } from '@solidjs/router';
import mapboxgl from 'mapbox-gl';
import { MapPin, Clock, Star, Filter, Heart, Share2, Download, Edit3, Plus, X, Navigation, Calendar, Users, DollarSign, Camera, Coffee, Utensils, Building, TreePine, ShoppingBag, Loader2, MessageCircle, Send } from 'lucide-solid';
import MapComponent from '~/components/features/Map/Map';
import { useItineraries, useItinerary, useUpdateItineraryMutation, useSaveItineraryMutation } from '~/lib/api/itineraries';
import type { AiCityResponse, POIDetail } from '~/lib/api/types';

export default function ItineraryResultsPage() {
    const location = useLocation();
    const [map, setMap] = createSignal(null);
    const [selectedPOI, setSelectedPOI] = createSignal(null);
    const [showFilters, setShowFilters] = createSignal(false);
    const [viewMode, setViewMode] = createSignal('split'); // 'map', 'list', 'split'
    const [myTrip, setMyTrip] = createSignal([]); // Track selected POIs for the trip
    const [currentItineraryId, setCurrentItineraryId] = createSignal(null);
    const [streamingData, setStreamingData] = createSignal(null);
    const [fromChat, setFromChat] = createSignal(false);

    // Chat functionality
    const [showChat, setShowChat] = createSignal(false);
    const [chatMessage, setChatMessage] = createSignal('');
    const [chatHistory, setChatHistory] = createSignal([]);
    const [isLoading, setIsLoading] = createSignal(false);
    const [sessionId, setSessionId] = createSignal('your-session-id');

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
        // Check for streaming data from route state
        if (location.state?.streamingData) {
            setStreamingData(location.state.streamingData);
            setFromChat(true);
            console.log('Received streaming data from chat:', location.state.streamingData);
            console.log('Points of interest:', location.state.streamingData.points_of_interest);
            console.log('Itinerary POIs:', location.state.streamingData.itinerary_response?.points_of_interest);
        } else {
            // Try to get data from session storage
            const storedSession = sessionStorage.getItem('completedStreamingSession');
            if (storedSession) {
                try {
                    const session = JSON.parse(storedSession);
                    if (session.data) {
                        setStreamingData(session.data);
                        setFromChat(true);
                        console.log('Loaded streaming data from session storage:', session.data);
                        console.log('Points of interest:', session.data.points_of_interest);
                        console.log('Itinerary POIs:', session.data.itinerary_response?.points_of_interest);
                    }
                } catch (error) {
                    console.error('Error parsing stored session:', error);
                }
            }
        }
    });

    // Get current itinerary data from streaming data, API, or fallback
    const itinerary = () => {
        const streaming = streamingData();
        
        if (streaming && streaming.general_city_data) {
            // Map streaming data to itinerary format
            return {
                name: streaming.itinerary_response?.itinerary_name || `${streaming.general_city_data.city} Adventure`,
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

        const userMessage = chatMessage().trim();
        setChatMessage('');
        setIsLoading(true);

        // Add user message to chat history
        setChatHistory(prev => [...prev, { type: 'user', content: userMessage, timestamp: new Date() }]);

        try {
            // Call your continue session API
            const response = await fetch('/api/continue-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: sessionId(),
                    message: userMessage
                })
            });

            const data = await response.json();

            // Add AI response to chat history
            setChatHistory(prev => [...prev, {
                type: 'assistant',
                content: data.response,
                timestamp: new Date()
            }]);

            // Update itinerary data if provided
            if (data.updatedItinerary) {
                setItinerary(data.updatedItinerary);
            }

            // Update POIs if provided
            if (data.updatedPOIs) {
                setPointsOfInterest(data.updatedPOIs);
            }

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
                    <div class={`w-10 h-10 rounded-full ${getPriorityColor(poi.priority)} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent class="w-5 h-5 text-white" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-2">
                            <div>
                                <h3 class="font-semibold text-gray-900 text-sm">{poi.name}</h3>
                                <p class="text-xs text-gray-500">{poi.category}</p>
                            </div>
                            <div class="flex items-center gap-1 text-xs">
                                <Star class="w-3 h-3 text-yellow-500 fill-current" />
                                <span class="text-gray-600">{poi.rating}</span>
                            </div>
                        </div>
                        <p class="text-xs text-gray-600 mb-3 line-clamp-2">{poi.description}</p>
                        <div class="flex items-center justify-between text-xs">
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-1 text-gray-500">
                                    <Clock class="w-3 h-3" />
                                    <span>{poi.timeToSpend}</span>
                                </div>
                                <div class={`font-medium ${getBudgetColor(poi.budget)}`}>
                                    {poi.budget}
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                {poi.dogFriendly && (
                                    <span class="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                                        🐕 Dog OK
                                    </span>
                                )}
                                <button
                                    onClick={(e) => { e.stopPropagation(); movePOI(poi.id, 'up'); }}
                                    class="text-gray-500 hover:text-blue-600"
                                >
                                    ↑
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); movePOI(poi.id, 'down'); }}
                                    class="text-gray-500 hover:text-blue-600"
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
        <div class="min-h-screen bg-gray-50">
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
                                    ✨ Your personalized itinerary is ready!
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
            <div class="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
                <div class="max-w-7xl mx-auto">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 class="text-xl font-bold text-gray-900 sm:text-2xl">{itinerary().name}</h1>
                            <p class="text-sm text-gray-600 mt-1 sm:text-base">{itinerary().city}, {itinerary().country} • {itinerary().duration}</p>
                        </div>
                        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                            {/* View Mode Toggle - Stack on Mobile */}
                            <div class="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
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
            <div class="bg-white border-b border-gray-200 px-4 py-3 relative sm:px-6">
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
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6">
                        <div class="grid gap-6 lg:grid-cols-3">
                            {/* City Information */}
                            <div class="lg:col-span-2">
                                <h2 class="text-xl font-bold text-gray-900 mb-3">
                                    About {streamingData()?.general_city_data?.city}
                                </h2>
                                <p class="text-gray-700 text-sm leading-relaxed mb-4">
                                    {streamingData()?.general_city_data?.description}
                                </p>
                                <div class="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <span class="font-medium text-gray-600">Population:</span>
                                        <div class="text-gray-800">{streamingData()?.general_city_data?.population}</div>
                                    </div>
                                    <div>
                                        <span class="font-medium text-gray-600">Language:</span>
                                        <div class="text-gray-800">{streamingData()?.general_city_data?.language}</div>
                                    </div>
                                    <div>
                                        <span class="font-medium text-gray-600">Weather:</span>
                                        <div class="text-gray-800">{streamingData()?.general_city_data?.weather}</div>
                                    </div>
                                    <div>
                                        <span class="font-medium text-gray-600">Timezone:</span>
                                        <div class="text-gray-800">{streamingData()?.general_city_data?.timezone}</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Quick Stats */}
                            <div class="bg-white rounded-lg p-4 shadow-sm">
                                <h3 class="font-semibold text-gray-900 mb-3 text-sm">Quick Info</h3>
                                <div class="space-y-2 text-xs">
                                    <Show when={streamingData()?.points_of_interest}>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">General POIs:</span>
                                            <span class="font-medium">{streamingData()?.points_of_interest?.length || 0}</span>
                                        </div>
                                    </Show>
                                    <Show when={streamingData()?.itinerary_response?.points_of_interest}>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Itinerary POIs:</span>
                                            <span class="font-medium">{streamingData()?.itinerary_response?.points_of_interest?.length || 0}</span>
                                        </div>
                                    </Show>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Area:</span>
                                        <span class="font-medium">{streamingData()?.general_city_data?.area}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* General POIs Summary */}
                        <Show when={streamingData()?.points_of_interest && streamingData().points_of_interest.length > 0}>
                            <div class="mt-6">
                                <h3 class="text-lg font-semibold text-gray-900 mb-3">All Points of Interest in {streamingData()?.general_city_data?.city}</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <For each={streamingData()?.points_of_interest?.slice(0, 6)}>
                                        {(poi) => (
                                            <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                                <h4 class="font-medium text-gray-900 text-sm mb-1">{poi.name}</h4>
                                                <p class="text-xs text-gray-600 mb-2">{poi.category}</p>
                                                <p class="text-xs text-gray-700 line-clamp-2">{poi.description_poi}</p>
                                            </div>
                                        )}
                                    </For>
                                </div>
                                <Show when={streamingData()?.points_of_interest?.length > 6}>
                                    <p class="text-xs text-gray-500 mt-3 text-center">
                                        And {streamingData().points_of_interest.length - 6} more places to explore...
                                    </p>
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
                            <MapComponent
                                center={[itinerary().centerLng, itinerary().centerLat]}
                                zoom={12}
                                minZoom={10}
                                maxZoom={22}
                                pointsOfInterest={filteredMapPOIs()}
                                style="mapbox://styles/mapbox/streets-v12"
                            />
                        </div>
                    </Show>

                    <Show when={viewMode() === 'list' || viewMode() === 'split'}>
                        <div class={viewMode() === 'list' ? 'col-span-full' : ''}>
                            <div class="space-y-4">
                                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 class="text-lg font-semibold text-gray-900">Your Curated Itinerary</h2>
                                        <p class="text-sm text-gray-600">Personalized places to visit based on your preferences</p>
                                    </div>
                                    <button class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto">
                                        <Edit3 class="w-4 h-4" />
                                        Customize Order
                                    </button>
                                </div>
                                <div class="grid gap-3">
                                    <For each={filteredPOIs()}>
                                        {(poi) => renderPOICard(poi)}
                                    </For>
                                </div>
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