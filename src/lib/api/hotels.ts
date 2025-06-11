// Hotels queries
import { useQuery } from '@tanstack/solid-query';
import { apiRequest, queryKeys } from './shared';
import type { Hotel } from './types';

// =================
// HOTELS QUERIES
// =================

export const useHotelsByPreferences = (preferences: any) => {
  return useQuery(() => ({
    queryKey: queryKeys.hotelsByPreferences(preferences),
    queryFn: () =>
      apiRequest<Hotel[]>('/llm/prompt-response/city/hotel/preferences', {
        method: 'POST',
        body: JSON.stringify(preferences),
      }),
    enabled: !!preferences,
    staleTime: 10 * 60 * 1000,
  }));
};

export const useNearbyHotels = (lat: number, lng: number, radius?: number) => {
  return useQuery(() => ({
    queryKey: queryKeys.nearbyHotels(lat, lng, radius),
    queryFn: () => {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        ...(radius && { radius: radius.toString() }),
      });
      return apiRequest<Hotel[]>(`/llm/prompt-response/city/hotel/nearby?${params}`);
    },
    enabled: !!(lat && lng),
    staleTime: 15 * 60 * 1000,
  }));
};

export const useHotelDetails = (hotelId: string) => {
  return useQuery(() => ({
    queryKey: queryKeys.hotelDetails(hotelId),
    queryFn: () => apiRequest<Hotel>(`/llm/prompt-response/city/hotel/${hotelId}`),
    enabled: !!hotelId,
    staleTime: 30 * 60 * 1000,
  }));
};