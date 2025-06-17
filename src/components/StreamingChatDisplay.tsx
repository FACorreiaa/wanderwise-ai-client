import { createSignal, createEffect, Show, For } from 'solid-js';
import { MessageCircle, Bot, User, MapPin, Clock, Star, Loader2, CheckCircle } from 'lucide-solid';
import type { StreamingSession, StreamEvent } from '~/lib/api/types';

interface StreamingChatDisplayProps {
  session: () => StreamingSession | null;
  onComplete?: (data: any) => void;
  className?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'status';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  streamingContent?: string;
  isComplete?: boolean;
  data?: any;
}

export default function StreamingChatDisplay(props: StreamingChatDisplayProps) {
  const [messages, setMessages] = createSignal<ChatMessage[]>([]);
  const [currentStreamingMessage, setCurrentStreamingMessage] = createSignal<string>('');
  const [isStreaming, setIsStreaming] = createSignal(false);
  const [processingSteps, setProcessingSteps] = createSignal<string[]>([]);
  const [currentStep, setCurrentStep] = createSignal<string>('');

  // Initialize with user message when session starts
  createEffect(() => {
    const session = props.session();
    if (session && session.data) {
      // Add user message - try to get from session storage if not in session
      let userMessage = 'Planning your trip...';
      try {
        const storedSession = sessionStorage.getItem('currentStreamingSession');
        if (storedSession) {
          const parsed = JSON.parse(storedSession);
          userMessage = parsed.query || parsed.data?.message || userMessage;
        }
      } catch (e) {
        console.log('Could not parse stored session for user message');
      }
      
      setMessages([{
        id: 'user-initial',
        type: 'user',
        content: userMessage,
        timestamp: new Date(),
        isComplete: true
      }]);

      // Add streaming assistant message
      setMessages(prev => [...prev, {
        id: 'assistant-streaming',
        type: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
        streamingContent: '',
        isComplete: false
      }]);

      setIsStreaming(true);
      setCurrentStep('Starting your personalized travel planning...');
    }
  });

  // Handle streaming events
  createEffect(() => {
    const session = props.session();
    if (!session) return;

    // Listen for progress updates
    if (session.progress) {
      handleStreamingEvent(session.progress);
    }

    // Handle completion
    if (session.isComplete && session.data) {
      handleCompletion(session.data);
    }
  });

  const handleStreamingEvent = (event: StreamEvent) => {
    if (!event) return;

    switch (event.type) {
      case 'start':
        setCurrentStep('🌍 Analyzing your destination...');
        setProcessingSteps(['🌍 Analyzing destination']);
        break;

      case 'chunk':
        handleChunkEvent(event);
        break;

      case 'complete':
        handleStreamComplete();
        break;
    }
  };

  const handleChunkEvent = (event: StreamEvent) => {
    const { part, chunk } = event.data || {};
    
    // Update processing steps based on the part being processed
    const stepMap: Record<string, string> = {
      'city_data': '🏙️ Gathering city information...',
      'general_pois': '📍 Finding points of interest...',
      'itinerary': '🗓️ Creating your itinerary...',
      'restaurants': '🍽️ Discovering dining options...',
      'hotels': '🏨 Finding accommodations...',
      'activities': '🎯 Curating activities...'
    };

    if (part && stepMap[part]) {
      setCurrentStep(stepMap[part]);
      setProcessingSteps(prev => {
        const newSteps = [...prev];
        const stepText = stepMap[part].split(' ').slice(1).join(' '); // Remove emoji for comparison
        if (!newSteps.some(step => step.includes(stepText))) {
          newSteps.push(stepMap[part]);
        }
        return newSteps;
      });
    }

    // Simulate typing effect for demonstration
    if (chunk && typeof chunk === 'string') {
      const cleanChunk = chunk.replace(/```json|```/g, '').trim();
      if (cleanChunk) {
        setCurrentStreamingMessage(prev => prev + cleanChunk);
        
        // Update the streaming message
        setMessages(prev => prev.map(msg => 
          msg.id === 'assistant-streaming' 
            ? { ...msg, streamingContent: currentStreamingMessage() }
            : msg
        ));
      }
    }
  };

  const handleStreamComplete = () => {
    setIsStreaming(false);
    setCurrentStep('✅ Planning complete!');
    
    // Mark streaming message as complete
    setMessages(prev => prev.map(msg => 
      msg.id === 'assistant-streaming' 
        ? { 
            ...msg, 
            content: getCompletionMessage(),
            isStreaming: false, 
            isComplete: true,
            streamingContent: ''
          }
        : msg
    ));

    // Trigger completion callback after a short delay for effect
    setTimeout(() => {
      const session = props.session();
      if (session?.data && props.onComplete) {
        props.onComplete(session.data);
      }
    }, 1500);
  };

  const handleCompletion = (data: any) => {
    setIsStreaming(false);
    setCurrentStep('✅ Ready to explore!');
  };

  const getCompletionMessage = () => {
    const session = props.session();
    if (!session) return 'Your travel plan is ready!';

    const domain = session.domain;
    const domainMessages = {
      'accommodation': 'I\'ve found some amazing hotels for your stay! 🏨',
      'dining': 'Here are some fantastic restaurant recommendations! 🍽️',
      'activities': 'I\'ve curated exciting activities for you! 🎯',
      'itinerary': 'Your personalized itinerary is ready! 🗓️',
      'general': 'I\'ve created a comprehensive travel plan for you! ✨'
    };

    return domainMessages[domain] || domainMessages.general;
  };

  const renderMessage = (message: ChatMessage) => {
    return (
      <div class={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
        {/* Avatar */}
        <Show when={message.type === 'assistant'}>
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Bot class="w-4 h-4 text-white" />
          </div>
        </Show>

        {/* Message bubble */}
        <div class={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
          <div class={`rounded-2xl px-4 py-3 ${
            message.type === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}>
            <Show when={message.isStreaming && message.streamingContent}>
              <div class="flex items-center gap-2">
                <div class="text-sm">{message.streamingContent}</div>
                <Loader2 class="w-3 h-3 animate-spin text-blue-500 dark:text-blue-400" />
              </div>
            </Show>
            
            <Show when={!message.isStreaming}>
              <p class="text-sm whitespace-pre-wrap">{message.content}</p>
            </Show>
          </div>

          {/* Timestamp */}
          <div class={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
            message.type === 'user' ? 'text-right' : 'text-left'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* User avatar */}
        <Show when={message.type === 'user'}>
          <div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0 order-2">
            <User class="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </div>
        </Show>
      </div>
    );
  };

  return (
    <div class={`h-full flex flex-col ${props.className || ''}`}>
      {/* Header */}
      <div class="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <MessageCircle class="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">AI Travel Assistant</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            <Show when={isStreaming()} fallback="Ready to help">
              {currentStep()}
            </Show>
          </p>
        </div>
      </div>

      {/* Processing steps indicator */}
      <Show when={isStreaming()}>
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
          <div class="space-y-2">
            <For each={processingSteps()}>
              {(step, index) => (
                <div class="flex items-center gap-2 text-sm">
                  <Show 
                    when={index() < processingSteps().length - 1} 
                    fallback={<Loader2 class="w-4 h-4 animate-spin text-blue-500 dark:text-blue-400" />}
                  >
                    <CheckCircle class="w-4 h-4 text-green-500 dark:text-green-400" />
                  </Show>
                  <span class={index() < processingSteps().length - 1 ? 'text-green-700 dark:text-green-300' : 'text-blue-700 dark:text-blue-300'}>
                    {step}
                  </span>
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* Messages */}
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-700">
        <For each={messages()}>
          {(message) => renderMessage(message)}
        </For>
      </div>

      {/* Footer */}
      <Show when={!isStreaming()}>
        <div class="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div class="text-center">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
              <CheckCircle class="w-4 h-4" />
              Planning complete! Redirecting to results...
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}