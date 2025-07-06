import { createSignal, Show, For } from 'solid-js';
import { Plus, FolderPlus, Check, X } from 'lucide-solid';
import { useLists, useCreateListMutation } from '~/lib/api/lists';
import { useAddToListMutation } from '~/lib/api/lists';

interface AddToListButtonProps {
  itemId: string;
  contentType: 'poi' | 'restaurant' | 'hotel' | 'itinerary';
  itemName: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'minimal';
  sourceInteractionId?: string;
  aiDescription?: string;
}

export default function AddToListButton(props: AddToListButtonProps) {
  const [showListModal, setShowListModal] = createSignal(false);
  const [showCreateForm, setShowCreateForm] = createSignal(false);
  const [newListName, setNewListName] = createSignal('');
  const [isCreating, setIsCreating] = createSignal(false);

  // API hooks
  const listsQuery = useLists();
  const createListMutation = useCreateListMutation();
  const addToListMutation = useAddToListMutation();

  const lists = () => listsQuery.data || [];
  
  const buttonSizeClasses = () => {
    switch (props.size) {
      case 'sm': return 'w-8 h-8 text-xs';
      case 'lg': return 'w-12 h-12 text-lg';
      default: return 'w-10 h-10 text-sm';
    }
  };

  const iconSizeClasses = () => {
    switch (props.size) {
      case 'sm': return 'w-3 h-3';
      case 'lg': return 'w-6 h-6';
      default: return 'w-4 h-4';
    }
  };

  const addToList = async (listId: string) => {
    try {
      await addToListMutation.mutateAsync({
        listId,
        itemData: {
          item_id: props.itemId,
          content_type: props.contentType,
          position: 0, // Will be set by backend
          notes: '',
          source_llm_interaction_id: props.sourceInteractionId,
          item_ai_description: props.aiDescription,
        },
      });
      setShowListModal(false);
    } catch (error) {
      console.error('Failed to add item to list:', error);
    }
  };

  const createNewList = async () => {
    if (!newListName().trim()) return;
    
    setIsCreating(true);
    try {
      const newList = await createListMutation.mutateAsync({
        name: newListName(),
        description: `List created for ${props.itemName}`,
        isPublic: false,
        // is_itinerary: false,
      });
      
      // Add the item to the newly created list
      await addToList(newList.id);
      setNewListName('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create list:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const renderButton = () => {
    if (props.variant === 'minimal') {
      return (
        <button
          onClick={() => setShowListModal(true)}
          class={`text-gray-500 hover:text-blue-600 transition-colors ${props.className || ''}`}
          title={`Add ${props.itemName} to list`}
        >
          <FolderPlus class={iconSizeClasses()} />
        </button>
      );
    }

    if (props.variant === 'icon') {
      return (
        <button
          onClick={() => setShowListModal(true)}
          class={`${buttonSizeClasses()} bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all flex items-center justify-center ${props.className || ''}`}
          title={`Add ${props.itemName} to list`}
        >
          <FolderPlus class={iconSizeClasses()} />
        </button>
      );
    }

    return (
      <button
        onClick={() => setShowListModal(true)}
        class={`px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium ${props.className || ''}`}
      >
        <FolderPlus class="w-4 h-4" />
        Add to List
      </button>
    );
  };

  return (
    <>
      {renderButton()}

      {/* List Selection Modal */}
      <Show when={showListModal()}>
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Add to List</h3>
                  <p class="text-sm text-gray-600 mt-1 truncate">{props.itemName}</p>
                </div>
                <button
                  onClick={() => setShowListModal(false)}
                  class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X class="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div class="p-6 max-h-64 overflow-y-auto">
              <Show
                when={!showCreateForm()}
                fallback={
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        New List Name
                      </label>
                      <input
                        type="text"
                        value={newListName()}
                        onInput={(e) => setNewListName(e.target.value)}
                        placeholder="Enter list name..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && createNewList()}
                      />
                    </div>
                    <div class="flex gap-2">
                      <button
                        onClick={createNewList}
                        disabled={!newListName().trim() || isCreating()}
                        class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {isCreating() ? 'Creating...' : 'Create List'}
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateForm(false);
                          setNewListName('');
                        }}
                        class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                }
              >
                <div class="space-y-3">
                  <Show
                    when={lists().length > 0}
                    fallback={
                      <div class="text-center py-6">
                        <FolderPlus class="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p class="text-gray-600 mb-4">No lists yet</p>
                        <button
                          onClick={() => setShowCreateForm(true)}
                          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                          Create Your First List
                        </button>
                      </div>
                    }
                  >
                    <For each={lists()}>
                      {(list) => (
                        <button
                          onClick={() => addToList(list.id)}
                          disabled={addToListMutation.isPending}
                          class="w-full p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors disabled:opacity-50"
                        >
                          <div class="flex items-center justify-between">
                            <div class="flex-1 min-w-0">
                              <h4 class="font-medium text-gray-900 truncate">{list.name}</h4>
                              <p class="text-sm text-gray-600 truncate">{list.description}</p>
                            </div>
                            <Show when={addToListMutation.isPending}>
                              <div class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin ml-2" />
                            </Show>
                          </div>
                        </button>
                      )}
                    </For>
                  </Show>

                  <Show when={lists().length > 0}>
                    <div class="pt-3 border-t border-gray-200">
                      <button
                        onClick={() => setShowCreateForm(true)}
                        class="w-full p-3 text-left hover:bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 transition-colors flex items-center gap-2 text-gray-600"
                      >
                        <Plus class="w-4 h-4" />
                        Create New List
                      </button>
                    </div>
                  </Show>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}