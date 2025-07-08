// POI and favorites queries and mutations
import { useQuery, useMutation, useQueryClient } from "@tanstack/solid-query";
import { apiRequest, queryKeys } from "./shared";
import type { POI, POIDetailedInfo } from "./types";
import { createResource } from "solid-js";

// ===============
// POI QUERIES
// ===============

export const useFavorites = () => {
  return useQuery(() => ({
    queryKey: queryKeys.favorites,
    queryFn: async () => {
      console.log("🔄 Fetching user favorites...");
      try {
        const response = await apiRequest<POI[]>("/pois/favourites");
        console.log("✅ Favorites fetched:", response);
        return response;
      } catch (error) {
        console.error("❌ Failed to fetch favorites:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  }));
};

export const useAddToFavoritesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: async (params: {
      poiId: string;
      poiData?: POIDetailedInfo;
    }) => {
      console.log("🔄 Adding POI to favorites:", params);
      const requestBody = {
        poi_id: params.poiId,
        is_llm_poi: true, // Since we're adding from itinerary, these are LLM-generated POIs
        ...(params.poiData && { poi_data: params.poiData }),
      };
      console.log("📤 Request body:", requestBody);

      const response = await apiRequest<{ message: string }>(
        "/pois/favourites",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        },
      );
      console.log("✅ Add to favorites response:", response);
      return response;
    },
    onMutate: async (params) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites });

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData(queryKeys.favorites);

      // Optimistically update to the new value
      queryClient.setQueryData(
        queryKeys.favorites,
        (old: POI[] | undefined) => {
          const currentFavorites = old || [];
          // Add the POI if we have the data, otherwise add a minimal POI object
          const newPOI =
            params.poiData || ({ id: params.poiId, name: "POI" } as POI);
          return [...currentFavorites, newPOI];
        },
      );

      // Return a context object with the snapshotted value
      return { previousFavorites };
    },
    onError: (error, params, context) => {
      console.error("❌ Add to favorites failed:", error);
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(queryKeys.favorites, context?.previousFavorites);
    },
  }));
};

export const useRemoveFromFavoritesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: async (params: {
      poiId: string;
      poiData?: POIDetailedInfo;
    }) => {
      console.log("🔄 Removing POI from favorites:", params);
      const requestBody = {
        poi_id: params.poiId,
        is_llm_poi: true,
        ...(params.poiData && { poi_data: params.poiData }),
      };
      console.log("📤 Remove request body:", requestBody);

      const response = await apiRequest<{ message: string }>(
        "/pois/favourites",
        {
          method: "DELETE",
          body: JSON.stringify(requestBody),
        },
      );
      console.log("✅ Remove from favorites response:", response);
      return response;
    },
    onMutate: async (params) => {
      console.log("🔄 Optimistically removing POI:", params.poiId);
      // Optimistically remove from favorites
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites });
      const previousFavorites = queryClient.getQueryData(queryKeys.favorites);

      queryClient.setQueryData(
        queryKeys.favorites,
        (old: POI[] | undefined) => {
          const currentFavorites = old || [];
          return currentFavorites.filter((poi) => poi.id !== params.poiId);
        },
      );

      return { previousFavorites };
    },
    onError: (err, params, context) => {
      console.error("❌ Remove from favorites failed:", err);
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          queryKeys.favorites,
          context.previousFavorites,
        );
      }
    },
  }));
};

export const usePOIDetails = (poiId: string) => {
  return useQuery(() => ({
    queryKey: queryKeys.poiDetails(poiId),
    queryFn: () =>
      apiRequest<POI>(`/llm/prompt-response/poi/details?poi_id=${poiId}`),
    enabled: !!poiId,
    staleTime: 30 * 60 * 1000, // POI details don't change often
  }));
};

export const getNearbyPOIs = async (
  lat: number,
  lon: number,
  radiusMeters: number,
  //filters?: { city?: string; category?: string; price_range?: string }
): Promise<POIDetailedInfo[]> => {
  // Use URLSearchParams for safe and easy query string construction
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    distance: radiusMeters.toString(),
  });

  // Add optional filter parameters
  // if (filters?.city && filters.city !== 'all') {
  //   params.append('city', filters.city);
  // }
  // if (filters?.category && filters.category !== 'all') {
  //   params.append('category', filters.category);
  // }
  // if (filters?.price_range && filters.price_range !== 'all') {
  //   params.append('price_range', filters.price_range);
  // }

  console.log("params", params.toString());
  // The endpoint path should match your router
  const response = await apiRequest<{ points_of_interest: POIDetailedInfo[] }>(
    `/pois/nearby?${params.toString()}`,
    { method: "GET" },
  );

  console.log("🔍 getNearbyPOIs full response:", response);
  console.log("🔍 response.points_of_interest:", response.points_of_interest);
  console.log("🔍 response type:", typeof response);
  console.log("🔍 response keys:", Object.keys(response || {}));

  return response.points_of_interest || [];
};

// Your TanStack Query hook that uses the function above
export function useNearbyPOIs(
  latFn: () => number | undefined,
  lonFn: () => number | undefined,
  radiusFn: () => number,
  //filtersFn: () => Record<string, unknown>
) {
  const [data, dataInfo] = createResource(
    () => {
      const lat = latFn();
      const lon = lonFn();
      const radiusMeters = radiusFn();
      
      console.log("🔍 Checking coordinates:", { lat, lon, radiusMeters });
      
      // Skip fetching if we don't have valid coordinates or radius
      if (lat === undefined || lon === undefined || radiusMeters <= 0) {
        console.log("🔍 Skipping fetch - missing coordinates or invalid radius");
        return null;
      }
      
      console.log("🔍 Using valid coordinates:", { lat, lon, radiusMeters });
      //const filters = filtersFn();
      // Serialize filters to detect content changes, use 'no-filters' if undefined
      //const filtersKey = filters ? JSON.stringify(filters) : 'no-filters';
      return [lat, lon, radiusMeters];
    },
    async ([lat, lon, radiusMeters]: [number, number, number]) => {
      // Parse filters back to an object, or undefined if not present
      //const filters = filtersKey !== 'no-filters' ? JSON.parse(filtersKey) : undefined;
      console.log("🔍 Fetching nearby POIs:", { lat, lon, radiusMeters });
      return getNearbyPOIs(lat, lon, radiusMeters);
    },
  );

  // Return TanStack Query-like interface for compatibility
  return {
    data,
    isLoading: () => dataInfo.loading,
    isError: () => !!dataInfo.error,
    error: () => dataInfo.error,
    isSuccess: () =>
      !dataInfo.loading && !dataInfo.error && data() !== undefined,
    refetch: dataInfo.refetch,
  };
}

export const useSearchPOIs = (query: string, filters?: any) => {
  return useQuery(() => ({
    queryKey: queryKeys.searchPois(query, filters),
    queryFn: () => {
      const params = new URLSearchParams({ q: query, ...filters });
      return apiRequest<POI[]>(`/pois/search?${params}`);
    },
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  }));
};
