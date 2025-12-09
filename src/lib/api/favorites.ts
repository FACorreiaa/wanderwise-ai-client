// Favorites hooks using ListService RPC
import { createSignal, createEffect, createMemo } from 'solid-js';
import { createQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { createClient } from "@connectrpc/connect";
import {
    ListService,
    GetListsRequestSchema,
    CreateListRequestSchema,
    AddListItemRequestSchema,
    RemoveListItemRequestSchema,
    ContentType
} from "@buf/loci_loci-proto.bufbuild_es/proto/list_pb.js";
import { create } from "@bufbuild/protobuf";
import { transport } from "../connect-transport";
import { authAPI, getAuthToken } from "../api";

// Create authenticated list client
const listClient = createClient(ListService, transport);

// Constants
const FAVORITES_LIST_NAME = "Favorites";

// Cache for user ID to avoid repeated validateSession calls
let cachedUserId: string | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper to get current user ID from session with caching
const getCurrentUserId = async (): Promise<string | null> => {
    // Check if we have a valid cached user ID
    const now = Date.now();
    if (cachedUserId && (now - cacheTimestamp) < CACHE_TTL) {
        return cachedUserId;
    }

    // Check if we have a token at all (quick check)
    const token = getAuthToken();
    if (!token) {
        cachedUserId = null;
        return null;
    }

    try {
        const session = await authAPI.validateSession();
        if (session.valid && session.user_id) {
            cachedUserId = session.user_id;
            cacheTimestamp = now;
            return cachedUserId;
        }
    } catch (e) {
        console.warn("Failed to get user ID from session:", e);
    }
    cachedUserId = null;
    return null;
};

// Types
export interface FavoriteItem {
    id: string;
    name: string;
    contentType: 'poi' | 'restaurant' | 'hotel' | 'itinerary';
    description?: string;
    llmInteractionId?: string;
}

export interface FavoritesList {
    id: string;
    name: string;
    itemCount: number;
    items: string[]; // Array of item IDs
}

// Fetch user's favorites list
async function fetchFavoritesList(): Promise<FavoritesList | null> {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    try {
        const response = await listClient.getLists(
            create(GetListsRequestSchema, {
                userId: userId,
                limit: 100,
                offset: 0,
                includeItems: true,
            })
        );

        // Find or note the favorites list
        const favoritesList = response.lists?.find(
            (list) => list.list?.name === FAVORITES_LIST_NAME
        );

        if (favoritesList && favoritesList.list) {
            return {
                id: favoritesList.list.id || '',
                name: favoritesList.list.name || FAVORITES_LIST_NAME,
                itemCount: Number(favoritesList.list.itemCount || 0),
                items: (favoritesList.items || []).map(item => item.itemId || item.poiId || ''),
            };
        }

        return null;
    } catch (error) {
        console.error("Failed to fetch favorites list:", error);
        return null;
    }
}

// Create favorites list if it doesn't exist
async function createFavoritesList(): Promise<string | null> {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    try {
        const response = await listClient.createList(
            create(CreateListRequestSchema, {
                userId: userId,
                name: FAVORITES_LIST_NAME,
                description: "Your favorite places and discoveries",
                isPublic: false,
                isItinerary: false,
            })
        );

        return response.list?.id || null;
    } catch (error) {
        console.error("Failed to create favorites list:", error);
        return null;
    }
}

// Map content type string to proto enum
function getContentTypeEnum(type: string): ContentType {
    switch (type) {
        case 'poi': return ContentType.POI;
        case 'restaurant': return ContentType.RESTAURANT;
        case 'hotel': return ContentType.HOTEL;
        case 'itinerary': return ContentType.ITINERARY;
        default: return ContentType.POI;
    }
}

// Add item to favorites
async function addToFavorites(item: FavoriteItem): Promise<boolean> {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    // Get or create favorites list
    let favoritesList = await fetchFavoritesList();
    let listId: string | undefined = favoritesList?.id;

    if (!listId) {
        const newListId = await createFavoritesList();
        if (!newListId) return false;
        listId = newListId;
    }

    try {
        await listClient.addListItem(
            create(AddListItemRequestSchema, {
                userId: userId,
                listId: listId,
                itemId: item.id,
                contentType: getContentTypeEnum(item.contentType),
                notes: item.description || '',
                sourceLlmInteractionId: item.llmInteractionId || '',
                itemAiDescription: item.description || '',
            })
        );
        return true;
    } catch (error) {
        console.error("Failed to add to favorites:", error);
        return false;
    }
}

// Remove item from favorites
async function removeFromFavorites(itemId: string, contentType: string): Promise<boolean> {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const favoritesList = await fetchFavoritesList();
    if (!favoritesList?.id) return false;

    try {
        await listClient.removeListItem(
            create(RemoveListItemRequestSchema, {
                userId: userId,
                listId: favoritesList.id,
                itemId: itemId,
                contentType: getContentTypeEnum(contentType),
            })
        );
        return true;
    } catch (error) {
        console.error("Failed to remove from favorites:", error);
        return false;
    }
}

// Hook: Get favorites list
export function useFavoritesList() {
    return createQuery(() => ({
        queryKey: ['favorites', 'list'],
        queryFn: fetchFavoritesList,
        staleTime: 2 * 60 * 1000, // 2 minutes
    }));
}

// Hook: Check if item is favorited
export function useIsFavorited(itemId: () => string) {
    const favoritesQuery = useFavoritesList();

    return createMemo(() => {
        const favorites = favoritesQuery.data;
        if (!favorites) return false;
        return favorites.items.includes(itemId());
    });
}

// Hook: Add to favorites mutation
export function useAddToFavorites() {
    const queryClient = useQueryClient();

    return useMutation(() => ({
        mutationFn: addToFavorites,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
    }));
}

// Hook: Remove from favorites mutation
export function useRemoveFromFavorites() {
    const queryClient = useQueryClient();

    return useMutation(() => ({
        mutationFn: ({ itemId, contentType }: { itemId: string; contentType: string }) =>
            removeFromFavorites(itemId, contentType),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
    }));
}

// Hook: Toggle favorite (combined add/remove)
export function useToggleFavorite() {
    const addMutation = useAddToFavorites();
    const removeMutation = useRemoveFromFavorites();
    const favoritesQuery = useFavoritesList();

    const toggleFavorite = async (item: FavoriteItem) => {
        const favorites = favoritesQuery.data;
        const isFavorited = favorites?.items.includes(item.id);

        if (isFavorited) {
            await removeMutation.mutateAsync({ itemId: item.id, contentType: item.contentType });
        } else {
            await addMutation.mutateAsync(item);
        }
    };

    const isLoading = () => addMutation.isPending || removeMutation.isPending;

    return { toggleFavorite, isLoading };
}
