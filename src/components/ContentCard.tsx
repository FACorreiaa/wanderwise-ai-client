import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/ui/card";
import { Button } from "@/ui/button";
import { Star } from "lucide-solid";
import { Show } from "solid-js";

interface ContentCardProps {
    title: string;
    description: string;
    tag: string;
    tagColorClass?: string;
    imageUrl?: string;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    isTogglingFavorite: boolean;
}

export default function ContentCard(props: ContentCardProps) {
    return (
        <Card class="overflow-hidden transition-all hover:shadow-xl relative">
            {/* Favorite Button */}
            <button
                onClick={() => props.onToggleFavorite()}
                disabled={props.isTogglingFavorite}
                class={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                    props.isFavorite
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                aria-label={props.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
                <Show
                    when={!props.isTogglingFavorite}
                    fallback={<div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                >
                    <Star class={`w-5 h-5 ${props.isFavorite ? 'fill-current' : ''}`} />
                </Show>
            </button>

            {props.imageUrl && (
                <div class="h-40 bg-muted flex items-center justify-center">
                    <span class="text-muted-foreground">Image Placeholder</span>
                </div>
            )}
            <CardHeader>
                <CardTitle>{props.title}</CardTitle>
                {props.tag && (
                    <span
                        class={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                            props.tagColorClass || "bg-secondary text-secondary-foreground"
                        }`}
                    >
                        {props.tag}
                    </span>
                )}
            </CardHeader>
            <CardContent>
                <CardDescription>{props.description}</CardDescription>
            </CardContent>
            <CardFooter>
                <Button variant="link" class="p-0">Read More</Button>
            </CardFooter>
        </Card>
    );
}