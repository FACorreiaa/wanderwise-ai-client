import { For, Show, createSignal } from "solid-js";
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Share2,
} from "lucide-solid";

import { POIDetailedInfo, AIItineraryResponse } from '~/lib/api/types';

interface ItineraryResultsProps {
  pois?: POIDetailedInfo[];
  itinerary?: AIItineraryResponse | null;
  compact?: boolean;
  limit?: number;
  showToggle?: boolean; // Whether to show the "Show More/Less" button
  initialLimit?: number; // Initial number to show before "Show More"
  onItemClick?: (poi: POIDetailedInfo) => void; // Callback for item clicks
  onFavoriteClick?: (poi: POIDetailedInfo) => void; // Callback for favorite button
  onShareClick?: (poi: POIDetailedInfo) => void; // Callback for share button
  favorites?: string[]; // Array of favorite POI IDs
  showAuthMessage?: boolean; // Whether to show auth message for non-authenticated users
  onToggleFavorite?: (poiId: string, poi: POIDetailedInfo) => void; // New callback for toggling favorites
  isLoadingFavorites?: boolean; // Loading state for favorites
}

export default function ItineraryResults(props: ItineraryResultsProps) {
  const [showAll, setShowAll] = createSignal(false);

  // Check if POI is in favorites
  const isFavorite = (poiName: string) => {
    return props.favorites?.includes(poiName) || false;
  };

  const displayPOIs = () => {
    const pois = props.pois || props.itinerary?.points_of_interest || [];
    // Sort by priority if available
    const sortedPOIs = [...pois].sort(
      (a, b) => (a.priority || 999) - (b.priority || 999),
    );

    // If a fixed limit is provided (from parent), use it
    if (props.limit && !props.showToggle) {
      return sortedPOIs.slice(0, props.limit);
    }

    // If showToggle is enabled, use initialLimit and showAll state
    if (props.showToggle) {
      const initialLimit = props.initialLimit || 5; // Higher default for POIs
      return showAll() ? sortedPOIs : sortedPOIs.slice(0, initialLimit);
    }

    // Default: show all
    return sortedPOIs;
  };

  const shouldShowToggle = () => {
    const pois = props.pois || props.itinerary?.points_of_interest || [];
    const initialLimit = props.initialLimit || 5;
    return props.showToggle && pois.length > initialLimit;
  };

  const getToggleText = () => {
    const pois = props.pois || props.itinerary?.points_of_interest || [];
    const initialLimit = props.initialLimit || 5;
    const remaining = pois.length - initialLimit;

    if (showAll()) {
      return "Show Less";
    } else {
      return `Show ${remaining} More`;
    }
  };

  const itineraryName = () => {
    const rawName = props.itinerary?.itinerary_name;
    if (!rawName) return "Custom Itinerary";

    // Handle case where itinerary_name might be a JSON string or object
    if (typeof rawName === "string" && rawName.startsWith("{")) {
      try {
        const parsed = JSON.parse(rawName);
        return parsed.itinerary_name || parsed.name || "Custom Itinerary";
      } catch (e) {
        console.warn("Failed to parse itinerary name JSON:", e);
        return "Custom Itinerary";
      }
    }

    return rawName || "Custom Itinerary";
  };
  const description = () => props.itinerary?.overall_description;

  const _getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600 dark:text-green-400";
    if (rating >= 4.0) return "text-blue-600 dark:text-blue-400";
    if (rating >= 3.5) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return "bg-red-500 dark:bg-red-600";
    if (priority === 2) return "bg-orange-500 dark:bg-orange-600";
    if (priority === 3) return "bg-yellow-500 dark:bg-yellow-600";
    return "bg-blue-500 dark:bg-blue-600";
  };

  const getCategoryEmoji = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes("museum")) return "🏛️";
    if (categoryLower.includes("park") || categoryLower.includes("garden"))
      return "🌳";
    if (categoryLower.includes("beach")) return "🏖️";
    if (categoryLower.includes("historic") || categoryLower.includes("castle"))
      return "🏰";
    if (categoryLower.includes("church") || categoryLower.includes("cathedral"))
      return "⛪";
    if (categoryLower.includes("market")) return "🛒";
    if (categoryLower.includes("restaurant") || categoryLower.includes("food"))
      return "🍽️";
    if (
      categoryLower.includes("viewpoint") ||
      categoryLower.includes("lookout")
    )
      return "👁️";
    if (categoryLower.includes("landmark")) return "📍";
    if (categoryLower.includes("shopping")) return "🛍️";
    return "📍";
  };

  return (
    <div class="space-y-3">
      <div class="mb-4">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs">
            ✨
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white">
            {itineraryName()} ({displayPOIs().length} stops)
          </h3>
        </div>

        <Show when={description() && !props.compact}>
          <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {description()}
          </p>
        </Show>
      </div>

      <div class={props.compact ? "space-y-2" : "space-y-3"}>
        <For each={displayPOIs()}>
          {(poi, index) => (
            <div
              class={`rounded-lg border border-gray-200 dark:border-gray-700 ${props.compact
                ? "p-3 bg-gray-50 dark:bg-gray-800"
                : "p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                } ${props.onItemClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""}`}
              onClick={() => props.onItemClick?.(poi)}
            >
              <div class="flex items-start gap-3">
                {/* Priority/Step Number */}
                <div class="flex-shrink-0 mt-1">
                  <Show
                    when={poi.priority}
                    fallback={
                      <div class="w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-bold">
                        {index() + 1}
                      </div>
                    }
                  >
                    <div
                      class={`w-6 h-6 rounded-full ${getPriorityColor(poi.priority!)} flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {poi.priority}
                    </div>
                  </Show>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <h4
                          class={`font-medium text-gray-900 dark:text-white truncate ${props.compact ? "text-sm" : "text-base"
                            }`}
                        >
                          {poi.name}
                        </h4>
                        <Show when={poi.category}>
                          <span class="text-sm" title={poi.category}>
                            {getCategoryEmoji(poi.category!)}
                          </span>
                        </Show>
                      </div>
                      <Show when={poi.category}>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {poi.category}
                        </p>
                      </Show>
                    </div>

                    <Show when={poi.rating}>
                      <div class="flex items-center gap-1 ml-2 flex-shrink-0">
                        <Star class="w-4 h-4 text-yellow-500 fill-current" />
                        <span class="text-sm font-medium text-gray-900 dark:text-white">
                          {poi.rating}
                        </span>
                      </div>
                    </Show>
                  </div>

                  <Show when={poi.description_poi && !props.compact}>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {poi.description_poi}
                    </p>
                  </Show>

                  <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                    <Show when={poi.distance}>
                      <div class="flex items-center gap-1">
                        <MapPin class="w-3 h-3" />
                        <span>{poi.distance}km away</span>
                      </div>
                    </Show>

                    <Show when={poi.time_to_spend}>
                      <div class="flex items-center gap-1">
                        <Clock class="w-3 h-3" />
                        <span>{poi.time_to_spend}</span>
                      </div>
                    </Show>

                    <Show when={poi.budget}>
                      <span class="text-blue-600 dark:text-blue-400 font-medium">
                        {poi.budget}
                      </span>
                    </Show>

                    <Show when={poi.opening_hours && !props.compact}>
                      <div class="flex items-center gap-1">
                        <Calendar class="w-3 h-3" />
                        <span class="truncate">{poi.opening_hours}</span>
                      </div>
                    </Show>
                  </div>

                  {/* Action Buttons */}
                  <Show when={!props.compact}>
                    <div class="flex items-center gap-2 mt-3">
                      {/* Favorite Button - now uses star icon like discover page */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (props.onToggleFavorite) {
                            props.onToggleFavorite(poi.name, poi);
                          } else if (props.onFavoriteClick) {
                            props.onFavoriteClick(poi);
                          }
                        }}
                        disabled={props.isLoadingFavorites || (!props.onToggleFavorite && !props.onFavoriteClick)}
                        data-poi-id={poi.name}
                        class={`p-2 rounded-lg transition-colors ${(!props.onToggleFavorite && !props.onFavoriteClick)
                          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed bg-gray-50 dark:bg-gray-800"
                          : isFavorite(poi.name)
                            ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                            : "text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={isFavorite(poi.name) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Show
                          when={!props.isLoadingFavorites}
                          fallback={<div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                        >
                          <Star class={`w-4 h-4 ${isFavorite(poi.name) ? "fill-current" : ""}`} />
                        </Show>
                      </button>

                      {/* Share Button - show always but disable if no callback */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (props.onShareClick) {
                            props.onShareClick(poi);
                          }
                        }}
                        disabled={!props.onShareClick}
                        class={`p-2 rounded-lg transition-colors ${!props.onShareClick
                          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed bg-gray-50 dark:bg-gray-800"
                          : "text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          }`}
                        title={props.onShareClick ? "Share this place" : props.showAuthMessage ? "Sign in to share this place" : "Share this place"}
                      >
                        <Share2 class="w-4 h-4" />
                      </button>
                    </div>
                  </Show>

                  <Show when={poi.website && !props.compact}>
                    <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <a
                        href={poi.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Learn More <ChevronRight class="w-3 h-3" />
                      </a>
                    </div>
                  </Show>
                </div>
              </div>
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
            {showAll() ? (
              <ChevronUp class="w-4 h-4" />
            ) : (
              <ChevronDown class="w-4 h-4" />
            )}
          </button>
        </div>
      </Show>

      {/* Status indicator when using fixed limit */}
      <Show
        when={
          props.limit &&
          !props.showToggle &&
          (props.pois?.length ||
            props.itinerary?.points_of_interest?.length ||
            0) > props.limit
        }
      >
        <div class="text-center py-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Showing {props.limit} of{" "}
            {props.pois?.length ||
              props.itinerary?.points_of_interest?.length ||
              0}{" "}
            places
          </span>
        </div>
      </Show>
    </div>
  );
}
