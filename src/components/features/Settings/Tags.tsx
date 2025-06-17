import { createSignal, For, Show } from 'solid-js';
import { Plus, X, Edit3, Save, Trash2 } from 'lucide-solid';
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
    return (
      <div class="space-y-8">
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (props.isError) {
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
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Manage your personal tags and activate/deactivate both global and personal tags to personalize your travel recommendations.
        </p>

        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          {/* Add New Tag Form */}
          <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-semibold text-gray-900 dark:text-white">Manage Tags</h4>
              <Show when={!showAddTagForm()} fallback={
                <button
                  onClick={() => {
                    setShowAddTagForm(false);
                    setNewTagName('');
                    setNewTagDescription('');
                    setNewTagType('');
                  }}
                  class="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                >
                  Cancel
                </button>
              }>
                <button
                  onClick={() => setShowAddTagForm(true)}
                  class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg text-sm font-medium"
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
                    onClick={handleCreateTag}
                    disabled={!newTagName().trim() || !newTagDescription().trim() || !newTagType().trim() || props.isCreating}
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {props.isCreating ? 'Adding...' : 'Add'}
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

          {/* Tags Grid */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <For each={props.tags}>
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
                        } ${tag.source === 'personal' ? 'hover:border-blue-300 cursor-pointer' : ''} ${activeTagForActions() === tag.id ? 'ring-2 ring-blue-300' : ''}`}
                    >
                      <div class="flex items-start justify-between mb-2">
                        <div class="flex items-center gap-2">
                          <h4 class="font-medium text-gray-900">{tag.name}</h4>
                          {/* Desktop: Always show toggle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              props.onToggleActive(tag);
                            }}
                            disabled={props.isToggling}
                            class={`w-8 h-4 rounded-full relative transition-colors duration-200 ${(tag.active ?? false) ? 'bg-green-500' : 'bg-gray-300'
                              } ${props.isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            title={`${(tag.active ?? false) ? 'Deactivate' : 'Activate'} tag`}
                          >
                            <div class={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${(tag.active ?? false) ? 'translate-x-4' : 'translate-x-0.5'
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
                            class="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                            title="Edit tag"
                          >
                            <Edit3 class="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              props.onDeleteTag(tag);
                            }}
                            class="p-2 text-red-400 hover:text-red-600 rounded-lg"
                            title="Delete tag"
                          >
                            <Trash2 class="w-4 h-4" />
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
                                  props.onToggleActive(tag);
                                  setActiveTagForActions(null);
                                }}
                                disabled={props.isToggling}
                                class={`flex-1 px-3 py-2 rounded text-sm font-medium ${(tag.active ?? false)
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  } ${props.isToggling ? 'opacity-50' : ''}`}
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
                                    props.onDeleteTag(tag);
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
                  {/* Edit Form */}
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
                          disabled={props.isUpdating}
                          class="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1 disabled:opacity-50"
                        >
                          <Save class="w-3 h-3" />
                          {props.isUpdating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEditing}
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

          <Show when={props.tags.length === 0}>
            <div class="text-center py-8">
              <p class="text-gray-500">No tags found. Create your first tag above!</p>
            </div>
          </Show>

          {/* Active Tags Summary */}
          <Show when={props.tags.length > 0}>
            <div class="mt-8 pt-6 border-t border-gray-200">
              <h4 class="font-semibold text-gray-900 mb-4">
                Active Tags ({props.tags.filter(tag => tag.active ?? false).length})
              </h4>
              <Show when={props.tags.filter(tag => tag.active ?? false).length === 0}>
                <p class="text-gray-500 text-sm">No active tags. Activate some tags above to see them here.</p>
              </Show>
              <Show when={props.tags.filter(tag => tag.active ?? false).length > 0}>
                <div class="flex flex-wrap gap-2">
                  <For each={props.tags.filter(tag => tag.active ?? false)}>
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
}