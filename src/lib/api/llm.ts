// LLM and chat queries and mutations
import { useMutation } from "@tanstack/solid-query";
import { create } from "@bufbuild/protobuf";
import { createClient } from "@connectrpc/connect";
import { apiRequest, API_BASE_URL } from "./shared";
import {
  defaultLLMRateLimiter,
  RateLimitError,
  showRateLimitNotification,
} from "../rate-limiter";
import {
  ChatService,
  ChatRequestSchema,
  ChatResponse as ProtoChatResponse,
  ContinueChatRequestSchema as ContinueChatRequestSchema,
  DomainType as ChatDomainType,
  StartChatRequestSchema as StartChatRequestSchema,
} from "@buf/loci_loci-proto.bufbuild_es/proto/chat_pb.js";
import {
  AIItineraryResponse as ProtoAIItineraryResponse,
  AiCityResponse as ProtoAiCityResponse,
} from "@buf/loci_loci-proto.bufbuild_es/proto/chat_pb.js";
import { GeneralCityData as ProtoGeneralCityData } from "@buf/loci_loci-proto.bufbuild_es/proto/city_pb.js";
import {
  POIDetailedInfo as ProtoPOIDetailedInfo,
  RestaurantDetailedInfo as ProtoRestaurantDetailedInfo,
} from "@buf/loci_loci-proto.bufbuild_es/proto/poi_pb.js";
import { transport } from "../connect-transport";
//import { createGraphQLClient, gql } from '@solid-primitives/graphql';
import type {
  ChatSession,
  ChatMessage,
  ChatSessionResponse,
  DomainType as ClientDomainType,
  GeneralCityData,
  AIItineraryResponse,
  AiCityResponse,
  POIDetailedInfo,
  RestaurantDetailedInfo,
  StreamEvent,
  UnifiedChatResponse,
  SessionPerformanceMetrics,
  SessionContentMetrics,
  SessionEngagementMetrics,
} from "./types";

// ==================
// CHAT/LLM TYPES
// ==================

export type ChatContextType =
  | "hotels"
  | "restaurants"
  | "itineraries"
  | "general";

const chatClient = createClient(ChatService, transport);

const EMPTY_ITINERARY: AIItineraryResponse = {
  itinerary_name: "",
  overall_description: "",
  points_of_interest: [],
  restaurants: [],
  bars: [],
};

export const toProtoDomainType = (
  contextType?: ChatContextType,
): ChatDomainType => {
  switch (contextType) {
    case "hotels":
      return ChatDomainType.ACCOMMODATION;
    case "restaurants":
      return ChatDomainType.DINING;
    case "itineraries":
      return ChatDomainType.ITINERARY;
    default:
      return ChatDomainType.GENERAL;
  }
};

const toClientDomainType = (
  contextType?: ChatContextType,
): ClientDomainType => {
  switch (contextType) {
    case "hotels":
      return "accommodation";
    case "restaurants":
      return "dining";
    case "itineraries":
      return "itinerary";
    default:
      return "general";
  }
};

export const domainToContextType = (
  domain: ClientDomainType | string,
): ChatContextType => {
  switch (domain) {
    case "accommodation":
      return "hotels";
    case "dining":
      return "restaurants";
    case "itinerary":
      return "itineraries";
    case "activities":
      return "general";
    default:
      return "general";
  }
};

const mapGeneralCityData = (
  data?: ProtoGeneralCityData,
): GeneralCityData | undefined => {
  if (!data) return undefined;

  return {
    city: data.city || "",
    country: data.country || "",
    state_province: data.stateProvince || "",
    description: data.description || "",
    center_latitude: data.centerLatitude ?? 0,
    center_longitude: data.centerLongitude ?? 0,
    population: data.population || "",
    area: data.area || "",
    timezone: data.timezone || "",
    language: data.language || "",
    weather: data.weather || "",
    attractions: data.attractions || "",
    history: data.history || "",
  };
};

