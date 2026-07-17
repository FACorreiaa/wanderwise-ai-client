export interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português" },
  { code: "it", label: "Italian", nativeLabel: "Italiano" },
];

const LANGUAGE_PATTERN = /^[a-z]{2}(-[A-Z]{2})?$/;

export const isSupportedLanguage = (code: string): boolean =>
  SUPPORTED_LANGUAGES.some((lang) => lang.code === code);

export const normalizeLanguage = (code?: string | null): string | null => {
  if (!code || !LANGUAGE_PATTERN.test(code)) return null;
  return isSupportedLanguage(code) ? code : "en";
};

export const languageFromLocalStorage = (): string | null => {
  if (typeof window === "undefined") return null;
  return normalizeLanguage(localStorage.getItem("language"));
};

export const applyDocumentLanguage = (code: string) => {
  if (typeof document === "undefined") return;
  document.documentElement.lang = code;
};

export const persistLocalLanguage = (code: string) => {
  localStorage.setItem("language", code);
};