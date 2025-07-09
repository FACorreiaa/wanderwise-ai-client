import { createSignal, For, Show, createEffect } from 'solid-js';
import { useParams } from '@solidjs/router';
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  Heart, 
  Share2, 
  DollarSign, 
  Users, 
  Car,
  ArrowLeft,
  Calendar,
  Camera,
  Navigation,
  Info,
  Tag,
  Bookmark
} from 'lucide-solid';
import { A } from '@solidjs/router';
import { useFavorites, useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '~/lib/api/pois';

export default function POIDetailPage() {
  const params = useParams();
  const [selectedTab, setSelectedTab] = createSignal('overview');
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [poiData, setPOIData] = createSignal(null);
  const [isFavorite, setIsFavorite] = createSignal(false);

  // API hooks
  const favoritesQuery = useFavorites();
  const addToFavoritesMutation = useAddToFavoritesMutation();
  const removeFromFavoritesMutation = useRemoveFromFavoritesMutation();

  // Check if POI is in favorites
  createEffect(() => {
    const favorites = favoritesQuery.data || [];
    const isInFavorites = favorites.some(fav => fav.id === params.id);
    setIsFavorite(isInFavorites);
  });

  // Mock data loading - in real app this would fetch from API
  createEffect(() => {
    const loadPOIData = async () => {
      try {
        setIsLoading(true);
        
        // Find POI in favorites if it exists
        const favorites = favoritesQuery.data || [];
        const favoritesPOI = favorites.find(fav => fav.id === params.id);
        
        if (favoritesPOI) {
          setPOIData(favoritesPOI);
        } else {
          // Mock POI data - in real app this would be an API call
          setPOIData({
            id: params.id,
            name: 'Sample POI',
            category: 'Attraction',
            description: 'This is a sample POI. In a real application, this would be fetched from the API.',
            description_poi: 'Detailed description of the point of interest.',
            latitude: 40.7128,
            longitude: -74.0060,
            address: '123 Sample Street, New York, NY 10001',
            phone_number: '+1 (555) 123-4567',
            website: 'https://example.com',
            opening_hours: 'Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM',
            price_level: '$$',
            rating: 4.5,
            tags: ['tourist', 'popular', 'family-friendly'],
            distance: 1.2
          });
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load POI details');
        console.error('Error loading POI:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPOIData();
  });

  const poi = () => poiData();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'location', label: 'Location' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'photos', label: 'Photos' }
  ];

  const toggleFavorite = async () => {
    if (!poi()) return;

    try {
      if (isFavorite()) {
        await removeFromFavoritesMutation.mutateAsync({
          poiId: poi().id,
          isLlmPoi: true
        });
      } else {
        await addToFavoritesMutation.mutateAsync({
          poiId: poi().id,
          isLlmPoi: true
        });
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const getPriceColor = (price) => {
    const colorMap = {
      '$': 'text-green-600 bg-green-50',
      '$$': 'text-orange-600 bg-orange-50',
      '$$$': 'text-red-600 bg-red-50',
      '$$$$': 'text-purple-600 bg-purple-50'
    };
    return colorMap[price] || 'text-gray-600 bg-gray-50';
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'restaurant': return '🍽️';
      case 'park': return '🌳';
      case 'beach': return '🏖️';
      case 'landmark': return '🏛️';
      case 'museum': return '🏛️';
      case 'shopping': return '🛍️';
      case 'attraction': return '🎯';
      default: return '📍';
    }
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Restaurant': 'text-orange-600 bg-orange-50',
      'Park': 'text-green-600 bg-green-50',
      'Beach': 'text-blue-600 bg-blue-50',
      'Landmark': 'text-purple-600 bg-purple-50',
      'Museum': 'text-amber-600 bg-amber-50',
      'Shopping': 'text-pink-600 bg-pink-50',
      'Attraction': 'text-indigo-600 bg-indigo-50',
    };
    return colorMap[category] || 'text-gray-600 bg-gray-50';
  };

  const formatDistance = (distance) => {
    if (!distance || distance === 0) return '';
    if (distance < 1000) return `${Math.round(distance)}m`;
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const renderOverview = () => (
    <div class="space-y-6">
      {/* Description */}
      <div class="bg-white rounded-lg p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">About this place</h3>
        <p class="text-gray-600 leading-relaxed">
          {poi()?.description_poi || poi()?.description || 'No description available.'}
        </p>
      </div>

      {/* Key Information */}
      <div class="bg-white rounded-lg p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Show when={poi()?.category}>
            <div class="flex items-center gap-3">
              <div class="text-2xl">{getCategoryIcon(poi()?.category)}</div>
              <div>
                <p class="text-sm text-gray-500">Category</p>
                <span class={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(poi()?.category)}`}>
                  {poi()?.category}
                </span>
              </div>
            </div>
          </Show>
          
          <Show when={poi()?.price_level}>
            <div class="flex items-center gap-3">
              <DollarSign class="w-5 h-5 text-gray-500" />
              <div>
                <p class="text-sm text-gray-500">Price Level</p>
                <span class={`px-2 py-1 rounded text-sm ${getPriceColor(poi()?.price_level)}`}>
                  {poi()?.price_level}
                </span>
              </div>
            </div>
          </Show>
          
          <Show when={poi()?.rating}>
            <div class="flex items-center gap-3">
              <Star class="w-5 h-5 text-gray-500" />
              <div>
                <p class="text-sm text-gray-500">Rating</p>
                <div class="flex items-center gap-1">
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <span class="font-medium">{poi()?.rating}</span>
                </div>
              </div>
            </div>
          </Show>
          
          <Show when={formatDistance(poi()?.distance)}>
            <div class="flex items-center gap-3">
              <Navigation class="w-5 h-5 text-gray-500" />
              <div>
                <p class="text-sm text-gray-500">Distance</p>
                <p class="font-medium">{formatDistance(poi()?.distance)} away</p>
              </div>
            </div>
          </Show>
        </div>
      </div>

      {/* Contact Information */}
      <div class="bg-white rounded-lg p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact & Location</h3>
        <div class="space-y-3">
          <Show when={poi()?.address}>
            <div class="flex items-start gap-3">
              <MapPin class="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p class="text-sm text-gray-500">Address</p>
                <p class="font-medium">{poi()?.address}</p>
              </div>
            </div>
          </Show>
          
          <Show when={poi()?.phone_number}>
            <div class="flex items-center gap-3">
              <Phone class="w-5 h-5 text-gray-500" />
              <div>
                <p class="text-sm text-gray-500">Phone</p>
                <a href={`tel:${poi()?.phone_number}`} class="font-medium text-blue-600 hover:text-blue-800">
                  {poi()?.phone_number}
                </a>
              </div>
            </div>
          </Show>
          
          <Show when={poi()?.website}>
            <div class="flex items-center gap-3">
              <Globe class="w-5 h-5 text-gray-500" />
              <div>
                <p class="text-sm text-gray-500">Website</p>
                <a 
                  href={poi()?.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="font-medium text-blue-600 hover:text-blue-800"
                >
                  Visit Website
                </a>
              </div>
            </div>
          </Show>
          
          <Show when={poi()?.opening_hours}>
            <div class="flex items-start gap-3">
              <Clock class="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p class="text-sm text-gray-500">Hours</p>
                <p class="font-medium">{poi()?.opening_hours}</p>
              </div>
            </div>
          </Show>
        </div>
      </div>

      {/* Tags */}
      <Show when={poi()?.tags && poi()?.tags.length > 0}>
        <div class="bg-white rounded-lg p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
          <div class="flex flex-wrap gap-2">
            <For each={poi()?.tags}>
              {(tag) => (
                <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  <Tag class="w-3 h-3 inline mr-1" />
                  {tag}
                </span>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );

  const renderLocation = () => (
    <div class="space-y-6">
      <div class="bg-white rounded-lg p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Location Details</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Latitude</p>
              <p class="font-mono text-sm">{poi()?.latitude?.toFixed(6)}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Longitude</p>
              <p class="font-mono text-sm">{poi()?.longitude?.toFixed(6)}</p>
            </div>
          </div>
          
          <Show when={poi()?.address}>
            <div>
              <p class="text-sm text-gray-500">Full Address</p>
              <p class="font-medium">{poi()?.address}</p>
            </div>
          </Show>
        </div>
      </div>
      
      {/* Placeholder for map */}
      <div class="bg-white rounded-lg p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Map</h3>
        <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div class="text-center text-gray-500">
            <MapPin class="w-12 h-12 mx-auto mb-2" />
            <p>Map would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div class="space-y-6">
      <div class="bg-white rounded-lg p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
        <div class="text-center text-gray-500 py-8">
          <Star class="w-12 h-12 mx-auto mb-2" />
          <p>Reviews would be displayed here</p>
        </div>
      </div>
    </div>
  );

  const renderPhotos = () => (
    <div class="space-y-6">
      <div class="bg-white rounded-lg p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
        <div class="text-center text-gray-500 py-8">
          <Camera class="w-12 h-12 mx-auto mb-2" />
          <p>Photos would be displayed here</p>
        </div>
      </div>
    </div>
  );

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Loading State */}
      <Show when={isLoading()}>
        <div class="flex items-center justify-center min-h-screen">
          <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Show>

      {/* Error State */}
      <Show when={error()}>
        <div class="flex items-center justify-center min-h-screen">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">POI Not Found</h2>
            <p class="text-gray-600 mb-4">{error()}</p>
            <A href="/favorites" class="cb-button cb-button-primary">
              Back to Favorites
            </A>
          </div>
        </div>
      </Show>

      {/* Content */}
      <Show when={!isLoading() && !error() && poi()}>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div class="mb-6">
            <A href="/favorites" class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft class="w-4 h-4 mr-2" />
              Back to Favorites
            </A>
            
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <div class="text-4xl">{getCategoryIcon(poi()?.category)}</div>
                  <div>
                    <h1 class="text-2xl font-bold text-gray-900">{poi()?.name}</h1>
                    <div class="flex items-center gap-2 mt-1">
                      <Show when={poi()?.category}>
                        <span class={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(poi()?.category)}`}>
                          {poi()?.category}
                        </span>
                      </Show>
                      <Show when={poi()?.rating}>
                        <div class="flex items-center gap-1">
                          <Star class="w-4 h-4 text-yellow-400 fill-current" />
                          <span class="text-sm font-medium">{poi()?.rating}</span>
                        </div>
                      </Show>
                      <Show when={formatDistance(poi()?.distance)}>
                        <span class="text-sm text-gray-500">{formatDistance(poi()?.distance)} away</span>
                      </Show>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <button 
                  onClick={toggleFavorite}
                  class={`p-2 rounded-lg ${isFavorite() ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-100'}`}
                  disabled={addToFavoritesMutation.isLoading || removeFromFavoritesMutation.isLoading}
                >
                  <Heart class={`w-5 h-5 ${isFavorite() ? 'fill-current' : ''}`} />
                </button>
                <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Share2 class="w-5 h-5" />
                </button>
                <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Bookmark class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div class="border-b border-gray-200 mb-6">
            <nav class="flex space-x-8">
              <For each={tabs}>
                {(tab) => (
                  <button
                    onClick={() => setSelectedTab(tab.id)}
                    class={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab() === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                )}
              </For>
            </nav>
          </div>

          {/* Tab Content */}
          <div class="pb-6">
            <Show when={selectedTab() === 'overview'}>
              {renderOverview()}
            </Show>
            <Show when={selectedTab() === 'location'}>
              {renderLocation()}
            </Show>
            <Show when={selectedTab() === 'reviews'}>
              {renderReviews()}
            </Show>
            <Show when={selectedTab() === 'photos'}>
              {renderPhotos()}
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}