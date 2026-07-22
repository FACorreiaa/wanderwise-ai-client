# Loci web design system

Loci is a modern field guide for travel recommendations and editable adventures. The product should feel observant, grounded, and useful outdoors—not like a generic AI dashboard.

Quality bar: **Flighty-class polish** (fluid motion, map as a living surface, calm density, native-feeling micro-interactions) expressed through **Loci's own theme**—not flight-tracker UI, not purple AI chrome, not Expo defaults.

## Visual language

- Warm parchment backgrounds, deep forest ink, muted sage support, and terracotta for actions and map marks.
- `Fraunces` for destination and journey headlines, `DM Sans` for interface copy, and `Space Mono` for coordinates, route numbers, evidence, and status labels.
- Cartographic contours, route lines, stamps, and field-note labels are the recurring motifs.
- Surfaces are mostly flat with a visible one-pixel border. Use shadows only to establish navigation, overlays, or hover lift.
- The single brand system is `loci`; light, dark, and system are appearance modes rather than separate design themes.

## Product hierarchy

The primary journeys are Discover, Nearby, Trips, and Ask Loci. Favorites, recents, lists, travel profiles, contribution, and settings support those journeys and live in the account field kit.

Recommendation cards should communicate:

1. what the place is;
2. why it fits;
3. how current or trustworthy the facts are;
4. the next useful action—keep, add to a trip, replace, or dismiss.

## Map language

- Basemap follows light/dark appearance; markers and routes carry brand color (forest → sage → terracotta day scale).
- Clusters use forest ink, not generic blue.
- Popups are field notes: title, category, rating/time/budget, optional dog-friendly label—no emoji badges.
- Route lines draw in with a short opacity settle; selection enlarges the mark and flies the camera.
- On spatial journeys (Nearby, itinerary, trip editor), map can be **hero**—full bleed or dominant panel—not only an inset utility.

## Chat composition

- User messages: compact primary bubbles.
- Assistant text: flat card bubble; **structured results live outside the bubble** in `.loci-card` / editorial stream—not nested glass stacks.
- Floating chat and full `/chat` share the same bubble, composer, and embed materials.
- Streaming: quiet phase rail + progressive card arrival; no emoji-as-navigation in quick prompts.

## Motion vocabulary

| Token             | Use                     | Default            |
| ----------------- | ----------------------- | ------------------ |
| `resultArrive`    | Card/list stagger       | 400ms, ease-enter  |
| `selectionSettle` | Map/list selection      | 250ms, ease-settle |
| `routeDraw`       | Route line appear       | 800ms opacity      |
| `sheetPresent`    | Overlays, split toggles | 300ms              |
| `press`           | Buttons, tappable cards | scale 0.98         |

Respect `prefers-reduced-motion`: disable stagger, route draw, and scale press.

CSS: `--motion-*`, `--ease-*` in `motion-tokens.css`; stagger in `animations.css`.

## Surface materials

| Class                    | When                                                                           |
| ------------------------ | ------------------------------------------------------------------------------ |
| `.loci-card`             | Default content container (flat + border)                                      |
| `.loci-card-interactive` | Tappable POI/trip/list rows                                                    |
| `.island-panel`          | **One** floating overlay (nav sheet, map toggle, chat widget)—not stacked blur |
| `.trust-chip`            | Why-this-stop / rationale                                                      |

Avoid `.glass-panel` + `backdrop-blur-xl` nesting. Legacy `.glass-panel` maps to flat card styling in base.css.

## Interaction rules

- Prefer direct manipulation and progressive updates. Streaming results should appear as they arrive.
- Every interactive control needs a visible focus state and a minimum 44px mobile target.
- Motion is limited to route drawing, result arrival, and small state transitions; respect reduced-motion preferences.
- Avoid decorative gradients, excessive pills, nested card stacks, emoji-as-navigation, rainbow map day dots, hardcoded blue SaaS chrome, and fake metrics.

## Anti-patterns (Flighty-quality / Loci-theme)

- Purple-on-white or indigo AI dashboard themes
- Mapbox default blue clusters and rainbow itinerary pins
- Emoji in nav, quick prompts, or map popups
- Dual chat quality (rich `/chat` vs plain floating widget)
- Nested `backdrop-blur` panels inside chat bubbles

## Trust and learning

- Explain recommendation rationale near the recommendation (`WhyThisStop` / `.trust-chip`).
- Keep private personalization and aggregate quality contribution as separate controls.
- Make learned taste traits inspectable and resettable.
- Community place facts show confidence, contributor count, verification date, and expiry.

## Native parity

Implementation-ready SwiftUI + Jetpack Compose guidance: [docs/NATIVE_DESIGN.md](docs/NATIVE_DESIGN.md).
