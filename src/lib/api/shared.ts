// Shared utilities and types for API queries
import { useQueryClient } from '@tanstack/solid-query';
import type { UserProfile, Interest, POI } from './types';
import { defaultLLMRateLimiter, RateLimitError, showRateLimitNotification } from '../rate-limiter';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Enhanced request wrapper with better error handling and rate limiting
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Apply client-side rate limiting for LLM endpoints
  const rateLimitCheck = await defaultLLMRateLimiter.checkRateLimit(endpoint);
  if (!rateLimitCheck.allowed) {
    const retryAfter = rateLimitCheck.retryAfter || 60;
    showRateLimitNotification(retryAfter, endpoint);
    throw new RateLimitError(
      `Rate limit exceeded for ${endpoint}. Retry after ${retryAfter} seconds.`,
      retryAfter,
      endpoint
    );
  }

  // Check both localStorage (persistent) and sessionStorage (temporary) for token
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Ensure no double slashes in URL
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  
  // Debug logging for favorites endpoints
  if (endpoint.includes('favourites')) {
    console.log('🌐 API Request:', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body
    });
  }
  
  try {
    const response = await fetch(url, config);

    if (!response.ok) {
    // Handle server-side rate limiting
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
      showRateLimitNotification(retryAfter, endpoint);
      throw new RateLimitError(
        `Server rate limit exceeded for ${endpoint}. Retry after ${retryAfter} seconds.`,
        retryAfter,
        endpoint
      );
    }

    if (response.status === 401) {
      // Clear both storage types on unauthorized
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
      window.location.href = '/auth/signin';
      throw new Error('Unauthorized');
    }

    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    
    // Debug logging for favorites endpoints
    if (endpoint.includes('favourites')) {
      console.log('❌ API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
    }
    
    throw new APIError(errorData.message || `HTTP ${response.status}`, response.status, errorData.code);
  }

  const data = await response.json();
  
  // Debug logging for favorites endpoints
  if (endpoint.includes('favourites')) {
    console.log('✅ API Success Response:', {
      status: response.status,
      data
    });
  }
  
  return data;
  } catch (error) {
    // Handle network/connection errors
    if (error instanceof TypeError && 
        (error.message.includes('Failed to fetch') || 
         error.message.includes('ERR_CONNECTION_REFUSED') ||
         error.message.includes('net::ERR_CONNECTION_REFUSED'))) {
      
      console.error('🚨 Server connection failed:', error);
      
      // Only redirect if we're not already on the server-down page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/server-down')) {
        window.location.href = '/server-down';
      }
      
      throw new APIError('Server is unavailable. Please try again later.', 0, 'CONNECTION_REFUSED');
    }
    
    // Handle other fetch errors
    if (error instanceof TypeError) {
      console.error('🚨 Network error:', error);
      throw new APIError('Network error. Please check your connection.', 0, 'NETWORK_ERROR');
    }
    
    // Re-throw APIError and RateLimitError instances
    if (error instanceof APIError || error instanceof RateLimitError) {
      throw error;
    }
    
    // Handle unexpected errors
    console.error('🚨 Unexpected error:', error);
    throw new APIError('An unexpected error occurred.', 0, 'UNEXPECTED_ERROR');
  }
}

// Custom error class for better error handling
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Query Keys for consistent cache invalidation
export const queryKeys = {
  // Auth
  session: ['session'] as const,

  // Profiles
  profiles: ['profiles'] as const,
  profile: (id: string) => ['profiles', id] as const,
  defaultProfile: ['profiles', 'default'] as const,

  // Interests
  interests: ['interests'] as const,
  interest: (id: string) => ['interests', id] as const,

  // Tags
  tags: ['tags'] as const,
  tag: (id: string) => ['tags', id] as const,

  // POIs
  favorites: ['pois', 'favorites'] as const,
  poiDetails: (id: string) => ['pois', 'details', id] as const,
  nearbyPois: (lat: number, lng: number, radius?: number) => ['pois', 'nearby', lat, lng, radius] as const,
  poisByCity: (cityId: string) => ['pois', 'city', cityId] as const,
  searchPois: (query: string, filters?: any) => ['pois', 'search', query, filters] as const,

  // Itineraries
  itineraries: (page: number, limit: number) => ['itineraries', page, limit] as const,
  itinerary: (id: string) => ['itineraries', id] as const,

  // Lists
  lists: ['lists'] as const,
  list: (id: string) => ['lists', id] as const,

  // Hotels
  hotels: ['hotels'] as const,
  hotelsByPreferences: (preferences: Record<string, unknown>) => ['hotels', 'preferences', preferences] as const,
  nearbyHotels: (lat: number, lng: number, radius?: number) => ['hotels', 'nearby', lat, lng, radius] as const,
  hotelDetails: (id: string) => ['hotels', 'details', id] as const,

  // Restaurants
  restaurants: ['restaurants'] as const,
  restaurantsByPreferences: (preferences: Record<string, unknown>) => ['restaurants', 'preferences', preferences] as const,
  nearbyRestaurants: (lat: number, lng: number, radius?: number) => ['restaurants', 'nearby', lat, lng, radius] as const,
  restaurantDetails: (id: string) => ['restaurants', 'details', id] as const,

  // Settings
  settings: ['settings'] as const,
  userSettings: (profileId: string) => ['settings', profileId] as const,
  
  // Cities
  cities: ['cities'] as const,

  // Recents
  recents: ['recents'] as const,
  recentInteractions: (limit: number) => ['recents', 'interactions', limit] as const,
  cityDetails: (cityName: string) => ['recents', 'city', cityName] as const,
};

// Utility hooks
export const useInvalidateUserQueries = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.profiles });
    queryClient.invalidateQueries({ queryKey: queryKeys.interests });
    queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    queryClient.invalidateQueries({ queryKey: queryKeys.lists });
    queryClient.invalidateQueries({ queryKey: queryKeys.settings });
  };
};

export const usePrefetchUserData = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.profiles,
      queryFn: () => apiRequest<UserProfile[]>('/user/search-profile/'),
      staleTime: 10 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: queryKeys.interests,
      queryFn: () => apiRequest<Interest[]>('/user/interests/'),
      staleTime: 15 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: queryKeys.favorites,
      queryFn: () => apiRequest<POI[]>('/pois/favourites'),
      staleTime: 5 * 60 * 1000,
    });
  };
};