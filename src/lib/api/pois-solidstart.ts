// SolidStart-enhanced POI and favorites API
import { query, action, revalidate } from "@solidjs/router";
import { createQuery, createMutation } from "@tanstack/solid-query";
import { solidStartApiRequest, createQueryWithPreload, createActionWithMutation } from './solidstart';
import type { POI, POIDetailedInfo } from './types';

// =======================
// TYPE DEFINITIONS
// =======================

interface AddToFavoritesRequest {
  poiId: string;
  poiData?: POIDetailedInfo;
  notes?: string;
}

interface RemoveFromFavoritesRequest {
  poiId: string;
  poiData?: POIDetailedInfo;
}

interface SearchPOIsParams {
  query: string;
  category?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  price_range?: string;
  rating_min?: number;
  limit?: number;
  offset?: number;
}

interface NearbyPOIsParams {
  latitude: number;
  longitude: number;
  radius: number;
  category?: string;
  city?: string;
  price_range?: string;
  rating_min?: number;
  limit?: number;
}

interface FavoritesResponse {
  favorites: POI[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// =======================
// SOLIDSTART QUERIES
// =======================

// User favorites with pagination support
export const getFavorites = createQueryWithPreload(
  "user-favorites",
  async (params?: { page?: number; limit?: number }): Promise<FavoritesResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    
    const url = `/api/pois/favourites${searchParams.toString() ? `?${searchParams}` : ''}`;
    return solidStartApiRequest<FavoritesResponse>(url);
  },
  {
    staleTime: 1000 * 60 * 5, // 5 minutes
  }
);

// POI details with caching
export const getPOIDetails = createQueryWithPreload(
  "poi-details",
  async (poiId: string): Promise<POIDetailedInfo> => {
    return solidStartApiRequest<POIDetailedInfo>(`/api/llm/prompt-response/poi/details`, {
      params: { poi_id: poiId },
    });
  },
  {
    staleTime: 1000 * 60 * 30, // 30 minutes - POI details don't change often
  }
);

// Nearby POIs search
export const getNearbyPOIs = createQueryWithPreload(
  "nearby-pois",
  async (params: NearbyPOIsParams): Promise<{ points_of_interest: POIDetailedInfo[] }> => {
    const searchParams = {
      lat: params.latitude.toString(),
      lon: params.longitude.toString(),
      distance: params.radius.toString(),
      ...(params.category && { category: params.category }),
      ...(params.city && { city: params.city }),
      ...(params.price_range && { price_range: params.price_range }),
      ...(params.rating_min && { rating_min: params.rating_min.toString() }),
      ...(params.limit && { limit: params.limit.toString() }),
    };

    return solidStartApiRequest<{ points_of_interest: POIDetailedInfo[] }>(
      "/api/pois/nearby",
      { params: searchParams }
    );
  },
  {
    staleTime: 1000 * 60 * 10, // 10 minutes
  }
);

// Search POIs
export const searchPOIs = createQueryWithPreload(
  "search-pois",
  async (params: SearchPOIsParams): Promise<{ results: POI[]; total: number }> => {
    const searchParams = {
      q: params.query,
      ...(params.category && { category: params.category }),
      ...(params.city && { city: params.city }),
      ...(params.latitude && { latitude: params.latitude.toString() }),
      ...(params.longitude && { longitude: params.longitude.toString() }),
      ...(params.radius && { radius: params.radius.toString() }),
      ...(params.price_range && { price_range: params.price_range }),
      ...(params.rating_min && { rating_min: params.rating_min.toString() }),
      ...(params.limit && { limit: params.limit.toString() }),
      ...(params.offset && { offset: params.offset.toString() }),
    };

    return solidStartApiRequest<{ results: POI[]; total: number }>(
      "/api/pois/search",
      { params: searchParams }
    );
  },
  {
    staleTime: 1000 * 60 * 5, // 5 minutes
  }
);

// POIs by city
export const getPOIsByCity = createQueryWithPreload(
  "pois-by-city",
  async (cityId: string, filters?: { category?: string; limit?: number }): Promise<POI[]> => {
    const searchParams = {
      ...(filters?.category && { category: filters.category }),
      ...(filters?.limit && { limit: filters.limit.toString() }),
    };

    return solidStartApiRequest<POI[]>(`/api/pois/city/${cityId}`, {
      params: searchParams,
    });
  },
  {
    staleTime: 1000 * 60 * 15, // 15 minutes
  }
);

// =======================
// SOLIDSTART ACTIONS
// =======================

// Add to favorites with optimistic updates
export const addToFavorites = createActionWithMutation(
  "add-to-favorites",
  async (data: AddToFavoritesRequest): Promise<{ message: string; favorite_id?: string }> => {
    const requestBody = {
      poi_id: data.poiId,
      is_llm_poi: true, // Since we're adding from itinerary, these are LLM-generated POIs
      notes: data.notes,
      ...(data.poiData && { poi_data: data.poiData }),
    };

    return solidStartApiRequest<{ message: string; favorite_id?: string }>(
      "/api/pois/favourites",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      }
    );
  },
  {
    invalidates: ["user-favorites"],
    optimisticUpdate: (oldData: FavoritesResponse, params: AddToFavoritesRequest) => {
      if (!oldData) return oldData;
      
      // Create optimistic POI object
      const newPOI: POI = params.poiData || {
        id: params.poiId,
        name: "POI",
        category: "Unknown",
        latitude: 0,
        longitude: 0,
      } as POI;

      return {
        ...oldData,
        favorites: [...oldData.favorites, newPOI],
        total: oldData.total + 1,
      };
    },
    onSuccess: (data, params) => {
      console.log(`✅ Added POI ${params.poiId} to favorites`);
    },
    onError: (error, params) => {
      console.error(`❌ Failed to add POI ${params.poiId} to favorites:`, error.message);
    },
  }
);

