import { createQuery } from "@tanstack/solid-query";
import { createClient } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
import {
  DiscoverService,
  GetCategoryResultsRequestSchema,
  GetDiscoverPageRequestSchema,
  GetFeaturedRequestSchema,
  GetRecentDiscoveriesRequestSchema,
  GetTrendingRequestSchema,
  DiscoverResult as ProtoDiscoverResult,
  TrendingDiscovery as ProtoTrendingDiscovery,
  FeaturedCollection as ProtoFeaturedCollection,
} from "@buf/loci_loci-proto.bufbuild_es/proto/discover_pb.js";
import { PaginationRequestSchema } from "@buf/loci_loci-proto.bufbuild_es/proto/common_pb.js";
import { ChatSession as ProtoChatSession } from "@buf/loci_loci-proto.bufbuild_es/proto/chat_pb.js";
import { transport } from "../connect-transport";
import type {
  DiscoverPageData,
  TrendingDiscovery,
  FeaturedCollection,
  ChatSession,
  DiscoverResult,
} from "./types";

const discoverClient = createClient(DiscoverService, transport);

const toTrending = (t: ProtoTrendingDiscovery): TrendingDiscovery => ({
  city_name: t.cityName || "",
  search_count: Number(t.searchCount ?? 0),
  emoji: t.emoji || "🗺️",
});

const toFeatured = (f: ProtoFeaturedCollection): FeaturedCollection => ({
  category: f.category || "",
  title: f.title || "",
  item_count: Number(f.itemCount ?? 0),
  emoji: f.emoji || "✨",
});

const toChatSession = (
  s: ProtoChatSession,
): ChatSession & { city_name?: string; conversation_history?: any[] } => ({
  id: s.id || "",
  profile_id: s.profileId || "",
  created_at: s.createdAt?.toDate?.().toISOString() || "",
  updated_at: s.updatedAt?.toDate?.().toISOString() || "",
  city_name: (s as any).cityName || "",
  conversation_history: (s as any).conversationHistory || [],
});

const toDiscoverResult = (r: ProtoDiscoverResult): DiscoverResult => ({
  id: r.id || "",
  name: r.name || "",
  latitude: r.latitude ?? 0,
  longitude: r.longitude ?? 0,
  category: r.category || "",
  description: r.description || "",
  address: r.address || "",
  website: r.website || undefined,
  phone_number: r.phoneNumber || undefined,
  opening_hours: r.openingHours || undefined,
  price_level: r.priceLevel || "",
  rating: r.rating ?? 0,
  tags: r.tags || [],
  images: r.images || [],
  cuisine_type: r.cuisineType || undefined,
  star_rating: r.starRating || undefined,
});

// Get all discover page data via RPC
export function useDiscoverPageData() {
  return createQuery(() => ({
    queryKey: ["discover", "page"],
    queryFn: async (): Promise<DiscoverPageData> => {
      const response = await discoverClient.getDiscoverPage(
        create(GetDiscoverPageRequestSchema, {}),
      );
      const data = response.data;
      return {
        trending: (data?.trending || []).map(toTrending),
        featured: (data?.featured || []).map(toFeatured),
        recent_discoveries: (data?.recentDiscoveries || []).map(toChatSession),
      };
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  }));
}

// Get trending discoveries
export function useTrendingDiscoveries(limit = 5) {
  return createQuery(() => ({
    queryKey: ["discover", "trending", limit],
    queryFn: async (): Promise<TrendingDiscovery[]> => {
      const response = await discoverClient.getTrending(
        create(GetTrendingRequestSchema, {
          limit,
        }),
      );
      return (response.trending || []).map(toTrending);
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  }));
}

// Get featured collections
export function useFeaturedCollections(limit = 4) {
  return createQuery(() => ({
    queryKey: ["discover", "featured", limit],
    queryFn: async (): Promise<FeaturedCollection[]> => {
      const response = await discoverClient.getFeatured(
        create(GetFeaturedRequestSchema, {
          limit,
        }),
      );
      return (response.featured || []).map(toFeatured);
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  }));
}

// Get recent discoveries
export function useRecentDiscoveries(limit = 6) {
  return createQuery(() => ({
    queryKey: ["discover", "recent", limit],
    queryFn: async (): Promise<ChatSession[]> => {
      const response = await discoverClient.getRecentDiscoveries(
        create(GetRecentDiscoveriesRequestSchema, {
          pagination: create(PaginationRequestSchema, {
            page: 1,
            pageSize: limit,
          }),
        }),
      );
      return (response.sessions || []).map(toChatSession);
    },
    staleTime: 15 * 1000,
    refetchInterval: 45 * 1000,
  }));
}

// Get category results
export function useCategoryResults(category: string, cityName?: string, pageSize = 12) {
  return createQuery(() => ({
    queryKey: ["discover", "category", category, cityName, pageSize],
    queryFn: async (): Promise<DiscoverResult[]> => {
      const response = await discoverClient.getCategoryResults(
        create(GetCategoryResultsRequestSchema, {
          category,
          cityName,
          pagination: create(PaginationRequestSchema, {
            page: 1,
            pageSize,
          }),
        }),
      );
      return (response.results || []).map(toDiscoverResult);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!category,
  }));
}
