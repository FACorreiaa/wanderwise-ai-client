import { createSignal, For, Show } from 'solid-js';
import { Plus, X, Edit3, Save, Trash2, Heart } from 'lucide-solid';
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

  // Edit state
  const [editingInterest, setEditingInterest] = createSignal<Interest | null>(null);
  const [editInterestName, setEditInterestName] = createSignal('');
  const [editInterestDescription, setEditInterestDescription] = createSignal('');

  // Mobile UX: Track which interest is actively selected for actions
  const [activeInterestForActions, setActiveInterestForActions] = createSignal<string | null>(null);

  // Get active interests
  const activeInterests = () => props.interests.filter(interest => interest.active ?? false);

  // Create interest
  const handleCreateInterest = async () => {
    const name = newInterest().trim();
    const description = newInterestDescription().trim();

    if (name) {
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
      }
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

    if (interest && name) {
      try {
        await props.onUpdateInterest({
          id: interest.id,
          name,
          description
        });
        setEditingInterest(null);
        setEditInterestName('');
        setEditInterestDescription('');
      } catch (error) {
        console.error('Failed to update interest:', error);
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
    return (
      <div class="space-y-8">
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (props.isError) {
    return (
      <div class="space-y-8">
        <div class="text-center py-12">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Error Loading Interests</h3>
          <p class="text-gray-600 mb-4">Unable to load interests. Please try again.</p>
          <button
            onClick={props.onRetry}
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
        <p class="text-gray-600 mb-6">
          Manage your personal interests and activate/deactivate both global and custom interests to personalize your travel recommendations.
        </p>

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
                    onClick={handleCreateInterest}
                    disabled={!newInterest().trim() || props.isCreating}
                    class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {props.isCreating ? 'Adding...' : 'Add'}
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

          {/* Interests Grid */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <For each={props.interests}>
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
                          {/* Desktop: Always show toggle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              props.onToggleActive(interest);
                            }}
                            disabled={props.isToggling}
                            class={`w-10 h-5 rounded-full relative transition-colors duration-200 ${(interest.active ?? false) ? 'bg-purple-500' : 'bg-gray-300'
                              } ${props.isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
                              props.onDeleteInterest(interest);
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
                                  props.onToggleActive(interest);
                                  setActiveInterestForActions(null);
                                }}
                                disabled={props.isToggling}
                                class={`flex-1 px-3 py-2 rounded text-sm font-medium ${(interest.active ?? false)
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                  } ${props.isToggling ? 'opacity-50' : ''}`}
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
                                    props.onDeleteInterest(interest);
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
                  {/* Edit Form */}
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
                          disabled={props.isUpdating}
                          class="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 flex items-center gap-1 disabled:opacity-50"
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

          <Show when={props.interests.length === 0}>
            <div class="text-center py-8">
              <p class="text-gray-500">No interests found. Create your first interest above!</p>
            </div>
          </Show>

          {/* Active Interests Summary */}
          <Show when={props.interests.length > 0}>
            <div class="mt-8 pt-6 border-t border-gray-200">
              <h4 class="font-semibold text-gray-900 mb-4">
                Active Interests ({activeInterests().length})
              </h4>
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
}