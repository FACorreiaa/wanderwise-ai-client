import type { SelectionItem } from "../hooks/useSelection";

/**
 * Export selected POIs to PDF format
 * TODO: Implement server-side PDF generation
 */
export async function exportPOIsToPDF(items: SelectionItem[]): Promise<void> {
    console.log("TODO: implement server-side PDF export", items);

    // Placeholder: Log selected items for now
    console.log(`Exporting ${items.length} items to PDF:`);
    items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.name} (${item.category || 'Unknown category'})`);
    });

    // TODO: Call server endpoint to generate PDF
    // const response = await fetch('/api/export/pdf', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ items }),
    // });
    // const blob = await response.blob();
    // downloadBlob(blob, 'places.pdf');
}

/**
 * Export selected POIs to JSON format (works immediately)
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
