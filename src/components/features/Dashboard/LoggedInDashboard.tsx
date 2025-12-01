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
  tone: string;
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
      tone: 'bg-[#0c7df2]'
    },
    {
      id: 'food-adventure',
      icon: Coffee,
      title: 'Food Adventure',
      subtitle: 'Culinary discoveries await',
      prompt: 'Find the best local restaurants and food experiences near me',
      tone: 'bg-[#f97316]'
    },
    {
      id: 'cultural-tour',
      icon: Camera,
      title: 'Cultural Tour',
      subtitle: 'Museums, art, and history',
      prompt: 'Create a cultural itinerary with museums and historical sites',
      tone: 'bg-[#4338ca]'
    },
    {
      id: 'weekend-plan',
      icon: Calendar,
      title: 'Weekend Plan',
      subtitle: 'Perfect 2-day getaway',
      prompt: 'Plan a perfect weekend itinerary for this city',
      tone: 'bg-emerald-600'
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
      // Clear any previous session data to ensure fresh start
      sessionStorage.removeItem('currentStreamingSession');
      sessionStorage.removeItem('completedStreamingSession');
      sessionStorage.removeItem('localChatSessions');

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
    <div class="min-h-screen relative bg-gradient-to-br from-[#050915] via-[#0b1c36] to-[#030712] text-white overflow-hidden">
      <div class="absolute inset-0 opacity-60">
        <div class="domain-grid" aria-hidden="true" />
        <div class="domain-veil" aria-hidden="true" />
        <div class="domain-halo" aria-hidden="true" />
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 relative z-10">
        
        {/* Welcome Header */}
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-3xl font-bold text-white tracking-tight">
                Welcome back, {displayName}! 👋
              </h1>
              <p class="text-slate-200/80 mt-1">
                Ready to discover something amazing today?
              </p>
            </div>
            <div class="flex items-center gap-3">
              <button 
                onClick={() => setIsQuickSettingsOpen(true)}
                class="p-2 text-white hover:text-emerald-200 rounded-lg hover:bg-white/10 border border-white/10 transition-colors"
                title="Quick Settings"
              >
                <Settings class="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div class="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur shadow-[0_18px_60px_rgba(3,7,18,0.4)]">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-200/80">Saved Places</p>
                  <p class="text-2xl font-bold text-white">
                    {userStatsQuery.isLoading ? '--' : (userStatsQuery.data?.saved_places ?? '0')}
                  </p>
                </div>
                <Bookmark class="w-8 h-8 text-emerald-200" />
              </div>
            </div>
            <div class="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur shadow-[0_18px_60px_rgba(3,7,18,0.4)]">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-200/80">Itineraries</p>
                  <p class="text-2xl font-bold text-white">
                    {userStatsQuery.isLoading ? '--' : (userStatsQuery.data?.itineraries ?? '0')}
                  </p>
                </div>
                <Calendar class="w-8 h-8 text-emerald-200" />
              </div>
            </div>
            <div class="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur shadow-[0_18px_60px_rgba(3,7,18,0.4)]">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-200/80">Cities Explored</p>
                  <p class="text-2xl font-bold text-white">
                    {userStatsQuery.isLoading ? '--' : (userStatsQuery.data?.cities_explored ?? '0')}
                  </p>
                </div>
                <Globe class="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div class="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur shadow-[0_18px_60px_rgba(3,7,18,0.4)]">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-200/80">Discoveries</p>
                  <p class="text-2xl font-bold text-white">
                    {userStatsQuery.isLoading ? '--' : (userStatsQuery.data?.discoveries ?? '0')}
                  </p>
                </div>
                <Sparkles class="w-8 h-8 text-amber-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Search */}
        <div class="mb-8">
          <div class="rounded-2xl p-6 shadow-[0_24px_90px_rgba(3,7,18,0.55)] bg-white/5 border border-white/10 backdrop-blur">
            <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles class="w-5 h-5 text-emerald-200" />
              What would you like to discover?
            </h2>
            
            <div class="flex items-end gap-3">
              <div class="flex-1">
                <textarea
                  value={currentMessage()}
                  onInput={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Describe your perfect day, meal, or adventure..."
                  class="w-full h-12 px-4 py-3 border border-white/15 rounded-xl resize-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent bg-white/10 text-white placeholder:text-slate-300/70 backdrop-blur"
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
                class="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 disabled:bg-slate-500/50 text-slate-950 rounded-xl font-semibold transition-all flex items-center gap-2 disabled:cursor-not-allowed shadow-[0_14px_40px_rgba(52,211,153,0.35)] border border-emerald-200/60"
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
            <h2 class="text-xl font-semibold text-white mb-4">Quick Discoveries</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <For each={quickActions}>
                {(action) => (
                  <button
                    onClick={() => handleQuickAction(action)}
                    class={`rounded-2xl p-6 text-white shadow-[0_20px_70px_rgba(3,7,18,0.45)] hover:shadow-[0_25px_80px_rgba(52,211,153,0.25)] transform hover:translate-y-[-4px] transition-all duration-200 text-left group border border-white/15 backdrop-blur bg-gradient-to-br ${action.tone} from-white/8`}
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
            <div class="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur shadow-[0_22px_80px_rgba(3,7,18,0.45)]">
              <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp class="w-5 h-5 text-emerald-200" />
                Just for You
              </h3>
              <div class="space-y-4">
                <For each={personalizedSuggestions}>
                  {(suggestion) => (
                    <div class="flex items-center justify-between p-4 rounded-lg border border-white/15 hover:bg-white/5 transition-colors group cursor-pointer">
                      <div class="flex items-center gap-3">
                        <span class="text-2xl">{suggestion.icon}</span>
                        <div>
                          <h4 class="font-semibold text-white group-hover:text-emerald-200 transition-colors">
                            {suggestion.title}
                          </h4>
                          <p class="text-sm text-slate-200/80">
                            {suggestion.description}
                          </p>
                        </div>
                      </div>
                      <button class="text-emerald-200 hover:text-white font-semibold text-sm px-3 py-1 rounded-lg hover:bg-white/5 transition-colors">
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
            <div class="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur shadow-[0_22px_80px_rgba(3,7,18,0.45)]">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-white">Recent Activity</h3>
                <button class="text-emerald-200 hover:text-white text-sm font-semibold">
                  View All
                </button>
              </div>
              <div class="space-y-3">
                <For each={recentActivities}>
                  {(activity) => {
                    const IconComponent = getActivityIcon(activity.type);
                    return (
                      <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group border border-white/10">
                        <div class="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <IconComponent class="w-5 h-5 text-emerald-200" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="font-semibold text-white text-sm group-hover:text-emerald-200 transition-colors truncate">
                            {activity.title}
                          </h4>
                          <p class="text-xs text-slate-200/80 truncate">
                            {activity.location}
                          </p>
                          <p class="text-xs text-slate-400">
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
            <div class="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur shadow-[0_22px_80px_rgba(3,7,18,0.45)]">
              <h3 class="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div class="space-y-3">
                <button 
                  onClick={() => navigate('/chat')}
                  class="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-white/5 transition-colors group border border-white/10"
                >
                  <div class="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <Sparkles class="w-5 h-5 text-emerald-200" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-white text-sm group-hover:text-emerald-200 transition-colors">
                      AI Chat
                    </h4>
                    <p class="text-xs text-slate-200/80">
                      Chat with our AI assistant
                    </p>
                  </div>
                </button>
                
                <button 
                  onClick={() => navigate('/itinerary')}
                  class="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-white/5 transition-colors group border border-white/10"
                >
                  <div class="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <Calendar class="w-5 h-5 text-emerald-200" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-white text-sm group-hover:text-emerald-200 transition-colors">
                      My Itineraries
                    </h4>
                    <p class="text-xs text-slate-200/80">
                      View saved plans
                    </p>
                  </div>
                </button>

                <button class="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-white/5 transition-colors group border border-white/10">
                  <div class="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <Heart class="w-5 h-5 text-emerald-200" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-white text-sm group-hover:text-emerald-200 transition-colors">
                      Saved Places
                    </h4>
                    <p class="text-xs text-slate-200/80">
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
