import { Component, createMemo, Show } from 'solid-js';
import { Heart, Loader2 } from 'lucide-solid';
import { useFavoritesList, useToggleFavorite, type FavoriteItem } from '~/lib/api/favorites';

interface FavoriteButtonProps {
    item: FavoriteItem;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    showLabel?: boolean;
}

const FavoriteButton: Component<FavoriteButtonProps> = (props) => {
    const favoritesQuery = useFavoritesList();
    const { toggleFavorite, isLoading } = useToggleFavorite();

    const isFavorited = createMemo(() => {
        const favorites = favoritesQuery.data;
        if (!favorites) return false;
        return favorites.items.includes(props.item.id);
    });

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

    const handleClick = async (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleFavorite(props.item);
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading()}
            class={`
        ${sizeClasses()}
        flex items-center justify-center gap-2
        rounded-full transition-all duration-200
        ${isFavorited()
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'
                }
        backdrop-blur-sm shadow-lg
        border border-gray-200 dark:border-gray-700
        disabled:opacity-50 disabled:cursor-not-allowed
        ${props.className || ''}
      `}
            title={isFavorited() ? 'Remove from favorites' : 'Add to favorites'}
        >
            <Show
                when={!isLoading()}
                fallback={<Loader2 class={`${iconSizes()} animate-spin`} />}
            >
                <Heart
                    class={`${iconSizes()} ${isFavorited() ? 'fill-current' : ''}`}
                />
            </Show>
            <Show when={props.showLabel}>
                <span class="text-sm font-medium">
                    {isFavorited() ? 'Favorited' : 'Favorite'}
                </span>
            </Show>
        </button>
    );
};

export default FavoriteButton;
