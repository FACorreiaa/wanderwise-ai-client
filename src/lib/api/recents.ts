import { useQuery } from "@tanstack/solid-query";
import { apiRequest } from "./shared";
import type { RecentInteractionsResponse, CityInteractions } from "./types";

export interface RecentInteractionsFilter {
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  minInteractions?: number;
  maxInteractions?: number;
}

export const queryKeys = {
  all: ["recents"] as const,
  lists: () => [...queryKeys.all, "list"] as const,
  list: (page: number, limit: number, filter: RecentInteractionsFilter) =>
    [...queryKeys.lists(), { page, limit, filter }] as const,
  details: () => [...queryKeys.all, "detail"] as const,
  detail: (cityName: string) => [...queryKeys.details(), cityName] as const,
};

// Updated fetcher function to include filters
const fetchRecentInteractions = async (
  page: number,
  limit: number,
  filter: RecentInteractionsFilter = {},
): Promise<RecentInteractionsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filter.sortBy) params.append('sort_by', filter.sortBy);
  if (filter.sortOrder) params.append('sort_order', filter.sortOrder);
  if (filter.search && filter.search.trim() !== '') params.append('search', filter.search);
  if (filter.minInteractions !== undefined) params.append('min_interactions', filter.minInteractions.toString());
  if (filter.maxInteractions !== undefined) params.append('max_interactions', filter.maxInteractions.toString());

  const url = `/recents?${params.toString()}`;
  
  return apiRequest<RecentInteractionsResponse>(url);
};

// accepts signals directly for reactivity.
export const useRecentInteractions = (
  page: () => number, // Accept a signal/accessor for the page
  limit: () => number, // Accept a signal/accessor for the limit
  filter: () => RecentInteractionsFilter = () => ({}), // Accept a signal/accessor for the filter
) => {
  const queryResult = useQuery(() => ({
    queryKey: queryKeys.list(page(), limit(), filter()), // The key now directly depends on the signals
    queryFn: () => fetchRecentInteractions(page(), limit(), filter()),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Excellent choice for pagination UX
  }));

  return queryResult;
};

export const useCityDetails = (cityName: string) => {
  return useQuery(() => ({
    queryKey: queryKeys.detail(cityName),
    queryFn: () => apiRequest<CityInteractions>(`/recents/city/${cityName}`),
    enabled: !!cityName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  }));
};
