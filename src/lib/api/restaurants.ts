// Restaurants queries
import { useQuery } from '@tanstack/solid-query';
import { apiRequest, queryKeys } from './shared';
import type { Restaurant } from './types';

// =====================
// RESTAURANTS QUERIES
// =====================

export const useRestaurantsByPreferences = (preferences: any) => {
  return useQuery(() => ({
    queryKey: queryKeys.restaurantsByPreferences(preferences),
    queryFn: () =>
      apiRequest<Restaurant[]>('/llm/prompt-response/city/restaurants/preferences', {
        method: 'POST',
        body: JSON.stringify(preferences),
      }),
    enabled: !!preferences,
    staleTime: 10 * 60 * 1000,
  }));
};

export const useNearbyRestaurants = (lat: number, lng: number, radius?: number) => {
  return useQuery(() => ({
    queryKey: queryKeys.nearbyRestaurants(lat, lng, radius),
    queryFn: () => {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        ...(radius && { radius: radius.toString() }),
      });
      return apiRequest<Restaurant[]>(`/llm/prompt-response/city/restaurants/nearby?${params}`);
    },
    enabled: !!(lat && lng),
    staleTime: 15 * 60 * 1000,
  }));
};

export const useRestaurantDetails = (restaurantId: string) => {
  return useQuery(() => ({
    queryKey: queryKeys.restaurantDetails(restaurantId),
    queryFn: () => apiRequest<Restaurant>(`/llm/prompt-response/city/restaurants/${restaurantId}`),
    enabled: !!restaurantId,
    staleTime: 30 * 60 * 1000,
  }));
};