import { createSignal, Show, For, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { 
  X, 
  User, 
  MapPin, 
  Bell, 
  Palette, 
  Settings, 
  Camera,
  Save,
  Loader2,
  Check,
  Moon,
  Sun
} from 'lucide-solid';
import { useAuth } from '~/contexts/AuthContext';
import { useTheme } from '~/contexts/ThemeContext';
import { useUserLocation } from '~/contexts/LocationContext';
import { useDefaultSearchProfile, useSearchProfiles, useSetDefaultProfileMutation } from '~/lib/api/profiles';
import { useUpdateProfileMutation, useUserProfileQuery } from '~/lib/api/user';

interface QuickSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickSettingsModal(props: QuickSettingsModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark, setTheme } = useTheme();
  const { userLocation, requestLocation } = useUserLocation();
  
  // API hooks
  // const userProfileQuery = useUserProfileQuery(); // Disabled /user/profile endpoint call
  const updateProfileMutation = useUpdateProfileMutation();
  const profilesQuery = useSearchProfiles();
  const defaultProfileQuery = useDefaultSearchProfile();
  const setDefaultProfileMutation = useSetDefaultProfileMutation();
  
  // Local state
  const [isUpdatingLocation, setIsUpdatingLocation] = createSignal(false);
  const [locationStatus, setLocationStatus] = createSignal<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [selectedProfile, setSelectedProfile] = createSignal<string>('');
  
  // Initialize selected profile
  createEffect(() => {
    if (defaultProfileQuery.data?.id) {
      setSelectedProfile(defaultProfileQuery.data.id);
    }
  });

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon }
  ];

  const handleLocationUpdate = async () => {
    setIsUpdatingLocation(true);
    setLocationStatus('requesting');
    
    try {
      await requestLocation();
      setLocationStatus('success');
      setTimeout(() => setLocationStatus('idle'), 2000);
    } catch (error) {
      setLocationStatus('error');
      setTimeout(() => setLocationStatus('idle'), 3000);
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  const handleProfileChange = async (profileId: string) => {
    setSelectedProfile(profileId);
    try {
      await setDefaultProfileMutation.mutateAsync(profileId);
    } catch (error) {
      console.error('Failed to update default profile:', error);
      // Revert selection on error
      setSelectedProfile(defaultProfileQuery.data?.id || '');
    }
  };

  const handleOpenFullSettings = () => {
    props.onClose();
    navigate('/settings');
  };

  const currentLocation = userLocation();
  const profiles = profilesQuery.data || [];

  return (
    <Show when={props.isOpen}>
      {/* Backdrop */}
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={props.onClose}
      >
        {/* Modal */}
        <div 
          class="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Settings class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Settings</h2>
            </div>
            <button
              onClick={props.onClose}
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div class="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
            
            {/* Active Travel Profile */}
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <User class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <label class="text-sm font-medium text-gray-900 dark:text-white">
                  Active Travel Profile
                </label>
              </div>
              <Show 
                when={!profilesQuery.isLoading && profiles.length > 0}
                fallback={
                  <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Loader2 class="w-4 h-4 animate-spin" />
                    Loading profiles...
                  </div>
                }
              >
                <select
                  value={selectedProfile()}
                  onChange={(e) => handleProfileChange(e.target.value)}
                  disabled={setDefaultProfileMutation.isPending}
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <For each={profiles}>
                    {(profile) => (
                      <option value={profile.id}>{profile.profile_name}</option>
                    )}
                  </For>
                </select>
              </Show>
              <Show when={setDefaultProfileMutation.isPending}>
                <div class="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <Loader2 class="w-4 h-4 animate-spin" />
                  Updating...
                </div>
              </Show>
            </div>

            {/* Location Settings */}
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <MapPin class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <label class="text-sm font-medium text-gray-900 dark:text-white">
                  Current Location
                </label>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Show 
                  when={currentLocation}
                  fallback={
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Location not set
                    </p>
                  }
                >
                  <p class="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    📍 {currentLocation?.latitude?.toFixed(4)}, {currentLocation?.longitude?.toFixed(4)}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Used for nearby recommendations
                  </p>
                </Show>
                <button
                  onClick={handleLocationUpdate}
                  disabled={isUpdatingLocation()}
                  class="w-full flex items-center justify-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
                >
                  <Show 
                    when={!isUpdatingLocation()}
                    fallback={<Loader2 class="w-4 h-4 animate-spin" />}
                  >
                    <MapPin class="w-4 h-4" />
                  </Show>
                  {locationStatus() === 'requesting' ? 'Requesting...' :
                   locationStatus() === 'success' ? 'Updated!' :
                   locationStatus() === 'error' ? 'Failed' :
                   currentLocation ? 'Update Location' : 'Enable Location'}
                </button>
              </div>
            </div>

            {/* Theme Selection */}
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <Palette class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <label class="text-sm font-medium text-gray-900 dark:text-white">
                  Theme
                </label>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <For each={themeOptions}>
                  {(option) => {
                    const Icon = option.icon;
                    const isActive = (option.value === 'dark' && isDark()) || (option.value === 'light' && !isDark());
                    return (
                      <button
                        onClick={() => setTheme(option.value as 'light' | 'dark')}
                        class={`p-3 rounded-lg border transition-all ${
                          isActive
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <Icon class="w-4 h-4 mx-auto mb-1" />
                        <div class="text-xs font-medium">{option.label}</div>
                      </button>
                    );
                  }}
                </For>
              </div>
            </div>

            {/* Notifications */}
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <Bell class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <label class="text-sm font-medium text-gray-900 dark:text-white">
                  Notifications
                </label>
              </div>
              <div class="space-y-2">
                <label class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                  <span class="text-sm text-gray-700 dark:text-gray-300">New recommendations</span>
                  <input 
                    type="checkbox" 
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                    checked 
                  />
                </label>
                <label class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                  <span class="text-sm text-gray-700 dark:text-gray-300">Trip reminders</span>
                  <input 
                    type="checkbox" 
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                    checked 
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div class="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <button
              onClick={handleOpenFullSettings}
              class="w-full p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Settings class="w-4 h-4" />
              Open Full Settings
            </button>
            <div class="text-center">
              <button
                onClick={props.onClose}
                class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}