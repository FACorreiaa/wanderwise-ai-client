import { createContext, useContext, createSignal, createEffect, onMount, JSX } from 'solid-js';

interface ThemeContextType {
  isDark: () => boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType>();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: JSX.Element;
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  const [isDark, setIsDark] = createSignal(false);

  // Initialize theme from localStorage or system preference
  onMount(() => {
    const saved = localStorage.getItem('theme');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (saved === 'dark' || (!saved && systemPreference)) {
      setIsDark(true);
    }
  });

  // Apply theme to document
  createEffect(() => {
    const html = document.documentElement;
    if (isDark()) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  });

  const toggleTheme = () => {
    const newTheme = !isDark();
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setIsDark(theme === 'dark');
    localStorage.setItem('theme', theme);
  };

  const themeValue: ThemeContextType = {
    isDark,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {props.children}
    </ThemeContext.Provider>
  );
};