import { useQuery } from "@tanstack/solid-query";
import { getAuthToken, authAPI } from "../api";
import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { StatisticsService } from "@buf/loci_loci-proto.bufbuild_es/proto/statistics_pb.js";

// Get API base URL
const API_BASE_URL =
  import.meta.env.VITE_CONNECT_BASE_URL || "http://localhost:8000";

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

// Create transport for ConnectRPC
const createStatisticsTransport = () => {
  const token = getAuthToken();
  return createConnectTransport({
    baseUrl: API_BASE_URL,
    interceptors: [
      (next) => async (req) => {
        if (token) {
          req.header.set("Authorization", `Bearer ${token}`);
        }
        return await next(req);
      },
    ],
  });
};

// Statistics types (matching proto definitions)
export interface MainPageStatistics {
  total_users_count: number;
  total_itineraries_saved: number;
  total_unique_pois: number;
}

export interface DetailedPOIStatistics {
  general_pois: number;
  suggested_pois: number;
  hotels: number;
  restaurants: number;
  total_pois: number;
}

export interface StatisticsSSEEvent {
  type: "initial" | "update";
  timestamp: number;
  data: MainPageStatistics;
}

export interface LandingPageUserStats {
  saved_places: number;
  itineraries: number;
  cities_explored: number;
  discoveries: number;
}

// RPC API functions
export const getMainPageStatistics = async (): Promise<MainPageStatistics> => {
  try {
    const transport = createStatisticsTransport();
    const client = createClient(StatisticsService, transport);
    const response = await client.getMainPageStatistics({
      includeTrends: false,
      timeRange: "7d",
    });

    const stats = response.statistics;
    return {
      total_users_count: Number(stats?.totalUsers || 0),
      total_itineraries_saved: Number(stats?.totalItineraries || 0),
      total_unique_pois: Number(stats?.totalPois || 0),
    };
  } catch (error) {
    console.error("Failed to fetch main page statistics via RPC:", error);
    // Return zeros on error
    return {
      total_users_count: 0,
      total_itineraries_saved: 0,
      total_unique_pois: 0,
    };
  }
};

export const getDetailedPOIStatistics = async (): Promise<DetailedPOIStatistics> => {
  try {
    const transport = createStatisticsTransport();
    const client = createClient(StatisticsService, transport);
    const response = await client.getDetailedPOIStatistics({});

    const stats = response.statistics;
    return {
      general_pois: Number(stats?.favoritePoisCount || 0),
      suggested_pois: 0,
      hotels: 0,
      restaurants: 0,
      total_pois: Number(stats?.totalPoiSearches || 0),
    };
  } catch (error) {
    console.error("Failed to fetch detailed POI statistics via RPC:", error);
    return {
      general_pois: 0,
      suggested_pois: 0,
      hotels: 0,
      restaurants: 0,
      total_pois: 0,
    };
  }
};

export const getLandingPageStatistics = async (): Promise<LandingPageUserStats> => {
  try {
    const token = getAuthToken();
    if (!token) {
      return {
        saved_places: 0,
        itineraries: 0,
        cities_explored: 0,
        discoveries: 0,
      };
    }

    // Get user ID from session for the RPC request
    const userId = await getCurrentUserId();
    if (!userId) {
      console.warn("No user ID available for landing page statistics");
      return {
        saved_places: 0,
        itineraries: 0,
        cities_explored: 0,
        discoveries: 0,
      };
    }

    const transport = createStatisticsTransport();
    const client = createClient(StatisticsService, transport);
    const response = await client.getLandingPageStatistics({
      userId: userId,
    });

    const stats = response.statistics;
    return {
      saved_places: Number(stats?.newFavoritesThisWeek || 0),
      itineraries: Number(stats?.itinerariesCreatedThisMonth || 0),
      cities_explored: 0, // Not directly available in response
      discoveries: Number(stats?.searchesThisWeek || 0),
    };
  } catch (error) {
    console.error("Failed to fetch landing page statistics via RPC:", error);
    return {
      saved_places: 0,
      itineraries: 0,
      cities_explored: 0,
      discoveries: 0,
    };
  }
};

