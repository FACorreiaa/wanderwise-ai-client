import { apiRequest } from './shared';
import { POIDetailedInfo, HotelDetailedInfo, RestaurantDetailedInfo } from './types';

// Types for recent interactions
export interface RecentInteraction {
  id: string;
  user_id: string;
  city_name: string;
  city_id?: string;
  prompt: string;
  response_text?: string;
  model_used: string;
  latency_ms: number;
  created_at: string;
  pois?: POIDetailedInfo[];
  hotels?: HotelDetailedInfo[];
  restaurants?: RestaurantDetailedInfo[];
}

export interface CityInteractions {
  city_name: string;
  city_id?: string;
  interactions: RecentInteraction[];
  poi_count: number;
  last_activity: string;
}

export interface RecentInteractionsResponse {
  cities: CityInteractions[];
  total: number;
}

// API Functions
export async function fetchUserRecentInteractions(limit = 10): Promise<RecentInteractionsResponse> {
  return apiRequest<RecentInteractionsResponse>(`/recents?limit=${limit}`);
}

export async function fetchCityDetailsForUser(cityName: string): Promise<CityInteractions> {
  const encodedCityName = encodeURIComponent(cityName);
  return apiRequest<CityInteractions>(`/recents/city/${encodedCityName}`);
}