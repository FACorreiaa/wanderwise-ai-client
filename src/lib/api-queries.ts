// API Queries using @tanstack/solid-query for Loci Travel App
// This file provides reactive queries and mutations with caching, optimistic updates, and error handling

import { createQuery, createMutation, useQueryClient, CreateQueryOptions, CreateMutationOptions } from '@tanstack/solid-query';
import { createSignal } from 'solid-js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Enhanced request wrapper with better error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/auth/signin';
      throw new Error('Unauthorized');
    }
    
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new APIError(errorData.message || `HTTP ${response.status}`, response.status, errorData.code);
  }

  return response.json();
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
  hotelsByPreferences: (preferences: any) => ['hotels', 'preferences', preferences] as const,
  nearbyHotels: (lat: number, lng: number, radius?: number) => ['hotels', 'nearby', lat, lng, radius] as const,
  hotelDetails: (id: string) => ['hotels', 'details', id] as const,
  
  // Restaurants
  restaurants: ['restaurants'] as const,
  restaurantsByPreferences: (preferences: any) => ['restaurants', 'preferences', preferences] as const,
  nearbyRestaurants: (lat: number, lng: number, radius?: number) => ['restaurants', 'nearby', lat, lng, radius] as const,
  restaurantDetails: (id: string) => ['restaurants', 'details', id] as const,
  
  // Settings
  settings: ['settings'] as const,
  userSettings: (profileId: string) => ['settings', profileId] as const,
};

// =======================
// AUTHENTICATION QUERIES
// =======================

export const useValidateSession = () => {
  return createQuery(() => ({
    queryKey: queryKeys.session,
    queryFn: () => apiRequest<{ valid: boolean }>('/auth/validate-session'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  }));
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiRequest<{ access_token: string; message: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      queryClient.invalidateQueries({ queryKey: queryKeys.session });
    },
  }));
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: ({ username, email, password, role = 'user' }: { 
      username: string; 
      email: string; 
      password: string; 
      role?: string; 
    }) =>
      apiRequest<{ message: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, role }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.session });
    },
  }));
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: () => apiRequest<{ message: string }>('/auth/logout', { method: 'POST' }),
    onSettled: () => {
      localStorage.removeItem('access_token');
      queryClient.clear(); // Clear all cached data on logout
    },
  }));
};

export const useUpdatePasswordMutation = () => {
  return createMutation(() => ({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      apiRequest<{ message: string }>('/auth/update-password', {
        method: 'PUT',
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      }),
  }));
};

// ===================
// PROFILE QUERIES
// ===================

export const useProfiles = () => {
  return createQuery(() => ({
    queryKey: queryKeys.profiles,
    queryFn: () => apiRequest<UserProfile[]>('/user/search-profile/'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  }));
};

export const useProfile = (profileId: string) => {
  return createQuery(() => ({
    queryKey: queryKeys.profile(profileId),
    queryFn: () => apiRequest<UserProfile>(`/user/search-profile/${profileId}`),
    enabled: !!profileId,
  }));
};

export const useDefaultProfile = () => {
  return createQuery(() => ({
    queryKey: queryKeys.defaultProfile,
    queryFn: () => apiRequest<UserProfile>('/user/search-profile/default'),
  }));
};

export const useCreateProfileMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: (profileData: Partial<UserProfile>) =>
      apiRequest<UserProfile>('/user/search-profile/', {
        method: 'POST',
        body: JSON.stringify(profileData),
      }),
    onSuccess: (newProfile) => {
      // Optimistically update the profiles list
      queryClient.setQueryData(queryKeys.profiles, (old: UserProfile[] = []) => [...old, newProfile]);
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles });
    },
  }));
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: ({ profileId, profileData }: { profileId: string; profileData: Partial<UserProfile> }) =>
      apiRequest<UserProfile>(`/user/search-profile/${profileId}`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
    onSuccess: (updatedProfile, { profileId }) => {
      // Optimistically update both the individual profile and profiles list
      queryClient.setQueryData(queryKeys.profile(profileId), updatedProfile);
      queryClient.setQueryData(queryKeys.profiles, (old: UserProfile[] = []) =>
        old.map(profile => profile.id === profileId ? updatedProfile : profile)
      );
    },
  }));
};

export const useDeleteProfileMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: (profileId: string) =>
      apiRequest<{ message: string }>(`/user/search-profile/${profileId}`, { method: 'DELETE' }),
    onSuccess: (_, profileId) => {
      // Optimistically remove from profiles list
      queryClient.setQueryData(queryKeys.profiles, (old: UserProfile[] = []) =>
        old.filter(profile => profile.id !== profileId)
      );
      queryClient.removeQueries({ queryKey: queryKeys.profile(profileId) });
    },
  }));
};

