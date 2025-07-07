// SolidStart-enhanced content API (Hotels, Restaurants, etc.)
import { query, action, revalidate } from "@solidjs/router";
import { createQuery, createMutation } from "@tanstack/solid-query";
import { solidStartApiRequest, createQueryWithPreload, createActionWithMutation } from './solidstart';
import type { Hotel, Restaurant, HotelDetailedInfo, RestaurantDetailedInfo } from './types';

// =======================
// TYPE DEFINITIONS
// =======================

interface SearchPreferences {
  latitude?: number;
  longitude?: number;
  radius?: number;
  price_range?: string;
  rating_min?: number;
  category?: string;
  amenities?: string[];
  cuisine_type?: string;
  limit?: number;
  offset?: number;
}

interface HotelPreferences extends SearchPreferences {
  accommodation_type?: string[];
  star_rating?: { min: number; max: number };
  price_range_per_night?: { min: number; max: number };
  room_type?: string[];
  chain_preference?: string;
}

interface RestaurantPreferences extends SearchPreferences {
  cuisine_types?: string[];
  meal_types?: string[];
  service_style?: string[];
  dietary_needs?: string[];
  allergen_free?: string[];
  michelin_rated?: boolean;
  outdoor_seating_preferred?: boolean;
}

interface ContentSearchResponse<T> {
  results: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
  filters_applied: Record<string, any>;
}

// =======================
// HOTEL QUERIES
// =======================

// Search hotels by preferences
export const searchHotels = createQueryWithPreload(
  "search-hotels",
  async (preferences: HotelPreferences): Promise<ContentSearchResponse<HotelDetailedInfo>> => {
    const searchParams = {
      ...(preferences.latitude && { latitude: preferences.latitude.toString() }),
      ...(preferences.longitude && { longitude: preferences.longitude.toString() }),
      ...(preferences.radius && { radius: preferences.radius.toString() }),
      ...(preferences.price_range && { price_range: preferences.price_range }),
      ...(preferences.rating_min && { rating_min: preferences.rating_min.toString() }),
      ...(preferences.star_rating && {
        star_rating_min: preferences.star_rating.min.toString(),
        star_rating_max: preferences.star_rating.max.toString(),
      }),
      ...(preferences.accommodation_type && {
        accommodation_type: preferences.accommodation_type.join(','),
      }),
      ...(preferences.amenities && { amenities: preferences.amenities.join(',') }),
      ...(preferences.room_type && { room_type: preferences.room_type.join(',') }),
      ...(preferences.chain_preference && { chain_preference: preferences.chain_preference }),
      ...(preferences.limit && { limit: preferences.limit.toString() }),
      ...(preferences.offset && { offset: preferences.offset.toString() }),
    };

    return solidStartApiRequest<ContentSearchResponse<HotelDetailedInfo>>(
      "/api/hotels/search",
      { params: searchParams }
    );
  },
  {
    staleTime: 1000 * 60 * 10, // 10 minutes
  }
);

// Get nearby hotels
export const getNearbyHotels = createQueryWithPreload(
  "nearby-hotels",
  async (params: {
    latitude: number;
    longitude: number;
    radius?: number;
    limit?: number;
  }): Promise<{ hotels: HotelDetailedInfo[] }> => {
    const searchParams = {
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      radius: (params.radius || 5000).toString(),
      ...(params.limit && { limit: params.limit.toString() }),
    };

    return solidStartApiRequest<{ hotels: HotelDetailedInfo[] }>(
      "/api/hotels/nearby",
      { params: searchParams }
    );
  },
  {
    staleTime: 1000 * 60 * 15, // 15 minutes
  }
);

// Get hotel details
export const getHotelDetails = createQueryWithPreload(
  "hotel-details",
  async (hotelId: string): Promise<HotelDetailedInfo> => {
    return solidStartApiRequest<HotelDetailedInfo>(`/api/hotels/${hotelId}`);
  },
  {
    staleTime: 1000 * 60 * 30, // 30 minutes
  }
);

// Get hotels by city
export const getHotelsByCity = createQueryWithPreload(
  "hotels-by-city",
  async (cityId: string, filters?: Partial<HotelPreferences>): Promise<HotelDetailedInfo[]> => {
    const searchParams = {
      ...(filters?.price_range && { price_range: filters.price_range }),
      ...(filters?.rating_min && { rating_min: filters.rating_min.toString() }),
      ...(filters?.amenities && { amenities: filters.amenities.join(',') }),
      ...(filters?.limit && { limit: filters.limit.toString() }),
    };

    return solidStartApiRequest<HotelDetailedInfo[]>(`/api/hotels/city/${cityId}`, {
      params: searchParams,
    });
  },
  {
    staleTime: 1000 * 60 * 20, // 20 minutes
  }
);

