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

// Query to get all user's saved itineraries (for bookmark checking)
export const useAllUserItineraries = (options: { enabled?: boolean } = {}) => {
  return useQuery(() => ({
    queryKey: ['user-itineraries'],
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
      // Invalidate both queries to ensure immediate UI updates
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      queryClient.invalidateQueries({ queryKey: ['user-itineraries'] });
    },
  }));
};

export const useRemoveItineraryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: (itineraryId: string) =>
      apiRequest<{ message: string }>(`/llm/prompt-response/bookmark/${itineraryId}`, { method: 'DELETE' }),
    onSuccess: () => {
      // Invalidate both queries to ensure immediate UI updates
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      queryClient.invalidateQueries({ queryKey: ['user-itineraries'] });
    },
  }));
};