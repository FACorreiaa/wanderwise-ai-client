import { createSignal, createEffect, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { ArrowRight, MapPin, Sparkles } from 'lucide-solid';
import StreamingChatDisplay from './StreamingChatDisplay';
import type { StreamingSession } from '~/lib/api/types';
import { getDomainRoute } from '~/lib/streaming-service';

interface StreamingTransitionProps {
  session: () => StreamingSession | null;
  onClose?: () => void;
  fullScreen?: boolean;
}

export default function StreamingTransition(props: StreamingTransitionProps) {
  const navigate = useNavigate();
  const [showTransition, setShowTransition] = createSignal(false);
  const [transitionPhase, setTransitionPhase] = createSignal<'chat' | 'preview' | 'navigating'>('chat');
  const [previewData, setPreviewData] = createSignal<any>(null);

  // Show the component when session starts
  createEffect(() => {
    const session = props.session();
    if (session) {
      setShowTransition(true);
      setTransitionPhase('chat');
    }
  });

  const handleChatComplete = (data: any) => {
    console.log('Chat complete, received data:', data);
    setPreviewData(data);
    setTransitionPhase('preview');

    // Auto-navigate after showing preview
    setTimeout(() => {
      navigateToResults(data);
    }, 2500);
  };

  const navigateToResults = (data: any) => {
    setTransitionPhase('navigating');

    const session = props.session();
    if (!session) return;

    // Determine the route based on domain and data
    const route = getDomainRoute(session.domain);

    // Store the streaming data for the destination page
    sessionStorage.setItem('completedStreamingSession', JSON.stringify({
      sessionId: session.sessionId,
      domain: session.domain,
      data: data,
      timestamp: new Date().toISOString()
    }));

    // Navigate after a short delay for smooth transition
    setTimeout(() => {
      navigate(route, {
        state: {
          streamingData: data,
          sessionId: session.sessionId,
          fromChat: true
        }
      });
      setShowTransition(false);
      if (props.onClose) props.onClose();
    }, 800);
  };

  const getPreviewContent = () => {
    const session = props.session();
    const data = previewData();
    if (!session || !data) return null;

    switch (session.domain) {
      case 'accommodation':
        return {
          title: '🏨 Found Amazing Hotels!',
          subtitle: `${data.hotels?.length || 0} handpicked accommodations`,
          description: 'Perfect stays tailored to your preferences and budget',
          items: data.hotels?.slice(0, 3).map((hotel: any) => hotel.name) || []
        };

      case 'dining':
        return {
          title: '🍽️ Delicious Discoveries!',
          subtitle: `${data.restaurants?.length || 0} restaurant recommendations`,
          description: 'From local gems to fine dining experiences',
          items: data.restaurants?.slice(0, 3).map((restaurant: any) => restaurant.name) || []
        };

      case 'activities':
        return {
          title: '🎯 Exciting Activities!',
          subtitle: `${data.activities?.length || 0} curated experiences`,
          description: 'Adventures and attractions just for you',
          items: data.activities?.slice(0, 3).map((activity: any) => activity.name) || []
        };

      case 'itinerary':
      case 'general':
        return {
          title: '✨ Your Personalized Itinerary!',
          subtitle: `${data.points_of_interest?.length || 0} amazing places to visit`,
          description: data.itinerary_response?.overall_description || 'A perfectly crafted travel plan',
          items: data.points_of_interest?.slice(0, 3).map((poi: any) => poi.name) || []
        };

      default:
        return {
          title: '🌟 Planning Complete!',
          subtitle: 'Your personalized recommendations are ready',
          description: 'Get ready for an amazing experience',
          items: []
        };
    }
  };

  const renderPreview = () => {
    const preview = getPreviewContent();
    if (!preview) return null;

    return (
      <div class="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div class="text-center max-w-md mx-auto">
          {/* Success animation */}
          <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles class="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h2 class="text-2xl font-bold text-gray-900 mb-2">{preview.title}</h2>
          <p class="text-lg text-gray-600 mb-4">{preview.subtitle}</p>
          <p class="text-sm text-gray-500 mb-6">{preview.description}</p>

          {/* Preview items */}
          <Show when={preview.items.length > 0}>
            <div class="space-y-2 mb-6">
              <For each={preview.items}>
                {(item) => (
                  <div class="flex items-center gap-2 text-sm text-gray-700 bg-white/60 rounded-lg px-3 py-2">
                    <MapPin class="w-4 h-4 text-blue-500" />
                    <span>{item}</span>
                  </div>
                )}
              </For>
            </div>
          </Show>

          {/* Navigation indicator */}
          <div class="flex items-center gap-2 text-blue-600 font-medium">
            <span>Taking you to your results</span>
            <ArrowRight class="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </div>
    );
  };

  const renderNavigating = () => (
    <div class="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-600 to-purple-600">
      <div class="text-center text-white">
        <div class="w-16 h-16 mx-auto mb-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        <h2 class="text-xl font-semibold mb-2">Almost there...</h2>
        <p class="text-blue-100">Preparing your personalized experience</p>
      </div>
    </div>
  );

  return (
    <Show when={showTransition()}>
      <div class={`fixed inset-0 z-50 ${props.fullScreen ? '' : 'bg-black/50 flex items-center justify-center'}`}>
        <div class={`${props.fullScreen ? 'h-full w-full' : 'w-full max-w-2xl h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden'}`}>
          <Show when={transitionPhase() === 'chat'}>
            <StreamingChatDisplay
              session={props.session}
              onComplete={handleChatComplete}
              class="h-full"
            />
          </Show>

          <Show when={transitionPhase() === 'preview'}>
            {renderPreview()}
          </Show>

          <Show when={transitionPhase() === 'navigating'}>
            {renderNavigating()}
          </Show>
        </div>

        {/* Close button for non-fullscreen */}
        <Show when={!props.fullScreen && props.onClose}>
          <button
            onClick={props.onClose}
            class="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            ×
          </button>
        </Show>
      </div>
    </Show>
  );
}