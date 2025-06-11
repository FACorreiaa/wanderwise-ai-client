// POI and favorites queries and mutations
import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { apiRequest, queryKeys } from './shared';
import type { POI } from './types';

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

export const useNearbyPOIs = (lat: number, lng: number, radius?: number) => {
  return useQuery(() => ({
    queryKey: queryKeys.nearbyPois(lat, lng, radius),
    queryFn: () => {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        ...(radius && { radius: radius.toString() }),
      });
      return apiRequest<POI[]>(`/llm/prompt-response/poi/nearby?${params}`);
    },
    enabled: !!(lat && lng),
    staleTime: 10 * 60 * 1000,
  }));
};

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