export const useSetDefaultProfileMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: (profileId: string) =>
      apiRequest<{ message: string }>(`/user/search-profile/default/${profileId}`, { method: 'PUT' }),
    onSuccess: (_, profileId) => {
      // Update all profiles to reflect new default
      queryClient.setQueryData(queryKeys.profiles, (old: UserProfile[] = []) =>
        old.map(profile => ({ ...profile, is_default: profile.id === profileId }))
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.defaultProfile });
    },
  }));
};

// ===================
// INTERESTS QUERIES
// ===================

export const useInterests = () => {
  return createQuery(() => ({
    queryKey: queryKeys.interests,
    queryFn: () => apiRequest<Interest[]>('/user/interests/'),
    staleTime: 15 * 60 * 1000, // 15 minutes - interests don't change often
  }));
};

export const useCreateInterestMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: ({ name, description, active = true }: { name: string; description: string; active?: boolean }) =>
      apiRequest<Interest>('/user/interests/create', {
        method: 'POST',
        body: JSON.stringify({ name, description, active }),
      }),
    onSuccess: (newInterest) => {
      queryClient.setQueryData(queryKeys.interests, (old: Interest[] = []) => [...old, newInterest]);
    },
  }));
};

export const useUpdateInterestMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: ({ interestId, data }: { interestId: string; data: Partial<Interest> }) =>
      apiRequest<Interest>(`/user/interests/${interestId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: (updatedInterest, { interestId }) => {
      queryClient.setQueryData(queryKeys.interests, (old: Interest[] = []) =>
        old.map(interest => interest.id === interestId ? updatedInterest : interest)
      );
    },
  }));
};

export const useDeleteInterestMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: (interestId: string) =>
      apiRequest<{ message: string }>(`/user/interests/${interestId}`, { method: 'DELETE' }),
    onSuccess: (_, interestId) => {
      queryClient.setQueryData(queryKeys.interests, (old: Interest[] = []) =>
        old.filter(interest => interest.id !== interestId)
      );
    },
  }));
};

// ===============
// TAGS QUERIES
// ===============

export const useTags = () => {
  return createQuery(() => ({
    queryKey: queryKeys.tags,
    queryFn: () => apiRequest<PersonalTag[]>('/user/tags/'),
    staleTime: 15 * 60 * 1000,
  }));
};

export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: ({ name, description, tagType = 'preference' }: { 
      name: string; 
      description: string; 
      tagType?: string; 
    }) =>
      apiRequest<PersonalTag>('/user/tags/', {
        method: 'POST',
        body: JSON.stringify({ name, description, tag_type: tagType }),
      }),
    onSuccess: (newTag) => {
      queryClient.setQueryData(queryKeys.tags, (old: PersonalTag[] = []) => [...old, newTag]);
    },
  }));
};

// ===============
// POI QUERIES
// ===============

export const useFavorites = () => {
  return createQuery(() => ({
    queryKey: queryKeys.favorites,
    queryFn: () => apiRequest<POI[]>('/pois/favourites'),
    staleTime: 5 * 60 * 1000,
  }));
};

export const useAddToFavoritesMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: (poiId: string) =>
      apiRequest<{ message: string }>('/pois/favourites', {
        method: 'POST',
        body: JSON.stringify({ poi_id: poiId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
  }));
};

export const useRemoveFromFavoritesMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: (poiId: string) =>
      apiRequest<{ message: string }>('/pois/favourites', {
        method: 'DELETE',
        body: JSON.stringify({ poi_id: poiId }),
      }),
    onMutate: async (poiId) => {
      // Optimistically remove from favorites
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites });
      const previousFavorites = queryClient.getQueryData(queryKeys.favorites);
      
      queryClient.setQueryData(queryKeys.favorites, (old: POI[] = []) =>
        old.filter(poi => poi.id !== poiId)
      );
      
      return { previousFavorites };
    },
    onError: (err, poiId, context) => {
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKeys.favorites, context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
  }));
};

export const usePOIDetails = (poiId: string) => {
  return createQuery(() => ({
    queryKey: queryKeys.poiDetails(poiId),
    queryFn: () => apiRequest<POI>(`/llm/prompt-response/poi/details?poi_id=${poiId}`),
    enabled: !!poiId,
    staleTime: 30 * 60 * 1000, // POI details don't change often
  }));
};

export const useNearbyPOIs = (lat: number, lng: number, radius?: number) => {
  return createQuery(() => ({
    queryKey: queryKeys.nearbyPois(lat, lng, radius),
    queryFn: () => {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        ...(radius && { radius: radius.toString() }),
      });
      return apiRequest<POI[]>(`/llm/prompt-response/poi/nearby?${params}`);
    },
    enabled: !!(lat && lng),
    staleTime: 10 * 60 * 1000,
  }));
};

export const useSearchPOIs = (query: string, filters?: any) => {
  return createQuery(() => ({
    queryKey: queryKeys.searchPois(query, filters),
    queryFn: () => {
      const params = new URLSearchParams({ q: query, ...filters });
      return apiRequest<POI[]>(`/pois/search?${params}`);
    },
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  }));
};

// ====================
// ITINERARY QUERIES
// ====================

export const useItineraries = (page: number = 1, limit: number = 10) => {
  return createQuery(() => ({
    queryKey: queryKeys.itineraries(page, limit),
    queryFn: () => apiRequest<PaginatedItinerariesResponse>(`/pois/itineraries?page=${page}&limit=${limit}`),
    staleTime: 5 * 60 * 1000,
  }));
};

export const useItinerary = (itineraryId: string) => {
  return createQuery(() => ({
    queryKey: queryKeys.itinerary(itineraryId),
    queryFn: () => apiRequest<UserSavedItinerary>(`/pois/itineraries/itinerary/${itineraryId}`),
    enabled: !!itineraryId,
  }));
};

export const useUpdateItineraryMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
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

// ===============
// LISTS QUERIES
// ===============

export const useLists = () => {
  return createQuery(() => ({
    queryKey: queryKeys.lists,
    queryFn: () => apiRequest<ItineraryList[]>('/itineraries/lists'),
    staleTime: 5 * 60 * 1000,
  }));
};

export const useList = (listId: string) => {
  return createQuery(() => ({
    queryKey: queryKeys.list(listId),
    queryFn: () => apiRequest<ItineraryList>(`/itineraries/lists/${listId}`),
    enabled: !!listId,
  }));
};

export const useCreateListMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
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
  
  return createMutation(() => ({
    mutationFn: ({ listId, listData }: { listId: string; listData: Partial<ItineraryList> }) =>
      apiRequest<ItineraryList>(`/itineraries/lists/${listId}`, {
        method: 'PUT',
        body: JSON.stringify(listData),
      }),
    onSuccess: (updatedList, { listId }) => {
      queryClient.setQueryData(queryKeys.list(listId), updatedList);
      queryClient.setQueryData(queryKeys.lists, (old: ItineraryList[] = []) =>
        old.map(list => list.id === listId ? updatedList : list)
      );
    },
  }));
};

export const useDeleteListMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: (listId: string) =>
      apiRequest<{ message: string }>(`/itineraries/lists/${listId}`, { method: 'DELETE' }),
    onMutate: async (listId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.lists });
      const previousLists = queryClient.getQueryData(queryKeys.lists);
      
      queryClient.setQueryData(queryKeys.lists, (old: ItineraryList[] = []) =>
        old.filter(list => list.id !== listId)
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

// =================
// HOTELS QUERIES
// =================

export const useHotelsByPreferences = (preferences: any) => {
  return createQuery(() => ({
    queryKey: queryKeys.hotelsByPreferences(preferences),
    queryFn: () =>
      apiRequest<Hotel[]>('/llm/prompt-response/city/hotel/preferences', {
        method: 'POST',
        body: JSON.stringify(preferences),
      }),
    enabled: !!preferences,
    staleTime: 10 * 60 * 1000,
  }));
};

export const useNearbyHotels = (lat: number, lng: number, radius?: number) => {
  return createQuery(() => ({
    queryKey: queryKeys.nearbyHotels(lat, lng, radius),
    queryFn: () => {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        ...(radius && { radius: radius.toString() }),
      });
      return apiRequest<Hotel[]>(`/llm/prompt-response/city/hotel/nearby?${params}`);
    },
    enabled: !!(lat && lng),
    staleTime: 15 * 60 * 1000,
  }));
};

export const useHotelDetails = (hotelId: string) => {
  return createQuery(() => ({
    queryKey: queryKeys.hotelDetails(hotelId),
    queryFn: () => apiRequest<Hotel>(`/llm/prompt-response/city/hotel/${hotelId}`),
    enabled: !!hotelId,
    staleTime: 30 * 60 * 1000,
  }));
};

// =====================
// RESTAURANTS QUERIES
// =====================

export const useRestaurantsByPreferences = (preferences: any) => {
  return createQuery(() => ({
    queryKey: queryKeys.restaurantsByPreferences(preferences),
    queryFn: () =>
      apiRequest<Restaurant[]>('/llm/prompt-response/city/restaurants/preferences', {
        method: 'POST',
        body: JSON.stringify(preferences),
      }),
    enabled: !!preferences,
    staleTime: 10 * 60 * 1000,
  }));
};

export const useNearbyRestaurants = (lat: number, lng: number, radius?: number) => {
  return createQuery(() => ({
    queryKey: queryKeys.nearbyRestaurants(lat, lng, radius),
    queryFn: () => {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        ...(radius && { radius: radius.toString() }),
      });
      return apiRequest<Restaurant[]>(`/llm/prompt-response/city/restaurants/nearby?${params}`);
    },
    enabled: !!(lat && lng),
    staleTime: 15 * 60 * 1000,
  }));
};

export const useRestaurantDetails = (restaurantId: string) => {
  return createQuery(() => ({
    queryKey: queryKeys.restaurantDetails(restaurantId),
    queryFn: () => apiRequest<Restaurant>(`/llm/prompt-response/city/restaurants/${restaurantId}`),
    enabled: !!restaurantId,
    staleTime: 30 * 60 * 1000,
  }));
};

// ==================
// CHAT/LLM QUERIES
// ==================

export const useCreateChatSessionMutation = () => {
  return createMutation(() => ({
    mutationFn: (profileId: string) =>
      apiRequest<ChatSession>(`/llm/prompt-response/chat/sessions/${profileId}`, { method: 'POST' }),
  }));
};

export const useSendMessageMutation = () => {
  return createMutation(() => ({
    mutationFn: ({ sessionId, message }: { sessionId: string; message: string }) =>
      apiRequest<ChatMessage>(`/llm/prompt-response/chat/sessions/${sessionId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
  }));
};

