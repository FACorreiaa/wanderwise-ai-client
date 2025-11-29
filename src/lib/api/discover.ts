import { createQuery } from '@tanstack/solid-query';
import { apiRequest } from './shared';
import type {
  DiscoverPageData,
  TrendingDiscovery,
  FeaturedCollection,
  ChatSession,
  DiscoverResult,
  ApiResponse
} from './types';

// Get all discover page data
export function useDiscoverPageData(limit = 5) {
  return createQuery(() => ({
    queryKey: ['discover', 'page', limit],
    queryFn: async (): Promise<DiscoverPageData> => {
      const result = await apiRequest<ApiResponse<DiscoverPageData> | DiscoverPageData>(`/discover?limit=${limit}`);
      if ((result as ApiResponse<DiscoverPageData>).data) {
        return (result as ApiResponse<DiscoverPageData>).data as DiscoverPageData;
      }
      return result as DiscoverPageData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  }));
}

// Get trending discoveries
export function useTrendingDiscoveries(limit = 5) {
  return createQuery(() => ({
    queryKey: ['discover', 'trending', limit],
    queryFn: async (): Promise<TrendingDiscovery[]> => {
      const result = await apiRequest<ApiResponse<{ trending: TrendingDiscovery[] }> | { trending: TrendingDiscovery[] }>(
        `/discover/trending?limit=${limit}`
      );
      if ((result as ApiResponse<{ trending: TrendingDiscovery[] }>).data) {
        return (result as ApiResponse<{ trending: TrendingDiscovery[] }>).data.trending;
      }
      return (result as { trending: TrendingDiscovery[] }).trending;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  }));
}

// Get featured collections
export function useFeaturedCollections(limit = 4) {
  return createQuery(() => ({
    queryKey: ['discover', 'featured', limit],
    queryFn: async (): Promise<FeaturedCollection[]> => {
      const result = await apiRequest<ApiResponse<{ featured: FeaturedCollection[] }> | { featured: FeaturedCollection[] }>(
        `/discover/featured?limit=${limit}`
      );
      if ((result as ApiResponse<{ featured: FeaturedCollection[] }>).data) {
        return (result as ApiResponse<{ featured: FeaturedCollection[] }>).data.featured;
      }
      return (result as { featured: FeaturedCollection[] }).featured;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  }));
}

// Get recent discoveries
export function useRecentDiscoveries(limit = 6) {
  return createQuery(() => ({
    queryKey: ['discover', 'recent', limit],
    queryFn: async (): Promise<ChatSession[]> => {
      const result = await apiRequest<ApiResponse<{ sessions: ChatSession[] }> | { sessions: ChatSession[] }>(
        `/discover/recent?limit=${limit}`
      );
      if ((result as ApiResponse<{ sessions: ChatSession[] }>).data) {
        return (result as ApiResponse<{ sessions: ChatSession[] }>).data.sessions;
      }
      return (result as { sessions: ChatSession[] }).sessions;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  }));
}

// Get category results
export function useCategoryResults(category: string) {
  return createQuery(() => ({
    queryKey: ['discover', 'category', category],
    queryFn: async (): Promise<DiscoverResult[]> => {
      const result = await apiRequest<ApiResponse<{ category: string; results: DiscoverResult[] }>>(
        `/discover/category/${category}`
      );
      return result.data.results;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!category, // Only run if category is provided
  }));
}
