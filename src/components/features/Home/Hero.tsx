import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { TextField, TextFieldRoot } from "@/ui/textfield";
import { createSignal, For, JSX } from 'solid-js';
import { FiArrowRight } from 'solid-icons/fi';
import { ImageRoot, ImageFallback, Image } from "@/ui/image";

interface HeroSuggestion {
    icon: JSX.Element;
    text: string;
}

interface HeroProps {
    title: JSX.Element;
    subtitle: string;
    placeholder: string;
    suggestions: HeroSuggestion[];
}

export default function Hero(props: HeroProps) {
    const [searchQuery, setSearchQuery] = createSignal('');

    return (
        <section class="w-full text-center py-12 sm:py-16 md:py-24 lg:py-32">
            <div class="container px-4 sm:px-6 lg:px-8">
                <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-4 sm:mb-6 leading-tight">
                    {props.title}
                </h1>
                <p class="max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 px-4 sm:px-0">
                    {props.subtitle}
                </p>

                {/* Search Bar - Mobile First */}
                <div class="max-w-2xl mx-auto mb-6 sm:mb-8">
                    <div class="relative">
                        {/* Mascot/Logo on the left */}
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                            <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden">
                                <ImageRoot>
                                    <Image src="/images/loci.png" class="w-full h-full object-cover" />
                                    <ImageFallback class="w-full h-full bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">L</ImageFallback>
                                </ImageRoot>
                            </div>
                        </div>
                        <TextFieldRoot>
                            <TextField
                                type="search"
                                placeholder={props.placeholder}
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                                class="w-full rounded-full py-4 sm:py-5 md:py-6 pl-12 sm:pl-16 pr-14 sm:pr-16 text-base sm:text-lg border border-border shadow-lg focus:shadow-xl transition-shadow bg-background/60 backdrop-blur-sm focus:bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
                            />
                        </TextFieldRoot>
                        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                            <Button type="submit" size="icon" class="rounded-full bg-blue-600 hover:bg-blue-700 h-9 w-9 sm:h-10 sm:w-10 transition-all hover:scale-105">
                                <FiArrowRight class="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Suggestion Tags - Mobile Optimized */}
                <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 sm:px-0" role="list" aria-label="Search suggestions">
                    <For each={props.suggestions}>
                        {(suggestion) => (
                            <Badge
                                variant="outline"
                                class="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-background/80 backdrop-blur-sm shadow-sm hover:bg-accent cursor-pointer transition-colors text-xs sm:text-sm border-border"
                                role="listitem"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        // Handle suggestion click
                                    }
                                }}
                            >
                                <div class="flex items-center gap-1.5 sm:gap-2">
                                    <div class="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center text-muted-foreground" aria-hidden="true">
                                        {suggestion.icon}
                                    </div>
                                    <span class="font-medium whitespace-nowrap text-foreground">{suggestion.text}</span>
                                </div>
                            </Badge>
                        )}
                    </For>
                </div>
            </div>
        </section>
    );
}