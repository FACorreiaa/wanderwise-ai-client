import { createSignal, createEffect, For, Show } from 'solid-js';
import { Plus, Edit3, Trash2, Save, X, Check, MapPin, Clock, DollarSign, Zap, Settings, Users, UtensilsCrossed, Bed, Calendar, Activity, Power } from 'lucide-solid';
import { 
  useSearchProfiles, 
  useCreateSearchProfileMutation, 
  useUpdateSearchProfileMutation, 
  useDeleteSearchProfileMutation,
  useSetDefaultProfileMutation
} from '~/lib/api/profiles';
import { useTags } from '~/lib/api/tags';
import { useInterests } from '~/lib/api/interests';
import type { SearchProfile, TravelProfileFormData, AccommodationPreferences, DiningPreferences, ActivityPreferences, ItineraryPreferences } from '~/lib/api/types';

interface TravelProfilesProps {
  onNotification: (notification: { message: string; type: 'success' | 'error' }) => void;
}

export default function TravelProfiles(props: TravelProfilesProps) {
  const profilesQuery = useSearchProfiles();
  const tagsQuery = useTags();
  const interestsQuery = useInterests();
  
  const createProfileMutation = useCreateSearchProfileMutation();
  const updateProfileMutation = useUpdateSearchProfileMutation();
  const deleteProfileMutation = useDeleteSearchProfileMutation();
  const setDefaultProfileMutation = useSetDefaultProfileMutation();

  const [editingProfile, setEditingProfile] = createSignal<string | null>(null);
  const [isCreating, setIsCreating] = createSignal(false);
  const [activeSection, setActiveSection] = createSignal<string>('basic');
  
  const [formData, setFormData] = createSignal<TravelProfileFormData>({
    profile_name: '',
    is_default: false,
    search_radius_km: 5,
    preferred_time: 'any',
    budget_level: 2,
    preferred_pace: 'moderate',
    prefer_accessible_pois: false,
    prefer_outdoor_seating: false,
    prefer_dog_friendly: false,
    preferred_vibes: [],
    preferred_transport: 'any',
    dietary_needs: [],
    interests: [],
    tags: [],
    accommodation_preferences: {
      accommodation_type: [],
      star_rating: { min: 1, max: 5 },
      price_range_per_night: { min: 0, max: 500 },
      amenities: [],
      room_type: [],
      chain_preference: 'any',
      cancellation_policy: [],
      booking_flexibility: 'any'
    },
    dining_preferences: {
      cuisine_types: [],
      meal_types: [],
      service_style: [],
      price_range_per_person: { min: 0, max: 200 },
      dietary_needs: [],
      allergen_free: [],
      michelin_rated: false,
      local_recommendations: true,
      chain_vs_local: 'any',
      organic_preference: false,
      outdoor_seating_preferred: false
    },
    activity_preferences: {
      activity_categories: [],
      physical_activity_level: 'moderate',
      indoor_outdoor_preference: 'mixed',
      cultural_immersion_level: 'moderate',
      must_see_vs_hidden_gems: 'mixed',
      educational_preference: false,
      photography_opportunities: false,
      season_specific_activities: ['year_round'],
      avoid_crowds: false,
      local_events_interest: []
    },
    itinerary_preferences: {
      planning_style: 'flexible',
      preferred_pace: 'moderate',
      time_flexibility: 'loose_schedule',
      morning_vs_evening: 'flexible',
      weekend_vs_weekday: 'any',
      preferred_seasons: ['spring', 'summer'],
      avoid_peak_season: false,
      adventure_vs_relaxation: 'balanced',
      spontaneous_vs_planned: 'semi_planned'
    }
  });

  const profiles = () => profilesQuery.data || [];
  const activeTags = () => (tagsQuery.data || []).filter(tag => tag.active);
  const activeInterests = () => (interestsQuery.data || []).filter(interest => interest.active);

  const startCreating = () => {
    setFormData({
      profile_name: '',
      is_default: false,
      search_radius_km: 5,
      preferred_time: 'any',
      budget_level: 2,
      preferred_pace: 'moderate',
      prefer_accessible_pois: false,
      prefer_outdoor_seating: false,
      prefer_dog_friendly: false,
      preferred_vibes: [],
      preferred_transport: 'any',
      dietary_needs: [],
      interests: [],
      tags: [],
      accommodation_preferences: {
        accommodation_type: [],
        star_rating: { min: 1, max: 5 },
        price_range_per_night: { min: 0, max: 500 },
        amenities: [],
        room_type: [],
        chain_preference: 'any',
        cancellation_policy: [],
        booking_flexibility: 'any'
      },
      dining_preferences: {
        cuisine_types: [],
        meal_types: [],
        service_style: [],
        price_range_per_person: { min: 0, max: 200 },
        dietary_needs: [],
        allergen_free: [],
        michelin_rated: false,
        local_recommendations: true,
        chain_vs_local: 'any',
        organic_preference: false,
        outdoor_seating_preferred: false
      },
      activity_preferences: {
        activity_categories: [],
        physical_activity_level: 'moderate',
        indoor_outdoor_preference: 'mixed',
        cultural_immersion_level: 'moderate',
        must_see_vs_hidden_gems: 'mixed',
        educational_preference: false,
        photography_opportunities: false,
        season_specific_activities: ['year_round'],
        avoid_crowds: false,
        local_events_interest: []
      },
      itinerary_preferences: {
        planning_style: 'flexible',
        preferred_pace: 'moderate',
        time_flexibility: 'loose_schedule',
        morning_vs_evening: 'flexible',
        weekend_vs_weekday: 'any',
        preferred_seasons: ['spring', 'summer'],
        avoid_peak_season: false,
        adventure_vs_relaxation: 'balanced',
        spontaneous_vs_planned: 'semi_planned'
      }
    });
    setIsCreating(true);
    setActiveSection('basic');
  };

  const startEditing = async (profile: SearchProfile) => {
    // Set basic profile data first
    setFormData({
      profile_name: profile.profile_name,
      is_default: profile.is_default,
      search_radius_km: profile.search_radius_km,
      preferred_time: profile.preferred_time,
      budget_level: profile.budget_level,
      preferred_pace: profile.preferred_pace,
      prefer_accessible_pois: profile.prefer_accessible_pois,
      prefer_outdoor_seating: profile.prefer_outdoor_seating,
      prefer_dog_friendly: profile.prefer_dog_friendly,
      preferred_vibes: profile.preferred_vibes,
      preferred_transport: profile.preferred_transport,
      dietary_needs: profile.dietary_needs,
      interests: profile.interests || [],
      tags: profile.tags || [],
      accommodation_preferences: {
        accommodation_type: [],
        star_rating: { min: 1, max: 5 },
        price_range_per_night: { min: 0, max: 500 },
        amenities: [],
        room_type: [],
        chain_preference: 'any',
        cancellation_policy: [],
        booking_flexibility: 'any'
      },
      dining_preferences: {
        cuisine_types: [],
        meal_types: [],
        service_style: [],
        price_range_per_person: { min: 0, max: 200 },
        dietary_needs: profile.dietary_needs,
        allergen_free: [],
        michelin_rated: false,
        local_recommendations: true,
        chain_vs_local: 'any',
        organic_preference: false,
        outdoor_seating_preferred: profile.prefer_outdoor_seating
      },
      activity_preferences: {
        activity_categories: [],
        physical_activity_level: 'moderate',
        indoor_outdoor_preference: 'mixed',
        cultural_immersion_level: 'moderate',
        must_see_vs_hidden_gems: 'mixed',
        educational_preference: false,
        photography_opportunities: false,
        season_specific_activities: ['year_round'],
        avoid_crowds: false,
        local_events_interest: []
      },
      itinerary_preferences: {
        planning_style: 'flexible',
        preferred_pace: profile.preferred_pace,
        time_flexibility: 'loose_schedule',
        morning_vs_evening: 'flexible',
        weekend_vs_weekday: 'any',
        preferred_seasons: ['spring', 'summer'],
        avoid_peak_season: false,
        adventure_vs_relaxation: 'balanced',
        spontaneous_vs_planned: 'semi_planned'
      }
    });
    
    setEditingProfile(profile.id);
    setActiveSection('basic');

    // Domain preferences will be included in the profile response from the backend
  };

  const cancelEditing = () => {
    setEditingProfile(null);
    setIsCreating(false);
    setActiveSection('basic');
  };

  const saveProfile = async () => {
    try {
      const data = formData();
      
      if (editingProfile()) {
        // Update profile with all domain preferences in a single transaction
        await updateProfileMutation.mutateAsync({ 
          profileId: editingProfile()!, 
          data 
        });
        props.onNotification({ message: 'Profile updated successfully!', type: 'success' });
      } else {
        // Create new profile with all domain preferences
        const newProfile = await createProfileMutation.mutateAsync(data);
        props.onNotification({ message: 'Profile created successfully!', type: 'success' });
      }
      
      cancelEditing();
    } catch (error) {
      props.onNotification({ 
        message: error?.message || 'Failed to save profile', 
        type: 'error' 
      });
    }
  };

  const deleteProfile = async (profileId: string, profileName: string) => {
    if (confirm(`Are you sure you want to delete "${profileName}"?`)) {
      try {
        await deleteProfileMutation.mutateAsync(profileId);
        props.onNotification({ message: 'Profile deleted successfully!', type: 'success' });
      } catch (error) {
        props.onNotification({ 
          message: error?.message || 'Failed to delete profile', 
          type: 'error' 
        });
      }
    }
  };

  const setDefaultProfile = async (profileId: string, profileName: string) => {
    try {
      await setDefaultProfileMutation.mutateAsync(profileId);
      props.onNotification({ message: `"${profileName}" set as default profile!`, type: 'success' });
    } catch (error) {
      props.onNotification({ 
        message: error?.message || 'Failed to set default profile', 
        type: 'error' 
      });
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof TravelProfileFormData],
        [field]: value
      }
    }));
  };

  const toggleArrayValue = (field: string, value: string) => {
    const current = formData()[field as keyof TravelProfileFormData] as string[];
    const updated = current.includes(value) 
      ? current.filter(v => v !== value)
      : [...current, value];
    updateField(field, updated);
  };

  const toggleNestedArrayValue = (section: string, field: string, value: string) => {
    const current = (formData()[section as keyof TravelProfileFormData] as any)?.[field] || [];
    const updated = current.includes(value) 
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    updateNestedField(section, field, updated);
  };

  const sections = [
    { id: 'basic', label: 'Basic', icon: Settings },
    { id: 'accommodation', label: 'Hotels', icon: Bed },
    { id: 'dining', label: 'Dining', icon: UtensilsCrossed },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'itinerary', label: 'Planning', icon: Calendar }
  ];

  const renderBasicSection = () => (
    <div class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Profile Name</label>
          <input
            type="text"
            value={formData().profile_name}
            onInput={(e) => updateField('profile_name', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Solo Explorer"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Radius (km)</label>
          <input
            type="number"
            value={formData().search_radius_km}
            onInput={(e) => updateField('search_radius_km', parseInt(e.target.value))}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
          <select
            value={formData().preferred_time}
            onChange={(e) => updateField('preferred_time', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="any">Any Time</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Budget Level (1-5)</label>
          <input
            type="range"
            min="1"
            max="5"
            value={formData().budget_level}
            onInput={(e) => updateField('budget_level', parseInt(e.target.value))}
            class="w-full"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>Budget</span>
            <span>Luxury</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Travel Pace</label>
          <select
            value={formData().preferred_pace}
            onChange={(e) => updateField('preferred_pace', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="slow">Slow & Relaxed</option>
            <option value="moderate">Moderate</option>
            <option value="fast">Fast & Active</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Transport</label>
          <select
            value={formData().preferred_transport}
            onChange={(e) => updateField('preferred_transport', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="any">Any</option>
            <option value="walking">Walking</option>
            <option value="public">Public Transport</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
          </select>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <label class="flex items-center">
            <input
              type="checkbox"
              checked={formData().prefer_accessible_pois}
              onChange={(e) => updateField('prefer_accessible_pois', e.target.checked)}
              class="mr-2"
            />
            <span class="text-sm">Accessible POIs</span>
          </label>
          <label class="flex items-center">
            <input
              type="checkbox"
              checked={formData().prefer_outdoor_seating}
              onChange={(e) => updateField('prefer_outdoor_seating', e.target.checked)}
              class="mr-2"
            />
            <span class="text-sm">Outdoor Seating</span>
          </label>
          <label class="flex items-center">
            <input
              type="checkbox"
              checked={formData().prefer_dog_friendly}
              onChange={(e) => updateField('prefer_dog_friendly', e.target.checked)}
              class="mr-2"
            />
            <span class="text-sm">Dog Friendly</span>
          </label>
          <label class="flex items-center">
            <input
              type="checkbox"
              checked={formData().is_default}
              onChange={(e) => updateField('is_default', e.target.checked)}
              class="mr-2"
            />
            <span class="text-sm">Default Profile</span>
          </label>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <div class="flex flex-wrap gap-2">
          <For each={activeTags()}>
            {(tag) => (
              <button
                onClick={() => toggleArrayValue('tags', tag.name)}
                class={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  formData().tags.includes(tag.name)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
            )}
          </For>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Interests</label>
        <div class="flex flex-wrap gap-2">
          <For each={activeInterests()}>
            {(interest) => (
              <button
                onClick={() => toggleArrayValue('interests', interest.name)}
                class={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  formData().interests.includes(interest.name)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {interest.name}
              </button>
            )}
          </For>
        </div>
      </div>
    </div>
  );

  const renderAccommodationSection = () => (
    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Accommodation Types</label>
        <div class="flex flex-wrap gap-2">
          <For each={['hotel', 'hostel', 'apartment', 'guesthouse', 'resort', 'boutique']}>
            {(type) => (
              <button
                onClick={() => toggleNestedArrayValue('accommodation_preferences', 'accommodation_type', type)}
                class={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${
                  formData().accommodation_preferences?.accommodation_type.includes(type)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            )}
          </For>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Star Rating Range</label>
          <div class="flex gap-2 items-center">
            <input
              type="number"
              min="1"
              max="5"
              value={formData().accommodation_preferences?.star_rating.min}
              onInput={(e) => updateNestedField('accommodation_preferences', 'star_rating', {
                ...formData().accommodation_preferences?.star_rating,
                min: parseInt(e.target.value)
              })}
              class="w-20 px-2 py-1 border border-gray-300 rounded"
            />
            <span>to</span>
            <input
              type="number"
              min="1"
              max="5"
              value={formData().accommodation_preferences?.star_rating.max}
              onInput={(e) => updateNestedField('accommodation_preferences', 'star_rating', {
                ...formData().accommodation_preferences?.star_rating,
                max: parseInt(e.target.value)
              })}
              class="w-20 px-2 py-1 border border-gray-300 rounded"
            />
            <span>stars</span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Price Range (per night)</label>
          <div class="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              value={formData().accommodation_preferences?.price_range_per_night.min}
              onInput={(e) => updateNestedField('accommodation_preferences', 'price_range_per_night', {
                ...formData().accommodation_preferences?.price_range_per_night,
                min: parseInt(e.target.value)
              })}
              class="w-24 px-2 py-1 border border-gray-300 rounded"
            />
            <span>to</span>
            <input
              type="number"
              min="0"
              value={formData().accommodation_preferences?.price_range_per_night.max}
              onInput={(e) => updateNestedField('accommodation_preferences', 'price_range_per_night', {
                ...formData().accommodation_preferences?.price_range_per_night,
                max: parseInt(e.target.value)
              })}
              class="w-24 px-2 py-1 border border-gray-300 rounded"
            />
            <span>$</span>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
        <div class="flex flex-wrap gap-2">
          <For each={['wifi', 'parking', 'pool', 'gym', 'spa', 'breakfast', 'pet_friendly', 'business_center', 'concierge']}>
            {(amenity) => (
              <button
                onClick={() => toggleNestedArrayValue('accommodation_preferences', 'amenities', amenity)}
                class={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${
                  formData().accommodation_preferences?.amenities.includes(amenity)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {amenity.replace('_', ' ')}
              </button>
            )}
          </For>
        </div>
      </div>
    </div>
  );

  const renderDiningSection = () => (
    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Cuisine Types</label>
        <div class="flex flex-wrap gap-2">
          <For each={['italian', 'asian', 'mediterranean', 'mexican', 'indian', 'french', 'american', 'local_specialty']}>
            {(cuisine) => (
              <button
                onClick={() => toggleNestedArrayValue('dining_preferences', 'cuisine_types', cuisine)}
                class={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${
                  formData().dining_preferences?.cuisine_types.includes(cuisine)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cuisine.replace('_', ' ')}
              </button>
            )}
          </For>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Service Style</label>
        <div class="flex flex-wrap gap-2">
          <For each={['fine_dining', 'casual', 'fast_casual', 'street_food', 'buffet', 'takeaway']}>
            {(style) => (
              <button
                onClick={() => toggleNestedArrayValue('dining_preferences', 'service_style', style)}
                class={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${
                  formData().dining_preferences?.service_style.includes(style)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {style.replace('_', ' ')}
              </button>
            )}
          </For>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Price Range (per person)</label>
          <div class="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              value={formData().dining_preferences?.price_range_per_person.min}
              onInput={(e) => updateNestedField('dining_preferences', 'price_range_per_person', {
                ...formData().dining_preferences?.price_range_per_person,
                min: parseInt(e.target.value)
              })}
              class="w-24 px-2 py-1 border border-gray-300 rounded"
            />
            <span>to</span>
            <input
              type="number"
              min="0"
              value={formData().dining_preferences?.price_range_per_person.max}
              onInput={(e) => updateNestedField('dining_preferences', 'price_range_per_person', {
                ...formData().dining_preferences?.price_range_per_person,
                max: parseInt(e.target.value)
              })}
              class="w-24 px-2 py-1 border border-gray-300 rounded"
            />
            <span>$</span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Dining Preferences</label>
          <select
            value={formData().dining_preferences?.chain_vs_local}
            onChange={(e) => updateNestedField('dining_preferences', 'chain_vs_local', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="any">Any</option>
            <option value="local_only">Local Only</option>
            <option value="chains_ok">Chains OK</option>
            <option value="chains_preferred">Chains Preferred</option>
          </select>
        </div>
      </div>

      <div class="flex flex-wrap gap-4">
        <label class="flex items-center">
          <input
            type="checkbox"
            checked={formData().dining_preferences?.michelin_rated}
            onChange={(e) => updateNestedField('dining_preferences', 'michelin_rated', e.target.checked)}
            class="mr-2"
          />
          <span class="text-sm">Michelin Rated</span>
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            checked={formData().dining_preferences?.local_recommendations}
            onChange={(e) => updateNestedField('dining_preferences', 'local_recommendations', e.target.checked)}
            class="mr-2"
          />
          <span class="text-sm">Local Recommendations</span>
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            checked={formData().dining_preferences?.organic_preference}
            onChange={(e) => updateNestedField('dining_preferences', 'organic_preference', e.target.checked)}
            class="mr-2"
          />
          <span class="text-sm">Organic Preference</span>
        </label>
      </div>
    </div>
  );

  const renderActivitiesSection = () => (
    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Activity Categories</label>
        <div class="flex flex-wrap gap-2">
          <For each={['museums', 'nightlife', 'shopping', 'nature', 'sports', 'arts', 'history', 'food_tours', 'adventure']}>
            {(category) => (
              <button
                onClick={() => toggleNestedArrayValue('activity_preferences', 'activity_categories', category)}
                class={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${
                  formData().activity_preferences?.activity_categories.includes(category)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.replace('_', ' ')}
              </button>
            )}
          </For>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Physical Activity Level</label>
          <select
            value={formData().activity_preferences?.physical_activity_level}
            onChange={(e) => updateNestedField('activity_preferences', 'physical_activity_level', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
            <option value="extreme">Extreme</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Indoor/Outdoor Preference</label>
          <select
            value={formData().activity_preferences?.indoor_outdoor_preference}
            onChange={(e) => updateNestedField('activity_preferences', 'indoor_outdoor_preference', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
            <option value="mixed">Mixed</option>
            <option value="weather_dependent">Weather Dependent</option>
          </select>
        </div>
      </div>

      <div class="flex flex-wrap gap-4">
        <label class="flex items-center">
          <input
            type="checkbox"
            checked={formData().activity_preferences?.educational_preference}
            onChange={(e) => updateNestedField('activity_preferences', 'educational_preference', e.target.checked)}
            class="mr-2"
          />
          <span class="text-sm">Educational</span>
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            checked={formData().activity_preferences?.photography_opportunities}
            onChange={(e) => updateNestedField('activity_preferences', 'photography_opportunities', e.target.checked)}
            class="mr-2"
          />
          <span class="text-sm">Photo Opportunities</span>
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            checked={formData().activity_preferences?.avoid_crowds}
            onChange={(e) => updateNestedField('activity_preferences', 'avoid_crowds', e.target.checked)}
            class="mr-2"
          />
          <span class="text-sm">Avoid Crowds</span>
        </label>
      </div>
    </div>
  );

  const renderItinerarySection = () => (
    <div class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Planning Style</label>
          <select
            value={formData().itinerary_preferences?.planning_style}
            onChange={(e) => updateNestedField('itinerary_preferences', 'planning_style', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="structured">Structured</option>
            <option value="flexible">Flexible</option>
            <option value="spontaneous">Spontaneous</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Time Flexibility</label>
          <select
            value={formData().itinerary_preferences?.time_flexibility}
            onChange={(e) => updateNestedField('itinerary_preferences', 'time_flexibility', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="strict_schedule">Strict Schedule</option>
            <option value="loose_schedule">Loose Schedule</option>
            <option value="completely_flexible">Completely Flexible</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Seasons</label>
        <div class="flex flex-wrap gap-2">
          <For each={['spring', 'summer', 'fall', 'winter']}>
            {(season) => (
              <button
                onClick={() => toggleNestedArrayValue('itinerary_preferences', 'preferred_seasons', season)}
                class={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${
                  formData().itinerary_preferences?.preferred_seasons.includes(season)
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {season}
              </button>
            )}
          </For>
        </div>
      </div>

      <div class="flex flex-wrap gap-4">
        <label class="flex items-center">
          <input
            type="checkbox"
            checked={formData().itinerary_preferences?.avoid_peak_season}
            onChange={(e) => updateNestedField('itinerary_preferences', 'avoid_peak_season', e.target.checked)}
            class="mr-2"
          />
          <span class="text-sm">Avoid Peak Season</span>
        </label>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (activeSection()) {
      case 'basic': return renderBasicSection();
      case 'accommodation': return renderAccommodationSection();
      case 'dining': return renderDiningSection();
      case 'activities': return renderActivitiesSection();
      case 'itinerary': return renderItinerarySection();
      default: return renderBasicSection();
    }
  };

  return (
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Travel Profiles</h2>
        <p class="text-gray-600 mb-6">Create and manage different travel profiles for various types of trips. Each profile can have its own preferences for accommodations, dining, activities, and planning.</p>

        <Show when={!isCreating() && !editingProfile()}>
          <div class="space-y-4">
            <For each={profiles()}>
              {(profile) => (
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-semibold text-gray-900">{profile.profile_name}</h3>
                        <Show when={profile.is_default}>
                          <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Default
                          </span>
                        </Show>
                      </div>
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div class="flex items-center gap-1">
                          <MapPin class="w-4 h-4" />
                          <span>{profile.search_radius_km}km radius</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <Clock class="w-4 h-4" />
                          <span>{profile.preferred_time}</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <DollarSign class="w-4 h-4" />
                          <span>Budget {profile.budget_level}/5</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <Zap class="w-4 h-4" />
                          <span>{profile.preferred_pace}</span>
                        </div>
                      </div>
                      <Show when={profile.interests?.length || profile.tags?.length}>
                        <div class="flex flex-wrap gap-2">
                          <For each={profile.interests || []}>
                            {(interest) => (
                              <span class="px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm">
                                {interest}
                              </span>
                            )}
                          </For>
                          <For each={profile.tags || []}>
                            {(tag) => (
                              <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">
                                {tag}
                              </span>
                            )}
                          </For>
                        </div>
                      </Show>
                    </div>
                    <div class="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setDefaultProfile(profile.id, profile.profile_name)}
                        disabled={profile.is_default || setDefaultProfileMutation.isPending}
                        class={`p-2 rounded-lg ${profile.is_default ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'} ${setDefaultProfileMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={profile.is_default ? 'This is the default profile' : 'Set as default profile'}
                      >
                        <Power class="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => startEditing(profile)}
                        class="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                      >
                        <Edit3 class="w-4 h-4" />
                      </button>
                      <Show when={!profile.is_default}>
                        <button
                          onClick={() => deleteProfile(profile.id, profile.profile_name)}
                          class="p-2 text-red-400 hover:text-red-600 rounded-lg"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </Show>
                    </div>
                  </div>
                </div>
              )}
            </For>

            <button
              onClick={startCreating}
              class="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
            >
              <div class="flex items-center justify-center gap-2 text-gray-600 group-hover:text-blue-600">
                <Plus class="w-5 h-5" />
                <span class="font-medium">Create New Travel Profile</span>
              </div>
            </button>
          </div>
        </Show>

        <Show when={isCreating() || editingProfile()}>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">
                {editingProfile() ? 'Edit Profile' : 'Create New Profile'}
              </h3>
              <button
                onClick={cancelEditing}
                class="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            {/* Section Navigation */}
            <div class="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
              <For each={sections}>
                {(section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      onClick={() => setActiveSection(section.id)}
                      class={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeSection() === section.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon class="w-4 h-4" />
                      {section.label}
                    </button>
                  );
                }}
              </For>
            </div>

            {/* Current Section Content */}
            {renderCurrentSection()}

            {/* Form Actions */}
            <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={cancelEditing}
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                disabled={createProfileMutation.isPending || updateProfileMutation.isPending}
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <Save class="w-4 h-4" />
                {(createProfileMutation.isPending || updateProfileMutation.isPending) ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}