import type { Trip, TripDay, TripStop } from "~/lib/api/trips";
import { TripPace } from "@buf/loci_loci-proto.bufbuild_es/loci/trip/trip_pb.js";

const PACE: Record<number, string> = {
  [TripPace.UNSPECIFIED]: "",
  [TripPace.RELAXED]: "Relaxed",
  [TripPace.MODERATE]: "Moderate",
  [TripPace.PACKED]: "Packed",
};

function minutesLabel(m?: number): string {
  if (m == null) return "";
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function stopLine(s: TripStop): string {
  const time = minutesLabel(s.startMinute);
  const dur = s.durationMinutes ? ` (${s.durationMinutes} min)` : "";
  const head = time ? `- **${time}** ${s.name}${dur}` : `- ${s.name}${dur}`;
  if (s.notes?.trim()) {
    return `${head}\n  - _Why this:_ ${s.notes.trim()}`;
  }
  return head;
}

function daySection(d: TripDay): string {
  const date = d.date ? ` — ${new Date(d.date).toLocaleDateString()}` : "";
  const stops = d.stops.map(stopLine).join("\n");
  return `## Day ${d.dayNumber}${date}\n\n${stops || "_No stops._"}\n`;
}

/** Render an editable trip as Markdown (Pro export — client-side until proto MARKDOWN lands). */
export function tripToMarkdown(trip: Trip): string {
  const lines: string[] = [`# ${trip.title}`, ""];
  if (trip.cityName) lines.push(`**City:** ${trip.cityName}`);
  const pace = PACE[trip.constraints.pace];
  if (pace) lines.push(`**Pace:** ${pace}`);
  if (trip.constraints.mobility) lines.push(`**Mobility:** ${trip.constraints.mobility}`);
  if (trip.constraints.interests?.length) {
    lines.push(`**Interests:** ${trip.constraints.interests.join(", ")}`);
  }
  lines.push("", `*Exported from Loci · updated ${new Date(trip.updatedAt).toLocaleString()}*`, "");
  for (const day of trip.days) {
    lines.push(daySection(day));
  }
  return lines.join("\n").trim() + "\n";
}

export function downloadTripMarkdown(trip: Trip): void {
  const md = tripToMarkdown(trip);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safe = (trip.title || "trip").replace(/[^\w-]+/g, "_").slice(0, 80);
  a.download = `${safe || "trip"}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
