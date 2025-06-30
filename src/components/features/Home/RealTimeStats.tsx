import { Component, createSignal, onMount, onCleanup, Show } from 'solid-js';
import { Badge } from "@/ui/badge";
import { useRealTimeStatistics, type MainPageStatistics } from '~/lib/api/statistics';
import { TrendingUp, Users, MapPin, Calendar } from 'lucide-solid';

interface StatItem {
    value: string;
    label: string;
    icon?: Component;
    trend?: number; // Percentage change
}

interface RealTimeStatsProps {
    badgeText: string;
}

// Utility function to format numbers with commas
const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
};

// Utility function to animate number changes
const animateNumber = (
    from: number,
    to: number,
    duration: number = 1000,
    callback: (value: number) => void
) => {
    const startTime = Date.now();
    const difference = to - from;
    
    const updateNumber = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(from + (difference * easeOut));
        
        callback(current);
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    };
    
    requestAnimationFrame(updateNumber);
};

export default function RealTimeStats(props: RealTimeStatsProps): JSX.Element {
    const [currentStats, setCurrentStats] = createSignal<MainPageStatistics | null>(null);
    const [isConnected, setIsConnected] = createSignal(false);
    const [animatedUsers, setAnimatedUsers] = createSignal(0);
    const [animatedItineraries, setAnimatedItineraries] = createSignal(0);
    const [animatedPOIs, setAnimatedPOIs] = createSignal(0);
    const [lastUpdate, setLastUpdate] = createSignal<Date | null>(null);
    const [isLoading, setIsLoading] = createSignal(true);

    // Real-time SSE connection
    const sseConnection = useRealTimeStatistics(
        (newStats: MainPageStatistics) => {
            console.log('Received real-time statistics update:', newStats);
            
            const previous = currentStats();
            setCurrentStats(newStats);
            setLastUpdate(new Date());
            setIsLoading(false);
            
            // Animate number changes if we have previous data
            if (previous) {
                if (previous.total_users_count !== newStats.total_users_count) {
                    animateNumber(previous.total_users_count, newStats.total_users_count, 1500, setAnimatedUsers);
                }
                if (previous.total_itineraries_saved !== newStats.total_itineraries_saved) {
                    animateNumber(previous.total_itineraries_saved, newStats.total_itineraries_saved, 1500, setAnimatedItineraries);
                }
                if (previous.total_unique_pois !== newStats.total_unique_pois) {
                    animateNumber(previous.total_unique_pois, newStats.total_unique_pois, 1500, setAnimatedPOIs);
                }
            } else {
                // Initial load - set values immediately
                setAnimatedUsers(newStats.total_users_count);
                setAnimatedItineraries(newStats.total_itineraries_saved);
                setAnimatedPOIs(newStats.total_unique_pois);
            }
        },
        (error) => {
            console.error('SSE Error:', error);
            setIsConnected(false);
            setIsLoading(false);
        }
    );

    onMount(() => {
        // Start SSE connection
        sseConnection.connect();
        setIsConnected(sseConnection.isConnected());

        // Check connection status periodically
        const connectionCheck = setInterval(() => {
            setIsConnected(sseConnection.isConnected());
        }, 5000);

        onCleanup(() => {
            clearInterval(connectionCheck);
            sseConnection.disconnect();
        });
    });

    // Use current stats from SSE only
    const stats = () => currentStats();

    const statsItems = (): StatItem[] => {
        const data = stats();
        if (!data) return [];

        return [
            {
                value: formatNumber(animatedUsers()),
                label: "Users registered",
                icon: Users,
            },
            {
                value: formatNumber(animatedItineraries()),
                label: "Personalized Itineraries Saved",
                icon: Calendar,
            },
            {
                value: formatNumber(animatedPOIs()),
                label: "Unique Points of Interest",
                icon: MapPin,
            }
        ];
    };

    return (
        <section class="w-full py-12 sm:py-16 md:py-20 lg:py-24" aria-labelledby="stats-heading">
            <div class="container text-center px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-center gap-2 mb-6 sm:mb-8">
                    <Badge class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
                        {props.badgeText}
                    </Badge>
                    
                    <Show when={isConnected()}>
                        <div class="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span class="text-xs font-medium">Live</span>
                        </div>
                    </Show>
                </div>
                
                <h2 id="stats-heading" class="sr-only">Platform Statistics</h2>
                
                <Show 
                    when={!isLoading() && stats()} 
                    fallback={
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
                            {Array.from({ length: 3 }).map(() => (
                                <div class="text-center" role="listitem">
                                    <div class="h-12 sm:h-16 md:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
                                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    }
                >
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto" role="list">
                        {statsItems().map((stat, index) => (
                            <div class="text-center group" role="listitem">
                                <div class="flex flex-col items-center">
                                    <Show when={stat.icon}>
                                        <div class="mb-2 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                            <stat.icon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </Show>
                                    
                                    <p class="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-1 sm:mb-2 transition-all duration-500">
                                        {stat.value}
                                    </p>
                                    
                                    <p class="text-xs sm:text-sm text-muted-foreground leading-tight px-2 sm:px-0">
                                        {stat.label}
                                    </p>
                                    
                                    <Show when={stat.trend}>
                                        <div class="flex items-center gap-1 mt-1">
                                            <TrendingUp class="w-3 h-3 text-green-500" />
                                            <span class="text-xs text-green-600 dark:text-green-400 font-medium">
                                                +{stat.trend}%
                                            </span>
                                        </div>
                                    </Show>
                                </div>
                            </div>
                        ))}
                    </div>
                </Show>
                
                <Show when={lastUpdate()}>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">
                        Last updated: {lastUpdate()?.toLocaleTimeString()}
                    </p>
                </Show>
            </div>
        </section>
    );
}