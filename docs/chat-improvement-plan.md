# Plan — improve /chat layout + functionality

## Context

`/chat` (`src/routes/chat/index.tsx`) is a **1521-line monolith**: state, streaming
orchestration, session persistence, message formatting, and the entire JSX tree all
inline. A component set already exists under `src/components/chat/` (`ChatHeader`,
`ChatInput`, `ChatQuickPrompts`, `ChatSidebar` — 469 lines, exported via `index.ts`)
but the route **duplicates them inline instead of using them**. Alongside the
structure problem there are real bugs: history is wiped on every mount, `loadSession`
calls a REST endpoint that was deleted, the profile selector is fake, assistant
messages only appear on stream completion (no live text), there's no auto-scroll, no
markdown, dead Save/Share buttons, and ~50 `console.log`s.

Goal: decompose the route into the existing components + a `useChat` hook, fix the
layout, and repair the functional gaps — without changing the streaming contract
(`sendUnifiedChatMessageStream` / `ContinueChatStream` / `streamingService`).

---

## Part 1 — Decompose

Extract all non-view logic into a hook, compose the view from the existing
`components/chat/*`. Target: route file drops from ~1521 to ~150 lines (just wiring).

### 1.1 `src/lib/hooks/useChat.ts` (new)
Owns: `messages`, `currentMessage`, `isLoading`, `sessionId`, `streamingSession`,
`streamProgress`, `activeProfile`, `expandedResults`, and the actions
`sendMessage` / `startNewSession` / `continueExistingSession` / `newChat` /
`loadSession` / `toggleResultExpansion`. Lift these verbatim from the route, then
apply the Part 3 fixes. Returns a typed object the route spreads into components.
Reuse `detectDomain`, `domainToContextType`, `createStreamingSession`,
`sendUnifiedChatMessageStream`, `streamingService` (already imported in the route).

### 1.2 Compose the view
Replace the inline JSX with the existing components:
- `ChatHeader` (`components/chat/ChatHeader.tsx`) — already matches the inline header; wire `activeProfile`, `sessionId`, `onNewChat`.
- `ChatInput` (`components/chat/ChatInput.tsx`) — already uses the `ui/textarea` primitive; swap the deprecated inline `<textarea onKeyPress>`.
- `ChatQuickPrompts` — replace the inline quick-prompt grid.
- `ChatSidebar` — replace the ~250-line inline sidebar; it already defines `ChatSessionSummary` / `TravelProfile` types.
- New `src/components/chat/ChatMessage.tsx` — extract `renderMessage` + the streaming-data card (`renderStreamingResults`) into a real component (props: `message`, `expanded`, `onToggle`, `onItemClick`).

### 1.3 Route shell
`src/routes/chat/index.tsx` becomes: instantiate `useChat()`, render the decorative
shell + `<ChatSidebar/>`, `<ChatHeader/>`, message list, `<ChatInput/>`,
`<DetailedItemModal/>`. No business logic.

---

## Part 2 — Layout

- **Sidebar**: on mobile it currently takes the whole screen (`order-2`, full width). Make it a collapsible drawer (toggle in header, slide-over on `lg:hidden`, static rail on `lg`). Keeps the message area primary on phones.
- **Message column**: cap readable width (`max-w-3xl mx-auto`) in the scroll area, not just per-bubble, for large screens.
- **Header**: single source — delete the inline header, keep `ChatHeader`. Add the Stop button slot (Part 3.1) and the drawer toggle.
- **Input bar**: auto-growing textarea (cap ~6 rows), keep the centered hint, disable send while streaming (already partially there).
- Trim the stacked decorative blur layers to one veil for less paint cost; keep the glass panel aesthetic.

---

## Part 3 — Functional fixes

### 3.1 Live streaming text + auto-scroll + Stop
- Render **partial** assistant text as it streams. Today an assistant message is only
  pushed in `onComplete`; `onProgress` only updates a label. Push a placeholder
  assistant message on send and patch its `content`/`streamingData` from `onProgress`
  (fine-grained store update, like `createItineraryStream` does), so text/results
  appear live.
- **Auto-scroll**: ref the message list; on `messages()` change or streaming patch,
  scroll to bottom unless the user has scrolled up (track `atBottom`).
- **Stop button**: expose an `AbortController` from `streamingService.startStream`
  (or wrap it); Stop aborts the stream, finalizes the partial message, clears loading.
