import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { getAuthToken } from '~/lib/api';
import type { StreamEvent, DomainType } from '~/lib/api/types';

export interface StreamingResponseProps {
  url: string;
  requestBody: object;
  domain: DomainType;
  onComplete?: (response: any) => void;
  onError?: (error: string) => void;
  onProgress?: (data: any) => void;
  showTypingEffect?: boolean;
  className?: string;
  loadingText?: string;
}

interface StreamedContent {
  text: string;
  isComplete: boolean;
  progress: number;
  currentStep: string;
}

export function StreamingResponse(props: StreamingResponseProps) {
  const [streamedContent, setStreamedContent] = createSignal<StreamedContent>({
    text: '',
    isComplete: false,
    progress: 0,
    currentStep: 'Initializing...'
  });
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [isConnected, setIsConnected] = createSignal(false);

  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  let abortController: AbortController | null = null;

  // Chunk buffer for accumulating partial JSON
  let chunkBuffer = {
    general_pois: '',
    itinerary: '',
    city_data: '',
    hotels: '',
    restaurants: '',
    activities: ''
  };

  const streamData = async () => {
    try {
      abortController = new AbortController();
      const token = getAuthToken();

      const response = await fetch(props.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify(props.requestBody),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      setIsLoading(false);
      setIsConnected(true);
      reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setStreamedContent(prev => ({ ...prev, isComplete: true, currentStep: 'Complete!' }));
          setIsConnected(false);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '') continue;

            try {
              const event: StreamEvent = JSON.parse(data);
              processStreamEvent(event);
            } catch (_parseError) {
              // Handle non-JSON streaming text
              if (data.trim()) {
                updateStreamedText(data);
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Stream was aborted');
        return;
      }

      console.error('Streaming failed:', err);
      const errorMessage = err.message || 'Failed to load the response';
      setError(errorMessage);
      setIsLoading(false);
      setIsConnected(false);
      props.onError?.(errorMessage);
    }
  };

  const processStreamEvent = (event: StreamEvent) => {
    switch (event.type) {
      case 'start':
        handleStartEvent(event);
        break;
      case 'progress':
        handleProgressEvent(event);
        break;
      case 'chunk':
        handleChunkEvent(event);
        break;
      case 'city_data':
        handleCityDataEvent(event);
        break;
      case 'general_pois':
        handleGeneralPOIsEvent(event);
        break;
      case 'itinerary':
        handleItineraryEvent(event);
        break;
      case 'hotels':
        handleHotelsEvent(event);
        break;
      case 'restaurants':
        handleRestaurantsEvent(event);
        break;
      case 'activities':
        handleActivitiesEvent(event);
        break;
      case 'complete':
        handleCompleteEvent(event);
        break;
      case 'error':
        handleErrorEvent(event);
        break;
      default:
        console.log('Unknown event type:', event.type, event);
    }
  };

  const handleStartEvent = (_event: StreamEvent) => {
    setStreamedContent(prev => ({
      ...prev,
      currentStep: 'Starting generation...',
      progress: 10
    }));
  };

  const handleProgressEvent = (event: StreamEvent) => {
    const data = event.data as any;
    if (data?.progress) {
      setStreamedContent(prev => ({
        ...prev,
        progress: data.progress,
        currentStep: data.message || prev.currentStep
      }));
    }
  };

  const handleChunkEvent = (event: StreamEvent) => {
    const data = event.data as any;
    if (data?.chunk) {
      const { chunk, part } = data;

      if (part && Object.keys(chunkBuffer).includes(part)) {
        chunkBuffer[part as keyof typeof chunkBuffer] += chunk;
        tryParseBufferedData(part);
      } else {
        // Direct text streaming
        updateStreamedText(chunk);
      }
    }
  };

  const handleCityDataEvent = (event: StreamEvent) => {
    setStreamedContent(prev => ({
      ...prev,
      currentStep: 'Loading city information...',
      progress: 25
    }));
    props.onProgress?.(event.data);
  };

  const handleGeneralPOIsEvent = (event: StreamEvent) => {
    setStreamedContent(prev => ({
      ...prev,
      currentStep: 'Finding points of interest...',
      progress: 50
    }));
    props.onProgress?.(event.data);
  };

  const handleItineraryEvent = (event: StreamEvent) => {
    setStreamedContent(prev => ({
      ...prev,
      currentStep: 'Creating your itinerary...',
      progress: 75
    }));
    props.onProgress?.(event.data);
  };

  const handleHotelsEvent = (event: StreamEvent) => {
    setStreamedContent(prev => ({
      ...prev,
      currentStep: 'Finding accommodations...',
      progress: 60
    }));
    props.onProgress?.(event.data);
  };

  const handleRestaurantsEvent = (event: StreamEvent) => {
    setStreamedContent(prev => ({
      ...prev,
      currentStep: 'Discovering restaurants...',
      progress: 65
    }));
    props.onProgress?.(event.data);
  };

  const handleActivitiesEvent = (event: StreamEvent) => {
    setStreamedContent(prev => ({
      ...prev,
      currentStep: 'Finding activities...',
      progress: 70
    }));
    props.onProgress?.(event.data);
  };

  const handleCompleteEvent = (event: StreamEvent) => {
    setStreamedContent(prev => ({
      ...prev,
      isComplete: true,
      progress: 100,
      currentStep: 'Complete!'
    }));
    setIsConnected(false);
    props.onComplete?.(event.data);
  };

  const handleErrorEvent = (event: StreamEvent) => {
    const errorMessage = (event.data as any)?.message || 'An error occurred during streaming';
    setError(errorMessage);
    setIsConnected(false);
    props.onError?.(errorMessage);
  };

  const tryParseBufferedData = (part: string) => {
    const buffer = chunkBuffer[part as keyof typeof chunkBuffer];

    // Try to find complete JSON objects in the buffer
    let lastBraceIndex = buffer.lastIndexOf('}');
    if (lastBraceIndex === -1) return;

    const potentialJson = buffer.substring(0, lastBraceIndex + 1);

    try {
      const parsed = JSON.parse(potentialJson);
      updateStreamedText(`${part}: ${JSON.stringify(parsed, null, 2)}\n`);

      // Remove parsed content from buffer
      chunkBuffer[part as keyof typeof chunkBuffer] = buffer.substring(lastBraceIndex + 1);
    } catch (_e) {
      // Not yet a complete JSON object, wait for more chunks
    }
  };

  const updateStreamedText = (newText: string) => {
    setStreamedContent(prev => ({
      ...prev,
      text: prev.text + newText
    }));
  };

  const stopStream = () => {
    if (abortController) {
      abortController.abort();
    }
    if (reader) {
      reader.cancel();
    }
    setIsConnected(false);
  };

  onMount(() => {
    streamData();
  });

  onCleanup(() => {
    stopStream();
  });

  const content = streamedContent();

  return (
    <div class={`streaming-response ${props.className || ''}`}>
      <Show when={isLoading()}>
        <div class="flex items-center gap-2 p-4">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
          <p class="text-sm text-gray-600">{props.loadingText || 'Connecting...'}</p>
        </div>
      </Show>

      <Show when={error()}>
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p class="text-red-600 text-sm font-medium">Error</p>
          <p class="text-red-700 text-sm">{error()}</p>
        </div>
      </Show>

      <Show when={isConnected()}>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span class="text-sm font-medium text-green-700">Live</span>
            </div>
            <button
              onClick={stopStream}
              class="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
            >
              Stop
            </button>
          </div>
          <div class="mt-2">
            <p class="text-sm text-blue-700">{content.currentStep}</p>
            <div class="w-full bg-blue-200 rounded-full h-2 mt-1">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${content.progress}%` }}
              />
            </div>
          </div>
        </div>
      </Show>

      <Show when={content.text}>
        <div class="streaming-content bg-gray-50 rounded-lg p-4 border">
          <Show when={props.showTypingEffect} fallback={
            <pre class="whitespace-pre-wrap text-sm leading-relaxed">{content.text}</pre>
          }>
            <div class="typing-effect">
              <pre class="whitespace-pre-wrap text-sm leading-relaxed">
                {content.text}
                <Show when={!content.isComplete}>
                  <span class="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1" />
                </Show>
              </pre>
            </div>
          </Show>
        </div>
      </Show>

      <Show when={content.isComplete}>
        <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-700 font-medium">✓ Generation complete!</p>
        </div>
      </Show>
    </div>
  );
}