// Legacy API Service for Loci Travel App
// NOTE: This file contains legacy API functions. For new development, prefer using 
// the query-based functions from './api-queries.ts' which provide better caching,
// optimistic updates, and error handling with @tanstack/solid-query.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Token management functions - moved to top to avoid circular dependency
export const getAuthToken = (): string | null => {
  // Check localStorage first (persistent), then sessionStorage (temporary)
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
};

export const setAuthToken = (token: string, rememberMe: boolean = false): void => {
  if (rememberMe) {
    localStorage.setItem('access_token', token);
    sessionStorage.removeItem('access_token');
  } else {
    sessionStorage.setItem('access_token', token);
    localStorage.removeItem('access_token');
  }
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('access_token');
  sessionStorage.removeItem('access_token');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Request wrapper with error handling and auth
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

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
  const response = await fetch(url, config);

  console.log('url', url)
  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized - redirect to login
      clearAuthToken();
      window.location.href = '/auth/signin';
      throw new Error('Unauthorized');
    }

    const errorData: any = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Authentication API
export const authAPI = {
  async login(email: string, password: string) {
    return apiRequest<{ access_token: string; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(username: string, email: string, password: string, role: string = 'user') {
    return apiRequest<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role }),
    });
  },

  async logout() {
    return apiRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },

  async validateSession() {
    const token = getAuthToken();
    console.log('validateSession: Token available?', !!token);
    if (!token) {
      console.log('validateSession: No token, returning invalid');
      return { valid: false };
    }

    console.log('validateSession: Making API request...');
    try {
      const result = await apiRequest<{ valid: boolean; user_id?: string; username?: string; email?: string }>('/auth/validate-session', {
        method: 'POST',
        body: JSON.stringify({}), // Token is sent in Authorization header by apiRequest
      });
      console.log('validateSession: API response:', result);
      return result;
    } catch (error) {
      console.error('validateSession: API error:', error);
      throw error;
    }
  },

  async updatePassword(oldPassword: string, newPassword: string) {
    return apiRequest<{ message: string }>('/auth/update-password', {
      method: 'PUT',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    });
  },

  async getCurrentUser() {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    return apiRequest<any>('/user/profile');
  }
};

