import { createSignal, Show, For, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { X, User, MapPin, Bell, Settings, Loader2 } from "lucide-solid";
import { useAuth } from "~/contexts/AuthContext";
import AppearanceSettings from "~/components/AppearanceSettings";
import { useUserLocation } from "~/contexts/LocationContext";
import {
  useDefaultSearchProfile,
  useSearchProfiles,
  useSetDefaultProfileMutation,
} from "~/lib/api/profiles";
import { Button } from "~/ui/button";
import { Label } from "~/ui/label";
import { Checkbox, CheckboxControl } from "~/ui/checkbox";

interface QuickSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickSettingsModal(props: QuickSettingsModalProps) {
  const navigate = useNavigate();
  const _auth = useAuth(); // User unused but keeping hook for future use
  const { userLocation, requestLocation } = useUserLocation();

  // API hooks
  const profilesQuery = useSearchProfiles();
  const defaultProfileQuery = useDefaultSearchProfile();
  const setDefaultProfileMutation = useSetDefaultProfileMutation();

  // Local state
  const [isUpdatingLocation, setIsUpdatingLocation] = createSignal(false);
  const [locationStatus, setLocationStatus] = createSignal<
    "idle" | "requesting" | "success" | "error"
  >("idle");
  const [selectedProfile, setSelectedProfile] = createSignal<string>("");

  // Initialize selected profile
  createEffect(() => {
    if (defaultProfileQuery.data?.id) {
      setSelectedProfile(defaultProfileQuery.data.id);
    }
  });

  const handleLocationUpdate = async () => {
    setIsUpdatingLocation(true);
    setLocationStatus("requesting");

    try {
      await requestLocation();
      setLocationStatus("success");
      setTimeout(() => setLocationStatus("idle"), 2000);
    } catch (_error) {
      setLocationStatus("error");
      setTimeout(() => setLocationStatus("idle"), 3000);
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  const handleProfileChange = async (profileId: string) => {
    setSelectedProfile(profileId);
    try {
      await setDefaultProfileMutation.mutateAsync(profileId);
    } catch (error) {
      console.error("Failed to update default profile:", error);
      // Revert selection on error
      setSelectedProfile(defaultProfileQuery.data?.id || "");
    }
  };

  const handleOpenFullSettings = () => {
    props.onClose();
    navigate("/settings");
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
          class="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md bg-card rounded-2xl shadow-2xl border border-border max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div class="flex items-center justify-between p-4 sm:p-6 border-b border-border">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Settings class="w-4 h-4 text-primary" />
              </div>
              <h2 class="text-lg font-semibold text-foreground">Quick Settings</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={props.onClose}>
              <X class="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div class="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
            {/* Active Travel Profile */}
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <User class="w-4 h-4 text-muted-foreground" />
                <Label>Active Travel Profile</Label>
              </div>
              <Show
                when={!profilesQuery.isLoading && profiles.length > 0}
                fallback={
                  <div class="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 class="w-4 h-4 animate-spin" />
                    Loading profiles...
                  </div>
                }
              >
                <select
                  value={selectedProfile()}
                  onChange={(e) => handleProfileChange(e.target.value)}
                  disabled={setDefaultProfileMutation.isPending}
                  class="w-full p-3 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <For each={profiles}>
                    {(profile) => <option value={profile.id}>{profile.profile_name}</option>}
                  </For>
                </select>
              </Show>
              <Show when={setDefaultProfileMutation.isPending}>
                <div class="flex items-center gap-2 text-sm text-primary">
                  <Loader2 class="w-4 h-4 animate-spin" />
                  Updating...
                </div>
              </Show>
            </div>

            {/* Location Settings */}
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <MapPin class="w-4 h-4 text-muted-foreground" />
                <Label>Current Location</Label>
              </div>
              <div class="p-3 bg-muted/50 rounded-lg">
                <Show
                  when={currentLocation}
                  fallback={
                    <p class="text-sm text-muted-foreground mb-3">Location not set</p>
                  }
                >
                  <p class="text-sm text-foreground mb-1">
                    📍 {currentLocation?.latitude?.toFixed(4)},{" "}
                    {currentLocation?.longitude?.toFixed(4)}
                  </p>
                  <p class="text-xs text-muted-foreground mb-3">
                    Used for nearby recommendations
                  </p>
                </Show>
                <Button
                  onClick={handleLocationUpdate}
                  disabled={isUpdatingLocation()}
                  class="w-full"
                >
                  <Show
                    when={!isUpdatingLocation()}
                    fallback={<Loader2 class="w-4 h-4 animate-spin" />}
                  >
                    <MapPin class="w-4 h-4" />
                  </Show>
                  {locationStatus() === "requesting"
                    ? "Requesting..."
                    : locationStatus() === "success"
                      ? "Updated!"
                      : locationStatus() === "error"
                        ? "Failed"
                        : currentLocation
                          ? "Update Location"
                          : "Enable Location"}
                </Button>
              </div>
            </div>

            <AppearanceSettings compact />

            {/* Notifications */}
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <Bell class="w-4 h-4 text-muted-foreground" />
                <Label>Notifications</Label>
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span class="text-sm text-foreground">New recommendations</span>
                  <Checkbox defaultChecked>
                    <CheckboxControl />
                  </Checkbox>
                </div>
                <div class="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span class="text-sm text-foreground">Trip reminders</span>
                  <Checkbox defaultChecked>
                    <CheckboxControl />
                  </Checkbox>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div class="p-4 sm:p-6 border-t border-border space-y-3">
            <Button variant="secondary" onClick={handleOpenFullSettings} class="w-full gap-2">
              <Settings class="w-4 h-4" />
              Open Full Settings
            </Button>
            <div class="text-center">
              <Button variant="ghost" onClick={props.onClose} class="text-sm text-muted-foreground">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}
