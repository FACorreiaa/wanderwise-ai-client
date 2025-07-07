// Example component updates showing how to use SolidStart-enhanced APIs
import { Component, Suspense, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';

// Import both legacy and new APIs
import { 
  // Legacy hooks
  useFavorites as useFavoritesLegacy,
  useAddToFavoritesMutation as useAddToFavoritesMutationLegacy,
  
  // SolidStart enhanced hooks
  useFavorites,
  useAddToFavoritesMutation,
  
  // Migration utilities
  createMigratedHook,
  migrationStatus,
  compat,
} from './index';

// =======================
// MIGRATION APPROACH 1: Smart Hook Selection
// =======================

// Create a smart hook that automatically selects the right API
const useSmartFavorites = createMigratedHook(
  useFavorites,
  useFavoritesLegacy,
  'pois'
);

// Component using the smart hook
export const SmartFavoritesComponent: Component = () => {
  const favorites = useSmartFavorites();
  
  return (
    <div>
      <h2>Smart Favorites (Auto-selects API)</h2>
      <Show when={favorites.data} fallback={<div>Loading...</div>}>
        <div>Found {favorites.data?.favorites?.length || 0} favorites</div>
      </Show>
    </div>
  );
};

// =======================
// MIGRATION APPROACH 2: Manual Feature Flag Check
// =======================

export const FavoritesComponentWithFeatureFlag: Component = () => {
  // Manually check migration status
  const status = migrationStatus();
  
  // Use appropriate hook based on migration status
  const favorites = status.pois 
    ? useFavorites() 
    : useFavoritesLegacy();
  
  const addToFavorites = status.pois
    ? useAddToFavoritesMutation()
    : useAddToFavoritesMutationLegacy();
  
  const handleAddToFavorites = (poiId: string) => {
    addToFavorites.mutate({ poiId });
  };
  
  return (
    <div>
      <h2>Favorites with Feature Flag</h2>
      <div class="text-sm text-gray-500">
        Using: {status.pois ? 'SolidStart API' : 'Legacy API'}
      </div>
      
      <Suspense fallback={<div>Loading favorites...</div>}>
        <Show when={favorites.data}>
          <div>
            <div>Total favorites: {favorites.data?.favorites?.length || 0}</div>
            <button 
              onClick={() => handleAddToFavorites('example-poi-id')}
              disabled={addToFavorites.isPending}
            >
              {addToFavorites.isPending ? 'Adding...' : 'Add to Favorites'}
            </button>
          </div>
        </Show>
      </Suspense>
    </div>
  );
};

// =======================
// MIGRATION APPROACH 3: Utility-Based Selection
// =======================

export const FavoritesComponentWithCompat: Component = () => {
  // Use compat utility for clean API selection
  const favorites = compat.getAPI(
    useFavorites,
    useFavoritesLegacy,
    'pois'
  )();
  
  return (
    <div>
      <h2>Favorites with Compat Utility</h2>
      <Show when={!favorites.isLoading} fallback={<div>Loading...</div>}>
        <div>Favorites loaded: {favorites.data?.favorites?.length || 0}</div>
      </Show>
    </div>
  );
};

// =======================
// FULLY MIGRATED COMPONENT
// =======================

export const NewFavoritesComponent: Component = () => {
  const navigate = useNavigate();
  
  // Use only SolidStart APIs
  const favorites = useFavorites(1, 20); // page 1, 20 items
  const addToFavorites = useAddToFavoritesMutation();
  const removeFromFavorites = useRemoveFromFavoritesMutation();
  
  const handleAddFavorite = (poiId: string, poiData?: any) => {
    addToFavorites.mutate(
      { poiId, poiData },
      {
        onSuccess: () => {
          console.log('Successfully added to favorites!');
        },
        onError: (error) => {
          console.error('Failed to add to favorites:', error);
        }
      }
    );
  };
  
  const handleRemoveFavorite = (poiId: string) => {
    removeFromFavorites.mutate(
      { poiId },
      {
        onSuccess: () => {
          console.log('Successfully removed from favorites!');
        }
      }
    );
  };
  
  return (
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">My Favorites (SolidStart API)</h2>
      
      <Suspense fallback={
        <div class="flex items-center justify-center p-8">
          <div class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span class="ml-2">Loading favorites...</span>
        </div>
      }>
        <Show 
          when={favorites.data && !favorites.isError} 
          fallback={
            <div class="text-red-500">
              {favorites.error?.message || 'Failed to load favorites'}
            </div>
          }
        >
          <div class="space-y-4">
            <div class="text-sm text-gray-600">
              Total: {favorites.data?.total || 0} favorites
            </div>
            
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <For each={favorites.data?.favorites || []}>
                {(poi) => (
                  <div class="border rounded-lg p-4 shadow-sm">
                    <h3 class="font-semibold">{poi.name}</h3>
                    <p class="text-sm text-gray-600">{poi.category}</p>
                    <div class="mt-2 flex gap-2">
                      <button
                        onClick={() => navigate(`/pois/${poi.id}`)}
                        class="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(poi.id)}
                        disabled={removeFromFavorites.isPending}
                        class="px-3 py-1 bg-red-500 text-white rounded text-sm disabled:opacity-50"
                      >
                        {removeFromFavorites.isPending ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                )}
              </For>
            </div>
            
            <Show when={favorites.data?.has_more}>
              <button
                onClick={() => {
                  // Load more functionality would go here
                  console.log('Load more favorites');
                }}
                class="w-full py-2 border rounded-lg hover:bg-gray-50"
              >
                Load More
              </button>
            </Show>
          </div>
        </Show>
      </Suspense>
    </div>
  );
};

// =======================
// ROUTE COMPONENT EXAMPLE
// =======================

// Example of how to use route-level preloading
export const FavoritesPage: Component = () => {
  const favorites = useFavorites(); // Data should already be preloaded
  
  return (
    <div>
      <h1>Favorites Page</h1>
      {/* 
        Since we're using route-level preloading, 
        the data should be available immediately 
      */}
      <Show when={favorites.data} fallback={<div>Loading...</div>}>
        <NewFavoritesComponent />
      </Show>
    </div>
  );
};

// Route configuration for the favorites page
export const favoritesPageRoute = {
  path: '/favorites',
  component: FavoritesPage,
  preload: () => {
    // This will be called before the component renders
    return useFavorites.preload();
  },
};

// =======================
// MIGRATION TESTING COMPONENT
// =======================

export const MigrationTestComponent: Component = () => {
  const [isLegacyMode, setIsLegacyMode] = createSignal(false);
  
  const legacyFavorites = useFavoritesLegacy();
  const newFavorites = useFavorites();
  
  return (
    <div class="p-4 border rounded-lg">
      <h3 class="text-lg font-semibold mb-4">API Migration Test</h3>
      
      <div class="flex gap-4 mb-4">
        <button
          onClick={() => setIsLegacyMode(false)}
          class={`px-4 py-2 rounded ${!isLegacyMode() ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          SolidStart API
        </button>
        <button
          onClick={() => setIsLegacyMode(true)}
          class={`px-4 py-2 rounded ${isLegacyMode() ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Legacy API
        </button>
      </div>
      
      <div class="space-y-2">
        <div>
          <strong>SolidStart API:</strong> 
          <span class={newFavorites.isLoading ? 'text-yellow-600' : newFavorites.isError ? 'text-red-600' : 'text-green-600'}>
            {newFavorites.isLoading ? ' Loading...' : 
             newFavorites.isError ? ' Error' : 
             ` Success (${newFavorites.data?.favorites?.length || 0} items)`}
          </span>
        </div>
        
        <div>
          <strong>Legacy API:</strong> 
          <span class={legacyFavorites.isLoading ? 'text-yellow-600' : legacyFavorites.isError ? 'text-red-600' : 'text-green-600'}>
            {legacyFavorites.isLoading ? ' Loading...' : 
             legacyFavorites.isError ? ' Error' : 
             ` Success (${legacyFavorites.data?.length || 0} items)`}
          </span>
        </div>
      </div>
      
      <div class="mt-4 text-sm text-gray-600">
        Currently showing: {isLegacyMode() ? 'Legacy' : 'SolidStart'} API results
      </div>
    </div>
  );
};