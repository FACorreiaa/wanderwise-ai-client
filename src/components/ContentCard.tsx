import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/ui/card";
import { Button } from "@/ui/button";

interface ContentCardProps {
    title: string;
    description: string;
    tag: string;
    tagColorClass?: string; // e.g., "bg-blue-100 text-blue-700"
    imageUrl?: string; // Optional image
}

export default function ContentCard(props: ContentCardProps) {
    return (
        <Card class="overflow-hidden transition-all hover:shadow-xl">
            {props.imageUrl && (
                <div class="h-40 bg-muted flex items-center justify-center">
                    {/* In a real app, use an <img /> tag */}
                    <span class="text-muted-foreground">Image Placeholder</span>
                </div>
            )}
            <CardHeader>
                <CardTitle>{props.title}</CardTitle>
                {props.tag && (
                    <span
                        class={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${props.tagColorClass || "bg-secondary text-secondary-foreground"
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