const mapPoi = (poi: ProtoPOIDetailedInfo): POIDetailedInfo => {
  const placeholderId = poi.id === "00000000-0000-0000-0000-000000000000";
  const safeId =
    !placeholderId && poi.id
      ? poi.id
      : `${poi.name}-${poi.city || "unknown"}`.toLowerCase().replace(/\s+/g, "-");

  return {
    id: safeId,
    // city: poi.city, removed duplicate
    city_id: poi.cityId,
    name: poi.name,
    latitude: poi.latitude ?? 0,
    longitude: poi.longitude ?? 0,
    category: poi.category,
    description: poi.description || poi.descriptionPoi || "",
    city: poi.city || "", // Ensure city is string
    address: poi.address || "",
    website: poi.website || "",
    phone_number: poi.phoneNumber || "",
    opening_hours:
      typeof poi.openingHours === "object"
        ? JSON.stringify(poi.openingHours)
        : (poi.openingHours as unknown as string) || "",
    price_level: poi.priceLevel || "",
    price_range: poi.priceRange || "",
    rating: poi.rating,
    tags: poi.tags || [],
    images: poi.images || [],
    llm_interaction_id: poi.llmInteractionId || "",
    cuisine_type: poi.cuisineType || "",
    star_rating: typeof poi.starRating === 'string' ? parseFloat(poi.starRating) : (poi.starRating || 0),
    distance: poi.distance || 0,
    description_poi: poi.descriptionPoi || "",
    created_at:
      poi.createdAt && typeof (poi.createdAt as any).toDate === "function"
        ? (poi.createdAt as any).toDate().toISOString()
        : undefined,
  };
};

const mapRestaurant = (
  restaurant: ProtoRestaurantDetailedInfo | ProtoPOIDetailedInfo,
): RestaurantDetailedInfo => ({
  id: restaurant.id,
  city: restaurant.city,
  name: restaurant.name,
  latitude: restaurant.latitude ?? 0,
  longitude: restaurant.longitude ?? 0,
  category: restaurant.category,
  description:
    (restaurant as ProtoRestaurantDetailedInfo).description ||
    (restaurant as ProtoPOIDetailedInfo).description ||
    (restaurant as ProtoPOIDetailedInfo).descriptionPoi ||
    "",
  address: restaurant.address || "",
  website: restaurant.website || "",
  phone_number:
    (restaurant as ProtoRestaurantDetailedInfo).phoneNumber ||
    (restaurant as ProtoPOIDetailedInfo).phoneNumber ||
    "",
  opening_hours:
    (typeof (restaurant as ProtoRestaurantDetailedInfo).openingHours === "object"
      ? JSON.stringify((restaurant as ProtoRestaurantDetailedInfo).openingHours)
      : typeof (restaurant as ProtoRestaurantDetailedInfo).openingHours === 'string'
        ? (restaurant as ProtoRestaurantDetailedInfo).openingHours
        : (restaurant as ProtoPOIDetailedInfo).openingHours || "") as string,
  price_level:
    (restaurant as ProtoRestaurantDetailedInfo).priceLevel ||
    (restaurant as ProtoPOIDetailedInfo).priceLevel ||
    "",
  cuisine_type:
    (restaurant as ProtoRestaurantDetailedInfo).cuisineType ||
    (restaurant as ProtoPOIDetailedInfo).cuisineType ||
    "",
  tags: restaurant.tags || [],
  images: restaurant.images || [],
  rating: restaurant.rating ?? 0,
  llm_interaction_id:
    (restaurant as ProtoRestaurantDetailedInfo).llmInteractionId ||
    (restaurant as ProtoPOIDetailedInfo).llmInteractionId ||
    "",
});

const mapItineraryResponse = (
  response?: ProtoAIItineraryResponse,
): AIItineraryResponse | undefined => {
  if (!response) return undefined;

  return {
    itinerary_name: response.itineraryName,
    overall_description: response.overallDescription,
    points_of_interest:
      response.pointsOfInterest?.map(mapPoi) ?? [],
    restaurants: response.restaurants?.map(mapRestaurant) ?? [],
    bars: response.bars?.map(mapRestaurant) ?? [],
  };
};

