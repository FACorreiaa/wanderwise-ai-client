// Type definitions for API responses

export interface UserProfile {
  id: string;
  username: string;
  description: string;
  is_default: boolean;
  search_radius: number;
  preferred_time: string;
  budget_level: string;
  pace: string;
  accessibility_needs: string[];
  about_you: string;
  interests: string[];
  created_at: string;
}

// Define the actual user profile response type
export interface UserProfileResponse {
  id?: string;
  username?: string;
  email?: string;
  about_you?: string;
  location?: string;
  profile_image_url?: string;
  created_at?: string;
  interests?: string[];
  [key: string]: any;
}



// Define the processed profile data type
export interface ProcessedProfileData {
  id?: string;
  username?: string;
  email?: string;
  bio?: string;
  location?: string;
  joinedDate?: string;
  avatar?: string;
  interests: string[];
  badges: string[];
  stats: {
    places_visited: number;
    reviews_written: number;
    lists_created: number;
    followers: number;
    following: number;
  };
}



export interface Interest {
  id: string;
  name: string;
  description?: string | null;
  active?: boolean | null;
  created_at: string;
  updated_at?: string | null;
  source: 'global' | 'custom';
}

export interface PersonalTag {
  id: string;
  user_id?: string;
  name: string;
  tag_type: string;
  description?: string | null;
  source?: 'global' | 'personal' | null;
  active?: boolean | null;
  created_at: string;
  updated_at?: string | null;
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

// Search Profile Types
export interface SearchProfile {
  id: string;
  user_id: string;
  profile_name: string;
  is_default: boolean;
  search_radius_km: number;
  preferred_time: string;
  budget_level: number;
  preferred_pace: string;
  prefer_accessible_pois: boolean;
  prefer_outdoor_seating: boolean;
  prefer_dog_friendly: boolean;
  preferred_vibes: string[];
  preferred_transport: string;
  dietary_needs: string[];
  interests: string[] | null;
  tags: string[] | null;
  user_latitude: number | null;
  user_longitude: number | null;
  created_at: string;
  updated_at: string;
}

// Domain-specific preference types based on SEARCH_FILTERS_SUGGESTIONS.md
export interface AccommodationPreferences {
  accommodation_type: string[];
  star_rating: { min: number; max: number };
  price_range_per_night: { min: number; max: number };
  amenities: string[];
  room_type: string[];
  chain_preference: string;
  cancellation_policy: string[];
  booking_flexibility: string;
}

export interface DiningPreferences {
  cuisine_types: string[];
  meal_types: string[];
  service_style: string[];
  price_range_per_person: { min: number; max: number };
  dietary_needs: string[];
  allergen_free: string[];
  michelin_rated: boolean;
  local_recommendations: boolean;
  chain_vs_local: string;
  organic_preference: boolean;
  outdoor_seating_preferred: boolean;
}

export interface ActivityPreferences {
  activity_categories: string[];
  physical_activity_level: string;
  indoor_outdoor_preference: string;
  cultural_immersion_level: string;
  must_see_vs_hidden_gems: string;
  educational_preference: boolean;
  photography_opportunities: boolean;
  season_specific_activities: string[];
  avoid_crowds: boolean;
  local_events_interest: string[];
}

export interface ItineraryPreferences {
  planning_style: string;
  preferred_pace: string;
  time_flexibility: string;
  morning_vs_evening: string;
  weekend_vs_weekday: string;
  preferred_seasons: string[];
  avoid_peak_season: boolean;
  adventure_vs_relaxation: string;
  spontaneous_vs_planned: string;
}

export interface TravelProfileFormData {
  profile_name: string;
  is_default: boolean;
  search_radius_km: number;
  preferred_time: string;
  budget_level: number;
  preferred_pace: string;
  prefer_accessible_pois: boolean;
  prefer_outdoor_seating: boolean;
  prefer_dog_friendly: boolean;
  preferred_vibes: string[];
  preferred_transport: string;
  dietary_needs: string[];
  interests: string[];
  tags: string[];
  accommodation_preferences?: AccommodationPreferences;
  dining_preferences?: DiningPreferences;
  activity_preferences?: ActivityPreferences;
  itinerary_preferences?: ItineraryPreferences;
}