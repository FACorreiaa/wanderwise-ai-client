import { Show, createSignal, onMount, createEffect } from 'solid-js';
import { X, Star, MapPin, Clock, DollarSign, Phone, Globe, Heart, Share2, Navigation, Calendar, Users, Wifi, Car, Coffee, Utensils } from 'lucide-solid';
import MapComponent from '~/components/features/Map/Map';

// Union type for all possible item types
type DetailedItem = {
  type: 'hotel' | 'restaurant' | 'activity' | 'poi';
  name: string;
  latitude?: number;
  longitude?: number;
  category?: string;
  description_poi?: string;
  address?: string;
  website?: string;
  opening_hours?: string;
  rating?: number;
  price_range?: string;
  cuisine_type?: string;
  distance?: number;
  amenities?: string[];
  phone_number?: string;
  budget?: string;
  duration?: string;
  timeToSpend?: string;
  priority?: number;
  tags?: string[];
};

interface DetailedItemModalProps {
  item: DetailedItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DetailedItemModal(props: DetailedItemModalProps) {
  const [activeTab, setActiveTab] = createSignal<'details' | 'map'>('details');
  const [isFavorited, setIsFavorited] = createSignal(false);

  // Reset to details tab when modal opens
  createEffect(() => {
    if (props.isOpen && props.item) {
      setActiveTab('details');
    }
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hotel': return 'text-blue-600 dark:text-blue-400';
      case 'restaurant': return 'text-orange-600 dark:text-orange-400';
      case 'activity': return 'text-green-600 dark:text-green-400';
      case 'poi': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return '🏨';
      case 'restaurant': return '🍽️';
      case 'activity': return '🎯';
      case 'poi': return '📍';
      default: return '📍';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 dark:text-green-400';
    if (rating >= 4.0) return 'text-blue-600 dark:text-blue-400';
    if (rating >= 3.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getPriceColor = (priceRange: string) => {
    if (priceRange.includes('€€€€') || priceRange.includes('$$$$')) return 'text-red-600 dark:text-red-400';
    if (priceRange.includes('€€€') || priceRange.includes('$$$')) return 'text-orange-600 dark:text-orange-400';
    if (priceRange.includes('€€') || priceRange.includes('$$')) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi class="w-4 h-4" />;
    if (amenityLower.includes('parking') || amenityLower.includes('car')) return <Car class="w-4 h-4" />;
    if (amenityLower.includes('breakfast') || amenityLower.includes('coffee')) return <Coffee class="w-4 h-4" />;
    if (amenityLower.includes('restaurant') || amenityLower.includes('dining')) return <Utensils class="w-4 h-4" />;
    return null;
  };

  const handleShare = () => {
    if (navigator.share && props.item) {
      navigator.share({
        title: props.item.name,
        text: props.item.description_poi || `Check out ${props.item.name}`,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleGetDirections = () => {
    if (props.item?.latitude && props.item?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${props.item.latitude},${props.item.longitude}`;
      window.open(url, '_blank');
    }
  };

  if (!props.isOpen || !props.item) {
    return null;
  }

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{getTypeIcon(props.item.type)}</span>
              <div class="min-w-0 flex-1">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {props.item.name}
                </h2>
                <div class="flex items-center gap-2 mt-1">
                  <span class={`text-sm font-medium ${getTypeColor(props.item.type)} capitalize`}>
                    {props.item.type}
                  </span>
                  <Show when={props.item.category}>
                    <span class="text-sm text-gray-500 dark:text-gray-400">• {props.item.category}</span>
                  </Show>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={props.onClose}
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex-shrink-0"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div class="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('details')}
            class={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab() === 'details'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Details
          </button>
          <Show when={props.item.latitude && props.item.longitude}>
            <button
              onClick={() => setActiveTab('map')}
              class={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab() === 'map'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Map
            </button>
          </Show>
        </div>

        {/* Content */}
        <div class="flex-1 overflow-y-auto">
          <Show when={activeTab() === 'details'}>
            <div class="p-4 sm:p-6 space-y-6">
              {/* Quick Stats */}
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Show when={props.item.rating}>
                  <div class="text-center">
                    <div class={`flex items-center justify-center gap-1 ${getRatingColor(props.item.rating!)}`}>
                      <Star class="w-4 h-4 fill-current" />
                      <span class="font-semibold">{props.item.rating}</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Rating</p>
                  </div>
                </Show>
                <Show when={props.item.price_range}>
                  <div class="text-center">
                    <div class={`flex items-center justify-center gap-1 ${getPriceColor(props.item.price_range!)}`}>
                      <DollarSign class="w-4 h-4" />
                      <span class="font-semibold">{props.item.price_range}</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Price</p>
                  </div>
                </Show>
                <Show when={props.item.distance}>
                  <div class="text-center">
                    <div class="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
                      <MapPin class="w-4 h-4" />
                      <span class="font-semibold">{props.item.distance}km</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Distance</p>
                  </div>
                </Show>
                <Show when={props.item.timeToSpend || props.item.duration}>
                  <div class="text-center">
                    <div class="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
                      <Clock class="w-4 h-4" />
                      <span class="font-semibold text-xs">{props.item.timeToSpend || props.item.duration}</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Duration</p>
                  </div>
                </Show>
              </div>

              {/* Description */}
              <Show when={props.item.description_poi}>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">About</h3>
                  <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {props.item.description_poi}
                  </p>
                </div>
              </Show>

              {/* Contact Information */}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Show when={props.item.address}>
                  <div class="flex items-start gap-3">
                    <MapPin class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">Address</p>
                      <p class="text-sm text-gray-600 dark:text-gray-300">{props.item.address}</p>
                    </div>
                  </div>
                </Show>
                <Show when={props.item.phone_number}>
                  <div class="flex items-start gap-3">
                    <Phone class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">Phone</p>
                      <a href={`tel:${props.item.phone_number}`} class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        {props.item.phone_number}
                      </a>
                    </div>
                  </div>
                </Show>
                <Show when={props.item.website}>
                  <div class="flex items-start gap-3">
                    <Globe class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">Website</p>
                      <a 
                        href={props.item.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                </Show>
                <Show when={props.item.opening_hours}>
                  <div class="flex items-start gap-3">
                    <Clock class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">Hours</p>
                      <p class="text-sm text-gray-600 dark:text-gray-300">{props.item.opening_hours}</p>
                    </div>
                  </div>
                </Show>
              </div>

              {/* Amenities/Tags */}
              <Show when={props.item.amenities && props.item.amenities.length > 0}>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Amenities</h3>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {props.item.amenities!.map(amenity => (
                      <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        {getAmenityIcon(amenity) || <div class="w-2 h-2 bg-green-500 rounded-full"></div>}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Show>

              <Show when={props.item.tags && props.item.tags.length > 0}>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
                  <div class="flex flex-wrap gap-2">
                    {props.item.tags!.map(tag => (
                      <span class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Show>
            </div>
          </Show>

          <Show when={activeTab() === 'map' && props.item.latitude && props.item.longitude}>
            <div class="h-96 sm:h-[500px]">
              <MapComponent
                center={[props.item.longitude!, props.item.latitude!]}
                zoom={15}
                minZoom={10}
                maxZoom={22}
                pointsOfInterest={[{
                  name: props.item.name,
                  latitude: props.item.latitude!,
                  longitude: props.item.longitude!,
                  category: props.item.category,
                  description: props.item.description_poi
                }]}
              />
            </div>
          </Show>
        </div>

        {/* Footer Actions */}
        <div class="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div class="flex gap-2">
              <button
                onClick={() => setIsFavorited(!isFavorited())}
                class={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isFavorited()
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Heart class={`w-4 h-4 ${isFavorited() ? 'fill-current' : ''}`} />
                {isFavorited() ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={handleShare}
                class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
              >
                <Share2 class="w-4 h-4" />
                Share
              </button>
            </div>
            <Show when={props.item.latitude && props.item.longitude}>
              <button
                onClick={handleGetDirections}
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                <Navigation class="w-4 h-4" />
                Get Directions
              </button>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}