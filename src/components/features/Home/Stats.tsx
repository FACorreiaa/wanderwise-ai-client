import { Badge } from "@/ui/badge";

interface StatItem {
    value: string;
    label: string;
}

interface StatsProps {
    badgeText: string;
    items: StatItem[];
}

export default function Stats(props: StatsProps) {
    return (
        <section class="w-full py-12 sm:py-16 md:py-20 lg:py-24" aria-labelledby="stats-heading">
            <div class="container text-center px-4 sm:px-6 lg:px-8">
                <Badge class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold mb-6 sm:mb-8 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
                    {props.badgeText}
                </Badge>
                <h2 id="stats-heading" class="sr-only">Platform Statistics</h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto" role="list">
                    {props.items.map((stat) => (
                        <div class="text-center" role="listitem">
                            <p class="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-1 sm:mb-2">
                                {stat.value}
                            </p>
                            <p class="text-xs sm:text-sm text-muted-foreground leading-tight px-2 sm:px-0">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}