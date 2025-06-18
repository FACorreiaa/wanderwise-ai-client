import { For, Show, createSignal } from 'solid-js';
import { Star, MapPin, Clock, DollarSign, Calendar, ChevronDown, ChevronUp } from 'lucide-solid';

interface Activity {
  name: string;
  latitude?: number;
  longitude?: number;
  category?: string;
  description_poi?: string;
  address?: string;
  website?: string;
  opening_hours?: string;
  rating?: number;
  budget?: string;
  price_range?: string;
  duration?: string;
  distance?: number;
}

interface ActivityResultsProps {
  activities: Activity[];
  compact?: boolean;
  limit?: number;
  showToggle?: boolean; // Whether to show the "Show More/Less" button
  initialLimit?: number; // Initial number to show before "Show More"
  onItemClick?: (activity: Activity) => void; // Callback for item clicks
}

export default function ActivityResults(props: ActivityResultsProps) {
  const [showAll, setShowAll] = createSignal(false);
  
  const displayActivities = () => {
    const activities = props.activities || [];
    
    // If a fixed limit is provided (from parent), use it
    if (props.limit && !props.showToggle) {
      return activities.slice(0, props.limit);
    }
    
    // If showToggle is enabled, use initialLimit and showAll state
    if (props.showToggle) {
      const initialLimit = props.initialLimit || 3;
      return showAll() ? activities : activities.slice(0, initialLimit);
    }
    
    // Default: show all
    return activities;
  };

  const shouldShowToggle = () => {
    const activities = props.activities || [];
    const initialLimit = props.initialLimit || 3;
    return props.showToggle && activities.length > initialLimit;
  };

  const getToggleText = () => {
    const activities = props.activities || [];
    const initialLimit = props.initialLimit || 3;
    const remaining = activities.length - initialLimit;
    
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

  const getBudgetColor = (budget: string) => {
    const budgetLower = budget.toLowerCase();
    if (budgetLower.includes('expensive') || budgetLower.includes('high')) return 'text-red-600 dark:text-red-400';
    if (budgetLower.includes('moderate') || budgetLower.includes('medium')) return 'text-orange-600 dark:text-orange-400';
    if (budgetLower.includes('cheap') || budgetLower.includes('low') || budgetLower.includes('free')) return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getCategoryEmoji = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('museum')) return '🏛️';
    if (categoryLower.includes('park') || categoryLower.includes('garden')) return '🌳';
    if (categoryLower.includes('beach')) return '🏖️';
    if (categoryLower.includes('historic') || categoryLower.includes('castle')) return '🏰';
    if (categoryLower.includes('church') || categoryLower.includes('cathedral')) return '⛪';
    if (categoryLower.includes('market')) return '🛒';
    if (categoryLower.includes('art') || categoryLower.includes('gallery')) return '🎨';
    if (categoryLower.includes('music') || categoryLower.includes('concert')) return '🎵';
    if (categoryLower.includes('sport') || categoryLower.includes('stadium')) return '⚽';
    if (categoryLower.includes('shopping')) return '🛍️';
    if (categoryLower.includes('tour') || categoryLower.includes('walking')) return '🚶‍♂️';
    if (categoryLower.includes('viewpoint') || categoryLower.includes('lookout')) return '👁️';
    return '🎯';
  };

  return (
    <div class="space-y-3">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-6 h-6 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center text-white text-xs">
          🎯
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white">
          Activities ({displayActivities().length})
        </h3>
      </div>
      
      <div class={props.compact ? "space-y-2" : "space-y-4"}>
        <For each={displayActivities()}>
          {(activity) => (
            <div 
              class={`rounded-lg border border-gray-200 dark:border-gray-700 ${
                props.compact 
                  ? "p-3 bg-gray-50 dark:bg-gray-800" 
                  : "p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              } ${props.onItemClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}`}
              onClick={() => props.onItemClick?.(activity)}
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h4 class={`font-medium text-gray-900 dark:text-white truncate ${
                      props.compact ? "text-sm" : "text-base"
                    }`}>
                      {activity.name}
                    </h4>
                    <Show when={activity.category}>
                      <span class="text-sm" title={activity.category}>
                        {getCategoryEmoji(activity.category!)}
                      </span>
                    </Show>
                  </div>
                  <Show when={activity.category}>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {activity.category}
                    </p>
                  </Show>
                </div>
                
                <div class="flex items-center gap-2 ml-2 flex-shrink-0">
                  <Show when={activity.rating}>
                    <div class="flex items-center gap-1">
                      <Star class={`w-3 h-3 fill-current ${getRatingColor(activity.rating!)}`} />
                      <span class={`text-xs font-medium ${getRatingColor(activity.rating!)}`}>
                        {activity.rating}
                      </span>
                    </div>
                  </Show>
                  
                  <Show when={activity.budget || activity.price_range}>
                    <div class="flex items-center gap-1">
                      <DollarSign class={`w-3 h-3 ${getBudgetColor(activity.budget || activity.price_range || '')}`} />
                      <span class={`text-xs font-medium ${getBudgetColor(activity.budget || activity.price_range || '')}`}>
                        {activity.budget || activity.price_range}
                      </span>
                    </div>
                  </Show>
                </div>
              </div>

              <Show when={activity.description_poi && !props.compact}>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {activity.description_poi}
                </p>
              </Show>

              <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                <Show when={activity.distance}>
                  <div class="flex items-center gap-1">
                    <MapPin class="w-3 h-3" />
                    <span>{activity.distance}km away</span>
                  </div>
                </Show>
                
                <Show when={activity.duration && !props.compact}>
                  <div class="flex items-center gap-1">
                    <Calendar class="w-3 h-3" />
                    <span>{activity.duration}</span>
                  </div>
                </Show>
                
                <Show when={activity.opening_hours && !props.compact}>
                  <div class="flex items-center gap-1">
                    <Clock class="w-3 h-3" />
                    <span class="truncate">{activity.opening_hours}</span>
                  </div>
                </Show>
                
                <Show when={activity.address && !props.compact}>
                  <span class="truncate">{activity.address}</span>
                </Show>
              </div>

              <Show when={activity.website && !props.compact}>
                <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <a 
                    href={activity.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Learn More →
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
      <Show when={props.limit && !props.showToggle && props.activities.length > props.limit}>
        <div class="text-center py-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Showing {props.limit} of {props.activities.length} activities
          </span>
        </div>
      </Show>
    </div>
  );
}