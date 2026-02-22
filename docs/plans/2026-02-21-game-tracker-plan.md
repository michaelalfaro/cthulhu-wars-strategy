# Game Tracker Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a `/tracker` section with multi-session localStorage persistence, a setup wizard, and a live round-by-round companion showing Doom/Gates/Elder Signs/Spellbooks + faction interaction warnings.

**Architecture:** Three client-only pages under `/tracker` — hub (session list), setup (faction/map/expansion picker pre-populated from game-setup URL params), and `[sessionId]` (live tracker). All state lives in `localStorage`. A `useReducer` drives the tracker state with auto-save on every dispatch. No server components, no database.

**Tech Stack:** Next.js 16.1.6 App Router, TypeScript, Tailwind CSS 4, React 19, `nanoid` (new dep) for short session IDs. No test framework — verify via dev server at localhost:3000.

---

## Reference

- Design doc: `docs/plans/2026-02-21-game-tracker-design.md`
- Faction colors (from MDX frontmatter):
  - great-cthulhu `#2d8a4e`, black-goat `#8b1a1a`, crawling-chaos `#1a3d8b`
  - yellow-sign `#c4a84d`, opener-of-the-way `#d4a017`, sleeper `#6b4e2a`
  - windwalker `#4a9ac7`, tcho-tcho `#7a3b8a`, ancients `#8a8a5a`
  - daemon-sultan `#2a2a2a`, bubastis `#c77a4a`
