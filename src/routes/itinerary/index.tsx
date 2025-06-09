import { createSignal, createEffect, For, Show, onMount } from 'solid-js';
import mapboxgl from 'mapbox-gl';
import { MapPin, Clock, Star, Filter, Heart, Share2, Download, Edit3, Plus, X, Navigation, Calendar, Users, DollarSign, Camera, Coffee, Utensils, Building, Museum, TreePine, ShoppingBag } from 'lucide-solid';

export default function ItineraryResultsPage() {
    const [map, setMap] = createSignal(null);
    const [selectedPOI, setSelectedPOI] = createSignal(null);
    const [showFilters, setShowFilters] = createSignal(false);
    const [viewMode, setViewMode] = createSignal('split'); // 'map', 'list', 'split'
    const [myTrip, setMyTrip] = createSignal([]); // Track selected POIs for the trip

    // Filter states
    const [activeFilters, setActiveFilters] = createSignal({
        categories: ['Historic Sites', 'Local Cuisine', 'Museums', 'Architecture'],
        timeToSpend: [],
        budget: [],
        accessibility: [],
        dogFriendly: true
    });

    // Sample itinerary data
    const [itinerary, setItinerary] = createSignal({
        name: "Porto's Charms: Sightseeing & Local Delights (Dog-Friendly)",
        description: "This itinerary focuses on showcasing Porto's key landmarks and offering authentic local experiences, all while keeping your furry friend in mind.",
        city: "Porto",
        country: "Portugal",
        duration: "3 days",
        centerLat: 41.1579,
        centerLng: -8.6291
    });

    const [pointsOfInterest, setPointsOfInterest] = createSignal([
        // ... (Your existing pointsOfInterest array remains unchanged)
        {
            id: "64946139-a4c2-42b0-8071-fe83b34596f8",
            name: "Livraria Lello",
            category: "Bookstore & Architecture",
            description: "One of the world's most beautiful bookstores, featuring stunning neo-gothic architecture and an iconic spiral staircase that inspired J.K. Rowling.",
            latitude: 41.1465,
            longitude: -8.6144,
            timeToSpend: "1-2 hours",
            budget: "€€",
            rating: 4.2,
            dogFriendly: false,
            address: "R. das Carmelitas 144, 4050-161 Porto",
            openingHours: "Mon-Sun: 9:30-19:00",
            tags: ["Historic Sites", "Architecture", "Literature"],
            priority: 1
        },
        {
            id: "63302849-9142-4325-9918-8b8a36a0a8d5",
            name: "Ponte Luís I",
            category: "Bridge & Landmark",
            description: "Iconic double-deck iron bridge offering spectacular views of Porto and Vila Nova de Gaia. Perfect for photography and riverside walks.",
            latitude: 41.1407,
            longitude: -8.6111,
            timeToSpend: "30-60 minutes",
            budget: "Free",
            rating: 4.6,
            dogFriendly: true,
            address: "Ponte Luís I, Porto",
            openingHours: "24/7",
            tags: ["Architecture", "Photography", "Views"],
            priority: 2
        },
        {
            id: "0b2f5cfa-5331-46fd-8f70-5b0a71e7464b",
            name: "Cais da Ribeira",
            category: "Historical District",
            description: "UNESCO World Heritage waterfront district with colorful buildings, traditional restaurants, and vibrant atmosphere along the Douro River.",
            latitude: 41.1408,
            longitude: -8.6146,
            timeToSpend: "2-3 hours",
            budget: "€€",
            rating: 4.5,
            dogFriendly: true,
            address: "Cais da Ribeira, 4050 Porto",
            openingHours: "24/7",
            tags: ["Historic Sites", "Local Cuisine", "Photography"],
            priority: 1
        },
        {
            id: "ddcb38fa-e543-414f-ab32-1906b5fa3267",
            name: "Palácio da Bolsa",
            category: "Palace & Museum",
            description: "19th-century neoclassical building featuring the stunning Arabian Room with intricate Moorish-style decorations.",
            latitude: 41.1421,
            longitude: -8.6156,
            timeToSpend: "1-2 hours",
            budget: "€€€",
            rating: 4.4,
            dogFriendly: false,
            address: "R. de Ferreira Borges, 4050-253 Porto",
            openingHours: "Mon-Sun: 9:00-18:30",
            tags: ["Architecture", "Museums", "Historic Sites"],
            priority: 2
        },
        {
            id: "b2d634fa-bfae-41ee-b3ea-21a52439d84e",
            name: "Jardins do Palácio de Cristal",
            category: "Parks & Gardens",
            description: "Beautiful romantic gardens with panoramic views over the Douro River, perfect for relaxing walks with your furry companion.",
            latitude: 41.1507,
            longitude: -8.6279,
            timeToSpend: "1-2 hours",
            budget: "Free",
            rating: 4.3,
            dogFriendly: true,
            address: "R. de Dom Manuel II, 4050-346 Porto",
            openingHours: "Daily: 8:00-21:00",
            tags: ["Nature", "Photography", "Walking"],
            priority: 2
        },
        {
            id: "29dd88d4-a642-4e23-95be-49a849a3170a",
            name: "Vila Nova de Gaia Port Cellars",
            category: "Wine Tasting",
            description: "Historic port wine cellars offering tastings and tours with stunning views across the Douro to Porto's skyline.",
            latitude: 41.1367,
            longitude: -8.6126,
            timeToSpend: "2-3 hours",
            budget: "€€€",
            rating: 4.7,
            dogFriendly: false,
            address: "Vila Nova de Gaia, Portugal",
            openingHours: "Mon-Sun: 10:00-18:00",
            tags: ["Wine", "Local Culture", "Views"],
            priority: 1
        }
    ]);

    const filterOptions = {
        categories: [
            { id: 'historic', label: 'Historic Sites', icon: Building },
            { id: 'cuisine', label: 'Local Cuisine', icon: Utensils },
            { id: 'museums', label: 'Museums', icon: Museum },
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
            'Palace & Museum': Museum,
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

    const filteredPOIs = () => {
        return pointsOfInterest().filter(poi => {
            const filters = activeFilters();
            // Dog-friendly filter
            if (filters.dogFriendly && !poi.dogFriendly) return false;
            // Category filter
            if (filters.categories.length > 0 && !poi.tags.some(tag => filters.categories.includes(tag))) return false;
            // Time to spend filter
            if (filters.timeToSpend.length > 0 && !filters.timeToSpend.includes(poi.timeToSpend)) return false;
            // Budget filter
            if (filters.budget.length > 0 && !filters.budget.includes(poi.budget)) return false;
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

    const initializeMap = () => {
        console.log('import.meta.env.VITE_MAPBOX_API_KEY', import.meta.env.VITE_MAPBOX_API_KEY)
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY
        const newMap = new mapboxgl.Map({
            container: 'map-container',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [itinerary().centerLng, itinerary().centerLat],
            zoom: 12,
            minZoom: 15,
            maxZoom: 22
        });

        newMap.on('load', () => {
            filteredPOIs().forEach((poi, index) => {
                const marker = new mapboxgl.Marker({
                    color: poi.priority === 1 ? '#EF4444' : '#3B82F6'
                })
                    .setLngLat([poi.longitude, poi.latitude])
                    .setPopup(new mapboxgl.Popup().setHTML(`<h3>${poi.name}</h3><p>${poi.category}</p>`))
                    .addTo(newMap);
            });
        });

        setMap(newMap);
    };

    onMount(() => {
        initializeMap();
    });

    createEffect(() => {
        if (map()) {
            // Update markers when filteredPOIs change
            map().getCanvas().style.cursor = '';
            // Remove existing markers (simplified; in production, manage markers more efficiently)
            document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());
            filteredPOIs().forEach((poi, index) => {
                new mapboxgl.Marker({
                    color: poi.priority === 1 ? '#EF4444' : '#3B82F6'
                })
                    .setLngLat([poi.longitude, poi.latitude])
                    .setPopup(new mapboxgl.Popup().setHTML(`<h3>${poi.name}</h3><p>${poi.category}</p>`))
                    .addTo(map());
            });
        }
    });

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

    return (
        <div class="min-h-screen bg-gray-50">
            {/* Header */}
            <div class="bg-white border-b border-gray-200 px-6 py-4">
                <div class="max-w-7xl mx-auto">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900">{itinerary().name}</h1>
                            <p class="text-gray-600 mt-1">{itinerary().city}, {itinerary().country} • {itinerary().duration}</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('map')}
                                    class={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode() === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    Map
                                </button>
                                <button
                                    onClick={() => setViewMode('split')}
                                    class={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode() === 'split' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    Split
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    class={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode() === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    List
                                </button>
                            </div>
                            <button class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                <Heart class="w-4 h-4" />
                                <span class="text-sm font-medium">Save</span>
                            </button>
                            <button class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                <Share2 class="w-4 h-4" />
                                <span class="text-sm font-medium">Share</span>
                            </button>
                            <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Download class="w-4 h-4" />
                                <span class="text-sm font-medium">Export</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div class="bg-white border-b border-gray-200 px-6 py-3 relative">
                <div class="max-w-7xl mx-auto">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <button
                                onClick={() => setShowFilters(!showFilters())}
                                class={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showFilters() ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <Filter class="w-4 h-4" />
                                <span class="text-sm font-medium">Filters</span>
                            </button>
                            <div class="text-sm text-gray-600">
                                Showing {filteredPOIs().length} places
                            </div>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar class="w-4 h-4" />
                            <span>Best visited: May - September</span>
                        </div>
                    </div>
                    {renderFiltersPanel()}
                </div>
            </div>

            {/* Main Content */}
            <div class="max-w-7xl mx-auto px-6 py-6">
                <div class={`grid gap-6 ${viewMode() === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                    <Show when={viewMode() === 'map' || viewMode() === 'split'}>
                        <div class={viewMode() === 'map' ? 'col-span-full h-[600px]' : 'h-[500px]'}>
                            {renderMap()}
                        </div>
                    </Show>
                    <Show when={viewMode() === 'list' || viewMode() === 'split'}>
                        <div class={viewMode() === 'list' ? 'col-span-full' : ''}>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <h2 class="text-lg font-semibold text-gray-900">Places to Visit</h2>
                                    <button class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
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

                {/* Selected POI Details */}
                <Show when={selectedPOI()}>
                    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                            <div class="p-6">
                                <div class="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 class="text-xl font-bold text-gray-900">{selectedPOI().name}</h3>
                                        <p class="text-gray-600">{selectedPOI().category}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedPOI(null)}
                                        class="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <X class="w-5 h-5" />
                                    </button>
                                </div>
                                <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div class="flex items-center gap-2">
                                        <Clock class="w-4 h-4 text-gray-500" />
                                        <span>{selectedPOI().timeToSpend}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <DollarSign class="w-4 h-4 text-gray-500" />
                                        <span class={getBudgetColor(selectedPOI().budget)}>{selectedPOI().budget}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <MapPin class="w-4 h-4 text-gray-500" />
                                        <span>{selectedPOI().address}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <Star class="w-4 h-4 text-yellow-500 fill-current" />
                                        <span>{selectedPOI().rating}/5</span>
                                    </div>
                                </div>
                                <p class="text-gray-700 mb-4">{selectedPOI().description}</p>
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
                                    <div class="flex items-center justify-between">
                                        <div class="text-sm text-gray-600">
                                            <p><strong>Hours:</strong> {selectedPOI().openingHours}</p>
                                        </div>
                                        <div class="flex gap-2">
                                            <button
                                                onClick={() => addToTrip(selectedPOI())}
                                                class={`px-4 py-2 rounded-lg text-sm ${myTrip().some(item => item.id === selectedPOI().id) ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
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
        </div>
    );
}