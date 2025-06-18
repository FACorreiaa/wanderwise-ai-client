// Cities API functions
import { useQuery } from '@tanstack/solid-query';
import { apiRequest, queryKeys } from './shared';

// City type based on the backend CityDetail type
export interface City {
  id: string;
  name: string;
  country: string;
  state_province?: string;
  ai_summary: string;
  center_latitude?: number;
  center_longitude?: number;
}

// City with coordinates (simplified for frontend use)
export interface CityWithCoordinates {
  id: string;
  label: string;
  lat: number | null;
  lon: number | null;
}

// ===============
// CITY QUERIES
// ===============

// Get all cities from database
export const getCities = async (): Promise<City[]> => {
  return apiRequest<City[]>('/cities');
};

// React Query hook for getting all cities
export const useCities = () => {
  return useQuery(() => ({
    queryKey: queryKeys.cities,
    queryFn: getCities,
    staleTime: 30 * 60 * 1000, // Cities don't change often, cache for 30 minutes
  }));
};

// Helper function to convert backend cities to frontend format
export const convertCitiesToDropdownFormat = (cities: City[]): CityWithCoordinates[] => {
  const frontendCities: CityWithCoordinates[] = [
    { id: 'all', label: 'All Cities', lat: null, lon: null }
  ];

  cities.forEach(city => {
    frontendCities.push({
      id: city.name.toLowerCase().replace(/\s+/g, '-'), // Convert "New York" to "new-york"
      label: city.name,
      lat: city.center_latitude || null,
      lon: city.center_longitude || null,
    });
  });

  return frontendCities;
};