import { Badge } from "@/ui/badge";
import { Component, Show, For, createEffect, createSignal } from "solid-js";
import { useMainPageStatistics } from "~/lib/api/statistics";

const StatisticsComponent: Component = () => {
  const statsQuery = useMainPageStatistics();
  const [stats, setStats] = createSignal({
    users: 0,
    itineraries: 0,
    pois: 0,
  });

  createEffect(() => {
    const data = statsQuery.data;
    if (data) {
      setStats({
        users: data.total_users_count,
        itineraries: data.total_itineraries_saved,
        pois: data.total_unique_pois,
      });
    }
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  return (
    <section class="py-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <Badge class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mb-4">
            Loci Community
          </Badge>
        </div>

        <Show
          when={!statsQuery.isLoading}
          fallback={
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <For each={[1, 2, 3]}>
                {() => (
                  <div class="text-center animate-pulse">
                    <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto mb-2" />
                    <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto" />
                  </div>
                )}
              </For>
            </div>
          }
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {formatNumber(stats().users)}
              </div>
              <div class="text-gray-600 dark:text-gray-300">Users Registered</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {formatNumber(stats().itineraries)}
              </div>
              <div class="text-gray-600 dark:text-gray-300">Personalized Itineraries Saved</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {formatNumber(stats().pois)}
              </div>
              <div class="text-gray-600 dark:text-gray-300">Unique Points of Interest</div>
            </div>
          </div>
        </Show>
      </div>
    </section>
  );
};

export default StatisticsComponent;
