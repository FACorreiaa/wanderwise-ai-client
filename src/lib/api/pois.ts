// POI and favorites queries and mutations
import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import { createResource } from "solid-js";
import { apiRequest, queryKeys } from "./shared";
import type { POI, POIDetailedInfo } from "./types";

// ===============
// POI QUERIES
// ===============

export const useFavorites = (pageFn: () => number, limitFn: () => number) => {
  return useQuery(() => ({
    queryKey: [...queryKeys.favorites, pageFn(), limitFn()],
    queryFn: async () => {
      const page = pageFn();
      const limit = limitFn();
      console.log("🔄 Fetching user favorites...", { page, limit });
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        const response = await apiRequest<PaginatedResponse>(
          `/pois/favourites?${params}`,
        );
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

interface PaginatedResponse {
  data: POI[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

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
        is_llm_poi: true,
        ...(params.poiData && { poi_data: params.poiData }),
      };
      console.log("📤 Request body:", requestBody);

      const response = await apiRequest<{ 
        message: string;
        poi_id: string;
        id: string;
      }>(
        "/pois/favourites",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        },
      );
      console.log("✅ Add to favorites response:", response);
      return { ...response, originalPoiId: params.poiId };
    },
    onSuccess: () => {
      // Invalidate all favorites queries to refetch data
      queryClient.invalidateQueries({
        queryKey: queryKeys.favorites,
        exact: false, // This will invalidate all favorites queries regardless of pagination params
      });
    },
    onError: (error) => {
      console.error("❌ Add to favorites failed:", error);
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

      const response = await apiRequest<{ 
        message: string;
        poi_id: string;
        id: string;
      }>(
        "/pois/favourites",
        {
          method: "DELETE",
          body: JSON.stringify(requestBody),
        },
      );
      console.log("✅ Remove from favorites response:", response);
      return { ...response, originalPoiId: params.poiId };
    },
    onSuccess: () => {
      // Invalidate all favorites queries to refetch data
      queryClient.invalidateQueries({
        queryKey: queryKeys.favorites,
        exact: false, // This will invalidate all favorites queries regardless of pagination params
      });
    },
    onError: (error) => {
      console.error("❌ Remove from favorites failed:", error);
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
        console.log(
          "🔍 Skipping fetch - missing coordinates or invalid radius",
        );
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

// ===============
// DISCOVER CATEGORY APIs
// ===============

export const getNearbyRestaurants = async (
  lat: number,
  lon: number,
  radiusMeters: number,
): Promise<POIDetailedInfo[]> => {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      distance: radiusMeters.toString(),
    });

    console.log("🍽️ getNearbyRestaurants params:", params.toString());
    const response = await apiRequest<{
      restaurants?: POIDetailedInfo[];
      points_of_interest?: POIDetailedInfo[];
    }>(`/pois/discover/restaurants?${params.toString()}`, { method: "GET" });

    console.log("🍽️ getNearbyRestaurants response:", response);
    return response.restaurants || response.points_of_interest || [];
  } catch (error) {
    console.error("🍽️ getNearbyRestaurants error:", error);
    // Return empty array on error to prevent UI breaking
    return [];
  }
};

export const getNearbyActivities = async (
  lat: number,
  lon: number,
  radiusMeters: number,
): Promise<POIDetailedInfo[]> => {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      distance: radiusMeters.toString(),
    });

    console.log("🎯 getNearbyActivities params:", params.toString());
    const response = await apiRequest<{
      activities?: POIDetailedInfo[];
      points_of_interest?: POIDetailedInfo[];
    }>(`/pois/discover/activities?${params.toString()}`, { method: "GET" });

    console.log("🎯 getNearbyActivities response:", response);
    return response.activities || response.points_of_interest || [];
  } catch (error) {
    console.error("🎯 getNearbyActivities error:", error);
    // Return empty array on error to prevent UI breaking
    return [];
  }
};

