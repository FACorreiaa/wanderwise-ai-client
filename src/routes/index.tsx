import { Component, Show } from 'solid-js';
import { useAuth } from '~/contexts/AuthContext';
import LoggedInDashboard from '~/components/features/Dashboard/LoggedInDashboard';
import PublicLandingPage from '~/components/features/Home/PublicLandingPage';

export default function Index(): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Show when={!isLoading()} fallback={
      <div class="min-h-screen flex items-center justify-center">
        <div class="glass-panel gradient-border rounded-2xl p-6 text-center shadow-lg">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-200 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <Show when={isAuthenticated()} fallback={<PublicLandingPage />}>
        <LoggedInDashboard />
      </Show>
    </Show>
  );
}
