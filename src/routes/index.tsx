import { Component, JSX } from 'solid-js';
import CTA from '~/components/features/Home/CTA';
import ContentGrid from '~/components/features/Home/ContentGrid';
import Hero from '~/components/features/Home/Hero';
import Stats from '~/components/features/Home/Stats';
import MobileAppAnnouncement from '~/components/features/Home/MobileAppAnnouncement';
import { Landmark, Utensils, Sparkles, Map } from 'lucide-solid';

// Data for the WanderWiseAI landing page
const heroData = {
    title: (
        <>
            Discover your next adventure,{' '}
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                smarter
            </span>
        </>
    ),
    subtitle: "Tired of generic city guides? Loci creates hyper-personalized travel plans based on your unique interests and real-time context.",
    placeholder: "Where to? e.g., 'art museums in Paris'",
    suggestions: [
        { icon: <Landmark class="w-4 h-4" />, text: "Historical sites in Rome" },
        { icon: <Utensils class="w-4 h-4" />, text: "Best ramen in Tokyo" },
        { icon: <Sparkles class="w-4 h-4" />, text: "Hidden gems in Lisbon" },
        { icon: <Map class="w-4 h-4" />, text: "3-hour art walk in Florence" },
    ]
};

const statsData = {
    badgeText: "This month on Loci",
    items: [
        { value: "69,420", label: "Users registered" },
        { value: "12,109", label: "Personalized Itineraries Created" },
        { value: "41,004", label: "Unique Points of Interest" },
        // { value: "50+", label: "Supported Cities & Growing" },
    ]
};

const contentData = [
    {
        logo: <span class="text-5xl">🗺️</span>,
        title: "New in Paris: Hidden Gems",
        description: "Our AI has uncovered 15 new unique spots in Le Marais, from artisan shops to quiet courtyards.",
        tag: "New Itinerary",
        tagColorClass: "bg-blue-100 text-blue-800",
        imageUrl: ""
    },
    {
        logo: <span class="text-5xl">🤖</span>,
        title: "AI-Curated: A Foodie's Weekend in Lisbon",
        description: "From classic Pastéis de Nata to modern seafood, let our AI guide your taste buds through Lisbon's best.",
        tag: "AI-Powered",
        tagColorClass: "bg-purple-100 text-purple-800",
        imageUrl: ""
    },
    {
        logo: <span class="text-5xl">⭐️</span>,
        title: "User Favorite: The Ancient Rome Route",
        description: "Explore the Colosseum, Forum, and Palatine Hill with a personalized route optimized for a 4-hour window.",
        tag: "Top Rated",
        tagColorClass: "bg-amber-100 text-amber-800",
        imageUrl: ""
    }
];

const LandingPage: Component = () => {
    return (
        <div class="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
            <Hero
                title={heroData.title}
                subtitle={heroData.subtitle}
                placeholder={heroData.placeholder}
                suggestions={heroData.suggestions}
            />
            <Stats badgeText={statsData.badgeText} items={statsData.items} />
            <ContentGrid items={contentData} />
            <MobileAppAnnouncement />
            <CTA />
        </div>
    );
};

export default LandingPage;