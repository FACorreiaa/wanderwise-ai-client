import { createStore } from "solid-js/store";
import { createClient } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
import { ChatService, ChatRequestSchema } from "@buf/loci_loci-proto.bufbuild_es/proto/chat_pb.js";
import { transport } from "../connect-transport";
// import { type ChatContextType } from "../api/llm";
import { DomainType } from "../api/types";

// Initialize client outside hook to avoid recreation
const chatClient = createClient(ChatService, transport);

export interface ChatRPCState {
    isConnected: boolean;
    isStreaming: boolean;
    error: string | null;
    progress: number;
    currentStep: string;
    messages: Array<{
        role: "user" | "assistant";
        content: string;
        timestamp: Date;
    }>;
    streamedData: any | null;
}

export interface UseChatRPCOptions {
    onComplete?: (data: any) => void;
    onError?: (error: string) => void;
    onRedirect?: (domain: DomainType, sessionId: string, city: string) => void;
    onProgress?: (data: any) => void;
}

export function useChatRPC(options: UseChatRPCOptions = {}) {
    const [state, setState] = createStore<ChatRPCState>({
        isConnected: false,
        isStreaming: false,
        error: null,
        progress: 0,
        currentStep: "",
        messages: [],
        streamedData: null,
    });

    const startStream = async (
        message: string,
        cityName?: string,
        // contextType?: ChatContextType
    ) => {
        // Reset state for new chat
        setState({
            isConnected: true,
            isStreaming: true,
            error: null,
            progress: 0,
            currentStep: "Connecting...",
            streamedData: null,
            // Keep previous messages if any (optional, usually cleared for fresh start or appended)
            // For this implementation, let's assume we append or the caller handles message history display
            // But typically this hook manages the *current* streaming session state.
        });

        try {
            const request = create(ChatRequestSchema, {
                message: message,
                cityName: cityName || "",
                // contextType: toProtoDomainType(contextType),
            });

            const stream = chatClient.streamChat(request);

            setState({ currentStep: "Processing request...", progress: 10 });

            for await (const response of stream) {
                // The backend sends StreamEvent objects directly
                // We map them to our internal types

                // Handle explicit error field in the proto
                if (response.error) {
                    throw new Error(response.error);
                }

                const eventType = response.type;
                const _msgData = response.message; // usually chunk text
                const data = response.data as any; // Cast to any to access properties

                // Update progress based on event type
                handleProgress(eventType, data);

                // Handle text chunks
                if (eventType === "chunk" && data?.chunk) {
                    const _chunk = data.chunk;
                    // Append to partial message logic if needed, usually handled by caller or state
                    // Here we might just expose the last chunk or accumulated text?
                    // The Store is good for granular updates.
                }

                // Handle completion
                if (eventType === "complete") {
                    setState({
                        isStreaming: false,
                        isConnected: false,
                        progress: 100,
                        currentStep: "Complete!",
                        streamedData: response.data
                    });
                    options.onComplete?.(response.data);

                    // Check for redirect info
                    if (response.navigation) {
                        const _nav = response.navigation;
                        // Assuming navigation struct matches what we need or we parse relevant fields
                        // options.onRedirect?.(...) 
                    }
                }
            }

        } catch (err: any) {
            console.error("RPC Stream Error:", err);
            setState({
                error: err.message || "Streaming failed",
                isStreaming: false,
                isConnected: false,
            });
            options.onError?.(err.message || "Streaming failed");
        }
    };

    const handleProgress = (type: string, data: any) => {
        switch (type) {
            case 'start':
                setState({ currentStep: "Starting generation...", progress: 15 });
                break;
            case 'city_data':
                setState({ currentStep: "Loading city information...", progress: 25 });
                options.onProgress?.(data);
                break;
            case 'general_pois':
                setState({ currentStep: "Finding points of interest...", progress: 50 });
                options.onProgress?.(data);
                break;
            case 'itinerary':
                setState({ currentStep: "Creating your itinerary...", progress: 75 });
                options.onProgress?.(data);
                break;
            case 'hotels':
                setState({ currentStep: "Finding accommodations...", progress: 60 });
                options.onProgress?.(data);
                break;
            case 'restaurants':
                setState({ currentStep: "Discovering restaurants...", progress: 65 });
                options.onProgress?.(data);
                break;
            case 'activities':
                setState({ currentStep: "Finding activities...", progress: 70 });
                options.onProgress?.(data);
                break;
        }
    };

    return {
        state,
        startStream,
    };
}
