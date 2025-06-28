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
  stats?: {
    places_visited?: number;
    reviews_written?: number;
    lists_created?: number;
    followers?: number;
    following?: number;
  };
  badges?: string[];
  social_links?: Record<string, string>;
  preferences?: Record<string, unknown>;
  settings?: Record<string, unknown>;
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
  role?: 'user' | 'assistant' | 'system'; // For backward compatibility
  content: string;
  timestamp: Date;
  hasItinerary?: boolean;
  itinerary?: AIItineraryResponse;
  metadata?: {
    session_id?: string;
    domain?: DomainType;
    user_location?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface ChatSession {
  id: string;
  profile_id: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSessionResponse {
  id: string;
  profile_id: string;
  city_name?: string;
  conversation_history: ChatMessage[];
  created_at: string;
  updated_at: string;
  performance_metrics?: SessionPerformanceMetrics;
  content_metrics?: SessionContentMetrics;
  engagement_metrics?: SessionEngagementMetrics;
}

export interface SessionPerformanceMetrics {
  avg_response_time_ms: number;
  total_tokens: number;
  prompt_tokens: number;
  completion_tokens: number;
  models_used: string[];
  total_latency_ms: number;
}

export interface SessionContentMetrics {
  total_pois: number;
  total_hotels: number;
  total_restaurants: number;
  cities_covered: string[];
  has_itinerary: boolean;
  complexity_score: number;
  dominant_categories: string[];
}

export interface SessionEngagementMetrics {
  message_count: number;
  conversation_duration: number; // in nanoseconds
  user_message_count: number;
  assistant_message_count: number;
  avg_message_length: number;
  peak_activity_time?: string;
  engagement_level: 'low' | 'medium' | 'high';
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

// ==================
// STREAMING TYPES
// ==================

export type DomainType = 'general' | 'itinerary' | 'accommodation' | 'dining' | 'activities';

export type StreamEventType = 'start' | 'chunk' | 'complete' | 'error' | 'city_data' | 'general_pois' | 'itinerary' | 'hotels' | 'restaurants' | 'activities';

// Streaming chunk data interfaces
export interface StreamChunkData {
  chunk?: string;
  part?: string;
}

export interface StreamCompleteData {
  domain?: DomainType;
  city?: string;
  session_id?: string;
}

export interface StreamEvent {
  type: StreamEventType;
  data?: UnifiedChatResponse | GeneralCityData | POIDetailedInfo[] | HotelDetailedInfo[] | RestaurantDetailedInfo[] | AIItineraryResponse | StreamChunkData | StreamCompleteData | string;
  error?: string;
  event_id?: string;
  timestamp?: string;
  is_final?: boolean;
}

export interface GeneralCityData {
  city: string;
  country: string;
  state_province: string;
  description: string;
  center_latitude: number;
  center_longitude: number;
  population: string;
  area: string;
  timezone: string;
  language: string;
  weather: string;
  attractions: string;
  history: string;
}

export interface POIDetail {
  id: string;
  llm_interaction_id: string;
  city: string;
  city_id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  description_poi: string;
  address: string;
  website: string;
  opening_hours: string;
  distance: number;
}

export interface AIItineraryResponse {
  itinerary_name: string;
  overall_description: string;
  points_of_interest: POIDetailedInfo[];
}

export interface AiCityResponse {
  general_city_data: GeneralCityData;
  points_of_interest: POIDetailedInfo[];
  itinerary_response: AIItineraryResponse;
  session_id: string;
}

export interface HotelDetailedInfo {
  id: string;
  city: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  description: string;
  address?: string;
  website?: string;
  phone_number?: string;
  opening_hours?: string;
  price_level?: string;
  amenities: string[];
  tags: string[];
  images: string[];
  rating: number;
  llm_interaction_id: string;
}

export interface RestaurantDetailedInfo {
  id: string;
  city: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  description: string;
  address?: string;
  website?: string;
  phone_number?: string;
  opening_hours?: string;
  price_level?: string;
  cuisine_type?: string;
  tags: string[];
  images: string[];
  rating: number;
  llm_interaction_id: string;
}

export interface POIDetailedInfo {
  id: string;
  city: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  description: string;
  address?: string;
  website?: string;
  phone_number?: string;
  opening_hours?: string;
  price_level?: string;
  amenities?: string[];
  tags: string[];
  images: string[];
  rating: number;
  time_to_spend?: string;
  budget?: string;
  priority?: number; // Popularity score 1-10
  llm_interaction_id: string;
}

// Domain-specific response types
export interface AccommodationResponse {
  hotels: HotelDetailedInfo[];
  domain: 'accommodation';
  session_id: string;
}

export interface DiningResponse {
  restaurants: RestaurantDetailedInfo[];
  domain: 'dining';
  session_id: string;
}

export interface ActivitiesResponse {
  activities: POIDetailedInfo[];
  domain: 'activities';
  session_id: string;
}

export type UnifiedChatResponse = AiCityResponse | AccommodationResponse | DiningResponse | ActivitiesResponse;

// Streaming session management
export interface StreamingSession {
  sessionId: string;
  domain: DomainType;
  city?: string;
  data: Partial<UnifiedChatResponse>;
  isComplete: boolean;
  error?: string;
}

// Recent searches and activity types
export interface RecentSearch {
  id: string;
  query: string;
  location?: string;
  timestamp: string;
  domain: DomainType;
  results_count?: number;
}

export interface RecentActivity {
  id: string;
  type: 'search' | 'poi_view' | 'hotel_view' | 'restaurant_view' | 'itinerary_save' | 'list_create';
  entity_id?: string;
  entity_name?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface RecentsResponse {
  recent_searches: RecentSearch[];
  recent_activity: RecentActivity[];
  pois?: POIDetailedInfo[];
  hotels?: HotelDetailedInfo[];
  restaurants?: RestaurantDetailedInfo[];
}

// API Error response types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp?: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  success: boolean;
  message?: string;
}

// Event handler types for components
export interface PhotoUploadEvent extends Event {
  target: HTMLInputElement & {
    files: FileList | null;
  };
}

export interface UploadedPhoto {
  id: string;
  url: string;
  file: File;
  uploaded?: boolean;
}

// Search and filter types
export interface SearchFilters {
  category?: string[];
  priceRange?: string;
  rating?: number;
  distance?: number;
  amenities?: string[];
  tags?: string[];
}

export interface SearchParams {
  query?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
}

// Preferences types for API calls
export interface HotelPreferences extends SearchParams {
  accommodation_type?: string[];
  star_rating?: { min: number; max: number };
  price_range_per_night?: { min: number; max: number };
  amenities?: string[];
  room_type?: string[];
}

export interface RecentInteraction {
    id: string;
    user_id: string;
    city_name: string;
    city_id: string | null;
    prompt: string;
    response_text: string;
    model_used: string;
    latency_ms: number;
    created_at: string;
    pois: POIDetailedInfo[];
    hotels: HotelDetailedInfo[];
    restaurants: RestaurantDetailedInfo[];
}

export interface CityInteractions {
    city_name: string;
    interactions: RecentInteraction[];
    poi_count: number;
    last_activity: string;
}

export interface RecentInteractionsResponse {
    cities: CityInteractions[];
    total: number;
}
