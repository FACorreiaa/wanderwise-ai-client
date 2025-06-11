// Lists queries and mutations
import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { apiRequest, queryKeys } from './shared';
import type { ItineraryList } from './types';

// ===============
// LISTS QUERIES
// ===============

export const useLists = () => {
  return useQuery(() => ({
    queryKey: queryKeys.lists,
    queryFn: () => apiRequest<ItineraryList[]>('/itineraries/lists'),
    staleTime: 5 * 60 * 1000,
  }));
};

export const useList = (listId: string) => {
  return useQuery(() => ({
    queryKey: queryKeys.list(listId),
    queryFn: () => apiRequest<ItineraryList>(`/itineraries/lists/${listId}`),
    enabled: !!listId,
  }));
};

export const useCreateListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (listData: Partial<ItineraryList>) =>
      apiRequest<ItineraryList>('/itineraries/lists', {
        method: 'POST',
        body: JSON.stringify(listData),
      }),
    onSuccess: (newList) => {
      queryClient.setQueryData(queryKeys.lists, (old: ItineraryList[] = []) => [...old, newList]);
    },
  }));
};

export const useUpdateListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ listId, listData }: { listId: string; listData: Partial<ItineraryList> }) =>
      apiRequest<ItineraryList>(`/itineraries/lists/${listId}`, {
        method: 'PUT',
        body: JSON.stringify(listData),
      }),
    onSuccess: (updatedList, { listId }) => {
      queryClient.setQueryData(queryKeys.list(listId), updatedList);
      queryClient.setQueryData(queryKeys.lists, (old: ItineraryList[] = []) =>
        old.map(list => list.id === listId ? updatedList : list)
      );
    },
  }));
};

export const useDeleteListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (listId: string) =>
      apiRequest<{ message: string }>(`/itineraries/lists/${listId}`, { method: 'DELETE' }),
    onMutate: async (listId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.lists });
      const previousLists = queryClient.getQueryData(queryKeys.lists);

      queryClient.setQueryData(queryKeys.lists, (old: ItineraryList[] = []) =>
        old.filter(list => list.id !== listId)
      );

      return { previousLists };
    },
    onError: (err, listId, context) => {
      if (context?.previousLists) {
        queryClient.setQueryData(queryKeys.lists, context.previousLists);
      }
    },
    onSettled: (_, __, listId) => {
      queryClient.removeQueries({ queryKey: queryKeys.list(listId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists });
    },
  }));
};