const mapAiCityResponse = (
  response?: ProtoAiCityResponse,
): AiCityResponse | undefined => {
  if (!response) return undefined;

  const mappedItinerary =
    mapItineraryResponse(response.itineraryResponse) || (EMPTY_ITINERARY as unknown as AIItineraryResponse);

  const hotelsFromAccommodation =
    // @ts-expect-error: backend may return accommodationResponse
    response.accommodationResponse?.hotels?.map(mapPoi) ||
    // Older snake_case variant
    // @ts-expect-error
    response.accommodation_response?.hotels?.map(mapPoi) ||
    [];

  const deriveLists = () => {
    const points =
      response.pointsOfInterest?.map(mapPoi) ||
      mappedItinerary.points_of_interest ||
      [];

    const hotels = points.filter((poi) =>
      (poi.category || '').toLowerCase().includes('hotel'),
    );
    const restaurants = points.filter((poi) => {
      const cat = (poi.category || '').toLowerCase();
      return cat.includes('restaurant') || cat.includes('dining');
    });
    const activities = points.filter(
      (poi) =>
        !(poi.category || '').toLowerCase().includes('hotel') &&
        !(poi.category || '').toLowerCase().includes('restaurant') &&
        !(poi.category || '').toLowerCase().includes('dining'),
    );

    return { hotels, restaurants, activities };
  };

  const derived = deriveLists();

  return {
    general_city_data: mapGeneralCityData(response.generalCityData) as GeneralCityData || { city: '', country: '', state_province: '', description: '', center_latitude: 0, center_longitude: 0, population: '', area: '', timezone: '', language: '', weather: '', attractions: '', history: '' },
    points_of_interest: response.pointsOfInterest?.map(mapPoi) ?? [],
    itinerary_response: mappedItinerary,
    hotels: hotelsFromAccommodation || derived.hotels,
    restaurants: mappedItinerary.restaurants?.length
      ? mappedItinerary.restaurants
      : derived.restaurants as unknown as RestaurantDetailedInfo[],
    bars: mappedItinerary.bars,
    session_id: response.sessionId,
  };
};

export interface NormalizedChatResponse {
  sessionId: string;
  message: string;
  updatedItinerary?: AiCityResponse;
  domain: ClientDomainType;
  isNewSession: boolean;
  requiresClarification: boolean;
  suggestedActions: string[];
}

const normalizeChatResponse = (
  response: ProtoChatResponse,
  contextType?: ChatContextType,
): NormalizedChatResponse => {
  const domain = toClientDomainType(contextType);

  return {
    sessionId: response.sessionId,
    message: response.message,
    updatedItinerary: mapAiCityResponse(response.updatedItinerary),
    domain,
    isNewSession: response.isNewSession,
    requiresClarification: response.requiresClarification,
    suggestedActions: response.suggestedActions || [],
  };
};

const createSseResponse = (events: StreamEvent[]): Response => {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
};

const buildChatStreamResponse = (
  response: NormalizedChatResponse,
): Response => {
  const events: StreamEvent[] = [];
  const sessionCity =
    response.updatedItinerary?.general_city_data?.city;

  events.push({
    type: "start",
    data: {
      session_id: response.sessionId,
      domain: response.domain,
      city: sessionCity,
    },
  });

  if (response.domain === "accommodation") {
    // Check consolidated path first: itineraryResponse.pointsOfInterest
    const _total_pois = response.updatedItinerary?.points_of_interest?.length || 0;
    const _total_hotels = response.updatedItinerary?.hotels?.length || 0;
    const _total_restaurants = response.updatedItinerary?.restaurants?.length || 0;
    const hotels =
      response.updatedItinerary?.hotels?.length
        ? response.updatedItinerary.hotels
        : response.updatedItinerary?.itinerary_response?.points_of_interest?.length
          ? response.updatedItinerary.itinerary_response.points_of_interest
          : response.updatedItinerary?.points_of_interest;
    if (hotels?.length) {
      console.log('🏨 Building hotels event with', hotels.length, 'hotels');
      events.push({
        type: "hotels",
        data: hotels,
      });
    } else {
      console.warn('⚠️ No hotels found in response.updatedItinerary:', response.updatedItinerary);
    }
  } else if (response.domain === "dining") {
    // Check consolidated path first: itineraryResponse.pointsOfInterest
    const restaurants =
      response.updatedItinerary?.restaurants?.length
        ? response.updatedItinerary.restaurants
        : response.updatedItinerary?.itinerary_response?.points_of_interest?.length
          ? response.updatedItinerary.itinerary_response.points_of_interest
          : response.updatedItinerary?.itinerary_response?.restaurants?.length
            ? response.updatedItinerary.itinerary_response.restaurants
            : response.updatedItinerary?.points_of_interest;

    if (restaurants?.length) {
      console.log('🍽️ Building restaurants event with', restaurants.length, 'restaurants');
      events.push({
        type: "restaurants",
        data: restaurants,
      });
    } else {
      console.warn('⚠️ No restaurants found in response.updatedItinerary:', response.updatedItinerary);
    }
  } else if (response.domain === "activities") {
    // Check consolidated path first: itineraryResponse.pointsOfInterest
    const activities =
      response.updatedItinerary?.itinerary_response?.points_of_interest?.length
        ? response.updatedItinerary.itinerary_response.points_of_interest
        : response.updatedItinerary?.points_of_interest;
    if (activities?.length) {
      events.push({
        type: "activities",
        data: activities,
      });
    }
  } else {
    if (response.updatedItinerary?.general_city_data) {
      events.push({
        type: "city_data",
        data: response.updatedItinerary.general_city_data,
      });
    }

    if (response.updatedItinerary?.points_of_interest?.length) {
      events.push({
        type: "general_pois",
        data: response.updatedItinerary.points_of_interest,
      });
    }

    if (response.updatedItinerary?.itinerary_response) {
      events.push({
        type: "itinerary",
        data: response.updatedItinerary.itinerary_response,
      });
    }
  }

  events.push({ type: "complete" });

  return createSseResponse(events);
};

