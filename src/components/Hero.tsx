import { Button } from "@/ui/button";
import { TextField, TextFieldRoot } from "@/ui/textfield";
import { VsSearch } from "solid-icons/vs"; // npm install solid-icons
import { FiArrowUp } from 'solid-icons/fi';

export default function HeroSearch() {
    const suggestions = [
        "Compare Notion and Coda",
        "Cybersecurity exits in the last 12 months",
        "Find SaaS companies that are likely growing",
        "Tech companies that are likely raising soon",
    ];

    return (
        <div class="w-full max-w-2xl mx-auto">
            <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    {/* Replace with a more Crunchbase-like dog/search icon if you have one */}
                    <VsSearch class="h-5 w-5 text-muted-foreground" />
                </div>
                <TextFieldRoot>
                    <TextField
                        type="search"
                        placeholder="Ask me about company and market data..."
                        class="w-full rounded-full py-6 pl-12 pr-16 text-md shadow-lg focus:shadow-xl transition-shadow"
                    />
                </TextFieldRoot>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Button type="submit" size="icon" class="rounded-full bg-cb-blue hover:bg-cb-blue-dark h-10 w-10">
                        <FiArrowUp class="h-5 w-5 text-white" />
                    </Button>
                </div>
            </div>
            <div class="mt-4 flex flex-wrap items-center justify-center gap-2 px-4">
                {suggestions.map((s) => (
                    <Button variant="outline" size="sm" class="bg-background/70 hover:bg-accent text-xs sm:text-sm">
                        {s}
                    </Button>
                ))}
            </div>
        </div>
    );
}