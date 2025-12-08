import { Button } from "@/ui/button";
import { Palette, Sun, Moon } from "lucide-solid";
import { createSignal, Show, For, onMount, onCleanup } from "solid-js";
import { useTheme } from "~/contexts/ThemeContext";

const themeOptions = [
  { id: 'default', name: 'Default', description: 'Clean modern design' },
  { id: 'vt-news', name: 'VT News', description: 'Dark news-style theme' },
  { id: 'valuetainment', name: 'Valuetainment', description: 'Bold red business theme' }
] as const;

export default function ThemeSelector() {
  const { isDark, toggleTheme, designTheme, setDesignTheme } = useTheme();
  const [showSelector, setShowSelector] = createSignal(false);

  // Close selector when clicking outside
  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.theme-selector-container') && showSelector()) {
        setShowSelector(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    onCleanup(() => document.removeEventListener('click', handleClickOutside));
  });

  return (
    <div class="relative theme-selector-container">
      {/* Theme Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowSelector(!showSelector())}
        class="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        title="Change theme"
      >
        <Palette class="w-4 h-4" />
      </Button>

      {/* Theme Selector Dropdown */}
      <Show when={showSelector()}>
        <div class="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 transition-colors">
          {/* Color Theme Toggle */}
          <div class="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Color Mode</p>
            <div class="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (isDark()) toggleTheme();
                }}
                class={`flex - 1 flex items - center gap - 2 justify - center py - 1.5 text - xs ${!isDark() ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
                  } `}
              >
                <Sun class="w-3 h-3" />
                Light
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!isDark()) toggleTheme();
                }}
                class={`flex - 1 flex items - center gap - 2 justify - center py - 1.5 text - xs ${isDark() ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
                  } `}
              >
                <Moon class="w-3 h-3" />
                Dark
              </Button>
            </div>
          </div>

          {/* Design Theme Selection */}
          <div class="px-3 py-2">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Design Style</p>
            <For each={themeOptions}>
              {(option) => (
                <button
                  type="button"
                  onClick={() => {
                    setDesignTheme(option.id);
                    setShowSelector(false);
                  }}
                  class={`w - full text - left px - 3 py - 2 rounded - md text - sm transition - colors ${designTheme() === option.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    } `}
                >
                  <div class="font-medium">{option.name}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}