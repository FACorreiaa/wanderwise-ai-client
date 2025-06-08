import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/ui/card";
import { ArrowRight } from "lucide-solid";
import { For, JSX } from 'solid-js';

interface ContentItem {
    logo: JSX.Element;
    title: string;
    description: string;
    tag: string;
    tagColorClass: string;
    imageUrl: string;
}

interface ContentGridProps {
    items: ContentItem[];
}

export default function ContentGrid(props: ContentGridProps) {
    return (
        <section class="w-full py-16 md:py-24 bg-gray-50/50">
            <div class="container px-4 md:px-6">
                <div class="flex justify-center mb-12 space-x-2">
                    {/* In a real app, this would have state to filter content */}
                    <Button variant="ghost" class="font-semibold text-blue-600">Trending</Button>
                    <Button variant="ghost" class="text-muted-foreground">Insights <Badge class="ml-2">New</Badge></Button>
                    <Button variant="ghost" class="text-muted-foreground">Predictions <Badge class="ml-2">New</Badge></Button>
                </div>
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <For each={props.items}>
                        {(item) => (
                            <Card class="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                                <div class="h-40 bg-muted flex items-center justify-center">
                                    <span class="text-muted-foreground text-5xl">{item.logo}</span>
                                </div>
                                <CardHeader>
                                    <CardTitle>{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{item.description}</CardDescription>
                                    <Badge variant="outline" class={`mt-4 font-semibold ${item.tagColorClass}`}>
                                        {item.tag}
                                    </Badge>
                                </CardContent>
                            </Card>
                        )}
                    </For>
                </div>
                <div class="text-center mt-12">
                    <Button variant="outline" size="lg">
                        Explore All Guides <ArrowRight class="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </section>
    );
}