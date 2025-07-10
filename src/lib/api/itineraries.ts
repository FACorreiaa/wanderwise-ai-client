// Itineraries queries and mutations
import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { apiRequest, queryKeys } from './shared';
import type { UserSavedItinerary, PaginatedItinerariesResponse, BookmarkRequest } from './types';

// ====================
// ITINERARY QUERIES
// ====================

export const useItineraries = (page: number = 1, limit: number = 10, options: { enabled?: boolean } = {}) => {
  return useQuery(() => ({
    queryKey: queryKeys.itineraries(page, limit),
    queryFn: () => apiRequest<PaginatedItinerariesResponse>(`/pois/itineraries?page=${page}&limit=${limit}`),
    staleTime: 5 * 60 * 1000,
    enabled: options.enabled ?? true,
  }));
};

// ====================
// BOOKMARK QUERIES
// ====================

export const useBookmarkedItineraries = (pageFn: () => number, limitFn: () => number, options: { enabled?: boolean } = {}) => {
  return useQuery(() => ({
    queryKey: queryKeys.bookmarkedItineraries(pageFn(), limitFn()),
    queryFn: () => {
      const page = pageFn();
      const limit = limitFn();
      return apiRequest<PaginatedItinerariesResponse>(`/llm/prompt-response/bookmarks?page=${page}&limit=${limit}`);
    },
    staleTime: 5 * 60 * 1000,
    enabled: options.enabled ?? true,
  }));
};

// Query to get all user's saved itineraries (for bookmark checking)
export const useAllUserItineraries = (options: { enabled?: boolean } = {}) => {
  return useQuery(() => ({
    queryKey: queryKeys.userItineraries,
    queryFn: () => apiRequest<PaginatedItinerariesResponse>(`/pois/itineraries?page=1&limit=1000`), // Get all itineraries
    staleTime: 2 * 60 * 1000, // Shorter stale time for bookmark checks
    enabled: options.enabled ?? true,
  }));
};

export const useItinerary = (itineraryId: string, options: { enabled?: boolean } = {}) => {
  return useQuery(() => ({
    queryKey: queryKeys.itinerary(itineraryId),
    queryFn: () => apiRequest<UserSavedItinerary>(`/pois/itineraries/itinerary/${itineraryId}`),
    enabled: (options.enabled ?? true) && !!itineraryId,
  }));
};

export const useUpdateItineraryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ itineraryId, data }: { itineraryId: string; data: any }) =>
      apiRequest<UserSavedItinerary>(`/pois/itineraries/itinerary/${itineraryId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: (updatedItinerary, { itineraryId }) => {
      queryClient.setQueryData(queryKeys.itinerary(itineraryId), updatedItinerary);
      queryClient.invalidateQueries({ queryKey: ['itineraries'] }); // Invalidate paginated lists
    },
  }));
};

// ==================
// BOOKMARK QUERIES
// ==================

export const useSaveItineraryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (itineraryData: BookmarkRequest) =>
      apiRequest<UserSavedItinerary>('/llm/prompt-response/bookmark', {
        method: 'POST',
        body: JSON.stringify(itineraryData),
      }),
    onSuccess: () => {
      // Invalidate all itinerary-related queries to ensure immediate UI updates
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.userItineraries });
      queryClient.invalidateQueries({ queryKey: ['bookmarked-itineraries'] });
    },
  }));
};

export const useRemoveItineraryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (itineraryId: string) =>
      apiRequest<{ message: string }>(`/llm/prompt-response/bookmark/${itineraryId}`, { method: 'DELETE' }),
    onMutate: async (itineraryId: string) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: queryKeys.userItineraries });

      // Snapshot the previous value
      const previousItineraries = queryClient.getQueryData(queryKeys.userItineraries);

      // Optimistically update to remove the itinerary
      queryClient.setQueryData(queryKeys.userItineraries, (old: any) => {
        if (!old?.itineraries) return old;
        return {
          ...old,
          itineraries: old.itineraries.filter((itinerary: any) => itinerary.id !== itineraryId)
        };
      });

      // Return a context object with the snapshotted value
      return { previousItineraries };
    },
    onError: (err, itineraryId, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousItineraries) {
        queryClient.setQueryData(queryKeys.userItineraries, context.previousItineraries);
      }
    },
    onSuccess: () => {
      // Invalidate all itinerary-related queries to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.userItineraries });
      queryClient.invalidateQueries({ queryKey: ['bookmarked-itineraries'] });
    },
  }));
};