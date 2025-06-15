// Interests queries and mutations
import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { apiRequest, queryKeys } from './shared';
import type { Interest } from './types';

// ===================
// INTERESTS QUERIES
// ===================

export const useInterests = () => {
  return useQuery(() => ({
    queryKey: queryKeys.interests,
    queryFn: () => apiRequest<Interest[]>('/user/interests'),
    staleTime: 15 * 60 * 1000, // 15 minutes - interests don't change often
  }));
};

export const useCreateInterestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ name, description, active = true }: { name: string; description: string; active?: boolean }) =>
      apiRequest<Interest>('/user/interests/create', {
        method: 'POST',
        body: JSON.stringify({ name, description, active }),
      }),
    onSuccess: (newInterest) => {
      queryClient.setQueryData(queryKeys.interests, (old: Interest[] = []) => [...old, newInterest]);
    },
  }));
};

export const useUpdateInterestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ id, name, description, active }: { 
      id: string; 
      name?: string; 
      description?: string; 
      active?: boolean 
    }) => {
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (active !== undefined) updateData.active = active;

      return apiRequest(`/user/interests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    },
    onSuccess: () => {
      // API returns response object, not updated interest, so refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.interests });
    },
  }));
};

export const useToggleInterestActiveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => {
      return apiRequest(`/user/interests/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ active }),
      });
    },
    onSuccess: () => {
      // API returns response object, not updated interest, so refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.interests });
    },
  }));
};

export const useDeleteInterestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (interestId: string) =>
      apiRequest<{ message: string }>(`/user/interests/${interestId}`, { method: 'DELETE' }),
    onSuccess: (_, interestId) => {
      // Remove from interests list
      queryClient.setQueryData(queryKeys.interests, (old: Interest[] = []) =>
        old.filter(interest => interest?.id !== interestId)
      );
    },
  }));
};