// User Profile API
export const profileAPI = {
  async getProfiles() {
    return apiRequest<any[]>('/user/search-profile/');
  },

  async createProfile(profileData: any) {
    return apiRequest<any>('/user/search-profile/', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  async getProfile(profileId: string) {
    return apiRequest<any>(`/user/search-profile/${profileId}`);
  },

  async updateProfile(profileId: string, profileData: any) {
    return apiRequest<any>(`/user/search-profile/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  async deleteProfile(profileId: string) {
    return apiRequest<{ message: string }>(`/user/search-profile/${profileId}`, {
      method: 'DELETE',
    });
  },

  async getDefaultProfile() {
    return apiRequest<any>('/user/search-profile/default');
  },

  async setDefaultProfile(profileId: string) {
    return apiRequest<{ message: string }>(`/user/search-profile/default/${profileId}`, {
      method: 'PUT',
    });
  }
};

// Interests API
export const interestsAPI = {
  async getInterests() {
    return apiRequest<any[]>('/user/interests/');
  },

  async createInterest(name: string, description: string, active: boolean = true) {
    return apiRequest<any>('/user/interests/create', {
      method: 'POST',
      body: JSON.stringify({ name, description, active }),
    });
  },

  async updateInterest(interestId: string, data: any) {
    return apiRequest<any>(`/user/interests/${interestId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteInterest(interestId: string) {
    return apiRequest<{ message: string }>(`/user/interests/${interestId}`, {
      method: 'DELETE',
    });
  }
};

// Tags API
export const tagsAPI = {
  async getTags() {
    return apiRequest<any[]>('/user/tags/');
  },

  async createTag(name: string, description: string, tagType: string = 'preference') {
    return apiRequest<any>('/user/tags/', {
      method: 'POST',
      body: JSON.stringify({ name, description, tag_type: tagType }),
    });
  },

  async getTag(tagId: string) {
    return apiRequest<any>(`/user/tags/${tagId}`);
  },

  async updateTag(tagId: string, data: any) {
    return apiRequest<any>(`/user/tags/${tagId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteTag(tagId: string) {
    return apiRequest<{ message: string }>(`/user/tags/${tagId}`, {
      method: 'DELETE',
    });
  }
};

// Chat & LLM API
export const chatAPI = {
  async createChatSession(profileId: string) {
    return apiRequest<any>(`/llm/prompt-response/chat/sessions/${profileId}`, {
      method: 'POST',
    });
  },

  async createStreamingChatSession(profileId: string) {
    return apiRequest<any>(`/llm/prompt-response/chat/sessions/stream/${profileId}`, {
      method: 'POST',
    });
  },

  async sendMessage(sessionId: string, message: string) {
    return apiRequest<any>(`/llm/prompt-response/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  async sendStreamingMessage(sessionId: string, message: string) {
    // For streaming, we'd need to use EventSource or similar
    return fetch(`${API_BASE_URL}/llm/prompt-response/chat/sessions/${sessionId}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ message }),
    });
  },

  async getRecommendations(profileId: string, query: string) {
    return apiRequest<any>(`/llm/prompt-response/profile/${profileId}`, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  },

  async getPOIDetails(poiId: string) {
    return apiRequest<any>(`/llm/prompt-response/poi/details?poi_id=${poiId}`);
  },

  async getNearbyPOIs(lat: number, lng: number, radius?: number) {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      ...(radius && { radius: radius.toString() }),
    });
    return apiRequest<any>(`/llm/prompt-response/poi/nearby?${params}`);
  }
};

// POI & Favorites API
export const poiAPI = {
  async getFavorites() {
    return apiRequest<any[]>('/pois/favourites');
  },

  async addToFavorites(poiId: string) {
    return apiRequest<{ message: string }>('/pois/favourites', {
      method: 'POST',
      body: JSON.stringify({ poi_id: poiId }),
    });
  },

  async removeFromFavorites(poiId: string) {
    return apiRequest<{ message: string }>('/pois/favourites', {
      method: 'DELETE',
      body: JSON.stringify({ poi_id: poiId }),
    });
  },

  async getPOIsByCity(cityId: string) {
    return apiRequest<any[]>(`/pois/city/${cityId}`);
  },

  async searchPOIs(query: string, filters?: any) {
    const params = new URLSearchParams({ q: query, ...filters });
    return apiRequest<any[]>(`/pois/search?${params}`);
  },

  async getItineraries(page: number = 1, limit: number = 10) {
    return apiRequest<any>(`/pois/itineraries?page=${page}&limit=${limit}`);
  },

  async getItinerary(itineraryId: string) {
    return apiRequest<any>(`/pois/itineraries/itinerary/${itineraryId}`);
  },

  async updateItinerary(itineraryId: string, data: any) {
    return apiRequest<any>(`/pois/itineraries/itinerary/${itineraryId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};

// Lists API
export const listsAPI = {
  async createList(listData: any) {
    return apiRequest<any>('/itineraries/lists', {
      method: 'POST',
      body: JSON.stringify(listData),
    });
  },

  async getLists() {
    return apiRequest<any[]>('/itineraries/lists');
  },

  async getList(listId: string) {
    return apiRequest<any>(`/itineraries/lists/${listId}`);
  },

  async updateList(listId: string, listData: any) {
    return apiRequest<any>(`/itineraries/lists/${listId}`, {
      method: 'PUT',
      body: JSON.stringify(listData),
    });
  },

  async deleteList(listId: string) {
    return apiRequest<{ message: string }>(`/itineraries/lists/${listId}`, {
      method: 'DELETE',
    });
  },

  async createItinerary(parentListId: string, itineraryData: any) {
    return apiRequest<any>(`/itineraries/lists/${parentListId}/itineraries`, {
      method: 'POST',
      body: JSON.stringify(itineraryData),
    });
  },

  async addPOIToItinerary(itineraryId: string, poiData: any) {
    return apiRequest<any>(`/itineraries/${itineraryId}/items`, {
      method: 'POST',
      body: JSON.stringify(poiData),
    });
  },

  async updatePOIInItinerary(itineraryId: string, poiId: string, poiData: any) {
    return apiRequest<any>(`/itineraries/${itineraryId}/items/${poiId}`, {
      method: 'PUT',
      body: JSON.stringify(poiData),
    });
  },

  async removePOIFromItinerary(itineraryId: string, poiId: string) {
    return apiRequest<{ message: string }>(`/itineraries/${itineraryId}/items/${poiId}`, {
      method: 'DELETE',
    });
  }
};

// Hotels API
export const hotelsAPI = {
  async getHotelsByPreferences(preferences: any) {
    return apiRequest<any[]>('/llm/prompt-response/city/hotel/preferences', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  },

  async getNearbyHotels(lat: number, lng: number, radius?: number) {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      ...(radius && { radius: radius.toString() }),
    });
    return apiRequest<any[]>(`/llm/prompt-response/city/hotel/nearby?${params}`);
  },

  async getHotelDetails(hotelId: string) {
    return apiRequest<any>(`/llm/prompt-response/city/hotel/${hotelId}`);
  }
};

// Restaurants API
export const restaurantsAPI = {
  async getRestaurantsByPreferences(preferences: any) {
    return apiRequest<any[]>('/llm/prompt-response/city/restaurants/preferences', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  },

  async getNearbyRestaurants(lat: number, lng: number, radius?: number) {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      ...(radius && { radius: radius.toString() }),
    });
    return apiRequest<any[]>(`/llm/prompt-response/city/restaurants/nearby?${params}`);
  },

  async getRestaurantDetails(restaurantId: string) {
    return apiRequest<any>(`/llm/prompt-response/city/restaurants/${restaurantId}`);
  }
};

// Itinerary Bookmark API
export const bookmarkAPI = {
  async saveItinerary(itineraryData: any) {
    return apiRequest<any>('/llm/prompt-response/bookmark', {
      method: 'POST',
      body: JSON.stringify(itineraryData),
    });
  },

  async removeItinerary(itineraryId: string) {
    return apiRequest<{ message: string }>(`/llm/prompt-response/bookmark/${itineraryId}`, {
      method: 'DELETE',
    });
  }
};

// Settings API (using user preferences endpoint)
export const settingsAPI = {
  async getSettings() {
    return apiRequest<any>('/user/preferences/');
  },

  async updateSettings(profileId: string, settings: any) {
    return apiRequest<any>(`/user/preferences/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
};

// Type definitions for better TypeScript support
export interface LoginResponse {
  access_token: string;
  message: string;
}

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

// Error handling utility
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

// Utility functions
export const uploadFile = async (file: File, endpoint: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new APIError(`Upload failed: ${response.statusText}`, response.status);
  }

  const result: any = await response.json();
  return result.url || result.path;
};