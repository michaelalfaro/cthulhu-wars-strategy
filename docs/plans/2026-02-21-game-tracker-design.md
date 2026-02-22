# Game Tracker Design

**Date:** 2026-02-21
**Status:** Approved
**Feature:** Round-by-round game companion with multi-session support

---

## Overview

A dedicated `/tracker` section of the Cthulhu Wars Strategy Guide that acts as a round-by-round companion during play. Players configure their game (factions, map, expansions), name themselves, and get a live tracker that persists across page reloads. Multiple saved sessions are supported. The game setup checklist page links into tracker setup via URL params.

---

## Routes

| Route | Purpose |
|-------|---------|
| `/tracker` | Hub — lists all saved sessions with faction icons, map, date. "New Game" button. |
| `/tracker/setup` | Config screen — pick factions (up to 5), player names, map, expansions. Pre-populated from game-setup page URL params. "Begin Game" generates a session ID and navigates to tracker. |
| `/tracker/[sessionId]` | Live round-by-round tracker for one game session. |

### Game Setup Integration

The existing `/guide/overview/game-setup` page gets a **"Start Game Tracker →"** button at the bottom that deep-links to:

```
/tracker/setup?factions=great-cthulhu,black-goat&map=earth&expansions=high-priest
```

---

## Data Model

### Session (stored in localStorage as `cw-session-{id}`)

```ts
interface Session {
  id: string;           // short nanoid, e.g. "x7k2m"
  createdAt: string;    // ISO timestamp
  completedAt?: string; // set when "End Game" is clicked
  map: string;          // e.g. "earth", "dreamlands"
  expansions: string[]; // e.g. ["high-priest", "azathoth"]
  round: number;        // current round (1–n)
  firstPlayer: number;  // index into players array
  direction: "cw" | "ccw";
  players: PlayerState[];
}

interface PlayerState {
  name: string;          // e.g. "Michael"
  factionId: string;     // e.g. "great-cthulhu"
  doom: number;          // 0–30+
  gates: number;         // 0–7
  power: number;         // optional reference field
  spellbooks: boolean[]; // 6 entries, one per book
  elderSigns: number;    // count of collected Elder Signs
}
```

### Session Index (stored in localStorage as `cw-sessions-index`)

`string[]` of all session IDs, used to list sessions on the hub page. Sessions are never auto-deleted — user manually deletes from hub.

---

## UI

### `/tracker` — Hub Page

- Header: "Game Sessions" + "New Game →" button
- List of saved sessions, each showing:
  - Faction color chips for all players
  - Map name
  - Date created
  - Round reached
  - Completed badge (if ended)
  - "Resume" and "Delete" actions
- Empty state when no sessions exist

### `/tracker/setup` — Setup Screen

- Faction picker: grid of all 11 factions, select 2–5. Each faction card shows name + color. Selected factions are highlighted.
- Per-selected-faction: player name input field
- Map selector: dropdown of all 6 maps
- Expansion toggles: High Priest, Azathoth, GOO Packs, etc.
- First player: pick which player goes first + direction (CW / CCW)
- "Begin Game" button → generates nanoid session ID, saves to localStorage, navigates to `/tracker/{id}`
- Pre-population: reads `?factions=`, `?map=`, `?expansions=` URL params on mount

### `/tracker/[sessionId]` — Live Tracker

#### Top Bar
- Round counter (e.g. "Round 3") with ← Prev / Next → buttons
- First player indicator: faction icon + player name + direction arrow (↻ / ↺)
- "End Game" button (marks session complete, returns to hub)

#### Player Panel Grid
Responsive grid: 1 col on mobile, 2×2 for 4 players, 3+2 for 5 players.

Each player card:
- Faction name + color accent border
- **Doom** — large number, –/+ buttons. Highlights amber at 20+, red at 25+
- **Gates** — –/+ counter (0–7)
- **Elder Signs** — small –/+ counter
- **Spellbooks** — 6 labeled checkboxes. All 6 checked → card gets a "complete" glow
- **Power** — optional editable number field (reference only, dimmed)

