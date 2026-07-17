import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { TrendingUp, ArrowRight } from "lucide-solid";
import { Component, For, Show } from "solid-js";
import { useTrendingDiscoveries } from "@/lib/api/discover";

const TrendingComponent: Component = () => {
  const trending = useTrendingDiscoveries(6);

  return (
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-center space-x-8 mb-12">
          <Button
            variant="ghost"
            class="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
          >
            Trending
          </Button>
        </div>

        <Show
          when={(trending.data?.length ?? 0) > 0}
          fallback={
            <p class="text-center text-gray-500 dark:text-gray-400">
              {trending.isLoading
                ? "Loading trending destinations…"
                : "No trending destinations yet."}
            </p>
          }
        >
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <For each={trending.data ?? []}>
              {(item) => (
                <Card class="hover:shadow-lg transition-all duration-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                  <CardHeader class="pb-4">
                    <div class="flex items-start space-x-4">
                      <div class="w-12 h-12 bg-[#0c7df2] rounded-lg flex items-center justify-center text-white text-xl shadow ring-2 ring-white/50 dark:ring-slate-800">
                        {item.emoji || "📍"}
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                          <CardTitle class="text-lg font-semibold text-gray-900 dark:text-white">
                            {item.city_name}
                          </CardTitle>
                          <Badge variant="secondary" class="text-xs">
                            {item.search_count.toLocaleString()} searches
                          </Badge>
                        </div>
                        <CardDescription class="text-gray-600 dark:text-gray-300">
                          Trending destination on Loci
                        </CardDescription>
                      </div>
                      <TrendingUp class="w-5 h-5 text-green-500" />
                    </div>
                  </CardHeader>
                </Card>
              )}
            </For>
          </div>
        </Show>

        <div class="text-center mt-12">
          <Button
            variant="outline"
            class="border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            View All Trending <ArrowRight class="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrendingComponent;
