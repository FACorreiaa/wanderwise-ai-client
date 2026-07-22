import { Moon, Sun } from "lucide-solid";
import { useTheme } from "~/contexts/ThemeContext";

export default function ThemeSelector() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      class="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card text-foreground transition-colors hover:border-accent hover:text-accent"
      title={isDark() ? "Use light appearance" : "Use dark appearance"}
      aria-label={isDark() ? "Use light appearance" : "Use dark appearance"}
    >
      {isDark() ? <Sun class="h-4 w-4" /> : <Moon class="h-4 w-4" />}
    </button>
  );
}
