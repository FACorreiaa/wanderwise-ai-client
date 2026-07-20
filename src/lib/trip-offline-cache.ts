import type { Trip } from "~/lib/api/trips";

const STORAGE_KEY = "loci.offline.trips.v1";
const MAX_TRIPS = 12;

export interface CachedTripSummary {
  id: string;
  title: string;
  cityName: string;
  dayCount: number;
  updatedAt: string;
}

interface CacheFile {
  trips: Record<string, unknown>;
  order: string[]; // newest-first ids
}

function read(): CacheFile {
  if (typeof localStorage === "undefined") return { trips: {}, order: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { trips: {}, order: [] };
    const parsed = JSON.parse(raw) as CacheFile;
    if (!parsed?.trips || !Array.isArray(parsed.order)) return { trips: {}, order: [] };
    return parsed;
  } catch {
    return { trips: {}, order: [] };
  }
}

function write(file: CacheFile): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(file));
  } catch (e) {
    console.warn("offline trip cache write failed", e);
  }
}

function serializeTrip(trip: Trip): unknown {
  return { ...trip, version: trip.version.toString() };
}

function deserializeTrip(raw: unknown): Trip | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string") return undefined;
  return {
    ...(o as unknown as Trip),
    version: BigInt(typeof o.version === "string" || typeof o.version === "number" ? o.version : 0),
  };
}

/** Persist a full trip for offline reopen. Keeps last MAX_TRIPS. */
export function cacheTripOffline(trip: Trip): void {
  const file = read();
  file.trips[trip.id] = serializeTrip(trip);
  file.order = [trip.id, ...file.order.filter((id) => id !== trip.id)].slice(0, MAX_TRIPS);
  for (const id of Object.keys(file.trips)) {
    if (!file.order.includes(id)) delete file.trips[id];
  }
  write(file);
}

export function getCachedTrip(id: string): Trip | undefined {
  if (!id) return undefined;
  return deserializeTrip(read().trips[id]);
}

export function listCachedTrips(): CachedTripSummary[] {
  const file = read();
  return file.order
    .map((id) => deserializeTrip(file.trips[id]))
    .filter((t): t is Trip => !!t)
    .map((t) => ({
      id: t.id,
      title: t.title,
      cityName: t.cityName,
      dayCount: t.days?.length ?? 0,
      updatedAt: t.updatedAt,
    }));
}

export function clearOfflineTripCache(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
