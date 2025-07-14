import {
  Copy,
  Edit3,
  Eye,
  Folder,
  FolderPlus,
  Globe,
  Heart,
  Lock,
  MapPin,
  Plus,
  Share2,
  Trash2,
  Users,
  X,
  Search,
  Filter,
  ChevronDown,
  Check,
  Bookmark,
  Grid3X3,
  List,
} from "lucide-solid";
import { createSignal, For, Show, createMemo, onMount } from "solid-js";
import {
  useCreateListMutation,
  useDeleteListMutation,
  useLists,
  useUpdateListMutation,
  useAddToListMutation,
  // useSavedLists,
  // useSearchLists,
} from "~/lib/api/lists";
import { useFavorites } from "~/lib/api/pois";

export default function ListsPage() {
  const [viewMode, setViewMode] = createSignal("grid"); // 'grid', 'list'
  const [activeTab, setActiveTab] = createSignal("my-lists"); // 'my-lists', 'shared', 'public'
  const [selectedList, setSelectedList] = createSignal(null);
  const [showCreateModal, setShowCreateModal] = createSignal(false);
  const [showEditModal, setShowEditModal] = createSignal(false);
  const [showDeleteModal, setShowDeleteModal] = createSignal(false);
  
  // Enhanced create modal state
  const [showCreateWithDataModal, setShowCreateWithDataModal] = createSignal(false);
  const [createStep, setCreateStep] = createSignal(1); // 1: form, 2: select data
  const [selectedContentType, setSelectedContentType] = createSignal("poi");
  const [selectedItems, setSelectedItems] = createSignal([]);
  const [searchTerm, setSearchTerm] = createSignal("");
  const [showPublicListsSearch, setShowPublicListsSearch] = createSignal(false);
  const [publicSearchTerm, setPublicSearchTerm] = createSignal("");

  // List form state
  const [listForm, setListForm] = createSignal({
    name: "",
    description: "",
    isPublic: false,
    allowCollaboration: false,
    tags: [],
  });

  // API hooks
  const listsQuery = useLists();
  const createListMutation = useCreateListMutation();
  const updateListMutation = useUpdateListMutation();
  const deleteListMutation = useDeleteListMutation();
  const addToListMutation = useAddToListMutation();
  
  // Data queries for list creation
  const favoritesQuery = useFavorites(() => 1, () => 100);
  
  // Extract restaurants and hotels from POI favorites by category
  const allFavorites = () => favoritesQuery.data?.data || [];
  const restaurantFavorites = () => allFavorites().filter(poi => 
    poi.category?.toLowerCase().includes('restaurant') || 
    poi.category?.toLowerCase().includes('food') ||
    poi.category?.toLowerCase().includes('dining')
  );
  const hotelFavorites = () => allFavorites().filter(poi => 
    poi.category?.toLowerCase().includes('hotel') || 
    poi.category?.toLowerCase().includes('accommodation') ||
    poi.category?.toLowerCase().includes('lodging')
  );
  
  // Saved and public lists queries (temporarily disabled until endpoints are confirmed working)
  // const savedListsQuery = useSavedLists();
  // const searchListsQuery = useSearchLists(publicSearchTerm());
  const savedListsQuery = { data: [] }; // Placeholder
  const searchListsQuery = { data: [] }; // Placeholder

  // Get lists from API or fallback to empty array
  const lists = () => listsQuery.data || [];
  
  // Computed data based on selected content type
  const availableItems = createMemo(() => {
    const term = searchTerm().toLowerCase();
    
    switch (selectedContentType()) {
      case "restaurant":
        return restaurantFavorites().filter(item =>
          item.name.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.category?.toLowerCase().includes(term)
        );
      case "hotel":
        return hotelFavorites().filter(item =>
          item.name.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.category?.toLowerCase().includes(term)
        );
      default:
        // For POIs, exclude restaurants and hotels to avoid duplicates
        const poiOnlyFavorites = allFavorites().filter(poi => {
          const category = poi.category?.toLowerCase() || '';
          return !category.includes('restaurant') && 
                 !category.includes('food') && 
                 !category.includes('dining') &&
                 !category.includes('hotel') && 
                 !category.includes('accommodation') &&
                 !category.includes('lodging');
        });
        return poiOnlyFavorites.filter(item =>
          item.name.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.category?.toLowerCase().includes(term)
        );
    }
  });
  
  // Content type options
  const contentTypes = [
    { value: "poi", label: "Places & Attractions", icon: MapPin },
    { value: "restaurant", label: "Restaurants", icon: Heart },
    { value: "hotel", label: "Hotels", icon: Folder },
  ];

  const [sharedLists] = createSignal([
    {
      id: "shared-1",
      name: "Sarah's Art Route",
      description:
        "Contemporary art galleries and installations across major European cities.",
      itemCount: 12,
      isPublic: false,
      owner: "Sarah Chen",
      sharedWith: "You",
      tags: ["Art", "Galleries", "Contemporary"],
      cities: ["Berlin", "Paris", "Amsterdam"],
      likes: 8,
      updatedAt: "2024-01-17",
    },
  ]);

  const [publicLists] = createSignal([
    {
      id: "public-1",
      name: "Instagram-worthy Spots in Paris",
      description:
        "The most photogenic locations in the City of Light, curated by a local photographer.",
      itemCount: 18,
      isPublic: true,
      owner: "Photography Explorer",
      tags: ["Photography", "Paris", "Instagram"],
      cities: ["Paris"],
      likes: 312,
      views: 1547,
      updatedAt: "2024-01-19",
    },
    {
      id: "public-2",
      name: "Digital Nomad Cafes - Europe",
      description:
        "WiFi-friendly cafes perfect for remote work across European cities.",
      itemCount: 45,
      isPublic: true,
      owner: "Remote Worker Hub",
      tags: ["Digital Nomad", "Cafes", "Work"],
      cities: ["Multiple"],
      likes: 89,
      views: 2341,
      updatedAt: "2024-01-16",
    },
  ]);

  const tabs = [
    { id: "my-lists", label: "My Lists", count: lists().length },
    { id: "saved", label: "Saved Lists", count: savedListsQuery.data?.length || 0 },
    { id: "public", label: "Discover", count: searchListsQuery.data?.length || 0 },
  ];

  const createList = async () => {
    try {
      const formData = listForm();
      const newList = await createListMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        is_public: formData.isPublic,
        is_itinerary: false, // Empty lists are collections, not itineraries
        // city_id can be added later if needed
      });
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create list:", error);
    }
  };

  const createListWithData = async () => {
    try {
      // Create the list first
      const formData = listForm();
      const newList = await createListMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        is_public: formData.isPublic,
        is_itinerary: false, // Collections, not itineraries
        // city_id can be added later if needed
      });

      // Add selected items to the new list
      for (const item of selectedItems()) {
        await addToListMutation.mutateAsync({
          listId: newList.id,
          itemData: {
            item_id: item.id,
            content_type: selectedContentType(),
            position: 0,
            notes: "",
          },
        });
      }

      setShowCreateWithDataModal(false);
      resetForm();
      setSelectedItems([]);
      setCreateStep(1);
    } catch (error) {
      console.error("Failed to create list with data:", error);
    }
  };

  const updateList = async () => {
    const listId = selectedList()?.id;
    if (listId) {
      try {
        await updateListMutation.mutateAsync({
          listId,
          listData: listForm(),
        });
        setShowEditModal(false);
        resetForm();
      } catch (error) {
        console.error("Failed to update list:", error);
      }
    }
  };

  const deleteList = async () => {
    const listId = selectedList()?.id;
    if (listId) {
      try {
        await deleteListMutation.mutateAsync(listId);
        setShowDeleteModal(false);
        setSelectedList(null);
      } catch (error) {
        console.error("Failed to delete list:", error);
      }
    }
  };

  const duplicateList = async (list) => {
    try {
      await createListMutation.mutateAsync({
        ...list,
        name: `${list.name} (Copy)`,
        views: 0,
        likes: 0,
        isPublic: false,
      });
    } catch (error) {
      console.error("Failed to duplicate list:", error);
    }
  };

  const resetForm = () => {
    setListForm({
      name: "",
      description: "",
      isPublic: false,
      allowCollaboration: false,
      tags: [],
    });
    setSelectedItems([]);
    setSearchTerm("");
    setCreateStep(1);
  };

  const toggleItemSelection = (item) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some(p => p.id === item.id);
      if (isSelected) {
        return prev.filter(p => p.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const openEditModal = (list) => {
    setSelectedList(list);
    setListForm({
      name: list.name,
      description: list.description,
      isPublic: list.isPublic,
      allowCollaboration: list.allowCollaboration,
      tags: [...list.tags],
    });
    setShowEditModal(true);
  };

  const getVisibilityIcon = (list) => {
    if (list.isPublic) return Globe;
    if (list.allowCollaboration) return Users;
    return Lock;
  };

  const getVisibilityLabel = (list) => {
    if (list.isPublic) return "Public";
    if (list.allowCollaboration) return "Collaborative";
    return "Private";
  };

  const getVisibilityColor = (list) => {
    if (list.isPublic) return "text-green-600 bg-green-50";
    if (list.allowCollaboration) return "text-blue-600 bg-blue-50";
    return "text-gray-600 bg-gray-50";
  };

  const getCurrentLists = () => {
    switch (activeTab()) {
      case "saved":
        return savedListsQuery.data || [];
      case "public":
        return searchListsQuery.data || [];
      default:
        return lists();
    }
  };

  const renderListCard = (list) => {
    const VisibilityIcon = getVisibilityIcon(list);

    return (
      <div class="cb-card hover:shadow-lg transition-all duration-300 group">
        {/* Cover Image Placeholder */}
        <div class="relative h-32 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="grid grid-cols-3 gap-1 opacity-30">
              {Array.from({ length: 9 }).map((_, i) => (
                <div class="w-4 h-4 bg-white rounded-sm"></div>
              ))}
            </div>
          </div>

          {/* Visibility badge */}
          <div class="absolute top-3 left-3">
            <span
              class={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getVisibilityColor(list)}`}
            >
              <VisibilityIcon class="w-3 h-3" />
              {getVisibilityLabel(list)}
            </span>
          </div>

          {/* Actions - only show for own lists */}
          <Show when={activeTab() === "my-lists"}>
            <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(list);
                  }}
                  class="p-1.5 bg-white/90 text-gray-700 rounded-lg hover:bg-white"
                  title="Edit list"
                >
                  <Edit3 class="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateList(list);
                  }}
                  class="p-1.5 bg-white/90 text-gray-700 rounded-lg hover:bg-white"
                  title="Duplicate list"
                >
                  <Copy class="w-3 h-3" />
                </button>
                <button class="p-1.5 bg-white/90 text-gray-700 rounded-lg hover:bg-white">
                  <Share2 class="w-3 h-3" />
                </button>
              </div>
            </div>
          </Show>

          {/* Stats overlay */}
          <div class="absolute bottom-3 right-3">
            <div class="flex items-center gap-2 text-xs">
              <Show when={list.views !== undefined}>
                <div class="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
                  <Eye class="w-3 h-3" />
                  <span>{list.views}</span>
                </div>
              </Show>
              <Show when={list.likes !== undefined}>
                <div class="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
                  <Heart class="w-3 h-3 text-red-500" />
                  <span>{list.likes}</span>
                </div>
              </Show>
            </div>
          </div>
        </div>

        {/* Content */}
        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 text-sm mb-1 truncate">
                {list.name}
              </h3>
              <p class="text-xs text-gray-500">
                By {list.owner} • {list.itemCount} places
              </p>
            </div>
          </div>

          <p class="text-xs text-gray-600 mb-3 line-clamp-2">
            {list.description}
          </p>

          {/* Cities */}
          <Show when={list.cities?.length > 0}>
            <div class="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <MapPin class="w-3 h-3" />
              <span class="truncate">
                {list.cities.length > 2
                  ? `${list.cities.slice(0, 2).join(", ")} +${list.cities.length - 2} more`
                  : list.cities.join(", ")}
              </span>
            </div>
          </Show>

          {/* Recent items preview */}
          <Show when={list.recentItems?.length > 0}>
            <div class="mb-3">
              <div class="text-xs font-medium text-gray-700 mb-1">
                Recent additions:
              </div>
              <div class="space-y-1">
                {list.recentItems.slice(0, 2).map((item) => (
                  <div class="text-xs text-gray-600 truncate">
                    • {item.name} {item.city && `(${item.city})`}
                  </div>
                ))}
              </div>
            </div>
          </Show>

          {/* Tags */}
          <div class="flex flex-wrap gap-1 mb-3">
            {list.tags.slice(0, 2).map((tag) => (
              <span class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                {tag}
              </span>
            ))}
            {list.tags.length > 2 && (
              <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{list.tags.length - 2}
              </span>
            )}
          </div>

          {/* Footer */}
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>Updated {new Date(list.updatedAt).toLocaleDateString()}</span>
            <div class="flex items-center gap-2">
              <Show when={list.collaborators?.length > 0}>
                <div class="flex items-center gap-1">
                  <Users class="w-3 h-3" />
                  <span>{list.collaborators.length}</span>
                </div>
              </Show>
              <button class="text-blue-600 hover:text-blue-700 font-medium">
                View →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderListForm = () => (
    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          List Name
        </label>
        <input
          type="text"
          value={listForm().name}
          onInput={(e) =>
            setListForm((prev) => ({ ...prev, name: e.target.value }))
          }
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Hidden Gems in Europe"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={listForm().description}
          onInput={(e) =>
            setListForm((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe what makes this list special..."
        />
      </div>

      <div class="space-y-3">
        <div class="flex items-start space-x-3">
          <input
            type="checkbox"
            id="isPublic"
            checked={listForm().isPublic}
            onChange={(e) =>
              setListForm((prev) => ({ ...prev, isPublic: e.target.checked }))
            }
            class="mt-1 text-blue-600 rounded focus:ring-blue-500"
          />
          <div class="flex-1">
            <label for="isPublic" class="text-sm font-medium text-gray-700">
              Make this list public
            </label>
            <p class="text-xs text-gray-600">
              Others can discover and view your list
            </p>
          </div>
        </div>

        <div class="flex items-start space-x-3">
          <input
            type="checkbox"
            id="allowCollaboration"
            checked={listForm().allowCollaboration}
            onChange={(e) =>
              setListForm((prev) => ({
                ...prev,
                allowCollaboration: e.target.checked,
              }))
            }
            class="mt-1 text-blue-600 rounded focus:ring-blue-500"
          />
          <div class="flex-1">
            <label
              for="allowCollaboration"
              class="text-sm font-medium text-gray-700"
            >
              Allow collaboration
            </label>
            <p class="text-xs text-gray-600">
              Let others contribute to this list
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Header */}
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">My Collections</h1>
              <p class="text-gray-600 mt-1">
                Organize and share your favorite places
              </p>
            </div>
            <Show when={activeTab() === "my-lists"}>
              <div class="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setShowCreateModal(true)}
                  class="cb-button cb-button-secondary px-4 py-2 flex items-center gap-2"
                >
                  <Plus class="w-4 h-4" />
                  Create Empty List
                </button>
                <button
                  onClick={() => setShowCreateWithDataModal(true)}
                  class="cb-button cb-button-primary px-4 py-2 flex items-center gap-2"
                >
                  <FolderPlus class="w-4 h-4" />
                  Create from Saved Items
                </button>
              </div>
            </Show>
            <Show when={activeTab() === "public"}>
              <div class="relative">
                <input
                  type="text"
                  value={publicSearchTerm()}
                  onInput={(e) => setPublicSearchTerm(e.target.value)}
                  placeholder="Search public lists..."
                  class="w-full sm:w-80 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </Show>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex space-x-8">
            <For each={tabs}>
              {(tab) => (
                <button
                  onClick={() => setActiveTab(tab.id)}
                  class={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab() === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              )}
            </For>
          </div>
        </div>
      </div>

      {/* Content */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Show
          when={getCurrentLists().length > 0}
          fallback={
            <div class="text-center py-12">
              <Folder class="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {activeTab() === "my-lists" && "No lists yet"}
                {activeTab() === "shared" && "No shared lists"}
                {activeTab() === "public" && "No public lists found"}
              </h3>
              <p class="text-gray-600 mb-4">
                {activeTab() === "my-lists" &&
                  "Create your first list to organize your favorite places"}
                {activeTab() === "shared" &&
                  "Lists shared with you will appear here"}
                {activeTab() === "public" &&
                  "Discover amazing lists created by the community"}
              </p>
              <Show when={activeTab() === "my-lists"}>
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    class="cb-button cb-button-secondary px-6 py-2"
                  >
                    Create Empty List
                  </button>
                  <button
                    onClick={() => setShowCreateWithDataModal(true)}
                    class="cb-button cb-button-primary px-6 py-2 flex items-center gap-2 justify-center"
                  >
                    <FolderPlus class="w-4 h-4" />
                    Create from Saved Items
                  </button>
                </div>
              </Show>
            </div>
          }
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <For each={getCurrentLists()}>{(list) => renderListCard(list)}</For>
          </div>
        </Show>
      </div>

      {/* Create List Modal */}
      <Show when={showCreateModal()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg max-w-2xl w-full">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900">
                  Create New List
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  class="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>
            </div>
            <div class="p-6">{renderListForm()}</div>
            <div class="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                class="cb-button cb-button-secondary px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={createList}
                disabled={
                  !listForm().name.trim() || createListMutation.isPending
                }
                class="cb-button cb-button-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createListMutation.isPending ? "Creating..." : "Create List"}
              </button>
            </div>
          </div>
        </div>
      </Show>

      {/* Edit List Modal */}
      <Show when={showEditModal()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg max-w-2xl w-full">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900">Edit List</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  class="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>
            </div>
            <div class="p-6">{renderListForm()}</div>
            <div class="p-6 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedList(selectedList());
                  setShowEditModal(false);
                  setShowDeleteModal(true);
                }}
                class="cb-button text-red-600 hover:bg-red-50 px-4 py-2 flex items-center gap-2"
              >
                <Trash2 class="w-4 h-4" />
                Delete List
              </button>
              <div class="flex items-center gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  class="cb-button cb-button-secondary px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={updateList}
                  disabled={
                    !listForm().name.trim() || updateListMutation.isPending
                  }
                  class="cb-button cb-button-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateListMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Show>

      {/* Delete Confirmation Modal */}
      <Show when={showDeleteModal()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg max-w-md w-full">
            <div class="p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 class="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    Delete List
                  </h3>
                  <p class="text-sm text-gray-600">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p class="text-gray-700 mb-6">
                Are you sure you want to delete "
                <strong>{selectedList()?.name}</strong>"? All{" "}
                {selectedList()?.itemCount} places in this list will be removed.
              </p>
              <div class="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  class="cb-button cb-button-secondary px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteList}
                  disabled={deleteListMutation.isPending}
                  class="cb-button bg-red-600 text-white hover:bg-red-700 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteListMutation.isPending ? "Deleting..." : "Delete List"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Show>

      {/* Create List with Data Modal */}
      <Show when={showCreateWithDataModal()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">
                    {createStep() === 1 ? "Create New List" : "Select Items to Add"}
                  </h2>
                  <p class="text-sm text-gray-600 mt-1">
                    {createStep() === 1 
                      ? "Create a list from your saved items" 
                      : `Step 2: Choose from your saved ${selectedContentType() === "poi" ? "places" : selectedContentType() + "s"}`
                    }
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateWithDataModal(false);
                    resetForm();
                  }}
                  class="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div class="flex-1 overflow-y-auto">
              <Show when={createStep() === 1}>
                {/* Step 1: List Form */}
                <div class="p-6">
                  {renderListForm()}
                  
                  {/* Content Type Selection */}
                  <div class="mt-6">
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                      What type of items would you like to add?
                    </label>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <For each={contentTypes}>
                        {(type) => {
                          const IconComponent = type.icon;
                          return (
                            <button
                              onClick={() => setSelectedContentType(type.value)}
                              class={`p-4 border-2 rounded-lg text-left transition-all ${
                                selectedContentType() === type.value
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div class="flex items-center gap-3">
                                <IconComponent class="w-5 h-5 text-gray-600" />
                                <span class="font-medium text-gray-900">{type.label}</span>
                              </div>
                            </button>
                          );
                        }}
                      </For>
                    </div>
                  </div>
                </div>
              </Show>

              <Show when={createStep() === 2}>
                {/* Step 2: Item Selection */}
                <div class="p-6">
                  {/* Search and Selected Count */}
                  <div class="flex flex-col sm:flex-row gap-4 mb-6">
                    <div class="flex-1 relative">
                      <input
                        type="text"
                        value={searchTerm()}
                        onInput={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Search your saved ${selectedContentType() === "poi" ? "places" : selectedContentType() + "s"}...`}
                        class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <Show when={selectedItems().length > 0}>
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-600">
                          {selectedItems().length} selected
                        </span>
                        <button
                          onClick={clearSelection}
                          class="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Clear
                        </button>
                      </div>
                    </Show>
                  </div>

                  {/* Items Grid */}
                  <Show
                    when={availableItems().length > 0}
                    fallback={
                      <div class="text-center py-12">
                        <Bookmark class="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">
                          No saved {selectedContentType() === "poi" ? "places" : selectedContentType() + "s"} found
                        </h3>
                        <p class="text-gray-600">
                          {searchTerm() 
                            ? "Try adjusting your search terms" 
                            : `Start saving ${selectedContentType() === "poi" ? "places" : selectedContentType() + "s"} to add them to lists`
                          }
                        </p>
                      </div>
                    }
                  >
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      <For each={availableItems()}>
                        {(item) => {
                          const isSelected = selectedItems().some(p => p.id === item.id);
                          return (
                            <div
                              onClick={() => toggleItemSelection(item)}
                              class={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div class="flex items-start gap-3">
                                <div class={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                                  isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                                }`}>
                                  <Show when={isSelected}>
                                    <Check class="w-3 h-3 text-white" />
                                  </Show>
                                </div>
                                <div class="flex-1 min-w-0">
                                  <h4 class="font-medium text-gray-900 truncate">
                                    {item.name}
                                  </h4>
                                  <Show when={item.description}>
                                    <p class="text-xs text-gray-600 mt-1 line-clamp-2">
                                      {item.description}
                                    </p>
                                  </Show>
                                  <Show when={item.category || item.cuisine}>
                                    <span class="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs mt-2">
                                      {item.category || item.cuisine}
                                    </span>
                                  </Show>
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      </For>
                    </div>
                  </Show>
                </div>
              </Show>
            </div>

            {/* Footer */}
            <div class="p-6 border-t border-gray-200 flex items-center justify-between">
              <Show when={createStep() === 2}>
                <button
                  onClick={() => setCreateStep(1)}
                  class="cb-button cb-button-secondary px-4 py-2"
                >
                  Back
                </button>
              </Show>
              
              <div class="flex items-center gap-3 ml-auto">
                <button
                  onClick={() => {
                    setShowCreateWithDataModal(false);
                    resetForm();
                  }}
                  class="cb-button cb-button-secondary px-4 py-2"
                >
                  Cancel
                </button>
                <Show when={createStep() === 1}>
                  <button
                    onClick={() => setCreateStep(2)}
                    disabled={!listForm().name.trim()}
                    class="cb-button cb-button-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Select Items
                  </button>
                </Show>
                <Show when={createStep() === 2}>
                  <button
                    onClick={createListWithData}
                    disabled={selectedItems().length === 0 || createListMutation.isPending}
                    class="cb-button cb-button-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createListMutation.isPending 
                      ? "Creating..." 
                      : `Create List (${selectedItems().length} items)`
                    }
                  </button>
                </Show>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
