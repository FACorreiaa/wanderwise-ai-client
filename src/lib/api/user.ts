// User profile queries and mutations
import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { apiRequest, queryKeys } from './shared';
import type { UserProfile } from './types';

// ===================
// PROFILE QUERIES
// ===================

export const useProfiles = () => {
  return useQuery(() => ({
    queryKey: queryKeys.profiles,
    queryFn: () => apiRequest<UserProfile[]>('/user/search-profile/'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  }));
};

export const useProfile = (profileId: string) => {
  return useQuery(() => ({
    queryKey: queryKeys.profile(profileId),
    queryFn: () => apiRequest<UserProfile>(`/user/search-profile/${profileId}`),
    enabled: !!profileId,
  }));
};

export const useDefaultProfile = () => {
  return useQuery(() => ({
    queryKey: queryKeys.defaultProfile,
    queryFn: () => apiRequest<UserProfile>('/user/search-profile/default'),
  }));
};

export const useCreateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (profileData: Partial<UserProfile>) =>
      apiRequest<UserProfile>('/user/search-profile/', {
        method: 'POST',
        body: JSON.stringify(profileData),
      }),
    onSuccess: (newProfile) => {
      // Optimistically update the profiles list
      queryClient.setQueryData(queryKeys.profiles, (old: UserProfile[] = []) => [...old, newProfile]);
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles });
    },
  }));
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ profileId, profileData }: { profileId: string; profileData: Partial<UserProfile> }) =>
      apiRequest<UserProfile>(`/user/search-profile/${profileId}`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
    onSuccess: (updatedProfile, { profileId }) => {
      // Optimistically update both the individual profile and profiles list
      queryClient.setQueryData(queryKeys.profile(profileId), updatedProfile);
      queryClient.setQueryData(queryKeys.profiles, (old: UserProfile[] = []) =>
        old.map(profile => profile.id === profileId ? updatedProfile : profile)
      );
    },
  }));
};

export const useDeleteProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (profileId: string) =>
      apiRequest<{ message: string }>(`/user/search-profile/${profileId}`, { method: 'DELETE' }),
    onSuccess: (_, profileId) => {
      // Optimistically remove from profiles list
      queryClient.setQueryData(queryKeys.profiles, (old: UserProfile[] = []) =>
        old.filter(profile => profile.id !== profileId)
      );
      queryClient.removeQueries({ queryKey: queryKeys.profile(profileId) });
    },
  }));
};

export const useSetDefaultProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (profileId: string) =>
      apiRequest<{ message: string }>(`/user/search-profile/default/${profileId}`, { method: 'PUT' }),
    onSuccess: (_, profileId) => {
      // Update all profiles to reflect new default
      queryClient.setQueryData(queryKeys.profiles, (old: UserProfile[] = []) =>
        old.map(profile => ({ ...profile, is_default: profile.id === profileId }))
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.defaultProfile });
    },
  }));
};