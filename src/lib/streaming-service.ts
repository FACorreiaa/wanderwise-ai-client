// Streaming service for the unified chat API.
//
// This consumes the ONE canonical stream reader (streamChatEvents) — which reads
// the typed proto oneof directly — and projects normalized events onto a
// StreamingSession, preserving the manager callback contract that useChat relies
// on (onProgress / onComplete / onError / onRedirect).
//
// The previous implementation hand-rolled an SSE text parser plus a
// brace-counting JSON accumulator (chunkBuffer) because structured data used to
// arrive as buffered LLM text chunks. Structured data now arrives as typed
// events, so all of that machinery is gone.

import type {
  StreamingSession,
  DomainType,
  UnifiedChatResponse,
  AiCityResponse,
  AccommodationResponse,
  DiningResponse,
  ActivitiesResponse,
  HotelDetailedInfo,
  RestaurantDetailedInfo,
} from "./api/types";
import {
  streamChatEvents,
  type ChatStreamParams,
  type LociStreamEvent,
} from "./streaming/chatStream";

export interface StreamingSessionManager {
  session: StreamingSession;
  onProgress: (session: StreamingSession) => void;
  onComplete: (session: StreamingSession) => void;
  onError: (error: string) => void;
  onRedirect?: (domain: DomainType, data: UnifiedChatResponse) => void;
}

export class StreamingChatService {
  private manager: StreamingSessionManager | null = null;
  private controller: AbortController | null = null;
  private aborted = false;

  constructor() {}

  /**
   * Open a chat stream for the given request and drive the manager callbacks.
   * (Previously took a pre-opened SSE Response; now it owns the stream so it can
   * thread profile/session and cancel cleanly.)
   */
  public startStream(params: ChatStreamParams, manager: StreamingSessionManager): void {
    this.manager = manager;
    this.aborted = false;
    this.controller = new AbortController();
    void this.run(params);
  }

  /** Stop the in-flight stream. Finalizes the partial session (onComplete),
   *  does not surface an error. */
  public stop(): void {
    if (!this.controller) return;
    this.aborted = true;
    this.controller.abort();
  }

  private async run(params: ChatStreamParams): Promise<void> {
    if (!this.manager || !this.controller) return;
    try {
      for await (const event of streamChatEvents(params, this.controller.signal)) {
        if (this.aborted) break;
        this.project(event);
      }
      this.handleStreamComplete();
    } catch (error) {
      if (this.aborted) {
        this.handleStreamComplete();
        return;
      }
      console.error("Stream processing error:", error);
      this.manager?.onError(`Stream error: ${error}`);
    } finally {
      this.controller = null;
    }
  }

