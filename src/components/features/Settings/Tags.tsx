import { createSignal, For, Show } from 'solid-js';
import { Plus, X, Save } from 'lucide-solid';
import type { PersonalTag } from '~/lib/api/types';

interface TagsUIProps {
  tags: PersonalTag[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onCreateTag: (data: { name: string; description: string; tag_type: string }) => Promise<void>;
  onUpdateTag: (data: { id: string; name: string; description: string; tag_type: string }) => Promise<void>;
  onDeleteTag: (tag: PersonalTag) => Promise<void>;
  onToggleActive: (tag: PersonalTag) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isToggling: boolean;
}

export default function TagsComponent(props: TagsUIProps) {
  // Form state
  const [newTagName, setNewTagName] = createSignal('');
  const [newTagDescription, setNewTagDescription] = createSignal('');
  const [newTagType, setNewTagType] = createSignal('');
  const [showAddTagForm, setShowAddTagForm] = createSignal(false);

  // Edit state
  const [editingTag, setEditingTag] = createSignal<PersonalTag | null>(null);
  const [editTagName, setEditTagName] = createSignal('');
  const [editTagDescription, setEditTagDescription] = createSignal('');
  const [editTagType, setEditTagType] = createSignal('');

  // Mobile UX: Track which tag is actively selected for actions
  const [activeTagForActions, setActiveTagForActions] = createSignal<string | null>(null);
  const activeTags = () => props.tags.filter(tag => tag.active ?? false);
  const personalTags = () => props.tags.filter(tag => tag.source === 'personal');
  const globalTags = () => props.tags.filter(tag => tag.source === 'global');

  // Create tag
  const handleCreateTag = async () => {
    const name = newTagName().trim();
    const description = newTagDescription().trim();
    const tag_type = newTagType().trim();

    if (name && description && tag_type) {
      try {
        await props.onCreateTag({ name, description, tag_type });
        setNewTagName('');
        setNewTagDescription('');
        setNewTagType('');
        setShowAddTagForm(false);
      } catch (error) {
        console.error('Failed to create tag:', error);
      }
    }
  };

  // Start editing
  const startEditingTag = (tag: PersonalTag) => {
    setEditingTag(tag);
    setEditTagName(tag.name);
    setEditTagDescription(tag.description || '');
    setEditTagType(tag.tag_type);
  };

  // Save edited tag
  const saveEditedTag = async () => {
    const tag = editingTag();
    const name = editTagName().trim();
    const description = editTagDescription().trim();
    const tag_type = editTagType().trim();

    if (tag && name && description && tag_type) {
      try {
        await props.onUpdateTag({
          id: tag.id,
          name,
          description,
          tag_type
        });
        setEditingTag(null);
        setEditTagName('');
        setEditTagDescription('');
        setEditTagType('');
      } catch (error) {
        console.error('Failed to update tag:', error);
      }
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTag(null);
    setEditTagName('');
    setEditTagDescription('');
    setEditTagType('');
  };

  // Show loading state
  if (props.isLoading) {
    // eslint-disable-next-line solid/components-return-once
    return (
      <div class="space-y-8">
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  // Show error state
  if (props.isError) {
    // eslint-disable-next-line solid/components-return-once
    return (
      <div class="space-y-8">
        <div class="text-center py-12">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Tags</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">Unable to load tags. Please try again.</p>
          <button
            onClick={props.onRetry}
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg"
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
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Travel Tags</h2>
        <p class="text-gray-600 dark:text-gray-300">
          Curate tags to help the AI understand your vibe. Toggle global tags on or off and add personal signals.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-slate-200 bg-white/90 shadow-sm p-4">
          <p class="text-xs uppercase tracking-wide text-gray-500">Active</p>
          <div class="text-2xl font-bold text-gray-900">{activeTags().length}</div>
          <p class="text-xs text-gray-500">Currently influencing results</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white/90 shadow-sm p-4">
          <p class="text-xs uppercase tracking-wide text-gray-500">Personal</p>
          <div class="text-2xl font-bold text-gray-900">{personalTags().length}</div>
          <p class="text-xs text-gray-500">Your custom signals</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white/90 shadow-sm p-4">
          <p class="text-xs uppercase tracking-wide text-gray-500">Global</p>
          <div class="text-2xl font-bold text-gray-900">{globalTags().length}</div>
          <p class="text-xs text-gray-500">Platform tags available</p>
        </div>
      </div>

      <div class="bg-white/90 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        {/* Add New Tag Form */}
        <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white">Manage Tags</h4>
              <p class="text-sm text-gray-500">Add concise, descriptive tags to filter recommendations.</p>
            </div>
            <Show when={!showAddTagForm()} fallback={
              <button
                onClick={() => {
                  setShowAddTagForm(false);
                  setNewTagName('');
                  setNewTagDescription('');
                  setNewTagType('');
                }}
                class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                Cancel
              </button>
            }>
              <button
                onClick={() => setShowAddTagForm(true)}
                class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:brightness-105 text-white rounded-xl text-sm font-semibold shadow-md"
              >
                <Plus class="w-4 h-4" />
                Add New Tag
              </button>
            </Show>
          </div>

          <Show when={showAddTagForm()}>
            <div class="space-y-3 rounded-2xl border border-emerald-100 dark:border-emerald-700/40 bg-emerald-50/60 dark:bg-emerald-900/20 p-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newTagName()}
                  onInput={(e) => setNewTagName(e.target.value)}
                  placeholder="Tag name..."
                  class="px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white dark:bg-gray-800"
                />
                <input
                  type="text"
                  value={newTagType()}
                  onInput={(e) => setNewTagType(e.target.value)}
                  placeholder="Tag type (e.g., atmosphere, cuisine)..."
                  class="px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white dark:bg-gray-800"
                />
                <button
                  onClick={handleCreateTag}
                  disabled={!newTagName().trim() || !newTagDescription().trim() || !newTagType().trim() || props.isCreating}
                  class="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-sm"
                >
                  {props.isCreating ? 'Adding...' : 'Add'}
                </button>
              </div>
              <textarea
                value={newTagDescription()}
                onInput={(e) => setNewTagDescription(e.target.value)}
                placeholder="Tag description..."
                rows={2}
                class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white dark:bg-gray-800"
              />
            </div>
          </Show>
        </div>

        {/* Tags Grid */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <For each={props.tags}>
            {(tag) => (
              <Show when={editingTag()?.id === tag.id} fallback={
                <div class="group relative tag-action-container overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 shadow-sm hover:shadow-md transition-all duration-200">
                  <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600" />
                  <div
                    onClick={() => {
                      if (tag.source === 'personal' && window.innerWidth < 640) {
                        setActiveTagForActions(activeTagForActions() === tag.id ? null : tag.id);
                      }
                    }}
                    class={`p-4 space-y-3 ${activeTagForActions() === tag.id ? 'ring-2 ring-blue-200 dark:ring-blue-700' : ''}`}
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="space-y-1">
                        <div class="flex items-center gap-2">
                          <h4 class="font-semibold text-gray-900 dark:text-white">{tag.name}</h4>
                          <span class="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                            {tag.tag_type}
                          </span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{tag.description || 'No description'}</p>
                      </div>
                      <div class="flex flex-col items-end gap-2">
                        <Show when={tag.source === 'global'}>
                          <span class="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded-full text-xs font-semibold border border-blue-100 dark:border-blue-800">Global</span>
                        </Show>
                        <span class={`px-2 py-1 rounded-full text-xs font-semibold border ${(tag.active ?? false)
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                          {(tag.active ?? false) ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div class="flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          props.onToggleActive(tag);
                        }}
                        disabled={props.isToggling}
                        class={`relative inline-flex h-8 w-14 items-center rounded-full border transition-colors duration-200 ${props.isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${(tag.active ?? false)
                          ? 'bg-emerald-500/90 border-emerald-500'
                          : 'bg-gray-200 border-gray-200'
                          }`}
                        title={`${(tag.active ?? false) ? 'Deactivate' : 'Activate'} tag`}
                      >
                        <span
                          class={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${(tag.active ?? false) ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                        <span class="sr-only">Toggle</span>
                      </button>

                      <Show when={tag.source === 'personal'}>
                        <div class="hidden sm:flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingTag(tag);
                            }}
                            class="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-semibold border border-gray-200 dark:border-gray-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              props.onDeleteTag(tag);
                            }}
                            class="px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold border border-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </Show>
                    </div>
                  </div>

                  {/* Mobile actions */}
                  <Show when={tag.source === 'personal' && activeTagForActions() === tag.id}>
                    <div class="sm:hidden px-3 pb-3 space-y-2">
                      <div class="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingTag(tag);
                            setActiveTagForActions(null);
                          }}
                          class="flex-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            props.onDeleteTag(tag);
                            setActiveTagForActions(null);
                          }}
                          class="flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </Show>
                </div>
              }>
                {/* Edit Form */}
                <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-inner space-y-3">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editTagName()}
                      onInput={(e) => setEditTagName(e.target.value)}
                      placeholder="Tag name..."
                      class="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800"
                    />
                    <input
                      type="text"
                      value={editTagType()}
                      onInput={(e) => setEditTagType(e.target.value)}
                      placeholder="Tag type..."
                      class="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800"
                    />
                  </div>
                  <textarea
                    value={editTagDescription()}
                    onInput={(e) => setEditTagDescription(e.target.value)}
                    placeholder="Tag description..."
                    rows={2}
                    class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800"
                  />
                  <div class="flex gap-2">
                    <button
                      onClick={saveEditedTag}
                      disabled={props.isUpdating}
                      class="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold hover:brightness-105 flex items-center gap-1 disabled:opacity-50"
                    >
                      <Save class="w-3 h-3" />
                      {props.isUpdating ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      class="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white text-sm font-semibold flex items-center gap-1"
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

        <Show when={props.tags.length === 0}>
          <div class="text-center py-10">
            <p class="text-gray-500">No tags yet. Add your first one to start shaping recommendations.</p>
          </div>
        </Show>

        {/* Active Tags Summary */}
        <Show when={props.tags.length > 0}>
          <div class="mt-8 pt-6 border-t border-gray-200">
            <h4 class="font-semibold text-gray-900 mb-4">
              Active Tags ({activeTags().length})
            </h4>
            <Show when={activeTags().length === 0}>
              <p class="text-gray-500 text-sm">No active tags. Activate some tags above to see them here.</p>
            </Show>
            <Show when={activeTags().length > 0}>
              <div class="flex flex-wrap gap-2">
                <For each={activeTags()}>
                  {(tag) => (
                    <span class={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${tag.source === 'global'
                      ? 'bg-blue-50 text-blue-800 border-blue-100'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-100'
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
  );
}
