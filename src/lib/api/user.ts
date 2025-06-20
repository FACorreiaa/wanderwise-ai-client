// User profile queries and mutations
import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { apiRequest, queryKeys } from './shared';
import type { UserProfile, UserProfileResponse } from './types';

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

export const useUserProfileQuery = () => {
  return useQuery(() => ({
    queryKey: ['userProfile'],
    queryFn: () => apiRequest<UserProfileResponse>('/user/profile'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  }));
}

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (profileData: Partial<UserProfile>) =>
      apiRequest<UserProfile>('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
    onSuccess: (updatedProfile) => {
      // Optimistically update the default profile query
      queryClient.setQueryData(queryKeys.defaultProfile, updatedProfile);
      queryClient.setQueryData(queryKeys.profiles, (old: UserProfile[] = []) =>
        old.map(profile => profile.is_default ? updatedProfile : profile)
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

// useSetDefaultProfileMutation is exported from profiles.ts

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      return fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        return response.json();
      });
    },
    onSuccess: (result) => {
      // Update the default profile with new avatar
      queryClient.setQueryData(queryKeys.defaultProfile, (old: UserProfile) =>
        old ? { ...old, avatar: result.avatar_url } : old
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.defaultProfile });
    },
  }));
};