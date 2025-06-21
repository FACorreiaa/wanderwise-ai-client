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
    queryFn: () => apiRequest<POI[]>('/pois/favourites'),
    staleTime: 5 * 60 * 1000,
  }));
};

export const useAddToFavoritesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (poiId: string) =>
      apiRequest<{ message: string }>('/pois/favourites', {
        method: 'POST',
        body: JSON.stringify({ poi_id: poiId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
  }));
};

export const useRemoveFromFavoritesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (poiId: string) =>
      apiRequest<{ message: string }>('/pois/favourites', {
        method: 'DELETE',
        body: JSON.stringify({ poi_id: poiId }),
      }),
    onMutate: async (poiId) => {
      // Optimistically remove from favorites
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites });
      const previousFavorites = queryClient.getQueryData(queryKeys.favorites);

      queryClient.setQueryData(queryKeys.favorites, (old: POI[] = []) =>
        old.filter(poi => poi.id !== poiId)
      );

      return { previousFavorites };
    },
    onError: (err, poiId, context) => {
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
  filters?: { city?: string; category?: string; price_range?: string }
): Promise<POIDetailedInfo[]> => {
  // Use URLSearchParams for safe and easy query string construction
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    distance: radiusMeters.toString(),
  });

  // Add optional filter parameters
  if (filters?.city && filters.city !== 'all') {
    params.append('city', filters.city);
  }
  if (filters?.category && filters.category !== 'all') {
    params.append('category', filters.category);
  }
  if (filters?.price_range && filters.price_range !== 'all') {
    params.append('price_range', filters.price_range);
  }

  // The endpoint path should match your router
  const response = await apiRequest<{ points_of_interest: POIDetailedInfo[] }>(
    `/llm/prompt-response/poi/nearby?${params.toString()}`,
    { method: 'GET' }
  );

  return response.points_of_interest || [];
};

// Your TanStack Query hook that uses the function above
export function useNearbyPOIs(
  latFn: () => number,
  lonFn: () => number,
  radiusFn: () => number,
  filtersFn: () => Record<string, unknown>
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
      const filters = filtersFn();
      // Serialize filters to detect content changes, use 'no-filters' if undefined
      const filtersKey = filters ? JSON.stringify(filters) : 'no-filters';
      return [lat, lon, radiusMeters, filtersKey];
    },
    async ([lat, lon, radiusMeters, filtersKey]: [number, number, number, string]) => {
      // Parse filters back to an object, or undefined if not present
      const filters = filtersKey !== 'no-filters' ? JSON.parse(filtersKey) : undefined;
      console.log('🔍 Fetching nearby POIs:', { lat, lon, radiusMeters, filters });
      return getNearbyPOIs(lat, lon, radiusMeters, filters);
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