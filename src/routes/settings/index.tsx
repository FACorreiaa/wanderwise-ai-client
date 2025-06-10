import { createSignal, For, Show } from 'solid-js';
import { User, Tag, Heart, Users, Camera, MapPin, Calendar, Globe, Bell, Lock, CreditCard, Trash2, Plus, X, Edit3, Save, Mail, Phone } from 'lucide-solid';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = createSignal('settings');
    const [userProfile, setUserProfile] = createSignal({
        name: 'Alex Thompson',
        email: 'alex.thompson@email.com',
        phone: '+1 (555) 123-4567',
        bio: 'Travel enthusiast exploring hidden gems around the world. Love discovering local cuisines and historical sites.',
        location: 'San Francisco, CA',
        avatar: null,
        birthDate: '1990-05-15',
        language: 'English'
    });

    const [selectedTags, setSelectedTags] = createSignal([
        'Historic Sites', 'Local Cuisine', 'Museums', 'Photography', 'Walking Tours'
    ]);

    const [selectedInterests, setSelectedInterests] = createSignal([
        'Art & Culture', 'Food & Dining', 'History', 'Photography', 'Architecture'
    ]);

    const [travelProfiles, setTravelProfiles] = createSignal([
        {
            id: 1,
            name: 'Solo Explorer',
            description: 'Perfect for independent travel and self-discovery',
            preferences: ['Museums', 'Cafes', 'Walking Tours', 'Photography'],
            isActive: true
        },
        {
            id: 2,
            name: 'Foodie Adventure',
            description: 'Focused on culinary experiences and local cuisine',
            preferences: ['Restaurants', 'Food Markets', 'Cooking Classes', 'Wine Tasting'],
            isActive: false
        }
    ]);

    const availableTags = [
        'Historic Sites', 'Local Cuisine', 'Museums', 'Photography', 'Walking Tours',
        'Nightlife', 'Shopping', 'Parks', 'Architecture', 'Street Art', 'Markets',
        'Beaches', 'Adventure Sports', 'Cultural Events', 'Religious Sites'
    ];

    const availableInterests = [
        'Art & Culture', 'Food & Dining', 'History', 'Photography', 'Architecture',
        'Music & Entertainment', 'Outdoor Activities', 'Shopping', 'Nightlife',
        'Nature & Parks', 'Sports', 'Technology', 'Literature', 'Fashion'
    ];

    const tabs = [
        { id: 'settings', label: 'Settings', icon: User },
        { id: 'tags', label: 'Tags', icon: Tag },
        { id: 'interests', label: 'Interests', icon: Heart },
        { id: 'profiles', label: 'Profiles', icon: Users }
    ];

    const toggleTag = (tag: any) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const toggleInterest = (interest: any) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const toggleProfile = (profileId: any) => {
        setTravelProfiles(prev =>
            prev.map(profile =>
                profile.id === profileId
                    ? { ...profile, isActive: !profile.isActive }
                    : profile
            )
        );
    };

    const updateProfile = (field: any, value: any) => {
        setUserProfile(prev => ({ ...prev, [field]: value }));
    };

    const renderSettings = () => (
        <div class="space-y-8">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>

                {/* Profile Picture */}
                <div class="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        <div class="relative">
                            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                                {userProfile().name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <button class="absolute -bottom-1 -right-1 bg-white border-2 border-gray-200 rounded-full p-1 sm:p-1.5 hover:bg-gray-50">
                                <Camera class="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                            </button>
                        </div>
                        <div class="text-center sm:text-left">
                            <h3 class="text-base sm:text-lg font-semibold text-gray-900">Profile Photo</h3>
                            <p class="text-xs sm:text-sm text-gray-500">Update your profile picture</p>
                            <button class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm font-medium">
                                Upload Photo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div class="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Personal Information</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Full Name</label>
                            <input
                                type="text"
                                value={userProfile().name}
                                onInput={(e) => updateProfile('name', e.target.value)}
                                class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <div class="relative">
                                <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="email"
                                    value={userProfile().email}
                                    onInput={(e) => updateProfile('email', e.target.value)}
                                    class="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <div class="relative">
                                <Phone class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="tel"
                                    value={userProfile().phone}
                                    onInput={(e) => updateProfile('phone', e.target.value)}
                                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <div class="relative">
                                <MapPin class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={userProfile().location}
                                    onInput={(e) => updateProfile('location', e.target.value)}
                                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            <textarea
                                value={userProfile().bio}
                                onInput={(e) => updateProfile('bio', e.target.value)}
                                rows={3}
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Tell us about your travel interests..."
                            />
                        </div>
                    </div>
                    <div class="flex justify-end mt-4 sm:mt-6">
                        <button class="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                            <Save class="w-3 h-3 sm:w-4 sm:h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTags = () => (
        <div class="space-y-8">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Travel Tags</h2>
                <p class="text-gray-600 mb-6">Select tags that best describe your travel preferences. These help us personalize your recommendations.</p>

                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <div class="flex flex-wrap gap-3">
                        <For each={availableTags}>
                            {(tag) => (
                                <button
                                    onClick={() => toggleTag(tag)}
                                    class={`px-4 py-2 rounded-full border-2 transition-all duration-200 font-medium ${selectedTags().includes(tag)
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                        }`}
                                >
                                    {tag}
                                </button>
                            )}
                        </For>
                    </div>

                    <div class="mt-6 pt-6 border-t border-gray-200">
                        <h4 class="font-semibold text-gray-900 mb-3">Selected Tags ({selectedTags().length})</h4>
                        <div class="flex flex-wrap gap-2">
                            <For each={selectedTags()}>
                                {(tag) => (
                                    <span class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        {tag}
                                        <button
                                            onClick={() => toggleTag(tag)}
                                            class="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                        >
                                            <X class="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                            </For>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderInterests = () => (
        <div class="space-y-8">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Interests</h2>
                <p class="text-gray-600 mb-6">Choose your interests to get more targeted recommendations and discover places that match your passions.</p>

                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <For each={availableInterests}>
                            {(interest) => (
                                <label class="relative cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedInterests().includes(interest)}
                                        onChange={() => toggleInterest(interest)}
                                        class="sr-only"
                                    />
                                    <div class={`p-4 rounded-lg border-2 transition-all duration-200 ${selectedInterests().includes(interest)
                                        ? 'bg-purple-50 border-purple-500 shadow-md'
                                        : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                                        }`}>
                                        <div class="flex items-center justify-between">
                                            <span class="font-medium text-gray-900 text-sm">{interest}</span>
                                            <Show when={selectedInterests().includes(interest)}>
                                                <Heart class="w-4 h-4 text-purple-600 fill-current" />
                                            </Show>
                                        </div>
                                    </div>
                                </label>
                            )}
                        </For>
                    </div>

                    <div class="mt-6 pt-6 border-t border-gray-200">
                        <h4 class="font-semibold text-gray-900 mb-3">Your Interests ({selectedInterests().length})</h4>
                        <div class="flex flex-wrap gap-2">
                            <For each={selectedInterests()}>
                                {(interest) => (
                                    <span class="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                        <Heart class="w-3 h-3 fill-current" />
                                        {interest}
                                    </span>
                                )}
                            </For>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderProfiles = () => (
        <div class="space-y-8">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Travel Profiles</h2>
                <p class="text-gray-600 mb-6">Create and manage different travel profiles for various types of trips. Each profile can have its own preferences and recommendations.</p>

                <div class="space-y-4">
                    <For each={travelProfiles()}>
                        {(profile) => (
                            <div class="bg-white rounded-lg border border-gray-200 p-6">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-3 mb-2">
                                            <h3 class="text-lg font-semibold text-gray-900">{profile.name}</h3>
                                            <span class={`px-2 py-1 rounded-full text-xs font-medium ${profile.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {profile.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <p class="text-gray-600 mb-4">{profile.description}</p>
                                        <div class="flex flex-wrap gap-2">
                                            <For each={profile.preferences}>
                                                {(pref) => (
                                                    <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                                                        {pref}
                                                    </span>
                                                )}
                                            </For>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => toggleProfile(profile.id)}
                                            class={`px-4 py-2 rounded-lg font-medium transition-colors ${profile.isActive
                                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                        >
                                            {profile.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                            <Edit3 class="w-4 h-4" />
                                        </button>
                                        <button class="p-2 text-red-400 hover:text-red-600 rounded-lg">
                                            <Trash2 class="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </For>

                    <button class="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group">
                        <div class="flex items-center justify-center gap-2 text-gray-600 group-hover:text-blue-600">
                            <Plus class="w-5 h-5" />
                            <span class="font-medium">Create New Travel Profile</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab()) {
            case 'settings':
                return renderSettings();
            case 'tags':
                return renderTags();
            case 'interests':
                return renderInterests();
            case 'profiles':
                return renderProfiles();
            default:
                return renderSettings();
        }
    };

    return (
        <div class="min-h-screen bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div class="flex flex-col lg:flex-row gap-4 lg:gap-8">
                    {/* Mobile Tab Navigation */}
                    <div class="lg:hidden">
                        <div class="bg-white rounded-lg border border-gray-200 p-2">
                            <div class="flex overflow-x-auto space-x-1">
                                <For each={tabs}>
                                    {(tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                onClick={() => setActiveTab(tab.id)}
                                                class={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab() === tab.id
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <Icon class="w-4 h-4" />
                                                {tab.label}
                                            </button>
                                        );
                                    }}
                                </For>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Tab Navigation */}
                    <div class="hidden lg:block w-64 flex-shrink-0">
                        <div class="bg-white rounded-lg border border-gray-200 p-2 sticky top-8">
                            <nav class="space-y-1">
                                <For each={tabs}>
                                    {(tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                onClick={() => setActiveTab(tab.id)}
                                                class={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 font-medium ${activeTab() === tab.id
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <Icon class="w-5 h-5" />
                                                {tab.label}
                                            </button>
                                        );
                                    }}
                                </For>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div class="flex-1">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}