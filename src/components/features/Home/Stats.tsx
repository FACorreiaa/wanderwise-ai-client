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
        <section class="w-full py-16 md:py-24">
            <div class="container text-center">
                <Badge class="bg-blue-600 hover:bg-blue-700 text-white font-semibold mb-8 px-4 py-1.5">
                    {props.badgeText}
                </Badge>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {props.items.map((stat) => (
                        <div class="text-center">
                            <p class="text-4xl md:text-5xl font-bold text-gray-900">{stat.value}</p>
                            <p class="text-sm text-muted-foreground mt-2">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}