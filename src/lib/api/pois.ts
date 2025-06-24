// POI and favorites queries and mutations
import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { apiRequest, queryKeys } from './shared';
import type { POI, POIDetailedInfo } from './types';
import { createResource } from 'solid-js';

// ===============
// POI QUERIES
// ===============

export const useFavorites = () => {
  return useQuery(() => ({
    queryKey: queryKeys.favorites,
    queryFn: async () => {
      console.log('🔄 Fetching user favorites...');
      try {
        const response = await apiRequest<POI[]>('/pois/favourites');
        console.log('✅ Favorites fetched:', response);
        return response;
      } catch (error) {
        console.error('❌ Failed to fetch favorites:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  }));
};

export const useAddToFavoritesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: async (params: { poiId: string; poiData?: POIDetailedInfo }) => {
      console.log('🔄 Adding POI to favorites:', params);
      const requestBody = {
        poi_id: params.poiId,
        ...(params.poiData && { poi_data: params.poiData })
      };
      console.log('📤 Request body:', requestBody);
      
      const response = await apiRequest<{ message: string }>('/pois/favourites', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      console.log('✅ Add to favorites response:', response);
      return response;
    },
    onSuccess: () => {
      console.log('✅ Add to favorites successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
    onError: (error) => {
      console.error('❌ Add to favorites failed:', error);
    },
  }));
};

export const useRemoveFromFavoritesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: async (poiId: string) => {
      console.log('🔄 Removing POI from favorites:', poiId);
      const response = await apiRequest<{ message: string }>('/pois/favourites', {
        method: 'DELETE',
        body: JSON.stringify({ poi_id: poiId }),
      });
      console.log('✅ Remove from favorites response:', response);
      return response;
    },
    // Temporarily disable optimistic updates to debug
    // onMutate: async (poiId) => {
    //   console.log('🔄 Optimistically removing POI:', poiId);
    //   // Optimistically remove from favorites
    //   await queryClient.cancelQueries({ queryKey: queryKeys.favorites });
    //   const previousFavorites = queryClient.getQueryData(queryKeys.favorites);

    //   queryClient.setQueryData(queryKeys.favorites, (old: POI[] = []) =>
    //     old.filter(poi => poi.id !== poiId)
    //   );

    //   return { previousFavorites };
    // },
    onError: (err, poiId, context) => {
      console.error('❌ Remove from favorites failed:', err);
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKeys.favorites, context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
  }));
};

export const usePOIDetails = (poiId: string) => {
  return useQuery(() => ({
    queryKey: queryKeys.poiDetails(poiId),
    queryFn: () => apiRequest<POI>(`/llm/prompt-response/poi/details?poi_id=${poiId}`),
    enabled: !!poiId,
    staleTime: 30 * 60 * 1000, // POI details don't change often
  }));
};

export const getNearbyPOIs = async (
  lat: number,
  lon: number,
  radiusMeters: number,
  //filters?: { city?: string; category?: string; price_range?: string }
): Promise<POIDetailedInfo[]> => {
  // Use URLSearchParams for safe and easy query string construction
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    distance: radiusMeters.toString(),
  });

  // Add optional filter parameters
  // if (filters?.city && filters.city !== 'all') {
  //   params.append('city', filters.city);
  // }
  // if (filters?.category && filters.category !== 'all') {
  //   params.append('category', filters.category);
  // }
  // if (filters?.price_range && filters.price_range !== 'all') {
  //   params.append('price_range', filters.price_range);
  // }

  // The endpoint path should match your router
  const response = await apiRequest<{ points_of_interest: POIDetailedInfo[] }>(
    `/pois/nearby?${params.toString()}`,
    { method: 'GET' }
  );

  return response.points_of_interest || [];
};

// Your TanStack Query hook that uses the function above
export function useNearbyPOIs(
  latFn: () => number,
  lonFn: () => number,
  radiusFn: () => number,
  //filtersFn: () => Record<string, unknown>
) {
  return createResource(
    () => {
      const lat = latFn();
      const lon = lonFn();
      const radiusMeters = radiusFn();
      // Skip fetching if parameters are invalid (mimics enabled: !!(lat && lon && radiusMeters > 0))
      if (!lat || !lon || radiusMeters <= 0) {
        return null;
      }
      //const filters = filtersFn();
      // Serialize filters to detect content changes, use 'no-filters' if undefined
      //const filtersKey = filters ? JSON.stringify(filters) : 'no-filters';
      return [lat, lon, radiusMeters];
    },
    async ([lat, lon, radiusMeters]: [number, number, number]) => {
      // Parse filters back to an object, or undefined if not present
      //const filters = filtersKey !== 'no-filters' ? JSON.parse(filtersKey) : undefined;
      // console.log('🔍 Fetching nearby POIs:', { lat, lon, radiusMeters, filters });
      return getNearbyPOIs(lat, lon, radiusMeters);
    }
  );
}

export const useSearchPOIs = (query: string, filters?: any) => {
  return useQuery(() => ({
    queryKey: queryKeys.searchPois(query, filters),
    queryFn: () => {
      const params = new URLSearchParams({ q: query, ...filters });
      return apiRequest<POI[]>(`/pois/search?${params}`);
    },
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  }));
};