// =======================
// RESTAURANT QUERIES
// =======================

// Search restaurants by preferences
export const searchRestaurants = createQueryWithPreload(
  "search-restaurants",
  async (preferences: RestaurantPreferences): Promise<ContentSearchResponse<RestaurantDetailedInfo>> => {
    const searchParams = {
      ...(preferences.latitude && { latitude: preferences.latitude.toString() }),
      ...(preferences.longitude && { longitude: preferences.longitude.toString() }),
      ...(preferences.radius && { radius: preferences.radius.toString() }),
      ...(preferences.price_range && { price_range: preferences.price_range }),
      ...(preferences.rating_min && { rating_min: preferences.rating_min.toString() }),
      ...(preferences.cuisine_types && { cuisine_types: preferences.cuisine_types.join(',') }),
      ...(preferences.meal_types && { meal_types: preferences.meal_types.join(',') }),
      ...(preferences.service_style && { service_style: preferences.service_style.join(',') }),
      ...(preferences.dietary_needs && { dietary_needs: preferences.dietary_needs.join(',') }),
      ...(preferences.allergen_free && { allergen_free: preferences.allergen_free.join(',') }),
      ...(preferences.michelin_rated !== undefined && {
        michelin_rated: preferences.michelin_rated.toString(),
      }),
      ...(preferences.outdoor_seating_preferred !== undefined && {
        outdoor_seating: preferences.outdoor_seating_preferred.toString(),
      }),
      ...(preferences.limit && { limit: preferences.limit.toString() }),
      ...(preferences.offset && { offset: preferences.offset.toString() }),
    };

    return solidStartApiRequest<ContentSearchResponse<RestaurantDetailedInfo>>(
      "/api/restaurants/search",
      { params: searchParams }
    );
  },
  {
    staleTime: 1000 * 60 * 10, // 10 minutes
  }
);

// Get nearby restaurants
export const getNearbyRestaurants = createQueryWithPreload(
  "nearby-restaurants",
  async (params: {
    latitude: number;
    longitude: number;
    radius?: number;
    cuisine_type?: string;
    limit?: number;
  }): Promise<{ restaurants: RestaurantDetailedInfo[] }> => {
    const searchParams = {
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      radius: (params.radius || 5000).toString(),
      ...(params.cuisine_type && { cuisine_type: params.cuisine_type }),
      ...(params.limit && { limit: params.limit.toString() }),
    };

    return solidStartApiRequest<{ restaurants: RestaurantDetailedInfo[] }>(
      "/api/restaurants/nearby",
      { params: searchParams }
    );
  },
  {
    staleTime: 1000 * 60 * 15, // 15 minutes
  }
);

// Get restaurant details
export const getRestaurantDetails = createQueryWithPreload(
  "restaurant-details",
  async (restaurantId: string): Promise<RestaurantDetailedInfo> => {
    return solidStartApiRequest<RestaurantDetailedInfo>(`/api/restaurants/${restaurantId}`);
  },
  {
    staleTime: 1000 * 60 * 30, // 30 minutes
  }
);

// Get restaurants by city
export const getRestaurantsByCity = createQueryWithPreload(
  "restaurants-by-city",
  async (cityId: string, filters?: Partial<RestaurantPreferences>): Promise<RestaurantDetailedInfo[]> => {
    const searchParams = {
      ...(filters?.cuisine_types && { cuisine_types: filters.cuisine_types.join(',') }),
      ...(filters?.price_range && { price_range: filters.price_range }),
      ...(filters?.rating_min && { rating_min: filters.rating_min.toString() }),
      ...(filters?.dietary_needs && { dietary_needs: filters.dietary_needs.join(',') }),
      ...(filters?.limit && { limit: filters.limit.toString() }),
    };

    return solidStartApiRequest<RestaurantDetailedInfo[]>(`/api/restaurants/city/${cityId}`, {
      params: searchParams,
    });
  },
  {
    staleTime: 1000 * 60 * 20, // 20 minutes
  }
);

// =======================
// ENHANCED HOOKS
// =======================

// Hotel hooks
export const useSearchHotels = (preferences: HotelPreferences) => {
  return searchHotels.useQuery(preferences);
};

