# Tracker Overhaul + General Site Improvements Design

**Date:** 2026-02-23
**Status:** Approved

## Scope

### General Site Improvements (3)
- **G2** Full installable PWA with offline support
- **G6** Mobile bottom navigation bar
- **G7** Content cross-linking between guide pages

### Game Tracker Improvements (9)
- **T1** Shared Doom Track visualization (0-30)
- **T2** Ritual of Annihilation cost tracker (5-10 + instant death)
- **T3** Round phase tracking (gather / action / doom)
- **T4** Action log with timestamped history
- **T5** Undo support (in-memory history stack)
- **T6** Auto-calculate Gather Power (power = 2 x gates)
- **T7** Doom Phase automation (score doom + ritual buttons)
- **T8** Elder Sign reveal + Doom 30 alert
- **T9** Simple unit/monster count tracker per faction

---

## Data Model Changes

### PlayerState additions

```typescript
interface PlayerState {
  // ... existing fields unchanged ...
  units: Record<string, number>;  // unit id -> deployed count
}
```

### TrackerSession additions

```typescript
interface TrackerSession {
  // ... existing fields unchanged ...
  ritualCost: number;              // starts 5, increments on any ritual, max 10 then instant death
  phase: "gather" | "action" | "doom";
  actionLog: ActionLogEntry[];
}
```

### New types

```typescript
interface ActionLogEntry {
  round: number;
  phase: string;
  description: string;
  timestamp: string;
}

interface FactionUnit {
  id: string;
  name: string;
  max: number;
  cost: number;
  combat: number;
  isGOO?: boolean;
}
```

### Undo mechanism

In-memory only (not persisted to localStorage). The tracker page component wraps state with a `past: TrackerSession[]` stack capped at 50 entries. Each dispatched action pushes the pre-action state. `UNDO` pops it.

### Session migration

`loadSession` gains a migration step for existing sessions:
```typescript
ritualCost: session.ritualCost ?? 5
phase: session.phase ?? "action"
actionLog: session.actionLog ?? []
players[i].units: player.units ?? {}
```

---

## New Reducer Actions

```
SET_PHASE          { phase }
PERFORM_RITUAL     { playerIdx }     // compound: doom += gates, elderSigns += 1, ritualCost += 1, log
GATHER_POWER       (no args)         // sets each player power = 2 * gates
SCORE_DOOM         (no args)         // adds each player's gates to their doom
SET_UNITS          { playerIdx, unitId, count }
LOG_ACTION         { description }
UNDO               (no args)         // pops history stack
```

---

## Faction Unit Rosters

New data file: `src/data/faction-units.ts`

| Faction | Acolytes | Monsters | GOO(s) |
|---------|----------|----------|--------|
| Great Cthulhu | 6 | Deep Ones (4), Shoggoths (2), Starspawn (2) | Cthulhu |
| Black Goat | 6 | Ghouls (2), Mi-Go (3), Dark Young (3) | Shub-Niggurath |
| Crawling Chaos | 6 | Nightgaunts (3), Flying Polyps (3), Hunting Horrors (2) | Nyarlathotep |
| Yellow Sign | 6 | Undead (6), Byakhee (4) | King in Yellow, Hastur |
| Opener of the Way | 6 | Mutants (4), Abominations (3), Spawn of Yog-Sothoth (2) | Yog-Sothoth |
| The Sleeper | 6 | Serpent Men (3), Formless Spawn (4), Wizards (2) | Tsathoggua |
| Windwalker | 6 | Wendigos (4), Gnoph-Keh (4) | Rhan-Tegoth, Ithaqua |
| Tcho-Tcho | 6 | Proto-Shoggoths (6), High Priests (3) | Ubbo-Sathla |
| The Ancients | 6 | Un-Men (3), Reanimated (3), Yothans (3) | None (uses Cathedrals) |
| Daemon Sultan | 6 | Larvae Thesis (2), Larvae Antithesis (2), Larvae Synthesis (2) | Thesis, Antithesis, Synthesis |
| Bubastis | 0 | Earth Cats (6), Cats from Mars (2), Cats from Saturn (2), Cats from Uranus (2) | Bastet |

---

## Tracker UI Layout

```
+---------------------------------------------+
| Round 3 [<] [>] | Phase: DOOM | [Undo] [Hub] [End] |
+---------------------------------------------+
| Doom Track  0====12==15====18=====25=====30  |
|             GC   BG  CC    YS               |
+---------------------------------------------+
| [Player 1]  [Player 2]  [Player 3]          |
| - Doom/Gates/Power/ES/Spellbooks (existing)  |
| - Units (collapsible): Acolytes 4/6, etc.   |
+---------------------------------------------+
| Phase Actions (context-sensitive)            |
| [Gather Power] or [Score Doom] [Ritual: 5]  |
+---------------------------------------------+
| Interaction Warnings (existing, unchanged)   |
+---------------------------------------------+
| Action Log (collapsible, scrollable)         |
| R3 Doom: Black Goat Doom 12->15 (Ritual)    |
| R3 Doom: Ritual cost now 6                  |
+---------------------------------------------+
```

