// src/types/chat.ts

export interface POIDetailedInfo {
  name: string;
  category: string;
  description_poi: string;
  address: string;
  opening_hours: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  website?: string;
}

export interface GeneralCityData {
  city: string;
  country: string;
  description: string;
  population: string;
  area: string;
  language: string;
  weather: string;
  center_latitude?: number;
  center_longitude?: number;
  state_province?: string;
  timezone?: string;
  attractions?: string;
  history?: string;
}

export interface ItineraryResponse {
  itinerary_name: string;
  overall_description: string;
  points_of_interest: POIDetailedInfo[];
}

export interface Hotel {
  address: string;
  category: string;
  city: string;
  description: string;
  distance: number;
  images: null | string[];
  latitude: number;
  longitude: number;
  name: string;
  opening_hours: null | string;
  phone_number: string;
  price_range: string;
  rating: number;
  tags: string[];
  website: string;
}

export interface AccommodationResponse {
  hotels: Hotel[];
}

export interface DiningResponse {
  restaurants: any[]; // Using any for now or define Restaurant interface if available
}

export interface AiCityResponse {
  general_city_data?: GeneralCityData;
  itinerary_response?: ItineraryResponse;
  points_of_interest?: POIDetailedInfo[];
  accommodation_response?: AccommodationResponse;
  dining_response?: DiningResponse;
  session_id?: string;
  // Dynamic properties might exist
  [key: string]: any;
}
