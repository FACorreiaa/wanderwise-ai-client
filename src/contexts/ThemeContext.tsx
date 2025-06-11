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
    } else if (saved === 'light') {
      setIsDark(false);
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // Cleanup listener on unmount
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  });

  // Apply theme to document
  createEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    if (isDark()) {
      html.classList.add('dark');
      body.classList.add('dark');
      html.setAttribute('data-kb-theme', 'dark');
    } else {
      html.classList.remove('dark');
      body.classList.remove('dark');
      html.setAttribute('data-kb-theme', 'light');
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