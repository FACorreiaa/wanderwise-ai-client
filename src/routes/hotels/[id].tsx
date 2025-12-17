import { createSignal, For, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import { Star, MapPin, Phone, Mail, Globe, Heart, Share2, Calendar, ArrowLeft } from 'lucide-solid';
import { A } from '@solidjs/router';
import { useHotelDetails } from '~/lib/api/hotels';

export default function HotelDetailPage() {
    const params = useParams();
    const [selectedTab, setSelectedTab] = createSignal('overview');
    const [isFavorite, setIsFavorite] = createSignal(false);

    // Use API hook to fetch hotel details
    const hotelQuery = useHotelDetails(params.id ?? '');

    const hotel = () => hotelQuery.data;

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'rooms', label: 'Rooms' },
        { id: 'amenities', label: 'Amenities' },
        { id: 'location', label: 'Location' },
        { id: 'reviews', label: 'Reviews' }
    ];

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite());
    };

    const renderOverview = () => (
        <div class="space-y-6">
            {/* Description */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">About this hotel</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{hotel()?.description}</p>
            </div>

            {/* Key Information */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex items-center gap-3">
                        <Calendar class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <div class="font-medium text-gray-900 dark:text-white">Check-in</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">{hotel()?.checkIn}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <Calendar class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <div class="font-medium text-gray-900 dark:text-white">Check-out</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">{hotel()?.checkOut}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nearby Attractions */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nearby Attractions</h3>
                <div class="space-y-3">
                    <For each={hotel()?.nearbyAttractions}>
                        {(attraction) => (
                            <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                <div class="flex items-center gap-3">
                                    <MapPin class="w-4 h-4 text-gray-400" />
                                    <div>
                                        <div class="font-medium text-gray-900 dark:text-white">{attraction.name}</div>
                                        <div class="text-sm text-gray-600 dark:text-gray-400">{attraction.type}</div>
                                    </div>
                                </div>
                                <span class="text-sm text-blue-600 dark:text-blue-400 font-medium">{attraction.distance}</span>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </div>
    );

    const renderRooms = () => (
        <div class="space-y-4">
            <For each={hotel()?.rooms}>
                {(room) => (
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div class="flex flex-col lg:flex-row gap-6">
                            <div class="lg:w-1/3">
                                <div class="aspect-video bg-white/70 dark:bg-slate-900/60 border border-white/60 dark:border-slate-800/70 rounded-lg flex items-center justify-center">
                                    🏨
                                </div>
                            </div>
                            <div class="lg:w-2/3">
                                <div class="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{room.type}</h3>
                                        <p class="text-gray-600 dark:text-gray-400 mt-1">{room.description}</p>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{room.price}</div>
                                        <div class="text-sm text-gray-600 dark:text-gray-400">per night</div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div>
                                        <span class="font-medium text-gray-900 dark:text-white">Size:</span>
                                        <span class="text-gray-600 dark:text-gray-400 ml-1">{room.size}</span>
                                    </div>
                                    <div>
                                        <span class="font-medium text-gray-900 dark:text-white">Capacity:</span>
                                        <span class="text-gray-600 dark:text-gray-400 ml-1">{room.capacity}</span>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <h4 class="font-medium text-gray-900 dark:text-white mb-2">Room Amenities</h4>
                                    <div class="flex flex-wrap gap-2">
                                        <For each={room.amenities}>
                                            {(amenity) => (
                                                <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                                                    {amenity}
                                                </span>
                                            )}
                                        </For>
                                    </div>
                                </div>

                                <button class="w-full lg:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </For>
        </div>
    );

    const renderAmenities = () => (
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hotel Amenities</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <For each={hotel()?.amenities}>
                    {(amenity) => (
                        <div class="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                            <span class="font-medium">{amenity}</span>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );

    const renderLocation = () => (
        <div class="space-y-6">
            {/* Map placeholder */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location</h3>
                <div class="aspect-video bg-white/70 dark:bg-slate-900/60 border border-white/60 dark:border-slate-800/70 rounded-lg flex items-center justify-center mb-4">
                    <MapPin class="w-12 h-12 text-gray-400" />
                </div>
                <p class="text-gray-600 dark:text-gray-400">{hotel()?.address}</p>
            </div>

            {/* Contact Information */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <Phone class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span class="text-gray-900 dark:text-white">{hotel()?.contact?.phone}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <Mail class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span class="text-gray-900 dark:text-white">{hotel()?.contact?.email}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <Globe class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span class="text-gray-900 dark:text-white">{hotel()?.contact?.website}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderReviews = () => (
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reviews</h3>
            <p class="text-gray-600 dark:text-gray-400">Reviews will be displayed here.</p>
        </div>
    );

    return (
        <div class="min-h-screen relative transition-colors">
            <Show when={hotel()}>
                {/* Header */}
                <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {/* Back button */}
                        <div class="mb-4">
                            <A href="/hotels" class="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                                <ArrowLeft class="w-4 h-4" />
                                Back to Hotels
                            </A>
                        </div>

                        <div class="flex flex-col lg:flex-row gap-6">
                            {/* Hotel Images */}
                            <div class="lg:w-1/2">
                                <div class="aspect-video bg-white/70 dark:bg-slate-900/60 border border-white/60 dark:border-slate-800/70 rounded-lg flex items-center justify-center">
                                    🏨
                                </div>
                                <div class="grid grid-cols-3 gap-2 mt-2">
                                    <For each={Array.from({ length: 3 })}>
                                        {() => (
                                            <div class="aspect-video bg-white/70 dark:bg-slate-900/60 border border-white/60 dark:border-slate-800/70 rounded" />
                                        )}
                                    </For>
                                </div>
                            </div>

                            {/* Hotel Info */}
                            <div class="lg:w-1/2">
                                <div class="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{hotel()?.name}</h1>
                                        <p class="text-gray-600 dark:text-gray-400 mt-1">{(hotel() as any)?.category}</p>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button
                                            onClick={toggleFavorite}
                                            class={`p-2 rounded-lg ${isFavorite()
                                                ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                } hover:scale-110 transition-transform`}
                                        >
                                            <Heart class={`w-5 h-5 ${isFavorite() ? 'fill-current' : ''}`} />
                                        </button>
                                        <button class="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:scale-110 transition-transform">
                                            <Share2 class="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Rating and Price */}
                                <div class="flex items-center gap-4 mb-4">
                                    <div class="flex items-center gap-2">
                                        <div class="flex items-center gap-1">
                                            <Star class="w-5 h-5 text-yellow-500 fill-current" />
                                            <span class="font-semibold text-gray-900 dark:text-white">{hotel()?.rating}</span>
                                        </div>
                                        <span class="text-gray-600 dark:text-gray-400">({hotel()?.reviewCount} reviews)</span>
                                    </div>
                                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {hotel()?.pricePerNight}
                                    </div>
                                </div>

                                {/* Address */}
                                <div class="flex items-center gap-2 mb-6">
                                    <MapPin class="w-5 h-5 text-gray-400" />
                                    <span class="text-gray-600 dark:text-gray-400">{hotel()?.address}</span>
                                </div>

                                {/* Quick Amenities */}
                                <div class="mb-6">
                                    <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Popular Amenities</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <For each={hotel()?.amenities?.slice(0, 4)}>
                                            {(amenity) => (
                                                <div class="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                                                    {amenity}
                                                </div>
                                            )}
                                        </For>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div class="flex gap-3">
                                    <button class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                        Book Now
                                    </button>
                                    <button class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                                        Contact Hotel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex space-x-8 overflow-x-auto">
                            <For each={tabs}>
                                {(tab) => (
                                    <button
                                        onClick={() => setSelectedTab(tab.id)}
                                        class={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${selectedTab() === tab.id
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                )}
                            </For>
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Show when={selectedTab() === 'overview'}>{renderOverview()}</Show>
                    <Show when={selectedTab() === 'rooms'}>{renderRooms()}</Show>
                    <Show when={selectedTab() === 'amenities'}>{renderAmenities()}</Show>
                    <Show when={selectedTab() === 'location'}>{renderLocation()}</Show>
                    <Show when={selectedTab() === 'reviews'}>{renderReviews()}</Show>
                </div>
            </Show>
        </div>
    );
}
