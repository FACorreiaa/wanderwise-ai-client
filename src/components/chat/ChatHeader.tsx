import { Component, Show } from "solid-js";
import { Bot } from "lucide-solid";

export interface ChatHeaderProps {
    activeProfile: string;
    sessionId: string | null;
    onNewChat: () => void;
}

const ChatHeader: Component<ChatHeaderProps> = (props) => {
    return (
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 p-3 sm:p-4 shadow-sm">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <h1 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                            AI Travel Assistant
                        </h1>
                        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                            Get personalized travel recommendations
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <span class="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                        Using:
                    </span>
                    <span class="text-xs font-medium text-blue-600 dark:text-blue-400 truncate max-w-20 sm:max-w-none">
                        {props.activeProfile}
                    </span>
                    {/* Session indicator and controls */}
                    <Show when={props.sessionId}>
                        <div class="flex items-center gap-1 text-xs">
                            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span class="text-green-600 dark:text-green-400 font-medium hidden sm:inline">
                                Connected
                            </span>
                            <button
                                onClick={props.onNewChat}
                                class="ml-1 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-700"
                                title="Clear session and start fresh"
                            >
                                Clear
                            </button>
                        </div>
                    </Show>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
