// Search Profile queries and mutations
import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { createClient } from '@connectrpc/connect';
import { create } from '@bufbuild/protobuf';
import { ProfileService, GetUserPreferenceProfilesRequestSchema } from '@buf/loci_loci-proto.bufbuild_es/proto/profile_pb.js';
import { transport } from '../connect-transport';
import { apiRequest, queryKeys } from './shared';
import { getAuthToken } from '../api';
import type { SearchProfile, TravelProfileFormData, AccommodationPreferences, DiningPreferences, ActivityPreferences, ItineraryPreferences } from './types';

const profileClient = createClient(ProfileService, transport);

const mapProtoToSearchProfile = (profile: any): SearchProfile => ({
  id: profile.id,
  user_id: profile.userId,
  profile_name: profile.profileName,
  is_default: profile.isDefault ?? false,
  search_radius_km: profile.searchRadiusKm ?? 0,
  preferred_time: profile.preferredTime ?? 'DAY_PREFERENCE_ANY',
  budget_level: profile.budgetLevel ?? 0,
  preferred_pace: profile.preferredPace ?? 'SEARCH_PACE_ANY',
  prefer_accessible_pois: false,
  prefer_outdoor_seating: false,
  prefer_dog_friendly: false,
  preferred_vibes: [],
  preferred_transport: profile.preferredTransport ?? 'TRANSPORT_PREFERENCE_ANY',
  dietary_needs: [],
  interests: null,
  tags: null,
  user_latitude: null,
  user_longitude: null,
  created_at: profile.createdAt ?? '',
  updated_at: profile.updatedAt ?? '',
});

export const fetchPreferenceProfilesRPC = async (): Promise<SearchProfile[]> => {
  const request = create(GetUserPreferenceProfilesRequestSchema, {});
  const response = await profileClient.getUserPreferenceProfiles(request);
  return (response.profiles || []).map(mapProtoToSearchProfile);
};

// ==================
// SEARCH PROFILE QUERIES
// ==================

// Get all search profiles for the user
export const useSearchProfiles = () => {
  return useQuery(() => ({
    queryKey: queryKeys.profiles,
    queryFn: () => fetchPreferenceProfilesRPC(),
    staleTime: 10 * 60 * 1000,
    enabled: !!getAuthToken(),
  }));
};

// Get a specific search profile
export const useSearchProfile = (profileId: string) => {
  return useQuery(() => ({
    queryKey: queryKeys.profile(profileId),
    queryFn: async () => {
      const profiles = await fetchPreferenceProfilesRPC();
      return profiles.find((p) => p.id === profileId) as SearchProfile;
    },
    enabled: !!profileId && !!getAuthToken(),
    staleTime: 10 * 60 * 1000,
  }));
};

// Get the default search profile
export const useDefaultSearchProfile = () => {
  return useQuery(() => ({
    queryKey: queryKeys.defaultProfile,
    queryFn: async () => {
      const profiles = await fetchPreferenceProfilesRPC();
      return profiles.find((p) => p.is_default) || profiles[0];
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!getAuthToken(),
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
