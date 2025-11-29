import { createSignal, For, Show, createEffect } from 'solid-js';
import { useParams } from '@solidjs/router';
import { Star, MapPin, Clock, Phone, Mail, Globe, Heart, Share2, DollarSign, Users, Utensils, Wine, Car, ArrowLeft } from 'lucide-solid';
import { A } from '@solidjs/router';
import { useRestaurantDetails } from '~/lib/api/restaurants';

export default function RestaurantDetailPage() {
    const params = useParams();
    const [selectedTab, setSelectedTab] = createSignal('overview');
    const [isFavorite, setIsFavorite] = createSignal(false);

    // Use API hook to fetch restaurant details
    const restaurantQuery = useRestaurantDetails(params.id);
    
    const restaurant = () => restaurantQuery.data;

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'menu', label: 'Menu' },
        { id: 'hours', label: 'Hours & Contact' },
        { id: 'location', label: 'Location' },
        { id: 'reviews', label: 'Reviews' }
    ];

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite());
    };

    const getPriceColor = (price: string) => {
        const colorMap = {
            '€': 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900',
            '€€': 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900',
            '€€€': 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900'
        };
        return colorMap[price] || 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
    };

    const renderOverview = () => (
        <div class="space-y-6">
            {/* Description */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">About this restaurant</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{restaurant()?.description}</p>
            </div>

            {/* Key Information */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Restaurant Details</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex items-center gap-3">
                        <Utensils class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <div class="font-medium text-gray-900 dark:text-white">Cuisine</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">{restaurant()?.cuisine}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <DollarSign class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <div class="font-medium text-gray-900 dark:text-white">Average Price</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">{restaurant()?.averagePrice}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <Clock class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <div class="font-medium text-gray-900 dark:text-white">Status</div>
                            <div class={`text-sm font-medium ${restaurant()?.isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {restaurant()?.isOpen ? 'Open Now' : 'Closed'}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <Users class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <div class="font-medium text-gray-900 dark:text-white">Reservations</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">
                                {restaurant()?.reservationRequired ? 'Recommended' : 'Not Required'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Specialties */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Specialties</h3>
                <div class="flex flex-wrap gap-2">
                    <For each={restaurant()?.specialties}>
                        {(specialty) => (
                            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                                {specialty}
                            </span>
                        )}
                    </For>
                </div>
            </div>

            {/* Features */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Features & Amenities</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <For each={restaurant()?.features}>
                        {(feature) => {
                            const IconComponent = feature.icon;
                            return (
                                <div class={`flex items-center gap-3 p-3 rounded-lg ${
                                    feature.available 
                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                                        : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                }`}>
                                    <IconComponent class="w-5 h-5" />
                                    <span class="font-medium">{feature.name}</span>
                                    <Show when={!feature.available}>
                                        <span class="text-xs">(Not Available)</span>
                                    </Show>
                                </div>
                            );
                        }}
                    </For>
                </div>
            </div>
        </div>
    );

    const renderMenu = () => (
        <div class="space-y-6">
            {/* Starters */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Starters</h3>
                <div class="space-y-4">
                    <For each={restaurant()?.menu?.starters}>
                        {(item) => (
                            <div class="flex justify-between items-start pb-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                <div class="flex-1">
                                    <h4 class="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                                </div>
                                <span class="font-semibold text-blue-600 dark:text-blue-400 ml-4">{item.price}</span>
                            </div>
                        )}
                    </For>
                </div>
            </div>

            {/* Main Courses */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Main Courses</h3>
                <div class="space-y-4">
                    <For each={restaurant()?.menu?.mains}>
                        {(item) => (
                            <div class="flex justify-between items-start pb-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                <div class="flex-1">
                                    <h4 class="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                                </div>
                                <span class="font-semibold text-blue-600 dark:text-blue-400 ml-4">{item.price}</span>
                            </div>
                        )}
                    </For>
                </div>
            </div>

            {/* Desserts */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Desserts</h3>
                <div class="space-y-4">
                    <For each={restaurant()?.menu?.desserts}>
                        {(item) => (
                            <div class="flex justify-between items-start pb-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                <div class="flex-1">
                                    <h4 class="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                                </div>
                                <span class="font-semibold text-blue-600 dark:text-blue-400 ml-4">{item.price}</span>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </div>
    );

    const renderHours = () => (
        <div class="space-y-6">
            {/* Opening Hours */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Opening Hours</h3>
                <div class="space-y-2">
                    <For each={Object.entries(restaurant()?.hours || {})}>
                        {([day, hours]) => (
                            <div class="flex justify-between items-center py-2">
                                <span class="font-medium text-gray-900 dark:text-white">{day}</span>
                                <span class={`text-sm ${hours === 'Closed' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {hours}
                                </span>
                            </div>
                        )}
                    </For>
                </div>
            </div>

            {/* Contact Information */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <Phone class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span class="text-gray-900 dark:text-white">{restaurant()?.contact?.phone}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <Mail class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span class="text-gray-900 dark:text-white">{restaurant()?.contact?.email}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <Globe class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span class="text-gray-900 dark:text-white">{restaurant()?.contact?.website}</span>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h3>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-gray-600 dark:text-gray-400">Accepts Cards</span>
                        <span class="font-medium text-gray-900 dark:text-white">
                            {restaurant()?.acceptsCards ? 'Yes' : 'No'}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600 dark:text-gray-400">Languages</span>
                        <span class="font-medium text-gray-900 dark:text-white">
                            {restaurant()?.languages?.join(', ')}
                        </span>
                    </div>
                </div>
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
                <p class="text-gray-600 dark:text-gray-400">{restaurant()?.address}</p>
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
            <Show when={restaurant()}>
                {/* Header */}
                <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {/* Back button */}
                        <div class="mb-4">
                            <A href="/restaurants" class="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                                <ArrowLeft class="w-4 h-4" />
                                Back to Restaurants
                            </A>
                        </div>

                        <div class="flex flex-col lg:flex-row gap-6">
                            {/* Restaurant Images */}
                            <div class="lg:w-1/2">
                                <div class="aspect-video bg-white/70 dark:bg-slate-900/60 border border-white/60 dark:border-slate-800/70 rounded-lg flex items-center justify-center">
                                    🍽️
                                </div>
                                <div class="grid grid-cols-3 gap-2 mt-2">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div class="aspect-video bg-white/70 dark:bg-slate-900/60 border border-white/60 dark:border-slate-800/70 rounded"></div>
                                    ))}
                                </div>
                            </div>

                            {/* Restaurant Info */}
                            <div class="lg:w-1/2">
                                <div class="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{restaurant()?.name}</h1>
                                        <p class="text-gray-600 dark:text-gray-400 mt-1">{restaurant()?.cuisine} Cuisine</p>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button
                                            onClick={toggleFavorite}
                                            class={`p-2 rounded-lg ${
                                                isFavorite() 
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
                                            <span class="font-semibold text-gray-900 dark:text-white">{restaurant()?.rating}</span>
                                        </div>
                                        <span class="text-gray-600 dark:text-gray-400">({restaurant()?.reviewCount} reviews)</span>
                                    </div>
                                    <span class={`px-3 py-1 rounded-full text-sm font-medium ${getPriceColor(restaurant()?.priceRange)}`}>
                                        {restaurant()?.priceRange}
                                    </span>
                                    <Show when={restaurant()?.isOpen}>
                                        <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                                            Open Now
                                        </span>
                                    </Show>
                                </div>

                                {/* Address */}
                                <div class="flex items-center gap-2 mb-6">
                                    <MapPin class="w-5 h-5 text-gray-400" />
                                    <span class="text-gray-600 dark:text-gray-400">{restaurant()?.address}</span>
                                </div>

                                {/* Description */}
                                <p class="text-gray-700 dark:text-gray-300 mb-6">{restaurant()?.description}</p>

                                {/* CTA Buttons */}
                                <div class="flex gap-3">
                                    <button class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                        Make Reservation
                                    </button>
                                    <button class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                                        Call Restaurant
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
                                        class={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                                            selectedTab() === tab.id
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
                    <Show when={selectedTab() === 'menu'}>{renderMenu()}</Show>
                    <Show when={selectedTab() === 'hours'}>{renderHours()}</Show>
                    <Show when={selectedTab() === 'location'}>{renderLocation()}</Show>
                    <Show when={selectedTab() === 'reviews'}>{renderReviews()}</Show>
                </div>
            </Show>
        </div>
    );
}
