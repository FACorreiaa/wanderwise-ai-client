// Trip (editable day-by-day itinerary) queries + mutations over TripService.
import { useQuery, useMutation, useQueryClient } from "@tanstack/solid-query";
import { createClient } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
import { timestampDate, timestampFromDate } from "@bufbuild/protobuf/wkt";
import {
  TripService,
  TripDraftSchema,
  TripConstraintSchema,
  SaveTripRequestSchema,
  GetTripRequestSchema,
  ListTripsRequestSchema,
  ShareTripRequestSchema,
  ReorderStopsRequestSchema,
  AddStopRequestSchema,
  RemoveStopRequestSchema,
  ReplaceStopRequestSchema,
  RenameStopRequestSchema,
  EditStopDurationRequestSchema,
  SetConstraintRequestSchema,
  ExportTripRequestSchema,
  ExportFormat,
  TripPace,
  TripStopSchema,
  type TripDraft as ProtoTripDraft,
  type TripConstraint as ProtoTripConstraint,
} from "@buf/loci_loci-proto.bufbuild_es/loci/trip/trip_pb.js";
import { PaginationRequestSchema } from "@buf/loci_loci-proto.bufbuild_es/loci/common/common_pb.js";
import { transport } from "../connect-transport";
import { cacheTripOffline, getCachedTrip } from "../trip-offline-cache";
import {
  fromProtoRecommendationTrace,
  recordRecommendationEvents,
  toProtoRecommendationTrace,
  type RecommendationTrace,
} from "./recommendations";

const tripClient = createClient(TripService, transport);

// ---- client-facing types ----

export type { TripPace };

export interface TripStop {
  id: string;
  poiId: string;
  orderIndex: number;
  name: string;
  startMinute?: number;
  durationMinutes?: number;
  notes: string;
  bookingUrl?: string;
  recommendationTrace?: RecommendationTrace;
}

export interface TripDay {
  id: string;
  dayNumber: number;
  date?: string; // ISO
  stops: TripStop[];
}

export interface TripConstraint {
  budgetLevel?: number;
  pace: TripPace;
  mobility?: string;
  interests: string[];
  dayStartMinute?: number;
  dayEndMinute?: number;
}

