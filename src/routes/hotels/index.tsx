import { createSignal, createEffect, For, Show, onMount } from 'solid-js';
import { MapPin, Clock, Star, Filter, Heart, Share2, Download, Edit3, Plus, X, Navigation, Calendar, Users, DollarSign, Camera, Coffee, Utensils, Wifi, CreditCard, Loader2, MessageCircle, Send, Bed, Building2, Car, Waves, Dumbbell, UtensilsCrossed, Shield, Phone } from 'lucide-solid';
import MapComponent from '@/components/features/Map/Map';

export default function HotelsPage() {
    const [selectedHotel, setSelectedHotel] = createSignal(null);
    const [showFilters, setShowFilters] = createSignal(false);
    const [viewMode, setViewMode] = createSignal('split'); // 'map', 'list', 'split'
    const [myBookmarks, setMyBookmarks] = createSignal([]); // Track bookmarked hotels

    // Chat functionality
    const [showChat, setShowChat] = createSignal(false);
    const [chatMessage, setChatMessage] = createSignal('');
    const [chatHistory, setChatHistory] = createSignal([]);
    const [isLoading, setIsLoading] = createSignal(false);
    const [sessionId, setSessionId] = createSignal('hotels-session-id');

    // Filter states
    const [activeFilters, setActiveFilters] = createSignal({
        types: ['Hotel', 'Boutique', 'Historic'],
        priceRange: [],
        amenities: [],
        rating: 0
    });

    // Sample search/booking parameters
    const [searchParams, setSearchParams] = createSignal({
        location: "Porto, Portugal",
        checkIn: "2024-01-15",
        checkOut: "2024-01-18",
        guests: 2,
        rooms: 1,
        centerLat: 41.1579,
        centerLng: -8.6291
    });

    // Sample hotels data for Porto
    const [hotels, setHotels] = createSignal([
        {
            id: "hotel-1",
            name: "The Yeatman",
            type: "Luxury Hotel",
            description: "Award-winning luxury hotel with panoramic views over Porto and the Douro River. Wine-focused with Michelin-starred dining.",
            latitude: 41.1366,
            longitude: -8.6122,
            priceRange: "€€€€",
            rating: 4.8,
            reviewCount: 3421,
            address: "Rua do Choupelo, 4400-088 Vila Nova de Gaia",
            phone: "+351 22 013 3100",
            website: "www.the-yeatman-hotel.com",
            checkInTime: "15:00",
            checkOutTime: "12:00",
            pricePerNight: "€450-€800",
            amenities: ["Spa", "Pool", "Restaurant", "Wine Cellar", "Gym", "Concierge", "Parking", "WiFi"],
            roomTypes: ["Deluxe Room", "Junior Suite", "Master Suite", "Presidential Suite"],
            images: ["/hotels/yeatman.jpg"],
            tags: ["Luxury", "Wine Hotel", "Views", "Michelin"],
            cancellationPolicy: "Free cancellation up to 24 hours before arrival",
            features: ["Michelin Restaurant", "Wine Tours", "River Views", "Luxury Spa"]
        },
        {
            id: "hotel-2",
            name: "Pestana Vintage Porto",
            type: "Historic Hotel",
            description: "Charming historic hotel in restored 16th-century buildings in the heart of Ribeira, UNESCO World Heritage site.",
            latitude: 41.1411,
            longitude: -8.6151,
            priceRange: "€€€",
            rating: 4.5,
            reviewCount: 2187,
            address: "Rua da Ribeira 1, 4050-513 Porto",
            phone: "+351 22 340 2300",
            website: "www.pestana.com",
            checkInTime: "15:00",
            checkOutTime: "11:00",
            pricePerNight: "€180-€350",
            amenities: ["Restaurant", "Bar", "WiFi", "Concierge", "Historic Building", "River Views"],
            roomTypes: ["Standard Room", "Superior Room", "Deluxe Room", "Suite"],
            images: ["/hotels/pestana-vintage.jpg"],
            tags: ["Historic", "UNESCO", "Riverside", "Traditional"],
            cancellationPolicy: "Free cancellation up to 48 hours before arrival",
            features: ["Historic Building", "UNESCO Location", "River Views", "Traditional Architecture"]
        },
        {
            id: "hotel-3",
            name: "Casa da Guitarra",
            type: "Boutique Hotel",
            description: "Intimate boutique hotel celebrating Portuguese music and culture, located in a beautifully restored 18th-century building.",
            latitude: 41.1467,
            longitude: -8.6089,
            priceRange: "€€",
            rating: 4.6,
            reviewCount: 892,
            address: "Rua de São Bento da Vitória 87, 4050-543 Porto",
            phone: "+351 22 207 5199",
            website: "www.casadaguitarra.com",
            checkInTime: "14:00",
            checkOutTime: "12:00",
            pricePerNight: "€120-€220",
            amenities: ["Restaurant", "Bar", "WiFi", "Music Room", "Terrace", "Library"],
            roomTypes: ["Classic Room", "Superior Room", "Junior Suite"],
            images: ["/hotels/casa-guitarra.jpg"],
            tags: ["Boutique", "Music Theme", "Cultural", "Intimate"],
            cancellationPolicy: "Free cancellation up to 72 hours before arrival",
            features: ["Music Theme", "Cultural Experience", "Historic Building", "Intimate Setting"]
        },
        {
            id: "hotel-4",
            name: "InterContinental Porto - Palacio das Cardosas",
            type: "Luxury Hotel",
            description: "Elegant luxury hotel housed in an 18th-century palace in Porto's historic center, offering sophisticated accommodations.",
            latitude: 41.1484,
            longitude: -8.6107,
            priceRange: "€€€€",
            rating: 4.7,
            reviewCount: 1643,
            address: "Praça da Liberdade 25, 4000-322 Porto",
            phone: "+351 22 003 5600",
            website: "www.porto.intercontinental.com",
            checkInTime: "15:00",
            checkOutTime: "12:00",
            pricePerNight: "€350-€650",
            amenities: ["Spa", "Restaurant", "Bar", "Gym", "Concierge", "Business Center", "WiFi", "Valet Parking"],
            roomTypes: ["Classic Room", "Premium Room", "Executive Suite", "Presidential Suite"],
            images: ["/hotels/intercontinental-porto.jpg"],
            tags: ["Luxury", "Palace", "Historic Center", "Business"],
            cancellationPolicy: "Free cancellation up to 24 hours before arrival",
            features: ["Historic Palace", "Central Location", "Luxury Amenities", "Business Facilities"]
        },
        {
            id: "hotel-5",
            name: "Torel Avantgarde",
            type: "Design Hotel",
            description: "Contemporary design hotel featuring avant-garde art and modern luxury in Porto's cultural district.",
            latitude: 41.1523,
            longitude: -8.6234,
            priceRange: "€€€",
            rating: 4.4,
            reviewCount: 756,
            address: "Rua da Restauração 336, 4050-506 Porto",
            phone: "+351 22 340 4900",
            website: "www.torelavantgarde.com",
            checkInTime: "15:00",
            checkOutTime: "11:00",
            pricePerNight: "€200-€400",
            amenities: ["Pool", "Restaurant", "Bar", "Spa", "Gym", "Art Gallery", "WiFi", "Parking"],
            roomTypes: ["Superior Room", "Deluxe Room", "Junior Suite", "Art Suite"],
            images: ["/hotels/torel-avantgarde.jpg"],
            tags: ["Design", "Art", "Modern", "Pool"],
            cancellationPolicy: "Free cancellation up to 48 hours before arrival",
            features: ["Contemporary Design", "Art Collection", "Rooftop Pool", "Cultural District"]
        },
        {
            id: "hotel-6",
            name: "NH Collection Porto Batalha",
            type: "Business Hotel",
            description: "Modern business hotel with comfortable accommodations and excellent facilities in Porto's commercial center.",
            latitude: 41.1501,
            longitude: -8.6143,
            priceRange: "€€",
            rating: 4.3,
            reviewCount: 2341,
            address: "Praça da Batalha 116, 4000-101 Porto",
            phone: "+351 22 330 4400",
            website: "www.nh-hotels.com",
            checkInTime: "15:00",
            checkOutTime: "12:00",
            pricePerNight: "€100-€180",
            amenities: ["Restaurant", "Bar", "Gym", "Business Center", "Meeting Rooms", "WiFi", "Parking"],
            roomTypes: ["Standard Room", "Superior Room", "Premium Room", "Suite"],
            images: ["/hotels/nh-batalha.jpg"],
            tags: ["Business", "Central", "Modern", "Value"],
            cancellationPolicy: "Free cancellation up to 24 hours before arrival",
            features: ["Business Facilities", "Central Location", "Modern Amenities", "Good Value"]
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
            // Simulate API call for hotel recommendations
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setChatHistory(prev => [...prev, {
                type: 'assistant',
                content: "I'd be happy to help you find the perfect hotel! I can help you with recommendations based on your budget, preferred amenities, location preferences, or special requirements. What type of accommodation are you looking for?",
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
        types: [
            { id: 'luxury', label: 'Luxury Hotel', icon: Building2 },
            { id: 'boutique', label: 'Boutique Hotel', icon: Heart },
            { id: 'historic', label: 'Historic Hotel', icon: Building2 },
            { id: 'business', label: 'Business Hotel', icon: Coffee },
            { id: 'design', label: 'Design Hotel', icon: Camera }
        ],
        priceRange: ['€', '€€', '€€€', '€€€€'],
        amenities: ['Spa', 'Pool', 'Restaurant', 'Gym', 'WiFi', 'Parking', 'Pet Friendly', 'Business Center']
    };

    const getHotelIcon = (type: any) => {
        const iconMap = {
            'Luxury Hotel': Building2,
            'Historic Hotel': Building2,
            'Boutique Hotel': Heart,
            'Business Hotel': Coffee,
            'Design Hotel': Camera
        };
        return iconMap[type] || Building2;
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

    const filteredHotels = () => {
        return hotels().filter(hotel => {
            const filters = activeFilters();
            // Type filter
            if (filters.types.length > 0 && !filters.types.some(type => hotel.tags.includes(type))) return false;
            // Price range filter
            if (filters.priceRange.length > 0 && !filters.priceRange.includes(hotel.priceRange)) return false;
            // Amenities filter
            if (filters.amenities.length > 0 && !filters.amenities.some(amenity => hotel.amenities.includes(amenity))) return false;
            // Rating filter
            if (filters.rating > 0 && hotel.rating < filters.rating) return false;
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

    const addToBookmarks = (hotel) => {
        setMyBookmarks(prev => prev.some(item => item.id === hotel.id) ? prev : [...prev, hotel]);
    };

    const renderHotelCard = (hotel) => {
        const IconComponent = getHotelIcon(hotel.type);
        return (
            <div
                class={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${selectedHotel()?.id === hotel.id ? 'ring-2 ring-blue-500 shadow-md' : 'border-gray-200'}`}
                onClick={() => setSelectedHotel(hotel)}
            >
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <IconComponent class="w-5 h-5 text-white" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-2">
                            <div>
                                <h3 class="font-semibold text-gray-900 text-sm">{hotel.name}</h3>
                                <p class="text-xs text-gray-500">{hotel.type}</p>
                            </div>
                            <div class="flex items-center gap-1 text-xs">
                                <Star class="w-3 h-3 text-yellow-500 fill-current" />
                                <span class="text-gray-600">{hotel.rating}</span>
                                <span class="text-gray-400">({hotel.reviewCount})</span>
                            </div>
                        </div>
                        <p class="text-xs text-gray-600 mb-3 line-clamp-2">{hotel.description}</p>
                        <div class="flex items-center justify-between text-xs">
                            <div class="flex items-center gap-3">
                                <div class={`font-medium ${getPriceColor(hotel.priceRange)}`}>
                                    {hotel.priceRange}
                                </div>
                                <div class="text-gray-500">
                                    {hotel.pricePerNight}
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-1">
                                {hotel.amenities.slice(0, 2).map(amenity => (
                                    <span class="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">
                                        {amenity}
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
                        <h4 class="font-semibold text-gray-900 mb-2 text-sm">Hotel Type</h4>
                        <div class="space-y-1">
                            <For each={filterOptions.types}>
                                {(type) => {
                                    const IconComponent = type.icon;
                                    return (
                                        <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                            <input
                                                type="checkbox"
                                                class="rounded border-gray-300"
                                                checked={activeFilters().types.includes(type.label)}
                                                onChange={() => toggleFilter('types', type.label)}
                                            />
                                            <IconComponent class="w-4 h-4 text-gray-500" />
                                            <span class="text-gray-700">{type.label}</span>
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
                        <h4 class="font-semibold text-gray-900 mb-2 text-sm">Amenities</h4>
                        <div class="space-y-1">
                            <For each={filterOptions.amenities}>
                                {(amenity) => (
                                    <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300"
                                            checked={activeFilters().amenities.includes(amenity)}
                                            onChange={() => toggleFilter('amenities', amenity)}
                                        />
                                        <span class="text-gray-700">{amenity}</span>
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
                <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
                    <div class="flex items-center gap-2">
                        <MessageCircle class="w-5 h-5" />
                        <span class="font-medium">Hotel Assistant</span>
                    </div>
                    <button
                        onClick={() => setShowChat(false)}
                        class="p-1 hover:bg-blue-700 rounded"
                    >
                        <X class="w-4 h-4" />
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto p-4 space-y-4">
                    <Show when={chatHistory().length === 0}>
                        <div class="text-center text-gray-500 py-8">
                            <Bed class="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p class="text-sm">Ask me to help find your perfect hotel!</p>
                            <p class="text-xs mt-2 text-gray-400">
                                Try: "Find luxury hotels with spa" or "Budget hotels near the center"
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
                                    <p class={`text-xs mt-1 opacity-70 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
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
                                <span>Finding perfect hotels...</span>
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
                            placeholder="Ask for hotel recommendations..."
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
            {/* Header - Mobile First */}
            <div class="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
                <div class="max-w-7xl mx-auto">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 class="text-xl font-bold text-gray-900 sm:text-2xl">Hotels in {searchParams().location}</h1>
                            <p class="text-sm text-gray-600 mt-1 sm:text-base">
                                {searchParams().checkIn} - {searchParams().checkOut} • {searchParams().guests} guests • {searchParams().rooms} room
                            </p>
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
                                    class="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm text-sm font-medium"
                                >
                                    <MessageCircle class="w-4 h-4" />
                                    Get Help
                                </button>

                                <div class="flex gap-2">
                                    <button class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:flex-initial">
                                        <Heart class="w-4 h-4" />
                                        <span class="hidden sm:inline">Saved</span>
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
                                class={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${showFilters() ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <Filter class="w-4 h-4" />
                                Filters
                            </button>
                            <div class="text-sm text-gray-600">
                                {filteredHotels().length} hotels available
                            </div>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600">
                            <Users class="w-4 h-4" />
                            <span class="hidden sm:inline">{searchParams().guests} guests, {searchParams().rooms} room</span>
                            <span class="sm:hidden">{searchParams().guests}G, {searchParams().rooms}R</span>
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
                                pointsOfInterest={filteredHotels()}
                            />
                        </div>
                    </Show>

                    <Show when={viewMode() === 'list' || viewMode() === 'split'}>
                        <div class={viewMode() === 'list' ? 'col-span-full' : ''}>
                            <div class="space-y-4">
                                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <h2 class="text-lg font-semibold text-gray-900">Available Hotels</h2>
                                    <p class="text-sm text-gray-600 self-start sm:self-auto">
                                        {filteredHotels().length} of {hotels().length} hotels
                                    </p>
                                </div>
                                <div class="grid gap-3">
                                    <For each={filteredHotels()}>
                                        {(hotel) => renderHotelCard(hotel)}
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
                    class="fixed bottom-4 right-4 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center justify-center z-40 sm:bottom-6 sm:right-6 sm:w-14 sm:h-14"
                >
                    <Bed class="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </Show>

            {/* Selected Hotel Details Modal */}
            <Show when={selectedHotel()}>
                <div class="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
                    <div class="bg-white rounded-t-lg sm:rounded-lg max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
                        <div class="p-4 sm:p-6">
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-lg font-bold text-gray-900 sm:text-xl pr-2">{selectedHotel().name}</h3>
                                    <p class="text-gray-600 text-sm sm:text-base">{selectedHotel().type}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedHotel(null)}
                                    class="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                                >
                                    <X class="w-5 h-5" />
                                </button>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 text-sm">
                                <div class="flex items-center gap-2">
                                    <Star class="w-4 h-4 text-yellow-500 fill-current" />
                                    <span>{selectedHotel().rating}/5 ({selectedHotel().reviewCount} reviews)</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <DollarSign class="w-4 h-4 text-gray-500" />
                                    <span class={getPriceColor(selectedHotel().priceRange)}>{selectedHotel().pricePerNight} per night</span>
                                </div>
                                <div class="flex items-center gap-2 col-span-1 sm:col-span-2">
                                    <MapPin class="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <span class="text-xs sm:text-sm">{selectedHotel().address}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Clock class="w-4 h-4 text-gray-500" />
                                    <span>Check-in: {selectedHotel().checkInTime}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Clock class="w-4 h-4 text-gray-500" />
                                    <span>Check-out: {selectedHotel().checkOutTime}</span>
                                </div>
                            </div>

                            <p class="text-gray-700 mb-4 text-sm sm:text-base">{selectedHotel().description}</p>

                            <div class="mb-4">
                                <h4 class="font-semibold text-gray-900 mb-2">Room Types</h4>
                                <div class="flex flex-wrap gap-2">
                                    <For each={selectedHotel().roomTypes}>
                                        {(roomType) => (
                                            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                                {roomType}
                                            </span>
                                        )}
                                    </For>
                                </div>
                            </div>

                            <div class="mb-4">
                                <h4 class="font-semibold text-gray-900 mb-2">Amenities</h4>
                                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    <For each={selectedHotel().amenities}>
                                        {(amenity) => (
                                            <div class="flex items-center gap-2 text-sm text-gray-700">
                                                <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                {amenity}
                                            </div>
                                        )}
                                    </For>
                                </div>
                            </div>

                            <div class="mb-4">
                                <h4 class="font-semibold text-gray-900 mb-2">Features</h4>
                                <div class="flex flex-wrap gap-2">
                                    <For each={selectedHotel().features}>
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
                                        <p><strong>Phone:</strong> {selectedHotel().phone}</p>
                                        <p><strong>Cancellation:</strong> {selectedHotel().cancellationPolicy}</p>
                                    </div>
                                    <div class="flex flex-col gap-2 sm:flex-row">
                                        <button
                                            onClick={() => addToBookmarks(selectedHotel())}
                                            class={`px-4 py-2 rounded-lg text-sm font-medium ${myBookmarks().some(item => item.id === selectedHotel().id) ? 'bg-red-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                        >
                                            {myBookmarks().some(item => item.id === selectedHotel().id) ? 'Saved' : 'Save Hotel'}
                                        </button>
                                        <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                                            Book Now
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