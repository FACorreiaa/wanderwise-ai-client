import { createEffect, on, onCleanup } from "solid-js";
import { useAuth } from "~/contexts/AuthContext";
import { applyProfileLanguage, useLanguage } from "~/contexts/LanguageContext";
import { applyProfileTheme, toProfileThemeValue, useTheme } from "~/contexts/ThemeContext";
import { useUpdateProfileMutation, useUserProfileQuery } from "~/lib/api/user";

/**
 * Syncs theme and language preferences between profile API, local storage, and UI context.
 */
export default function ProfilePreferencesSync() {
  const auth = useAuth();
  const theme = useTheme();
  const language = useLanguage();
  const profileQuery = useUserProfileQuery();
  const updateProfile = useUpdateProfileMutation();

  let saveTimer: ReturnType<typeof setTimeout> | undefined;
  let skipNextThemePersist = false;
  let skipNextLanguagePersist = false;

  onCleanup(() => {
    if (saveTimer) clearTimeout(saveTimer);
  });

  createEffect(
    on(
      () => profileQuery.data?.theme,
      (profileTheme) => {
        if (!auth.isAuthenticated() || !profileTheme) return;

        skipNextThemePersist = true;
        applyProfileTheme(profileTheme, theme.applyThemePreference);
      },
    ),
  );

  createEffect(
    on(
      () => profileQuery.data?.language,
      (profileLanguage) => {
        if (!auth.isAuthenticated() || !profileLanguage) return;

        skipNextLanguagePersist = true;
        applyProfileLanguage(profileLanguage, language.applyLanguage);
      },
    ),
  );

  createEffect(
    on(
      () =>
        [theme.designTheme(), theme.colorMode(), language.language(), auth.isAuthenticated()] as const,
      () => {
        if (!auth.isAuthenticated()) return;

        const skipTheme = skipNextThemePersist;
        const skipLanguage = skipNextLanguagePersist;
        skipNextThemePersist = false;
        skipNextLanguagePersist = false;

        if (skipTheme && skipLanguage) return;

        if (saveTimer) clearTimeout(saveTimer);

        saveTimer = setTimeout(() => {
          const updates: { theme?: string; language?: string } = {};

          if (!skipTheme) {
            const nextTheme = toProfileThemeValue(theme.getThemePreference);
            if (profileQuery.data?.theme !== nextTheme) {
              updates.theme = nextTheme;
            }
          }

          if (!skipLanguage) {
            const nextLanguage = language.language();
            if (profileQuery.data?.language !== nextLanguage) {
              updates.language = nextLanguage;
            }
          }

          if (Object.keys(updates).length > 0) {
            updateProfile.mutate(updates);
          }
        }, 500);
      },
    ),
  );

  return null;
}