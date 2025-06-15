import { createEffect, createSignal, For, Show } from 'solid-js';
import { User, Tag, Heart, Users, Camera, MapPin, Calendar, Globe, Bell, Lock, CreditCard, Trash2, Plus, X, Edit3, Save, Mail, Phone, Upload, Image as ImageIcon } from 'lucide-solid';
import { useUpdateProfileMutation, useUploadAvatarMutation, useUserProfileQuery } from '../../lib/api/user';
import { useTags, useCreateTagMutation, useUpdateTagMutation, useDeleteTagMutation, useToggleTagActiveMutation } from '../../lib/api/tags';
import { useInterests, useCreateInterestMutation, useUpdateInterestMutation, useDeleteInterestMutation, useToggleInterestActiveMutation } from '../../lib/api/interests';
import { ProcessedProfileData, UserProfileResponse, PersonalTag, Interest } from '~/lib/api/types';
import { useAuth } from '~/contexts/AuthContext';
import TagsComponent from '@/components/features/Settings/Tags';
import InterestsComponent from '@/components/features/Settings/Interests';
import TravelProfiles from '@/components/features/Settings/TravelProfiles';

export default function SettingsPage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = createSignal(false);
    const [notification, setNotification] = createSignal<{ message: string, type: 'success' | 'error' } | null>(null);
    const [activeTab, setActiveTab] = createSignal('settings');
    const uploadAvatarMutation = useUploadAvatarMutation();
    const profileQuery = useUserProfileQuery();
    const updateProfileMutation = useUpdateProfileMutation();

    // Tags API hooks
    const tagsQuery = useTags();
    const createTagMutation = useCreateTagMutation();
    const updateTagMutation = useUpdateTagMutation();
    const deleteTagMutation = useDeleteTagMutation();
    const toggleTagActiveMutation = useToggleTagActiveMutation();

    // Interests API hooks  
    const interestsQuery = useInterests();
    const createInterestMutation = useCreateInterestMutation();
    const updateInterestMutation = useUpdateInterestMutation();
    const deleteInterestMutation = useDeleteInterestMutation();
    const toggleInterestActiveMutation = useToggleInterestActiveMutation();
    const [userProfile, setUserProfile] = createSignal({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '', // Optional: keep if API supports it, omit if not
        city: '',
        country: '',
        bio: '',
        avatar: ''
    });

    const userData = user();


    createEffect(() => {
        const apiData = profileQuery.data;
        if (!apiData && !userData) return null;
        console.log('userData', userData);
        console.log('apiData', apiData);

        if (apiData) {
            setUserProfile({
                username: apiData.username || userData?.username || '',
                firstname: apiData.firstname || userData?.firstname || '',
                lastname: apiData.lastname || userData?.lastname || '',
                email: apiData.email || userData?.email || '',
                phone: apiData.phone || '', // Optional: include if API provides it
                city: apiData.city || userData?.city || '',
                country: apiData.country || userData?.country || '',
                bio: apiData.about_you || userData?.about_you || '',
                avatar: apiData.profile_image_url || userData?.profile_image_url || ''
            });
        }
    });

    const saveProfile = async () => {
        try {
            const profileData = userProfile();
            const profileUpdateData = {
                firstname: profileData.firstname,
                lastname: profileData.lastname,
                email: profileData.email,
                phone: profileData.phone,
                city: profileData.city,
                country: profileData.country,
                about_you: profileData.bio
                // Note: avatar is handled separately via uploadAvatarMutation
            };

            await updateProfileMutation.mutateAsync(profileUpdateData);
            await profileQuery.refetch(); // Sync UI with backend

            // Show success notification
            setNotification({ message: 'Settings saved successfully!', type: 'success' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Failed to update profile:', error);
            // Show error notification
            setNotification({
                message: error?.message || 'Failed to save settings. Please try again.',
                type: 'error'
            });
            setTimeout(() => setNotification(null), 5000);
        }
    };

    const profileData = (): ProcessedProfileData | null => {
        const apiData: UserProfileResponse | undefined = profileQuery.data;
        const userData = user();

        if (!apiData && !userData) return null;

        return {
            id: apiData?.id || userData?.id,
            username: apiData?.username || userData?.username,
            email: userData?.email || apiData?.email,
            bio: apiData?.about_you || (userData as any)?.about_you,
            location: apiData?.location || (userData as any)?.location,
            joinedDate: apiData?.created_at || userData?.created_at,
            avatar: apiData?.profile_image_url || userData?.profile_image_url,
            interests: apiData?.interests || ['Architecture', 'Food & Dining', 'Museums', 'Photography'],
            // Temporary hardcoded data for UI purposes
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
        const profile = profileData();
        setEditForm({
            username: profile?.username || '',
            bio: profile?.bio || '',
            location: profile?.location || ''
        });
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
    };


    const [photoPreview, setPhotoPreview] = createSignal<string | null>(null);
    const [isUploading, setIsUploading] = createSignal(false);



    const tabs = [
        { id: 'settings', label: 'Settings', icon: User },
        { id: 'tags', label: 'Tags', icon: Tag },
        { id: 'interests', label: 'Interests', icon: Heart },
        { id: 'profiles', label: 'Travel Profiles', icon: Users }
    ];

    // Get tags from API
    const tags = () => tagsQuery.data || [];

    // Get interests from API
    const interests = () => interestsQuery.data || [];


    const updateProfile = (field: any, value: any) => {
        setUserProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleFileSelect = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setPhotoPreview(e.target?.result as string);
            reader.readAsDataURL(file);
            uploadPhoto(file);
        } else {
            setNotification({ message: 'Please select a valid image file', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        }

    };

    const uploadPhoto = async (file: File) => {
        setIsUploading(true);
        try {
            const result = await uploadAvatarMutation.mutateAsync(file);
            //updateProfile('avatar', result.avatar_url);
            setUserProfile(prev => ({ ...prev, avatar: result.avatar_url }));
            await profileQuery.refetch();

            // Show success notification
            setNotification({ message: 'Profile photo updated successfully!', type: 'success' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Photo upload failed:', error);
            setNotification({
                message: error?.message || 'Photo upload failed. Please try again.',
                type: 'error'
            });
            setTimeout(() => setNotification(null), 5000);
            setPhotoPreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = () => {
        const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
        fileInput?.click();
    };


    const renderSettings = () => (
        <div class="space-y-8">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>

                {/* Profile Picture */}
                <div class="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        <div class="relative">
                            <Show
                                when={photoPreview() || userProfile().avatar}
                                fallback={
                                    <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                                        {(userProfile().firstname[0] || '') + (userProfile().lastname[0] || '') || userProfile().username[0] || ''}
                                    </div>
                                }
                            >
                                <img
                                    src={photoPreview() || userProfile().avatar}
                                    alt="Profile"
                                    class="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200"
                                />
                            </Show>
                            <button
                                onClick={triggerFileInput}
                                disabled={isUploading()}
                                class="absolute -bottom-1 -right-1 bg-white border-2 border-gray-200 rounded-full p-1 sm:p-1.5 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <Show when={isUploading()} fallback={<Camera class="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />}>
                                    <div class="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                                </Show>
                            </button>
                        </div>
                        <div class="text-center sm:text-left">
                            <h3 class="text-base sm:text-lg font-semibold text-gray-900">Profile Photo</h3>
                            <p class="text-xs sm:text-sm text-gray-500">
                                {isUploading() ? 'Uploading...' : 'Update your profile picture'}
                            </p>
                            <div class="flex flex-col sm:flex-row gap-2 mt-2">
                                <button
                                    onClick={triggerFileInput}
                                    disabled={isUploading()}
                                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium flex items-center gap-2 justify-center"
                                >
                                    <Show when={isUploading()} fallback={<Upload class="w-3 h-3 sm:w-4 sm:h-4" />}>
                                        <div class="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </Show>
                                    {isUploading() ? 'Uploading...' : 'Upload Photo'}
                                </button>
                                <Show when={photoPreview() || userProfile().avatar}>
                                    <button
                                        onClick={() => {
                                            setPhotoPreview(null);
                                            updateProfile('avatar', null);
                                        }}
                                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-xs sm:text-sm font-medium"
                                    >
                                        Remove Photo
                                    </button>
                                </Show>
                            </div>
                        </div>
                    </div>
                    <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        class="hidden"
                    />
                </div>

                {/* Personal Information */}
                <div class="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Personal Information</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div class="pb-2">
                            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Username</label>
                            <input
                                type="text"
                                value={userProfile().username}
                                onInput={(e) => updateProfile('username', e.target.value)}
                                class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                            />
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">First Name</label>
                            <input
                                type="text"
                                value={userProfile().firstname}
                                onInput={(e) => updateProfile('firstname', e.target.value)}
                                class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Last Name</label>
                            <input
                                type="text"
                                value={userProfile().lastname}
                                onInput={(e) => updateProfile('lastname', e.target.value)}
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
                            <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <div class="relative">
                                <MapPin class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={userProfile().city}
                                    onInput={(e) => updateProfile('city', e.target.value)}
                                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                            <div class="relative">
                                <MapPin class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={userProfile().country}
                                    onInput={(e) => updateProfile('country', e.target.value)}
                                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div class="sm:col-span-2">
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
                        <button
                            onClick={saveProfile}
                            disabled={updateProfileMutation.isPending}
                            class="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 text-sm sm:text-base"
                        >
                            <Save class="w-3 h-3 sm:w-4 sm:h-4" />
                            {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTags = () => {
        return (
            <TagsComponent
                tags={tags()}
                isLoading={tagsQuery.isLoading}
                isError={tagsQuery.isError}
                onRetry={() => tagsQuery.refetch()}
                onCreateTag={async (data) => {
                    await createTagMutation.mutateAsync(data);
                    setNotification({ message: 'Tag created successfully!', type: 'success' });
                    setTimeout(() => setNotification(null), 3000);
                }}
                onUpdateTag={async (data) => {
                    await updateTagMutation.mutateAsync(data);
                    setNotification({ message: 'Tag updated successfully!', type: 'success' });
                    setTimeout(() => setNotification(null), 3000);
                }}
                onDeleteTag={async (tag) => {
                    if (tag.source === 'global') {
                        setNotification({
                            message: 'Global tags cannot be deleted.',
                            type: 'error'
                        });
                        setTimeout(() => setNotification(null), 3000);
                        return;
                    }

                    if (confirm(`Are you sure you want to delete the tag "${tag.name}"?`)) {
                        await deleteTagMutation.mutateAsync(tag.id);
                        setNotification({ message: 'Tag deleted successfully!', type: 'success' });
                        setTimeout(() => setNotification(null), 3000);
                    }
                }}
                onToggleActive={async (tag) => {
                    const currentActive = tag.active ?? false;
                    await toggleTagActiveMutation.mutateAsync({
                        id: tag.id,
                        active: !currentActive
                    });
                    setNotification({
                        message: `Tag ${!currentActive ? 'activated' : 'deactivated'} successfully!`,
                        type: 'success'
                    });
                    setTimeout(() => setNotification(null), 3000);
                }}
                isCreating={createTagMutation.isPending}
                isUpdating={updateTagMutation.isPending}
                isDeleting={deleteTagMutation.isPending}
                isToggling={toggleTagActiveMutation.isPending}
            />
        );
    };

    const renderInterests = () => {
        return (
            <InterestsComponent
                interests={interests()}
                isLoading={interestsQuery.isLoading}
                isError={interestsQuery.isError}
                onRetry={() => interestsQuery.refetch()}
                onCreateInterest={async (data) => {
                    await createInterestMutation.mutateAsync(data);
                    setNotification({ message: 'Interest created successfully!', type: 'success' });
                    setTimeout(() => setNotification(null), 3000);
                }}
                onUpdateInterest={async (data) => {
                    await updateInterestMutation.mutateAsync(data);
                    setNotification({ message: 'Interest updated successfully!', type: 'success' });
                    setTimeout(() => setNotification(null), 3000);
                }}
                onDeleteInterest={async (interest) => {
                    if (interest.source === 'global') {
                        setNotification({
                            message: 'Global interests cannot be deleted.',
                            type: 'error'
                        });
                        setTimeout(() => setNotification(null), 3000);
                        return;
                    }

                    if (confirm(`Are you sure you want to delete the interest "${interest.name}"?`)) {
                        await deleteInterestMutation.mutateAsync(interest.id);
                        setNotification({ message: 'Interest deleted successfully!', type: 'success' });
                        setTimeout(() => setNotification(null), 3000);
                    }
                }}
                onToggleActive={async (interest) => {
                    const currentActive = interest.active ?? false;
                    await toggleInterestActiveMutation.mutateAsync({
                        id: interest.id,
                        active: !currentActive
                    });
                    setNotification({
                        message: `Interest ${!currentActive ? 'activated' : 'deactivated'} successfully!`,
                        type: 'success'
                    });
                    setTimeout(() => setNotification(null), 3000);
                }}
                isCreating={createInterestMutation.isPending}
                isUpdating={updateInterestMutation.isPending}
                isDeleting={deleteInterestMutation.isPending}
                isToggling={toggleInterestActiveMutation.isPending}
            />
        );
    };

    const renderProfiles = () => (
        <TravelProfiles 
            onNotification={(notification) => {
                setNotification(notification);
                setTimeout(() => setNotification(null), 3000);
            }}
        />
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
            {/* Mobile-friendly notification */}
            <Show when={notification()}>
                <div class={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 p-4 rounded-lg shadow-lg border ${notification()?.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700'
                    } animate-in slide-in-from-top-2 duration-300`}>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">{notification()?.message}</span>
                        <button
                            onClick={() => setNotification(null)}
                            class="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </Show>

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