import { createSignal, For, Show } from 'solid-js';
import { User, Plus, Edit3, Trash2, Copy, X } from 'lucide-solid';

interface ProfileStats {
    placesVisited: number;
    itinerariesCreated: number;
    avgRating: number;
}

interface Profile {
    id: string;
    name: string;
    description: string;
    interests: string[];
    tags: string[];
    budget: string;
    travelStyle: string;
    groupSize: string;
    accessibility: string[];
    isDefault: boolean;
    isPublic: boolean;
    createdAt: string;
    usageCount: number;
    lastUsed: string | null;
    stats: ProfileStats;
}

export default function ProfilesPage() {
    const [selectedProfile, setSelectedProfile] = createSignal<Profile | null>(null);
    const [showCreateModal, setShowCreateModal] = createSignal(false);
    const [showEditModal, setShowEditModal] = createSignal(false);

    // Profile form state
    const [profileForm, setProfileForm] = createSignal<Omit<Profile, 'id' | 'createdAt' | 'usageCount' | 'lastUsed' | 'stats'>>({
        name: '',
        description: '',
        interests: [],
        tags: [],
        budget: 'medium',
        travelStyle: 'balanced',
        groupSize: 'solo',
        accessibility: [],
        isDefault: false,
        isPublic: false
    });

    // Sample profiles data
    const [profiles, setProfiles] = createSignal<Profile[]>([
        {
            id: "prof-1",
            name: "Solo Explorer",
            description: "Perfect for independent travel and self-discovery. Focus on cultural experiences, museums, and quiet cafes.",
            interests: ["Art & Culture", "History", "Photography", "Literature"],
            tags: ["Museums", "Cafes", "Walking Tours", "Historic Sites"],
            budget: "medium",
            travelStyle: "cultural",
            groupSize: "solo",
            accessibility: ["Public Transport"],
            isDefault: true,
            isPublic: false,
            createdAt: "2024-01-15",
            usageCount: 15,
            lastUsed: "2024-01-20",
            stats: {
                placesVisited: 23,
                itinerariesCreated: 8,
                avgRating: 4.3
            }
        },
        {
            id: "prof-2",
            name: "Foodie Adventure",
            description: "For culinary enthusiasts seeking authentic local flavors. From street food to fine dining.",
            interests: ["Food & Dining", "Local Culture", "Markets", "Cooking"],
            tags: ["Restaurants", "Food Markets", "Cooking Classes", "Wine Tasting"],
            budget: "high",
            travelStyle: "culinary",
            groupSize: "couple",
            accessibility: [],
            isDefault: false,
            isPublic: true,
            createdAt: "2024-01-10",
            usageCount: 8,
            lastUsed: "2024-01-18",
            stats: {
                placesVisited: 18,
                itinerariesCreated: 5,
                avgRating: 4.7
            }
        },
        {
            id: "prof-3",
            name: "Family Fun",
            description: "Family-friendly adventures with activities for all ages. Safe, accessible, and entertaining.",
            interests: ["Family Activities", "Outdoor Fun", "Educational", "Entertainment"],
            tags: ["Family Friendly", "Parks", "Museums", "Interactive"],
            budget: "medium",
            travelStyle: "family",
            groupSize: "family",
            accessibility: ["Wheelchair Accessible", "Family Friendly", "Public Transport"],
            isDefault: false,
            isPublic: false,
            createdAt: "2024-01-05",
            usageCount: 12,
            lastUsed: "2024-01-19",
            stats: {
                placesVisited: 31,
                itinerariesCreated: 6,
                avgRating: 4.1
            }
        }
    ]);

    const interestOptions = [
        "Art & Culture", "Food & Dining", "History", "Photography", "Architecture",
        "Music & Entertainment", "Outdoor Activities", "Shopping", "Nightlife",
        "Nature & Parks", "Sports", "Technology", "Literature", "Fashion",
        "Local Culture", "Markets", "Cooking", "Educational", "Entertainment"
    ];

    const tagOptions = [
        "Museums", "Restaurants", "Parks", "Historic Sites", "Architecture",
        "Photography", "Walking Tours", "Food Markets", "Cafes", "Shopping",
        "Nightlife", "Beaches", "Adventure Sports", "Cultural Events",
        "Religious Sites", "Cooking Classes", "Wine Tasting", "Family Friendly",
        "Interactive", "Public Transport", "Wheelchair Accessible"
    ];

    const budgetOptions = [
        { id: 'low', label: 'Budget Conscious', description: 'Free and low-cost activities' },
        { id: 'medium', label: 'Moderate Spending', description: 'Mix of free and paid experiences' },
        { id: 'high', label: 'Premium Experience', description: 'High-end activities and dining' }
    ];

    const travelStyleOptions = [
        { id: 'cultural', label: 'Cultural', description: 'Museums, history, arts' },
        { id: 'culinary', label: 'Culinary', description: 'Food, restaurants, markets' },
        { id: 'adventure', label: 'Adventure', description: 'Outdoor activities, sports' },
        { id: 'relaxed', label: 'Relaxed', description: 'Peaceful, slow-paced' },
        { id: 'family', label: 'Family', description: 'Family-friendly activities' },
        { id: 'balanced', label: 'Balanced', description: 'Mix of different activities' }
    ];

    const groupSizeOptions = [
        { id: 'solo', label: 'Solo Travel', icon: '👤' },
        { id: 'couple', label: 'Couple', icon: '👫' },
        { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
        { id: 'group', label: 'Group', icon: '👥' }
    ];

    const accessibilityOptions = [
        "Wheelchair Accessible", "Family Friendly", "Dog Friendly",
        "Public Transport", "Senior Friendly", "Language Support"
    ];

    const createProfile = () => {
        const newProfile = {
            id: `prof-${Date.now()}`,
            ...profileForm(),
            createdAt: new Date().toISOString().split('T')[0],
            usageCount: 0,
            lastUsed: null,
            stats: {
                placesVisited: 0,
                itinerariesCreated: 0,
                avgRating: 0
            }
        };
        setProfiles(prev => [...prev, newProfile]);
        setShowCreateModal(false);
        resetForm();
    };

    const updateProfile = () => {
        const current = selectedProfile();
        if (!current) return;

        setProfiles(prev => prev.map(p =>
            p.id === current.id
                ? { ...current, ...profileForm() } as Profile
                : p
        ));
        setShowEditModal(false);
        resetForm();
    };

    const deleteProfile = (profileId: string) => {
        if (confirm('Are you sure you want to delete this profile?')) {
            setProfiles(prev => prev.filter(p => p.id !== profileId));
        }
    };

    const duplicateProfile = (profile: Profile) => {

        const { id: _id, stats: _stats, ...startProps } = profile;
        void _id;
        const newProfile = {
            ...startProps,
            id: `prof-${Date.now()}`,
            name: `${profile.name} (Copy)`,
            isDefault: false,
            createdAt: new Date().toISOString().split('T')[0],
            usageCount: 0,
            lastUsed: null,
            stats: { ..._stats }
        };
        setProfiles(prev => [...prev, newProfile as any]);
    };

    const setAsDefault = (profileId: string) => {
        setProfiles(prev => prev.map(p => ({
            ...p,
            isDefault: p.id === profileId
        })));
    };

    const resetForm = () => {
        setProfileForm({
            name: '',
            description: '',
            interests: [],
            tags: [],
            budget: 'medium',
            travelStyle: 'balanced',
            groupSize: 'solo',
            accessibility: [],
            isDefault: false,
            isPublic: false
        });
    };

    const openEditModal = (profile: Profile) => {
        setSelectedProfile(profile);
        setProfileForm({
            name: profile.name,
            description: profile.description,
            interests: [...profile.interests],
            tags: [...profile.tags],
            budget: profile.budget,
            travelStyle: profile.travelStyle,
            groupSize: profile.groupSize,
            accessibility: [...profile.accessibility],
            isDefault: profile.isDefault,
            isPublic: profile.isPublic
        });
        setShowEditModal(true);
    };

    const toggleArrayItem = (array: string[], item: string, setter: (newValue: string[]) => void) => {
        if (array.includes(item)) {
            setter(array.filter(i => i !== item));
        } else {
            setter([...array, item]);
        }
    };

    const getBudgetIcon = (budget: string) => {
        const icons: Record<string, string> = {
            'low': '💰',
            'medium': '💰💰',
            'high': '💰💰💰'
        };
        return icons[budget] || '💰';
    };

    const getTravelStyleIcon = (style: string) => {
        const icons: Record<string, string> = {
            'cultural': '🎨',
            'culinary': '🍽️',
            'adventure': '🏔️',
            'relaxed': '🧘',
            'family': '👨‍👩‍👧‍👦',
            'balanced': '⚖️'
        };
        return icons[style] || '⚖️';
    };

    const renderProfileCard = (profile: Profile) => (
        <div class={`cb-card hover:shadow-lg transition-all duration-300 ${profile.isDefault ? 'ring-2 ring-blue-500' : ''}`}>
            <div class="p-6">
                {/* Header */}
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <h3 class="text-lg font-semibold text-gray-900">{profile.name}</h3>
                            {profile.isDefault && (
                                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    Default
                                </span>
                            )}
                            {profile.isPublic && (
                                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    Public
                                </span>
                            )}
                        </div>
                        <p class="text-sm text-gray-600">{profile.description}</p>
                    </div>

                    {/* Actions dropdown */}
                    <div class="flex items-center gap-1 ml-4">
                        <button
                            onClick={() => openEditModal(profile)}
                            class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit profile"
                        >
                            <Edit3 class="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => duplicateProfile(profile)}
                            class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Duplicate profile"
                        >
                            <Copy class="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => deleteProfile(profile.id)}
                            class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete profile"
                        >
                            <Trash2 class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Quick stats */}
                <div class="grid grid-cols-3 gap-4 mb-4 py-3 bg-gray-50 rounded-lg">
                    <div class="text-center">
                        <div class="text-lg font-semibold text-gray-900">{profile.stats.placesVisited}</div>
                        <div class="text-xs text-gray-600">Places</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-semibold text-gray-900">{profile.stats.itinerariesCreated}</div>
                        <div class="text-xs text-gray-600">Trips</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-semibold text-gray-900">{profile.stats.avgRating}</div>
                        <div class="text-xs text-gray-600">Rating</div>
                    </div>
                </div>

                {/* Profile details */}
                <div class="space-y-3 mb-4">
                    <div class="flex items-center gap-2 text-sm">
                        <span class="text-2xl">{getTravelStyleIcon(profile.travelStyle)}</span>
                        <span class="font-medium text-gray-700">
                            {travelStyleOptions.find(s => s.id === profile.travelStyle)?.label}
                        </span>
                        <span class="text-gray-500">•</span>
                        <span class="text-2xl">{getBudgetIcon(profile.budget)}</span>
                        <span class="text-gray-600">
                            {budgetOptions.find(b => b.id === profile.budget)?.label}
                        </span>
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                        <span class="text-xl">{groupSizeOptions.find(g => g.id === profile.groupSize)?.icon}</span>
                        <span class="text-gray-600">
                            {groupSizeOptions.find(g => g.id === profile.groupSize)?.label}
                        </span>
                        {profile.usageCount > 0 && (
                            <>
                                <span class="text-gray-500">•</span>
                                <span class="text-gray-600">Used {profile.usageCount} times</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Interests preview */}
                <div class="mb-4">
                    <div class="flex flex-wrap gap-1 mb-2">
                        <For each={profile.interests.slice(0, 3)}>{interest => (
                            <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                {interest}
                            </span>
                        )}</For>
                        {profile.interests.length > 3 && (
                            <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{profile.interests.length - 3} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div class="text-xs text-gray-500">
                        {profile.lastUsed ? `Last used ${new Date(profile.lastUsed).toLocaleDateString()}` : 'Never used'}
                    </div>
                    <div class="flex items-center gap-2">
                        {!profile.isDefault && (
                            <button
                                onClick={() => setAsDefault(profile.id)}
                                class="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Set as Default
                            </button>
                        )}
                        <button class="cb-button cb-button-primary px-3 py-1 text-xs">
                            Use Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderProfileForm = () => (
        <div class="space-y-6">
            {/* Basic Info */}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Profile Name</label>
                <input
                    type="text"
                    value={profileForm().name}
                    onInput={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Solo Explorer, Family Fun"
                />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                    value={profileForm().description}
                    onInput={(e) => setProfileForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe this travel profile and when you'd use it..."
                />
            </div>

            {/* Travel Style */}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Travel Style</label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <For each={travelStyleOptions}>
                        {(style) => (
                            <label class="relative cursor-pointer">
                                <input
                                    type="radio"
                                    name="travelStyle"
                                    value={style.id}
                                    checked={profileForm().travelStyle === style.id}
                                    onChange={() => setProfileForm(prev => ({ ...prev, travelStyle: style.id }))}
                                    class="sr-only"
                                />
                                <div class={`p-3 rounded-lg border-2 transition-all ${profileForm().travelStyle === style.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                    <div class="text-center">
                                        <div class="text-2xl mb-1">{getTravelStyleIcon(style.id)}</div>
                                        <div class="text-sm font-medium text-gray-900">{style.label}</div>
                                        <div class="text-xs text-gray-600">{style.description}</div>
                                    </div>
                                </div>
                            </label>
                        )}
                    </For>
                </div>
            </div>

            {/* Budget */}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Budget Preference</label>
                <div class="space-y-2">
                    <For each={budgetOptions}>
                        {(budget) => (
                            <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="budget"
                                    value={budget.id}
                                    checked={profileForm().budget === budget.id}
                                    onChange={() => setProfileForm(prev => ({ ...prev, budget: budget.id }))}
                                    class="text-blue-600 focus:ring-blue-500"
                                />
                                <div class="ml-3 flex-1">
                                    <div class="flex items-center gap-2">
                                        <span class="text-lg">{getBudgetIcon(budget.id)}</span>
                                        <span class="font-medium text-gray-900">{budget.label}</span>
                                    </div>
                                    <p class="text-sm text-gray-600">{budget.description}</p>
                                </div>
                            </label>
                        )}
                    </For>
                </div>
            </div>

            {/* Group Size */}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Group Size</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <For each={groupSizeOptions}>
                        {(group) => (
                            <label class="relative cursor-pointer">
                                <input
                                    type="radio"
                                    name="groupSize"
                                    value={group.id}
                                    checked={profileForm().groupSize === group.id}
                                    onChange={() => setProfileForm(prev => ({ ...prev, groupSize: group.id }))}
                                    class="sr-only"
                                />
                                <div class={`p-3 rounded-lg border-2 transition-all text-center ${profileForm().groupSize === group.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                    <div class="text-2xl mb-1">{group.icon}</div>
                                    <div class="text-sm font-medium text-gray-900">{group.label}</div>
                                </div>
                            </label>
                        )}
                    </For>
                </div>
            </div>

            {/* Interests */}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Interests</label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <For each={interestOptions}>
                        {(interest) => (
                            <label class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    checked={profileForm().interests.includes(interest)}
                                    onChange={() => toggleArrayItem(
                                        profileForm().interests,
                                        interest,
                                        (newInterests) => setProfileForm(prev => ({ ...prev, interests: newInterests }))
                                    )}
                                    class="text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span class="ml-2 text-sm text-gray-700">{interest}</span>
                            </label>
                        )}
                    </For>
                </div>
            </div>

            {/* Tags */}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Preferred Tags</label>
                <div class="flex flex-wrap gap-2">
                    <For each={tagOptions}>
                        {(tag) => (
                            <button
                                type="button"
                                onClick={() => toggleArrayItem(
                                    profileForm().tags,
                                    tag,
                                    (newTags) => setProfileForm(prev => ({ ...prev, tags: newTags }))
                                )}
                                class={`px-3 py-1 rounded-full border transition-all text-sm ${profileForm().tags.includes(tag)
                                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {tag}
                            </button>
                        )}
                    </For>
                </div>
            </div>

            {/* Accessibility */}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Accessibility Needs</label>
                <div class="space-y-2">
                    <For each={accessibilityOptions}>
                        {(option) => (
                            <label class="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={profileForm().accessibility.includes(option)}
                                    onChange={() => toggleArrayItem(
                                        profileForm().accessibility,
                                        option,
                                        (newOptions) => setProfileForm(prev => ({ ...prev, accessibility: newOptions }))
                                    )}
                                    class="text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span class="ml-2 text-sm text-gray-700">{option}</span>
                            </label>
                        )}
                    </For>
                </div>
            </div>

            {/* Settings */}
            <div class="space-y-3">
                <label class="flex items-center">
                    <input
                        type="checkbox"
                        checked={profileForm().isDefault}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                        class="text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Set as default profile</span>
                </label>

                <label class="flex items-center">
                    <input
                        type="checkbox"
                        checked={profileForm().isPublic}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                        class="text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Make profile public (others can discover and use it)</span>
                </label>
            </div>
        </div>
    );

    return (
        <div class="min-h-screen bg-gray-50">
            {/* Header */}
            <div class="bg-white border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900">Travel Profiles</h1>
                            <p class="text-gray-600 mt-1">Manage your personalized travel preferences</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            class="cb-button cb-button-primary px-4 py-2 flex items-center gap-2"
                        >
                            <Plus class="w-4 h-4" />
                            Create Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Show
                    when={profiles().length > 0}
                    fallback={
                        <div class="text-center py-12">
                            <User class="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">No profiles yet</h3>
                            <p class="text-gray-600 mb-4">
                                Create your first travel profile to get personalized recommendations
                            </p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                class="cb-button cb-button-primary px-6 py-2"
                            >
                                Create Your First Profile
                            </button>
                        </div>
                    }
                >
                    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        <For each={profiles()}>
                            {(profile) => renderProfileCard(profile)}
                        </For>
                    </div>
                </Show>
            </div>

            {/* Create Profile Modal */}
            <Show when={showCreateModal()}>
                <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div class="p-6 border-b border-gray-200">
                            <div class="flex items-center justify-between">
                                <h2 class="text-xl font-semibold text-gray-900">Create New Profile</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    class="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X class="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div class="p-6">
                            {renderProfileForm()}
                        </div>
                        <div class="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                class="cb-button cb-button-secondary px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createProfile}
                                disabled={!profileForm().name.trim()}
                                class="cb-button cb-button-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Profile
                            </button>
                        </div>
                    </div>
                </div>
            </Show>

            {/* Edit Profile Modal */}
            <Show when={showEditModal()}>
                <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div class="p-6 border-b border-gray-200">
                            <div class="flex items-center justify-between">
                                <h2 class="text-xl font-semibold text-gray-900">Edit Profile</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    class="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X class="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div class="p-6">
                            {renderProfileForm()}
                        </div>
                        <div class="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowEditModal(false)}
                                class="cb-button cb-button-secondary px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateProfile}
                                disabled={!profileForm().name.trim()}
                                class="cb-button cb-button-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    );
}