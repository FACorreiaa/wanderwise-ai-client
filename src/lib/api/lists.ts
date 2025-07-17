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
        old.map(list => list.ID === listId ? updatedList : list)
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
        old.filter(list => list.ID !== listId)
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

// ===============
// LIST ITEMS MUTATIONS
// ===============

export interface AddToListItemData {
  item_id: string;
  content_type: 'poi' | 'restaurant' | 'hotel' | 'itinerary';
  position?: number;
  notes?: string;
  day_number?: number;
  time_slot?: string;
  duration_minutes?: number;
  source_llm_interaction_id?: string;
  item_ai_description?: string;
}

export interface AddToListMutationData {
  listId: string;
  itemData: AddToListItemData;
}

export const useAddToListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ listId, itemData }: AddToListMutationData) =>
      apiRequest(`/itineraries/lists/${listId}/items`, {
        method: 'POST',
        body: JSON.stringify(itemData),
      }),
    onSuccess: (_, { listId }) => {
      // Invalidate the specific list to refresh its items
      queryClient.invalidateQueries({ queryKey: queryKeys.list(listId) });
      // Also invalidate the lists overview to update item counts
      queryClient.invalidateQueries({ queryKey: queryKeys.lists });
    },
  }));
};

export const useRemoveFromListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ listId, itemId }: { listId: string; itemId: string }) =>
      apiRequest(`/itineraries/lists/${listId}/items/${itemId}`, { method: 'DELETE' }),
    onSuccess: (_, { listId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.list(listId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists });
    },
  }));
};

export const useUpdateListItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ listId, itemId, itemData }: { listId: string; itemId: string; itemData: Partial<AddToListItemData> }) =>
      apiRequest(`/itineraries/lists/${listId}/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify(itemData),
      }),
    onSuccess: (_, { listId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.list(listId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists });
    },
  }));
};

// ===============
// SAVED LISTS QUERIES
// ===============

export const useSavedLists = () => {
  return useQuery(() => ({
    queryKey: queryKeys.savedLists,
    queryFn: () => apiRequest<ItineraryList[]>('/itineraries/lists/saved'),
    staleTime: 5 * 60 * 1000,
  }));
};

export const useSaveListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (listId: string) =>
      apiRequest(`/itineraries/lists/${listId}/save`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savedLists });
    },
  }));
};

export const useUnsaveListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (listId: string) =>
      apiRequest(`/itineraries/lists/${listId}/save`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savedLists });
    },
  }));
};

// ===============
// SEARCH LISTS QUERIES
// ===============

export const useSearchLists = (searchTerm?: string, cityId?: string, contentType?: string) => {
  return useQuery(() => ({
    queryKey: queryKeys.searchLists(searchTerm, cityId, contentType),
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (cityId) params.append('city_id', cityId);
      if (contentType) params.append('content_type', contentType);
      
      return apiRequest<ItineraryList[]>(`/itineraries/lists/search?${params.toString()}`);
    },
    enabled: !!searchTerm || !!cityId || !!contentType,
    staleTime: 2 * 60 * 1000,
  }));
};