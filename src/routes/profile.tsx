import { createSignal, For, Show, createEffect } from 'solid-js';
import { User, Mail, MapPin, Calendar, Camera, Edit3, Save, X, Plus, Tag, Heart } from 'lucide-solid';
import { useAuth } from '~/contexts/AuthContext';
import { useDefaultProfile, useUpdateProfileMutation } from '@/lib/api/user';

export default function ProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = createSignal(false);
    const [activeTab, setActiveTab] = createSignal('overview');
    
    // API hooks
    const profileQuery = useDefaultProfile();
    const updateProfileMutation = useUpdateProfileMutation();

    // Get profile data from API or user auth data as fallback
    const profileData = () => {
        if (profileQuery.data) {
            return profileQuery.data;
        }
        // Fallback to user data + defaults
        return {
            id: user()?.id,
            username: user()?.username || 'Travel Explorer',
            email: user()?.email || 'explorer@example.com',
            bio: 'Passionate traveler exploring hidden gems around the world. Love discovering local cuisines and historical sites.',
            location: 'San Francisco, CA',
            joinedDate: '2024-01-15',
            avatar: null,
            interests: ['Architecture', 'Food & Dining', 'Museums', 'Photography'],
            badges: ['Early Adopter', 'Review Writer', 'Local Guide'],
            stats: {
                places_visited: 47,
                reviews_written: 23,
                lists_created: 8,
                followers: 156,
                following: 89
            }
        };
    };

    const [editForm, setEditForm] = createSignal({
        username: '',
        bio: '',
        location: ''
    });

    const startEditing = () => {
        setEditForm({
            username: profileData().username,
            bio: profileData().bio,
            location: profileData().location
        });
        setIsEditing(true);
    };

    const saveProfile = async () => {
        const profileId = profileData().id;
        if (profileId) {
            try {
                await updateProfileMutation.mutateAsync({
                    profileId,
                    profileData: editForm()
                });
                setIsEditing(false);
            } catch (error) {
                console.error('Failed to update profile:', error);
            }
        }
    };

    const cancelEditing = () => {
        setIsEditing(false);
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'activity', label: 'Activity' },
        { id: 'lists', label: 'Lists' },
        { id: 'reviews', label: 'Reviews' }
    ];

    const recentActivity = [
        {
            type: 'review',
            title: 'Reviewed Livraria Lello',
            description: 'Amazing architecture and atmosphere!',
            date: '2 days ago',
            rating: 5
        },
        {
            type: 'list',
            title: 'Created "Hidden Gems in Porto"',
            description: 'A curated list of off-the-beaten-path spots',
            date: '1 week ago'
        },
        {
            type: 'favorite',
            title: 'Added Ponte Luís I to favorites',
            date: '2 weeks ago'
        }
    ];

    const getUserLists = () => [
        {
            id: 1,
            name: 'European Hidden Gems',
            description: 'Off-the-beaten-path destinations across Europe',
            itemCount: 15,
            isPublic: true,
            likes: 42
        },
        {
            id: 2,
            name: 'Best Food Markets',
            description: 'Amazing food markets from around the world',
            itemCount: 8,
            isPublic: false,
            likes: 0
        }
    ];

    const renderOverview = () => (
        <div class="space-y-6">
            {/* Stats Grid */}
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{profileData().stats.places_visited}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Places Visited</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
                    <div class="text-2xl font-bold text-green-600 dark:text-green-400">{profileData().stats.reviews_written}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
                    <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{profileData().stats.lists_created}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Lists Created</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
                    <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{profileData().stats.followers}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Followers</div>
                </div>
            </div>

            {/* Interests */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interests</h3>
                <div class="flex flex-wrap gap-2">
                    <For each={profileData().interests}>
                        {(interest) => (
                            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                                {interest}
                            </span>
                        )}
                    </For>
                </div>
            </div>

            {/* Badges */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Badges</h3>
                <div class="flex flex-wrap gap-3">
                    <For each={profileData().badges}>
                        {(badge) => (
                            <div class="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-lg border border-yellow-200 dark:border-yellow-700">
                                <div class="w-6 h-6 bg-yellow-500 rounded-full"></div>
                                <span class="text-sm font-medium text-yellow-800 dark:text-yellow-200">{badge}</span>
                            </div>
                        )}
                    </For>
                </div>
            </div>

            {/* Recent Activity */}
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div class="space-y-4">
                    <For each={recentActivity}>
                        {(activity) => (
                            <div class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Show when={activity.type === 'review'}>
                                        <User class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </Show>
                                    <Show when={activity.type === 'list'}>
                                        <Tag class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </Show>
                                    <Show when={activity.type === 'favorite'}>
                                        <Heart class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </Show>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span class="text-xs text-gray-500 dark:text-gray-500">{activity.date}</span>
                                        <Show when={activity.rating}>
                                            <div class="flex items-center gap-1">
                                                <For each={Array.from({ length: activity.rating }, (_, i) => i)}>
                                                    {() => <span class="text-yellow-500 text-xs">★</span>}
                                                </For>
                                            </div>
                                        </Show>
                                    </div>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </div>
    );

    const renderActivity = () => (
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Feed</h3>
            <div class="space-y-4">
                <For each={recentActivity}>
                    {(activity) => (
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                            <div class="flex items-start gap-3">
                                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <User class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                                    <p class="text-gray-600 dark:text-gray-400 mt-1">{activity.description}</p>
                                    <span class="text-sm text-gray-500 dark:text-gray-500">{activity.date}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );

    const renderLists = () => (
        <div class="space-y-4">
            <For each={getUserLists()}>
                {(list) => (
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <h3 class="font-semibold text-gray-900 dark:text-white">{list.name}</h3>
                                <p class="text-gray-600 dark:text-gray-400 mt-1">{list.description}</p>
                                <div class="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-500">
                                    <span>{list.itemCount} places</span>
                                    <span>{list.isPublic ? 'Public' : 'Private'}</span>
                                    <Show when={list.likes > 0}>
                                        <span>{list.likes} likes</span>
                                    </Show>
                                </div>
                            </div>
                            <button class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
                                View →
                            </button>
                        </div>
                    </div>
                )}
            </For>
        </div>
    );

    return (
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
                    <div class="flex flex-col md:flex-row gap-6">
                        {/* Avatar Section */}
                        <div class="flex flex-col items-center md:items-start">
                            <div class="relative">
                                <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {profileData().username.charAt(0).toUpperCase()}
                                </div>
                                <button class="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <Camera class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div class="flex-1">
                            <Show
                                when={!isEditing()}
                                fallback={
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                                            <input
                                                type="text"
                                                value={editForm().username}
                                                onInput={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                                            <textarea
                                                value={editForm().bio}
                                                onInput={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                                                rows={3}
                                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                                            <input
                                                type="text"
                                                value={editForm().location}
                                                onInput={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div class="flex gap-2">
                                            <button
                                                onClick={saveProfile}
                                                disabled={updateProfileMutation.isPending}
                                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <Save class="w-4 h-4" />
                                                {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center gap-2"
                                            >
                                                <X class="w-4 h-4" />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                }
                            >
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{profileData().username}</h1>
                                        <div class="flex items-center gap-4 mt-2 text-gray-600 dark:text-gray-400">
                                            <div class="flex items-center gap-1">
                                                <Mail class="w-4 h-4" />
                                                <span class="text-sm">{profileData().email}</span>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <MapPin class="w-4 h-4" />
                                                <span class="text-sm">{profileData().location}</span>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <Calendar class="w-4 h-4" />
                                                <span class="text-sm">Joined {new Date(profileData().joinedDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <p class="text-gray-700 dark:text-gray-300 mt-3">{profileData().bio}</p>
                                    </div>
                                    <button
                                        onClick={startEditing}
                                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <Edit3 class="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                </div>
                            </Show>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div class="bg-white dark:bg-gray-800 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
                    <div class="border-b border-gray-200 dark:border-gray-700">
                        <div class="flex space-x-8 px-6">
                            <For each={tabs}>
                                {(tab) => (
                                    <button
                                        onClick={() => setActiveTab(tab.id)}
                                        class={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab() === tab.id
                                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                )}
                            </For>
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <Show when={activeTab() === 'overview'}>{renderOverview()}</Show>
                <Show when={activeTab() === 'activity'}>{renderActivity()}</Show>
                <Show when={activeTab() === 'lists'}>{renderLists()}</Show>
                <Show when={activeTab() === 'reviews'}>
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Reviews</h3>
                        <p class="text-gray-600 dark:text-gray-400">Your reviews will appear here.</p>
                    </div>
                </Show>
            </div>
        </div>
    );
}