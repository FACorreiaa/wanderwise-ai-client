// Settings queries and mutations - STUB (REST removed, awaiting RPC implementation)
import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { queryKeys } from './shared';

// ==================
// SETTINGS QUERIES - STUB
// ==================

export const useSettings = () => {
  return useQuery(() => ({
    queryKey: queryKeys.settings,
    queryFn: async () => {
      console.warn('⚠️ useSettings: REST API removed - needs RPC implementation');
      return {}; // Return empty settings until RPC is implemented
    },
    staleTime: 10 * 60 * 1000,
  }));
};

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: async ({ profileId, settings }: { profileId: string; settings: any }) => {
      console.warn('⚠️ useUpdateSettingsMutation: REST API removed - needs RPC implementation');
      // TODO: Implement via ProfileService.UpdateUserPreferenceProfile
      return { success: false, message: 'Not implemented' };
    },
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userSettings(profileId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
  }));
};