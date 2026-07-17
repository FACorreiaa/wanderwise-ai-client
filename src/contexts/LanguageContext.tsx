import { createContext, useContext, createSignal, onMount, JSX } from "solid-js";
import {
  applyDocumentLanguage,
  languageFromLocalStorage,
  normalizeLanguage,
  persistLocalLanguage,
} from "~/lib/language-preference";

interface LanguageContextType {
  language: () => string;
  setLanguage: (code: string) => void;
  applyLanguage: (code: string, options?: { persistLocal?: boolean }) => void;
}

const DEFAULT_LANGUAGE = "en";

const LanguageContext = createContext<LanguageContextType>();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: JSX.Element;
}

export const LanguageProvider = (props: LanguageProviderProps) => {
  const [language, setLanguageSignal] = createSignal(DEFAULT_LANGUAGE);

  const applyLanguage = (code: string, options: { persistLocal?: boolean } = {}) => {
    const normalized = normalizeLanguage(code) ?? DEFAULT_LANGUAGE;
    setLanguageSignal(normalized);
    applyDocumentLanguage(normalized);

    if (options.persistLocal !== false) {
      persistLocalLanguage(normalized);
    }
  };

  onMount(() => {
    const saved = languageFromLocalStorage();
    applyLanguage(saved ?? DEFAULT_LANGUAGE, { persistLocal: false });
  });

  const setLanguage = (code: string) => {
    applyLanguage(code);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, applyLanguage }}>
      {props.children}
    </LanguageContext.Provider>
  );
};

export const applyProfileLanguage = (
  languageValue: string | undefined,
  applyLanguage: LanguageContextType["applyLanguage"],
) => {
  const normalized = normalizeLanguage(languageValue);
  if (!normalized) return false;
  applyLanguage(normalized);
  return true;
};