#### Interaction Warnings Panel
- Collapsible section at the bottom (expanded by default)
- Title: "Watch Out — {faction} + {faction}"
- Sourced from `src/data/faction-interactions.ts` — a static data file with curated pairwise and faction-specific tips
- Tips filtered to only those relevant to factions in the current session
- Each tip shows: source faction chip + warning text
- Examples:
  - *"CC has Madness — Pain results scatter your units to enemy territory. Don't treat Pain as safe movement against Crawling Chaos."*
  - *"Yellow Sign can Gift Doom — if Yellow Sign has 3+ Gates and their GOO, watch the Doom track closely. They can accelerate faster than expected."*
  - *"Tcho-Tcho has High Priests built-in — they can react at instant speed even at 0 Power."*

---

## Component Architecture

```
src/
  app/
    tracker/
      page.tsx                   # Hub — "use client", reads localStorage
      setup/
        page.tsx                 # Setup — "use client", reads URL params
      [sessionId]/
        page.tsx                 # Tracker — "use client", reads localStorage
  components/
    tracker/
      SessionList.tsx            # Hub session cards
      SessionCard.tsx            # Single saved session preview
      SetupForm.tsx              # Faction/map/expansion picker
      FactionPicker.tsx          # Grid of faction selection cards
      TrackerBoard.tsx           # Main tracker layout
      PlayerCard.tsx             # Per-player panel with all counters
      SpellbookTracker.tsx       # 6 checkbox row with book labels
      DoomCounter.tsx            # Large doom number with +/–
      InteractionWarnings.tsx    # Collapsible warnings panel
  data/
    faction-data.ts              # Faction metadata (name, color, spellbook names)
    faction-interactions.ts      # Curated pairwise interaction tips
  lib/
    tracker-session.ts           # localStorage read/write helpers
    nanoid.ts                    # Simple short ID generator (or import nanoid)
```

---

## State Management

- All session state in `localStorage` — no server needed
- `useReducer` in `TrackerBoard` for complex state updates (doom +/–, spellbook toggle, round advance)
- Auto-save: `useEffect` on every state change writes to localStorage
- On mount: reads session from localStorage, handles missing session (redirect to hub)

---

## Faction Interaction Tips Data Structure

```ts
// src/data/faction-interactions.ts
export interface InteractionTip {
  factions: string[];    // factionIds this tip applies to (1 = always show, 2 = pairwise)
  text: string;
  severity: "info" | "warning" | "critical";
}

export const interactionTips: InteractionTip[] = [
  {
    factions: ["crawling-chaos"],
    text: "Madness scatters Pain results to enemy areas — Pain is not safe movement against CC.",
    severity: "warning",
  },
  {
    factions: ["yellow-sign"],
    text: "Yellow Sign can Gift Doom via spellbook — if they have 3+ Gates and their GOO, the Doom track can accelerate fast.",
    severity: "critical",
  },
  {
    factions: ["great-cthulhu", "crawling-chaos"],
    text: "CC's Madness hard-counters Cthulhu's Submerge plans — submerged units can be scattered before re-emergence.",
    severity: "warning",
  },
  // ... many more
];
```

Tips are filtered at render time: show a tip if all its `factions` entries are present in the current session's faction list.

---

## Out of Scope

- Server-side persistence (no database, no auth)
- Undo history (state is forward-only)
- Mobile-optimized swipe gestures (responsive layout only)
- Real-time multiplayer sync

---

## Success Criteria

1. Game setup page has a working "Start Game Tracker" link that pre-populates setup
2. Setup screen correctly initializes a session and navigates to tracker
3. All five tracked values update correctly and persist across page reload
4. Interaction warnings panel shows relevant tips for the factions in play
5. Hub page lists all saved sessions and allows deletion
6. Session survives accidental navigation and can be resumed from hub
