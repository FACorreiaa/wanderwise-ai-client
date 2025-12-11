import { createQuery } from '@tanstack/solid-query';
import { createClient } from "@connectrpc/connect";
import { RecentsService, GetRecentInteractionsRequestSchema } from "@buf/loci_loci-proto.bufbuild_es/proto/loci/recents/recents_pb.js";
import { create } from "@bufbuild/protobuf";
import { transport } from "../connect-transport";
import { getAuthToken, authAPI } from "../api";
import type { RecentInteractionsResponse, CityInteractions, RecentInteraction } from './types';

// Create authenticated recents client
const recentsClient = createClient(RecentsService, transport);

// Helper to get current user ID from session
const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const session = await authAPI.validateSession();
    if (session.valid && session.user_id) {
      return session.user_id;
    }
  } catch (e) {
    console.warn("Failed to get user ID from session:", e);
  }
  return null;
};

// Fetch recent interactions via RPC
async function fetchRecentInteractions(limit: number = 10): Promise<RecentInteractionsResponse> {
  const userId = await getCurrentUserId();

  if (!userId) {
    console.warn("No user ID available for recents");
    return { cities: [], total: 0, offset: 0, limit };
  }

  try {
    const response = await recentsClient.getRecentInteractions(
      create(GetRecentInteractionsRequestSchema, {
        userId: userId,
        limit: limit,
        offset: 0,
        groupByCity: true,
      })
    );

    // Map proto response to frontend types
    const cities: CityInteractions[] = (response.citySummaries || []).map(summary => ({
      city_name: summary.cityName || '',
      city_id: summary.cityId || null,
      interactions: (summary.recentInteractions || []).map(interaction => ({
        id: interaction.id || '',
        user_id: interaction.userId || '',
        city_name: summary.cityName || '',
        city_id: null,
        prompt: interaction.description || '',
        response_text: '',
        model_used: '',
        latency_ms: 0,
        created_at: interaction.createdAt
          ? new Date(Number(interaction.createdAt.seconds) * 1000).toISOString()
          : new Date().toISOString(),
        pois: [],
        hotels: [],
        restaurants: [],
      })),
      poi_count: Number(summary.interactionCount || 0),
      last_activity: summary.latestInteraction
        ? new Date(Number(summary.latestInteraction.seconds) * 1000).toISOString()
        : new Date().toISOString(),
      total_interactions: Number(summary.interactionCount || 0),
      total_favorites: 0,
      total_itineraries: 0,
    }));

    return {
      cities,
      total: Number(response.totalCount || 0),
      offset: 0,
      limit,
    };
  } catch (error) {
    console.error("Failed to fetch recent interactions via RPC:", error);
    return { cities: [], total: 0, offset: 0, limit };
  }
}

// Hook for recent interactions (RPC-based)
export const useRecentInteractions = (limit: number = 10) => {
  return createQuery(() => ({
    queryKey: ['recents', 'interactions', limit],
    queryFn: () => fetchRecentInteractions(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  }));
};

// Hook for city details (uses same RPC but filters)
export const useCityDetails = (cityName: string) => {
  return createQuery(() => ({
    queryKey: ['recents', 'city', cityName],
    queryFn: async (): Promise<CityInteractions | null> => {
      const response = await fetchRecentInteractions(50);
      const city = response.cities.find(c => c.city_name === cityName);
      return city || null;
    },
    enabled: !!cityName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  }));
};