export const getNearbyHotels = async (
  lat: number,
  lon: number,
  radiusMeters: number,
): Promise<POIDetailedInfo[]> => {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      distance: radiusMeters.toString(),
    });

    console.log("🏨 getNearbyHotels params:", params.toString());
    const response = await apiRequest<{
      hotels?: POIDetailedInfo[];
      points_of_interest?: POIDetailedInfo[];
    }>(`/pois/discover/hotels?${params.toString()}`, { method: "GET" });

    console.log("🏨 getNearbyHotels response:", response);
    return response.hotels || response.points_of_interest || [];
  } catch (error) {
    console.error("🏨 getNearbyHotels error:", error);
    // Return empty array on error to prevent UI breaking
    return [];
  }
};

export const getNearbyAttractions = async (
  lat: number,
  lon: number,
  radiusMeters: number,
): Promise<POIDetailedInfo[]> => {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      distance: radiusMeters.toString(),
    });

    console.log("🏛️ getNearbyAttractions params:", params.toString());
    const response = await apiRequest<{
      attractions?: POIDetailedInfo[];
      points_of_interest?: POIDetailedInfo[];
    }>(`/pois/discover/attractions?${params.toString()}`, { method: "GET" });

    console.log("🏛️ getNearbyAttractions response:", response);
    return response.attractions || response.points_of_interest || [];
  } catch (error) {
    console.error("🏛️ getNearbyAttractions error:", error);
    // Return empty array on error to prevent UI breaking
    return [];
  }
};

// ===============
// DISCOVER CATEGORY HOOKS
// ===============

export function useNearbyRestaurants(
  latFn: () => number | undefined,
  lonFn: () => number | undefined,
  radiusFn: () => number,
) {
  const [data, dataInfo] = createResource(
    () => {
      const lat = latFn();
      const lon = lonFn();
      const radiusMeters = radiusFn();

      if (lat === undefined || lon === undefined || radiusMeters <= 0) {
        return null;
      }

      return [lat, lon, radiusMeters];
    },
    async ([lat, lon, radiusMeters]: [number, number, number]) => {
      return getNearbyRestaurants(lat, lon, radiusMeters);
    },
  );

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

export function useNearbyActivities(
  latFn: () => number | undefined,
  lonFn: () => number | undefined,
  radiusFn: () => number,
) {
  const [data, dataInfo] = createResource(
    () => {
      const lat = latFn();
      const lon = lonFn();
      const radiusMeters = radiusFn();

      if (lat === undefined || lon === undefined || radiusMeters <= 0) {
        return null;
      }

      return [lat, lon, radiusMeters];
    },
    async ([lat, lon, radiusMeters]: [number, number, number]) => {
      return getNearbyActivities(lat, lon, radiusMeters);
    },
  );

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

export function useNearbyHotels(
  latFn: () => number | undefined,
  lonFn: () => number | undefined,
  radiusFn: () => number,
) {
  const [data, dataInfo] = createResource(
    () => {
      const lat = latFn();
      const lon = lonFn();
      const radiusMeters = radiusFn();

      if (lat === undefined || lon === undefined || radiusMeters <= 0) {
        return null;
      }

      return [lat, lon, radiusMeters];
    },
    async ([lat, lon, radiusMeters]: [number, number, number]) => {
      return getNearbyHotels(lat, lon, radiusMeters);
    },
  );

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

export function useNearbyAttractions(
  latFn: () => number | undefined,
  lonFn: () => number | undefined,
  radiusFn: () => number,
) {
  const [data, dataInfo] = createResource(
    () => {
      const lat = latFn();
      const lon = lonFn();
      const radiusMeters = radiusFn();

      if (lat === undefined || lon === undefined || radiusMeters <= 0) {
        return null;
      }

      return [lat, lon, radiusMeters];
    },
    async ([lat, lon, radiusMeters]: [number, number, number]) => {
      return getNearbyAttractions(lat, lon, radiusMeters);
    },
  );

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
