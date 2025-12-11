import { For, Component } from "solid-js";

export interface QuickPrompt {
    id: string;
    text: string;
    description: string;
    icon: string;
    domain: 'accommodation' | 'dining' | 'activities' | 'itinerary' | 'general';
}

export interface ChatQuickPromptsProps {
    prompts: QuickPrompt[];
    onSelect: (prompt: QuickPrompt) => void;
}

const ChatQuickPrompts: Component<ChatQuickPromptsProps> = (props) => {
    return (
        <div class="max-w-4xl mx-auto">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Try asking about:
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <For each={props.prompts}>
                    {(prompt) => (
                        <button
                            onClick={() => props.onSelect(prompt)}
                            class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-xl hover:bg-white/90 dark:hover:bg-slate-700/90 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300/50 dark:hover:border-blue-500/30 transition-all duration-300 p-3 sm:p-4 text-left group"
                        >
                            <div class="flex items-start gap-2 sm:gap-3">
                                <span class="text-xl sm:text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                    {prompt.icon}
                                </span>
                                <div class="min-w-0 flex-1">
                                    <h4 class="font-medium text-gray-900 dark:text-white mb-1 text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {prompt.text}
                                    </h4>
                                    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                        {prompt.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    )}
                </For>
            </div>
        </div>
    );
};

export default ChatQuickPrompts;