export interface Trip {
  id: string;
  userId: string;
  cityId?: string;
  cityName: string;
  title: string;
  constraints: TripConstraint;
  days: TripDay[];
  version: bigint;
  sourceSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- mappers ----

const mapConstraint = (c?: ProtoTripConstraint): TripConstraint => ({
  budgetLevel: c?.budgetLevel,
  pace: c?.pace ?? TripPace.UNSPECIFIED,
  mobility: c?.mobility,
  interests: c?.interests ?? [],
  dayStartMinute: c?.dayStartMinute,
  dayEndMinute: c?.dayEndMinute,
});

const mapTrip = (p: ProtoTripDraft): Trip => ({
  id: p.id,
  userId: p.userId,
  cityId: p.cityId,
  cityName: p.cityName,
  title: p.title,
  constraints: mapConstraint(p.constraints),
  version: p.version,
  sourceSessionId: p.sourceSessionId,
  createdAt: p.createdAt ? timestampDate(p.createdAt).toISOString() : new Date().toISOString(),
  updatedAt: p.updatedAt ? timestampDate(p.updatedAt).toISOString() : new Date().toISOString(),
  days: (p.days ?? []).map((d) => ({
    id: d.id,
    dayNumber: d.dayNumber,
    date: d.date ? timestampDate(d.date).toISOString() : undefined,
    stops: (d.stops ?? []).map((s) => ({
      id: s.id,
      poiId: s.poiId,
      orderIndex: s.orderIndex,
      name: s.name,
      startMinute: s.startMinute,
      durationMinutes: s.durationMinutes,
      notes: s.notes,
      bookingUrl: s.bookingUrl,
      recommendationTrace: fromProtoRecommendationTrace(s.recommendationTrace),
    })),
  })),
});

// Build the proto TripDraft for a save. Server-owned fields (ids, timestamps,
// user_id) are filled with placeholders to satisfy validation; the server
// assigns the real values (new day/stop ids are generated on insert).
const toProtoStop = (s: TripStop) =>
  create(TripStopSchema, {
    id: s.id || crypto.randomUUID(),
    poiId: s.poiId,
    orderIndex: s.orderIndex,
    name: s.name || "Stop",
    startMinute: s.startMinute,
    durationMinutes: s.durationMinutes,
    notes: s.notes,
    bookingUrl: s.bookingUrl,
    recommendationTrace: toProtoRecommendationTrace(s.recommendationTrace),
  });

const toProtoTrip = (t: Trip) =>
  create(TripDraftSchema, {
    id: t.id || "",
    userId: t.userId || "self",
    cityId: t.cityId,
    cityName: t.cityName,
    title: t.title || "Untitled Trip",
    version: t.version ?? 0n,
    sourceSessionId: t.sourceSessionId,
    createdAt: timestampFromDate(new Date()),
    updatedAt: timestampFromDate(new Date()),
    constraints: create(TripConstraintSchema, {
      budgetLevel: t.constraints.budgetLevel,
      pace: t.constraints.pace,
      mobility: t.constraints.mobility,
      interests: t.constraints.interests,
      dayStartMinute: t.constraints.dayStartMinute,
      dayEndMinute: t.constraints.dayEndMinute,
    }),
    days: t.days.map((d) => ({
      id: d.id || crypto.randomUUID(),
      dayNumber: d.dayNumber,
      date: d.date ? timestampFromDate(new Date(d.date)) : undefined,
      stops: d.stops.map(toProtoStop),
    })),
  });

// ---- query keys ----
const tripKeys = {
  all: ["trips"] as const,
  list: () => ["trips", "list"] as const,
  detail: (id: string) => ["trips", "detail", id] as const,
};

// ---- queries ----

export const useTrips = () =>
  useQuery(() => ({
    queryKey: tripKeys.list(),
    queryFn: async () => {
      const res = await tripClient.listTrips(
        create(ListTripsRequestSchema, {
          pagination: create(PaginationRequestSchema, { page: 1, pageSize: 50 }),
        }),
      );
      return res.trips.map(mapTrip);
    },
  }));

export const useTrip = (id: () => string | undefined) =>
  useQuery(() => ({
    queryKey: tripKeys.detail(id() ?? ""),
    enabled: !!id(),
    queryFn: async () => {
      const res = await tripClient.getTrip(create(GetTripRequestSchema, { tripId: id()! }));
      const trip = mapTrip(res);
      cacheTripOffline(trip);
      return trip;
    },
    // Serve last cached copy while offline / before network returns.
    placeholderData: () => getCachedTrip(id() ?? ""),
    networkMode: "offlineFirst",
  }));

// ---- mutations ----

export const useSaveTrip = () => {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: async (input: { trip: Trip; baseVersion: bigint }) => {
      const res = await tripClient.saveTrip(
        create(SaveTripRequestSchema, {
          trip: toProtoTrip(input.trip),
          baseVersion: input.baseVersion,
        }),
      );
      return mapTrip(res);
    },
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: tripKeys.list() });
      qc.setQueryData(tripKeys.detail(t.id), t);
    },
  }));
};

// Each fine-grained mutation returns the updated trip (bumped version).
const detailMutation = <TInput>(
  fn: (input: TInput) => Promise<ProtoTripDraft>,
  afterSuccess?: (trip: Trip, input: TInput) => void,
) => {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: async (input: TInput) => mapTrip(await fn(input)),
    onSuccess: (t: Trip, input: TInput) => {
      qc.setQueryData(tripKeys.detail(t.id), t);
      afterSuccess?.(t, input);
    },
  }));
};

export const useReorderStops = () =>
  detailMutation(
    (i: { tripId: string; dayId: string; orderedStopIds: string[]; baseVersion: bigint }) =>
      tripClient.reorderStops(create(ReorderStopsRequestSchema, i)),
  );

export const useRenameStop = () =>
  detailMutation((i: { tripId: string; stopId: string; name: string; baseVersion: bigint }) =>
    tripClient.renameStop(create(RenameStopRequestSchema, i)),
  );

export const useEditStopDuration = () =>
  detailMutation(
    (i: {
      tripId: string;
      stopId: string;
      startMinute?: number;
      durationMinutes: number;
      baseVersion: bigint;
    }) => tripClient.editStopDuration(create(EditStopDurationRequestSchema, i)),
  );

export const useSetConstraint = () =>
  detailMutation((i: { tripId: string; constraints: TripConstraint; baseVersion: bigint }) =>
    tripClient.setConstraint(
      create(SetConstraintRequestSchema, {
        tripId: i.tripId,
        baseVersion: i.baseVersion,
        constraints: create(TripConstraintSchema, i.constraints),
      }),
    ),
  );

