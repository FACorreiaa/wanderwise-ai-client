import { For, Show, Component } from "solid-js";
import { MessageCircle, Send, X, Loader2 } from "lucide-solid";
import type { ChatMessage } from "~/lib/hooks/useChatSession";

export interface ChatInterfaceProps {
  // State
  showChat: boolean;
  chatMessage: string;
  chatHistory: ChatMessage[];
  isLoading: boolean;

  // Actions
  setShowChat: (show: boolean) => void;
  setChatMessage: (message: string) => void;
  sendChatMessage: () => void;
  handleKeyPress: (e: KeyboardEvent) => void;

  // Configuration
  title?: string;
  placeholder?: string;
  emptyStateIcon?: Component;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
  loadingMessage?: string;
  headerColor?: string;
  userMessageColor?: string;
  floatingButtonColor?: string;
  focusRingColor?: string;
}

export default function ChatInterface(props: ChatInterfaceProps) {
  const title = () => props.title || "Chat Assistant";
  const placeholder = () => props.placeholder || "Ask me something...";
  const emptyStateTitle = () => props.emptyStateTitle || "Start a conversation!";
  const emptyStateSubtitle = () => props.emptyStateSubtitle || "Ask me anything to get started.";
  const loadingMessage = () => props.loadingMessage || "Processing your request...";
  const headerColor = () =>
    props.headerColor || "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400";
  const userMessageColor = () => props.userMessageColor || "bg-blue-600 dark:bg-blue-500";
  const floatingButtonColor = () =>
    props.floatingButtonColor ||
    "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400";
  const focusRingColor = () =>
    props.focusRingColor || "focus:ring-blue-500 dark:focus:ring-blue-400";

  const EmptyIcon = props.emptyStateIcon || MessageCircle;

  return (
    <>
      {/* Chat Interface */}
      <Show when={props.showChat}>
        <div
          class="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 focus:outline-none"
          role="dialog"
          aria-modal="true"
          aria-label={title()}
          tabIndex={-1}
        >
          {/* Chat Header */}
          <div
            class={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 ${headerColor()} text-white rounded-t-lg`}
          >
            <div class="flex items-center gap-2">
              <MessageCircle class="w-5 h-5" />
              <span class="font-medium">{title()}</span>
            </div>
            <button
              onClick={() => props.setShowChat(false)}
              class="p-1 hover:bg-black hover:bg-opacity-20 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70"
              aria-label="Close chat"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div class="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
            <Show when={props.chatHistory.length === 0}>
              <div class="text-center text-gray-500 dark:text-gray-400 py-8">
                <EmptyIcon
                  class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600"
                  aria-hidden="true"
                />
                <p class="text-sm font-medium">{emptyStateTitle()}</p>
                <p class="text-xs mt-2 text-gray-400 dark:text-gray-500">{emptyStateSubtitle()}</p>
              </div>
            </Show>

            <For each={props.chatHistory}>
              {(message) => (
                <div class={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    class={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.type === "user"
                        ? `${userMessageColor()} text-white`
                        : message.type === "error"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    <p class="whitespace-pre-wrap">{message.content}</p>
                    <p
                      class={`text-xs mt-1 opacity-70 ${
                        message.type === "user"
                          ? "text-white text-opacity-70"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </For>

            <Show when={props.isLoading}>
              <div class="flex justify-start" aria-live="assertive">
                <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200">
                  <Loader2 class="w-4 h-4 animate-spin" />
                  <span>{loadingMessage()}</span>
                </div>
              </div>
            </Show>
          </div>

          {/* Chat Input */}
          <div class="p-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-end gap-2">
              <textarea
                value={props.chatMessage}
                onInput={(e) => props.setChatMessage(e.target.value)}
                onKeyPress={props.handleKeyPress}
                placeholder={placeholder()}
                aria-label={placeholder()}
                class={`flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${focusRingColor()} focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`}
                rows="2"
                disabled={props.isLoading}
              />
              <button
                onClick={props.sendChatMessage}
                disabled={!props.chatMessage.trim() || props.isLoading}
                class={`p-2 ${userMessageColor()} text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-500/60`}
                aria-label="Send message"
                aria-disabled={!props.chatMessage.trim() || props.isLoading}
              >
                <Send class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Show>

      {/* Floating Chat Button */}
      <Show when={!props.showChat}>
        <button
          onClick={() => props.setShowChat(true)}
          class={`fixed bottom-4 right-4 w-12 h-12 ${floatingButtonColor()} text-white rounded-full shadow-lg transition-all hover:scale-105 flex items-center justify-center z-40 sm:bottom-6 sm:right-6 sm:w-14 sm:h-14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-500/60`}
          aria-label="Open chat to continue planning"
          aria-expanded={props.showChat}
          aria-haspopup="dialog"
        >
          <MessageCircle class="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </Show>
    </>
  );
}
