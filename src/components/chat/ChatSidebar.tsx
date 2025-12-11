import { For, Show, Component } from "solid-js";
import { MapPin, Sparkles, MessageCircle, Loader2, Plus } from "lucide-solid";

export interface ChatSessionSummary {
    id: string;
    title: string;
    preview: string;
    timestamp: string;
    messageCount: number;
    hasItinerary: boolean;
    cityName?: string;
    isLocal?: boolean;
    performanceMetrics?: {
        avg_response_time_ms: number;
    };
    contentMetrics?: {
        total_pois: number;
        total_hotels: number;
        total_restaurants: number;
        complexity_score: number;
    };
    engagementMetrics?: {
        engagement_level: 'low' | 'medium' | 'high';
    };
}

export interface TravelProfile {
    id: string;
    name: string;
    icon: string;
    description: string;
}

export interface ChatSidebarProps {
    sessions: ChatSessionSummary[];
    isLoading: boolean;
    isError: boolean;
    selectedSession: ChatSessionSummary | null;
    activeProfile: string;
    profiles: TravelProfile[];
    showProfileSelector: boolean;
    onNewChat: () => void;
    onLoadSession: (session: ChatSessionSummary) => void;
    onProfileChange: (profile: string) => void;
    onToggleProfileSelector: () => void;
    onRefetch: () => void;
    isSessionLoading: boolean;
}

