import { A, useParams } from "@solidjs/router";
import {
  ArrowLeft,
  Bookmark,
  Check,
  Edit,
  Folder,
  Heart,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-solid";
import { For, Show, createMemo, createSignal } from "solid-js";
import {
  useAddToListMutation,
  useList,
  useRemoveFromListMutation,
  useSavedLists,
} from "~/lib/api/lists";
import { useFavorites } from "~/lib/api/pois";
import { useBookmarkedItineraries } from "~/lib/api/itineraries";

export default function ListDetailsPage() {
  const params = useParams();
  console.log('List ID from URL params:', params.id); // Debug log
  const listQuery = useList(params.id);
  const removeFromListMutation = useRemoveFromListMutation();
  const addToListMutation = useAddToListMutation();

  const [showAddItemModal, setShowAddItemModal] = createSignal(false);
  const [selectedContentType, setSelectedContentType] = createSignal("poi");
  const [selectedItem, setSelectedItem] = createSignal("");

  const list = () => listQuery.data;

  // Data queries for list creation
  const favoritesQuery = useFavorites(
    () => 1,
    () => 100,
  );
  const savedListsQuery = useSavedLists();
  const bookmarkedItinerariesQuery = useBookmarkedItineraries(
    () => 1,
    () => 100,
  );

  // Extract restaurants and hotels from POI favorites by category
  const allFavorites = () => favoritesQuery.data?.data || [];
  const restaurantFavorites = () =>
    allFavorites().filter(
      (poi) =>
        poi.category?.toLowerCase().includes("restaurant") ||
        poi.category?.toLowerCase().includes("food") ||
        poi.category?.toLowerCase().includes("dining"),
    );
  const hotelFavorites = () =>
    allFavorites().filter(
      (poi) =>
        poi.category?.toLowerCase().includes("hotel") ||
        poi.category?.toLowerCase().includes("accommodation") ||
        poi.category?.toLowerCase().includes("lodging"),
    );

  // Computed data based on selected content type
  const availableItems = createMemo(() => {
    switch (selectedContentType()) {
      case "restaurant":
        return restaurantFavorites();
      case "hotel":
        return hotelFavorites();
      case "itinerary":
        return bookmarkedItinerariesQuery.data?.data || [];
      case "list":
        return savedListsQuery.data || [];
      default:
        // For POIs, exclude restaurants and hotels to avoid duplicates
        return allFavorites().filter((poi) => {
          const category = poi.category?.toLowerCase() || "";
          return (
            !category.includes("restaurant") &&
            !category.includes("food") &&
            !category.includes("dining") &&
            !category.includes("hotel") &&
            !category.includes("accommodation") &&
            !category.includes("lodging")
          );
        });
    }
  });

  const contentTypes = [
    { value: "poi", label: "Saved Attractions", icon: MapPin },
    { value: "restaurant", label: "Saved Restaurants", icon: Heart },
    { value: "hotel", label: "Saved Hotels", icon: Folder },
    { value: "itinerary", label: "Saved Itineraries", icon: Bookmark },
    { value: "list", label: "Saved Lists", icon: Folder },
  ];

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromListMutation.mutateAsync({
        listId: params.id,
        itemId,
      });
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleAddItem = async () => {
    try {
      const itemId = selectedItem();
      if (!itemId) {
        return;
      }

      await addToListMutation.mutateAsync({
        listId: params.id,
        itemData: {
          item_id: itemId,
          content_type: selectedContentType(),
          position: 0,
          notes: "",
        },
      });
      
      setShowAddItemModal(false);
      setSelectedItem("");
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  const resetModal = () => {
    setSelectedItem("");
    setSelectedContentType("poi");
  };

  return (
    <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div class="max-w-4xl mx-auto">
        <A
          href="/lists"
          class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft class="w-4 h-4" />
          Back to all lists
        </A>

        <Show when={list()} keyed>
          {(listData) => (
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{listData.name}</h1>
              <p class="text-lg text-gray-600 mt-2">{listData.description}</p>

              <div class="mt-8">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-2xl font-semibold text-gray-900">
                    Items in this list
                  </h2>
                  <button
                    onClick={() => setShowAddItemModal(true)}
                    class="cb-button cb-button-primary px-4 py-2 flex items-center gap-2"
                  >
                    <Plus class="w-4 h-4" />
                    Add Item
                  </button>
                </div>
                <div class="bg-white rounded-lg shadow overflow-hidden">
                  <ul class="divide-y divide-gray-200">
                    <For
                      each={listData.items}
                      fallback={
                        <li class="p-4 text-center text-gray-500">
                          No items in this list yet.
                        </li>
                      }
                    >
                      {(item) => (
                        <li class="p-4 flex items-center justify-between">
                          <div>
                            <p class="font-semibold text-gray-800">
                              {item.poi?.name || "Unknown Item"}
                            </p>
                            <p class="text-sm text-gray-600">
                              {item.poi?.description}
                            </p>
                          </div>
                          <div class="flex items-center gap-2">
                            <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                              <Edit class="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                            >
                              <Trash2 class="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </Show>

        <Show when={listQuery.isLoading}>
          <p>Loading...</p>
        </Show>

        <Show when={listQuery.isError}>
          <p class="text-red-500">Error loading list details.</p>
        </Show>
      </div>

      {/* Add Item Modal */}
      <Show when={showAddItemModal()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">
                    Add Item to List
                  </h2>
                  <p class="text-sm text-gray-600 mt-1">
                    Select from your saved items
                  </p>
                </div>
                <button
                  onClick={() => setShowAddItemModal(false)}
                  class="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div class="p-6 space-y-6">
              {/* Content Type Selection */}
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  What type of item would you like to add?
                </label>
                <select
                  value={selectedContentType()}
                  onInput={(e) => {
                    setSelectedContentType(e.target.value);
                    setSelectedItem(""); // Reset selected item when type changes
                  }}
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <For each={contentTypes}>
                    {(type) => (
                      <option value={type.value}>{type.label}</option>
                    )}
                  </For>
                </select>
              </div>

              {/* Item Selection */}
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Select an item to add
                </label>
                <Show
                  when={availableItems().length > 0}
                  fallback={
                    <div class="text-center py-8">
                      <Bookmark class="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p class="text-gray-600 text-sm">
                        No saved {selectedContentType() === "poi" ? "attractions" : selectedContentType() + "s"} found
                      </p>
                    </div>
                  }
                >
                  <select
                    value={selectedItem()}
                    onInput={(e) => setSelectedItem(e.target.value)}
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose {selectedContentType() === "poi" ? "an attraction" : selectedContentType() === "itinerary" ? "an itinerary" : "a " + selectedContentType()}...</option>
                    <For each={availableItems()}>
                      {(item) => {
                        // Get the correct ID and name fields based on content type
                        const itemId = selectedContentType() === "list" ? item.ID : item.id;
                        const itemName = selectedContentType() === "itinerary" 
                          ? item.title
                          : selectedContentType() === "list"
                          ? item.Name
                          : item.name;
                        
                        return (
                          <option value={itemId}>{itemName}</option>
                        );
                      }}
                    </For>
                  </select>
                </Show>
              </div>
            </div>

            {/* Footer */}
            <div class="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddItemModal(false);
                  resetModal();
                }}
                class="cb-button cb-button-secondary px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={
                  !selectedItem() || addToListMutation.isPending
                }
                class="cb-button cb-button-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addToListMutation.isPending
                  ? "Adding..."
                  : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
