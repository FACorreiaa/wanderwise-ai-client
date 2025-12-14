import { Component, createSignal, Show } from 'solid-js';
import { Bookmark, Loader2 } from 'lucide-solid';
import { createClient } from "@connectrpc/connect";
import {
    ListService,
    CreateListRequestSchema
} from "@buf/loci_loci-proto.bufbuild_es/loci/list/list_pb.js";
import { create } from "@bufbuild/protobuf";
import { transport } from "~/lib/connect-transport";
import { authAPI, getAuthToken } from "~/lib/api";

// Create list client
const listClient = createClient(ListService, transport);

interface BookmarkButtonProps {
    title: string;
    description?: string;
    cityName?: string;
    itineraryData: any; // The full itinerary/list data to save
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

const BookmarkButton: Component<BookmarkButtonProps> = (props) => {
    const [isLoading, setIsLoading] = createSignal(false);
    const [isSaved, setIsSaved] = createSignal(false);

    const sizeClasses = () => {
        switch (props.size || 'md') {
            case 'sm': return 'w-8 h-8';
            case 'lg': return 'w-12 h-12';
            default: return 'w-10 h-10';
        }
    };

    const iconSizes = () => {
        switch (props.size || 'md') {
            case 'sm': return 'w-4 h-4';
            case 'lg': return 'w-6 h-6';
            default: return 'w-5 h-5';
        }
    };

    const handleSave = async (e: Event) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if authenticated
        const token = getAuthToken();
        if (!token) {
            console.warn("User not authenticated for bookmarking");
            return;
        }

        setIsLoading(true);

        try {
            // Get user ID from session
            const session = await authAPI.validateSession();
            if (!session.valid || !session.user_id) {
                throw new Error("Not authenticated");
            }

            // Create a new list (itinerary) with the data
            await listClient.createList(
                create(CreateListRequestSchema, {
                    userId: session.user_id,
                    name: props.title || `${props.cityName || 'My'} Itinerary`,
                    description: props.description || `Saved itinerary for ${props.cityName || 'your trip'}`,
                    isPublic: false,
                    isItinerary: true,
                })
            );

            setIsSaved(true);
            props.onSuccess?.();
        } catch (error) {
            console.error("Failed to bookmark itinerary:", error);
            props.onError?.(error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleSave}
            disabled={isLoading() || isSaved()}
            class={`
        ${sizeClasses()}
        flex items-center justify-center gap-2
        rounded-full transition-all duration-200
        ${isSaved()
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500'
                }
        backdrop-blur-sm shadow-lg
        border border-gray-200 dark:border-gray-700
        disabled:opacity-50 disabled:cursor-not-allowed
        ${props.className || ''}
      `}
            title={isSaved() ? 'Saved to your lists' : 'Save this list'}
        >
            <Show
                when={!isLoading()}
                fallback={<Loader2 class={`${iconSizes()} animate-spin`} />}
            >
                <Bookmark
                    class={`${iconSizes()} ${isSaved() ? 'fill-current' : ''}`}
                />
            </Show>
        </button>
    );
};

export default BookmarkButton;