export const useAddStop = () =>
  detailMutation(
    (i: { tripId: string; dayId: string; stop: TripStop; baseVersion: bigint }) =>
      tripClient.addStop(
        create(AddStopRequestSchema, {
          tripId: i.tripId,
          dayId: i.dayId,
          stop: toProtoStop(i.stop),
          baseVersion: i.baseVersion,
        }),
      ),
    (trip, input) => {
      if (!input.stop.recommendationTrace) return;
      void recordRecommendationEvents([
        {
          eventType: "RECOMMENDATION_EVENT_TYPE_ADDED_TO_TRIP",
          trace: input.stop.recommendationTrace,
          poiId: input.stop.poiId,
          tripId: trip.id,
        },
      ]);
    },
  );

export const useRemoveStop = () =>
  detailMutation(
    (i: { tripId: string; stop: TripStop; baseVersion: bigint }) =>
      tripClient.removeStop(
        create(RemoveStopRequestSchema, {
          tripId: i.tripId,
          stopId: i.stop.id,
          baseVersion: i.baseVersion,
        }),
      ),
    (trip, input) => {
      if (!input.stop.recommendationTrace) return;
      void recordRecommendationEvents([
        {
          eventType: "RECOMMENDATION_EVENT_TYPE_REMOVED_FROM_TRIP",
          trace: input.stop.recommendationTrace,
          poiId: input.stop.poiId,
          tripId: trip.id,
        },
      ]);
    },
  );

export const useReplaceStop = () =>
  detailMutation(
    (i: { tripId: string; currentStop: TripStop; replacement: TripStop; baseVersion: bigint }) =>
      tripClient.replaceStop(
        create(ReplaceStopRequestSchema, {
          tripId: i.tripId,
          stopId: i.currentStop.id,
          replacement: toProtoStop(i.replacement),
          baseVersion: i.baseVersion,
        }),
      ),
    (trip, input) => {
      const events = [];
      if (input.currentStop.recommendationTrace) {
        events.push({
          eventType: "RECOMMENDATION_EVENT_TYPE_REMOVED_FROM_TRIP" as const,
          trace: input.currentStop.recommendationTrace,
          poiId: input.currentStop.poiId,
          tripId: trip.id,
          metadata: { action: "replaced" },
        });
      }
      if (input.replacement.recommendationTrace) {
        events.push({
          eventType: "RECOMMENDATION_EVENT_TYPE_ADDED_TO_TRIP" as const,
          trace: input.replacement.recommendationTrace,
          poiId: input.replacement.poiId,
          tripId: trip.id,
          metadata: { action: "replacement" },
        });
      }
      void recordRecommendationEvents(events);
    },
  );

export const useShareTrip = () =>
  useMutation(() => ({
    mutationFn: async (i: { tripId: string; isPublic: boolean }) =>
      tripClient.shareTrip(create(ShareTripRequestSchema, i)),
  }));

// Export a trip to ICS and trigger a browser download.
export const exportTripICS = async (tripId: string, trip?: Trip) =>
  exportTrip(tripId, ExportFormat.ICS, trip);

/** Export trip as PDF (Pro-gated on server for multi-day; client soft-gates UX). */
export const exportTripPDF = async (tripId: string, trip?: Trip) =>
  exportTrip(tripId, ExportFormat.PDF, trip);

/** Export trip as Markdown (Pro-only on server). */
export const exportTripMarkdown = async (tripId: string, trip?: Trip) =>
  exportTrip(tripId, ExportFormat.MARKDOWN, trip);

async function exportTrip(tripId: string, format: ExportFormat, trip?: Trip) {
  const res = await tripClient.exportTrip(create(ExportTripRequestSchema, { tripId, format }));
  const blob = new Blob([res.data as unknown as BlobPart], {
    type:
      res.contentType ||
      (format === ExportFormat.PDF
        ? "application/pdf"
        : format === ExportFormat.MARKDOWN
          ? "text/markdown;charset=utf-8"
          : "text/calendar"),
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    res.filename ||
    (format === ExportFormat.PDF
      ? "trip.pdf"
      : format === ExportFormat.MARKDOWN
        ? "trip.md"
        : "trip.ics");
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  if (trip) {
    void recordRecommendationEvents(
      trip.days.flatMap((day) =>
        day.stops
          .filter((stop) => stop.recommendationTrace)
          .map((stop) => ({
            eventType: "RECOMMENDATION_EVENT_TYPE_EXPORTED" as const,
            trace: stop.recommendationTrace!,
            poiId: stop.poiId,
            tripId,
            metadata: { format: ExportFormat[format]?.toLowerCase() || String(format) },
          })),
      ),
    );
  }
}