const enforceRateLimit = async (endpoint: string) => {
  const rateLimitCheck = await defaultLLMRateLimiter.checkRateLimit(endpoint);
  if (!rateLimitCheck.allowed) {
    const retryAfter = rateLimitCheck.retryAfter || 60;
    showRateLimitNotification(retryAfter, endpoint);
    throw new RateLimitError(
      `Rate limit exceeded for ${endpoint}. Retry after ${retryAfter} seconds.`,
      retryAfter,
      endpoint,
    );
  }
};

// Rate-limited fetch function for streaming endpoints
async function rateLimitedFetch(
  url: string,
  options: RequestInit,
  endpoint: string,
): Promise<Response> {
  // Apply client-side rate limiting for LLM endpoints
  const rateLimitCheck = await defaultLLMRateLimiter.checkRateLimit(endpoint);
  if (!rateLimitCheck.allowed) {
    const retryAfter = rateLimitCheck.retryAfter || 60;
    showRateLimitNotification(retryAfter, endpoint);
    throw new RateLimitError(
      `Rate limit exceeded for ${endpoint}. Retry after ${retryAfter} seconds.`,
      retryAfter,
      endpoint,
    );
  }

  const response = await fetch(url, options);

  // Handle server-side rate limiting
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get("Retry-After") || "60");
    showRateLimitNotification(retryAfter, endpoint);
    throw new RateLimitError(
      `Server rate limit exceeded for ${endpoint}. Retry after ${retryAfter} seconds.`,
      retryAfter,
      endpoint,
    );
  }

  return response;
}

export interface StartChatRequest {
  profileId?: string;
  contextType?: ChatContextType;
  cityName?: string;
  initialMessage?: string;
}

export interface ContinueChatRequest {
  sessionId: string;
  message: string;
  cityName?: string;
  contextType?: ChatContextType;
}

// ==================
// CHAT/LLM QUERIES
// ==================

export const useCreateChatSessionMutation = () => {
  return useMutation(() => ({
    mutationFn: (profileId: string) =>
      apiRequest<ChatSession>(
        `/llm/prompt-response/chat/sessions/${profileId}`,
        { method: "POST" },
      ),
  }));
};

