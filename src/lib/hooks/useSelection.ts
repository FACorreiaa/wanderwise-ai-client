import { createSignal } from "solid-js";

export interface SelectionItem {
  id: string;
  name: string;
  category?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
}

/**
 * Reusable selection hook for managing multi-select state
 */
export function useSelection<T extends SelectionItem>() {
  const [selectedIds, setSelectedIds] = createSignal<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = createSignal<Map<string, T>>(new Map());

  const isSelected = (id: string) => selectedIds().has(id);

  const toggleSelection = (item: T) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      return next;
    });

    setSelectedItems((prev) => {
      const next = new Map(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.set(item.id, item);
      }
      return next;
    });
  };

  const selectAll = (items: T[]) => {
    const newIds = new Set<string>(items.map((i) => i.id));
    const newItems = new Map<string, T>(items.map((i) => [i.id, i]));
    setSelectedIds(newIds);
    setSelectedItems(newItems);
  };

  const clearSelection = () => {
    setSelectedIds(new Set<string>());
    setSelectedItems(new Map<string, T>());
  };

  const count = () => selectedIds().size;

  const getSelectedItems = (): T[] => Array.from(selectedItems().values());

  return {
    selectedIds,
    isSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    count,
    getSelectedItems,
  };
}

export type UseSelectionReturn<T extends SelectionItem> = ReturnType<typeof useSelection<T>>;
