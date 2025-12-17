// Export service API for PDF generation
import { createClient } from "@connectrpc/connect";
import {
    ExportService,
    ExportPOIsRequestSchema,
    ExportHotelsRequestSchema,
    ExportRestaurantsRequestSchema,
    ExportActivitiesRequestSchema,
    ExportItineraryRequestSchema,
    ExportListRequestSchema,
    type ExportPOI,
    type ExportHotel,
    type ExportRestaurant,
    type ExportActivity,
    type ExportItinerary,
} from "@buf/loci_loci-proto.bufbuild_es/loci/export/export_pb.js";
import { create } from "@bufbuild/protobuf";
import { transport } from "../connect-transport";
import type { SelectionItem } from "../hooks/useSelection";

// Create export client
const exportClient = createClient(ExportService, transport);

/**
 * Download a Uint8Array as a PDF file
 */
function downloadPDF(data: Uint8Array, filename: string): void {
    // Convert Uint8Array to regular array buffer for Blob compatibility
    const blob = new Blob([data.slice().buffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Convert SelectionItem to ExportPOI format
 * Only uses fields that exist on SelectionItem
 */
function selectionItemToExportPOI(item: SelectionItem): ExportPOI {
    return {
        id: item.id,
        name: item.name,
        category: item.category || "",
        description: item.description || "",
        address: item.address || "",
        latitude: item.latitude || 0,
        longitude: item.longitude || 0,
        rating: item.rating || 0,
        priceRange: "",
        phone: "",
        website: "",
        openingHours: "",
        $typeName: "loci.export.ExportPOI",
    };
}

/**
 * Export selected POIs to PDF
 */
export async function exportPOIsToPDF(
    items: SelectionItem[],
    title?: string
): Promise<void> {
    if (items.length === 0) {
        console.warn("export: No items to export");
        return;
    }

    console.log(`export: Exporting ${items.length} POIs to PDF...`);

    try {
        const response = await exportClient.exportPOIsToPDF(
            create(ExportPOIsRequestSchema, {
                pois: items.map(selectionItemToExportPOI),
                title: title || "Places of Interest",
            })
        );

        if (response.pdfData && response.pdfData.length > 0) {
            downloadPDF(response.pdfData, response.filename || "places.pdf");
            console.log(`export: Downloaded ${response.filename} (${response.sizeBytes} bytes)`);
        } else {
            throw new Error("No PDF data received from server");
        }
    } catch (error) {
        console.error("export: Failed to export POIs to PDF:", error);
        throw error;
    }
}

/**
 * Export hotels to PDF
 */
export async function exportHotelsToPDF(
    hotels: ExportHotel[],
    title?: string,
    cityName?: string
): Promise<void> {
    if (hotels.length === 0) return;

    try {
        const response = await exportClient.exportHotelsToPDF(
            create(ExportHotelsRequestSchema, {
                hotels,
                title: title || "Hotels",
                cityName: cityName || "",
            })
        );

        if (response.pdfData && response.pdfData.length > 0) {
            downloadPDF(response.pdfData, response.filename || "hotels.pdf");
        }
    } catch (error) {
        console.error("export: Failed to export hotels to PDF:", error);
        throw error;
    }
}

/**
 * Export restaurants to PDF
 */
export async function exportRestaurantsToPDF(
    restaurants: ExportRestaurant[],
    title?: string,
    cityName?: string
): Promise<void> {
    if (restaurants.length === 0) return;

    try {
        const response = await exportClient.exportRestaurantsToPDF(
            create(ExportRestaurantsRequestSchema, {
                restaurants,
                title: title || "Restaurants",
                cityName: cityName || "",
            })
        );

        if (response.pdfData && response.pdfData.length > 0) {
            downloadPDF(response.pdfData, response.filename || "restaurants.pdf");
        }
    } catch (error) {
        console.error("export: Failed to export restaurants to PDF:", error);
        throw error;
    }
}

/**
 * Export activities to PDF
 */
export async function exportActivitiesToPDF(
    activities: ExportActivity[],
    title?: string,
    cityName?: string
): Promise<void> {
    if (activities.length === 0) return;

    try {
        const response = await exportClient.exportActivitiesToPDF(
            create(ExportActivitiesRequestSchema, {
                activities,
                title: title || "Activities",
                cityName: cityName || "",
            })
        );

        if (response.pdfData && response.pdfData.length > 0) {
            downloadPDF(response.pdfData, response.filename || "activities.pdf");
        }
    } catch (error) {
        console.error("export: Failed to export activities to PDF:", error);
        throw error;
    }
}

/**
 * Export itinerary to PDF
 */
export async function exportItineraryToPDF(itinerary: ExportItinerary): Promise<void> {
    try {
        const response = await exportClient.exportItineraryToPDF(
            create(ExportItineraryRequestSchema, {
                itinerary,
            })
        );

        if (response.pdfData && response.pdfData.length > 0) {
            downloadPDF(response.pdfData, response.filename || "itinerary.pdf");
        }
    } catch (error) {
        console.error("export: Failed to export itinerary to PDF:", error);
        throw error;
    }
}

/**
 * Export list to PDF
 */
export async function exportListToPDF(
    listId: string,
    listName: string,
    pois: ExportPOI[] = [],
    hotels: ExportHotel[] = [],
    restaurants: ExportRestaurant[] = []
): Promise<void> {
    try {
        const response = await exportClient.exportListToPDF(
            create(ExportListRequestSchema, {
                listId,
                listName,
                pois,
                hotels,
                restaurants,
            })
        );

        if (response.pdfData && response.pdfData.length > 0) {
            downloadPDF(response.pdfData, response.filename || "list.pdf");
        }
    } catch (error) {
        console.error("export: Failed to export list to PDF:", error);
        throw error;
    }
}

// Re-export types for convenience
export type { ExportPOI, ExportHotel, ExportRestaurant, ExportActivity, ExportItinerary };
