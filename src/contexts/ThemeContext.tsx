import { createContext, useContext, createSignal, createEffect, onMount, JSX } from 'solid-js';

type DesignTheme = 'default' | 'vt-news' | 'valuetainment';
type ColorTheme = 'light' | 'dark';

interface ThemeContextType {
  isDark: () => boolean;
  toggleTheme: () => void;
  setTheme: (theme: ColorTheme) => void;
  designTheme: () => DesignTheme;
  setDesignTheme: (theme: DesignTheme) => void;
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
  const [designTheme, setDesignThemeSignal] = createSignal<DesignTheme>('default');

  // Initialize theme from localStorage or system preference
  onMount(() => {
    const saved = localStorage.getItem('theme');
    const savedDesignTheme = localStorage.getItem('designTheme') as DesignTheme || 'default';
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (saved === 'dark' || (!saved && systemPreference)) {
      setIsDark(true);
    } else if (saved === 'light') {
      setIsDark(false);
    }

    setDesignThemeSignal(savedDesignTheme);
    
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
    
    // Clear existing theme classes
    html.classList.remove('dark');
    body.classList.remove('dark');
    html.removeAttribute('data-theme');
    
    if (isDark()) {
      html.classList.add('dark');
      body.classList.add('dark');
      html.setAttribute('data-kb-theme', 'dark');
    } else {
      html.setAttribute('data-kb-theme', 'light');
    }

    // Apply design theme
    if (designTheme() !== 'default') {
      html.setAttribute('data-theme', designTheme());
    }
  });

  const toggleTheme = () => {
    const newTheme = !isDark();
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const setTheme = (theme: ColorTheme) => {
    setIsDark(theme === 'dark');
    localStorage.setItem('theme', theme);
  };

  const setDesignTheme = (theme: DesignTheme) => {
    setDesignThemeSignal(theme);
    localStorage.setItem('designTheme', theme);
  };

  const themeValue: ThemeContextType = {
    isDark,
    toggleTheme,
    setTheme,
    designTheme,
    setDesignTheme,
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {props.children}
    </ThemeContext.Provider>
  );
};