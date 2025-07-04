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
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
    },
  }));
};

export const useRemoveItineraryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (itineraryId: string) =>
      apiRequest<{ message: string }>(`/llm/prompt-response/bookmark/${itineraryId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
    },
  }));
};