### New components

| Component | Location | Purpose |
|-----------|----------|---------|
| `DoomTrack` | `src/components/tracker/DoomTrack.tsx` | Shared horizontal 0-30 track with colored player markers |
| `PhaseBar` | `src/components/tracker/PhaseBar.tsx` | Phase indicator + Next Phase button |
| `PhaseActions` | `src/components/tracker/PhaseActions.tsx` | Context-sensitive buttons per phase |
| `RitualButton` | `src/components/tracker/RitualButton.tsx` | Per-player ritual with cost display |
| `UnitTracker` | `src/components/tracker/UnitTracker.tsx` | Collapsible unit counts in PlayerCard |
| `ActionLog` | `src/components/tracker/ActionLog.tsx` | Scrollable timestamped history |
| `UndoButton` | inline in top bar | Pops undo stack |

### Doom Track behavior
- Horizontal bar from 0-30, tick marks every 5
- Each player shown as a colored dot at their doom position
- Dots that overlap stack vertically
- Pulsing animation when any player hits 30

### Phase cycling
- "Next Phase" advances: gather -> action -> doom -> gather (incrementing round)
- Gather phase auto-shows "Gather Power" button
- Doom phase shows "Score Doom" and per-player "Ritual" buttons
- Action phase shows minimal UI (just "End Action Phase -> Doom")

### Ritual of Annihilation
- Cost starts at 5, shown globally
- Per-player button: disabled if player.power < ritualCost
- On click: doom += gates, elderSigns += 1, ritualCost += 1, power -= ritualCost
- Track: 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> Instant Death
- At cost > 10: button shows skull icon, performing triggers END_GAME

### Elder Sign / Doom 30 Alert
- Banner appears when any player reaches 30 doom
- Elder Sign values become prominently displayed
- Doom track marker gets pulsing gold animation

---

## General Site Improvements

### G2: PWA

- Install `@ducanh2912/next-pwa`
- Add `public/manifest.json`: name "CW Strategy", theme #0a0a0f, display standalone
- Generate 192x192 and 512x512 PNG icons (gold tentacle/star on void background)
- Configure next-pwa in `next.config.ts` to precache guide + tracker pages
- Add `<link rel="manifest">` and iOS meta tags in root layout
- Service worker caches all static assets and guide content for offline use

### G6: Mobile Bottom Nav

- New `BottomNav` component: `src/components/layout/BottomNav.tsx`
- Fixed to bottom of viewport on screens < lg (1024px)
- Four tabs: Guide, Factions, Tracker, Search
- Active tab highlighted with gold color
- Only renders on guide/home pages (tracker has its own nav)
- Body gets bottom padding to avoid content overlap
- Current hamburger menu remains for desktop sidebar toggle

### G7: Content Cross-Linking

- Add optional `related` frontmatter field to MDX files
- New `RelatedContent` component at bottom of guide pages
- Shows: linked page title, section label, description snippet
- If no explicit `related` field, show 2-3 pages from same section
- Styled as cards matching existing section card design

---

## Files Modified

### New files
- `src/data/faction-units.ts`
- `src/components/tracker/DoomTrack.tsx`
- `src/components/tracker/PhaseBar.tsx`
- `src/components/tracker/PhaseActions.tsx`
- `src/components/tracker/RitualButton.tsx`
- `src/components/tracker/UnitTracker.tsx`
- `src/components/tracker/ActionLog.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/guide/RelatedContent.tsx`
- `public/manifest.json`
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`

### Modified files
- `src/lib/tracker-session.ts` (PlayerState, TrackerSession, migration)
- `src/lib/tracker-reducer.ts` (new actions, undo wrapper)
- `src/app/tracker/[sessionId]/page.tsx` (new layout, undo state, new components)
- `src/app/tracker/setup/page.tsx` (initialize new fields)
- `src/components/tracker/PlayerCard.tsx` (add UnitTracker section)
- `src/app/layout.tsx` (manifest link, iOS meta, BottomNav)
- `src/app/globals.css` (bottom-nav safe area padding)
- `next.config.ts` (next-pwa integration)
- `package.json` (add @ducanh2912/next-pwa)
- `src/app/guide/[...slug]/page.tsx` (RelatedContent at bottom)
- `src/lib/content.ts` (parse `related` frontmatter)
- Select MDX files (add `related` frontmatter)
