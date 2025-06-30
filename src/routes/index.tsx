import { Component, Show } from 'solid-js';
import { useAuth } from '~/contexts/AuthContext';
import LoggedInDashboard from '~/components/features/Dashboard/LoggedInDashboard';
import PublicLandingPage from '~/components/features/Home/PublicLandingPage';

export default function Index(): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Show when={!isLoading()} fallback={
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <Show when={isAuthenticated()} fallback={<PublicLandingPage />}>
        <LoggedInDashboard />
      </Show>
    </Show>
  );
}