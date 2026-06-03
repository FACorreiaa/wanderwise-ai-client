# Streaming Itinerary — Mobile UX & Component Architecture

**Framework:** SolidJS (SolidJS Start) — confirmed from `package.json`. Everything
below uses Solid's fine-grained reactivity, which is the ideal model for this
3-phase stream: we patch one field of one row and only that DOM node updates.
No virtual-DOM diff, no list re-render, no jank.

**Aesthetic:** the existing `loci` theme — Space Grotesk display / DM Sans body,
blue `--primary` + gold `--accent`, `--radius: 1.25rem`. Editorial / magazine
travel feel. All new UI is token-driven so it themes across `classic` / `modern`
/ `loci` / dark automatically.

---

## 1. The three phases → three visual states

| Backend phase | Arrives | UI state | What the user sees |
|---|---|---|---|
| 1 · Skeleton (text-only) | <500ms | `skeleton` → `enriching` | Real day-plan text **instantly**: names, categories, blurbs, durations. Image slots shimmer. |
| 2 · Enrichment (`place_id` + `image_url` per item) | streamed, 0.5–3s | `enriching` | Each card's photo + rating chip pops in independently, with a one-shot accent bloom. Progress rail counts `n/total`. |
| 3 · Done | 3–5s | `done` | Rail collapses to a quiet "Itinerary ready · N stops". |

The app feels instant because **phase 1 paints a complete, readable itinerary**.
Images are progressive enhancement, never a blocker.

---

## 2. Files delivered

```
src/lib/itinerary/createItineraryStream.ts   # reactive engine + SSE consumer + adapter
src/components/itinerary/ProgressiveImage.tsx # lazy + LQIP + blur-up + error
src/components/itinerary/StopCardSkeleton.tsx # shimmer, zero-layout-shift
src/components/itinerary/StopCard.tsx         # editorial card + enrich bloom
src/components/itinerary/ItineraryStreamView.tsx # orchestrator (header, rail, list)
src/components/ui/SectionHeader.tsx           # reusable editorial kicker+title
src/styles/editorial.css                      # tokenized motion/skeleton/blur-up layer
```

Wired into `src/routes/itinerary/index.tsx`.

---

## 3. How each brief requirement is met

### Skeleton screen (shimmer placeholders)
`StopCardSkeleton` mirrors `StopCard`'s **exact geometry** (88/112px image tile +
text lines) so the skeleton→real swap shifts nothing. Shimmer is a token-based
`::after` sweep (`.shimmer` in `editorial.css`) that reads on light and dark.
Before any skeleton text arrives we render `skeletonCount` (default 5) rows.

### Patching enrichment chunks without jank
The engine holds stops in a Solid `createStore`. One chunk =
`setState("stops", i, patch)` — mutates that row's proxy **in place**. The array
ref and every other row ref are unchanged, so `<For>` recreates nothing; only the
fine-grained accessors that read the patched fields update. This is the core
anti-jank mechanism. Match is by stable `key` (`place_id` once known, else
`slug-index`), so out-of-order chunks land on the right card.

### Image loading strategy
`ProgressiveImage` does all five:
1. **Lazy** — `IntersectionObserver` (300px rootMargin); nothing fetched off-screen.
2. **LQIP placeholder** — deterministic hue-from-seed gradient, instant, stable, no CLS.
3. **Blur-up** — real image preloaded via `new Image()` + `.decode()`, then fades + un-scales in.
4. **Error state** — decode/`onerror` failure → `ImageOff` fallback tile.
5. **Enrichment-aware** — `src` is `undefined` until phase 2 reaches the stop; the
   frame shimmers, then loads the instant `src` arrives. No remount.

### Optimistic UI
Phase 1 itself is the optimism: a full itinerary renders before any place is
verified. Favoriting / saving should apply locally first and reconcile on ack
(see Lists below). The rating chip and photo are additive — their absence never
blanks the card.

### Smooth skeleton → enriched transition
- `.pi-img` opacity+scale blur-up (`transform: scale(1.04)→1`, 0.5/0.7s ease).
- `.enrich-bloom` — one-shot accent ring on the false→true `enriched` edge (fired
  once via `createEffect(on(..., { defer:true }))`).
- `.stop-enter` — staggered slide+fade as rows mount (`--i` inline delay).
- All wrapped in `@media (prefers-reduced-motion: reduce)`.

