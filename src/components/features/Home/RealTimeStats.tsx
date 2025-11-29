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
        <section class="w-full py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden" aria-labelledby="stats-heading">
            <div class="pointer-events-none absolute inset-0 bg-white/30 dark:bg-slate-900/30" aria-hidden="true" />
            <div class="container text-center px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="flex items-center justify-center gap-2 mb-6 sm:mb-8">
                    <Badge class="bg-[#0c7df2] hover:bg-[#0a6ed6] text-white font-semibold px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm shadow-[0_12px_32px_rgba(12,125,242,0.22)] border border-white/20 dark:border-slate-800/60">
                        {props.badgeText}
                    </Badge>
                    
                    <Show when={isConnected()}>
                        <div class="flex items-center gap-1 text-emerald-500 dark:text-emerald-300">
                            <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
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
                            <div class="text-center group glass-panel gradient-border rounded-2xl px-4 py-6 sm:px-6 sm:py-8 hover:shadow-[0_16px_50px_rgba(14,165,233,0.2)] transition-all duration-300" role="listitem">
                                <div class="flex flex-col items-center">
                                    <Show when={stat.icon}>
                                        <div class="mb-3 p-3 bg-cyan-100/70 dark:bg-cyan-900/40 rounded-full group-hover:bg-cyan-200/70 dark:group-hover:bg-cyan-900/60 transition-colors">
                                            <stat.icon class="w-6 h-6 text-cyan-600 dark:text-cyan-300" />
                                        </div>
                                    </Show>
                                    
                                    <p class="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-1 sm:mb-2 transition-all duration-500 tracking-tight">
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
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-4">
                        Last updated: {lastUpdate()?.toLocaleTimeString()}
                    </p>
                </Show>
            </div>
        </section>
    );
}
