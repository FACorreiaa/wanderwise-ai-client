import { For, Show, createSignal } from 'solid-js';
import { Star, MapPin, Clock, DollarSign, ChevronDown, ChevronUp, Share2 } from 'lucide-solid';
import AddToListButton from '~/components/lists/AddToListButton';
import FavoriteButton from '~/components/shared/FavoriteButton';
import { RestaurantDetailedInfo } from '~/lib/api/types';

interface RestaurantResultsProps {
  restaurants: RestaurantDetailedInfo[];
  compact?: boolean;
  limit?: number;
  showToggle?: boolean; // Whether to show the "Show More/Less" button
  initialLimit?: number; // Initial number to show before "Show More"
  onItemClick?: (restaurant: RestaurantDetailedInfo) => void;
  onFavoriteClick?: (restaurant: RestaurantDetailedInfo) => void; // Callback for favorite button (legacy)
  onToggleFavorite?: (restaurantId: string, restaurant: RestaurantDetailedInfo) => void; // New callback for toggling favorites
  onShareClick?: (restaurant: RestaurantDetailedInfo) => void; // Callback for share button
  favorites?: string[]; // Array of favorite restaurant IDs
  showAuthMessage?: boolean; // Whether to show auth message for non-authenticated users
  isLoadingFavorites?: boolean; // Loading state for favorites
}

