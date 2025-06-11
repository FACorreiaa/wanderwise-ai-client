// Settings queries and mutations
import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { apiRequest, queryKeys } from './shared';

// ==================
// SETTINGS QUERIES
// ==================

export const useSettings = () => {
  return useQuery(() => ({
    queryKey: queryKeys.settings,
    queryFn: () => apiRequest<any>('/user/preferences/'),
    staleTime: 10 * 60 * 1000,
  }));
};

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ profileId, settings }: { profileId: string; settings: any }) =>
      apiRequest<any>(`/user/preferences/${profileId}`, {
        method: 'PUT',
        body: JSON.stringify(settings),
      }),
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userSettings(profileId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
  }));
};