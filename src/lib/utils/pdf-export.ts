// PDF Export utilities - Wraps the Export API service
import type { SelectionItem } from "../hooks/useSelection";
import { exportPOIsToPDF as exportPOIsAPI } from "../api/export";

/**
 * Export selected POIs to PDF format
 * This is a convenience wrapper around the Export API
 */
export async function exportPOIsToPDF(items: SelectionItem[], title?: string): Promise<void> {
  if (items.length === 0) {
    console.warn("pdf-export: No items to export");
    return;
  }

  console.log(`pdf-export: Exporting ${items.length} items to PDF...`);

  try {
    await exportPOIsAPI(items, title);
    console.log("pdf-export: Export complete");
  } catch (error) {
    console.error("pdf-export: Export failed:", error);
    // Fallback to JSON export on error
    console.log("pdf-export: Falling back to JSON export");
    exportPOIsToJSON(items);
  }
}

/**
 * Export selected POIs to JSON format (fallback/works immediately)
 */
export function exportPOIsToJSON(items: SelectionItem[], filename = "places.json"): void {
  const data = JSON.stringify(items, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
