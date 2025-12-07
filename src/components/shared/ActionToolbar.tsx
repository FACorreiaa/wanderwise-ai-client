import { Component, For } from 'solid-js';

export interface ActionItem {
    icon: Component<{ class?: string }>;
    label: string;
    onClick: () => void;
    active?: boolean;
}

interface ActionToolbarProps {
    actions: ActionItem[];
    className?: string;
}

export const ActionToolbar: Component<ActionToolbarProps> = (props) => {
    return (
        <div class={`flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar ${props.className || ''}`}>
            <For each={props.actions}>
                {(action) => (
                    <button
                        onClick={action.onClick}
                        class={`
              flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap
              ${action.active
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}
            `}
                    >
                        <action.icon class="h-4 w-4" />
                        {action.label}
                    </button>
                )}
            </For>
        </div>
    );
};
