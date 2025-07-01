// Search Profile queries and mutations
import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { apiRequest, queryKeys } from './shared';
import type { SearchProfile, TravelProfileFormData, AccommodationPreferences, DiningPreferences, ActivityPreferences, ItineraryPreferences } from './types';

// ==================
// SEARCH PROFILE QUERIES
// ==================

// Get all search profiles for the user
export const useSearchProfiles = () => {
  return useQuery(() => ({
    queryKey: queryKeys.profiles,
    queryFn: () => apiRequest<SearchProfile[]>('/user/search-profile'),
    staleTime: 10 * 60 * 1000,
  }));
};

// Get a specific search profile
export const useSearchProfile = (profileId: string) => {
  return useQuery(() => ({
    queryKey: queryKeys.profile(profileId),
    queryFn: () => apiRequest<SearchProfile>(`/user/search-profile/${profileId}`),
    enabled: !!profileId,
    staleTime: 10 * 60 * 1000,
  }));
};

// Get the default search profile (supports guest users)
export const useDefaultSearchProfile = () => {
  return useQuery(() => ({
    queryKey: queryKeys.defaultProfile,
    queryFn: async () => {
      // Check if user is authenticated
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      if (!token) {
        // Return a default guest profile
        return {
          id: 'guest',
          profile_name: 'Guest Profile',
          is_default: true,
          search_radius_km: 10.0,
          preferred_time: 'any',
          budget_level: 3,
          preferred_pace: 'moderate',
          prefer_accessible_pois: false,
          prefer_outdoor_seating: false,
          prefer_dog_friendly: false,
          preferred_vibes: [],
          preferred_transport: 'any',
          dietary_needs: [],
          interests: [],
          tags: [],
          user_latitude: null,
          user_longitude: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as SearchProfile;
      }
      
      // Authenticated user - fetch from API
      return apiRequest<SearchProfile>('/user/search-profile/default');
    },
    staleTime: 10 * 60 * 1000,
  }));
};

// ==================
// DOMAIN-SPECIFIC PREFERENCE QUERIES
// ==================

// Get accommodation preferences for a profile
export const useAccommodationPreferences = (profileId: string) => {
  return useQuery(() => ({
    queryKey: ['profiles', profileId, 'accommodation'],
    queryFn: () => apiRequest<AccommodationPreferences>(`/user/search-profile/${profileId}/accommodation`),
    enabled: !!profileId,
    staleTime: 10 * 60 * 1000,
  }));
};

// Get dining preferences for a profile
export const useDiningPreferences = (profileId: string) => {
  return useQuery(() => ({
    queryKey: ['profiles', profileId, 'dining'],
    queryFn: () => apiRequest<DiningPreferences>(`/user/search-profile/${profileId}/dining`),
    enabled: !!profileId,
    staleTime: 10 * 60 * 1000,
  }));
};

// Get activity preferences for a profile 
export const useActivityPreferences = (profileId: string) => {
  return useQuery(() => ({
    queryKey: ['profiles', profileId, 'activities'],
    queryFn: () => apiRequest<ActivityPreferences>(`/user/search-profile/${profileId}/activities`),
    enabled: !!profileId,
    staleTime: 10 * 60 * 1000,
  }));
};

// Get itinerary preferences for a profile
export const useItineraryPreferences = (profileId: string) => {
  return useQuery(() => ({
    queryKey: ['profiles', profileId, 'itinerary'],
    queryFn: () => apiRequest<ItineraryPreferences>(`/user/search-profile/${profileId}/itinerary`),
    enabled: !!profileId,
    staleTime: 10 * 60 * 1000,
  }));
};

// Get combined filters for a domain
export const useCombinedFilters = (profileId: string, domain?: string) => {
  return useQuery(() => ({
    queryKey: ['profiles', profileId, 'filters', domain || 'general'],
    queryFn: () => apiRequest<any>(`/user/search-profile/${profileId}/filters${domain ? `?domain=${domain}` : ''}`),
    enabled: !!profileId,
    staleTime: 10 * 60 * 1000,
  }));
};

// ==================
// SEARCH PROFILE MUTATIONS
// ==================

// Create a new search profile
export const useCreateSearchProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (data: Partial<TravelProfileFormData>) =>
      apiRequest<SearchProfile>('/user/search-profile', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles });
      queryClient.invalidateQueries({ queryKey: queryKeys.defaultProfile });
    },
  }));
};

// Update a search profile
export const useUpdateSearchProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ profileId, data }: { profileId: string; data: Partial<TravelProfileFormData> }) =>
      apiRequest<SearchProfile>(`/user/search-profile/${profileId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile(profileId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles });
      queryClient.invalidateQueries({ queryKey: queryKeys.defaultProfile });
    },
  }));
};

// Delete a search profile
export const useDeleteSearchProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (profileId: string) =>
      apiRequest(`/user/search-profile/${profileId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles });
      queryClient.invalidateQueries({ queryKey: queryKeys.defaultProfile });
    },
  }));
};

// Set a search profile as default
export const useSetDefaultProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (profileId: string) =>
      apiRequest(`/user/search-profile/default/${profileId}`, {
        method: 'PUT',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles });
      queryClient.invalidateQueries({ queryKey: queryKeys.defaultProfile });
    },
  }));
};

// ==================
// DOMAIN-SPECIFIC PREFERENCE MUTATIONS
// ==================

// Domain-specific preferences are now included in the main profile update endpoint