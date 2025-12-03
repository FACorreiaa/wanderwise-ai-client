import { useQuery } from "@tanstack/solid-query";
import { getAuthToken } from "../api";

// Get API base URL
const API_BASE_URL =
  import.meta.env.VITE_CONNECT_BASE_URL || "http://localhost:8000";

// Statistics types
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

// Helper function for making authenticated requests
async function statisticsRequest<T>(endpoint: string): Promise<T> {
  const token = getAuthToken();
  const url = `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// API functions
export const getMainPageStatistics = async (): Promise<MainPageStatistics> => {
  return statisticsRequest<MainPageStatistics>("/statistics/main-page");
};

export const getDetailedPOIStatistics =
  async (): Promise<DetailedPOIStatistics> => {
    return statisticsRequest<DetailedPOIStatistics>("/user-statistics/poi/detailed");
  };

export const getLandingPageStatistics =
  async (): Promise<LandingPageUserStats> => {
    // return statisticsRequest<LandingPageUserStats>("/user-statistics/landing-page");
    console.log("⏸ Landing page stats call disabled for /user-statistics/landing-page");
    return {
      saved_places: 0,
      itineraries: 0,
      cities_explored: 0,
      discoveries: 0,
    };
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

// SSE connection class for real-time statistics updates
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
    this.onError = onError;
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
