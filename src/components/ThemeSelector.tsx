import { Sun, Moon, Palette } from "lucide-solid";
import { useTheme } from "~/contexts/ThemeContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

type DesignTheme = 'classic' | 'modern' | 'loci';

interface ThemeOption {
  value: DesignTheme;
  label: string;
  description: string;
}

const themeOptions: ThemeOption[] = [
  { value: 'loci', label: 'Loci', description: 'Bold structural design' },
  { value: 'classic', label: 'Classic', description: 'Editorial luxury' },
  { value: 'modern', label: 'Modern', description: 'Clean functional' },
];

export default function ThemeSelector() {
  const { isDark, toggleTheme, designTheme, setDesignTheme } = useTheme();

  const currentTheme = () => themeOptions.find(t => t.value === designTheme()) || themeOptions[0];

  return (
    <div class="flex items-center gap-2">
      {/* Color Mode Toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        class="p-2 rounded-md border border-input bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors"
        title={isDark() ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark() ? <Sun class="w-4 h-4" /> : <Moon class="w-4 h-4" />}
      </button>

      {/* Design Theme Selector */}
      <Select<ThemeOption>
        value={currentTheme()}
        onChange={(option) => option && setDesignTheme(option.value)}
        options={themeOptions}
        optionValue="value"
        optionTextValue="label"
        itemComponent={(props) => (
          <SelectItem item={props.item}>
            <div class="flex flex-col">
              <span class="font-medium">{props.item.rawValue.label}</span>
              <span class="text-xs text-muted-foreground">{props.item.rawValue.description}</span>
            </div>
          </SelectItem>
        )}
      >
        <SelectTrigger class="w-[140px]">
          <div class="flex items-center gap-2">
            <Palette class="w-4 h-4 opacity-50" />
            <SelectValue<ThemeOption>>
              {(state) => state.selectedOption()?.label}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent />
      </Select>
    </div>
  );
}