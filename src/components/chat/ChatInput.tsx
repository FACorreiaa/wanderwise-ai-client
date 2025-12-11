import { Component } from "solid-js";
import { Send } from "lucide-solid";

export interface ChatInputProps {
    value: string;
    isLoading: boolean;
    placeholder?: string;
    onInput: (value: string) => void;
    onSend: () => void;
    onKeyPress: (e: KeyboardEvent) => void;
}

const ChatInput: Component<ChatInputProps> = (props) => {
    return (
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10 p-3 sm:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div class="max-w-4xl mx-auto">
                <div class="flex items-end gap-2 sm:gap-3">
                    <div class="flex-1">
                        <textarea
                            value={props.value}
                            onInput={(e) => props.onInput(e.target.value)}
                            onKeyPress={props.onKeyPress}
                            placeholder={props.placeholder || "Ask me about destinations, activities, or let me create an itinerary for you..."}
                            class="w-full resize-none border border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-gray-900 dark:text-white rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base transition-all"
                            rows="2"
                            disabled={props.isLoading}
                        />
                    </div>
                    <button
                        onClick={props.onSend}
                        disabled={!props.value.trim() || props.isLoading}
                        class="cb-button cb-button-primary px-3 py-2 sm:px-4 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                    >
                        <Send class="w-4 h-4" />
                        <span class="hidden sm:inline">Send</span>
                    </button>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </div>
    );
};

export default ChatInput;