export default function RestaurantResults(props: RestaurantResultsProps) {
  const [showAll, setShowAll] = createSignal(false);

  // Check if restaurant is in favorites
  const isFavorite = (restaurantName: string) => {
    return props.favorites?.includes(restaurantName) || false;
  };

  const displayRestaurants = () => {
    const restaurants = props.restaurants || [];

    // If a fixed limit is provided (from parent), use it
    if (props.limit && !props.showToggle) {
      return restaurants.slice(0, props.limit);
    }

    // If showToggle is enabled, use initialLimit and showAll state
    if (props.showToggle) {
      const initialLimit = props.initialLimit || 3;
      return showAll() ? restaurants : restaurants.slice(0, initialLimit);
    }

    // Default: show all
    return restaurants;
  };

  const shouldShowToggle = () => {
    const restaurants = props.restaurants || [];
    const initialLimit = props.initialLimit || 3;
    return props.showToggle && restaurants.length > initialLimit;
  };

  const getToggleText = () => {
    const restaurants = props.restaurants || [];
    const initialLimit = props.initialLimit || 3;
    const remaining = restaurants.length - initialLimit;

    if (showAll()) {
      return 'Show Less';
    } else {
      return `Show ${remaining} More`;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 dark:text-green-400';
    if (rating >= 4.0) return 'text-blue-600 dark:text-blue-400';
    if (rating >= 3.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getPriceColor = (priceLevel: string) => {
    if (priceLevel.includes('€€€€') || priceLevel.includes('$$$$')) return 'text-red-600 dark:text-red-400';
    if (priceLevel.includes('€€€') || priceLevel.includes('$$$')) return 'text-orange-600 dark:text-orange-400';
    if (priceLevel.includes('€€') || priceLevel.includes('$$')) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getCuisineEmoji = (cuisine: string) => {
    const cuisineLower = cuisine.toLowerCase();
    if (cuisineLower.includes('italian')) return '🍝';
    if (cuisineLower.includes('japanese') || cuisineLower.includes('sushi')) return '🍣';
    if (cuisineLower.includes('chinese')) return '🥢';
    if (cuisineLower.includes('mexican')) return '🌮';
    if (cuisineLower.includes('french')) return '🥐';
    if (cuisineLower.includes('indian')) return '🍛';
    if (cuisineLower.includes('pizza')) return '🍕';
    if (cuisineLower.includes('seafood')) return '🐟';
    if (cuisineLower.includes('portuguese')) return '🇵🇹';
    return '🍽️';
  };

  return (
    <div class="space-y-3">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-6 h-6 rounded-full bg-orange-500 dark:bg-orange-600 flex items-center justify-center text-white text-xs">
          🍽️
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white">
          Restaurants ({displayRestaurants().length})
        </h3>
      </div>

      <div class={props.compact ? "space-y-2" : "space-y-4"}>
        <For each={displayRestaurants()}>
          {(restaurant) => (
            <div
              class={`rounded-lg border border-gray-200 dark:border-gray-700 ${props.compact
                ? "p-3 bg-gray-50 dark:bg-gray-800"
                : "p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                } ${props.onItemClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}`}
              onClick={() => props.onItemClick?.(restaurant)}
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h4 class={`font-medium text-gray-900 dark:text-white truncate ${props.compact ? "text-sm" : "text-base"
                      }`}>
                      {restaurant.name}
                    </h4>
                    <Show when={restaurant.cuisine_type}>
                      <span class="text-sm" title={restaurant.cuisine_type}>
                        {getCuisineEmoji(restaurant.cuisine_type!)}
                      </span>
                    </Show>
                  </div>
                  <Show when={restaurant.cuisine_type || restaurant.category}>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {restaurant.cuisine_type || restaurant.category}
                    </p>
                  </Show>
                </div>

                <div class="flex items-center gap-2 ml-2 flex-shrink-0">
                  <Show when={restaurant.rating}>
                    <div class="flex items-center gap-1">
                      <Star class={`w-3 h-3 fill-current ${getRatingColor(restaurant.rating!)}`} />
                      <span class={`text-xs font-medium ${getRatingColor(restaurant.rating!)}`}>
                        {restaurant.rating}
                      </span>
                    </div>
                  </Show>

                  <Show when={restaurant.price_level}>
                    <div class="flex items-center gap-1">
                      <DollarSign class={`w-3 h-3 ${getPriceColor(restaurant.price_level!)}`} />
                      <span class={`text-xs font-medium ${getPriceColor(restaurant.price_level!)}`}>
                        {restaurant.price_level}
                      </span>
                    </div>
                  </Show>
                </div>
              </div>

              <Show when={restaurant.description && !props.compact}>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {restaurant.description}
                </p>
              </Show>

              <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                <Show when={(restaurant as any).distance}>
                  <div class="flex items-center gap-1">
                    <MapPin class="w-3 h-3" />
                    <span>{(restaurant as any).distance.toFixed(1)}km away</span>
                  </div>
                </Show>

                <Show when={restaurant.opening_hours && !props.compact}>
                  <div class="flex items-center gap-1">
                    <Clock class="w-3 h-3" />
                    <span class="truncate">{restaurant.opening_hours}</span>
                  </div>
                </Show>

                <Show when={restaurant.address && !props.compact}>
                  <span class="truncate">{restaurant.address}</span>
                </Show>
              </div>

              {/* Action Buttons */}
              <Show when={!props.compact}>
                <div class="flex items-center gap-2 mt-3">
                  <FavoriteButton
                    item={{
                      id: restaurant.name,
                      name: restaurant.name,
                      contentType: 'restaurant',
                      description: restaurant.description || '',
                      llmInteractionId: restaurant.llm_interaction_id,
                    }}
                    size="sm"
                  />

                  {/* Add to List Button */}
                  <AddToListButton
                    itemId={restaurant.id || restaurant.name}
                    contentType="restaurant"
                    itemName={restaurant.name}
                    variant="icon"
                    size="md"
                    sourceInteractionId={restaurant.llm_interaction_id}
                    aiDescription={restaurant.description}
                  />
                  <Show when={props.onShareClick}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onShareClick?.(restaurant);
                      }}
                      class="p-2 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      title="Share this restaurant"
                    >
                      <Share2 class="w-4 h-4" />
                    </button>
                  </Show>
                </div>
              </Show>

              <Show when={restaurant.website && !props.compact}>
                <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Menu & Details →
                  </a>
                </div>
              </Show>
            </div>
          )}
        </For>
      </div>

      {/* Show More/Less Toggle */}
      <Show when={shouldShowToggle()}>
        <div class="text-center py-3">
          <button
            onClick={() => setShowAll(!showAll())}
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 transition-colors"
          >
            <span>{getToggleText()}</span>
            {showAll() ?
              <ChevronUp class="w-4 h-4" /> :
              <ChevronDown class="w-4 h-4" />
            }
          </button>
        </div>
      </Show>

      {/* Status indicator when using fixed limit */}
      <Show when={props.limit && !props.showToggle && props.restaurants.length > props.limit}>
        <div class="text-center py-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Showing {props.limit} of {props.restaurants.length} restaurants
          </span>
        </div>
      </Show>
    </div>
  );
}