export const useGetRecommendationsMutation = () => {
  return createMutation(() => ({
    mutationFn: ({ profileId, query }: { profileId: string; query: string }) =>
      apiRequest<any>(`/llm/prompt-response/profile/${profileId}`, {
        method: 'POST',
        body: JSON.stringify({ query }),
      }),
  }));
};

// ==================
// BOOKMARK QUERIES
// ==================

export const useSaveItineraryMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: (itineraryData: any) =>
      apiRequest<any>('/llm/prompt-response/bookmark', {
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
  
  return createMutation(() => ({
    mutationFn: (itineraryId: string) =>
      apiRequest<{ message: string }>(`/llm/prompt-response/bookmark/${itineraryId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
    },
  }));
};

// ==================
// SETTINGS QUERIES
// ==================

export const useSettings = () => {
  return createQuery(() => ({
    queryKey: queryKeys.settings,
    queryFn: () => apiRequest<any>('/user/preferences/'),
    staleTime: 10 * 60 * 1000,
  }));
};

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: ({ profileId, settings }: { profileId: string; settings: any }) =>
      apiRequest<any>(`/user/preferences/${profileId}`, {
        method: 'PUT',
        body: JSON.stringify(settings),
      }),
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userSettings(profileId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
  }));
};

// =======================
// TYPE DEFINITIONS
// =======================

export interface UserProfile {
  id: string;
  name: string;
  description: string;
  is_default: boolean;
  search_radius: number;
  preferred_time: string;
  budget_level: string;
  pace: string;
  accessibility_needs: string[];
  interests: string[];
  created_at: string;
}

export interface Interest {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created_at: string;
}

export interface PersonalTag {
  id: string;
  user_id: string;
  name: string;
  tag_type: string;
  description: string;
}

export interface POI {
  id: string;
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  timeToSpend: string;
  budget: string;
  rating: number;
  tags: string[];
  priority: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  hasItinerary?: boolean;
  itinerary?: any;
}

export interface ChatSession {
  id: string;
  profile_id: string;
  created_at: string;
  updated_at: string;
}

export interface ItineraryList {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  isPublic: boolean;
  allowCollaboration: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  owner: string;
  collaborators: string[];
}

export interface UserSavedItinerary {
  id: string;
  user_id: string;
  title: string;
  description: string;
  markdown_content: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedItinerariesResponse {
  itineraries: UserSavedItinerary[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  priceRange: string;
  rating: number;
  reviewCount: number;
  address: string;
  amenities: string[];
  features: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  latitude: number;
  longitude: number;
  priceRange: string;
  rating: number;
  reviewCount: number;
  address: string;
  features: string[];
  specialties: string[];
}

// =======================
// UTILITY HOOKS
// =======================

// Hook for invalidating all user-related queries on logout
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

// Hook for prefetching common data
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