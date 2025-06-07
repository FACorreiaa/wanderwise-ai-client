import HeroSearch from "~/components/HeroSearch";
import StatsDisplay from "~/components/StatsDisplay";
import ContentCard from "~/components/ContentCard";
import { Button } from "@/ui/button";

export default function Home() {
    const content = [
        {
            title: "LeadMonitor acquires Garth Fort",
            description: "It is possible that LeadMonitor will grow...",
            tag: "Leadership Hire",
            tagColorClass: "bg-blue-100 text-blue-700",
            imageUrl: "placeholder1.jpg", // replace with actual or remove
        },
        {
            title: "OpenAI Growth Prediction",
            description: "It is possible that OpenAI will grow...",
            tag: "Growth Prediction",
            tagColorClass: "bg-purple-100 text-purple-700",
            imageUrl: "placeholder2.jpg", // replace with actual or remove
        },
        {
            title: "New Unicorn Alert: SparkleTech",
            description: "SparkleTech hits $1B valuation after Series C.",
            tag: "Funding",
            tagColorClass: "bg-green-100 text-green-700",
            imageUrl: "placeholder3.jpg", // replace with actual or remove
        },
    ];

    return (
        <div class="flex flex-col items-center">
            {/* Hero Section */}
            <section class="w-full py-20 md:py-32 text-center bg-hero-gradient">
                <div class="container px-4 md:px-6">
                    <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-primary mb-6">
                        Make better decisions, faster
                    </h1>
                    <p class="max-w-[700px] mx-auto text-muted-foreground md:text-xl mb-10">
                        Discover and act on private market activity with predictive company intelligence
                    </p>
                    <HeroSearch />
                </div>
            </section>

            {/* Call to Action Bar */}
            <section class="w-full py-10 bg-secondary/50">
                <div class="container text-center">
                    <span class="text-lg text-foreground mr-4">Get the full experience.</span>
                    <Button size="lg" class="bg-cb-orange text-primary-foreground hover:bg-cb-orange/90">See Plans</Button>
                </div>
            </section>

            {/* Stats Section */}
            <section class="w-full py-16 md:py-24">
                <div class="container text-center">
                    <Button variant="default" class="mb-8 bg-cb-purple hover:bg-cb-purple/90 text-white">
                        This month on DataSpark
                    </Button>
                    <StatsDisplay />
                </div>
            </section>

            {/* Content Grid Section */}
            <section class="w-full py-16 md:py-24 bg-muted/30">
                <div class="container px-4 md:px-6">
                    <div class="flex justify-center mb-12 space-x-2">
                        {/* Basic Tabs - In a real app, this would have state and filter content */}
                        <Button variant="ghost" class="text-primary font-semibold">Trending</Button>
                        <Button variant="ghost" class="text-muted-foreground">Insights <span class="ml-1.5 px-1.5 py-0.5 text-xs rounded-sm bg-primary text-primary-foreground">New</span></Button>
                        <Button variant="ghost" class="text-muted-foreground">Predictions <span class="ml-1.5 px-1.5 py-0.5 text-xs rounded-sm bg-primary text-primary-foreground">New</span></Button>
                    </div>
                    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {content.map((item) => (
                            <ContentCard
                                title={item.title}
                                description={item.description}
                                tag={item.tag}
                                tagColorClass={item.tagColorClass}
                            // imageUrl={item.imageUrl} // Uncomment if you have images
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}