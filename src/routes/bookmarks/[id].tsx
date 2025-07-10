import { createSignal, Show, For, createEffect } from 'solid-js';
import { useParams } from '@solidjs/router';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Globe, 
  MapPin, 
  Clock, 
  Share2, 
  Edit3, 
  Trash2,
  Bookmark,
  Tag,
  User,
  Eye,
  Download
} from 'lucide-solid';
import { A } from '@solidjs/router';
import { useItinerary, useRemoveItineraryMutation } from '~/lib/api/itineraries';

export default function BookmarkDetailPage() {
  const params = useParams();
  const [selectedTab, setSelectedTab] = createSignal('overview');
  
  // Use existing itinerary API hook since bookmarks are stored in the same table
  const itineraryQuery = useItinerary(params.id);
  const removeItineraryMutation = useRemoveItineraryMutation();
  
  const bookmark = () => itineraryQuery.data;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'content', label: 'Content' },
    { id: 'details', label: 'Details' }
  ];

  const getCostLevelText = (level) => {
    const levels = {
      1: "Budget",
      2: "Moderate", 
      3: "Expensive",
      4: "Luxury"
    };
    return levels[level] || "Unknown";
  };

  const getCostLevelColor = (level) => {
    const colors = {
      1: "text-green-600 bg-green-50 border-green-200",
      2: "text-blue-600 bg-blue-50 border-blue-200",
      3: "text-orange-600 bg-orange-50 border-orange-200",
      4: "text-purple-600 bg-purple-50 border-purple-200"
    };
    return colors[level] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const removeBookmark = async () => {
    if (confirm('Are you sure you want to remove this bookmark?')) {
      try {
        await removeItineraryMutation.mutateAsync(params.id);
        // Navigate back to bookmarks page
        window.location.href = '/bookmarks';
      } catch (error) {
        console.error('Failed to remove bookmark:', error);
      }
    }
  };

  const renderOverview = () => (
    <div class="space-y-6">
      {/* Description */}
      <Show when={bookmark()?.description}>
        <div class="bg-white rounded-lg p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Description</h3>
          <p class="text-gray-600 leading-relaxed">{bookmark()?.description}</p>
        </div>
      </Show>

      {/* Key Information */}
      <div class="bg-white rounded-lg p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Itinerary Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Show when={bookmark()?.estimated_duration_days}>
            <div class="flex items-center gap-3">
              <Calendar class="w-5 h-5 text-gray-500" />
              <div>
                <p class="text-sm text-gray-500">Duration</p>
                <p class="font-medium">{bookmark()?.estimated_duration_days} day{bookmark()?.estimated_duration_days > 1 ? 's' : ''}</p>
              </div>
            </div>
          </Show>
          
          <Show when={bookmark()?.estimated_cost_level}>
            <div class="flex items-center gap-3">
              <DollarSign class="w-5 h-5 text-gray-500" />
              <div>
                <p class="text-sm text-gray-500">Cost Level</p>
                <span class={`px-2 py-1 rounded text-sm border ${getCostLevelColor(bookmark()?.estimated_cost_level)}`}>
                  {getCostLevelText(bookmark()?.estimated_cost_level)}
                </span>
              </div>
            </div>
          </Show>
          
          <div class="flex items-center gap-3">
            <Globe class="w-5 h-5 text-gray-500" />
            <div>
              <p class="text-sm text-gray-500">Visibility</p>
              <p class="font-medium">{bookmark()?.is_public ? 'Public' : 'Private'}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <Clock class="w-5 h-5 text-gray-500" />
            <div>
              <p class="text-sm text-gray-500">Created</p>
              <p class="font-medium">{formatDate(bookmark()?.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <Show when={bookmark()?.tags && bookmark()?.tags.length > 0}>
        <div class="bg-white rounded-lg p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
          <div class="flex flex-wrap gap-2">
            <For each={bookmark()?.tags}>
              {(tag) => (
                <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200">
                  <Tag class="w-3 h-3 inline mr-1" />
                  {tag}
                </span>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );

  const renderContent = () => (
    <div class="space-y-6">
      <Show when={bookmark()?.markdown_content}>
        <div class="bg-white rounded-lg p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Itinerary Content</h3>
          <div class="prose prose-sm max-w-none">
            <pre class="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {bookmark()?.markdown_content}
            </pre>
          </div>
        </div>
      </Show>
    </div>
  );

  const renderDetails = () => (
    <div class="space-y-6">
      <div class="bg-white rounded-lg p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Technical Details</h3>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-500">Bookmark ID</p>
            <p class="font-mono text-sm">{bookmark()?.id}</p>
          </div>
          <Show when={bookmark()?.source_llm_interaction_id}>
            <div>
              <p class="text-sm text-gray-500">Source LLM Interaction</p>
              <p class="font-mono text-sm">{bookmark()?.source_llm_interaction_id}</p>
            </div>
          </Show>
          <Show when={bookmark()?.session_id}>
            <div>
              <p class="text-sm text-gray-500">Session ID</p>
              <p class="font-mono text-sm">{bookmark()?.session_id}</p>
            </div>
          </Show>
          <Show when={bookmark()?.primary_city_id}>
            <div>
              <p class="text-sm text-gray-500">Primary City ID</p>
              <p class="font-mono text-sm">{bookmark()?.primary_city_id}</p>
            </div>
          </Show>
          <div>
            <p class="text-sm text-gray-500">Last Updated</p>
            <p class="font-medium">{formatDate(bookmark()?.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Loading State */}
      <Show when={itineraryQuery.isLoading}>
        <div class="flex items-center justify-center min-h-screen">
          <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Show>

      {/* Error State */}
      <Show when={itineraryQuery.isError}>
        <div class="flex items-center justify-center min-h-screen">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Bookmark Not Found</h2>
            <p class="text-gray-600 mb-4">The bookmark you're looking for doesn't exist or has been removed.</p>
            <A href="/bookmarks" class="cb-button cb-button-primary">
              Back to Bookmarks
            </A>
          </div>
        </div>
      </Show>

      {/* Content */}
      <Show when={bookmark()}>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div class="mb-6">
            <A href="/bookmarks" class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft class="w-4 h-4 mr-2" />
              Back to Bookmarks
            </A>
            
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    <Bookmark class="w-6 h-6" />
                  </div>
                  <div>
                    <h1 class="text-2xl font-bold text-gray-900">{bookmark()?.title}</h1>
                    <p class="text-gray-500">Saved {formatDate(bookmark()?.created_at)}</p>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Share2 class="w-5 h-5" />
                </button>
                <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Edit3 class="w-5 h-5" />
                </button>
                <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Download class="w-5 h-5" />
                </button>
                <button 
                  onClick={removeBookmark}
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  disabled={removeItineraryMutation.isLoading}
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div class="border-b border-gray-200 mb-6">
            <nav class="flex space-x-8">
              <For each={tabs}>
                {(tab) => (
                  <button
                    onClick={() => setSelectedTab(tab.id)}
                    class={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab() === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                )}
              </For>
            </nav>
          </div>

          {/* Tab Content */}
          <div class="pb-6">
            <Show when={selectedTab() === 'overview'}>
              {renderOverview()}
            </Show>
            <Show when={selectedTab() === 'content'}>
              {renderContent()}
            </Show>
            <Show when={selectedTab() === 'details'}>
              {renderDetails()}
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}