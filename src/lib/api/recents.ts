import { useQuery } from '@tanstack/solid-query';
import { apiRequest, queryKeys } from './shared';
import type { RecentInteractionsResponse, CityInteractions } from './types';

export const useRecentInteractions = (limit: number = 10) => {
  return useQuery(() => ({
    queryKey: queryKeys.recentInteractions(limit),
    queryFn: () => apiRequest<RecentInteractionsResponse>(`/recents?limit=${limit}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  }));
};

export const useCityDetails = (cityName: string) => {
  return useQuery(() => ({
    queryKey: queryKeys.cityDetails(cityName),
    queryFn: () => apiRequest<CityInteractions>(`/recents/city/${cityName}`),
    enabled: !!cityName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  }));
};