// Remove from favorites with optimistic updates
export const removeFromFavorites = createActionWithMutation(
  "remove-from-favorites",
  async (data: RemoveFromFavoritesRequest): Promise<{ message: string }> => {
    const requestBody = {
      poi_id: data.poiId,
      is_llm_poi: true,
      ...(data.poiData && { poi_data: data.poiData }),
    };

    return solidStartApiRequest<{ message: string }>(
      "/api/pois/favourites",
      {
        method: "DELETE",
        body: JSON.stringify(requestBody),
      }
    );
  },
  {
    invalidates: ["user-favorites"],
    optimisticUpdate: (oldData: FavoritesResponse, params: RemoveFromFavoritesRequest) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        favorites: oldData.favorites.filter(poi => poi.id !== params.poiId),
        total: Math.max(0, oldData.total - 1),
      };
    },
    onSuccess: (data, params) => {
      console.log(`✅ Removed POI ${params.poiId} from favorites`);
    },
    onError: (error, params) => {
      console.error(`❌ Failed to remove POI ${params.poiId} from favorites:`, error.message);
    },
  }
);

// =======================
// ENHANCED HOOKS
// =======================

// Enhanced favorites hook with pagination
export const useFavorites = (page?: number, limit?: number) => {
  return getFavorites.useQuery({ page, limit });
};

// Enhanced POI details hook
export const usePOIDetails = (poiId: string) => {
  return getPOIDetails.useQuery(poiId);
};

// Enhanced nearby POIs hook
export const useNearbyPOIs = (params: NearbyPOIsParams) => {
  return getNearbyPOIs.useQuery(params);
};

// Enhanced search POIs hook
export const useSearchPOIs = (params: SearchPOIsParams) => {
  return searchPOIs.useQuery(params);
};

// Enhanced city POIs hook
export const usePOIsByCity = (cityId: string, filters?: { category?: string; limit?: number }) => {
  return getPOIsByCity.useQuery(cityId, filters);
};

// Enhanced add to favorites mutation
export const useAddToFavoritesMutation = () => {
  return addToFavorites.useMutation();
};

// Enhanced remove from favorites mutation
export const useRemoveFromFavoritesMutation = () => {
  return removeFromFavorites.useMutation();
};

// =======================
// UTILITY FUNCTIONS
// =======================

// Check if POI is in favorites
export const isPOIInFavorites = (poiId: string): boolean => {
  try {
    const favoritesData = getFavorites.query();
    return favoritesData?.favorites.some(poi => poi.id === poiId) ?? false;
  } catch {
    return false;
  }
};

// Get cached POI details
export const getCachedPOIDetails = (poiId: string): POIDetailedInfo | null => {
  try {
    return getPOIDetails.query(poiId);
  } catch {
    return null;
  }
};

// Prefetch POI data for a location
export const prefetchLocationPOIs = async (latitude: number, longitude: number, radius = 5000) => {
  try {
    await Promise.allSettled([
      getNearbyPOIs.preload({ latitude, longitude, radius }),
      getFavorites.preload(),
    ]);
  } catch (error) {
    console.warn("Failed to prefetch location POIs:", error);
  }
};

// Prefetch POI details
export const prefetchPOIDetails = async (poiId: string) => {
  try {
    await getPOIDetails.preload(poiId);
  } catch (error) {
    console.warn(`Failed to prefetch POI details for ${poiId}:`, error);
  }
};

// =======================
// ROUTE HELPERS
// =======================

// Create route with POI preloading
export const createPOIRoute = (path: string, preloadFn?: () => Promise<any>) => ({
  path,
  preload: async () => {
    await Promise.allSettled([
      getFavorites.preload(),
      preloadFn?.(),
    ]);
  },
});

// Create POI detail route
export const createPOIDetailRoute = (path: string) => ({
  path,
  preload: async (params: { id: string }) => {
    await prefetchPOIDetails(params.id);
  },
});

// =======================
// BACKWARDS COMPATIBILITY
// =======================

// Export legacy hooks for gradual migration
export { useFavorites as useFavoritesLegacy } from './pois';