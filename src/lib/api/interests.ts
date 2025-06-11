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
    queryFn: () => apiRequest<Interest[]>('/user/interests/'),
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
    mutationFn: ({ interestId, data }: { interestId: string; data: Partial<Interest> }) =>
      apiRequest<Interest>(`/user/interests/${interestId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: (updatedInterest, { interestId }) => {
      queryClient.setQueryData(queryKeys.interests, (old: Interest[] = []) =>
        old.map(interest => interest.id === interestId ? updatedInterest : interest)
      );
    },
  }));
};

export const useDeleteInterestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (interestId: string) =>
      apiRequest<{ message: string }>(`/user/interests/${interestId}`, { method: 'DELETE' }),
    onSuccess: (_, interestId) => {
      queryClient.setQueryData(queryKeys.interests, (old: Interest[] = []) =>
        old.filter(interest => interest.id !== interestId)
      );
    },
  }));
};