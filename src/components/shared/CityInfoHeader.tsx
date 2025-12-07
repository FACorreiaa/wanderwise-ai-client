import { Component, Show } from 'solid-js';
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-solid';

interface CityInfoHeaderProps {
    city?: string;
    description?: string;
    weather?: string;
    onPlanTrip?: () => void;
    loading?: boolean;
}

export const CityInfoHeader: Component<CityInfoHeaderProps> = (props) => {
    return (
        <div class="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 mb-6">
            <div class="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-50 dark:bg-blue-900/20 blur-3xl" />
            <div class="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-purple-50 dark:bg-purple-900/20 blur-3xl" />

            <div class="relative z-10">
                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <MapPin class="h-5 w-5" />
                        <span class="text-sm font-semibold uppercase tracking-wider">Destination</span>
                    </div>

                    <Show when={!props.loading} fallback={<div class="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />}>
                        <h1 class="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
                            {props.city || 'Explore'}
                        </h1>
                    </Show>

                    <Show when={!props.loading} fallback={<div class="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />}>
                        <p class="max-w-2xl text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            {props.description || 'Discover amazing places and create unforgettable memories.'}
                        </p>
                    </Show>

                    <Show when={props.weather}>
                        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                            <span class="font-medium">Weather:</span> {props.weather}
                        </div>
                    </Show>

                    <Show when={props.onPlanTrip}>
                        <div class="mt-6">
                            <button
                                onClick={props.onPlanTrip}
                                class="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
                            >
                                Plan New Trip
                                <ArrowRight class="h-4 w-4" />
                            </button>
                        </div>
                    </Show>
                </div>
            </div>
        </div>
    );
};