const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const ChatSidebar: Component<ChatSidebarProps> = (props) => {
    return (
        <div class="w-full lg:w-80 glass-panel lg:rounded-none lg:rounded-r-2xl flex flex-col order-2 lg:order-1 relative z-10">
            {/* Sidebar Header */}
            <div class="p-3 sm:p-4 border-b border-gray-200/50 dark:border-white/10">
                <div class="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        AI Assistant
                    </h2>
                    <button
                        onClick={props.onNewChat}
                        class="cb-button cb-button-primary p-2 text-sm"
                        title="New chat"
                    >
                        <Plus class="w-4 h-4" />
                    </button>
                </div>

                {/* Profile Selector */}
                <div class="relative">
                    <button
                        onClick={props.onToggleProfileSelector}
                        class="w-full flex items-center gap-2 p-2 sm:p-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all border border-gray-200/50 dark:border-white/10"
                    >
                        <div class="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm">
                            🎒
                        </div>
                        <div class="flex-1 text-left min-w-0">
                            <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                                {props.activeProfile}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                                Active profile
                            </p>
                        </div>
                    </button>

                    <Show when={props.showProfileSelector}>
                        <div class="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-xl shadow-xl shadow-gray-500/10 dark:shadow-black/30 z-10 max-h-60 overflow-y-auto">
                            <For each={props.profiles}>
                                {(profile) => (
                                    <button
                                        onClick={() => {
                                            props.onProfileChange(profile.name);
                                        }}
                                        class={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl ${props.activeProfile === profile.name
                                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                                : "text-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        <span class="text-base sm:text-lg">{profile.icon}</span>
                                        <div class="flex-1 text-left min-w-0">
                                            <p class="text-xs sm:text-sm font-medium truncate">
                                                {profile.name}
                                            </p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                                                {profile.description}
                                            </p>
                                        </div>
                                    </button>
                                )}
                            </For>
                        </div>
                    </Show>
                </div>
            </div>

            {/* Chat Sessions List */}
            <div class="flex-1 overflow-y-auto">
                <div class="p-3 sm:p-4">
                    <h3 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                        Recent Conversations
                    </h3>

                    <Show when={props.isLoading}>
                        <div class="flex items-center justify-center py-8">
                            <Loader2 class="w-5 h-5 animate-spin text-gray-400" />
                        </div>
                    </Show>

                    <Show when={props.isError}>
                        <div class="text-center py-4 px-3">
                            <div class="w-12 h-12 mx-auto mb-3 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                <MessageCircle class="w-6 h-6 text-red-500 dark:text-red-400" />
                            </div>
                            <p class="text-xs text-red-600 dark:text-red-400 font-medium mb-1">
                                Chat History Unavailable
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                                There's a temporary issue loading your chat history. You can
                                still start new conversations.
                            </p>
                            <button
                                onClick={props.onRefetch}
                                class="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Try again
                            </button>
                        </div>
                    </Show>

                    <Show when={!props.isLoading && !props.isError}>
                        <div class="space-y-1 sm:space-y-2">
                            <Show when={props.sessions.length === 0}>
                                <div class="text-center py-8 px-4">
                                    <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                                        <MessageCircle class="w-8 h-8 text-blue-500 dark:text-blue-400" />
                                    </div>
                                    <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        No chat history yet
                                    </h3>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                                        Start a conversation to explore destinations, get
                                        recommendations, and create personalized itineraries.
                                    </p>
                                    <div class="space-y-2">
                                        <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                                            <div class="w-2 h-2 bg-green-500 rounded-full" />
                                            <span>Ask about any destination</span>
                                        </div>
                                        <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                                            <div class="w-2 h-2 bg-blue-500 rounded-full" />
                                            <span>Get personalized recommendations</span>
                                        </div>
                                        <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                                            <div class="w-2 h-2 bg-purple-500 rounded-full" />
                                            <span>Create custom itineraries</span>
                                        </div>
                                    </div>
                                </div>
                            </Show>

                            <For each={props.sessions}>
                                {(session) => (
                                    <button
                                        onClick={() => props.onLoadSession(session)}
                                        disabled={props.isSessionLoading}
                                        class={`w-full text-left p-2 sm:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${props.selectedSession?.id === session.id
                                                ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                                                : "border border-transparent"
                                            }`}
                                    >
                                        <div class="flex items-start justify-between mb-1">
                                            <div class="flex-1 min-w-0">
                                                <div class="flex items-center gap-1">
                                                    <h4 class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {session.title}
                                                    </h4>
                                                    {session.isLocal && (
                                                        <span
                                                            class="text-xs bg-amber-100 text-amber-700 px-1 py-0.5 rounded"
                                                            title="Stored locally (backend unavailable)"
                                                        >
                                                            📱
                                                        </span>
                                                    )}
                                                </div>
                                                <Show when={session.cityName}>
                                                    <div class="flex items-center gap-1 mt-0.5">
                                                        <MapPin class="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                        <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                            {session.cityName}
                                                        </span>
                                                    </div>
                                                </Show>
                                                {/* Content metrics summary */}
                                                <Show when={session.contentMetrics}>
                                                    <div class="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        <Show when={session.contentMetrics!.total_pois > 0}>
                                                            <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded text-xs">
                                                                {session.contentMetrics!.total_pois} POIs
                                                            </span>
                                                        </Show>
                                                        <Show when={session.contentMetrics!.total_hotels > 0}>
                                                            <span class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1 py-0.5 rounded text-xs">
                                                                {session.contentMetrics!.total_hotels} Hotels
                                                            </span>
                                                        </Show>
                                                        <Show when={session.contentMetrics!.total_restaurants > 0}>
                                                            <span class="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-1 py-0.5 rounded text-xs">
                                                                {session.contentMetrics!.total_restaurants} Restaurants
                                                            </span>
                                                        </Show>
                                                    </div>
                                                </Show>
                                            </div>
                                            <div class="flex items-center gap-1 flex-shrink-0 ml-1">
                                                <Show when={session.hasItinerary}>
                                                    <Sparkles class="w-3 h-3 text-purple-500 dark:text-purple-400" />
                                                </Show>
                                                <Show when={session.engagementMetrics}>
                                                    <div
                                                        class={`w-2 h-2 rounded-full ${session.engagementMetrics!.engagement_level === "high"
                                                                ? "bg-green-500"
                                                                : session.engagementMetrics!.engagement_level === "medium"
                                                                    ? "bg-yellow-500"
                                                                    : "bg-gray-400"
                                                            }`}
                                                        title={`${session.engagementMetrics!.engagement_level} engagement`}
                                                    />
                                                </Show>
                                                <Show when={session.contentMetrics && session.contentMetrics.complexity_score >= 7}>
                                                    <div
                                                        class="w-1.5 h-1.5 bg-blue-500 rounded-full"
                                                        title="Complex session"
                                                    />
                                                </Show>
                                            </div>
                                        </div>
                                        <p class="text-xs text-gray-600 dark:text-gray-300 truncate mb-1 sm:mb-2 leading-relaxed">
                                            {session.preview}
                                        </p>
                                        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span class="text-xs">{formatTimestamp(session.timestamp)}</span>
                                            <div class="flex items-center gap-2">
                                                <Show when={session.performanceMetrics && session.performanceMetrics.avg_response_time_ms > 0}>
                                                    <span
                                                        class="text-xs hidden sm:inline"
                                                        title={`Avg response: ${session.performanceMetrics!.avg_response_time_ms}ms`}
                                                    >
                                                        ⚡ {Math.round(session.performanceMetrics!.avg_response_time_ms / 1000)}s
                                                    </span>
                                                </Show>
                                                <span class="text-xs hidden sm:inline">
                                                    {session.messageCount} messages
                                                </span>
                                                <span class="text-xs sm:hidden">{session.messageCount}m</span>
                                                <Show when={session.hasItinerary}>
                                                    <span class="text-xs text-purple-600 dark:text-purple-400 hidden sm:inline">
                                                        • Itinerary
                                                    </span>
                                                </Show>
                                            </div>
                                        </div>
                                    </button>
                                )}
                            </For>
                        </div>
                    </Show>
                </div>
            </div>
        </div>
    );
};

export default ChatSidebar;