### List performance (the FlatList/LazyColumn equivalent)
- Solid `<For>` is keyed by reference and never re-diffs unchanged rows — the
  cheapest possible list update model for streaming patches.
- Images are lazy + async-decoded, off the render path.
- `will-change: transform` only on cards; animations are GPU compositor props
  (opacity/transform) — no layout thrash.
- For very long itineraries (100+ stops) add windowing with
  `@tanstack/solid-virtual` around the same `<For>` body; `StopCard` is fixed-height
  so estimation is trivial. Not needed at typical day-plan lengths (5–30 stops).

---

## 4. Wiring the real Go SSE stream

The engine is transport-agnostic. When the backend emits true phased events:

```ts
const stream = createItineraryStream();
const res = await fetch(url, { method: "POST", headers, body, signal });
await stream.consumeSSE(res, signal);
// render <ItineraryStreamView {...stream.state} />
```

Expected `data:` JSON per line (snake/camel both tolerated):

```jsonc
{ "type": "skeleton", "title": "...", "summary": "...",
  "stops": [{ "name": "...", "category": "...", "blurb": "...", "time_to_spend": "2h" }] }
{ "type": "enrich", "key": "...|index", "place_id": "...", "image_url": "...", "rating": 4.6 }
{ "type": "done" }
```

**Today** the backend returns a single `AiCityResponse`. `stopsFromCityResponse()`
adapts that into the same skeleton→enriched shape (a stop is "enriched" once it has
`images[0]` or `id`), so the editorial progressive UI is live now and needs **zero
changes** when phasing ships — just swap the adapter memo for `consumeSSE`.

---

## 5. Broad pass — applying the editorial system to the other views

One shared rhythm everywhere: `SectionHeader` (kicker + tight title) + `.editorial-card`
+ semantic tokens (`bg-card`, `text-muted-foreground`, `bg-primary`, `text-accent`,
`border-border`). Replace every hardcoded `bg-white` / `text-gray-*` / `from-[#hex]`
/ `focus:ring-blue-500` with tokens (as done in Settings).

### Settings — DONE
Hero gradient, tab nav, cards, inputs, completion bar all tokenized to
primary/accent/card/foreground. Space Grotesk headings via global theme. No
hardcoded hex or gray-scale slop remains.

### Discover (`routes/discover.tsx`, `components/results/*`)
- Top: `SectionHeader kicker="Tonight in {city}" title="..."`.
- Results grids (`RestaurantResults`/`HotelResults`/`ActivityResults`): swap their
  card shells to `.editorial-card` and their images to `ProgressiveImage` — they get
  lazy/blur-up/error for free and match the itinerary cards.
- The existing `Skeleton*Card` components → restyle with `.shimmer` for one skeleton language.

### Lists / Favorites / Bookmarks (`routes/lists`, `favorites`, `bookmarks`, `recents`)
- Reuse `StopCard` for saved POIs (it's already a clean POI row).
- **Optimistic favorite/save:** flip the local store immediately, fire the mutation,
  roll back on error + toast. The heart never waits on the network.
- Empty states: `SectionHeader` + a single illustrative `.editorial-card` CTA, not a bare string.

### Profile (`routes/profile.tsx`, `profiles/`)
- Reuse the Settings hero pattern (now tokenized) for the profile banner.
- Stats as `.editorial-card` tiles; sections led by `SectionHeader` kickers
  ("Trips", "Saved", "Reviews").

### Chat (`components/chat/*`, `components/streaming/*`)
- `StreamingResponse.tsx` currently dumps raw JSON into a `<pre>` — replace its render
  with `ItineraryStreamView` fed by `createItineraryStream` so chat-initiated
  itineraries get the exact same editorial streaming experience as the itinerary route.
- `ChatInput` / quick prompts: token-ize, `.editorial-card` surfaces, accent send button.

---

## 6. Mobile specifics
- Touch targets ≥44px (stamps, chips, buttons already sized).
- `text-wrap: balance/pretty` on titles/leads for clean ragged edges on narrow screens.
- Cards are horizontal (image-left) for fast vertical scanning + small image payloads.
- Status rail is sticky-friendly and collapses on `done` to reclaim space.
- Everything honors `prefers-reduced-motion`.