// Custom hooks for statistics
export const useMainPageStatistics = () => {
  return useQuery(() => ({
    queryKey: ["statistics", "main-page"],
    queryFn: getMainPageStatistics,
    // Twice a day is enough for the landing observability surface
    refetchInterval: 1000 * 60 * 60 * 12,
    staleTime: 1000 * 60 * 60 * 6,
    retry: 1,
  }));
};

export const useDetailedPOIStatistics = () => {
  return useQuery(() => ({
    queryKey: ["statistics", "poi", "detailed"],
    queryFn: getDetailedPOIStatistics,
    refetchInterval: 60000, // Refetch every minute as fallback
    staleTime: 30000, // Consider data stale after 30 seconds
    enabled: !!getAuthToken(), // Only fetch if authenticated
  }));
};

export const useLandingPageStatistics = () => {
  return useQuery(() => ({
    queryKey: ["statistics", "landing-page"],
    queryFn: getLandingPageStatistics,
    refetchInterval: 60000, // Refetch every minute as fallback
    staleTime: 30000, // Consider data stale after 30 seconds
    enabled: !!getAuthToken(), // Only fetch if user is authenticated
  }));
};

// SSE connection class for real-time statistics updates (kept for compatibility)
export class StatisticsSSE {
  private eventSource: EventSource | null = null;
  private onUpdate: ((stats: MainPageStatistics) => void) | null = null;
  private onError: ((error: Event) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  constructor(
    onUpdate: (stats: MainPageStatistics) => void,
    onError?: (error: Event) => void,
  ) {
    this.onUpdate = onUpdate;
    this.onError = onError as any;
  }

  connect() {
    try {
      // Get base URL from environment
      const baseURL = API_BASE_URL;

      // Statistics endpoint is public - no authentication required for aggregate stats
      const url = `${baseURL}/statistics/main-page/stream`;

      this.eventSource = new EventSource(url);

      this.eventSource.addEventListener("statistics", (event) => {
        try {
          const eventData: StatisticsSSEEvent = JSON.parse(event.data);
          this.onUpdate?.(eventData.data);
          this.reconnectAttempts = 0; // Reset on successful message
        } catch (error) {
          console.error("Error parsing SSE statistics data:", error);
        }
      });

      this.eventSource.onerror = (event) => {
        console.error("SSE Error:", event);
        this.onError?.(event);

        // Attempt reconnection with exponential backoff
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(
            () => {
              this.reconnectAttempts++;
              console.log(
                `Attempting SSE reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
              );
              this.disconnect();
              this.connect();
            },
            this.reconnectDelay * Math.pow(2, this.reconnectAttempts),
          );
        }
      };

      this.eventSource.onopen = () => {
        console.log("SSE connection established for statistics");
        this.reconnectAttempts = 0;
      };
    } catch (error) {
      console.error("Error creating SSE connection:", error);
      this.onError?.(error as Event);
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log("SSE connection closed");
    }
  }

  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}

// Hook for real-time statistics with SSE
export const useRealTimeStatistics = (
  onUpdate?: (stats: MainPageStatistics) => void,
  onError?: (error: Event) => void,
) => {
  let sseConnection: StatisticsSSE | null = null;

  const connect = () => {
    if (sseConnection) {
      sseConnection.disconnect();
    }

    sseConnection = new StatisticsSSE(
      (stats) => {
        onUpdate?.(stats);
      },
      (error) => {
        onError?.(error);
      },
    );

    sseConnection.connect();
  };

  const disconnect = () => {
    if (sseConnection) {
      sseConnection.disconnect();
      sseConnection = null;
    }
  };

  return {
    connect,
    disconnect,
    isConnected: () => sseConnection?.isConnected() ?? false,
  };
};
