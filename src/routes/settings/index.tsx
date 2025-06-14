import { createEffect, createSignal, For, Show } from 'solid-js';
import { User, Tag, Heart, Users, Camera, MapPin, Calendar, Globe, Bell, Lock, CreditCard, Trash2, Plus, X, Edit3, Save, Mail, Phone, Upload, Image as ImageIcon } from 'lucide-solid';
import { useUpdateProfileMutation, useUploadAvatarMutation, useUserProfileQuery } from '../../lib/api/user';
import { useTags, useCreateTagMutation, useUpdateTagMutation, useDeleteTagMutation, useToggleTagActiveMutation } from '../../lib/api/tags';
import { useInterests, useCreateInterestMutation, useUpdateInterestMutation, useDeleteInterestMutation, useToggleInterestActiveMutation } from '../../lib/api/interests';
import { ProcessedProfileData, UserProfileResponse, PersonalTag, Interest } from '~/lib/api/types';
import { useAuth } from '~/contexts/AuthContext';

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

    // Tag management
    const [newTagName, setNewTagName] = createSignal('');
    const [newTagDescription, setNewTagDescription] = createSignal('');
    const [newTagType, setNewTagType] = createSignal('');
    const [editingTag, setEditingTag] = createSignal<PersonalTag | null>(null);
    const [editTagName, setEditTagName] = createSignal('');
    const [editTagDescription, setEditTagDescription] = createSignal('');
    const [editTagType, setEditTagType] = createSignal('');
    const [showAddTagForm, setShowAddTagForm] = createSignal(false);

    // Interest management
    const [newInterest, setNewInterest] = createSignal('');
    const [newInterestDescription, setNewInterestDescription] = createSignal('');
    const [editingInterest, setEditingInterest] = createSignal<Interest | null>(null);
    const [editInterestName, setEditInterestName] = createSignal('');
    const [editInterestDescription, setEditInterestDescription] = createSignal('');
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

    const tabs = [
        { id: 'settings', label: 'Settings', icon: User },
        { id: 'tags', label: 'Tags', icon: Tag },
        { id: 'interests', label: 'Interests', icon: Heart },
        { id: 'profiles', label: 'Profiles', icon: Users }
    ];

    // Get tags from API
    const tags = () => tagsQuery.data || [];

    // Get interests from API
    const interests = () => interestsQuery.data || [];
    const activeInterests = () => interests().filter(interest => interest.active ?? false);

    // Toggle tag active status
    const toggleTagActive = async (tag: PersonalTag) => {
        try {
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
        } catch (error: any) {
            console.error('Failed to toggle tag:', error);
            setNotification({
                message: error?.message || 'Failed to update tag. Please try again.',
                type: 'error'
            });
            setTimeout(() => setNotification(null), 5000);
        }
    };

    // Toggle interest active status
    const toggleInterestActive = async (interest: Interest) => {
        try {
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
        } catch (error: any) {
            console.error('Failed to toggle interest:', error);
            setNotification({
                message: error?.message || 'Failed to update interest. Please try again.',
                type: 'error'
            });
            setTimeout(() => setNotification(null), 5000);
        }
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
    const addNewTag = async () => {
        const name = newTagName().trim();
        const description = newTagDescription().trim();
        const tag_type = newTagType().trim();

        if (name && description && tag_type) {
            try {
                await createTagMutation.mutateAsync({
                    name,
                    description,
                    tag_type
                });
                setNewTagName('');
                setNewTagDescription('');
                setNewTagType('');
                setShowAddTagForm(false);
                setNotification({ message: 'Tag created successfully!', type: 'success' });
                setTimeout(() => setNotification(null), 3000);
            } catch (error) {
                console.error('Failed to create tag:', error);
                setNotification({
                    message: error?.message || 'Failed to create tag. Please try again.',
                    type: 'error'
                });
                setTimeout(() => setNotification(null), 5000);
            }
        }
    };

    const startEditingTag = (tag: PersonalTag) => {
        setEditingTag(tag);
        setEditTagName(tag.name);
        setEditTagDescription(tag.description || '');
        setEditTagType(tag.tag_type);
    };

    const saveEditedTag = async () => {
        const tag = editingTag();
        const name = editTagName().trim();
        const description = editTagDescription().trim();
        const tag_type = editTagType().trim();

        if (tag && name && description && tag_type) {
            try {
                await updateTagMutation.mutateAsync({
                    id: tag.id,
                    name,
                    description,
                    tag_type
                });
                setEditingTag(null);
                setEditTagName('');
                setEditTagDescription('');
                setEditTagType('');
                setNotification({ message: 'Tag updated successfully!', type: 'success' });
                setTimeout(() => setNotification(null), 3000);
            } catch (error) {
                console.error('Failed to update tag:', error);
                setNotification({
                    message: error?.message || 'Failed to update tag. Please try again.',
                    type: 'error'
                });
                setTimeout(() => setNotification(null), 5000);
            }
        }
    };

    const deleteTag = async (tag: PersonalTag) => {
        if (tag.source === 'global') {
            setNotification({
                message: 'Global tags cannot be deleted.',
                type: 'error'
            });
            setTimeout(() => setNotification(null), 3000);
            return;
        }

        if (confirm(`Are you sure you want to delete the tag "${tag.name}"?`)) {
            try {
                await deleteTagMutation.mutateAsync(tag.id);
                setNotification({ message: 'Tag deleted successfully!', type: 'success' });
                setTimeout(() => setNotification(null), 3000);
            } catch (error) {
                console.error('Failed to delete tag:', error);
                setNotification({
                    message: error?.message || 'Failed to delete tag. Please try again.',
                    type: 'error'
                });
                setTimeout(() => setNotification(null), 5000);
            }
        }
    };

    // Interest management functions
    const addNewInterest = async () => {
        const name = newInterest().trim();
        const description = newInterestDescription().trim();

        if (name) {
            try {
                await createInterestMutation.mutateAsync({
                    name,
                    description,
                    active: true
                });
                setNewInterest('');
                setNewInterestDescription('');
                setShowAddInterestForm(false);
                setNotification({ message: 'Interest created successfully!', type: 'success' });
                setTimeout(() => setNotification(null), 3000);
            } catch (error: any) {
                console.error('Failed to create interest:', error);
                setNotification({
                    message: error?.message || 'Failed to create interest. Please try again.',
                    type: 'error'
                });
                setTimeout(() => setNotification(null), 5000);
            }
        }
    };

    const startEditingInterest = (interest: Interest) => {
        setEditingInterest(interest);
        setEditInterestName(interest.name);
        setEditInterestDescription(interest.description || '');
    };

    const saveEditedInterest = async () => {
        const interest = editingInterest();
        const name = editInterestName().trim();
        const description = editInterestDescription().trim();

        if (interest && name) {
            try {
                await updateInterestMutation.mutateAsync({
                    id: interest.id,
                    name,
                    description
                });
                setEditingInterest(null);
                setEditInterestName('');
                setEditInterestDescription('');
                setNotification({ message: 'Interest updated successfully!', type: 'success' });
                setTimeout(() => setNotification(null), 3000);
            } catch (error: any) {
                console.error('Failed to update interest:', error);
                setNotification({
                    message: error?.message || 'Failed to update interest. Please try again.',
                    type: 'error'
                });
                setTimeout(() => setNotification(null), 5000);
            }
        }
    };

    const deleteInterest = async (interest: Interest) => {
        if (interest.source === 'global') {
            setNotification({
                message: 'Global interests cannot be deleted.',
                type: 'error'
            });
            setTimeout(() => setNotification(null), 3000);
            return;
        }

        if (confirm(`Are you sure you want to delete the interest "${interest.name}"?`)) {
            try {
                await deleteInterestMutation.mutateAsync(interest.id);
                setNotification({ message: 'Interest deleted successfully!', type: 'success' });
                setTimeout(() => setNotification(null), 3000);
            } catch (error: any) {
                console.error('Failed to delete interest:', error);
                setNotification({
                    message: error?.message || 'Failed to delete interest. Please try again.',
                    type: 'error'
                });
                setTimeout(() => setNotification(null), 5000);
            }
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

    const renderTags = () => {
        // Show loading state while fetching tags
        if (tagsQuery.isLoading) {
            return (
                <div class="space-y-8">
                    <div class="flex items-center justify-center py-12">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            );
        }

        // Show error state if tags fetch failed
        if (tagsQuery.isError) {
            return (
                <div class="space-y-8">
                    <div class="text-center py-12">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Error Loading Tags</h3>
                        <p class="text-gray-600 mb-4">Unable to load tags. Please try again.</p>
                        <button
                            onClick={() => tagsQuery.refetch()}
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div class="space-y-8">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Travel Tags</h2>
                    <p class="text-gray-600 mb-6">Manage your personal tags and activate/deactivate both global and personal tags to personalize your travel recommendations.</p>

                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                        {/* Add New Tag Form */}
                        <div class="mb-6 pb-6 border-b border-gray-200">
                            <div class="flex items-center justify-between mb-3">
                                <h4 class="font-semibold text-gray-900">Manage Tags</h4>
                                <Show when={!showAddTagForm()} fallback={
                                    <button
                                        onClick={() => {
                                            setShowAddTagForm(false);
                                            setNewTagName('');
                                            setNewTagDescription('');
                                            setNewTagType('');
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
                                <div class="space-y-3">
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <input
                                            type="text"
                                            value={newTagName()}
                                            onInput={(e) => setNewTagName(e.target.value)}
                                            placeholder="Tag name..."
                                            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={newTagType()}
                                            onInput={(e) => setNewTagType(e.target.value)}
                                            placeholder="Tag type (e.g., atmosphere, cuisine)..."
                                            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                        />
                                        <button
                                            onClick={addNewTag}
                                            disabled={!newTagName().trim() || !newTagDescription().trim() || !newTagType().trim() || createTagMutation.isPending}
                                            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                        >
                                            {createTagMutation.isPending ? 'Adding...' : 'Add'}
                                        </button>
                                    </div>
                                    <textarea
                                        value={newTagDescription()}
                                        onInput={(e) => setNewTagDescription(e.target.value)}
                                        placeholder="Tag description..."
                                        rows={2}
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                    />
                                </div>
                            </Show>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <For each={tags()}>
                                {(tag) => (
                                    <Show when={editingTag()?.id === tag.id} fallback={
                                        <div class="group relative tag-action-container">
                                            <div
                                                onClick={() => {
                                                    // On mobile, tap to activate actions for personal tags
                                                    if (tag.source === 'personal' && window.innerWidth < 640) {
                                                        setActiveTagForActions(activeTagForActions() === tag.id ? null : tag.id);
                                                    }
                                                }}
                                                class={`p-4 rounded-lg border-2 transition-all duration-200 ${(tag.active ?? false)
                                                    ? (tag.source === 'global')
                                                        ? 'bg-blue-50 border-blue-200'
                                                        : 'bg-green-50 border-green-200'
                                                    : 'bg-gray-50 border-gray-200 opacity-60'
                                                    } ${tag.source === 'personal' ? 'hover:border-blue-300 cursor-pointer' : ''} ${activeTagForActions() === tag.id ? 'ring-2 ring-blue-300' : ''}`}>
                                                <div class="flex items-start justify-between mb-2">
                                                    <div class="flex items-center gap-2">
                                                        <h4 class="font-medium text-gray-900">{tag.name}</h4>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleTagActive(tag);
                                                            }}
                                                            disabled={toggleTagActiveMutation.isPending}
                                                            class={`w-10 h-5 rounded-full relative transition-colors duration-200 ${(tag.active ?? false) ? 'bg-green-500' : 'bg-gray-300'
                                                                } ${toggleTagActiveMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                            title={`${(tag.active ?? false) ? 'Deactivate' : 'Activate'} tag`}
                                                        >
                                                            <div class={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${(tag.active ?? false) ? 'translate-x-5' : 'translate-x-0.5'
                                                                }`} />
                                                        </button>
                                                    </div>
                                                    <div class="flex items-center gap-2">
                                                        <Show when={tag.source === 'global'}>
                                                            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Global</span>
                                                        </Show>
                                                        <span class={`px-2 py-1 rounded-full text-xs font-medium ${(tag.active ?? false)
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {(tag.active ?? false) ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p class="text-sm text-gray-600 mb-2">{tag.description || 'No description'}</p>
                                                <div class="text-xs text-gray-500">
                                                    Type: <span class="font-medium">{tag.tag_type}</span>
                                                </div>
                                            </div>

                                            {/* Actions for personal tags only */}
                                            <Show when={tag.source === 'personal'}>
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
                                                <Show when={activeTagForActions() === tag.id}>
                                                    <div class="sm:hidden absolute top-full left-0 right-0 mt-2 z-10">
                                                        <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-2 space-y-2">
                                                            <div class="flex gap-2">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleTagActive(tag);
                                                                        setActiveTagForActions(null);
                                                                    }}
                                                                    disabled={toggleTagActiveMutation.isPending}
                                                                    class={`flex-1 px-3 py-2 rounded text-sm font-medium ${(tag.active ?? false)
                                                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                        } ${toggleTagActiveMutation.isPending ? 'opacity-50' : ''}`}
                                                                >
                                                                    {(tag.active ?? false) ? 'Deactivate' : 'Activate'}
                                                                </button>
                                                            </div>
                                                            <Show when={tag.source === 'personal'}>
                                                                <div class="flex gap-2">
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
                                                            </Show>
                                                        </div>
                                                    </div>
                                                </Show>
                                            </Show>
                                        </div>
                                    }>
                                        <div class="p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
                                            <div class="space-y-3">
                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        value={editTagName()}
                                                        onInput={(e) => setEditTagName(e.target.value)}
                                                        placeholder="Tag name..."
                                                        class="px-3 py-2 border border-gray-300 rounded text-sm"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editTagType()}
                                                        onInput={(e) => setEditTagType(e.target.value)}
                                                        placeholder="Tag type..."
                                                        class="px-3 py-2 border border-gray-300 rounded text-sm"
                                                    />
                                                </div>
                                                <textarea
                                                    value={editTagDescription()}
                                                    onInput={(e) => setEditTagDescription(e.target.value)}
                                                    placeholder="Tag description..."
                                                    rows={2}
                                                    class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                                />
                                                <div class="flex gap-2">
                                                    <button
                                                        onClick={saveEditedTag}
                                                        disabled={updateTagMutation.isPending}
                                                        class="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1 disabled:opacity-50"
                                                    >
                                                        <Save class="w-3 h-3" />
                                                        {updateTagMutation.isPending ? 'Saving...' : 'Save'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingTag(null);
                                                            setEditTagName('');
                                                            setEditTagDescription('');
                                                            setEditTagType('');
                                                        }}
                                                        class="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 flex items-center gap-1"
                                                    >
                                                        <X class="w-3 h-3" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Show>
                                )}
                            </For>
                        </div>

                        <Show when={tags().length === 0}>
                            <div class="text-center py-8">
                                <p class="text-gray-500">No tags found. Create your first tag above!</p>
                            </div>
                        </Show>

                        {/* Active Tags Summary */}
                        <Show when={tags().length > 0}>
                            <div class="mt-8 pt-6 border-t border-gray-200">
                                <h4 class="font-semibold text-gray-900 mb-4">Active Tags ({tags().filter(tag => tag.active ?? false).length})</h4>
                                <Show when={tags().filter(tag => tag.active ?? false).length === 0}>
                                    <p class="text-gray-500 text-sm">No active tags. Activate some tags above to see them here.</p>
                                </Show>
                                <Show when={tags().filter(tag => tag.active ?? false).length > 0}>
                                    <div class="flex flex-wrap gap-2">
                                        <For each={tags().filter(tag => tag.active ?? false)}>
                                            {(tag) => (
                                                <span class={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${tag.source === 'global'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {tag.name}
                                                    <span class="text-xs opacity-75">({tag.tag_type})</span>
                                                </span>
                                            )}
                                        </For>
                                    </div>
                                </Show>
                            </div>
                        </Show>
                    </div>
                </div>
            </div>
        );
    };

    const renderInterests = () => {
        // Show loading state while fetching interests
        if (interestsQuery.isLoading) {
            return (
                <div class="space-y-8">
                    <div class="flex items-center justify-center py-12">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                </div>
            );
        }

        // Show error state if interests fetch failed
        if (interestsQuery.isError) {
            return (
                <div class="space-y-8">
                    <div class="text-center py-12">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Error Loading Interests</h3>
                        <p class="text-gray-600 mb-4">Unable to load interests. Please try again.</p>
                        <button
                            onClick={() => interestsQuery.refetch()}
                            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div class="space-y-8">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Travel Interests</h2>
                    <p class="text-gray-600 mb-6">Manage your personal interests and activate/deactivate both global and custom interests to personalize your travel recommendations.</p>

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
                                            setNewInterestDescription('');
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
                                <div class="space-y-3">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={newInterest()}
                                            onInput={(e) => setNewInterest(e.target.value)}
                                            placeholder="Interest name..."
                                            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                        />
                                        <button
                                            onClick={addNewInterest}
                                            disabled={!newInterest().trim() || createInterestMutation.isPending}
                                            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                        >
                                            {createInterestMutation.isPending ? 'Adding...' : 'Add'}
                                        </button>
                                    </div>
                                    <textarea
                                        value={newInterestDescription()}
                                        onInput={(e) => setNewInterestDescription(e.target.value)}
                                        placeholder="Interest description (optional)..."
                                        rows={2}
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    />
                                </div>
                            </Show>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <For each={interests()}>
                                {(interest) => (
                                    <Show when={editingInterest()?.id === interest.id} fallback={
                                        <div class="group relative interest-action-container">
                                            <div
                                                onClick={() => {
                                                    // On mobile, tap to activate actions for custom interests
                                                    if (interest.source === 'custom' && window.innerWidth < 640) {
                                                        setActiveInterestForActions(activeInterestForActions() === interest.id ? null : interest.id);
                                                    }
                                                }}
                                                class={`p-4 rounded-lg border-2 transition-all duration-200 ${(interest.active ?? false)
                                                    ? (interest.source === 'global')
                                                        ? 'bg-blue-50 border-blue-200'
                                                        : 'bg-purple-50 border-purple-200'
                                                    : 'bg-gray-50 border-gray-200 opacity-60'
                                                    } ${interest.source === 'custom' ? 'hover:border-purple-300 cursor-pointer' : ''} ${activeInterestForActions() === interest.id ? 'ring-2 ring-purple-300' : ''}`}
                                            >
                                                <div class="flex items-start justify-between mb-2">
                                                    <div class="flex items-center gap-2">
                                                        <h4 class="font-medium text-gray-900">{interest.name}</h4>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleInterestActive(interest);
                                                            }}
                                                            disabled={toggleInterestActiveMutation.isPending}
                                                            class={`w-10 h-5 rounded-full relative transition-colors duration-200 ${(interest.active ?? false) ? 'bg-purple-500' : 'bg-gray-300'
                                                                } ${toggleInterestActiveMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                            title={`${(interest.active ?? false) ? 'Deactivate' : 'Activate'} interest`}
                                                        >
                                                            <div class={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${(interest.active ?? false) ? 'translate-x-5' : 'translate-x-0.5'
                                                                }`} />
                                                        </button>
                                                    </div>
                                                    <div class="flex items-center gap-2">
                                                        <Show when={interest.source === 'global'}>
                                                            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Global</span>
                                                        </Show>
                                                        <span class={`px-2 py-1 rounded-full text-xs font-medium ${(interest.active ?? false)
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {(interest.active ?? false) ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Show when={interest.description}>
                                                    <p class="text-sm text-gray-600 mb-2">{interest.description || 'No description'}</p>
                                                </Show>
                                            </div>

                                            {/* Actions for custom interests only */}
                                            <Show when={interest.source === 'custom'}>
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
                                                <Show when={activeInterestForActions() === interest.id}>
                                                    <div class="sm:hidden absolute top-full left-0 right-0 mt-2 z-10">
                                                        <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-2 space-y-2">
                                                            <div class="flex gap-2">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleInterestActive(interest);
                                                                        setActiveInterestForActions(null);
                                                                    }}
                                                                    disabled={toggleInterestActiveMutation.isPending}
                                                                    class={`flex-1 px-3 py-2 rounded text-sm font-medium ${(interest.active ?? false)
                                                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                                        } ${toggleInterestActiveMutation.isPending ? 'opacity-50' : ''}`}
                                                                >
                                                                    {(interest.active ?? false) ? 'Deactivate' : 'Activate'}
                                                                </button>
                                                            </div>
                                                            <Show when={interest.source === 'custom'}>
                                                                <div class="flex gap-2">
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
                                                            </Show>
                                                        </div>
                                                    </div>
                                                </Show>
                                            </Show>
                                        </div>
                                    }>
                                        <div class="p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
                                            <div class="space-y-3">
                                                <input
                                                    type="text"
                                                    value={editInterestName()}
                                                    onInput={(e) => setEditInterestName(e.target.value)}
                                                    placeholder="Interest name..."
                                                    class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                                />
                                                <textarea
                                                    value={editInterestDescription()}
                                                    onInput={(e) => setEditInterestDescription(e.target.value)}
                                                    placeholder="Interest description..."
                                                    rows={2}
                                                    class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                                />
                                                <div class="flex gap-2">
                                                    <button
                                                        onClick={saveEditedInterest}
                                                        disabled={updateInterestMutation.isPending}
                                                        class="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 flex items-center gap-1 disabled:opacity-50"
                                                    >
                                                        <Save class="w-3 h-3" />
                                                        {updateInterestMutation.isPending ? 'Saving...' : 'Save'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingInterest(null);
                                                            setEditInterestName('');
                                                            setEditInterestDescription('');
                                                        }}
                                                        class="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 flex items-center gap-1"
                                                    >
                                                        <X class="w-3 h-3" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Show>
                                )}
                            </For>
                        </div>

                        <Show when={interests().length === 0}>
                            <div class="text-center py-8">
                                <p class="text-gray-500">No interests found. Create your first interest above!</p>
                            </div>
                        </Show>

                        {/* Active Interests Summary */}
                        <Show when={interests().length > 0}>
                            <div class="mt-8 pt-6 border-t border-gray-200">
                                <h4 class="font-semibold text-gray-900 mb-4">Active Interests ({activeInterests().length})</h4>
                                <Show when={activeInterests().length === 0}>
                                    <p class="text-gray-500 text-sm">No active interests. Activate some interests above to see them here.</p>
                                </Show>
                                <Show when={activeInterests().length > 0}>
                                    <div class="flex flex-wrap gap-2">
                                        <For each={activeInterests()}>
                                            {(interest) => (
                                                <span class={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${interest.source === 'global'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    <Heart class="w-3 h-3 fill-current" />
                                                    {interest.name}
                                                </span>
                                            )}
                                        </For>
                                    </div>
                                </Show>
                            </div>
                        </Show>
                    </div>
                </div>
            </div>
        );
    };

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