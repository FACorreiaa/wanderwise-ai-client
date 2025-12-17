// POI and favorites queries and mutations - Using RPC (REST removed)
import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { createClient } from '@connectrpc/connect';
import { FavoritesService } from '@buf/loci_loci-proto.bufbuild_es/loci/favorites/v1/favorites_pb.js';
import { transport } from '../connect-transport';
import { queryKeys } from './shared';
import type { POI, POIDetailedInfo } from './types';

const favoritesClient = createClient(FavoritesService, transport);

// ===============
// POI QUERIES - RPC
// ===============

export const useFavorites = () => {
  return useQuery(() => ({
    queryKey: queryKeys.favorites,
    queryFn: async (): Promise<POIDetailedInfo[]> => {
      console.log('🔄 Fetching user favorites via RPC...');
      try {
        const response = await favoritesClient.getFavorites({});
        const favorites = (response.favorites || []).map((f) => ({
          id: f.itemId || '',
          name: f.itemName || 'Unknown POI',
          description: f.description || '',
          latitude: f.latitude || 0,
          longitude: f.longitude || 0,
          category: f.category || '',
          rating: f.rating || 0,
          address: '',
          city: f.cityName || '',
          imageUrl: '',
        })) as POIDetailedInfo[];
        console.log('✅ Favorites fetched via RPC:', favorites.length);
        return favorites;
      } catch (error) {
        console.error('❌ Failed to fetch favorites via RPC:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  }));
};

export const useAddToFavoritesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: async (params: { poiId: string; poiData?: POIDetailedInfo }) => {
      console.log('🔄 Adding POI to favorites via RPC:', params);
      try {
        await favoritesClient.addToFavorites({
          itemId: params.poiId,
          itemName: params.poiData?.name || '',
          description: params.poiData?.description || '',
          cityName: params.poiData?.city || '',
          latitude: params.poiData?.latitude || 0,
          longitude: params.poiData?.longitude || 0,
          rating: params.poiData?.rating || 0,
          category: params.poiData?.category || '',
        });
        console.log('✅ Added to favorites via RPC');
        return { message: 'Added to favorites' };
      } catch (error) {
        console.error('❌ Add to favorites failed:', error);
        throw error;
      }
    },
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites });
      const previousFavorites = queryClient.getQueryData(queryKeys.favorites);
      queryClient.setQueryData(queryKeys.favorites, (old: POI[] | undefined) => {
        const currentFavorites = old || [];
        const newPOI = params.poiData || { id: params.poiId, name: 'POI' } as POI;
        return [...currentFavorites, newPOI];
      });
      return { previousFavorites };
    },
    onError: (error, params, context) => {
      console.error('❌ Add to favorites failed:', error);
      queryClient.setQueryData(queryKeys.favorites, context?.previousFavorites);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
  }));
};

export const useRemoveFromFavoritesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: async (params: { poiId: string; poiData?: POIDetailedInfo }) => {
      console.log('🔄 Removing POI from favorites via RPC:', params);
      try {
        await favoritesClient.removeFromFavorites({
          itemId: params.poiId,
        });
        console.log('✅ Removed from favorites via RPC');
        return { message: 'Removed from favorites' };
      } catch (error) {
        console.error('❌ Remove from favorites failed:', error);
        throw error;
      }
    },
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites });
      const previousFavorites = queryClient.getQueryData(queryKeys.favorites);
      queryClient.setQueryData(queryKeys.favorites, (old: POI[] | undefined) => {
        const currentFavorites = old || [];
        return currentFavorites.filter(poi => poi.id !== params.poiId);
      });
      return { previousFavorites };
    },
    onError: (err, params, context) => {
      console.error('❌ Remove from favorites failed:', err);
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKeys.favorites, context.previousFavorites);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
  }));
};

export const usePOIDetails = (poiId: string) => {
  return useQuery(() => ({
    queryKey: queryKeys.poiDetails(poiId),
    queryFn: async (): Promise<POI | null> => {
      console.warn('⚠️ usePOIDetails: REST API removed - needs RPC implementation');
      // TODO: Implement via a dedicated POI details RPC
      return null;
    },
    enabled: !!poiId,
    staleTime: 30 * 60 * 1000,
  }));
};

export const useNearbyPOIs = () => {
  // STUB - Nearby POIs requires RPC implementation
  console.warn('⚠️ useNearbyPOIs: REST API removed - needs RPC implementation');
  return [() => [], { loading: false, error: null }] as const;
};

export const useSearchPOIs = (query: string, filters?: any) => {
  return useQuery(() => ({
    queryKey: queryKeys.searchPois(query, filters),
    queryFn: async (): Promise<POI[]> => {
      console.warn('⚠️ useSearchPOIs: REST API removed - needs RPC implementation');
      // TODO: Implement via a dedicated POI search RPC
      return [];
    },
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  }));
};
