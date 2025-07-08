import { useQuery } from "@tanstack/solid-query";
import { apiRequest } from "./shared";
import type { RecentInteractionsResponse, CityInteractions } from "./types";

export const queryKeys = {
  all: ["recents"] as const,
  lists: () => [...queryKeys.all, "list"] as const,
  list: (page: number, limit: number) =>
    [...queryKeys.lists(), { page, limit }] as const,
  details: () => [...queryKeys.all, "detail"] as const,
  detail: (cityName: string) => [...queryKeys.details(), cityName] as const,
};

// The fetcher function remains the same
const fetchRecentInteractions = async (
  page: number,
  limit: number,
): Promise<RecentInteractionsResponse> => {
  return apiRequest<RecentInteractionsResponse>(
    `/recents?page=${page}&limit=${limit}`,
  );
};

// accepts signals directly for reactivity.
export const useRecentInteractions = (
  page: () => number, // Accept a signal/accessor for the page
  limit: () => number, // Accept a signal/accessor for the limit
) => {
  const queryResult = useQuery(() => ({
    queryKey: queryKeys.list(page(), limit()), // The key now directly depends on the signals
    queryFn: () => fetchRecentInteractions(page(), limit()),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Excellent choice for pagination UX
  }));

  return queryResult;
};

export const useCityDetails = (cityName: string) => {
  return useQuery(() => ({
    queryKey: queryKeys.cityDetails(cityName),
    queryFn: () => apiRequest<CityInteractions>(`/recents/city/${cityName}`),
    enabled: !!cityName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  }));
};
