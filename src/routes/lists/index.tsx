import { createSignal, For, Show, createMemo } from 'solid-js';
import { Title, Meta } from '@solidjs/meta';
import { A } from '@solidjs/router';
import {
    Folder, Plus, Edit3, Trash2, Share2, Lock, Globe,
    Loader2, X, FolderPlus, ChevronRight, MapPin, Calendar, Heart, Bookmark
} from 'lucide-solid';
import {
    useLists,
    useCreateListMutation,
    useUpdateListMutation,
    useDeleteListMutation,
    type CreateListData
} from '~/lib/api/lists';

export default function ListsPage() {
    // State
    const [showModal, setShowModal] = createSignal(false);
    const [editingList, setEditingList] = createSignal<any | null>(null);
    const [formName, setFormName] = createSignal('');
    const [formDescription, setFormDescription] = createSignal('');
    const [formIsPublic, setFormIsPublic] = createSignal(false);
    const [formIsItinerary, setFormIsItinerary] = createSignal(false);
    const [activeTab, setActiveTab] = createSignal<'all' | 'custom' | 'itineraries'>('all');
    const [deleteConfirmId, setDeleteConfirmId] = createSignal<string | null>(null);

    // Queries & Mutations
    const listsQuery = useLists();
    const createMutation = useCreateListMutation();
    const updateMutation = useUpdateListMutation();
    const deleteMutation = useDeleteListMutation();

    // Derived state
    const lists = createMemo(() => listsQuery.data || []);
    const isLoading = createMemo(() => listsQuery.isLoading);

    // Filter lists by tab
    const filteredLists = createMemo(() => {
        const all = lists();
        switch (activeTab()) {
            case 'custom':
                return all.filter((l: any) => !l.isItinerary);
            case 'itineraries':
                return all.filter((l: any) => l.isItinerary);
            default:
                return all;
        }
    });

    // Form handlers
    const openCreateModal = () => {
        setEditingList(null);
        setFormName('');
        setFormDescription('');
        setFormIsPublic(false);
        setFormIsItinerary(false);
        setShowModal(true);
    };

    const openEditModal = (list: any) => {
        setEditingList(list);
        setFormName(list.name || '');
        setFormDescription(list.description || '');
        setFormIsPublic(list.isPublic || false);
        setFormIsItinerary(list.isItinerary || false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingList(null);
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        if (!formName().trim()) return;

        const data: CreateListData = {
            name: formName().trim(),
            description: formDescription().trim(),
            isPublic: formIsPublic(),
            isItinerary: formIsItinerary(),
        };

        try {
            if (editingList()) {
                await updateMutation.mutateAsync({
                    listId: editingList().id,
                    data
                });
            } else {
                await createMutation.mutateAsync(data);
            }
            closeModal();
        } catch (error) {
            console.error('Failed to save list:', error);
        }
    };

    const handleDelete = async (listId: string) => {
        try {
            await deleteMutation.mutateAsync(listId);
            setDeleteConfirmId(null);
        } catch (error) {
            console.error('Failed to delete list:', error);
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return '';
        }
    };

    return (
        <>
            <Title>My Lists - Organize Your Travel | Loci</Title>
            <Meta name="description" content="Create and manage custom lists of your favorite places, itineraries, and travel plans." />

            <div class="min-h-screen relative transition-colors">
                {/* Header */}
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div class="loci-hero">
                        <div class="loci-hero__content p-6 sm:p-8 space-y-6">
                            <div class="flex items-center justify-between flex-wrap gap-4">
                                <div class="flex items-center gap-3">
                                    <div class="relative">
                                        <div class="absolute -inset-1 bg-gradient-to-tr from-purple-500/60 via-pink-500/60 to-orange-500/60 blur-md opacity-80" />
                                        <div class="relative w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-lg ring-2 ring-white/60">
                                            <Folder class="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">My Lists</h1>
                                        <p class="text-white/80 text-sm mt-1">
                                            Organize your saved places and travel plans
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={openCreateModal}
                                    class="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-white font-semibold transition-all border border-white/30 shadow-lg"
                                >
                                    <Plus class="w-5 h-5" />
                                    New List
                                </button>
                            </div>

                            {/* Quick Links */}
                            <div class="flex items-center gap-3 flex-wrap">
                                <A
                                    href="/favorites"
                                    class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/90 text-sm font-medium transition-all border border-white/20"
                                >
                                    <Heart class="w-4 h-4" />
                                    View Favorites
                                </A>
                                <A
                                    href="/bookmarks"
                                    class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/90 text-sm font-medium transition-all border border-white/20"
                                >
                                    <Bookmark class="w-4 h-4" />
                                    View Bookmarks
                                </A>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    {/* Tabs */}
                    <div class="flex items-center gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('all')}
                            class={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab() === 'all'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            All Lists ({lists().length})
                        </button>
                        <button
                            onClick={() => setActiveTab('custom')}
                            class={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab() === 'custom'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            Custom Lists
                        </button>
                        <button
                            onClick={() => setActiveTab('itineraries')}
                            class={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab() === 'itineraries'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            Itineraries
                        </button>
                    </div>

                    {/* Loading State */}
                    <Show when={isLoading()}>
                        <div class="flex items-center justify-center py-16">
                            <Loader2 class="w-8 h-8 animate-spin text-blue-500" />
                            <span class="ml-3 text-gray-600 dark:text-gray-400">Loading your lists...</span>
                        </div>
                    </Show>

                    {/* Empty State */}
                    <Show when={!isLoading() && filteredLists().length === 0}>
                        <div class="text-center py-16">
                            <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                <FolderPlus class="w-10 h-10 text-purple-500" />
                            </div>
                            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                {activeTab() === 'all' ? 'No Lists Yet' : `No ${activeTab() === 'custom' ? 'Custom Lists' : 'Itineraries'} Yet`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                Create your first list to start organizing your favorite places and travel plans.
                            </p>
                            <button
                                onClick={openCreateModal}
                                class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                            >
                                <Plus class="w-5 h-5" />
                                Create Your First List
                            </button>
                        </div>
                    </Show>

                    {/* Lists Grid */}
                    <Show when={!isLoading() && filteredLists().length > 0}>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <For each={filteredLists()}>
                                {(list: any) => (
                                    <div class="glass-panel rounded-2xl p-5 hover:shadow-xl transition-all duration-200 group relative">
                                        {/* Delete Confirmation Overlay */}
                                        <Show when={deleteConfirmId() === list.id}>
                                            <div class="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-2xl flex flex-col items-center justify-center z-10 p-4">
                                                <p class="text-sm text-gray-700 dark:text-gray-300 mb-4 text-center">
                                                    Delete "{list.name}"?
                                                </p>
                                                <div class="flex gap-2">
                                                    <button
                                                        onClick={() => setDeleteConfirmId(null)}
                                                        class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(list.id)}
                                                        disabled={deleteMutation.isPending}
                                                        class="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                                                    >
                                                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </div>
                                            </div>
                                        </Show>

                                        <div class="flex items-start justify-between mb-3">
                                            <div class="flex-1 min-w-0">
                                                <div class="flex items-center gap-2 mb-1">
                                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                        {list.name}
                                                    </h3>
                                                    {list.isPublic ? (
                                                        <span title="Public"><Globe class="w-4 h-4 text-green-500 flex-shrink-0" /></span>
                                                    ) : (
                                                        <span title="Private"><Lock class="w-4 h-4 text-gray-400 flex-shrink-0" /></span>
                                                    )}
                                                </div>
                                                <Show when={list.isItinerary}>
                                                    <span class="inline-block px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full">
                                                        Itinerary
                                                    </span>
                                                </Show>
                                            </div>

                                            {/* Action Buttons */}
                                            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEditModal(list)}
                                                    class="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                    title="Edit"
                                                >
                                                    <Edit3 class="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmId(list.id)}
                                                    class="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    title="Delete"
                                                >
                                                    <Trash2 class="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <Show when={list.description}>
                                            <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                                                {list.description}
                                            </p>
                                        </Show>

                                        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                                            <div class="flex items-center gap-3">
                                                <Show when={list.cityId}>
                                                    <span class="flex items-center gap-1">
                                                        <MapPin class="w-3 h-3" />
                                                        {list.cityId}
                                                    </span>
                                                </Show>
                                                <span>{list.itemCount || 0} items</span>
                                            </div>
                                            <Show when={list.createdAt}>
                                                <span class="flex items-center gap-1">
                                                    <Calendar class="w-3 h-3" />
                                                    {formatDate(list.createdAt)}
                                                </span>
                                            </Show>
                                        </div>

                                        <A
                                            href={`/lists/${list.id}`}
                                            class="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl font-medium text-sm transition-colors"
                                        >
                                            View List
                                            <ChevronRight class="w-4 h-4" />
                                        </A>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>
                </div>

                {/* Create/Edit Modal */}
                <Show when={showModal()}>
                    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                                    {editingList() ? 'Edit List' : 'Create New List'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <X class="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} class="p-6 space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formName()}
                                        onInput={(e) => setFormName(e.currentTarget.value)}
                                        placeholder="My Travel List"
                                        class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formDescription()}
                                        onInput={(e) => setFormDescription(e.currentTarget.value)}
                                        placeholder="Optional description..."
                                        rows={3}
                                        class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    />
                                </div>

                                <div class="flex items-center gap-6">
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formIsItinerary()}
                                            onChange={(e) => setFormIsItinerary(e.currentTarget.checked)}
                                            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span class="text-sm text-gray-700 dark:text-gray-300">This is an itinerary</span>
                                    </label>

                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formIsPublic()}
                                            onChange={(e) => setFormIsPublic(e.currentTarget.checked)}
                                            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span class="text-sm text-gray-700 dark:text-gray-300">Make public</span>
                                    </label>
                                </div>

                                <div class="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                        class="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {createMutation.isPending || updateMutation.isPending ? (
                                            <span class="flex items-center gap-2">
                                                <Loader2 class="w-4 h-4 animate-spin" />
                                                Saving...
                                            </span>
                                        ) : editingList() ? 'Save Changes' : 'Create List'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Show>
            </div>
        </>
    );
}
