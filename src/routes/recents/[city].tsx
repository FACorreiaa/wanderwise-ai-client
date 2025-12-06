import { createSignal, For, Show, createMemo } from 'solid-js';
import { useParams, A, useNavigate } from '@solidjs/router';
import { ArrowLeft, MapPin, Clock, Star, MessageCircle, Calendar, TrendingUp, Building, Coffee, Camera, ChevronRight, Eye, Share2, Bookmark, Download } from 'lucide-solid';
import { useCityDetails } from '~/lib/api/recents';
import type { RecentInteraction, POIDetailedInfo, HotelDetailedInfo, RestaurantDetailedInfo } from '~/lib/api/types';

export default function CityDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = createSignal('overview'); // 'overview', 'interactions', 'places', 'favorites', 'itineraries'
  
  const cityDetailsQuery = useCityDetails(decodeURIComponent(params.city || ''));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    
    return date.toLocaleDateString();
  };

  const formatDetailedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Aggregate all POIs, hotels, and restaurants from interactions
  const allPlaces = createMemo(() => {
    if (!cityDetailsQuery.data?.interactions) return { pois: [], hotels: [], restaurants: [] };

    const pois: POIDetailedInfo[] = [];
    const hotels: HotelDetailedInfo[] = [];
    const restaurants: RestaurantDetailedInfo[] = [];

    cityDetailsQuery.data?.interactions?.forEach(interaction => {
      pois.push(...(interaction.pois || []));
      hotels.push(...(interaction.hotels || []));
      restaurants.push(...(interaction.restaurants || []));
    });

    // Remove duplicates based on name
    const uniquePOIs = pois.filter((poi, index, self) => 
      index === self.findIndex(p => p.name === poi.name)
    );
    const uniqueHotels = hotels.filter((hotel, index, self) => 
      index === self.findIndex(h => h.name === hotel.name)
    );
    const uniqueRestaurants = restaurants.filter((restaurant, index, self) => 
      index === self.findIndex(r => r.name === restaurant.name)
    );

    return { 
      pois: uniquePOIs, 
      hotels: uniqueHotels, 
      restaurants: uniqueRestaurants 
    };
  });

  const getCategoryIcon = (category: string) => {
    const iconMap = {
      'restaurant': '🍽️',
      'hotel': '🏨',
      'museum': '🏛️',
      'park': '🌳',
      'landmark': '🗽',
      'historical': '🏛️',
      'entertainment': '🎭',
      'cultural': '🎨',
      'beach': '🏖️',
      'accommodation': '🏨'
    };
    return iconMap[category.toLowerCase()] || '📍';
  };

  const getCategoryColor = (category: string) => {
    const categoryColorMap = {
      'restaurant': 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900',
      'hotel': 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900',
      'museum': 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-900',
      'park': 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900',
      'landmark': 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900',
      'historical': 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900',
      'entertainment': 'text-pink-700 bg-pink-100 dark:text-pink-300 dark:bg-pink-900',
      'cultural': 'text-indigo-700 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900',
      'beach': 'text-cyan-700 bg-cyan-100 dark:text-cyan-300 dark:bg-cyan-900',
      'accommodation': 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900'
    };
    return categoryColorMap[category.toLowerCase()] || 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700';
  };

  const getPriceColor = (price: string) => {
    const colorMap = {
      'Free': 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900',
      '€': 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900',
      '€€': 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900',
      '€€€': 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900',
      '€€€€': 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900'
    };
    return colorMap[price] || 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
  };

  const renderPlaceCard = (place: POIDetailedInfo | HotelDetailedInfo | RestaurantDetailedInfo, type: 'poi' | 'hotel' | 'restaurant') => (
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
      <div class="flex gap-3">
        {/* Icon */}
        <div class="w-12 h-12 bg-white/70 dark:bg-slate-900/60 border border-white/60 dark:border-slate-800/70 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
          {getCategoryIcon(place.category)}
        </div>

        {/* Content */}
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white text-base mb-1">{place.name}</h3>
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <span class={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(place.category)}`}>
                  {place.category}
                </span>
                <Show when={place.price_level}>
                  <span class={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriceColor(place.price_level)}`}>
                    {place.price_level}
                  </span>
                </Show>
              </div>
            </div>
            <div class="flex items-center gap-1 text-sm">
              <Star class="w-4 h-4 text-yellow-500 fill-current" />
              <span class="text-gray-600 dark:text-gray-400">{place.rating}</span>
            </div>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{place.description}</p>

          <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <Show when={place.address}>
              <div class="flex items-center gap-1">
                <MapPin class="w-3 h-3" />
                <span class="truncate">{place.address}</span>
              </div>
            </Show>
          </div>

          {/* Tags */}
          <Show when={place.tags && place.tags.length > 0}>
            <div class="flex flex-wrap gap-1 mt-2">
              <For each={place.tags.slice(0, 3)}>{tag => (
                <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                  {tag}
                </span>
              )}</For>
              {place.tags.length > 3 && (
                <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                  +{place.tags.length - 3}
                </span>
              )}
            </div>
          </Show>
        </div>
      </div>
    </div>
  );

  const renderInteractionCard = (interaction: RecentInteraction) => (
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
          <MessageCircle class="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-900 dark:text-white text-sm mb-1">Chat Interaction</h3>
              <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                <Clock class="w-3 h-3" />
                <span>{formatDate(interaction.created_at)}</span>
                <span>•</span>
                <span>{interaction.model_used}</span>
                <Show when={interaction.latency_ms}>
                  <span>•</span>
                  <span>{interaction.latency_ms}ms</span>
                </Show>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <p class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Your Question:</p>
              <p class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                {interaction.prompt}
              </p>
            </div>

            <Show when={interaction.response_text}>
              <div>
                <p class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">AI Response:</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {interaction.response_text}
                </p>
              </div>
            </Show>

            {/* Results Summary */}
            <div class="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
              <Show when={interaction.pois && interaction.pois.length > 0}>
                <div class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <MapPin class="w-3 h-3" />
                  <span>{interaction.pois.length} places</span>
                </div>
              </Show>
              <Show when={interaction.hotels && interaction.hotels.length > 0}>
                <div class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <Building class="w-3 h-3" />
                  <span>{interaction.hotels.length} hotels</span>
                </div>
              </Show>
              <Show when={interaction.restaurants && interaction.restaurants.length > 0}>
                <div class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <Coffee class="w-3 h-3" />
                  <span>{interaction.restaurants.length} restaurants</span>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center gap-4">
            <button
              onClick={() => navigate('/recents')}
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Back to recent activity"
            >
              <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <div class="flex-1 min-w-0">
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {decodeURIComponent(params.city || '')}
              </h1>
              <Show when={cityDetailsQuery.data}>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {cityDetailsQuery.data?.interactions?.length || 0} interaction{(cityDetailsQuery.data?.interactions?.length || 0) !== 1 ? 's' : ''} • 
                  {cityDetailsQuery.data?.poi_count || 0} places discovered
                </p>
              </Show>
            </div>

            <div class="flex items-center gap-2">
              <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Share2 class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Bookmark class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              class={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab() === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('interactions')}
              class={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab() === 'interactions'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Interactions ({cityDetailsQuery.data?.interactions.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('places')}
              class={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab() === 'places'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Places ({allPlaces().pois.length + allPlaces().hotels.length + allPlaces().restaurants.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              class={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab() === 'favorites'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Favorites ({cityDetailsQuery.data?.favorite_pois?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('itineraries')}
              class={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab() === 'itineraries'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Saved Itineraries ({cityDetailsQuery.data?.saved_itineraries?.length || 0})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Show when={cityDetailsQuery.isLoading}>
          <div class="flex items-center justify-center py-12">
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span class="text-gray-600 dark:text-gray-400">Loading city details...</span>
            </div>
          </div>
        </Show>

        <Show when={cityDetailsQuery.isError}>
          <div class="text-center py-12">
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unable to load city details</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">Please try again later</p>
            <button 
              onClick={() => cityDetailsQuery.refetch()}
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </Show>

        <Show when={cityDetailsQuery.isSuccess && cityDetailsQuery.data}>
          {/* Overview Tab */}
          <Show when={activeTab() === 'overview'}>
            <div class="space-y-6">
              {/* Stats Cards */}
              <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <MessageCircle class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-gray-900 dark:text-white">{cityDetailsQuery.data?.interactions?.length || 0}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Interactions</p>
                    </div>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <MapPin class="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-gray-900 dark:text-white">{allPlaces().pois.length}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Attractions</p>
                    </div>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <Coffee class="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-gray-900 dark:text-white">{allPlaces().restaurants.length}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Restaurants</p>
                    </div>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Building class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-gray-900 dark:text-white">{allPlaces().hotels.length}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Hotels</p>
                    </div>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                      <Star class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-gray-900 dark:text-white">{cityDetailsQuery.data?.total_favorites || 0}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
                    </div>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                      <Bookmark class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-gray-900 dark:text-white">{cityDetailsQuery.data?.total_itineraries || 0}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Saved</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                <div class="space-y-4">
                  <For each={cityDetailsQuery.data?.interactions?.slice(0, 3) || []}>
                    {(interaction) => (
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <div class="flex-1 min-w-0">
                          <p class="text-sm text-gray-900 dark:text-white font-medium">
                            {interaction.prompt.slice(0, 80)}{interaction.prompt.length > 80 ? '...' : ''}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {formatDate(interaction.created_at)}
                          </p>
                        </div>
                      </div>
                    )}
                  </For>
                  <Show when={(cityDetailsQuery.data?.interactions?.length || 0) > 3}>
                    <button
                      onClick={() => setActiveTab('interactions')}
                      class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      View all {cityDetailsQuery.data?.interactions?.length || 0} interactions →
                    </button>
                  </Show>
                </div>
              </div>
            </div>
          </Show>

          {/* Interactions Tab */}
          <Show when={activeTab() === 'interactions'}>
            <div class="space-y-4">
              <For each={cityDetailsQuery.data?.interactions || []}>
                {(interaction) => renderInteractionCard(interaction)}
              </For>
            </div>
          </Show>

          {/* Places Tab */}
          <Show when={activeTab() === 'places'}>
            <div class="space-y-6">
              <Show when={allPlaces().pois.length > 0}>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attractions & Activities</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <For each={allPlaces().pois}>
                      {(poi) => renderPlaceCard(poi, 'poi')}
                    </For>
                  </div>
                </div>
              </Show>

              <Show when={allPlaces().restaurants.length > 0}>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Restaurants</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <For each={allPlaces().restaurants}>
                      {(restaurant) => renderPlaceCard(restaurant, 'restaurant')}
                    </For>
                  </div>
                </div>
              </Show>

              <Show when={allPlaces().hotels.length > 0}>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hotels</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <For each={allPlaces().hotels}>
                      {(hotel) => renderPlaceCard(hotel, 'hotel')}
                    </For>
                  </div>
                </div>
              </Show>

              <Show when={allPlaces().pois.length === 0 && allPlaces().restaurants.length === 0 && allPlaces().hotels.length === 0}>
                <div class="text-center py-12">
                  <MapPin class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No places found</h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    No places were discovered in your interactions for this city.
                  </p>
                </div>
              </Show>
            </div>
          </Show>

          {/* Favorites Tab */}
          <Show when={activeTab() === 'favorites'}>
            <div class="space-y-6">
              <Show when={cityDetailsQuery.data?.favorite_pois && cityDetailsQuery.data.favorite_pois.length > 0}>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Favorites in {decodeURIComponent(params.city || '')}</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <For each={cityDetailsQuery.data?.favorite_pois || []}>
                      {(poi) => renderPlaceCard(poi, 'poi')}
                    </For>
                  </div>
                </div>
              </Show>

              <Show when={!cityDetailsQuery.data?.favorite_pois || cityDetailsQuery.data.favorite_pois.length === 0}>
                <div class="text-center py-12">
                  <Star class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No favorites yet</h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Places you mark as favorites will appear here.
                  </p>
                </div>
              </Show>
            </div>
          </Show>

          {/* Saved Itineraries Tab */}
          <Show when={activeTab() === 'itineraries'}>
            <div class="space-y-6">
              <Show when={cityDetailsQuery.data?.saved_itineraries && cityDetailsQuery.data.saved_itineraries.length > 0}>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Saved Itineraries for {decodeURIComponent(params.city || '')}</h2>
                  <div class="space-y-4">
                    <For each={cityDetailsQuery.data?.saved_itineraries || []}>
                      {(itinerary) => (
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200">
                          <div class="flex items-start justify-between mb-4">
                            <div class="flex-1 min-w-0">
                              <h3 class="font-semibold text-gray-900 dark:text-white text-lg mb-2">{itinerary.title}</h3>
                              <Show when={itinerary.description}>
                                <p class="text-gray-600 dark:text-gray-400 mb-3">{itinerary.description}</p>
                              </Show>
                              
                              <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-500">
                                <div class="flex items-center gap-1">
                                  <Calendar class="w-4 h-4" />
                                  <span>Saved {formatDate(itinerary.created_at)}</span>
                                </div>
                                <Show when={itinerary.estimated_duration_days}>
                                  <div class="flex items-center gap-1">
                                    <Clock class="w-4 h-4" />
                                    <span>{itinerary.estimated_duration_days} days</span>
                                  </div>
                                </Show>
                                <Show when={itinerary.is_public}>
                                  <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                                    Public
                                  </span>
                                </Show>
                              </div>
                            </div>
                            
                            <div class="flex items-center gap-2 ml-4">
                              <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <Eye class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              </button>
                              <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <Share2 class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              </button>
                              <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <Download class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              </button>
                            </div>
                          </div>

                          <Show when={itinerary.tags && itinerary.tags.length > 0}>
                            <div class="flex flex-wrap gap-2">
                              <For each={itinerary.tags}>
                                {(tag) => (
                                  <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                                    {tag}
                                  </span>
                                )}
                              </For>
                            </div>
                          </Show>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </Show>

              <Show when={!cityDetailsQuery.data?.saved_itineraries || cityDetailsQuery.data.saved_itineraries.length === 0}>
                <div class="text-center py-12">
                  <Bookmark class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No saved itineraries</h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Itineraries you save will appear here for easy access.
                  </p>
                </div>
              </Show>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
}
