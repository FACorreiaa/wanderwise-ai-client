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
        <section class="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30 dark:bg-gray-900/30" aria-labelledby="content-grid-heading">
            <div class="container px-4 sm:px-6 lg:px-8">
                <h2 id="content-grid-heading" class="sr-only">Featured Content</h2>
                {/* Mobile-first filter buttons */}
                <div class="flex flex-wrap justify-center mb-8 sm:mb-10 md:mb-12 gap-2 sm:gap-3" role="tablist" aria-label="Content filters">
                    <Button variant="ghost" class="font-semibold text-blue-600 dark:text-blue-400 text-sm sm:text-base px-3 py-2 sm:px-4" role="tab" aria-selected="true">
                        Trending
                    </Button>
                    <Button variant="ghost" class="text-muted-foreground text-sm sm:text-base px-3 py-2 sm:px-4" role="tab" aria-selected="false">
                        Insights <Badge class="ml-1 sm:ml-2 text-xs">New</Badge>
                    </Button>
                    <Button variant="ghost" class="text-muted-foreground text-sm sm:text-base px-3 py-2 sm:px-4" role="tab" aria-selected="false">
                        Predictions <Badge class="ml-1 sm:ml-2 text-xs">New</Badge>
                    </Button>
                </div>

                {/* Mobile-first responsive grid */}
                <div class="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
                    <For each={props.items}>
                        {(item, index) => (
                            <Card 
                                class="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2" 
                                role="listitem"
                                aria-labelledby={`card-title-${index()}`}
                            >
                                <div class="h-32 sm:h-36 md:h-40 bg-muted flex items-center justify-center" aria-hidden="true">
                                    <span class="text-muted-foreground text-3xl sm:text-4xl md:text-5xl">{item.logo}</span>
                                </div>
                                <CardHeader class="p-4 sm:p-6">
                                    <CardTitle id={`card-title-${index()}`} class="text-base sm:text-lg leading-tight text-card-foreground">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent class="p-4 pt-0 sm:p-6 sm:pt-0">
                                    <CardDescription class="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 text-muted-foreground">
                                        {item.description}
                                    </CardDescription>
                                    <Badge 
                                        variant="outline" 
                                        class={`font-semibold text-xs sm:text-sm border-current ${
                                            item.tagColorClass.includes('blue') 
                                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800'
                                                : item.tagColorClass.includes('purple')
                                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800'
                                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800'
                                        }`}
                                    >
                                        {item.tag}
                                    </Badge>
                                </CardContent>
                            </Card>
                        )}
                    </For>
                </div>

                {/* Mobile-optimized CTA button */}
                <div class="text-center mt-8 sm:mt-10 md:mt-12">
                    <Button 
                        variant="outline" 
                        class="text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 border-border text-foreground hover:bg-muted focus:bg-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Explore all travel guides"
                    >
                        Explore All Guides <ArrowRight class="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" aria-hidden="true" />
                    </Button>
                </div>
            </div>
        </section>
    );
}