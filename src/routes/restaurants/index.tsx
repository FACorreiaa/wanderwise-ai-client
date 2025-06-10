import { createSignal, createEffect, For, Show, onMount } from 'solid-js';
import { MapPin, Clock, Star, Filter, Heart, Share2, Download, Edit3, Plus, X, Navigation, Calendar, Users, DollarSign, Camera, Coffee, Utensils, Wifi, CreditCard, Loader2, MessageCircle, Send, ChefHat, Wine, UtensilsCrossed, Smartphone } from 'lucide-solid';
import MapComponent from '@/components/features/Map/Map';

export default function RestaurantsPage() {
    const [selectedRestaurant, setSelectedRestaurant] = createSignal(null);
    const [showFilters, setShowFilters] = createSignal(false);
    const [viewMode, setViewMode] = createSignal('split'); // 'map', 'list', 'split'
    const [myFavorites, setMyFavorites] = createSignal([]); // Track favorite restaurants

    // Chat functionality
    const [showChat, setShowChat] = createSignal(false);
    const [chatMessage, setChatMessage] = createSignal('');
    const [chatHistory, setChatHistory] = createSignal([]);
    const [isLoading, setIsLoading] = createSignal(false);
    const [sessionId, setSessionId] = createSignal('restaurants-session-id');

    // Filter states
    const [activeFilters, setActiveFilters] = createSignal({
        cuisines: ['Portuguese', 'Seafood', 'International'],
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

    const [restaurants, setRestaurants] = createSignal([
        {
            id: "rest-1",
            name: "Taberna Real do Fado",
            cuisine: "Portuguese",
            description: "Authentic Portuguese cuisine in a traditional fado house atmosphere. Live fado performances every evening.",
            latitude: 41.1428,
            longitude: -8.6115,
            priceRange: "€€€",
            rating: 4.6,
            reviewCount: 1247,
            address: "Rua do Vigário 18-20, 4050-627 Porto",
            openingHours: "Tue-Sun: 19:00-02:00, Mon: Closed",
            phone: "+351 22 200 4307",
            website: "www.tabernarealdefado.com",
            features: ["Live Music", "Reservations Required", "Romantic", "Historic Setting"],
            specialties: ["Bacalhau à Brás", "Francesinha", "Vinho Verde"],
            averagePrice: "45-65€ per person",
            images: ["/restaurants/taberna-real.jpg"],
            tags: ["Traditional", "Fado", "Portuguese", "Romantic"]
        },
        {
            id: "rest-2", 
            name: "Cantinho do Avillez",
            cuisine: "Contemporary Portuguese",
            description: "José Avillez's take on modern Portuguese cuisine with creative twists on traditional dishes.",
            latitude: 41.1496,
            longitude: -8.6109,
            priceRange: "€€€€",
            rating: 4.8,
            reviewCount: 892,
            address: "Rua Mouzinho da Silveira 166, 4050-416 Porto",
            openingHours: "Mon-Sun: 12:00-15:00, 19:30-24:00",
            phone: "+351 22 322 3947",
            website: "www.cantinhodoavillez.pt",
            features: ["Michelin Guide", "Chef's Table", "Wine Pairing", "Reservations Required"],
            specialties: ["Tasting Menu", "Signature Codfish", "Portuguese Desserts"],
            averagePrice: "80-120€ per person",
            images: ["/restaurants/cantinho-avillez.jpg"],
            tags: ["Fine Dining", "Contemporary", "Michelin", "Celebrity Chef"]
        },
        {
            id: "rest-3",
            name: "Chez Lapin",
            cuisine: "Seafood",
            description: "Waterfront seafood restaurant with stunning views of the Douro River and fresh daily catches.",
            latitude: 41.1407,
            longitude: -8.6144,
            priceRange: "€€",
            rating: 4.4,
            reviewCount: 1523,
            address: "Cais da Ribeira 40-42, 4050-510 Porto",
            openingHours: "Daily: 12:00-15:00, 18:00-24:00",
            phone: "+351 22 200 6418",
            website: "www.chezlapin.pt",
            features: ["River View", "Fresh Seafood", "Outdoor Seating", "Family Friendly"],
            specialties: ["Grilled Fish", "Seafood Rice", "Caldeirada"],
            averagePrice: "25-40€ per person",
            images: ["/restaurants/chez-lapin.jpg"],
            tags: ["Seafood", "River View", "Fresh", "Traditional"]
        },
        {
            id: "rest-4",
            name: "Mesa 325",
            cuisine: "International",
            description: "Modern bistro offering international fusion cuisine with local ingredients and craft cocktails.",
            latitude: 41.1512,
            longitude: -8.6203,
            priceRange: "€€",
            rating: 4.5,
            reviewCount: 687,
            address: "Rua do Rosário 325, 4050-521 Porto",
            openingHours: "Tue-Sat: 18:00-02:00, Sun-Mon: Closed",
            phone: "+351 22 013 1106",
            website: "www.mesa325.com",
            features: ["Craft Cocktails", "Late Night", "Trendy", "Good for Groups"],
            specialties: ["Fusion Tapas", "Signature Cocktails", "Weekend Brunch"],
            averagePrice: "30-50€ per person",
            images: ["/restaurants/mesa-325.jpg"],
            tags: ["International", "Cocktails", "Modern", "Trendy"]
        },
        {
            id: "rest-5",
            name: "Casa do Livro",
            cuisine: "Vegetarian",
            description: "Charming bookstore café serving organic vegetarian and vegan dishes in a literary atmosphere.",
            latitude: 41.1467,
            longitude: -8.6157,
            priceRange: "€",
            rating: 4.3,
            reviewCount: 456,
            address: "Rua Galeria de Paris 85, 4050-284 Porto",
            openingHours: "Mon-Sat: 09:00-19:00, Sun: 10:00-18:00",
            phone: "+351 22 207 4321",
            website: "www.casadolivro.pt",
            features: ["Bookstore", "Vegetarian", "Organic", "WiFi", "Quiet"],
            specialties: ["Buddha Bowl", "Organic Coffee", "Vegan Pastries"],
            averagePrice: "15-25€ per person",
            images: ["/restaurants/casa-livro.jpg"],
            tags: ["Vegetarian", "Bookstore", "Organic", "Cozy"]
        },
        {
            id: "rest-6",
            name: "Antiqvvm",
            cuisine: "Fine Dining",
            description: "Michelin-starred restaurant offering innovative Portuguese cuisine with panoramic city views.",
            latitude: 41.1521,
            longitude: -8.6294,
            priceRange: "€€€€",
            rating: 4.9,
            reviewCount: 234,
            address: "Rua de Entre Quintas 220, 4050-240 Porto",
            openingHours: "Wed-Sat: 19:30-24:00, Closed Sun-Tue",
            phone: "+351 22 617 4885",
            website: "www.antiqvvm.pt",
            features: ["Michelin Star", "City Views", "Tasting Menu", "Wine Cellar"],
            specialties: ["Tasting Menu", "Portuguese Gastronomy", "Wine Pairing"],
            averagePrice: "150-200€ per person",
            images: ["/restaurants/antiqvvm.jpg"],
            tags: ["Michelin Star", "Fine Dining", "Views", "Exclusive"]
        }
    ]);

    // Chat logic
    const sendChatMessage = async () => {
        if (!chatMessage().trim() || isLoading()) return;

        const userMessage = chatMessage().trim();
        setChatMessage('');
        setIsLoading(true);

        setChatHistory(prev => [...prev, { type: 'user', content: userMessage, timestamp: new Date() }]);

        try {
            // Simulate API call for restaurant recommendations
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setChatHistory(prev => [...prev, {
                type: 'assistant',
                content: "I'd be happy to help you find the perfect restaurant! Based on your preferences, I can recommend places with specific cuisines, price ranges, or dining experiences. What type of dining experience are you looking for?",
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

    const filteredRestaurants = () => {
        return restaurants().filter(restaurant => {
            const filters = activeFilters();
            // Cuisine filter
            if (filters.cuisines.length > 0 && !filters.cuisines.some(cuisine => restaurant.tags.includes(cuisine))) return false;
            // Price range filter
            if (filters.priceRange.length > 0 && !filters.priceRange.includes(restaurant.priceRange)) return false;
            // Features filter
            if (filters.features.length > 0 && !filters.features.some(feature => restaurant.features.includes(feature))) return false;
            // Rating filter
            if (filters.rating > 0 && restaurant.rating < filters.rating) return false;
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

    const addToFavorites = (restaurant) => {
        setMyFavorites(prev => prev.some(item => item.id === restaurant.id) ? prev : [...prev, restaurant]);
    };

    const renderRestaurantCard = (restaurant) => {
        const IconComponent = getCuisineIcon(restaurant.cuisine);
        return (
            <div
                class={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${selectedRestaurant()?.id === restaurant.id ? 'ring-2 ring-blue-500 shadow-md' : 'border-gray-200'}`}
                onClick={() => setSelectedRestaurant(restaurant)}
            >
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                        <IconComponent class="w-5 h-5 text-white" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-2">
                            <div>
                                <h3 class="font-semibold text-gray-900 text-sm">{restaurant.name}</h3>
                                <p class="text-xs text-gray-500">{restaurant.cuisine}</p>
                            </div>
                            <div class="flex items-center gap-1 text-xs">
                                <Star class="w-3 h-3 text-yellow-500 fill-current" />
                                <span class="text-gray-600">{restaurant.rating}</span>
                                <span class="text-gray-400">({restaurant.reviewCount})</span>
                            </div>
                        </div>
                        <p class="text-xs text-gray-600 mb-3 line-clamp-2">{restaurant.description}</p>
                        <div class="flex items-center justify-between text-xs">
                            <div class="flex items-center gap-3">
                                <div class={`font-medium ${getPriceColor(restaurant.priceRange)}`}>
                                    {restaurant.priceRange}
                                </div>
                                <div class="text-gray-500">
                                    {restaurant.averagePrice}
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-1">
                                {restaurant.features.slice(0, 2).map(feature => (
                                    <span class="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">
                                        {feature}
                                    </span>
                                ))}
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

    const renderChatInterface = () => (
        <Show when={showChat()}>
            <div class="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
                <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-orange-600 text-white rounded-t-lg">
                    <div class="flex items-center gap-2">
                        <MessageCircle class="w-5 h-5" />
                        <span class="font-medium">Restaurant Recommendations</span>
                    </div>
                    <button
                        onClick={() => setShowChat(false)}
                        class="p-1 hover:bg-orange-700 rounded"
                    >
                        <X class="w-4 h-4" />
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto p-4 space-y-4">
                    <Show when={chatHistory().length === 0}>
                        <div class="text-center text-gray-500 py-8">
                            <Utensils class="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p class="text-sm">Ask me for restaurant recommendations!</p>
                            <p class="text-xs mt-2 text-gray-400">
                                Try: "Find me a romantic dinner spot" or "Vegetarian restaurants with good reviews"
                            </p>
                        </div>
                    </Show>

                    <For each={chatHistory()}>
                        {(message) => (
                            <div class={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div class={`max-w-[80%] p-3 rounded-lg text-sm ${message.type === 'user'
                                    ? 'bg-orange-600 text-white'
                                    : message.type === 'error'
                                        ? 'bg-red-100 text-red-800 border border-red-200'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    <p class="whitespace-pre-wrap">{message.content}</p>
                                    <p class={`text-xs mt-1 opacity-70 ${message.type === 'user' ? 'text-orange-100' : 'text-gray-500'}`}>
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
                                <span>Finding perfect restaurants...</span>
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
                            placeholder="Ask for restaurant recommendations..."
                            class="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            rows="2"
                            disabled={isLoading()}
                        />
                        <button
                            onClick={sendChatMessage}
                            disabled={!chatMessage().trim() || isLoading()}
                            class="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            {/* Header - Mobile First */}
            <div class="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
                <div class="max-w-7xl mx-auto">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 class="text-xl font-bold text-gray-900 sm:text-2xl">Restaurants in {searchParams().location}</h1>
                            <p class="text-sm text-gray-600 mt-1 sm:text-base">Discover the best dining experiences</p>
                        </div>
                        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                            {/* View Mode Toggle */}
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

                            {/* Action Buttons */}
                            <div class="flex flex-col gap-2 sm:flex-row sm:gap-3">
                                <button
                                    onClick={() => setShowChat(true)}
                                    class="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all shadow-sm text-sm font-medium"
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
            <div class="bg-white border-b border-gray-200 px-4 py-3 relative sm:px-6">
                <div class="max-w-7xl mx-auto">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div class="flex items-center gap-4">
                            <button
                                onClick={() => setShowFilters(!showFilters())}
                                class={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${showFilters() ? 'bg-orange-50 border-orange-200 text-orange-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <Filter class="w-4 h-4" />
                                Filters
                            </button>
                            <div class="text-sm text-gray-600">
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
                                    <h2 class="text-lg font-semibold text-gray-900">Available Restaurants</h2>
                                    <p class="text-sm text-gray-600 self-start sm:self-auto">
                                        Found {filteredRestaurants().length} restaurants
                                    </p>
                                </div>
                                <div class="grid gap-3">
                                    <For each={filteredRestaurants()}>
                                        {(restaurant) => renderRestaurantCard(restaurant)}
                                    </For>
                                </div>
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
                    class="fixed bottom-4 right-4 w-12 h-12 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all hover:scale-105 flex items-center justify-center z-40 sm:bottom-6 sm:right-6 sm:w-14 sm:h-14"
                >
                    <Utensils class="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
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
                                            onClick={() => addToFavorites(selectedRestaurant())}
                                            class={`px-4 py-2 rounded-lg text-sm font-medium ${myFavorites().some(item => item.id === selectedRestaurant().id) ? 'bg-red-600 text-white' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                                        >
                                            {myFavorites().some(item => item.id === selectedRestaurant().id) ? 'Favorited' : 'Add to Favorites'}
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