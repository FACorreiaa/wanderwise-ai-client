import { createSignal, createResource, For, Show, Suspense } from 'solid-js';
import { Card } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { A } from '@solidjs/router';
import { TextField, TextFieldRoot } from '@/ui/textfield';
import { MapPin, Clock, Eye, Search, Grid, List } from 'lucide-solid';
import { fetchUserRecentInteractions } from '~/lib/api/recents';

export default function Recents() {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [viewMode, setViewMode] = createSignal<'grid' | 'list'>('grid');

  // Fetch recent interactions
  const [recentInteractions] = createResource(fetchUserRecentInteractions);

  // Filter cities based on search query
  const filteredCities = () => {
    const data = recentInteractions();
    if (!data?.cities) return [];

    const query = searchQuery().toLowerCase();
    if (!query) return data.cities;

    return data.cities.filter(city =>
      city.city_name.toLowerCase().includes(query)
    );
  };

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div class="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <div class="container mx-auto px-4 py-8">
        {/* Header */}
        <div class="text-center mb-12">
          <div class="flex items-center justify-center gap-3 mb-4">
            <div class="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Clock class="w-8 h-8" />
            </div>
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Recent Interactions</h1>
          </div>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Revisit the cities you've explored and discover new places based on your previous searches
          </p>
        </div>

        {/* Search and Controls */}
        <div class="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <TextFieldRoot class="relative flex-1 max-w-md">
            <TextField
              type="text"
              placeholder="Search cities..."
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              class="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </TextFieldRoot>

          {/* View Mode Toggle */}
          <div class="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <Button
              variant={viewMode() === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              class="px-3 py-1"
            >
              <Grid class="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode() === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              class="px-3 py-1"
            >
              <List class="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Recent Interactions Content */}
        <Suspense fallback={
          <div class="flex items-center justify-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <Show
            when={recentInteractions.state === 'ready'}
            fallback={
              <Show when={recentInteractions.state === 'errored'}>
                <div class="text-center py-12">
                  <div class="text-red-500 dark:text-red-400 mb-4">
                    <Clock class="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 class="text-xl font-semibold mb-2">Failed to Load Recent Interactions</h3>
                    <p>There was an error loading your recent interactions. Please try again.</p>
                  </div>
                  <Button onClick={() => recentInteractions.refetch()}>
                    Try Again
                  </Button>
                </div>
              </Show>
            }
          >
            <Show
              when={filteredCities().length > 0}
              fallback={
                <div class="text-center py-12">
                  <Clock class="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                  <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {searchQuery() ? 'No matching cities found' : 'No recent interactions yet'}
                  </h3>
                  <p class="text-gray-500 dark:text-gray-400 mb-6">
                    {searchQuery()
                      ? 'Try adjusting your search terms.'
                      : 'Start exploring cities to see your recent interactions here.'
                    }
                  </p>
                  <Show when={!searchQuery()}>
                    <A href="/discover">
                      <Button class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        <MapPin class="w-4 h-4 mr-2" />
                        Start Exploring
                      </Button>
                    </A>
                  </Show>
                </div>
              }
            >
              <div class={
                viewMode() === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                <For each={filteredCities()}>
                  {(city) => (
                    <Card class={`group hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${viewMode() === 'list' ? 'flex flex-row items-center p-4' : 'p-6'
                      }`}>
                      <Show when={viewMode() === 'grid'}>
                        <div class="flex items-center justify-between mb-4">
                          <div class="flex items-center gap-3">
                            <div class="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                              <MapPin class="w-5 h-5" />
                            </div>
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                              {city.city_name}
                            </h3>
                          </div>
                          <Badge variant="secondary" class="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                            {city.poi_count} POIs
                          </Badge>
                        </div>

                        <div class="space-y-3 mb-4">
                          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock class="w-4 h-4" />
                            <span>Last visited {formatLastActivity(city.last_activity)}</span>
                          </div>
                          <div class="text-sm text-gray-600 dark:text-gray-400">
                            {city.interactions.length} interaction{city.interactions.length !== 1 ? 's' : ''}
                          </div>
                        </div>

                        <div class="space-y-2 mb-4">
                          <Show when={city.interactions.length > 0}>
                            <div class="text-sm text-gray-700 dark:text-gray-300">
                              <span class="font-medium">Recent activity:</span>
                              <p class="mt-1 text-gray-600 dark:text-gray-400 line-clamp-2">
                                {city.interactions[0].prompt}
                              </p>
                            </div>
                          </Show>
                        </div>

                        <A href={`/recents/city/${encodeURIComponent(city.city_name)}`}>
                          <Button class="w-full group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                            <Eye class="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </A>
                      </Show>

                      <Show when={viewMode() === 'list'}>
                        <div class="flex items-center gap-4 flex-1">
                          <div class="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            <MapPin class="w-5 h-5" />
                          </div>
                          <div class="flex-1">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                              {city.city_name}
                            </h3>
                            <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>{city.poi_count} POIs</span>
                              <span>{city.interactions.length} interactions</span>
                              <span>Last visited {formatLastActivity(city.last_activity)}</span>
                            </div>
                          </div>
                          <A href={`/recents/city/${encodeURIComponent(city.city_name)}`}>
                            <Button size="sm">
                              <Eye class="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </A>
                        </div>
                      </Show>
                    </Card>
                  )}
                </For>
              </div>
            </Show>
          </Show>
        </Suspense>

        {/* Statistics */}
        <Show when={recentInteractions()?.cities?.length > 0}>
          <div class="mt-12 text-center">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700">
              <Clock class="w-4 h-4 text-blue-600" />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                You've explored <span class="font-semibold text-blue-600">{recentInteractions()?.cities?.length}</span> cities
              </span>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}