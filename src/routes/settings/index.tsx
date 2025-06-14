import { createEffect, createSignal, For, Show } from 'solid-js';
import { User, Tag, Heart, Users, Camera, MapPin, Calendar, Globe, Bell, Lock, CreditCard, Trash2, Plus, X, Edit3, Save, Mail, Phone, Upload, Image as ImageIcon } from 'lucide-solid';
import { useUpdateProfileMutation, useUploadAvatarMutation, useUserProfileQuery } from '../../lib/api/user';
import { ProcessedProfileData, UserProfileResponse } from '~/lib/api/types';
import { useAuth } from '~/contexts/AuthContext';

interface UserSettingsResponse {
    id?: string;
    fullname?: string;
    email?: string;
    about_you?: string;
    phone?: string;
    profile_image_url?: string;
    [key: string]: any;
}

interface ProcessedSettingsData {
    id?: string;
    firstname?: string;
    lastname?: string;
    city?: string;
    country?: string;
    phone?: string;
    email?: string;
    about_you?: string;
}

export default function SettingsPage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = createSignal(false);
    const [notification, setNotification] = createSignal<{message: string, type: 'success' | 'error'} | null>(null);
    const [activeTab, setActiveTab] = createSignal('settings');
    const uploadAvatarMutation = useUploadAvatarMutation();
    const profileQuery = useUserProfileQuery();
    const updateProfileMutation = useUpdateProfileMutation();
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

    // Tag and Interest management
    const [newTag, setNewTag] = createSignal('');
    const [newInterest, setNewInterest] = createSignal('');
    const [editingTag, setEditingTag] = createSignal<string | null>(null);
    const [editingInterest, setEditingInterest] = createSignal<string | null>(null);
    const [editTagValue, setEditTagValue] = createSignal('');
    const [editInterestValue, setEditInterestValue] = createSignal('');
    const [showAddTagForm, setShowAddTagForm] = createSignal(false);
    const [showAddInterestForm, setShowAddInterestForm] = createSignal(false);
    
    // Mobile UX: Track which tag/interest is actively selected for actions
    const [activeTagForActions, setActiveTagForActions] = createSignal<string | null>(null);
    const [activeInterestForActions, setActiveInterestForActions] = createSignal<string | null>(null);
    
    // Close action menus when clicking outside
    createEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.tag-action-container') && !target.closest('.interest-action-container')) {
                setActiveTagForActions(null);
                setActiveInterestForActions(null);
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
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

    const [availableTags, setAvailableTags] = createSignal([
        'Historic Sites', 'Local Cuisine', 'Museums', 'Photography', 'Walking Tours',
        'Nightlife', 'Shopping', 'Parks', 'Architecture', 'Street Art', 'Markets',
        'Beaches', 'Adventure Sports', 'Cultural Events', 'Religious Sites'
    ]);

    const [availableInterests, setAvailableInterests] = createSignal([
        'Art & Culture', 'Food & Dining', 'History', 'Photography', 'Architecture',
        'Music & Entertainment', 'Outdoor Activities', 'Shopping', 'Nightlife',
        'Nature & Parks', 'Sports', 'Technology', 'Literature', 'Fashion'
    ]);

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

    // Tag management functions
    const addNewTag = () => {
        const tag = newTag().trim();
        if (tag && !availableTags().includes(tag)) {
            setAvailableTags(prev => [...prev, tag]);
            setNewTag('');
            setShowAddTagForm(false);
        }
    };

    const startEditingTag = (tag: string) => {
        setEditingTag(tag);
        setEditTagValue(tag);
    };

    const saveEditedTag = () => {
        const oldTag = editingTag();
        const newTagValue = editTagValue().trim();

        if (oldTag && newTagValue && newTagValue !== oldTag) {
            setAvailableTags(prev => prev.map(tag => tag === oldTag ? newTagValue : tag));
            setSelectedTags(prev => prev.map(tag => tag === oldTag ? newTagValue : tag));
        }

        setEditingTag(null);
        setEditTagValue('');
    };

    const deleteTag = (tagToDelete: string) => {
        if (confirm(`Are you sure you want to delete the tag "${tagToDelete}"?`)) {
            setAvailableTags(prev => prev.filter(tag => tag !== tagToDelete));
            setSelectedTags(prev => prev.filter(tag => tag !== tagToDelete));
        }
    };

    // Interest management functions
    const addNewInterest = () => {
        const interest = newInterest().trim();
        if (interest && !availableInterests().includes(interest)) {
            setAvailableInterests(prev => [...prev, interest]);
            setNewInterest('');
            setShowAddInterestForm(false);
        }
    };

    const startEditingInterest = (interest: string) => {
        setEditingInterest(interest);
        setEditInterestValue(interest);
    };

    const saveEditedInterest = () => {
        const oldInterest = editingInterest();
        const newInterestValue = editInterestValue().trim();

        if (oldInterest && newInterestValue && newInterestValue !== oldInterest) {
            setAvailableInterests(prev => prev.map(interest => interest === oldInterest ? newInterestValue : interest));
            setSelectedInterests(prev => prev.map(interest => interest === oldInterest ? newInterestValue : interest));
        }

        setEditingInterest(null);
        setEditInterestValue('');
    };

    const deleteInterest = (interestToDelete: string) => {
        if (confirm(`Are you sure you want to delete the interest "${interestToDelete}"?`)) {
            setAvailableInterests(prev => prev.filter(interest => interest !== interestToDelete));
            setSelectedInterests(prev => prev.filter(interest => interest !== interestToDelete));
        }
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

    const renderTags = () => (
        <div class="space-y-8">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Travel Tags</h2>
                <p class="text-gray-600 mb-6">Select tags that best describe your travel preferences. These help us personalize your recommendations.</p>

                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    {/* Add New Tag Form */}
                    <div class="mb-6 pb-6 border-b border-gray-200">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="font-semibold text-gray-900">Manage Tags</h4>
                            <Show when={!showAddTagForm()} fallback={
                                <button
                                    onClick={() => {
                                        setShowAddTagForm(false);
                                        setNewTag('');
                                    }}
                                    class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                            }>
                                <button
                                    onClick={() => setShowAddTagForm(true)}
                                    class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                                >
                                    <Plus class="w-4 h-4" />
                                    Add New Tag
                                </button>
                            </Show>
                        </div>

                        <Show when={showAddTagForm()}>
                            <div class="flex gap-2">
                                <input
                                    type="text"
                                    value={newTag()}
                                    onInput={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
                                    placeholder="Enter new tag name..."
                                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                />
                                <button
                                    onClick={addNewTag}
                                    disabled={!newTag().trim()}
                                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                >
                                    Add
                                </button>
                            </div>
                        </Show>
                    </div>

                    <div class="flex flex-wrap gap-3">
                        <For each={availableTags()}>
                            {(tag) => (
                                <Show when={editingTag() === tag} fallback={
                                    <div class="group relative tag-action-container">
                                        <button
                                            onClick={() => {
                                                // On mobile, first tap activates actions, second tap toggles tag
                                                const isMobile = window.innerWidth < 640;
                                                if (isMobile && activeTagForActions() !== tag) {
                                                    setActiveTagForActions(tag);
                                                } else {
                                                    toggleTag(tag);
                                                    setActiveTagForActions(null);
                                                }
                                            }}
                                            class={`px-4 py-2 rounded-full border-2 transition-all duration-200 font-medium relative ${selectedTags().includes(tag)
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                                                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                } ${activeTagForActions() === tag ? 'ring-2 ring-blue-300' : ''}`}
                                        >
                                            {tag}
                                        </button>
                                        
                                        {/* Desktop: Show on hover */}
                                        <div class="hidden sm:block absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div class="flex gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        startEditingTag(tag);
                                                    }}
                                                    class="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center hover:bg-yellow-600 text-xs"
                                                    title="Edit tag"
                                                >
                                                    <Edit3 class="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteTag(tag);
                                                    }}
                                                    class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 text-xs"
                                                    title="Delete tag"
                                                >
                                                    <Trash2 class="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Mobile: Show action buttons below when active */}
                                        <Show when={activeTagForActions() === tag}>
                                            <div class="sm:hidden absolute top-full left-0 right-0 mt-2 z-10">
                                                <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleTag(tag);
                                                            setActiveTagForActions(null);
                                                        }}
                                                        class={`flex-1 px-3 py-2 rounded text-sm font-medium ${selectedTags().includes(tag)
                                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                        }`}
                                                    >
                                                        {selectedTags().includes(tag) ? 'Remove' : 'Select'}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            startEditingTag(tag);
                                                            setActiveTagForActions(null);
                                                        }}
                                                        class="px-3 py-2 bg-yellow-100 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteTag(tag);
                                                            setActiveTagForActions(null);
                                                        }}
                                                        class="px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </Show>
                                    </div>
                                }>
                                    <div class="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editTagValue()}
                                            onInput={(e) => setEditTagValue(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && saveEditedTag()}
                                            class="px-3 py-1 border border-gray-300 rounded text-sm"
                                        />
                                        <button
                                            onClick={saveEditedTag}
                                            class="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                        >
                                            <Save class="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingTag(null);
                                                setEditTagValue('');
                                            }}
                                            class="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                                        >
                                            <X class="w-3 h-3" />
                                        </button>
                                    </div>
                                </Show>
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
                    {/* Add New Interest Form */}
                    <div class="mb-6 pb-6 border-b border-gray-200">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="font-semibold text-gray-900">Manage Interests</h4>
                            <Show when={!showAddInterestForm()} fallback={
                                <button
                                    onClick={() => {
                                        setShowAddInterestForm(false);
                                        setNewInterest('');
                                    }}
                                    class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                            }>
                                <button
                                    onClick={() => setShowAddInterestForm(true)}
                                    class="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                                >
                                    <Plus class="w-4 h-4" />
                                    Add New Interest
                                </button>
                            </Show>
                        </div>

                        <Show when={showAddInterestForm()}>
                            <div class="flex gap-2">
                                <input
                                    type="text"
                                    value={newInterest()}
                                    onInput={(e) => setNewInterest(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addNewInterest()}
                                    placeholder="Enter new interest name..."
                                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button
                                    onClick={addNewInterest}
                                    disabled={!newInterest().trim()}
                                    class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                >
                                    Add
                                </button>
                            </div>
                        </Show>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <For each={availableInterests()}>
                            {(interest) => (
                                <Show when={editingInterest() === interest} fallback={
                                    <div class="group relative interest-action-container">
                                        <button
                                            onClick={() => {
                                                // On mobile, first tap activates actions, second tap toggles interest
                                                const isMobile = window.innerWidth < 640;
                                                if (isMobile && activeInterestForActions() !== interest) {
                                                    setActiveInterestForActions(interest);
                                                } else {
                                                    toggleInterest(interest);
                                                    setActiveInterestForActions(null);
                                                }
                                            }}
                                            class={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${selectedInterests().includes(interest)
                                                ? 'bg-purple-50 border-purple-500 shadow-md'
                                                : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                                                } ${activeInterestForActions() === interest ? 'ring-2 ring-purple-300' : ''}`}
                                        >
                                            <div class="flex items-center justify-between">
                                                <span class="font-medium text-gray-900 text-sm">{interest}</span>
                                                <Show when={selectedInterests().includes(interest)}>
                                                    <Heart class="w-4 h-4 text-purple-600 fill-current" />
                                                </Show>
                                            </div>
                                        </button>
                                        
                                        {/* Desktop: Show on hover */}
                                        <div class="hidden sm:block absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div class="flex gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        startEditingInterest(interest);
                                                    }}
                                                    class="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center hover:bg-yellow-600 text-xs"
                                                    title="Edit interest"
                                                >
                                                    <Edit3 class="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteInterest(interest);
                                                    }}
                                                    class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 text-xs"
                                                    title="Delete interest"
                                                >
                                                    <Trash2 class="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Mobile: Show action buttons below when active */}
                                        <Show when={activeInterestForActions() === interest}>
                                            <div class="sm:hidden absolute top-full left-0 right-0 mt-2 z-10">
                                                <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleInterest(interest);
                                                            setActiveInterestForActions(null);
                                                        }}
                                                        class={`flex-1 px-3 py-2 rounded text-sm font-medium ${selectedInterests().includes(interest)
                                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                        }`}
                                                    >
                                                        {selectedInterests().includes(interest) ? 'Remove' : 'Select'}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            startEditingInterest(interest);
                                                            setActiveInterestForActions(null);
                                                        }}
                                                        class="px-3 py-2 bg-yellow-100 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteInterest(interest);
                                                            setActiveInterestForActions(null);
                                                        }}
                                                        class="px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </Show>
                                    </div>
                                }>
                                    <div class="p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
                                        <div class="flex items-center gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={editInterestValue()}
                                                onInput={(e) => setEditInterestValue(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && saveEditedInterest()}
                                                class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                        <div class="flex gap-2">
                                            <button
                                                onClick={saveEditedInterest}
                                                class="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center gap-1"
                                            >
                                                <Save class="w-3 h-3" />
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingInterest(null);
                                                    setEditInterestValue('');
                                                }}
                                                class="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 flex items-center gap-1"
                                            >
                                                <X class="w-3 h-3" />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </Show>
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
            {/* Mobile-friendly notification */}
            <Show when={notification()}>
                <div class={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 p-4 rounded-lg shadow-lg border ${
                    notification()?.type === 'success' 
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