  // Project a normalized event onto the session and fire callbacks.
  private project(event: LociStreamEvent): void {
    const mgr = this.manager;
    if (!mgr) return;
    const isCity = mgr.session.domain === "general" || mgr.session.domain === "itinerary";

    switch (event.kind) {
      case "start":
        if (event.sessionId) mgr.session.sessionId = event.sessionId;
        if (event.domain) mgr.session.domain = event.domain as DomainType;
        if (event.city) mgr.session.city = event.city;
        mgr.onProgress(mgr.session);
        break;

      case "token":
      case "partial":
        // Incremental text is surfaced through onProgress; the session's
        // structured data is populated by the typed events below.
        mgr.onProgress(mgr.session);
        break;

      case "city_data":
        if (isCity && event.city) {
          const data = (mgr.session.data ?? {}) as Partial<AiCityResponse>;
          data.general_city_data = event.city;
          data.session_id = mgr.session.sessionId;
          mgr.session.data = data;
        }
        if (event.city?.city) mgr.session.city = event.city.city;
        mgr.onProgress(mgr.session);
        break;

      case "general_pois":
        if (isCity) {
          const data = (mgr.session.data ?? {}) as Partial<AiCityResponse>;
          data.points_of_interest = event.pois;
          if (event.city) data.general_city_data = event.city;
          mgr.session.data = data;
        }
        mgr.onProgress(mgr.session);
        break;

      case "itinerary":
        // The itinerary event carries the full aggregate city response.
        mgr.session.data = event.cityResponse;
        if (event.cityResponse.general_city_data?.city) {
          mgr.session.city = event.cityResponse.general_city_data.city;
        }
        mgr.onProgress(mgr.session);
        break;

      case "hotels":
        if (event.city?.city) mgr.session.city = event.city.city;
        mgr.session.data = {
          general_city_data: event.city,
          // Slice 1: hotels are POI-shaped end-to-end (see chatStream.ts).
          hotels: event.pois as unknown as HotelDetailedInfo[],
          domain: "accommodation",
          session_id: event.sessionId || mgr.session.sessionId,
        } as AccommodationResponse;
        mgr.onProgress(mgr.session);
        break;

      case "restaurants":
        if (event.city?.city) mgr.session.city = event.city.city;
        mgr.session.data = {
          general_city_data: event.city,
          restaurants: event.pois as unknown as RestaurantDetailedInfo[],
          domain: "dining",
          session_id: event.sessionId || mgr.session.sessionId,
        } as DiningResponse;
        mgr.onProgress(mgr.session);
        break;

      case "activities":
        if (event.city?.city) mgr.session.city = event.city.city;
        mgr.session.data = {
          general_city_data: event.city,
          activities: event.pois,
          domain: "activities",
          session_id: event.sessionId || mgr.session.sessionId,
        } as ActivitiesResponse;
        mgr.onProgress(mgr.session);
        break;

      case "progress":
        mgr.onProgress(mgr.session);
        break;

      case "error":
        mgr.session.error = event.userMessage;
        mgr.onError(event.userMessage);
        break;

      case "complete":
        this.handleComplete(event);
        break;
    }
  }

  private handleComplete(event: Extract<LociStreamEvent, { kind: "complete" }>): void {
    const mgr = this.manager;
    if (!mgr) return;
    if (mgr.session.isComplete) return; // guard double-complete

    // If the aggregate arrived on the complete event, prefer it.
    if (event.result) {
      mgr.session.data = event.result;
      if (event.result.general_city_data?.city) {
        mgr.session.city = event.result.general_city_data.city;
      }
    }
    if (event.sessionId) mgr.session.sessionId = event.sessionId;

    mgr.session.isComplete = true;
    mgr.onComplete(mgr.session);

    if (mgr.onRedirect && mgr.session.data) {
      mgr.onRedirect(mgr.session.domain, mgr.session.data as UnifiedChatResponse);
    }
  }

  private handleStreamComplete(): void {
    if (!this.manager) return;
    if (!this.manager.session.isComplete) {
      // Stream ended without an explicit complete event — finalize anyway.
      this.manager.session.isComplete = true;
      this.manager.onComplete(this.manager.session);
    }
  }

  // Clean up resources
  public cleanup(): void {
    this.stop();
    this.manager = null;
  }
}

// Helper function to create a streaming session
export const createStreamingSession = (domain: DomainType = "general"): StreamingSession => {
  return {
    sessionId: "",
    domain,
    data: {},
    isComplete: false,
  };
};

// Helper function to get route path based on domain
export const getDomainRoute = (domain: DomainType, sessionId?: string, city?: string): string => {
  let baseRoute: string;

  switch (domain) {
    case "itinerary":
    case "general":
      baseRoute = "/itinerary";
      break;
    case "accommodation":
      baseRoute = "/hotels";
      break;
    case "dining":
      baseRoute = "/restaurants";
      break;
    case "activities":
      baseRoute = "/activities";
      break;
    default:
      baseRoute = "/itinerary";
      break;
  }

  // Add query parameters if provided
  const params = new URLSearchParams();
  if (sessionId) params.append("sessionId", sessionId);
  if (city) params.append("cityName", city);
  if (domain) params.append("domain", domain);

  const queryString = params.toString();
  return queryString ? `${baseRoute}?${queryString}` : baseRoute;
};

// Export singleton instance
export const streamingService = new StreamingChatService();
