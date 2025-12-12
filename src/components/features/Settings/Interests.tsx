import { createSignal, For, Show } from 'solid-js';
import { Plus, X, Save, Heart } from 'lucide-solid';
import { Switch } from '@/ui/switch';
import type { Interest } from '~/lib/api/types';

interface InterestsUIProps {
  interests: Interest[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onCreateInterest: (data: { name: string; description: string; active?: boolean }) => Promise<void>;
  onUpdateInterest: (data: { id: string; name: string; description: string }) => Promise<void>;
  onDeleteInterest: (interest: Interest) => Promise<void>;
  onToggleActive: (interest: Interest) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isToggling: boolean;
}

export default function InterestsComponent(props: InterestsUIProps) {
  // Form state
  const [newInterest, setNewInterest] = createSignal('');
  const [newInterestDescription, setNewInterestDescription] = createSignal('');
  const [showAddInterestForm, setShowAddInterestForm] = createSignal(false);
  const [newInterestError, setNewInterestError] = createSignal('');

  // Edit state
  const [editingInterest, setEditingInterest] = createSignal<Interest | null>(null);
  const [editInterestName, setEditInterestName] = createSignal('');
  const [editInterestDescription, setEditInterestDescription] = createSignal('');
  const [editInterestError, setEditInterestError] = createSignal('');

  // Mobile UX: Track which interest is actively selected for actions
  const [activeInterestForActions, setActiveInterestForActions] = createSignal<string | null>(null);

  // Get active interests
  const activeInterests = () => props.interests.filter(interest => interest.active ?? false);
  const customInterests = () => props.interests.filter(interest => interest.source === 'custom');
  const globalInterests = () => props.interests.filter(interest => interest.source === 'global');

  // Create interest
  const handleCreateInterest = async () => {
    const name = newInterest().trim();
    const description = newInterestDescription().trim();

    // Validate on submit
    if (!name) {
      setNewInterestError('Interest name is required');
      return;
    }
    if (name.length < 2) {
      setNewInterestError('Interest name must be at least 2 characters');
      return;
    }
    setNewInterestError('');

    try {
      await props.onCreateInterest({
        name,
        description,
        active: true
      });
      setNewInterest('');
      setNewInterestDescription('');
      setShowAddInterestForm(false);
    } catch (error) {
      console.error('Failed to create interest:', error);
      setNewInterestError('Failed to create interest. Please try again.');
    }
  };

  // Start editing
  const startEditingInterest = (interest: Interest) => {
    setEditingInterest(interest);
    setEditInterestName(interest.name);
    setEditInterestDescription(interest.description || '');
  };

  // Save edited interest
  const saveEditedInterest = async () => {
    const interest = editingInterest();
    const name = editInterestName().trim();
    const description = editInterestDescription().trim();

    // Validate on submit
    if (!name) {
      setEditInterestError('Interest name is required');
      return;
    }
    if (name.length < 2) {
      setEditInterestError('Interest name must be at least 2 characters');
      return;
    }
    setEditInterestError('');

    if (interest) {
      try {
        await props.onUpdateInterest({
          id: interest.id,
          name,
          description
        });
        setEditingInterest(null);
        setEditInterestName('');
        setEditInterestDescription('');
        setEditInterestError('');
      } catch (error) {
        console.error('Failed to update interest:', error);
        setEditInterestError('Failed to update interest. Please try again.');
      }
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingInterest(null);
    setEditInterestName('');
    setEditInterestDescription('');
  };

  // Show loading state
  if (props.isLoading) {
    // eslint-disable-next-line solid/components-return-once
    return (
      <div class="space-y-8">
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
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
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Interests</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">Unable to load interests. Please try again.</p>
          <button
            onClick={props.onRetry}
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg"
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
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Travel Interests</h2>
        <p class="text-gray-600 dark:text-gray-300">
          Spotlight what you love so the AI leans into it. Mix platform interests with your own.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-slate-200 bg-white/90 shadow-sm p-4">
          <p class="text-xs uppercase tracking-wide text-gray-500">Active</p>
          <div class="text-2xl font-bold text-gray-900">{activeInterests().length}</div>
          <p class="text-xs text-gray-500">Driving recommendations</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white/90 shadow-sm p-4">
          <p class="text-xs uppercase tracking-wide text-gray-500">Custom</p>
          <div class="text-2xl font-bold text-gray-900">{customInterests().length}</div>
          <p class="text-xs text-gray-500">Your personal angles</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white/90 shadow-sm p-4">
          <p class="text-xs uppercase tracking-wide text-gray-500">Global</p>
          <div class="text-2xl font-bold text-gray-900">{globalInterests().length}</div>
          <p class="text-xs text-gray-500">Ready-made options</p>
        </div>
      </div>

      <div class="bg-white/90 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        {/* Add New Interest Form */}
        <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white">Manage Interests</h4>
              <p class="text-sm text-gray-500">Short, precise interests work best for recommendations.</p>
            </div>
            <Show when={!showAddInterestForm()} fallback={
              <button
                onClick={() => {
                  setShowAddInterestForm(false);
                  setNewInterest('');
                  setNewInterestDescription('');
                  setNewInterestError('');
                }}
                class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                Cancel
              </button>
            }>
              <button
                onClick={() => setShowAddInterestForm(true)}
                class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-105 text-white rounded-xl text-sm font-semibold shadow-md"
              >
                <Plus class="w-4 h-4" />
                Add New Interest
              </button>
            </Show>
          </div>

          <Show when={showAddInterestForm()}>
            <div class="space-y-3 rounded-2xl border border-purple-100 dark:border-purple-700/40 bg-purple-50/60 dark:bg-purple-900/20 p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="space-y-1">
                  <input
                    type="text"
                    value={newInterest()}
                    onInput={(e) => {
                      setNewInterest(e.target.value);
                      if (newInterestError()) setNewInterestError('');
                    }}
                    placeholder="Interest name..."
                    class={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors ${newInterestError()
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-200 dark:border-gray-600 focus:ring-purple-500'
                      }`}
                  />
                  <Show when={newInterestError()}>
                    <p class="text-sm text-red-500 dark:text-red-400">{newInterestError()}</p>
                  </Show>
                </div>
                <button
                  onClick={handleCreateInterest}
                  disabled={props.isCreating}
                  class="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-105 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-sm"
                >
                  {props.isCreating ? 'Adding...' : 'Add'}
                </button>
              </div>
              <textarea
                value={newInterestDescription()}
                onInput={(e) => setNewInterestDescription(e.target.value)}
                placeholder="Interest description (optional)..."
                rows={2}
                class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </Show>
        </div>

        {/* Interests Grid */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <For each={props.interests}>
            {(interest) => (
              <Show when={editingInterest()?.id === interest.id} fallback={
                <div class="group relative interest-action-container overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 shadow-sm hover:shadow-md transition-all duration-200">
                  <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />
                  <div
                    onClick={() => {
                      if (interest.source === 'custom' && window.innerWidth < 640) {
                        setActiveInterestForActions(activeInterestForActions() === interest.id ? null : interest.id);
                      }
                    }}
                    class={`p-4 space-y-3 ${activeInterestForActions() === interest.id ? 'ring-2 ring-purple-200 dark:ring-purple-700' : ''}`}
                  >
                    <div class="flex items-start justify-between mb-2 gap-3">
                      <div class="space-y-1">
                        <div class="flex items-center gap-2">
                          <h4 class="font-semibold text-gray-900 dark:text-white">{interest.name}</h4>
                          <Switch
                            checked={interest.active ?? false}
                            onChange={() => props.onToggleActive(interest)}
                            disabled={props.isToggling}
                          />
                        </div>
                        <Show when={interest.description}>
                          <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{interest.description || 'No description'}</p>
                        </Show>
                      </div>
                      <div class="flex flex-col items-end gap-2">
                        <Show when={interest.source === 'global'}>
                          <span class="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-semibold border border-blue-100 dark:border-blue-800">Global</span>
                        </Show>
                        <span class={`px-2 py-1 rounded-full text-xs font-semibold border ${(interest.active ?? false)
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-100 dark:border-purple-700'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                          }`}>
                          {(interest.active ?? false) ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for custom interests only */}
                  <Show when={interest.source === 'custom'}>
                    <div class="hidden sm:flex items-center justify-end gap-2 px-4 pb-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingInterest(interest);
                        }}
                        class="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-semibold border border-gray-200 dark:border-gray-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          props.onDeleteInterest(interest);
                        }}
                        class="px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold border border-red-100"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Mobile: Show action buttons below when active */}
                    <Show when={activeInterestForActions() === interest.id}>
                      <div class="sm:hidden px-3 pb-3 space-y-2">
                        <div class="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              props.onToggleActive(interest);
                              setActiveInterestForActions(null);
                            }}
                            disabled={props.isToggling}
                            class={`flex-1 px-3 py-2 rounded text-sm font-medium ${(interest.active ?? false)
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                              } ${props.isToggling ? 'opacity-50' : ''}`}
                          >
                            {(interest.active ?? false) ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingInterest(interest);
                              setActiveInterestForActions(null);
                            }}
                            class="flex-1 px-3 py-2 bg-gray-100 text-gray-800 rounded text-sm font-medium hover:bg-gray-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              props.onDeleteInterest(interest);
                              setActiveInterestForActions(null);
                            }}
                            class="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded text-sm font-medium hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </Show>
                  </Show>
                </div>
              }>
                {/* Edit Form */}
                <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border-2 border-gray-300 dark:border-gray-600 shadow-inner">
                  <div class="space-y-3">
                    <div class="space-y-1">
                      <input
                        type="text"
                        value={editInterestName()}
                        onInput={(e) => {
                          setEditInterestName(e.target.value);
                          if (editInterestError()) setEditInterestError('');
                        }}
                        placeholder="Interest name..."
                        class={`w-full px-3 py-2.5 border rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors ${editInterestError()
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                          }`}
                      />
                      <Show when={editInterestError()}>
                        <p class="text-sm text-red-500 dark:text-red-400">{editInterestError()}</p>
                      </Show>
                    </div>
                    <textarea
                      value={editInterestDescription()}
                      onInput={(e) => setEditInterestDescription(e.target.value)}
                      placeholder="Interest description..."
                      rows={2}
                      class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <div class="flex gap-2">
                      <button
                        onClick={saveEditedInterest}
                        disabled={props.isUpdating}
                        class="px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-105 text-white rounded-xl text-sm font-semibold flex items-center gap-1 disabled:opacity-50"
                      >
                        <Save class="w-3 h-3" />
                        {props.isUpdating ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEditing}
                        class="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-xl text-sm font-semibold flex items-center gap-1"
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

        <Show when={props.interests.length === 0}>
          <div class="text-center py-10">
            <p class="text-gray-500 dark:text-gray-400">No interests found. Create your first interest above!</p>
          </div>
        </Show>

        {/* Active Interests Summary */}
        <Show when={props.interests.length > 0}>
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">
              Active Interests ({activeInterests().length})
            </h4>
            <Show when={activeInterests().length === 0}>
              <p class="text-gray-500 dark:text-gray-400 text-sm">No active interests. Activate some interests above to see them here.</p>
            </Show>
            <Show when={activeInterests().length > 0}>
              <div class="flex flex-wrap gap-2">
                <For each={activeInterests()}>
                  {(interest) => (
                    <span class={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${interest.source === 'global'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
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
    </div >
  );
}