export const useNearbyHotels = (params: {
  latitude: number;
  longitude: number;
  radius?: number;
  limit?: number;
}) => {
  return getNearbyHotels.useQuery(params);
};

export const useHotelDetails = (hotelId: string) => {
  return getHotelDetails.useQuery(hotelId);
};

export const useHotelsByCity = (cityId: string, filters?: Partial<HotelPreferences>) => {
  return getHotelsByCity.useQuery(cityId, filters);
};

// Restaurant hooks
export const useSearchRestaurants = (preferences: RestaurantPreferences) => {
  return searchRestaurants.useQuery(preferences);
};

export const useNearbyRestaurants = (params: {
  latitude: number;
  longitude: number;
  radius?: number;
  cuisine_type?: string;
  limit?: number;
}) => {
  return getNearbyRestaurants.useQuery(params);
};

export const useRestaurantDetails = (restaurantId: string) => {
  return getRestaurantDetails.useQuery(restaurantId);
};

export const useRestaurantsByCity = (cityId: string, filters?: Partial<RestaurantPreferences>) => {
  return getRestaurantsByCity.useQuery(cityId, filters);
};

// =======================
// UTILITY FUNCTIONS
// =======================

// Get cached hotel details
export const getCachedHotelDetails = (hotelId: string): HotelDetailedInfo | null => {
  try {
    return getHotelDetails.query(hotelId);
  } catch {
    return null;
  }
};

// Get cached restaurant details
export const getCachedRestaurantDetails = (restaurantId: string): RestaurantDetailedInfo | null => {
  try {
    return getRestaurantDetails.query(restaurantId);
  } catch {
    return null;
  }
};

// Prefetch location-based content
export const prefetchLocationContent = async (
  latitude: number,
  longitude: number,
  radius = 5000
) => {
  try {
    await Promise.allSettled([
      getNearbyHotels.preload({ latitude, longitude, radius, limit: 20 }),
      getNearbyRestaurants.preload({ latitude, longitude, radius, limit: 20 }),
    ]);
  } catch (error) {
    console.warn("Failed to prefetch location content:", error);
  }
};

// Prefetch city content
export const prefetchCityContent = async (cityId: string) => {
  try {
    await Promise.allSettled([
      getHotelsByCity.preload(cityId, { limit: 20 }),
      getRestaurantsByCity.preload(cityId, { limit: 20 }),
    ]);
  } catch (error) {
    console.warn(`Failed to prefetch content for city ${cityId}:`, error);
  }
};

// Prefetch hotel details
export const prefetchHotelDetails = async (hotelId: string) => {
  try {
    await getHotelDetails.preload(hotelId);
  } catch (error) {
    console.warn(`Failed to prefetch hotel details for ${hotelId}:`, error);
  }
};

// Prefetch restaurant details
export const prefetchRestaurantDetails = async (restaurantId: string) => {
  try {
    await getRestaurantDetails.preload(restaurantId);
  } catch (error) {
    console.warn(`Failed to prefetch restaurant details for ${restaurantId}:`, error);
  }
};

// =======================
// ROUTE HELPERS
// =======================

// Create hotel route with preloading
export const createHotelRoute = (path: string, preloadFn?: () => Promise<any>) => ({
  path,
  preload: preloadFn,
});

// Create hotel detail route
export const createHotelDetailRoute = (path: string) => ({
  path,
  preload: async (params: { id: string }) => {
    await prefetchHotelDetails(params.id);
  },
});

// Create restaurant route with preloading
export const createRestaurantRoute = (path: string, preloadFn?: () => Promise<any>) => ({
  path,
  preload: preloadFn,
});

// Create restaurant detail route
export const createRestaurantDetailRoute = (path: string) => ({
  path,
  preload: async (params: { id: string }) => {
    await prefetchRestaurantDetails(params.id);
  },
});

// Create city content route
export const createCityContentRoute = (path: string) => ({
  path,
  preload: async (params: { cityId: string }) => {
    await prefetchCityContent(params.cityId);
  },
});

// =======================
// BACKWARDS COMPATIBILITY
// =======================

// Export legacy hooks for gradual migration
export {
  useHotelsByPreferences,
  useNearbyHotels as useNearbyHotelsLegacy,
  useHotelDetails as useHotelDetailsLegacy,
} from './hotels';

export {
  useRestaurantsByPreferences,
  useNearbyRestaurants as useNearbyRestaurantsLegacy,
  useRestaurantDetails as useRestaurantDetailsLegacy,
} from './restaurants';