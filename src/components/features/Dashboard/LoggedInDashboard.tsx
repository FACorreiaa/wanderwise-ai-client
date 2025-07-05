import { Component, createSignal, Show, For, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { 
  Send, Loader2, MapPin, Bookmark, Clock, Star, 
  Calendar, Users, TrendingUp, Heart, Coffee, 
  Camera, Globe, ChevronRight, Sparkles, Plus,
  Map, List, Settings
} from 'lucide-solid';
import { sendUnifiedChatMessageStream, detectDomain } from '~/lib/api/llm';
import { streamingService, createStreamingSession, getDomainRoute } from '~/lib/streaming-service';
import type { StreamingSession } from '~/lib/api/types';
import { useUserLocation } from '~/contexts/LocationContext';
import { useDefaultSearchProfile } from '~/lib/api/profiles';
import { useAuth } from '~/contexts/AuthContext';
import { useLandingPageStatistics } from '~/lib/api/statistics';
import QuickSettingsModal from '~/components/modals/QuickSettingsModal';

interface QuickAction {
  id: string;
  icon: Component;
  title: string;
  subtitle: string;
  prompt: string;
  gradient: string;
}

interface RecentActivity {
  id: string;
  type: 'itinerary' | 'restaurant' | 'hotel' | 'activity';
  title: string;
  location: string;
  timestamp: string;
  saved: boolean;
}

export default function LoggedInDashboard(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentMessage, setCurrentMessage] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [streamProgress, setStreamProgress] = createSignal('');
  const [streamingSession, setStreamingSession] = createSignal<StreamingSession | null>(null);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = createSignal(false);

  const { userLocation } = useUserLocation();
  const userLatitude = userLocation()?.latitude || 38.7223;
  const userLongitude = userLocation()?.longitude || -9.1393;

  // Get default search profile
  const defaultProfileQuery = useDefaultSearchProfile();
  const profileId = () => defaultProfileQuery.data?.id;

  // Get user statistics (only if user is authenticated)
  const userStatsQuery = useLandingPageStatistics();

  const quickActions: QuickAction[] = [
    {
      id: 'discover-nearby',
      icon: MapPin,
      title: 'Discover Nearby',
      subtitle: 'Find hidden gems around you',
      prompt: 'Show me interesting places near my current location',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'food-adventure',
      icon: Coffee,
      title: 'Food Adventure',
      subtitle: 'Culinary discoveries await',
      prompt: 'Find the best local restaurants and food experiences near me',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'cultural-tour',
      icon: Camera,
      title: 'Cultural Tour',
      subtitle: 'Museums, art, and history',
      prompt: 'Create a cultural itinerary with museums and historical sites',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'weekend-plan',
      icon: Calendar,
      title: 'Weekend Plan',
      subtitle: 'Perfect 2-day getaway',
      prompt: 'Plan a perfect weekend itinerary for this city',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  // Mock recent activities - in real app, fetch from API
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'itinerary',
      title: 'Hidden Gems of Lisbon',
      location: 'Lisbon, Portugal',
      timestamp: '2 hours ago',
      saved: true
    },
    {
      id: '2',
      type: 'restaurant',
      title: 'Pastéis de Belém',
      location: 'Belém, Lisbon',
      timestamp: '1 day ago',
      saved: true
    },
    {
      id: '3',
      type: 'activity',
      title: 'Fado Performance at Alfama',
      location: 'Alfama, Lisbon',
      timestamp: '3 days ago',
      saved: false
    }
  ];

  const personalizedSuggestions = [
    {
      icon: '🎨',
      title: 'Art Galleries in Your Area',
      description: 'Based on your love for contemporary art',
      action: 'Explore Now'
    },
    {
      icon: '🍷',
      title: 'Wine Tasting Experience',
      description: 'Perfect for your weekend plans',
      action: 'Book Now'
    },
    {
      icon: '🏛️',
      title: 'Historical Walking Tour',
      description: 'Matches your interest in history',
      action: 'Learn More'
    }
  ];

  const sendMessage = async () => {
    if (!currentMessage().trim() || isLoading()) return;

    setIsLoading(true);
    setStreamProgress('Analyzing your request...');

    try {
      // Clear any previous session data
      sessionStorage.removeItem('currentStreamingSession');
      sessionStorage.removeItem('completedStreamingSession');

      // Detect domain from the message
      const domain = detectDomain(currentMessage());
      console.log('Detected domain:', domain);

      // Create streaming session
      const session = createStreamingSession(domain);
      session.query = currentMessage();
      setStreamingSession(session);

      // Store session in sessionStorage for persistence
      sessionStorage.setItem('currentStreamingSession', JSON.stringify(session));

      // Get current profile ID
      const currentProfileId = profileId();
      if (!currentProfileId) {
        throw new Error('No default search profile found');
      }

      // Start streaming request
      const response = await sendUnifiedChatMessageStream({
        profileId: currentProfileId,
        message: currentMessage(),
        userLocation: {
          userLat: userLatitude,
          userLon: userLongitude
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Set up streaming manager
      streamingService.startStream(response, {
        session,
        onProgress: (updatedSession) => {
          setStreamingSession(updatedSession);
          const domain = updatedSession.domain;
          if (updatedSession.data.general_city_data) {
            setStreamProgress(`Found information about ${updatedSession.data.general_city_data.city}...`);
          } else if (domain === 'accommodation') {
            setStreamProgress('Finding hotels...');
          } else if (domain === 'dining') {
            setStreamProgress('Searching restaurants...');
          } else if (domain === 'activities') {
            setStreamProgress('Discovering activities...');
          } else {
            setStreamProgress('Creating your itinerary...');
          }
          sessionStorage.setItem('currentStreamingSession', JSON.stringify(updatedSession));
        },
        onComplete: (completedSession) => {
          setIsLoading(false);
          setStreamProgress('');
          setCurrentMessage('');

          // Store completed session
          sessionStorage.setItem('completedStreamingSession', JSON.stringify(completedSession));

          // Navigate to appropriate page
          const route = getDomainRoute(completedSession.domain, completedSession.sessionId, completedSession.city);
          if (route) {
            navigate(route);
          }
        },
        onError: (error) => {
          console.error('Streaming error:', error);
          setIsLoading(false);
          setStreamProgress('');
        }
      });

    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      setStreamProgress('');
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    setCurrentMessage(action.prompt);
    setTimeout(() => sendMessage(), 100);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'itinerary': return Calendar;
      case 'restaurant': return Coffee;
      case 'hotel': return MapPin;
      case 'activity': return Star;
      default: return MapPin;
    }
  };

  const currentUser = user();
  const displayName = currentUser?.display_name || currentUser?.firstname || currentUser?.username || 'Explorer';

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        
        {/* Welcome Header */}
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {displayName}! 👋
              </h1>
              <p class="text-gray-600 dark:text-gray-300 mt-1">
                Ready to discover something amazing today?
              </p>
            </div>
            <div class="flex items-center gap-3">
              <button 
                onClick={() => setIsQuickSettingsOpen(true)}
                class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Quick Settings"
              >
                <Settings class="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Saved Places</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">
                    {userStatsQuery.isLoading ? '--' : (userStatsQuery.data?.saved_places ?? '0')}
                  </p>
                </div>
                <Bookmark class="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Itineraries</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">
                    {userStatsQuery.isLoading ? '--' : (userStatsQuery.data?.itineraries ?? '0')}
                  </p>
                </div>
                <Calendar class="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Cities Explored</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">
                    {userStatsQuery.isLoading ? '--' : (userStatsQuery.data?.cities_explored ?? '0')}
                  </p>
                </div>
                <Globe class="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Discoveries</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">
                    {userStatsQuery.isLoading ? '--' : (userStatsQuery.data?.discoveries ?? '0')}
                  </p>
                </div>
                <Sparkles class="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Search */}
        <div class="mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles class="w-5 h-5 text-blue-500" />
              What would you like to discover?
            </h2>
            
            <div class="flex items-end gap-3">
              <div class="flex-1">
                <textarea
                  value={currentMessage()}
                  onInput={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Describe your perfect day, meal, or adventure..."
                  class="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  rows="1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!currentMessage().trim() || isLoading()}
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
              >
                <Show when={isLoading()} fallback={
                  <>
                    <Send class="w-4 h-4" />
                    Discover
                  </>
                }>
                  <Loader2 class="w-4 h-4 animate-spin" />
                  {streamProgress() || 'Processing...'}
                </Show>
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions */}
          <div class="lg:col-span-2">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Discoveries</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <For each={quickActions}>
                {(action) => (
                  <button
                    onClick={() => handleQuickAction(action)}
                    class={`bg-gradient-to-r ${action.gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left group`}
                  >
                    <div class="flex items-start justify-between mb-3">
                      <action.icon class="w-8 h-8" />
                      <ChevronRight class="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                    </div>
                    <h3 class="font-semibold text-lg mb-1">{action.title}</h3>
                    <p class="text-white/80 text-sm">{action.subtitle}</p>
                  </button>
                )}
              </For>
            </div>

            {/* Personalized Suggestions */}
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp class="w-5 h-5 text-green-500" />
                Just for You
              </h3>
              <div class="space-y-4">
                <For each={personalizedSuggestions}>
                  {(suggestion) => (
                    <div class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group cursor-pointer">
                      <div class="flex items-center gap-3">
                        <span class="text-2xl">{suggestion.icon}</span>
                        <div>
                          <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {suggestion.title}
                          </h4>
                          <p class="text-sm text-gray-600 dark:text-gray-400">
                            {suggestion.description}
                          </p>
                        </div>
                      </div>
                      <button class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                        {suggestion.action}
                      </button>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div class="space-y-6">
            
            {/* Recent Activity */}
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                <button class="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium">
                  View All
                </button>
              </div>
              <div class="space-y-3">
                <For each={recentActivities}>
                  {(activity) => {
                    const IconComponent = getActivityIcon(activity.type);
                    return (
                      <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
                        <div class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <IconComponent class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="font-medium text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {activity.title}
                          </h4>
                          <p class="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {activity.location}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-500">
                            {activity.timestamp}
                          </p>
                        </div>
                        <Show when={activity.saved}>
                          <Heart class="w-4 h-4 text-red-500 fill-current" />
                        </Show>
                      </div>
                    );
                  }}
                </For>
              </div>
            </div>

            {/* Quick Actions Sidebar */}
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div class="space-y-3">
                <button 
                  onClick={() => navigate('/chat')}
                  class="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <div class="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Sparkles class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      AI Chat
                    </h4>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      Chat with our AI assistant
                    </p>
                  </div>
                </button>
                
                <button 
                  onClick={() => navigate('/itinerary')}
                  class="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <div class="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Calendar class="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white text-sm group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      My Itineraries
                    </h4>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      View saved plans
                    </p>
                  </div>
                </button>

                <button class="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                  <div class="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Heart class="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white text-sm group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      Saved Places
                    </h4>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      Your favorites
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Settings Modal */}
      <QuickSettingsModal 
        isOpen={isQuickSettingsOpen()} 
        onClose={() => setIsQuickSettingsOpen(false)} 
      />
    </div>
  );
}