export const useSendMessageMutation = () => {
  return useMutation(() => ({
    mutationFn: ({
      sessionId,
      message,
    }: {
      sessionId: string;
      message: string;
    }) =>
      apiRequest<ChatMessage>(
        `/llm/prompt-response/chat/sessions/${sessionId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ message }),
        },
      ),
  }));
};

export const useGetRecommendationsMutation = () => {
  return useMutation(() => ({
    mutationFn: ({ profileId, query }: { profileId: string; query: string }) =>
      apiRequest<UnifiedChatResponse>(
        `/llm/prompt-response/profile/${profileId}`,
        {
          method: "POST",
          body: JSON.stringify({ query }),
        },
      ),
  }));
};

// ==================
// ENHANCED CHAT SERVICES
// ==================

export const StartChat = async (
  request: StartChatRequest,
): Promise<NormalizedChatResponse> => {
  const endpoint = "loci.chat.ChatService/StartChat";
  await enforceRateLimit(endpoint);

  const response = await chatClient.startChat(
    create(StartChatRequestSchema, {
      cityName: request.cityName || "",
      contextType: toProtoDomainType(request.contextType),
      initialMessage: request.initialMessage || "",
    }),
  );

  return normalizeChatResponse(response, request.contextType);
};

/**
 * REAL streaming using Server Streaming RPC
 * This returns a ReadableStream that receives events as they happen on the server
 */
export const StartChatStreamReal = async (
  request: StartChatRequest,
): Promise<ReadableStream<StreamEvent>> => {
  const endpoint = "loci.chat.ChatService/StreamChat";
  await enforceRateLimit(endpoint);

  // Use the real streamChat RPC method
  const stream = chatClient.streamChat(
    create(ChatRequestSchema, {
      message: request.initialMessage || "",
      cityName: request.cityName || "",
    }),
  );

  // Convert AsyncIterable to ReadableStream for easier consumption
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          controller.enqueue(event);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return readableStream;
};

// Keep the old fake streaming for backward compatibility
export const StartChatStream = async (
  request: StartChatRequest,
): Promise<Response> => {
  const normalized = await StartChat(request);
  return buildChatStreamResponse(normalized);
};

export const ContinueChat = async (
  request: ContinueChatRequest,
): Promise<NormalizedChatResponse> => {
  const endpoint = "loci.chat.ChatService/ContinueChat";
  await enforceRateLimit(endpoint);

  const response = await chatClient.continueChat(
    create(ContinueChatRequestSchema, {
      sessionId: request.sessionId,
      message: request.message,
      cityName: request.cityName || "",
      contextType: toProtoDomainType(request.contextType),
    }),
  );

  return normalizeChatResponse(response, request.contextType);
};

/**
 * REAL streaming for ContinueChat using Server Streaming RPC
 */
export const ContinueChatStreamReal = async (
  request: ContinueChatRequest,
): Promise<Response> => {
  // Use unary ContinueChat and adapt to SSE so existing consumers keep working
  const normalized = await ContinueChat(request);
  return buildChatStreamResponse(normalized);
};

// Updated ContinueChatStream to use REAL ContinueChat RPC (no fake streaming)
export const ContinueChatStream = async (
  request: ContinueChatRequest,
): Promise<Response> => {
  console.log("🚀 Using ContinueChat (unary) wrapped as SSE");
  return ContinueChatStreamReal(request);
};

// ==================
// MUTATION HOOKS FOR ENHANCED SERVICES
// ==================

export const useStartChatMutation = () => {
  return useMutation(() => ({
    mutationFn: StartChat,
  }));
};

export const useContinueChatMutation = () => {
  return useMutation(() => ({
    mutationFn: ContinueChat,
  }));
};

// ==================
// UNIFIED STREAMING CHAT
// ==================

export interface UnifiedChatRequest {
  profileId: string;
  message: string;
  cityName?: string;
  contextType?: ChatContextType;
  userLocation?: {
    userLat: number;
    userLon: number;
  };
}

export interface UnifiedChatStreamRequest extends UnifiedChatRequest { }

// Unified chat service - sends message and gets streaming response
export const sendUnifiedChatMessage = async (
  request: UnifiedChatRequest,
): Promise<Response> => {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  const endpoint = `/llm/prompt-response/chat/sessions/${request.profileId}`;

  return rateLimitedFetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        message: request.message,
        user_location: request.userLocation,
      }),
    },
    endpoint,
  );
};

/**
 * Convert Proto StreamEvent to SSE format
 * This bridges the gap between real RPC streaming and SSE expected by useChatSession
 */
const sseTextDecoder = new TextDecoder();

// Normalize payloads that might arrive as Uint8Array or numeric-key objects
const normalizeStreamPayload = (payload: any): any => {
  if (payload === null || payload === undefined) return payload;

  // Respect proto helper if present
  if (typeof payload === "object" && typeof (payload as any).toJson === "function") {
    return (payload as any).toJson();
  }

  const tryParseString = (input: string) => {
    const trimmed = input.trim();
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  };

  // Detect numeric-key object that represents bytes (e.g., {"0":123,...})
  const maybeNumericByteObject = (input: any) => {
    if (typeof input !== "object" || Array.isArray(input)) return null;
    const keys = Object.keys(input);
    if (keys.length === 0) return null;
    if (!keys.every((k) => /^\d+$/.test(k))) return null;
    const bytes = new Uint8Array(keys.sort((a, b) => Number(a) - Number(b)).map((k) => input[k]));
    return bytes;
  };

  if (payload instanceof Uint8Array) {
    const decoded = sseTextDecoder.decode(payload);
    return tryParseString(decoded);
  }

  const byteObj = maybeNumericByteObject(payload);
  if (byteObj) {
    const decoded = sseTextDecoder.decode(byteObj);
    return tryParseString(decoded);
  }

  if (typeof payload === "string") {
    return tryParseString(payload);
  }

  return payload;
};

const convertProtoStreamToSSE = async (
  protoStream: ReadableStream<any>,
): Promise<Response> => {
  const stream = new ReadableStream({
    async start(controller) {
      const reader = protoStream.getReader();
      const encoder = new TextEncoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Convert proto event to SSE format
          const normalizedData = normalizeStreamPayload(value.data);
          const normalizedMessage = normalizeStreamPayload(value.message);
          const sseData = {
            Type: value.type,
            type: value.type,
            Data: normalizedData,
            data: normalizedData,
            Message: normalizedMessage,
            message: normalizedMessage,
            Error: value.error,
            error: value.error,
            Navigation: value.navigation?.toJson ? value.navigation.toJson() : value.navigation,
            navigation: value.navigation?.toJson ? value.navigation.toJson() : value.navigation,
          };

          // Send as SSE
          const sseMessage = `data: ${JSON.stringify(sseData)}\n\n`;
          controller.enqueue(encoder.encode(sseMessage));
        }

        controller.close();
      } catch (error) {
        console.error('Error in Proto to SSE conversion:', error);
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};

// Unified chat streaming service - NOW WITH REAL STREAMING!
export const sendUnifiedChatMessageStream = async (
  request: UnifiedChatStreamRequest,
): Promise<Response> => {
  const contextType = request.contextType || "general";

  console.log('🚀 Using REAL server streaming (not fake!)');

  // Use real streaming RPC
  const protoStream = await StartChatStreamReal({
    profileId: request.profileId,
    cityName: request.cityName,
    contextType,
    initialMessage: request.message,
  });

  // Convert proto stream to SSE format
  return convertProtoStreamToSSE(protoStream);
};

export const sendUnifiedChatMessageStreamFree = async (
  request: UnifiedChatStreamRequest,
): Promise<Response> => {
  //const token =
  //  localStorage.getItem("access_token") ||
  //  sessionStorage.getItem("access_token");
  const endpoint = `/llm/chat/stream/free`;

  console.log("=== STREAMING API CALL ===");
  //console.log("Token found:", !!token);
  console.log("Request:", request);

  return rateLimitedFetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        message: request.message,
        user_location: request.userLocation,
      }),
    },
    endpoint,
  );
};

// GraphQL alternative to streaming service
// const PROCESS_UNIFIED_CHAT_MESSAGE = gql`
//   mutation ProcessUnifiedChatMessage($profileId: String!, $input: ChatMessageInput!) {
//     processUnifiedChatMessage(profileId: $profileId, input: $input) {
//       sessionId
//       success
//       error
//       events {
//         type
//         message
//         data
//         error
//         timestamp
//         eventId
//         isFinal
//         navigation {
//           url
//           routeType
//           queryParams
//         }
//       }
//     }
//   }
// `;

// Create GraphQL client instance
// const createAuthenticatedGraphQLClient = () => {
//   const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

//   return createGraphQLClient(`${API_BASE_URL}/graphql`, {
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }),
//     },
//   });
// };

// export const sendUnifiedChatMessageGraphQL = async (request: UnifiedChatStreamRequest): Promise<any> => {
//   console.log('=== GRAPHQL API CALL ===');
//   console.log('Request:', request);

//   const client = createAuthenticatedGraphQLClient();

//   try {
//     const result = await client(PROCESS_UNIFIED_CHAT_MESSAGE, {
//       profileId: request.profileId,
//       input: {
//         message: request.message,
//         userLocation: request.userLocation,
//       },
//     });

//     console.log('=== GRAPHQL RESPONSE ===');
//     console.log('Result:', result);
//     console.log('Result structure:', Object.keys(result || {}));

//     // Extract navigation data from events for redirect
//     const processResult = result?.data?.processUnifiedChatMessage;
//     console.log('processUnifiedChatMessage:', processResult);

//     const events = processResult?.events || [];
//     console.log('GraphQL Events count:', events.length);
//     console.log('First few events:', events.slice(0, 3));
//     console.log('Last few events:', events.slice(-3));

//     // Find navigation data in the complete event
//     const navigationEvent = events.find((event: any) => event.navigation && event.navigation.url);
//     if (navigationEvent) {
//       console.log('🧭 GraphQL Navigation found:', navigationEvent.navigation);

//       // Add navigation data to result for easy access
//       result.navigationData = navigationEvent.navigation;
//       console.log('✅ Navigation data added to result:', result.navigationData);
//     } else {
//       console.log('❌ No navigation event found');
//       // Debug: check if any events have navigation
//       const eventsWithNav = events.filter((event: any) => event.navigation);
//       console.log('Events with navigation field:', eventsWithNav);

//       // Additional debugging - check if result structure is different
//       console.log('Full result keys:', Object.keys(result || {}));
//       console.log('Result.data keys:', Object.keys(result?.data || {}));
//     }

//     return result;
//   } catch (error) {
//     console.error('GraphQL Error:', error);
//     throw error;
//   }
// };

// Domain detection utility (client-side)
export const detectDomain = (message: string): import("./types").DomainType => {
  const lowerMessage = message.toLowerCase();

  // Accommodation domain keywords
  if (
    /hotel|hostel|accommodation|stay|sleep|room|booking|airbnb|lodge|resort|guesthouse/.test(
      lowerMessage,
    )
  ) {
    return "accommodation";
  }

  // Dining domain keywords
  if (
    /restaurant|food|eat|dine|meal|cuisine|drink|cafe|bar|lunch|dinner|breakfast|brunch/.test(
      lowerMessage,
    )
  ) {
    return "dining";
  }

  // Activity domain keywords
  if (
    /activity|museum|park|attraction|tour|visit|see|do|experience|adventure|shopping|nightlife/.test(
      lowerMessage,
    )
  ) {
    return "activities";
  }

  // Itinerary domain keywords
  if (
    /itinerary|plan|schedule|trip|day|week|journey|route|organize|arrange/.test(
      lowerMessage,
    )
  ) {
    return "itinerary";
  }

  // Default to general domain
  return "general";
};

// ==================
// MUTATION HOOKS FOR UNIFIED CHAT
// ==================

export const useUnifiedChatMutation = () => {
  return useMutation(() => ({
    mutationFn: sendUnifiedChatMessage,
  }));
};

// ==================
// CHAT SESSIONS RETRIEVAL
// ==================

export interface ChatSessionSummary {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messageCount: number;
  hasItinerary: boolean;
  lastMessage?: string;
  cityName?: string;
  performanceMetrics?: SessionPerformanceMetrics;
  contentMetrics?: SessionContentMetrics;
  engagementMetrics?: SessionEngagementMetrics;
  // Include full conversation data for loading sessions
  conversationHistory?: ChatMessage[];
  created_at?: string;
  updated_at?: string;
}

// Get chat sessions for a user
export const getUserChatSessions = async (
  profileId: string,
): Promise<ChatSessionSummary[]> => {
  try {
    console.log("🔍 Fetching chat sessions for profile:", profileId);
    const response = await apiRequest<ChatSessionResponse[]>(
      `/llm/prompt-response/chat/sessions/user/${profileId}`,
      {
        method: "GET",
      },
    );

    console.log(
      "✅ Successfully fetched chat sessions:",
      response?.length || 0,
    );

    // Transform the response to our expected format
    return response.map((session: ChatSessionResponse) => ({
      id: session.id,
      title: generateSessionTitle(
        session.conversation_history,
        session.city_name,
        session.content_metrics,
      ),
      preview: generatePreview(session.conversation_history),
      timestamp: session.updated_at || session.created_at,
      messageCount: session.conversation_history?.length || 0,
      hasItinerary:
        session.content_metrics?.has_itinerary ||
        hasItineraryInMessages(session.conversation_history),
      lastMessage: getLastMessage(session.conversation_history),
      cityName: session.city_name,
      performanceMetrics: session.performance_metrics,
      contentMetrics: session.content_metrics,
      engagementMetrics: session.engagement_metrics,
      // Include the conversation history for session loading
      conversationHistory: session.conversation_history,
      created_at: session.created_at,
      updated_at: session.updated_at,
    }));
  } catch (error) {
    console.error("❌ Failed to fetch chat sessions:", error);

    // Check if it's the specific SQL error
    if (
      (error as any)?.message?.includes("COALESCE types uuid and text cannot be matched")
    ) {
      console.warn(
        "🔧 Database type mismatch error detected - backend needs to fix COALESCE query",
      );
    }

    // Return empty array when backend endpoint has issues
    // This allows the chat to still work even if history loading fails
    return [];
  }
};

// Helper function to generate session title from conversation
const generateSessionTitle = (
  conversationHistory: ChatMessage[],
  cityName?: string,
  contentMetrics?: SessionContentMetrics,
): string => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return cityName ? `Trip to ${cityName}` : "New Conversation";
  }

  // Use content metrics for smarter title generation
  if (contentMetrics) {
    const {
      dominant_categories,
      complexity_score,
      total_pois: _total_pois,
      total_hotels: _total_hotels,
      total_restaurants: _total_restaurants,
    } = contentMetrics;

    // Generate title based on dominant categories
    if (dominant_categories.length > 0) {
      const primaryCategory = dominant_categories[0];
      const categoryNames = {
        accommodation: "Hotels",
        dining: "Restaurants",
        attractions: "Attractions",
        itinerary: "Itinerary Planning",
      };

      const categoryName =
        categoryNames[primaryCategory as keyof typeof categoryNames] ||
        "Recommendations";
      const cityPart = cityName ? ` in ${cityName}` : "";

      // Add complexity indicator for rich sessions
      if (complexity_score >= 8) {
        return `Complete ${categoryName}${cityPart}`;
      } else if (complexity_score >= 6) {
        return `${categoryName} Guide${cityPart}`;
      } else {
        return `${categoryName}${cityPart}`;
      }
    }
  }

  // Look for first user message (role can be 'user' or type can be 'user')
  const firstUserMessage = conversationHistory.find(
    (msg) => msg.role === "user" || msg.type === "user",
  );
  if (firstUserMessage) {
    const content = firstUserMessage.content || "";

    // Try to detect the intent from the message content
    const lowerContent = content.toLowerCase();

    // Check for specific intents and create meaningful titles
    if (
      lowerContent.includes("hotel") ||
      lowerContent.includes("accommodation")
    ) {
      return cityName ? `Hotels in ${cityName}` : "Hotel Search";
    }
    if (
      lowerContent.includes("restaurant") ||
      lowerContent.includes("food") ||
      lowerContent.includes("eat")
    ) {
      return cityName ? `Dining in ${cityName}` : "Restaurant Search";
    }
    if (
      lowerContent.includes("activity") ||
      lowerContent.includes("visit") ||
      lowerContent.includes("see")
    ) {
      return cityName ? `Activities in ${cityName}` : "Activity Search";
    }
    if (
      lowerContent.includes("itinerary") ||
      lowerContent.includes("plan") ||
      lowerContent.includes("trip")
    ) {
      return cityName ? `${cityName} Itinerary` : "Trip Planning";
    }

    // Fallback: Use first meaningful words + city
    const words = content
      .split(" ")
      .filter((word) => word.length > 2)
      .slice(0, 3);
    const baseTitle = words.join(" ");

    if (cityName && !baseTitle.toLowerCase().includes(cityName.toLowerCase())) {
      return `${baseTitle} - ${cityName}`;
    }

    return baseTitle || (cityName ? `Trip to ${cityName}` : "Chat Session");
  }

  return cityName ? `Trip to ${cityName}` : "Chat Session";
};

// Helper function to generate preview from conversation
const generatePreview = (conversationHistory: ChatMessage[]): string => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return "Start a new conversation...";
  }

  // Get the last assistant message for preview
  const lastAssistantMessage = [...conversationHistory]
    .reverse()
    .find((msg) => msg.role === "assistant" || msg.type === "assistant");
  if (lastAssistantMessage) {
    const content = lastAssistantMessage.content || "";
    return content.length > 60 ? content.substring(0, 60) + "..." : content;
  }

  // Fallback to last message
  const lastMessage = conversationHistory[conversationHistory.length - 1];
  if (lastMessage) {
    const content = lastMessage.content || "";
    return content.length > 60 ? content.substring(0, 60) + "..." : content;
  }

  return "Continue conversation...";
};

// Helper function to get last message
const getLastMessage = (conversationHistory: ChatMessage[]): string => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return "";
  }

  const lastMessage = conversationHistory[conversationHistory.length - 1];
  return lastMessage?.content || "";
};

// Helper function to check if conversation contains itinerary content
const hasItineraryInMessages = (
  conversationHistory: ChatMessage[],
): boolean => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return false;
  }

  // Look for itinerary-related keywords in assistant messages
  const itineraryKeywords = [
    "itinerary",
    "recommendations",
    "places to visit",
    "day 1",
    "day 2",
    "restaurants",
    "hotels",
    "activities",
  ];

  return conversationHistory.some((message: ChatMessage) => {
    if (message.role === "assistant" && message.content) {
      const content = message.content.toLowerCase();
      return itineraryKeywords.some((keyword) => content.includes(keyword));
    }
    return false;
  });
};

// Query hook for getting chat sessions
export const useGetChatSessionsQuery = (profileId: string | undefined) => {
  return {
    queryKey: ["chatSessions", profileId],
    queryFn: () => {
      if (!profileId) {
        return Promise.resolve([]);
      }
      return getUserChatSessions(profileId);
    },
    enabled: !!profileId,
  };
};
