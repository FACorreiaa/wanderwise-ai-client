import { createEffect, createSignal, For, Show } from 'solid-js';
import { User, Tag, Heart, Users, Camera, MapPin, Calendar, Globe, Bell, ChevronRight, X, Save, Mail, Phone, Upload } from 'lucide-solid';
import { useUpdateProfileMutation, useUploadAvatarMutation, useUserProfileQuery } from '../../lib/api/user';
import { useTags, useCreateTagMutation, useUpdateTagMutation, useDeleteTagMutation, useToggleTagActiveMutation } from '../../lib/api/tags';
import { useInterests, useCreateInterestMutation, useUpdateInterestMutation, useDeleteInterestMutation, useToggleInterestActiveMutation } from '../../lib/api/interests';
import { ProcessedProfileData, UserProfileResponse } from '~/lib/api/types';
import { useAuth } from '~/contexts/AuthContext';
import TagsComponent from '~/components/features/Settings/Tags';
import InterestsComponent from '~/components/features/Settings/Interests';
import TravelProfiles from '~/components/features/Settings/TravelProfiles';
import { Button } from '~/ui/button';

export default function SettingsPage() {
    const { user } = useAuth();
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
        } catch (error: any) {
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
            const result = await uploadAvatarMutation.mutateAsync(file) as { avatar_url: string };
            //updateProfile('avatar', result.avatar_url);
            setUserProfile(prev => ({ ...prev, avatar: result.avatar_url }));
            await profileQuery.refetch();

            // Show success notification
            setNotification({ message: 'Profile photo updated successfully!', type: 'success' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error: any) {
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


    const renderSettings = () => {
        const profile = profileData();

        return (
            <div class="space-y-6">
                {/* Header card inspired by go-templui */}
                <div class="relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-[#0c7df2] via-[#6aa5ff] to-[#0c1747] text-white shadow-2xl">
                    <div class="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.45),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.35),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.25),transparent_32%)]" />
                    <div class="relative p-6 sm:p-8 flex flex-col lg:flex-row gap-6 lg:items-center">
                        <div class="flex flex-1 items-start gap-4">
                            <div class="relative">
                                <div class="absolute -inset-1 rounded-full bg-white/30 blur-lg" />
                                <Show
                                    when={photoPreview() || userProfile().avatar}
                                    fallback={
                                        <div class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-white text-xl sm:text-2xl font-bold ring-2 ring-white/40 shadow-lg">
                                            {(userProfile().firstname[0] || '') + (userProfile().lastname[0] || '') || userProfile().username[0] || ''}
                                        </div>
                                    }
                                >
                                    <img
                                        src={photoPreview() || userProfile().avatar}
                                        alt="Profile"
                                        class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-white/50 shadow-xl"
                                    />
                                </Show>
                                <button
                                    onClick={triggerFileInput}
                                    disabled={isUploading()}
                                    class="absolute -bottom-2 -right-2 bg-white text-gray-800 rounded-xl px-3 py-1 text-xs font-semibold shadow-lg border border-white/40 hover:-translate-y-0.5 transition-all disabled:opacity-60"
                                >
                                    <Show when={isUploading()} fallback={<span class="flex items-center gap-1"><Upload class="w-3 h-3" />Update</span>}>
                                        <span class="flex items-center gap-1">
                                            <div class="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                                            Uploading
                                        </span>
                                    </Show>
                                </button>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center gap-3">
                                    <h1 class="text-2xl sm:text-3xl font-bold leading-tight">{profile?.username || 'Traveler'}</h1>
                                    <span class="px-3 py-1 text-xs font-semibold rounded-full bg-white/15 backdrop-blur border border-white/20">Profile</span>
                                </div>
                                <div class="flex flex-wrap gap-2 text-sm text-white/80">
                                    <Show when={profile?.email}>
                                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
                                            <Mail class="w-4 h-4" /> {profile?.email}
                                        </span>
                                    </Show>
                                    <Show when={profile?.location || userProfile().city || userProfile().country}>
                                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
                                            <MapPin class="w-4 h-4" /> {profile?.location || `${userProfile().city}${userProfile().country ? `, ${userProfile().country}` : ''}`}
                                        </span>
                                    </Show>
                                    <Show when={profile?.joinedDate}>
                                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
                                            <Calendar class="w-4 h-4" /> Joined {new Date(profile?.joinedDate || '').toLocaleDateString()}
                                        </span>
                                    </Show>
                                </div>
                                <p class="text-sm text-white/85 max-w-2xl">{profile?.bio || 'Fine‑tune your profile so the AI tailors recommendations to your vibe.'}</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                            <div class="rounded-2xl bg-white/10 border border-white/20 p-4 shadow-lg backdrop-blur">
                                <div class="text-xs uppercase tracking-wide text-white/70 mb-2">Tags</div>
                                <div class="text-2xl font-bold">{tags().length || 0}</div>
                                <div class="text-xs text-white/80">Personalized filters</div>
                            </div>
                            <div class="rounded-2xl bg-white/10 border border-white/20 p-4 shadow-lg backdrop-blur">
                                <div class="text-xs uppercase tracking-wide text-white/70 mb-2">Interests</div>
                                <div class="text-2xl font-bold">{interests().length || 0}</div>
                                <div class="text-xs text-white/80">Signals for the AI</div>
                            </div>
                            <div class="rounded-2xl bg-white/10 border border-white/20 p-4 shadow-lg backdrop-blur col-span-2 sm:col-span-1">
                                <div class="text-xs uppercase tracking-wide text-white/70 mb-2">Profiles</div>
                                <div class="text-2xl font-bold">{profile?.stats?.lists_created ?? 1}</div>
                                <div class="text-xs text-white/80">Trip styles saved</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div class="rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-gray-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
                            <div class="flex items-start justify-between mb-4">
                                <div>
                                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Keep your profile details sharp so teammates and the AI know who you are.</p>
                                </div>
                                <Button
                                    onClick={saveProfile}
                                    disabled={updateProfileMutation.isPending}
                                    class="gap-2"
                                >
                                    <Save class="w-4 h-4" />
                                    {updateProfileMutation.isPending ? 'Saving...' : 'Save changes'}
                                </Button>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div class="sm:col-span-2 pb-2">
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Username</label>
                                    <input
                                        type="text"
                                        value={userProfile().username}
                                        onInput={(e) => updateProfile('username', e.target.value)}
                                        class="w-full px-3 sm:px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white dark:bg-slate-700 dark:text-white shadow-inner"
                                        placeholder="Your public handle"
                                    />
                                </div>
                                <div class="pb-2">
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        value={userProfile().firstname}
                                        onInput={(e) => updateProfile('firstname', e.target.value)}
                                        class="w-full px-3 sm:px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white dark:bg-slate-700 dark:text-white shadow-inner"
                                        placeholder="Jane"
                                    />
                                </div>
                                <div class="pb-2">
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={userProfile().lastname}
                                        onInput={(e) => updateProfile('lastname', e.target.value)}
                                        class="w-full px-3 sm:px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white dark:bg-slate-700 dark:text-white shadow-inner"
                                        placeholder="Doe"
                                    />
                                </div>
                                <div class="pb-2">
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                    <div class="relative">
                                        <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="email"
                                            value={userProfile().email}
                                            onInput={(e) => updateProfile('email', e.target.value)}
                                            class="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white dark:bg-slate-700 dark:text-white shadow-inner"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                                <div class="pb-2">
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                                    <div class="relative">
                                        <Phone class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="tel"
                                            value={userProfile().phone}
                                            onInput={(e) => updateProfile('phone', e.target.value)}
                                            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white dark:bg-slate-700 dark:text-white shadow-inner"
                                            placeholder="+1 555 123 4567"
                                        />
                                    </div>
                                </div>
                                <div class="pb-2">
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">City</label>
                                    <div class="relative">
                                        <MapPin class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            value={userProfile().city}
                                            onInput={(e) => updateProfile('city', e.target.value)}
                                            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white dark:bg-slate-700 dark:text-white shadow-inner"
                                            placeholder="Barcelona"
                                        />
                                    </div>
                                </div>
                                <div class="pb-2">
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Country</label>
                                    <div class="relative">
                                        <Globe class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            value={userProfile().country}
                                            onInput={(e) => updateProfile('country', e.target.value)}
                                            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white dark:bg-slate-700 dark:text-white shadow-inner"
                                            placeholder="Spain"
                                        />
                                    </div>
                                </div>
                                <div class="sm:col-span-2 pb-2">
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                                    <textarea
                                        value={userProfile().bio}
                                        onInput={(e) => updateProfile('bio', e.target.value)}
                                        rows={3}
                                        class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white dark:bg-slate-700 dark:text-white shadow-inner"
                                        placeholder="Tell us about your travel interests..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div class="rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-gray-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
                            <div class="flex items-center justify-between mb-3">
                                <div>
                                    <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Profile strength</p>
                                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Completion</h4>
                                </div>
                                <div class="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-100 dark:border-blue-800">Smart Fill</div>
                            </div>
                            <div class="w-full h-2.5 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                                <div class="h-full rounded-full bg-gradient-to-r from-[#0c7df2] via-[#5fa3ff] to-[#0f4eea]" style={{ width: '78%' }} />
                            </div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Complete your details and tune interests/tags for sharper recommendations.</p>
                        </div>

                        <div class="rounded-3xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 border border-blue-100 dark:border-slate-600 shadow p-6 sm:p-8 space-y-3">
                            <div class="flex items-center gap-2">
                                <Bell class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Quick actions</h4>
                            </div>
                            <div class="grid grid-cols-1 gap-2">
                                <button
                                    onClick={triggerFileInput}
                                    class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-600 hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-sm transition-all"
                                >
                                    <span class="flex items-center gap-2 text-sm font-medium"><Camera class="w-4 h-4 text-blue-600 dark:text-blue-400" /> Update profile photo</span>
                                    <ChevronRight class="w-4 h-4 text-gray-400" />
                                </button>
                                <button
                                    onClick={() => setActiveTab('tags')}
                                    class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-600 hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-sm transition-all"
                                >
                                    <span class="flex items-center gap-2 text-sm font-medium"><Tag class="w-4 h-4 text-blue-600 dark:text-blue-400" /> Curate tags</span>
                                    <ChevronRight class="w-4 h-4 text-gray-400" />
                                </button>
                                <button
                                    onClick={() => setActiveTab('interests')}
                                    class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-600 hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-sm transition-all"
                                >
                                    <span class="flex items-center gap-2 text-sm font-medium"><Heart class="w-4 h-4 text-blue-600 dark:text-blue-400" /> Update interests</span>
                                    <ChevronRight class="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
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
        );
    };

    const handleCreateTag = async (data: any) => {
        await createTagMutation.mutateAsync(data);
        setNotification({ message: 'Tag created successfully!', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleUpdateTag = async (data: any) => {
        await updateTagMutation.mutateAsync(data);
        setNotification({ message: 'Tag updated successfully!', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleDeleteTag = async (tag: any) => {
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
    };

    const handleToggleTag = async (tag: any) => {
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
    };

    const renderTags = () => {
        return (
            <TagsComponent
                tags={tags()}
                isLoading={tagsQuery.isLoading}
                isError={tagsQuery.isError}
                onRetry={() => tagsQuery.refetch()}
                onCreateTag={handleCreateTag}
                onUpdateTag={handleUpdateTag}
                onDeleteTag={handleDeleteTag}
                onToggleActive={handleToggleTag}
                isCreating={createTagMutation.isPending}
                isUpdating={updateTagMutation.isPending}
                isDeleting={deleteTagMutation.isPending}
                isToggling={toggleTagActiveMutation.isPending}
            />
        );
    };

    const handleCreateInterest = async (data: any) => {
        await createInterestMutation.mutateAsync(data);
        setNotification({ message: 'Interest created successfully!', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleUpdateInterest = async (data: any) => {
        await updateInterestMutation.mutateAsync(data);
        setNotification({ message: 'Interest updated successfully!', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleDeleteInterest = async (interest: any) => {
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
    };

    const handleToggleInterest = async (interest: any) => {
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
    };

    const renderInterests = () => {
        return (
            <InterestsComponent
                interests={interests()}
                isLoading={interestsQuery.isLoading}
                isError={interestsQuery.isError}
                onRetry={() => interestsQuery.refetch()}
                onCreateInterest={handleCreateInterest}
                onUpdateInterest={handleUpdateInterest}
                onDeleteInterest={handleDeleteInterest}
                onToggleActive={handleToggleInterest}
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
        <div class="min-h-screen relative bg-gradient-to-b from-slate-50 via-white to-blue-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(12,125,242,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(99,179,237,0.08),transparent_28%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(12,125,242,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(99,179,237,0.1),transparent_28%)]" />
            {/* Mobile-friendly notification */}
            <Show when={notification()}>
                <div class={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 p-4 rounded-lg shadow-lg border ${notification()?.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700'
                    } animate-in slide-in-from-top-2 duration-300`}>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">{notification()?.message}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setNotification(null)}
                            class="ml-2"
                        >
                            <X class="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Show>

            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div class="flex flex-col lg:flex-row gap-4 lg:gap-8">
                    {/* Mobile Tab Navigation */}
                    <div class="lg:hidden">
                        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-2xl border border-gray-200/80 dark:border-slate-700/80 p-2 shadow-sm">
                            <div class="flex overflow-x-auto space-x-2">
                                <For each={tabs}>
                                    {(tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                onClick={() => setActiveTab(tab.id)}
                                                class={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap border ${activeTab() === tab.id
                                                    ? 'bg-gradient-to-r from-[#0c7df2] to-[#0a6ed6] text-white shadow-lg border-blue-500/40'
                                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 border-transparent'
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
                        <div class="bg-white/85 dark:bg-slate-800/85 backdrop-blur rounded-2xl border border-gray-200/90 dark:border-slate-700/90 p-3 sticky top-8 shadow-sm">
                            <nav class="space-y-1.5">
                                <For each={tabs}>
                                    {(tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                onClick={() => setActiveTab(tab.id)}
                                                class={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 font-semibold border ${activeTab() === tab.id
                                                    ? 'bg-gradient-to-r from-[#0c7df2] to-[#0a6ed6] text-white shadow-lg border-blue-500/40'
                                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 border-transparent'
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
