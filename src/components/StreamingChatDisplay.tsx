import { createEffect, Show, For } from 'solid-js';
import { MessageCircle, Bot, User, Loader2, CheckCircle } from 'lucide-solid';
import type { StreamingSession } from '~/lib/api/types';
import { useChatRPC } from '~/lib/hooks/useChatRPC';

interface StreamingChatDisplayProps {
  session: () => StreamingSession | null;
  onComplete?: (data: any) => void;
  className?: string;
  initialMessage?: string;
}

export default function StreamingChatDisplay(props: StreamingChatDisplayProps) {
  const { state, startStream } = useChatRPC({
    onComplete: props.onComplete,
  });

  // Start stream when session is valid and not already connected
  createEffect(() => {
    const session = props.session();
    const initMsg = props.initialMessage || "Planning trip...";
    if (session && !state.isConnected && !state.isStreaming && !state.error && state.progress === 0) {
      // We need to know what message to send.
      // In the previous flow, the session object might have held this or local storage.
      // Here we'll rely on a prop or default.
      // Also need city/context from session if available.
      startStream(initMsg, session.data?.city, session.domain as any);
    }
  });

  return (
    <div class={`h-full flex flex-col ${props.className || ''}`}>
      {/* Header */}
      <div class="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div class="w-10 h-10 rounded-full bg-[#0c7df2] flex items-center justify-center text-white shadow ring-2 ring-white/50 dark:ring-slate-800">
          <MessageCircle class="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">AI Travel Assistant</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            <Show when={state.isStreaming} fallback="Ready to help">
              {state.currentStep}
            </Show>
          </p>
        </div>
      </div>

      {/* Processing steps indicator */}
      <Show when={state.isStreaming}>
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
          <div class="flex items-center gap-2 text-sm">
            <Loader2 class="w-4 h-4 animate-spin text-blue-500 dark:text-blue-400" />
            <span class="text-blue-700 dark:text-blue-300">
              {state.progress}% - {state.currentStep}
            </span>
          </div>
          {/* Simple progress bar */}
          <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700">
            <div class="bg-blue-600 h-1.5 rounded-full" style={{ width: `${state.progress}%` }}></div>
          </div>
        </div>
      </Show>

      {/* Messages Area - for now just showing status, we can expand to chat history later */}
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
        <Show when={!state.isStreaming && state.progress === 100}>
          <div class="text-center">
            <CheckCircle class="w-12 h-12 text-green-500 mx-auto mb-2" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">All Set!</h3>
            <p class="text-gray-500 dark:text-gray-400">Your itinerary is ready.</p>
          </div>
        </Show>
        <Show when={state.error}>
          <div class="text-red-500 text-center">
            <p>{state.error}</p>
          </div>
        </Show>
        <Show when={state.isStreaming}>
          <div class="text-center opacity-75">
            <Bot class="w-12 h-12 text-blue-500 mx-auto mb-2 animate-bounce" />
            <p class="text-gray-500 dark:text-gray-400">Thinking...</p>
          </div>
        </Show>
      </div>
    </div>
  );
}