- Theme colors (from Tailwind config): `void` (dark bg), `bone` (light text), `gold` (#c4a84d)
- Existing pattern: all interactive pages are `"use client"` components. Complex MDX props use zero-prop wrapper pattern.

---

## Task 1: Install nanoid

**Files:**
- Modify: `package.json` (via npm)

**Step 1: Install**
```bash
cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy
npm install nanoid
```

**Step 2: Verify**
```bash
node -e "import('nanoid').then(m => console.log(m.nanoid(6)))"
```
Expected: 6-character random string like `x7k2mA`

**Step 3: Commit**
```bash
git add package.json package-lock.json
git commit -m "chore: add nanoid for session ID generation"
```

---

## Task 2: Faction Data File

**Files:**
- Create: `src/data/faction-data.ts`

**Step 1: Create file**

```typescript
// src/data/faction-data.ts

export interface FactionSpellbook {
  id: string;
  name: string;
  abbrev: string; // max 4 chars for compact display
}

export interface FactionData {
  id: string;
  name: string;
  color: string;
  type: "base" | "expansion";
  spellbooks: FactionSpellbook[];
}

export const FACTIONS: FactionData[] = [
  {
    id: "great-cthulhu",
    name: "Great Cthulhu",
    color: "#2d8a4e",
    type: "base",
    spellbooks: [
      { id: "submerge", name: "Submerge", abbrev: "SUB" },
      { id: "devolve", name: "Devolve", abbrev: "DEV" },
      { id: "dreams", name: "Dreams", abbrev: "DRM" },
      { id: "absorb", name: "Absorb", abbrev: "ABS" },
      { id: "regenerate", name: "Regenerate", abbrev: "REG" },
      { id: "yha-nthlei", name: "Y'ha-nthlei", abbrev: "YHA" },
    ],
  },
  {
    id: "black-goat",
    name: "Black Goat",
    color: "#8b1a1a",
    type: "base",
    spellbooks: [
      { id: "ghroth", name: "Ghroth", abbrev: "GHR" },
      { id: "dark-young", name: "Dark Young", abbrev: "DY" },
      { id: "fertility", name: "Fertility Cult", abbrev: "FRT" },
      { id: "blood-sacrifice", name: "Blood Sacrifice", abbrev: "BLD" },
      { id: "thousand-young", name: "Thousand Young", abbrev: "1KY" },
      { id: "frenzy", name: "Frenzy", abbrev: "FRZ" },
    ],
  },
  {
    id: "crawling-chaos",
    name: "Crawling Chaos",
    color: "#1a3d8b",
    type: "base",
    spellbooks: [
      { id: "thousand-forms", name: "Thousand Forms", abbrev: "1KF" },
      { id: "emissary", name: "Emissary of the Outer Gods", abbrev: "EMI" },
      { id: "madness", name: "Madness", abbrev: "MAD" },
      { id: "avatar", name: "Avatar of Nyarlathotep", abbrev: "AVA" },
      { id: "nyarlathotep-rises", name: "Nyarlathotep Rises", abbrev: "NYR" },
      { id: "the-渗透", name: "Infiltration", abbrev: "INF" },
    ],
  },
  {
    id: "yellow-sign",
    name: "Yellow Sign",
    color: "#c4a84d",
    type: "base",
    spellbooks: [
      { id: "desecrate", name: "Desecrate", abbrev: "DES" },
      { id: "shriek", name: "Shriek", abbrev: "SHK" },
      { id: "passion", name: "Passion", abbrev: "PAS" },
      { id: "gift", name: "Gift of the King", abbrev: "GFT" },
      { id: "cloud-memory", name: "Cloud Memory", abbrev: "CLD" },
      { id: "the-king-in-yellow", name: "The King in Yellow", abbrev: "KIY" },
    ],
  },
  {
    id: "opener-of-the-way",
    name: "Opener of the Way",
    color: "#d4a017",
    type: "expansion",
    spellbooks: [
      { id: "beyond-one", name: "Beyond One", abbrev: "BYD" },
      { id: "three-in-one", name: "Three in One", abbrev: "3IN" },
      { id: "opener-spellbook-3", name: "Opener of Ways", abbrev: "OPN" },
      { id: "the-thousand-other-forms", name: "The Thousand Other Forms", abbrev: "TOF" },
      { id: "annihilation", name: "Annihilation", abbrev: "ANN" },
      { id: "ubbo-sathla", name: "Ubbo-Sathla", abbrev: "UBB" },
    ],
  },
  {
    id: "sleeper",
    name: "The Sleeper",
    color: "#6b4e2a",
    type: "expansion",
    spellbooks: [
      { id: "lethargy", name: "Lethargy", abbrev: "LTH" },
      { id: "awaken", name: "Awaken", abbrev: "AWK" },
      { id: "hibernate", name: "Hibernate", abbrev: "HIB" },
      { id: "lightning-gun", name: "Lightning Gun", abbrev: "LGN" },
      { id: "dreams-sleeper", name: "Dreams", abbrev: "DRM" },
      { id: "timeless-sleep", name: "Timeless Sleep", abbrev: "TML" },
    ],
  },
  {
    id: "windwalker",
    name: "Windwalker",
    color: "#4a9ac7",
    type: "expansion",
    spellbooks: [
      { id: "howl", name: "Howl", abbrev: "HWL" },
      { id: "ithaqua-striding", name: "Ithaqua Striding", abbrev: "STR" },
      { id: "ice-age", name: "Ice Age", abbrev: "ICE" },
      { id: "wendigo", name: "Wendigo", abbrev: "WND" },
      { id: "chill-wind", name: "Chill Wind", abbrev: "CHL" },
      { id: "blizzard", name: "Blizzard", abbrev: "BLZ" },
    ],
  },
  {
    id: "tcho-tcho",
    name: "Tcho-Tcho",
    color: "#7a3b8a",
    type: "expansion",
    spellbooks: [
      { id: "fertility-tcho", name: "Fertility", abbrev: "FRT" },
      { id: "zeal", name: "Zeal", abbrev: "ZEL" },
      { id: "zingaya", name: "Zingaya", abbrev: "ZNG" },
      { id: "tcho-tcho-people", name: "Tcho-Tcho People", abbrev: "PEP" },
      { id: "lassitude", name: "Lassitude", abbrev: "LSS" },
      { id: "worship", name: "Worship", abbrev: "WOR" },
    ],
  },
  {
    id: "ancients",
    name: "The Ancients",
    color: "#8a8a5a",
    type: "expansion",
    spellbooks: [
      { id: "memory", name: "Memory of the Ancient Ones", abbrev: "MEM" },
      { id: "binding", name: "Binding", abbrev: "BND" },
      { id: "ancient-ones", name: "Ancient Ones", abbrev: "ANC" },
      { id: "echoes", name: "Echoes", abbrev: "ECH" },
      { id: "cyclopean", name: "Cyclopean Rampart", abbrev: "CYC" },
      { id: "elder-sign-ancients", name: "Elder Sign Mastery", abbrev: "ESM" },
    ],
  },
  {
    id: "daemon-sultan",
    name: "Daemon Sultan",
    color: "#2a2a2a",
    type: "expansion",
    spellbooks: [
      { id: "pull-of-the-centre", name: "Pull of the Centre", abbrev: "PUL" },
      { id: "the-throne", name: "The Throne", abbrev: "THR" },
      { id: "darkness", name: "Darkness", abbrev: "DRK" },
      { id: "howl-daemon", name: "Howl", abbrev: "HWL" },
      { id: "annihilate", name: "Annihilate", abbrev: "ANH" },
      { id: "herald", name: "Herald of the End", abbrev: "HLD" },
    ],
  },
  {
    id: "bubastis",
    name: "Bubastis",
    color: "#c77a4a",
    type: "expansion",
    spellbooks: [
      { id: "bast-cats", name: "Cats of Ulthar", abbrev: "CAT" },
      { id: "nine-lives", name: "Nine Lives", abbrev: "9LV" },
      { id: "dream-step", name: "Dream Step", abbrev: "DST" },
      { id: "sphinx", name: "Sphinx", abbrev: "SPX" },
      { id: "blessing", name: "Blessing of Bast", abbrev: "BLS" },
      { id: "divine-form", name: "Divine Form", abbrev: "DIV" },
    ],
  },
];

export const FACTION_MAP = Object.fromEntries(FACTIONS.map((f) => [f.id, f]));

export const MAPS = [
  { id: "earth", name: "Standard Earth" },
  { id: "dreamlands", name: "Dreamlands" },
  { id: "yuggoth", name: "Yuggoth" },
  { id: "library-celaeno", name: "Library at Celaeno" },
  { id: "shaggai", name: "Shaggai" },
  { id: "primeval-earth", name: "Primeval Earth" },
];

export const EXPANSIONS = [
  { id: "high-priest", name: "High Priest" },
  { id: "azathoth", name: "Azathoth" },
  { id: "dunwich-horror", name: "Dunwich Horror" },
  { id: "ramsey-campbell-1", name: "Ramsey Campbell Horrors 1" },
  { id: "ramsey-campbell-2", name: "Ramsey Campbell Horrors 2" },
  { id: "cosmic-terrors", name: "Cosmic Terrors" },
  { id: "beyond-time-space", name: "Beyond Time & Space" },
  { id: "masks-nyarlathotep", name: "Masks of Nyarlathotep" },
  { id: "goo-pack-1", name: "GOO Pack 1" },
  { id: "goo-pack-2", name: "GOO Pack 2" },
  { id: "goo-pack-4", name: "GOO Pack 4" },
];
```

**Step 2: Verify TypeScript compiles**
```bash
cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy
npx tsc --noEmit
```
Expected: no errors

**Step 3: Commit**
```bash
git add src/data/faction-data.ts
git commit -m "feat(tracker): add faction/map/expansion data"
```

---

## Task 3: Faction Interaction Tips

**Files:**
- Create: `src/data/faction-interactions.ts`

**Step 1: Create file**

```typescript
// src/data/faction-interactions.ts

export type Severity = "info" | "warning" | "critical";

export interface InteractionTip {
  id: string;
  factions: string[]; // factionIds — all must be in session to show this tip
  text: string;
  severity: Severity;
}

export const INTERACTION_TIPS: InteractionTip[] = [
  // ── Single-faction tips (always show when that faction is in play) ──
  {
    id: "cc-madness",
    factions: ["crawling-chaos"],
    text: "Crawling Chaos has Madness — Pain results move your units to areas of CC's choice, not yours. Never treat Pain as safe movement against CC.",
    severity: "warning",
  },
  {
    id: "ys-gift",
    factions: ["yellow-sign"],
    text: "Yellow Sign can Gift Doom via spellbook. If they have 3+ Gates and their GOO, watch the Doom track closely — they can accelerate to 30 faster than expected.",
    severity: "critical",
  },
  {
    id: "ys-desecrate",
    factions: ["yellow-sign"],
    text: "Desecrate lets Yellow Sign steal Gates cheaply. Any Gate left with a single Acolyte is a target.",
    severity: "warning",
  },
  {
    id: "tcho-high-priests",
    factions: ["tcho-tcho"],
    text: "Tcho-Tcho has three built-in High Priests — they can react at instant speed even at 0 Power, every action phase.",
    severity: "warning",
  },
  {
    id: "sleeper-lethargy",
    factions: ["sleeper"],
    text: "Lethargy lets Sleeper take the last action of every phase for free. Don't exhaust all your Power while Sleeper still has actions — they will move into your territory unchallenged.",
    severity: "warning",
  },
  {
    id: "gc-devour",
    factions: ["great-cthulhu"],
    text: "Cthulhu's Devour removes a unit before combat begins — your biggest unit is gone before dice are even rolled. Stack cheap units as Devour fodder, not expensive ones.",
    severity: "warning",
  },
  {
    id: "gc-dreams",
    factions: ["great-cthulhu"],
    text: "Dreams steals Gates guarded only by a single Acolyte. Never leave a Gate defended by just one Acolyte against Great Cthulhu.",
    severity: "warning",
  },
  {
    id: "opener-beyond-one",
    factions: ["opener-of-the-way"],
    text: "Beyond One can teleport Gates across the map. A Gate you think is safe can disappear — or appear — unexpectedly.",
    severity: "info",
  },
  {
    id: "ww-ice-age",
    factions: ["windwalker"],
    text: "Ice Age restricts non-Windwalker movement in cold regions. If Windwalker establishes polar dominance, the board can become impassable in key areas.",
    severity: "info",
  },
  {
    id: "bg-ghroth",
    factions: ["black-goat"],
    text: "Ghroth sacrifices all Cultists on the map (including yours!) for Doom. Watch your Cultist count when Black Goat is approaching Spellbook completion.",
    severity: "critical",
  },

  // ── Pairwise tips ──
  {
    id: "gc-cc",
    factions: ["great-cthulhu", "crawling-chaos"],
    text: "CC's Madness hard-counters Cthulhu's Submerge plans — submerged units can be scattered on re-emergence. Cthulhu needs to Submerge away from areas CC can reach.",
    severity: "warning",
  },
  {
    id: "gc-ys",
    factions: ["great-cthulhu", "yellow-sign"],
    text: "Dreams and Desecrate both steal Gates, but target different defenders. Combined, Yellow Sign and Cthulhu in the same game makes lone-Acolyte Gates very unsafe for everyone.",
    severity: "info",
  },
  {
    id: "gc-bg",
    factions: ["great-cthulhu", "black-goat"],
    text: "Ghroth hits Cthulhu's Acolytes hard — if GC is running a big pool cycle with Devolve/Dreams, a well-timed Ghroth wipes their entire setup.",
    severity: "warning",
  },
  {
    id: "cc-sleeper",
    factions: ["crawling-chaos", "sleeper"],
    text: "Lethargy is weakened if CC has High Priest or Thousand Forms — CC can get Power back and act after Sleeper expects everyone to be done.",
    severity: "info",
  },
  {
    id: "ys-ww",
    factions: ["yellow-sign", "windwalker"],
    text: "Yellow Sign needs transit agreements more than any other faction. If Windwalker controls polar gates and denies Yellow Sign movement, YS is effectively cut off from half the map.",
    severity: "warning",
  },
  {
    id: "bg-tcho",
    factions: ["black-goat", "tcho-tcho"],
    text: "Both factions generate a lot of early Doom and Power. One of them will likely hit 30 first — the table needs to decide early who the bigger long-term threat is.",
    severity: "critical",
  },
  {
    id: "opener-gc",
    factions: ["opener-of-the-way", "great-cthulhu"],
    text: "Beyond One can teleport ocean Gates inland, stranding Cthulhu away from the sea. Cthulhu players need to maintain a backup ocean gate.",
    severity: "warning",
  },
  {
    id: "sleeper-ww",
    factions: ["sleeper", "windwalker"],
    text: "Both factions have strong polar presence. North Pole contention between these two can decide the game — whoever controls polar Gates controls Gather Power in cold games.",
    severity: "info",
  },
  {
    id: "daemon-sultan-any",
    factions: ["daemon-sultan"],
    text: "Daemon Sultan's Pull of the Centre moves units toward the centre of the map. Units on the edge can be yanked into unfavorable combat.",
    severity: "info",
  },
];
```

**Step 2: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```

**Step 3: Commit**
```bash
git add src/data/faction-interactions.ts
git commit -m "feat(tracker): add faction interaction tips data"
```

---

## Task 4: Session Storage Helpers

**Files:**
- Create: `src/lib/tracker-session.ts`

**Step 1: Create file**

```typescript
// src/lib/tracker-session.ts

export interface PlayerState {
  name: string;
  factionId: string;
  doom: number;
  gates: number;
  power: number;
  spellbooks: boolean[]; // 6 entries
  elderSigns: number;
}

export interface TrackerSession {
  id: string;
  createdAt: string;
  completedAt?: string;
  map: string;
  expansions: string[];
  round: number;
  firstPlayer: number;
  direction: "cw" | "ccw";
  players: PlayerState[];
}

const INDEX_KEY = "cw-sessions-index";
const sessionKey = (id: string) => `cw-session-${id}`;

export function loadSessionIndex(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveSessionIndex(ids: string[]): void {
  localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
}

export function loadSession(id: string): TrackerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(sessionKey(id));
    return raw ? (JSON.parse(raw) as TrackerSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: TrackerSession): void {
  localStorage.setItem(sessionKey(session.id), JSON.stringify(session));
  const index = loadSessionIndex();
  if (!index.includes(session.id)) {
    saveSessionIndex([...index, session.id]);
  }
}

export function deleteSession(id: string): void {
  localStorage.removeItem(sessionKey(id));
  const index = loadSessionIndex();
  saveSessionIndex(index.filter((i) => i !== id));
}

export function createDefaultPlayers(
  factionIds: string[],
  names: string[]
): PlayerState[] {
  return factionIds.map((factionId, i) => ({
    name: names[i] ?? `Player ${i + 1}`,
    factionId,
    doom: 0,
    gates: 1,
    power: 8,
    spellbooks: Array(6).fill(false),
    elderSigns: 0,
  }));
}
```

**Step 2: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```

**Step 3: Commit**
```bash
git add src/lib/tracker-session.ts
git commit -m "feat(tracker): add localStorage session helpers"
```

---

## Task 5: Tracker Reducer

**Files:**
- Create: `src/lib/tracker-reducer.ts`

**Step 1: Create file**

```typescript
// src/lib/tracker-reducer.ts
import type { TrackerSession } from "./tracker-session";

export type TrackerAction =
  | { type: "SET_DOOM"; playerIdx: number; value: number }
  | { type: "SET_GATES"; playerIdx: number; value: number }
  | { type: "SET_POWER"; playerIdx: number; value: number }
  | { type: "SET_ELDER_SIGNS"; playerIdx: number; value: number }
  | { type: "TOGGLE_SPELLBOOK"; playerIdx: number; bookIdx: number }
  | { type: "NEXT_ROUND" }
  | { type: "PREV_ROUND" }
  | { type: "SET_FIRST_PLAYER"; playerIdx: number }
  | { type: "SET_DIRECTION"; direction: "cw" | "ccw" }
  | { type: "END_GAME" }
  | { type: "LOAD"; session: TrackerSession };

export function trackerReducer(
  state: TrackerSession,
  action: TrackerAction
): TrackerSession {
  switch (action.type) {
    case "LOAD":
      return action.session;
    case "SET_DOOM": {
      const players = state.players.map((p, i) =>
        i === action.playerIdx ? { ...p, doom: Math.max(0, action.value) } : p
      );
      return { ...state, players };
    }
    case "SET_GATES": {
      const players = state.players.map((p, i) =>
        i === action.playerIdx
          ? { ...p, gates: Math.max(0, Math.min(7, action.value)) }
          : p
      );
      return { ...state, players };
    }
    case "SET_POWER": {
      const players = state.players.map((p, i) =>
        i === action.playerIdx ? { ...p, power: Math.max(0, action.value) } : p
      );
      return { ...state, players };
    }
    case "SET_ELDER_SIGNS": {
      const players = state.players.map((p, i) =>
        i === action.playerIdx
          ? { ...p, elderSigns: Math.max(0, action.value) }
          : p
      );
      return { ...state, players };
    }
    case "TOGGLE_SPELLBOOK": {
      const players = state.players.map((p, i) => {
        if (i !== action.playerIdx) return p;
        const spellbooks = [...p.spellbooks];
        spellbooks[action.bookIdx] = !spellbooks[action.bookIdx];
        return { ...p, spellbooks };
      });
      return { ...state, players };
    }
    case "NEXT_ROUND":
      return { ...state, round: state.round + 1 };
    case "PREV_ROUND":
      return { ...state, round: Math.max(1, state.round - 1) };
    case "SET_FIRST_PLAYER":
      return { ...state, firstPlayer: action.playerIdx };
    case "SET_DIRECTION":
      return { ...state, direction: action.direction };
    case "END_GAME":
      return { ...state, completedAt: new Date().toISOString() };
    default:
      return state;
  }
}
```

**Step 2: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```

**Step 3: Commit**
```bash
git add src/lib/tracker-reducer.ts
git commit -m "feat(tracker): add tracker useReducer actions"
```

---

## Task 6: Hub Page (`/tracker`)

**Files:**
- Create: `src/app/tracker/page.tsx`

**Step 1: Create file**

```typescript
// src/app/tracker/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSessionIndex, loadSession, deleteSession } from "@/lib/tracker-session";
import { FACTION_MAP, MAPS } from "@/data/faction-data";
import type { TrackerSession } from "@/lib/tracker-session";

export default function TrackerHubPage() {
  const [sessions, setSessions] = useState<TrackerSession[]>([]);

  useEffect(() => {
    const ids = loadSessionIndex();
    const loaded = ids
      .map((id) => loadSession(id))
      .filter(Boolean) as TrackerSession[];
    // Most recent first
    setSessions(loaded.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }, []);

  function handleDelete(id: string) {
    deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  const mapName = (id: string) =>
    MAPS.find((m) => m.id === id)?.name ?? id;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-bone">Game Tracker</h1>
          <p className="mt-1 text-sm text-bone-muted">
            Round-by-round companion for your Cthulhu Wars sessions.
          </p>
        </div>
        <Link
          href="/tracker/setup"
          className="rounded-lg bg-gold px-4 py-2 font-heading text-sm font-semibold text-void transition-opacity hover:opacity-90"
        >
          New Game →
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-lg border border-void-lighter bg-void-light px-8 py-16 text-center">
          <p className="text-2xl">🎲</p>
          <p className="mt-3 font-heading text-bone">No saved sessions yet</p>
          <p className="mt-1 text-sm text-bone-muted">
            Start a new game to begin tracking.
          </p>
          <Link
            href="/tracker/setup"
            className="mt-4 inline-block rounded-lg bg-gold px-4 py-2 font-heading text-sm font-semibold text-void"
          >
            New Game →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-4 rounded-lg border border-void-lighter bg-void-light px-5 py-4"
            >
              {/* Faction color chips */}
              <div className="flex gap-1">
                {s.players.map((p) => {
                  const f = FACTION_MAP[p.factionId];
                  return (
                    <div
                      key={p.factionId}
                      className="h-5 w-5 rounded-full border-2 border-void"
                      style={{ backgroundColor: f?.color ?? "#666" }}
                      title={f?.name ?? p.factionId}
                    />
                  );
                })}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-bone">
                  {s.players.map((p) => FACTION_MAP[p.factionId]?.name ?? p.factionId).join(" · ")}
                </p>
                <p className="text-xs text-bone-muted">
                  {mapName(s.map)} · Round {s.round} ·{" "}
                  {new Date(s.createdAt).toLocaleDateString()}
                  {s.completedAt && (
                    <span className="ml-2 rounded bg-gold/20 px-1.5 py-0.5 text-gold">
                      Complete
                    </span>
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/tracker/${s.id}`}
                  className="rounded bg-void-lighter px-3 py-1.5 text-xs font-medium text-bone transition-colors hover:bg-void-lighter/80"
                >
                  Resume
                </Link>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="rounded px-3 py-1.5 text-xs text-bone-muted/60 transition-colors hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Step 2: Verify page loads at localhost:3000/tracker**
- Navigate to http://localhost:3000/tracker
- Should show hub page with empty state and "New Game →" button

**Step 3: Commit**
```bash
git add src/app/tracker/page.tsx
git commit -m "feat(tracker): add /tracker hub page with session list"
```

---

## Task 7: Setup Page (`/tracker/setup`)

**Files:**
- Create: `src/app/tracker/setup/page.tsx`
- Create: `src/components/tracker/FactionPicker.tsx`

**Step 1: Create FactionPicker component**

```typescript
// src/components/tracker/FactionPicker.tsx
"use client";

import { FACTIONS, type FactionData } from "@/data/faction-data";

interface FactionPickerProps {
  selected: string[];
  onChange: (ids: string[]) => void;
  maxSelect?: number;
}

export function FactionPicker({ selected, onChange, maxSelect = 5 }: FactionPickerProps) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else if (selected.length < maxSelect) {
      onChange([...selected, id]);
    }
  }

  const base = FACTIONS.filter((f) => f.type === "base");
  const expansion = FACTIONS.filter((f) => f.type === "expansion");

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-bone-muted">
          Core Factions
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {base.map((f) => <FactionCard key={f.id} faction={f} selected={selected.includes(f.id)} onToggle={() => toggle(f.id)} />)}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-bone-muted">
          Expansion Factions
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {expansion.map((f) => <FactionCard key={f.id} faction={f} selected={selected.includes(f.id)} onToggle={() => toggle(f.id)} />)}
        </div>
      </div>
    </div>
  );
}

function FactionCard({ faction, selected, onToggle }: { faction: FactionData; selected: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`rounded-lg border-2 px-3 py-2 text-left transition-all ${
        selected
          ? "border-transparent shadow-md"
          : "border-void-lighter bg-void-light hover:border-void-lighter/60"
      }`}
      style={selected ? { borderColor: faction.color, backgroundColor: `${faction.color}22` } : undefined}
    >
      <div
        className="mb-1 h-1.5 w-8 rounded-full"
        style={{ backgroundColor: faction.color }}
      />
      <p className="text-xs font-semibold text-bone leading-tight">{faction.name}</p>
    </button>
  );
}
```

**Step 2: Create setup page**

```typescript
// src/app/tracker/setup/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { nanoid } from "nanoid";
import { FactionPicker } from "@/components/tracker/FactionPicker";
import { MAPS, EXPANSIONS } from "@/data/faction-data";
import { saveSession, createDefaultPlayers } from "@/lib/tracker-session";

function SetupForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [factions, setFactions] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [map, setMap] = useState("earth");
  const [expansions, setExpansions] = useState<string[]>([]);
  const [firstPlayer, setFirstPlayer] = useState(0);
  const [direction, setDirection] = useState<"cw" | "ccw">("cw");

  // Pre-populate from URL params
  useEffect(() => {
    const f = params.get("factions");
    if (f) setFactions(f.split(",").filter(Boolean));
    const m = params.get("map");
    if (m) setMap(m);
    const e = params.get("expansions");
    if (e) setExpansions(e.split(",").filter(Boolean));
  }, [params]);

  // Sync names array length to factions
  useEffect(() => {
    setNames((prev) =>
      factions.map((_, i) => prev[i] ?? `Player ${i + 1}`)
    );
  }, [factions]);

  function toggleExpansion(id: string) {
    setExpansions((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  }

  function handleBegin() {
    if (factions.length < 2) return;
    const id = nanoid(6);
    const session = {
      id,
      createdAt: new Date().toISOString(),
      map,
      expansions,
      round: 1,
      firstPlayer,
      direction,
      players: createDefaultPlayers(factions, names),
    };
    saveSession(session);
    router.push(`/tracker/${id}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-heading text-3xl font-bold text-bone">New Game</h1>
      <p className="mt-1 mb-8 text-sm text-bone-muted">
        Configure your session. Select 2–5 factions.
      </p>

      {/* Faction Picker */}
      <section className="mb-8">
        <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-widest text-gold">
          Factions ({factions.length}/5)
        </h2>
        <FactionPicker selected={factions} onChange={setFactions} />
      </section>

      {/* Player Names */}
      {factions.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-widest text-gold">
            Player Names
          </h2>
          <div className="space-y-2">
            {factions.map((fId, i) => (
              <div key={fId} className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full shrink-0" />
                <input
                  type="text"
                  value={names[i] ?? ""}
                  onChange={(e) => {
                    const next = [...names];
                    next[i] = e.target.value;
                    setNames(next);
                  }}
                  placeholder={`Player ${i + 1}`}
                  className="flex-1 rounded border border-void-lighter bg-void-light px-3 py-2 text-sm text-bone placeholder-bone-muted/40 outline-none focus:border-gold"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Map */}
      <section className="mb-8">
        <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-widest text-gold">
          Map
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MAPS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMap(m.id)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                map === m.id
                  ? "border-gold bg-gold/10 text-bone"
                  : "border-void-lighter bg-void-light text-bone-muted hover:text-bone"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </section>

      {/* Expansions */}
      <section className="mb-8">
        <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-widest text-gold">
          Expansions in Play
        </h2>
        <div className="flex flex-wrap gap-2">
          {EXPANSIONS.map((e) => (
            <button
              key={e.id}
              onClick={() => toggleExpansion(e.id)}
              className={`rounded-full border px-3 py-1 text-xs transition-all ${
                expansions.includes(e.id)
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-void-lighter text-bone-muted hover:text-bone"
              }`}
            >
              {e.name}
            </button>
          ))}
        </div>
      </section>

      {/* First Player & Direction */}
      {factions.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-widest text-gold">
            First Player
          </h2>
          <div className="flex flex-wrap gap-2">
            {factions.map((_, i) => (
              <button
                key={i}
                onClick={() => setFirstPlayer(i)}
                className={`rounded border px-3 py-1 text-sm transition-all ${
                  firstPlayer === i
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-void-lighter text-bone-muted"
                }`}
              >
                {names[i] || `Player ${i + 1}`}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            {(["cw", "ccw"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDirection(d)}
                className={`rounded border px-3 py-1 text-sm transition-all ${
                  direction === d
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-void-lighter text-bone-muted"
                }`}
              >
                {d === "cw" ? "↻ Clockwise" : "↺ Counter-clockwise"}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Begin */}
      <button
        onClick={handleBegin}
        disabled={factions.length < 2}
        className="w-full rounded-lg bg-gold py-3 font-heading font-semibold text-void transition-opacity disabled:opacity-40 hover:opacity-90"
      >
        Begin Game →
      </button>
    </div>
  );
}

export default function TrackerSetupPage() {
  return (
    <Suspense fallback={<div className="p-12 text-bone-muted">Loading…</div>}>
      <SetupForm />
    </Suspense>
  );
}
```

**Step 3: Verify at localhost:3000/tracker/setup**
- Page renders with faction picker
- Selecting factions shows player name inputs
- "Begin Game" disabled until 2+ factions selected

**Step 4: Commit**
```bash
git add src/app/tracker/setup/page.tsx src/components/tracker/FactionPicker.tsx
git commit -m "feat(tracker): add /tracker/setup page with faction/map/expansion picker"
```

---

## Task 8: Player Card Components

**Files:**
- Create: `src/components/tracker/DoomCounter.tsx`
- Create: `src/components/tracker/SpellbookTracker.tsx`
- Create: `src/components/tracker/PlayerCard.tsx`

**Step 1: DoomCounter**

```typescript
// src/components/tracker/DoomCounter.tsx
"use client";

interface DoomCounterProps {
  value: number;
  onChange: (v: number) => void;
}

export function DoomCounter({ value, onChange }: DoomCounterProps) {
  const color =
    value >= 25 ? "text-red-400" : value >= 20 ? "text-amber-400" : "text-bone";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(value - 1)}
        className="flex h-7 w-7 items-center justify-center rounded bg-void-lighter text-bone-muted transition-colors hover:text-bone"
      >
        −
      </button>
      <span className={`w-10 text-center font-heading text-2xl font-bold tabular-nums ${color}`}>
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="flex h-7 w-7 items-center justify-center rounded bg-void-lighter text-bone-muted transition-colors hover:text-bone"
      >
        +
      </button>
    </div>
  );
}
```

**Step 2: SpellbookTracker**

```typescript
// src/components/tracker/SpellbookTracker.tsx
"use client";

interface SpellbookTrackerProps {
  spellbooks: boolean[];
  labels: string[]; // abbrev labels e.g. ["SUB", "DEV", ...]
  color: string;
  onToggle: (idx: number) => void;
}

export function SpellbookTracker({ spellbooks, labels, color, onToggle }: SpellbookTrackerProps) {
  return (
    <div className="flex gap-1">
      {spellbooks.map((checked, i) => (
        <button
          key={i}
          onClick={() => onToggle(i)}
          title={labels[i] ?? `Book ${i + 1}`}
          className={`flex h-7 w-7 items-center justify-center rounded text-[10px] font-bold transition-all ${
            checked ? "text-void" : "border border-void-lighter text-bone-muted/40 hover:text-bone-muted"
          }`}
          style={checked ? { backgroundColor: color } : undefined}
        >
          {labels[i]?.slice(0, 2) ?? i + 1}
        </button>
      ))}
    </div>
  );
}
```

**Step 3: PlayerCard**

```typescript
// src/components/tracker/PlayerCard.tsx
"use client";

import { FACTION_MAP } from "@/data/faction-data";
import type { PlayerState } from "@/lib/tracker-session";
import type { TrackerAction } from "@/lib/tracker-reducer";
import { DoomCounter } from "./DoomCounter";
import { SpellbookTracker } from "./SpellbookTracker";

interface PlayerCardProps {
  player: PlayerState;
  playerIdx: number;
  isFirstPlayer: boolean;
  dispatch: React.Dispatch<TrackerAction>;
}

export function PlayerCard({ player, playerIdx, isFirstPlayer, dispatch }: PlayerCardProps) {
  const faction = FACTION_MAP[player.factionId];
  const allBooks = player.spellbooks.every(Boolean);
  const bookLabels = faction?.spellbooks.map((b) => b.abbrev) ?? [];

  return (
    <div
      className={`rounded-xl border-2 bg-void-light p-5 transition-shadow ${
        allBooks ? "shadow-lg" : ""
      }`}
      style={{
        borderColor: allBooks ? faction?.color : `${faction?.color}44`,
        boxShadow: allBooks ? `0 0 20px ${faction?.color}33` : undefined,
      }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: faction?.color }}
          />
          <span className="font-heading text-sm font-semibold text-bone">
            {player.name}
          </span>
          {isFirstPlayer && (
            <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[10px] font-bold text-gold">
              FIRST
            </span>
          )}
        </div>
        <span className="text-xs text-bone-muted">{faction?.name}</span>
      </div>

      {/* Doom */}
      <div className="mb-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-bone-muted">
          Doom
        </p>
        <DoomCounter
          value={player.doom}
          onChange={(v) => dispatch({ type: "SET_DOOM", playerIdx, value: v })}
        />
      </div>

      {/* Stats row */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: "Gates", value: player.gates, type: "SET_GATES" as const, max: 7 },
          { label: "Elder Signs", value: player.elderSigns, type: "SET_ELDER_SIGNS" as const, max: 99 },
          { label: "Power", value: player.power, type: "SET_POWER" as const, max: 99 },
        ].map(({ label, value, type }) => (
          <div key={label}>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-bone-muted">
              {label}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => dispatch({ type, playerIdx, value: value - 1 })}
                className="flex h-5 w-5 items-center justify-center rounded bg-void-lighter text-xs text-bone-muted hover:text-bone"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-bold text-bone tabular-nums">
                {value}
              </span>
              <button
                onClick={() => dispatch({ type, playerIdx, value: value + 1 })}
                className="flex h-5 w-5 items-center justify-center rounded bg-void-lighter text-xs text-bone-muted hover:text-bone"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Spellbooks */}
      <div>
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-bone-muted">
          Spellbooks {allBooks && <span className="text-gold">✓ Complete</span>}
        </p>
        <SpellbookTracker
          spellbooks={player.spellbooks}
          labels={bookLabels}
          color={faction?.color ?? "#c4a84d"}
          onToggle={(bookIdx) =>
            dispatch({ type: "TOGGLE_SPELLBOOK", playerIdx, bookIdx })
          }
        />
      </div>
    </div>
  );
}
```

**Step 4: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```

**Step 5: Commit**
```bash
git add src/components/tracker/
git commit -m "feat(tracker): add DoomCounter, SpellbookTracker, PlayerCard components"
```

---

## Task 9: Interaction Warnings Component

**Files:**
- Create: `src/components/tracker/InteractionWarnings.tsx`

**Step 1: Create file**

```typescript
// src/components/tracker/InteractionWarnings.tsx
"use client";

import { useState } from "react";
import { INTERACTION_TIPS, type Severity } from "@/data/faction-interactions";
import { FACTION_MAP } from "@/data/faction-data";

interface InteractionWarningsProps {
  factionIds: string[];
}

const SEVERITY_STYLES: Record<Severity, { border: string; bg: string; dot: string }> = {
  critical: { border: "border-red-500/30", bg: "bg-red-500/5", dot: "bg-red-500" },
  warning: { border: "border-amber-400/30", bg: "bg-amber-400/5", dot: "bg-amber-400" },
  info: { border: "border-bone-muted/20", bg: "bg-void-light", dot: "bg-bone-muted" },
};

export function InteractionWarnings({ factionIds }: InteractionWarningsProps) {
  const [open, setOpen] = useState(true);

  const relevantTips = INTERACTION_TIPS.filter((tip) =>
    tip.factions.every((f) => factionIds.includes(f))
  );

  // Sort: critical first, then warning, then info
  const sorted = [...relevantTips].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });

  if (sorted.length === 0) return null;

  return (
    <div className="rounded-xl border border-void-lighter bg-void-light">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-3 text-left"
      >
        <span className="font-heading text-sm font-semibold uppercase tracking-wider text-bone-muted">
          ⚠ Interaction Warnings ({sorted.length})
        </span>
        <span className="text-bone-muted">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="divide-y divide-void-lighter border-t border-void-lighter">
          {sorted.map((tip) => {
            const styles = SEVERITY_STYLES[tip.severity];
            return (
              <div
                key={tip.id}
                className={`flex gap-3 px-5 py-3 ${styles.bg}`}
              >
                <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${styles.dot}`} />
                <div className="flex-1">
                  {tip.factions.length > 1 && (
                    <div className="mb-1 flex flex-wrap gap-1">
                      {tip.factions.map((fId) => {
                        const f = FACTION_MAP[fId];
                        return (
                          <span
                            key={fId}
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold text-void"
                            style={{ backgroundColor: f?.color ?? "#666" }}
                          >
                            {f?.name ?? fId}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-sm text-bone-muted">{tip.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```

**Step 3: Commit**
```bash
git add src/components/tracker/InteractionWarnings.tsx
git commit -m "feat(tracker): add InteractionWarnings panel component"
```

---

## Task 10: Live Tracker Page (`/tracker/[sessionId]`)

**Files:**
- Create: `src/app/tracker/[sessionId]/page.tsx`

**Step 1: Create file**

```typescript
// src/app/tracker/[sessionId]/page.tsx
"use client";

import { useEffect, useReducer, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { loadSession, saveSession } from "@/lib/tracker-session";
import { trackerReducer } from "@/lib/tracker-reducer";
import type { TrackerSession } from "@/lib/tracker-session";
import { FACTION_MAP } from "@/data/faction-data";
import { PlayerCard } from "@/components/tracker/PlayerCard";
import { InteractionWarnings } from "@/components/tracker/InteractionWarnings";

const EMPTY_SESSION: TrackerSession = {
  id: "",
  createdAt: "",
  map: "earth",
  expansions: [],
  round: 1,
  firstPlayer: 0,
  direction: "cw",
  players: [],
};

export default function TrackerPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [session, dispatch] = useReducer(trackerReducer, EMPTY_SESSION);
  const loaded = useRef(false);

  // Load session from localStorage on mount
  useEffect(() => {
    const s = loadSession(sessionId);
    if (!s) {
      router.replace("/tracker");
      return;
    }
    dispatch({ type: "LOAD", session: s });
    loaded.current = true;
  }, [sessionId, router]);

  // Auto-save on every state change (after initial load)
  useEffect(() => {
    if (!loaded.current || !session.id) return;
    saveSession(session);
  }, [session]);

  function handleEndGame() {
    dispatch({ type: "END_GAME" });
    router.push("/tracker");
  }

  if (!session.id) {
    return (
      <div className="p-12 text-center text-bone-muted">Loading session…</div>
    );
  }

  const factionIds = session.players.map((p) => p.factionId);
  const playerCount = session.players.length;
  const gridCols =
    playerCount <= 2 ? "grid-cols-1 sm:grid-cols-2" :
    playerCount === 3 ? "grid-cols-1 sm:grid-cols-3" :
    playerCount === 4 ? "grid-cols-2" :
    "grid-cols-2 sm:grid-cols-3";

  const firstPlayerName =
    session.players[session.firstPlayer]?.name ?? `Player ${session.firstPlayer + 1}`;
  const firstFaction = FACTION_MAP[session.players[session.firstPlayer]?.factionId ?? ""];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Round controls */}
          <div className="flex items-center gap-2 rounded-lg border border-void-lighter bg-void-light px-4 py-2">
            <button
              onClick={() => dispatch({ type: "PREV_ROUND" })}
              className="text-bone-muted transition-colors hover:text-bone disabled:opacity-30"
              disabled={session.round <= 1}
            >
              ←
            </button>
            <span className="font-heading text-sm font-bold text-bone">
              Round {session.round}
            </span>
            <button
              onClick={() => dispatch({ type: "NEXT_ROUND" })}
              className="text-bone-muted transition-colors hover:text-bone"
            >
              →
            </button>
          </div>

          {/* First player */}
          <div className="flex items-center gap-2 text-sm text-bone-muted">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: firstFaction?.color }}
            />
            <span>
              {firstPlayerName}{" "}
              <span className="text-bone-muted/60">
                {session.direction === "cw" ? "↻" : "↺"}
              </span>
            </span>
            {/* Cycle first player */}
            <button
              onClick={() =>
                dispatch({
                  type: "SET_FIRST_PLAYER",
                  playerIdx: (session.firstPlayer + 1) % playerCount,
                })
              }
              className="rounded border border-void-lighter px-2 py-0.5 text-[10px] text-bone-muted hover:text-bone"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/tracker"
            className="rounded border border-void-lighter px-3 py-1.5 text-xs text-bone-muted hover:text-bone"
          >
            ← Hub
          </Link>
          <button
            onClick={handleEndGame}
            className="rounded border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/20"
          >
            End Game
          </button>
        </div>
      </div>

      {/* Player grid */}
      <div className={`mb-6 grid gap-4 ${gridCols}`}>
        {session.players.map((player, i) => (
          <PlayerCard
            key={player.factionId}
            player={player}
            playerIdx={i}
            isFirstPlayer={i === session.firstPlayer}
            dispatch={dispatch}
          />
        ))}
      </div>

      {/* Interaction warnings */}
      <InteractionWarnings factionIds={factionIds} />
    </div>
  );
}
```

**Step 2: Verify full flow in browser**
1. Navigate to http://localhost:3000/tracker/setup
2. Select 2–4 factions, enter player names, click "Begin Game"
3. Tracker page should load with player cards
4. Increment/decrement Doom, Gates, Elder Signs on each card
5. Toggle spellbooks — when all 6 checked the card should glow
6. Check Interaction Warnings panel shows tips for your factions
7. Refresh the page — state should persist
8. Click "End Game" — should return to hub
9. Hub should show the session with "Complete" badge

**Step 3: Commit**
```bash
git add "src/app/tracker/[sessionId]/page.tsx"
git commit -m "feat(tracker): add live /tracker/[sessionId] round tracker page"
```

---

## Task 11: Game Setup Integration

**Files:**
- Modify: `src/components/guide/GameSetupChecklist.tsx`

**Step 1: Read the current file first, then add the tracker link**

The `GameSetupChecklist` component wraps `SetupChecklist` with no props. We need to add a "Start Game Tracker →" button below the checklist that links to `/tracker/setup`. This should include the currently-selected factions if we can extract them — but since `SetupChecklist` manages its own checkbox state internally, the simplest approach is a static button that links to `/tracker/setup` (the user will re-confirm faction selection there, pre-populated from the setup checklist if URL params are passed).

After reading the file, add this below the `<SetupChecklist>`:

```typescript
import Link from "next/link";

export function GameSetupChecklist() {
  return (
    <div>
      <SetupChecklist sections={setupSections} />
      <div className="mt-6 flex justify-end">
        <Link
          href="/tracker/setup"
          className="inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 font-heading text-sm font-semibold text-gold transition-colors hover:bg-gold/20"
        >
          Start Game Tracker →
        </Link>
      </div>
    </div>
  );
}
```

**Step 2: Verify at localhost:3000/guide/overview/game-setup**
- Page should show the existing setup checklist
- "Start Game Tracker →" button should appear below it
- Clicking it should navigate to /tracker/setup

**Step 3: Commit**
```bash
git add src/components/guide/GameSetupChecklist.tsx
git commit -m "feat(tracker): add 'Start Game Tracker' link to game setup page"
```

---

## Task 12: Add Tracker Link to Header Nav

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Step 1: Read Header.tsx, then add a "Tracker" link**

In the header, add a "🎲 Tracker" link alongside the existing nav items. Read the file first to see the exact structure, then insert something like:

```tsx
<Link
  href="/tracker"
  className="font-heading text-sm text-bone-muted transition-colors hover:text-bone"
>
  🎲 Tracker
</Link>
```

Place it in the header's right side, before the SearchBar.

**Step 2: Verify header shows Tracker link on all pages**

**Step 3: Commit**
```bash
git add src/components/layout/Header.tsx
git commit -m "feat(tracker): add Tracker link to site header"
```

---

## Final Verification

```bash
npx tsc --noEmit
```

Check all these URLs return 200:
- http://localhost:3000/tracker
- http://localhost:3000/tracker/setup
- http://localhost:3000/tracker/setup?factions=great-cthulhu,black-goat&map=earth
- http://localhost:3000/guide/overview/game-setup (still works, has tracker button)

Full end-to-end flow test:
1. Go to /guide/overview/game-setup → click "Start Game Tracker →"
2. Select 3–4 factions → enter names → click "Begin Game"
3. Increment Doom on each player → check some spellbooks → advance to Round 3
4. Refresh page → all state persists
5. Click "End Game" → returns to /tracker hub → session shown as Complete

Commit all final changes if any:
```bash
git add -A
git commit -m "feat(tracker): complete game tracker implementation"
```