- **Don't re-typewriter history**: `TypingAnimation` re-runs on every render and
  retypes loaded/old messages. Only animate the *latest* streaming assistant message;
  render all others as static text. Add an `animate` prop to `ChatMessage`.

### 3.2 Real profiles + dead buttons
- The selector lists 4 hardcoded profiles (`solo/foodie/family/culture`) and
  `activeProfile` is cosmetic — the backend always uses `useDefaultSearchProfile().id`.
  Wire the selector to the real profiles list (the profiles API, same source as
  `useDefaultSearchProfile`); selecting one sets the `profileId` actually sent to
  `sendUnifiedChatMessageStream`/`ContinueChat`.
- Save/Share buttons on the message card have no `onClick`. Wire Save to the existing
  `useSaveItineraryMutation` (as `/itinerary` does) and Share to `navigator.share`,
  or remove them if out of scope.

### 3.3 Fix history wipe + dead REST load
- **History wipe**: `onMount` removes `localChatSessions` (route line ~176) on every
  entry, so the local fallback list is destroyed before `sessions()` reads it. Remove
  that `removeItem` — only clear the *streaming* keys on mount, never the session list.
- **Dead REST**: `loadSession` fetches
  `${API_BASE_URL}/llm/prompt-response/chat/sessions/details/${id}` — a REST endpoint
  removed in the recent "delete REST API endpoints" commit. The `getChatSessions`
  Connect RPC already returns `conversationHistory` per session
  (`llm.ts:858,864-893`). Load history from the cached session list / that RPC and
  delete the `fetch` branch + the manual `Authorization` header.

### 3.4 Markdown + cleanup
- **Markdown**: assistant content is `whitespace-pre-wrap` and `formatMessageContent`
  regex-mangles JSON into prose. Add a markdown renderer
  (`solid-markdown`, or `marked` + `dompurify`) and render assistant text through it.
  Keep a thin `stripResponsePrefixes` helper for the `[city_data]`/```json fences;
  drop the brittle JSON-to-sentence guessing.
- **Cleanup**: strip the ~50 `console.log`s (route 71-360+) — use `logger` where a log
  is actually wanted. Type the `null`-typed signals (`selectedItem`, `selectedSession`)
  properly. Remove the placeholder-message fabrication once real history loads.

---

## Files

- New: `src/lib/hooks/useChat.ts`, `src/components/chat/ChatMessage.tsx`.
- Edit: `src/routes/chat/index.tsx` (shrink to shell), `src/components/chat/ChatSidebar.tsx` (drawer + real profiles), `src/components/chat/ChatInput.tsx` (auto-grow, Stop), `src/components/chat/ChatHeader.tsx` (drawer toggle + Stop slot).
- Reuse: `components/chat/index.ts` exports, `lib/api/llm.ts` (`getChatSessions`, `ContinueChatStream`, `sendUnifiedChatMessageStream`, `detectDomain`), `lib/chat-stream`, `useSaveItineraryMutation`, `DetailedItemModal`, `ItineraryStreamView`.
- Add dep: a markdown renderer.

## Verification

1. `npm run dev` → open `/chat`. Send a prompt: assistant text + results **stream in
   live**, list auto-scrolls, Stop cancels mid-stream and keeps the partial.
2. Reload `/chat` after a chat: recent conversations **persist** in the sidebar (no wipe).
3. Click a past session: history loads via Connect (no 404 in Network; the REST URL is gone).
4. Switch profile → the `profileId` in the outgoing request changes (verify in Network).
5. Assistant markdown renders (headings/lists/bold), no raw JSON dumps.
6. Mobile width: sidebar is a drawer, message column readable; desktop: rail + centered column.
7. `npx tsgo --noEmit` clean; `npx oxlint src/routes/chat src/components/chat src/lib/hooks/useChat.ts` clean.

## Risks / notes
- Live-streaming partials depend on `streamingService.onProgress` exposing incremental
  text; if it only emits structured data (not token text), live render is limited to
  the results card + progress — confirm during 3.1 and adjust.
- Adding a markdown lib increases bundle; pick a small one and lazy-load if needed.
- Keep the streaming/session-storage contract intact so `/itinerary` deep-links
  (which read `completedStreamingSession`) keep working.
