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