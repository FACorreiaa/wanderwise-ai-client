import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { TextField, TextFieldRoot } from "@/ui/textfield";
import { createSignal, For, JSX } from 'solid-js';
import { FiArrowUp } from 'solid-icons/fi';
import { VsSearch } from "solid-icons/vs";

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
        <section class="w-full text-center py-20 md:py-32">
            <div class="container px-4 md:px-6">
                <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-gray-900 mb-6">
                    {props.title}
                </h1>
                <p class="max-w-[700px] mx-auto text-gray-600 md:text-xl mb-12">
                    {props.subtitle}
                </p>

                {/* Search Bar */}
                <div class="max-w-2xl mx-auto mb-8">
                    <div class="relative">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <VsSearch class="h-6 w-6 text-gray-400" />
                        </div>
                        <TextFieldRoot>
                            <TextField
                                type="search"
                                placeholder={props.placeholder}
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                                class="w-full rounded-full py-6 pl-14 pr-16 text-lg border shadow-lg focus:shadow-xl transition-shadow bg-white/60 backdrop-blur-sm"
                            />
                        </TextFieldRoot>
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                            <Button type="submit" size="icon" class="rounded-full bg-blue-600 hover:bg-blue-700 h-10 w-10">
                                <FiArrowUp class="h-5 w-5 text-white" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Suggestion Tags */}
                <div class="flex flex-wrap items-center justify-center gap-2">
                    <For each={props.suggestions}>
                        {(suggestion) => (
                            <Badge
                                variant="outline"
                                class="px-3 py-1.5 bg-white/60 backdrop-blur-sm shadow-sm hover:bg-accent cursor-pointer transition-colors"
                            >
                                <div class="flex items-center gap-2">
                                    {suggestion.icon}
                                    <span class="text-sm font-medium">{suggestion.text}</span>
                                </div>
                            </Badge>
                        )}
                    </For>
                </div>
            </div>
        </section>
    );
}