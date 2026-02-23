# Tracker Overhaul + General Site Improvements — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 9 game tracker features (doom track, ritual cost, phase tracking, action log, undo, gather power automation, doom phase automation, elder sign alerts, unit tracking) and 3 general site improvements (PWA, mobile bottom nav, content cross-linking).

**Architecture:** Expand the existing TrackerSession/PlayerState data model with new fields (ritualCost, phase, actionLog, units). Wrap the existing useReducer with an undo history stack. Add 7 new tracker components that compose into the existing session page. Add PWA via next-pwa, a BottomNav layout component, and a RelatedContent guide component.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Vitest (new), @ducanh2912/next-pwa (new)

---

## Task 1: Set Up Vitest

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`
- Modify: `tsconfig.json`

**Step 1: Install vitest**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npm install -D vitest @vitejs/plugin-react`

**Step 2: Create vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**Step 3: Add test script to package.json**

In `package.json` scripts, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 4: Verify vitest runs**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx vitest run`
Expected: "No test files found" (no error)

**Step 5: Commit**

```bash
git add vitest.config.ts package.json package-lock.json
git commit -m "chore: set up vitest for unit testing"
```

---

## Task 2: Create Faction Units Data

**Files:**
- Create: `src/data/faction-units.ts`
- Create: `src/data/__tests__/faction-units.test.ts`

**Step 1: Write test for faction-units data**

Create `src/data/__tests__/faction-units.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { FACTION_UNITS } from "../faction-units";
import { FACTIONS } from "../faction-data";

describe("FACTION_UNITS", () => {
  it("has an entry for every faction", () => {
    for (const faction of FACTIONS) {
      expect(FACTION_UNITS[faction.id]).toBeDefined();
      expect(FACTION_UNITS[faction.id].length).toBeGreaterThan(0);
    }
  });

  it("every unit has required fields", () => {
    for (const [factionId, units] of Object.entries(FACTION_UNITS)) {
      for (const unit of units) {
        expect(unit.id).toBeTruthy();
        expect(unit.name).toBeTruthy();
        expect(unit.max).toBeGreaterThan(0);
        expect(typeof unit.cost).toBe("number");
        expect(typeof unit.combat).toBe("number");
      }
    }
  });

  it("every faction has exactly one GOO except Ancients", () => {
    for (const [factionId, units] of Object.entries(FACTION_UNITS)) {
      const goos = units.filter((u) => u.isGOO);
      if (factionId === "ancients") {
        expect(goos.length).toBe(0);
      } else {
        expect(goos.length).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx vitest run src/data/__tests__/faction-units.test.ts`
Expected: FAIL — module not found

**Step 3: Create faction-units.ts**

Create `src/data/faction-units.ts`:

```typescript
export interface FactionUnit {
  id: string;
  name: string;
  max: number;
  cost: number;
  combat: number;
  isGOO?: boolean;
}

export const FACTION_UNITS: Record<string, FactionUnit[]> = {
  "great-cthulhu": [
    { id: "acolytes", name: "Acolytes", max: 6, cost: 1, combat: 0 },
    { id: "deep-ones", name: "Deep Ones", max: 4, cost: 1, combat: 1 },
    { id: "shoggoths", name: "Shoggoths", max: 2, cost: 2, combat: 2 },
    { id: "starspawn", name: "Starspawn", max: 2, cost: 3, combat: 3 },
    { id: "cthulhu", name: "Cthulhu", max: 1, cost: 10, combat: 6, isGOO: true },
  ],
  "black-goat": [
    { id: "acolytes", name: "Acolytes", max: 6, cost: 1, combat: 0 },
    { id: "ghouls", name: "Ghouls", max: 2, cost: 1, combat: 0 },
    { id: "mi-go", name: "Mi-Go", max: 3, cost: 2, combat: 1 },
    { id: "dark-young", name: "Dark Young", max: 3, cost: 3, combat: 2 },
    { id: "shub-niggurath", name: "Shub-Niggurath", max: 1, cost: 8, combat: 6, isGOO: true },
  ],
  "crawling-chaos": [
    { id: "acolytes", name: "Acolytes", max: 6, cost: 1, combat: 0 },
    { id: "nightgaunts", name: "Nightgaunts", max: 3, cost: 1, combat: 1 },
    { id: "flying-polyps", name: "Flying Polyps", max: 3, cost: 2, combat: 2 },
    { id: "hunting-horrors", name: "Hunting Horrors", max: 2, cost: 3, combat: 3 },
    { id: "nyarlathotep", name: "Nyarlathotep", max: 1, cost: 10, combat: 6, isGOO: true },
  ],
  "yellow-sign": [
    { id: "acolytes", name: "Acolytes", max: 6, cost: 1, combat: 0 },
    { id: "undead", name: "Undead", max: 6, cost: 1, combat: 1 },
    { id: "byakhee", name: "Byakhee", max: 4, cost: 2, combat: 2 },
    { id: "king-in-yellow", name: "King in Yellow", max: 1, cost: 4, combat: 0, isGOO: true },
    { id: "hastur", name: "Hastur", max: 1, cost: 10, combat: 6, isGOO: true },
  ],
  "opener-of-the-way": [
    { id: "acolytes", name: "Acolytes", max: 6, cost: 1, combat: 0 },
    { id: "mutants", name: "Mutants", max: 4, cost: 1, combat: 0 },
    { id: "abominations", name: "Abominations", max: 3, cost: 2, combat: 2 },
    { id: "spawn-yog-sothoth", name: "Spawn of Yog-Sothoth", max: 2, cost: 3, combat: 3 },
    { id: "yog-sothoth", name: "Yog-Sothoth", max: 1, cost: 10, combat: 6, isGOO: true },
  ],
  "sleeper": [
    { id: "acolytes", name: "Acolytes", max: 6, cost: 1, combat: 0 },
    { id: "serpent-men", name: "Serpent Men", max: 3, cost: 1, combat: 1 },
    { id: "formless-spawn", name: "Formless Spawn", max: 4, cost: 2, combat: 2 },
    { id: "wizards", name: "Wizards", max: 2, cost: 3, combat: 3 },
    { id: "tsathoggua", name: "Tsathoggua", max: 1, cost: 8, combat: 6, isGOO: true },
  ],
  "windwalker": [
    { id: "acolytes", name: "Acolytes", max: 6, cost: 1, combat: 0 },
    { id: "wendigos", name: "Wendigos", max: 4, cost: 1, combat: 1 },
    { id: "gnoph-keh", name: "Gnoph-Keh", max: 4, cost: 2, combat: 3 },
    { id: "rhan-tegoth", name: "Rhan-Tegoth", max: 1, cost: 6, combat: 3, isGOO: true },
    { id: "ithaqua", name: "Ithaqua", max: 1, cost: 10, combat: 6, isGOO: true },
  ],
  "tcho-tcho": [
    { id: "acolytes", name: "Acolytes", max: 6, cost: 1, combat: 0 },
    { id: "high-priests-tt", name: "High Priests", max: 3, cost: 3, combat: 0 },
    { id: "proto-shoggoths", name: "Proto-Shoggoths", max: 6, cost: 2, combat: 1 },
    { id: "ubbo-sathla", name: "Ubbo-Sathla", max: 1, cost: 6, combat: 0, isGOO: true },
  ],
  "ancients": [
    { id: "acolytes", name: "Acolytes", max: 6, cost: 1, combat: 0 },
    { id: "un-men", name: "Un-Men", max: 3, cost: 1, combat: 0 },
    { id: "reanimated", name: "Reanimated", max: 3, cost: 2, combat: 2 },
    { id: "yothans", name: "Yothans", max: 3, cost: 3, combat: 7 },
    // No GOO — Ancients use Cathedrals instead
  ],
  "daemon-sultan": [
    { id: "acolytes", name: "Acolytes", max: 6, cost: 1, combat: 0 },
    { id: "larvae-thesis", name: "Larvae (Thesis)", max: 2, cost: 2, combat: 2 },
    { id: "larvae-antithesis", name: "Larvae (Antithesis)", max: 2, cost: 2, combat: 2 },
    { id: "larvae-synthesis", name: "Larvae (Synthesis)", max: 2, cost: 2, combat: 2 },
    { id: "thesis", name: "Thesis", max: 1, cost: 6, combat: 6, isGOO: true },
    { id: "antithesis", name: "Antithesis", max: 1, cost: 6, combat: 6, isGOO: true },
    { id: "synthesis", name: "Synthesis", max: 1, cost: 6, combat: 6, isGOO: true },
  ],
  "bubastis": [
    // Bubastis has NO acolytes — unique among factions
    { id: "earth-cats", name: "Earth Cats", max: 6, cost: 1, combat: 0 },
    { id: "cats-mars", name: "Cats from Mars", max: 2, cost: 2, combat: 1 },
    { id: "cats-saturn", name: "Cats from Saturn", max: 2, cost: 3, combat: 2 },
    { id: "cats-uranus", name: "Cats from Uranus", max: 2, cost: 4, combat: 3 },
    { id: "bastet", name: "Bastet", max: 1, cost: 6, combat: 0, isGOO: true },
  ],
};
```

**Step 4: Run test to verify it passes**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx vitest run src/data/__tests__/faction-units.test.ts`
Expected: PASS — all 3 tests green

**Step 5: Commit**

```bash
git add src/data/faction-units.ts src/data/__tests__/faction-units.test.ts
git commit -m "feat: add faction unit roster data for all 11 factions"
```

---

## Task 3: Expand Data Model (TrackerSession + PlayerState)

**Files:**
- Modify: `src/lib/tracker-session.ts`
- Create: `src/lib/__tests__/tracker-session.test.ts`

**Step 1: Write tests for expanded types and migration**

Create `src/lib/__tests__/tracker-session.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { migrateSession, type TrackerSession, type PlayerState } from "../tracker-session";

function makeOldSession(): Record<string, unknown> {
  return {
    id: "abc123",
    createdAt: "2026-01-01T00:00:00Z",
    map: "earth",
    expansions: [],
    round: 3,
    firstPlayer: 0,
    direction: "cw",
    players: [
      {
        name: "Alice",
        factionId: "great-cthulhu",
        doom: 12,
        gates: 3,
        power: 5,
        spellbooks: [true, false, false, false, false, false],
        elderSigns: 0,
        // no 'units' field — old format
      },
    ],
    // no ritualCost, phase, actionLog — old format
  };
}

describe("migrateSession", () => {
  it("fills missing fields with defaults", () => {
    const old = makeOldSession() as unknown as TrackerSession;
    const migrated = migrateSession(old);

    expect(migrated.ritualCost).toBe(5);
    expect(migrated.phase).toBe("action");
    expect(migrated.actionLog).toEqual([]);
  });

  it("fills missing player.units with empty object", () => {
    const old = makeOldSession() as unknown as TrackerSession;
    const migrated = migrateSession(old);

    expect(migrated.players[0].units).toEqual({});
  });

  it("preserves existing new fields if present", () => {
    const session: TrackerSession = {
      ...makeOldSession(),
      ritualCost: 7,
      phase: "doom",
      actionLog: [{ round: 1, phase: "doom", description: "test", timestamp: "T" }],
      players: [
        {
          name: "Alice",
          factionId: "great-cthulhu",
          doom: 12,
          gates: 3,
          power: 5,
          spellbooks: [true, false, false, false, false, false],
          elderSigns: 0,
          units: { "deep-ones": 2 },
        },
      ],
    } as TrackerSession;

    const migrated = migrateSession(session);
    expect(migrated.ritualCost).toBe(7);
    expect(migrated.phase).toBe("doom");
    expect(migrated.actionLog).toHaveLength(1);
    expect(migrated.players[0].units).toEqual({ "deep-ones": 2 });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx vitest run src/lib/__tests__/tracker-session.test.ts`
Expected: FAIL — migrateSession not exported

**Step 3: Update tracker-session.ts with new fields and migration**

Modify `src/lib/tracker-session.ts`:

Add to the `PlayerState` interface:
```typescript
units: Record<string, number>;
```

Add new `ActionLogEntry` interface:
```typescript
export interface ActionLogEntry {
  round: number;
  phase: string;
  description: string;
  timestamp: string;
}
```

Add to `TrackerSession` interface:
```typescript
ritualCost: number;
phase: "gather" | "action" | "doom";
actionLog: ActionLogEntry[];
```

Add `migrateSession` function:
```typescript
export function migrateSession(session: TrackerSession): TrackerSession {
  return {
    ...session,
    ritualCost: (session as any).ritualCost ?? 5,
    phase: (session as any).phase ?? "action",
    actionLog: (session as any).actionLog ?? [],
    players: session.players.map((p) => ({
      ...p,
      units: (p as any).units ?? {},
    })),
  };
}
```

Update `loadSession` to call `migrateSession`:
```typescript
export function loadSession(id: string): TrackerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(sessionKey(id));
    if (!raw) return null;
    const session = JSON.parse(raw) as TrackerSession;
    return migrateSession(session);
  } catch {
    return null;
  }
}
```

Update `createDefaultPlayers` to include `units: {}`.

**Step 4: Run tests to verify they pass**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx vitest run src/lib/__tests__/tracker-session.test.ts`
Expected: PASS — all 3 tests green

**Step 5: Commit**

```bash
git add src/lib/tracker-session.ts src/lib/__tests__/tracker-session.test.ts
git commit -m "feat: expand TrackerSession data model with ritual cost, phase, action log, and units"
```

---

## Task 4: Expand Reducer with New Actions + Undo

**Files:**
- Modify: `src/lib/tracker-reducer.ts`
- Create: `src/lib/__tests__/tracker-reducer.test.ts`

**Step 1: Write tests for new reducer actions**

Create `src/lib/__tests__/tracker-reducer.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { trackerReducer, type TrackerAction } from "../tracker-reducer";
import type { TrackerSession } from "../tracker-session";

function makeSession(overrides?: Partial<TrackerSession>): TrackerSession {
  return {
    id: "test",
    createdAt: "2026-01-01T00:00:00Z",
    map: "earth",
    expansions: [],
    round: 1,
    firstPlayer: 0,
    direction: "cw",
    ritualCost: 5,
    phase: "action",
    actionLog: [],
    players: [
      {
        name: "Alice",
        factionId: "great-cthulhu",
        doom: 10,
        gates: 3,
        power: 8,
        spellbooks: Array(6).fill(false),
        elderSigns: 0,
        units: {},
      },
      {
        name: "Bob",
        factionId: "black-goat",
        doom: 8,
        gates: 2,
        power: 6,
        spellbooks: Array(6).fill(false),
        elderSigns: 0,
        units: {},
      },
    ],
    ...overrides,
  };
}

describe("SET_PHASE", () => {
  it("changes the phase", () => {
    const state = makeSession();
    const result = trackerReducer(state, { type: "SET_PHASE", phase: "doom" });
    expect(result.phase).toBe("doom");
  });
});

describe("GATHER_POWER", () => {
  it("sets each player power to 2 * gates", () => {
    const state = makeSession();
    state.players[0].gates = 3;
    state.players[0].power = 0;
    state.players[1].gates = 2;
    state.players[1].power = 0;

    const result = trackerReducer(state, { type: "GATHER_POWER" });
    expect(result.players[0].power).toBe(6);
    expect(result.players[1].power).toBe(4);
  });
});

describe("SCORE_DOOM", () => {
  it("adds gates to doom for each player", () => {
    const state = makeSession();
    state.players[0].doom = 10;
    state.players[0].gates = 3;
    state.players[1].doom = 8;
    state.players[1].gates = 2;

    const result = trackerReducer(state, { type: "SCORE_DOOM" });
    expect(result.players[0].doom).toBe(13);
    expect(result.players[1].doom).toBe(10);
  });

  it("logs the action", () => {
    const state = makeSession();
    const result = trackerReducer(state, { type: "SCORE_DOOM" });
    expect(result.actionLog.length).toBeGreaterThan(0);
    expect(result.actionLog[result.actionLog.length - 1].description).toContain("Doom scored");
  });
});

describe("PERFORM_RITUAL", () => {
  it("adds doom equal to gates, adds 1 elder sign, increments ritual cost, subtracts power", () => {
    const state = makeSession({ ritualCost: 5 });
    state.players[0].doom = 10;
    state.players[0].gates = 3;
    state.players[0].power = 10;
    state.players[0].elderSigns = 0;

    const result = trackerReducer(state, { type: "PERFORM_RITUAL", playerIdx: 0 });
    expect(result.players[0].doom).toBe(13);       // +3 gates
    expect(result.players[0].elderSigns).toBe(1);   // +1
    expect(result.players[0].power).toBe(5);         // 10 - 5 cost
    expect(result.ritualCost).toBe(6);               // 5 + 1
  });

  it("logs the ritual", () => {
    const state = makeSession({ ritualCost: 5 });
    state.players[0].power = 10;
    const result = trackerReducer(state, { type: "PERFORM_RITUAL", playerIdx: 0 });
    const lastLog = result.actionLog[result.actionLog.length - 1];
    expect(lastLog.description).toContain("Ritual");
  });
});

describe("SET_UNITS", () => {
  it("sets a unit count for a player", () => {
    const state = makeSession();
    const result = trackerReducer(state, {
      type: "SET_UNITS",
      playerIdx: 0,
      unitId: "deep-ones",
      count: 3,
    });
    expect(result.players[0].units["deep-ones"]).toBe(3);
  });

  it("clamps to 0 minimum", () => {
    const state = makeSession();
    const result = trackerReducer(state, {
      type: "SET_UNITS",
      playerIdx: 0,
      unitId: "deep-ones",
      count: -1,
    });
    expect(result.players[0].units["deep-ones"]).toBe(0);
  });
});

describe("LOG_ACTION", () => {
  it("appends an entry to actionLog", () => {
    const state = makeSession();
    const result = trackerReducer(state, { type: "LOG_ACTION", description: "Test entry" });
    expect(result.actionLog).toHaveLength(1);
    expect(result.actionLog[0].description).toBe("Test entry");
    expect(result.actionLog[0].round).toBe(1);
  });
});

describe("ADVANCE_PHASE", () => {
  it("cycles gather -> action -> doom -> gather (with round increment)", () => {
    let state = makeSession({ phase: "gather", round: 1 });

    state = trackerReducer(state, { type: "ADVANCE_PHASE" });
    expect(state.phase).toBe("action");
    expect(state.round).toBe(1);

    state = trackerReducer(state, { type: "ADVANCE_PHASE" });
    expect(state.phase).toBe("doom");
    expect(state.round).toBe(1);

    state = trackerReducer(state, { type: "ADVANCE_PHASE" });
    expect(state.phase).toBe("gather");
    expect(state.round).toBe(2); // new round
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx vitest run src/lib/__tests__/tracker-reducer.test.ts`
Expected: FAIL — new action types not handled

**Step 3: Expand the reducer**

Modify `src/lib/tracker-reducer.ts`. Add new action types to the union:

```typescript
| { type: "SET_PHASE"; phase: "gather" | "action" | "doom" }
| { type: "ADVANCE_PHASE" }
| { type: "GATHER_POWER" }
| { type: "SCORE_DOOM" }
| { type: "PERFORM_RITUAL"; playerIdx: number }
| { type: "SET_UNITS"; playerIdx: number; unitId: string; count: number }
| { type: "LOG_ACTION"; description: string }
```

Add cases to the switch:

```typescript
case "SET_PHASE":
  return { ...state, phase: action.phase };

case "ADVANCE_PHASE": {
  const phases: Array<"gather" | "action" | "doom"> = ["gather", "action", "doom"];
  const idx = phases.indexOf(state.phase);
  const nextIdx = (idx + 1) % phases.length;
  const nextRound = nextIdx === 0 ? state.round + 1 : state.round;
  return { ...state, phase: phases[nextIdx], round: nextRound };
}

case "GATHER_POWER": {
  const players = state.players.map((p) => ({
    ...p,
    power: 2 * p.gates,
  }));
  return { ...state, players };
}

case "SCORE_DOOM": {
  const players = state.players.map((p) => ({
    ...p,
    doom: p.doom + p.gates,
  }));
  const entry: ActionLogEntry = {
    round: state.round,
    phase: state.phase,
    description: `Doom scored: ${state.players.map((p) => `${p.name} +${p.gates}`).join(", ")}`,
    timestamp: new Date().toISOString(),
  };
  return { ...state, players, actionLog: [...state.actionLog, entry] };
}

case "PERFORM_RITUAL": {
  const p = state.players[action.playerIdx];
  const players = state.players.map((pl, i) =>
    i === action.playerIdx
      ? {
          ...pl,
          doom: pl.doom + pl.gates,
          elderSigns: pl.elderSigns + 1,
          power: pl.power - state.ritualCost,
        }
      : pl
  );
  const entry: ActionLogEntry = {
    round: state.round,
    phase: state.phase,
    description: `${p.name} performed Ritual of Annihilation (cost ${state.ritualCost}, +${p.gates} Doom, +1 Elder Sign)`,
    timestamp: new Date().toISOString(),
  };
  return {
    ...state,
    players,
    ritualCost: state.ritualCost + 1,
    actionLog: [...state.actionLog, entry],
  };
}

case "SET_UNITS": {
  const players = state.players.map((p, i) =>
    i === action.playerIdx
      ? { ...p, units: { ...p.units, [action.unitId]: Math.max(0, action.count) } }
      : p
  );
  return { ...state, players };
}

case "LOG_ACTION": {
  const entry: ActionLogEntry = {
    round: state.round,
    phase: state.phase,
    description: action.description,
    timestamp: new Date().toISOString(),
  };
  return { ...state, actionLog: [...state.actionLog, entry] };
}
```

Also add the import at the top:
```typescript
import type { ActionLogEntry } from "./tracker-session";
```

**Step 4: Run tests to verify they pass**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx vitest run src/lib/__tests__/tracker-reducer.test.ts`
Expected: PASS — all tests green

**Step 5: Commit**

```bash
git add src/lib/tracker-reducer.ts src/lib/__tests__/tracker-reducer.test.ts
git commit -m "feat: add reducer actions for phases, ritual, gather power, score doom, units, logging"
```

---

## Task 5: Add Undo Wrapper

**Files:**
- Create: `src/lib/use-undo-reducer.ts`
- Create: `src/lib/__tests__/use-undo-reducer.test.ts`

**Step 1: Write tests for undo logic**

Create `src/lib/__tests__/use-undo-reducer.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { undoReducer } from "../use-undo-reducer";
import { trackerReducer } from "../tracker-reducer";
import type { TrackerSession } from "../tracker-session";

function makeState(): { past: TrackerSession[]; present: TrackerSession } {
  return {
    past: [],
    present: {
      id: "test",
      createdAt: "2026-01-01T00:00:00Z",
      map: "earth",
      expansions: [],
      round: 1,
      firstPlayer: 0,
      direction: "cw",
      ritualCost: 5,
      phase: "action",
      actionLog: [],
      players: [
        {
          name: "Alice",
          factionId: "great-cthulhu",
          doom: 10,
          gates: 3,
          power: 8,
          spellbooks: Array(6).fill(false),
          elderSigns: 0,
          units: {},
        },
      ],
    },
  };
}

describe("undoReducer", () => {
  it("wraps a normal action and pushes to past", () => {
    const state = makeState();
    const result = undoReducer(state, { type: "SET_DOOM", playerIdx: 0, value: 15 }, trackerReducer);
    expect(result.present.players[0].doom).toBe(15);
    expect(result.past).toHaveLength(1);
    expect(result.past[0].players[0].doom).toBe(10); // old value
  });

  it("UNDO pops the past", () => {
    const state = makeState();
    // Make a change first
    const after = undoReducer(state, { type: "SET_DOOM", playerIdx: 0, value: 15 }, trackerReducer);
    // Undo it
    const undone = undoReducer(after, { type: "UNDO" }, trackerReducer);
    expect(undone.present.players[0].doom).toBe(10);
    expect(undone.past).toHaveLength(0);
  });

  it("UNDO with empty past does nothing", () => {
    const state = makeState();
    const result = undoReducer(state, { type: "UNDO" }, trackerReducer);
    expect(result.present.players[0].doom).toBe(10);
  });

  it("caps history at 50 entries", () => {
    let state = makeState();
    for (let i = 0; i < 60; i++) {
      state = undoReducer(state, { type: "SET_DOOM", playerIdx: 0, value: i }, trackerReducer);
    }
    expect(state.past.length).toBeLessThanOrEqual(50);
  });

  it("LOAD action does not push to history", () => {
    const state = makeState();
    const loaded: TrackerSession = { ...state.present, round: 5 };
    const result = undoReducer(state, { type: "LOAD", session: loaded }, trackerReducer);
    expect(result.present.round).toBe(5);
    expect(result.past).toHaveLength(0);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx vitest run src/lib/__tests__/use-undo-reducer.test.ts`
Expected: FAIL — module not found

**Step 3: Create use-undo-reducer.ts**

Create `src/lib/use-undo-reducer.ts`:

```typescript
import type { TrackerSession } from "./tracker-session";
import type { TrackerAction } from "./tracker-reducer";

const MAX_HISTORY = 50;

export interface UndoState {
  past: TrackerSession[];
  present: TrackerSession;
}

export type UndoAction = TrackerAction | { type: "UNDO" };

export function undoReducer(
  state: UndoState,
  action: UndoAction,
  innerReducer: (s: TrackerSession, a: TrackerAction) => TrackerSession
): UndoState {
  if (action.type === "UNDO") {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    return {
      past: state.past.slice(0, -1),
      present: previous,
    };
  }

  // LOAD bypasses history — we don't want loading a session to be undoable
  if (action.type === "LOAD") {
    return {
      past: [],
      present: innerReducer(state.present, action),
    };
  }

  const newPresent = innerReducer(state.present, action as TrackerAction);
  const newPast = [...state.past, state.present].slice(-MAX_HISTORY);

  return {
    past: newPast,
    present: newPresent,
  };
}
```

**Step 4: Run tests to verify they pass**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx vitest run src/lib/__tests__/use-undo-reducer.test.ts`
Expected: PASS — all 5 tests green

**Step 5: Commit**

```bash
git add src/lib/use-undo-reducer.ts src/lib/__tests__/use-undo-reducer.test.ts
git commit -m "feat: add undo wrapper for tracker reducer with 50-entry history cap"
```

---

## Task 6: Update Setup Page for New Fields

**Files:**
- Modify: `src/app/tracker/setup/page.tsx`

**Step 1: Update handleBegin to initialize new session fields**

In the `handleBegin` function, add the new fields to the session object:

```typescript
const session = {
  id,
  createdAt: new Date().toISOString(),
  map,
  expansions,
  round: 1,
  firstPlayer,
  direction,
  ritualCost: 5,
  phase: "gather" as const,    // games start with Gather Power
  actionLog: [],
  players: createDefaultPlayers(factions, names),
};
```

**Step 2: Verify build passes**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx next build`
Expected: Build succeeds with no type errors

**Step 3: Commit**

```bash
git add src/app/tracker/setup/page.tsx
git commit -m "feat: initialize new session fields (ritualCost, phase, actionLog) on game setup"
```

---

## Task 7: Build DoomTrack Component

**Files:**
- Create: `src/components/tracker/DoomTrack.tsx`

**Step 1: Create DoomTrack.tsx**

Create `src/components/tracker/DoomTrack.tsx`:

```tsx
"use client";

import { FACTION_MAP } from "@/data/faction-data";
import type { PlayerState } from "@/lib/tracker-session";

interface DoomTrackProps {
  players: PlayerState[];
}

const MAX_DOOM = 30;
const TICKS = [0, 5, 10, 15, 20, 25, 30];

export function DoomTrack({ players }: DoomTrackProps) {
  return (
    <div className="rounded-xl border border-void-lighter bg-void-light p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-bone-muted">
          Doom Track
        </span>
        <span className="text-[10px] text-bone-muted/60">30 = Final Scoring</span>
      </div>

      {/* Track bar */}
      <div className="relative h-8">
        {/* Background track */}
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-void-lighter" />

        {/* Danger zone (25-30) */}
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-r-full bg-red-500/20"
          style={{ left: `${(25 / MAX_DOOM) * 100}%`, right: "0%" }}
        />

        {/* Tick marks */}
        {TICKS.map((tick) => (
          <div
            key={tick}
            className="absolute top-1/2 -translate-x-1/2"
            style={{ left: `${(tick / MAX_DOOM) * 100}%` }}
          >
            <div className="h-3 w-px -translate-y-1/2 bg-bone-muted/30" />
            <span className="absolute top-4 -translate-x-1/2 text-[9px] text-bone-muted/50 tabular-nums">
              {tick}
            </span>
          </div>
        ))}

        {/* Player markers */}
        {players.map((player, i) => {
          const faction = FACTION_MAP[player.factionId];
          const position = Math.min(player.doom, MAX_DOOM);
          const atMax = player.doom >= MAX_DOOM;

          return (
            <div
              key={player.factionId}
              className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                atMax ? "animate-pulse" : ""
              }`}
              style={{
                left: `${(position / MAX_DOOM) * 100}%`,
                // Stack overlapping markers vertically
                marginTop: `${(i % 2 === 0 ? -1 : 1) * 8}px`,
              }}
              title={`${player.name}: ${player.doom} Doom`}
            >
              <div
                className="h-4 w-4 rounded-full border-2 border-void"
                style={{ backgroundColor: faction?.color ?? "#666" }}
              />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-3">
        {players.map((player) => {
          const faction = FACTION_MAP[player.factionId];
          return (
            <div key={player.factionId} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: faction?.color ?? "#666" }}
              />
              <span className="text-xs text-bone-muted">
                {player.name}{" "}
                <span className={`font-bold tabular-nums ${
                  player.doom >= 25 ? "text-red-400" : player.doom >= 20 ? "text-amber-400" : "text-bone"
                }`}>
                  {player.doom}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 2: Verify build passes**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/tracker/DoomTrack.tsx
git commit -m "feat: add shared DoomTrack visualization component (0-30 with player markers)"
```

---

## Task 8: Build PhaseBar Component

**Files:**
- Create: `src/components/tracker/PhaseBar.tsx`

**Step 1: Create PhaseBar.tsx**

Create `src/components/tracker/PhaseBar.tsx`:

```tsx
"use client";

type Phase = "gather" | "action" | "doom";

interface PhaseBarProps {
  phase: Phase;
  onAdvance: () => void;
}

const PHASE_LABELS: Record<Phase, { label: string; icon: string; color: string }> = {
  gather: { label: "Gather Power", icon: "⚡", color: "text-amber-400" },
  action: { label: "Action Phase", icon: "⚔️", color: "text-blue-400" },
  doom: { label: "Doom Phase", icon: "💀", color: "text-red-400" },
};

const PHASE_ORDER: Phase[] = ["gather", "action", "doom"];

export function PhaseBar({ phase, onAdvance }: PhaseBarProps) {
  const current = PHASE_LABELS[phase];
  const nextPhase = PHASE_ORDER[(PHASE_ORDER.indexOf(phase) + 1) % PHASE_ORDER.length];
  const isNewRound = nextPhase === "gather";

  return (
    <div className="flex items-center gap-3">
      {/* Phase steps */}
      <div className="flex items-center gap-1">
        {PHASE_ORDER.map((p) => {
          const info = PHASE_LABELS[p];
          const isActive = p === phase;
          const isPast = PHASE_ORDER.indexOf(p) < PHASE_ORDER.indexOf(phase);

          return (
            <div
              key={p}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                isActive
                  ? `${info.color} bg-void-lighter border border-current`
                  : isPast
                  ? "text-bone-muted/40 line-through"
                  : "text-bone-muted/40"
              }`}
            >
              <span>{info.icon}</span>
              <span className="hidden sm:inline">{info.label}</span>
            </div>
          );
        })}
      </div>

      {/* Advance button */}
      <button
        onClick={onAdvance}
        className="rounded-lg border border-void-lighter bg-void-lighter px-3 py-1.5 text-xs font-medium text-bone-muted transition-colors hover:text-bone hover:border-gold/40"
      >
        {isNewRound ? "Next Round →" : `${PHASE_LABELS[nextPhase].icon} ${PHASE_LABELS[nextPhase].label} →`}
      </button>
    </div>
  );
}
```

**Step 2: Verify build passes**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/tracker/PhaseBar.tsx
git commit -m "feat: add PhaseBar component showing gather/action/doom phase progression"
```

---

## Task 9: Build PhaseActions + RitualButton Components

**Files:**
- Create: `src/components/tracker/PhaseActions.tsx`
- Create: `src/components/tracker/RitualButton.tsx`

**Step 1: Create RitualButton.tsx**

Create `src/components/tracker/RitualButton.tsx`:

```tsx
"use client";

import { FACTION_MAP } from "@/data/faction-data";
import type { PlayerState } from "@/lib/tracker-session";

interface RitualButtonProps {
  player: PlayerState;
  ritualCost: number;
  onPerform: () => void;
}

export function RitualButton({ player, ritualCost, onPerform }: RitualButtonProps) {
  const faction = FACTION_MAP[player.factionId];
  const canAfford = player.power >= ritualCost;
  const isInstantDeath = ritualCost > 10;

  if (isInstantDeath) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
        <span className="text-sm">☠</span>
        <span className="text-xs font-bold text-red-400">INSTANT DEATH</span>
      </div>
    );
  }

  return (
    <button
      onClick={onPerform}
      disabled={!canAfford}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
        canAfford
          ? "border-gold/40 bg-gold/10 text-gold hover:bg-gold/20"
          : "border-void-lighter text-bone-muted/40 cursor-not-allowed"
      }`}
    >
      <div
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: faction?.color }}
      />
      <span>{player.name}</span>
      <span className="text-bone-muted">
        Ritual ({ritualCost}⚡ → +{player.gates} Doom, +1 ES)
      </span>
    </button>
  );
}
```

**Step 2: Create PhaseActions.tsx**

Create `src/components/tracker/PhaseActions.tsx`:

```tsx
"use client";

import type { PlayerState } from "@/lib/tracker-session";
import { RitualButton } from "./RitualButton";

type Phase = "gather" | "action" | "doom";

interface PhaseActionsProps {
  phase: Phase;
  players: PlayerState[];
  ritualCost: number;
  onGatherPower: () => void;
  onScoreDoom: () => void;
  onPerformRitual: (playerIdx: number) => void;
}

export function PhaseActions({
  phase,
  players,
  ritualCost,
  onGatherPower,
  onScoreDoom,
  onPerformRitual,
}: PhaseActionsProps) {
  return (
    <div className="rounded-xl border border-void-lighter bg-void-light p-4">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-bone-muted">
        Phase Actions
      </p>

      {phase === "gather" && (
        <div className="space-y-2">
          <p className="text-xs text-bone-muted">
            Each player gains Power = 2 x Gates controlled.
          </p>
          <button
            onClick={onGatherPower}
            className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-400/20"
          >
            ⚡ Gather Power for All Players
          </button>
          <div className="flex flex-wrap gap-2 text-xs text-bone-muted/60">
            {players.map((p) => (
              <span key={p.factionId}>
                {p.name}: {p.gates} gates → {2 * p.gates}⚡
              </span>
            ))}
          </div>
        </div>
      )}

      {phase === "action" && (
        <p className="text-xs text-bone-muted">
          Players take turns performing actions. Advance to Doom Phase when all players pass.
        </p>
      )}

      {phase === "doom" && (
        <div className="space-y-4">
          {/* Score Doom */}
          <div>
            <p className="mb-2 text-xs text-bone-muted">
              Each player scores 1 Doom per Gate controlled.
            </p>
            <button
              onClick={onScoreDoom}
              className="rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-400/20"
            >
              💀 Score Doom for All Players
            </button>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-bone-muted/60">
              {players.map((p) => (
                <span key={p.factionId}>
                  {p.name}: +{p.gates} Doom
                </span>
              ))}
            </div>
          </div>

          {/* Ritual of Annihilation */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="text-xs text-bone-muted">Ritual of Annihilation</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                ritualCost > 10
                  ? "bg-red-500/20 text-red-400"
                  : ritualCost >= 8
                  ? "bg-amber-400/20 text-amber-400"
                  : "bg-void-lighter text-bone-muted"
              }`}>
                Cost: {ritualCost > 10 ? "☠ DEAD" : `${ritualCost}⚡`}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {players.map((player, i) => (
                <RitualButton
                  key={player.factionId}
                  player={player}
                  ritualCost={ritualCost}
                  onPerform={() => onPerformRitual(i)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 3: Verify build passes**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx next build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/components/tracker/PhaseActions.tsx src/components/tracker/RitualButton.tsx
git commit -m "feat: add PhaseActions and RitualButton components for phase-specific game actions"
```

---

## Task 10: Build UnitTracker Component

**Files:**
- Create: `src/components/tracker/UnitTracker.tsx`

**Step 1: Create UnitTracker.tsx**

Create `src/components/tracker/UnitTracker.tsx`:

```tsx
"use client";

import { useState } from "react";
import { FACTION_UNITS } from "@/data/faction-units";

interface UnitTrackerProps {
  factionId: string;
  units: Record<string, number>;
  factionColor: string;
  onSetUnit: (unitId: string, count: number) => void;
}

export function UnitTracker({ factionId, units, factionColor, onSetUnit }: UnitTrackerProps) {
  const [open, setOpen] = useState(false);
  const roster = FACTION_UNITS[factionId] ?? [];

  if (roster.length === 0) return null;

  const totalDeployed = roster.reduce((sum, u) => sum + (units[u.id] ?? 0), 0);
  const totalMax = roster.reduce((sum, u) => sum + u.max, 0);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-1"
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest text-bone-muted">
          Units {totalDeployed}/{totalMax}
        </span>
        <span className="text-[10px] text-bone-muted">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-1 space-y-1">
          {roster.map((unit) => {
            const count = units[unit.id] ?? 0;
            return (
              <div key={unit.id} className="flex items-center gap-2">
                <span className={`flex-1 text-xs ${unit.isGOO ? "font-bold text-bone" : "text-bone-muted"}`}>
                  {unit.name}
                  {unit.isGOO && <span className="ml-1 text-[9px] text-gold">GOO</span>}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSetUnit(unit.id, count - 1)}
                    disabled={count <= 0}
                    className="flex h-5 w-5 items-center justify-center rounded bg-void-lighter text-[10px] text-bone-muted hover:text-bone disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-xs font-medium tabular-nums text-bone">
                    {count}
                    <span className="text-bone-muted/40">/{unit.max}</span>
                  </span>
                  <button
                    onClick={() => onSetUnit(unit.id, count + 1)}
                    disabled={count >= unit.max}
                    className="flex h-5 w-5 items-center justify-center rounded bg-void-lighter text-[10px] text-bone-muted hover:text-bone disabled:opacity-30"
                  >
                    +
                  </button>
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

**Step 2: Verify build passes**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/tracker/UnitTracker.tsx
git commit -m "feat: add collapsible UnitTracker component showing deployed/max for each unit type"
```

---

## Task 11: Build ActionLog Component

**Files:**
- Create: `src/components/tracker/ActionLog.tsx`

**Step 1: Create ActionLog.tsx**

Create `src/components/tracker/ActionLog.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { ActionLogEntry } from "@/lib/tracker-session";

interface ActionLogProps {
  entries: ActionLogEntry[];
}

export function ActionLog({ entries }: ActionLogProps) {
  const [open, setOpen] = useState(false);

  if (entries.length === 0) return null;

  // Group by round, most recent first
  const reversed = [...entries].reverse();
  const grouped: Record<number, ActionLogEntry[]> = {};
  for (const entry of reversed) {
    if (!grouped[entry.round]) grouped[entry.round] = [];
    grouped[entry.round].push(entry);
  }
  const rounds = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="rounded-xl border border-void-lighter bg-void-light">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-3 text-left"
      >
        <span className="font-heading text-sm font-semibold uppercase tracking-wider text-bone-muted">
          📜 Action Log ({entries.length})
        </span>
        <span className="text-bone-muted">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="max-h-60 overflow-y-auto border-t border-void-lighter">
          {rounds.map((round) => (
            <div key={round}>
              <div className="sticky top-0 bg-void-lighter px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-bone-muted/60">
                Round {round}
              </div>
              {grouped[round].map((entry, i) => (
                <div
                  key={`${round}-${i}`}
                  className="flex items-start gap-2 px-5 py-1.5"
                >
                  <span className="mt-0.5 text-[10px] text-bone-muted/40 tabular-nums shrink-0">
                    {new Date(entry.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-xs text-bone-muted">{entry.description}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Verify build passes**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/tracker/ActionLog.tsx
git commit -m "feat: add collapsible ActionLog component grouped by round"
```

---

## Task 12: Integrate PlayerCard with UnitTracker

**Files:**
- Modify: `src/components/tracker/PlayerCard.tsx`

**Step 1: Add UnitTracker to PlayerCard**

Import and add UnitTracker below the spellbooks section. The PlayerCard needs a new `onSetUnit` prop or direct dispatch access. Since it already has `dispatch`, add the unit tracker after the spellbook section:

```tsx
// Add import at top:
import { UnitTracker } from "./UnitTracker";

// Add after the Spellbooks section closing </div>, before the card's closing </div>:
{/* Units */}
<div className="mt-3 border-t border-void-lighter pt-2">
  <UnitTracker
    factionId={player.factionId}
    units={player.units}
    factionColor={faction?.color ?? "#666"}
    onSetUnit={(unitId, count) =>
      dispatch({ type: "SET_UNITS", playerIdx, unitId, count })
    }
  />
</div>
```

**Step 2: Verify build passes**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/tracker/PlayerCard.tsx
git commit -m "feat: integrate UnitTracker into PlayerCard"
```

---

## Task 13: Assemble the Tracker Session Page

This is the big integration task. The session page (`src/app/tracker/[sessionId]/page.tsx`) gets rebuilt to use the undo wrapper, new components, and new layout.

**Files:**
- Modify: `src/app/tracker/[sessionId]/page.tsx`

**Step 1: Rewrite the session page**

Replace the entire contents of `src/app/tracker/[sessionId]/page.tsx` with the integrated version that:

1. Uses `undoReducer` wrapping `trackerReducer` instead of bare `useReducer`
2. Adds DoomTrack above the player grid
3. Adds PhaseBar in the top bar next to round controls
4. Adds PhaseActions below the player grid
5. Adds ActionLog below interaction warnings
6. Adds Undo button in the top bar
7. Adds Doom-30 banner alert

Key structural changes:
- `useReducer(trackerReducer, EMPTY_SESSION)` becomes a custom `useReducer` that wraps undoReducer
- The `EMPTY_SESSION` gains new fields: `ritualCost: 5, phase: "action" as const, actionLog: []`
- The dispatch calls need to go through the undo wrapper
- All new components get wired to dispatch

The full new page layout order:
```
Top bar: Round controls | PhaseBar | Undo | Hub | End Game
DoomTrack
Player grid (existing)
PhaseActions
InteractionWarnings (existing)
ActionLog
Doom-30 banner (conditional)
```

See the design doc for the exact layout. The page should use `useReducer` with a wrapper function that calls `undoReducer(state, action, trackerReducer)`.

The dispatch wrapper: create a `wrappedDispatch` that calls the underlying dispatch but also handles the undo indirection. The `session` for save/display is `undoState.present`.

Add a conditional banner:
```tsx
{session.players.some((p) => p.doom >= 30) && (
  <div className="rounded-xl border border-gold/40 bg-gold/10 p-4 text-center">
    <p className="font-heading text-lg font-bold text-gold">
      🔔 Final Scoring Triggered!
    </p>
    <p className="text-sm text-bone-muted">
      {session.players
        .filter((p) => p.doom >= 30)
        .map((p) => p.name)
        .join(", ")}{" "}
      reached 30 Doom. Reveal Elder Signs for final tally.
    </p>
  </div>
)}
```

**Step 2: Verify build passes**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx next build`
Expected: Build succeeds

**Step 3: Run all tests**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx vitest run`
Expected: All tests pass

**Step 4: Commit**

```bash
git add src/app/tracker/[sessionId]/page.tsx
git commit -m "feat: integrate all tracker features into session page (doom track, phases, ritual, undo, action log, elder sign alerts)"
```

---

## Task 14: PWA Setup

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`
- Create: `public/manifest.json`
- Create: `public/icons/icon-192.png` (placeholder SVG-based)
- Create: `public/icons/icon-512.png` (placeholder SVG-based)
- Modify: `src/app/layout.tsx`

**Step 1: Install next-pwa**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npm install @ducanh2912/next-pwa`

**Step 2: Create manifest.json**

Create `public/manifest.json`:

```json
{
  "name": "Cthulhu Wars Strategy Guide",
  "short_name": "CW Strategy",
  "description": "Strategy guide and game tracker for Cthulhu Wars",
  "start_url": "/tracker",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#0a0a0f",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Step 3: Generate placeholder icons**

Use a simple Node script or create minimal PNG icons. For now, create placeholder gold-on-void icons using a canvas script:

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && mkdir -p public/icons`

Then create a small node script to generate the icons using sharp (already installed):

```bash
node -e "
const sharp = require('sharp');

async function generateIcon(size, path) {
  const svg = \`<svg width=\"\${size}\" height=\"\${size}\" xmlns=\"http://www.w3.org/2000/svg\">
    <rect width=\"\${size}\" height=\"\${size}\" fill=\"#0a0a0f\"/>
    <text x=\"50%\" y=\"55%\" text-anchor=\"middle\" dominant-baseline=\"middle\"
          font-family=\"serif\" font-size=\"\${size * 0.4}\" font-weight=\"bold\" fill=\"#c4a84d\">
      CW
    </text>
  </svg>\`;
  await sharp(Buffer.from(svg)).png().toFile(path);
}

Promise.all([
  generateIcon(192, 'public/icons/icon-192.png'),
  generateIcon(512, 'public/icons/icon-512.png'),
]).then(() => console.log('Icons generated'));
"
```

**Step 4: Update next.config.ts**

Modify `next.config.ts` to wrap with next-pwa:

```typescript
import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

const withMDX = createMDX({});

export default withPWA(withMDX(nextConfig));
```

**Step 5: Update root layout with manifest + iOS meta**

In `src/app/layout.tsx`, add to the `<head>` section (inside the `<html>` tag):

```tsx
<head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#0a0a0f" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <link rel="apple-touch-icon" href="/icons/icon-192.png" />
</head>
```

**Step 6: Add sw.js and workbox files to .gitignore**

Append to `.gitignore`:
```
# PWA generated files
public/sw.js
public/workbox-*.js
public/swe-worker-*.js
```

**Step 7: Verify build passes**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx next build`
Expected: Build succeeds, service worker generated in public/

**Step 8: Commit**

```bash
git add public/manifest.json public/icons/ next.config.ts src/app/layout.tsx package.json package-lock.json .gitignore
git commit -m "feat: add PWA support with manifest, service worker, and installable icons"
```

---

## Task 15: Mobile Bottom Navigation

**Files:**
- Create: `src/components/layout/BottomNav.tsx`
- Modify: `src/app/guide/layout.tsx` (or root layout, depending on where it should appear)

**Step 1: Create BottomNav.tsx**

Create `src/components/layout/BottomNav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/guide/overview/basics", label: "Guide", icon: "📖" },
  { href: "/guide/factions/great-cthulhu", label: "Factions", icon: "🐙" },
  { href: "/tracker", label: "Tracker", icon: "🎲" },
  { href: "/", label: "Home", icon: "🏠" },
];

export function BottomNav() {
  const pathname = usePathname();

  // Don't show on tracker session pages (they have their own nav)
  if (pathname.startsWith("/tracker/") && pathname !== "/tracker") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-void-lighter bg-void/95 backdrop-blur-sm lg:hidden">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href.split("/").slice(0, 3).join("/"));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-center transition-colors ${
                isActive ? "text-gold" : "text-bone-muted/60"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area spacer for iPhone notch */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
```

**Step 2: Add BottomNav to root layout**

In `src/app/layout.tsx`, import and add `<BottomNav />` at the end of the body, after `{children}`:

```tsx
import { BottomNav } from "@/components/layout/BottomNav";

// In the body:
<body className="min-h-screen bg-void text-bone antialiased pb-16 lg:pb-0">
  {children}
  <BottomNav />
</body>
```

Note the `pb-16 lg:pb-0` on body to give space for the bottom nav on mobile.

**Step 3: Verify build passes**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx next build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/components/layout/BottomNav.tsx src/app/layout.tsx
git commit -m "feat: add mobile bottom navigation bar (Guide, Factions, Tracker, Home)"
```

---

## Task 16: Content Cross-Linking

**Files:**
- Create: `src/components/guide/RelatedContent.tsx`
- Modify: `src/lib/content.ts` (parse `related` frontmatter)
- Modify: `src/app/guide/[...slug]/page.tsx` (render RelatedContent)
- Modify: select MDX files (add `related` frontmatter to a few key pages)

**Step 1: Update GuideFrontmatter to include `related`**

In `src/lib/content.ts`, add to `GuideFrontmatter`:
```typescript
related?: string[];  // e.g. ["factions/black-goat", "advanced/matchups"]
```

**Step 2: Create a helper to resolve related content**

In `src/lib/content.ts`, add:
```typescript
export function getRelatedChapters(chapter: GuideChapter): GuideChapter[] {
  const explicit = chapter.frontmatter.related ?? [];

  if (explicit.length > 0) {
    return explicit
      .map((ref) => {
        const [section, slug] = ref.split("/");
        return getGuideChapter(section, slug);
      })
      .filter(Boolean) as GuideChapter[];
  }

  // Fallback: return up to 3 other chapters from the same section
  const sectionChapters = getGuideSectionChapters(chapter.section);
  return sectionChapters
    .filter((c) => c.slug !== chapter.slug)
    .slice(0, 3);
}
```

**Step 3: Create RelatedContent.tsx**

Create `src/components/guide/RelatedContent.tsx`:

```tsx
import Link from "next/link";
import type { GuideChapter } from "@/lib/content";

interface RelatedContentProps {
  chapters: GuideChapter[];
}

export function RelatedContent({ chapters }: RelatedContentProps) {
  if (chapters.length === 0) return null;

  return (
    <div className="mt-12 border-t border-void-lighter pt-8">
      <h3 className="mb-4 font-heading text-lg font-semibold text-bone-muted">
        Related Content
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {chapters.map((chapter) => (
          <Link
            key={`${chapter.section}/${chapter.slug}`}
            href={`/guide/${chapter.section}/${chapter.slug}`}
            className="group rounded-lg border border-void-lighter bg-void-light p-4 transition-all hover:border-gold/30"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-bone-muted/50">
              {chapter.section.replace(/-/g, " ")}
            </p>
            <p className="mt-1 font-heading text-sm font-semibold text-bone transition-colors group-hover:text-gold">
              {chapter.frontmatter.title}
            </p>
            {chapter.frontmatter.description && (
              <p className="mt-1 text-xs text-bone-muted line-clamp-2">
                {chapter.frontmatter.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
```

**Step 4: Wire into guide page**

In `src/app/guide/[...slug]/page.tsx`, import and use:

```tsx
import { getRelatedChapters } from "@/lib/content";
import { RelatedContent } from "@/components/guide/RelatedContent";

// In GuidePage, after getting chapter:
const related = chapter ? getRelatedChapters(chapter) : [];

// In the JSX, after the mdx-content div:
<RelatedContent chapters={related} />
```

**Step 5: Add `related` frontmatter to a few key pages**

Add `related` field to these MDX files:
- `content/guide/02-factions/great-cthulhu.mdx`: `related: ["overview/advanced-tactics", "advanced/matchups", "monsters/great-old-ones"]`
- `content/guide/01-overview/basics.mdx`: `related: ["overview/game-setup", "overview/advanced-tactics", "overview/threat-assessment"]`
- `content/guide/01-overview/advanced-tactics.mdx`: `related: ["overview/basics", "advanced/politics", "advanced/matchups"]`

**Step 6: Verify build passes**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx next build`
Expected: Build succeeds

**Step 7: Commit**

```bash
git add src/components/guide/RelatedContent.tsx src/lib/content.ts src/app/guide/[...slug]/page.tsx content/guide/
git commit -m "feat: add content cross-linking with RelatedContent component and frontmatter support"
```

---

## Task 17: Final Integration Test + Cleanup

**Step 1: Run all tests**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx vitest run`
Expected: All tests pass

**Step 2: Run production build**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npx next build`
Expected: Build succeeds with no errors

**Step 3: Run lint**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npm run lint`
Expected: No errors (warnings OK)

**Step 4: Smoke test dev server**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npm run dev`
Then manually verify:
- Home page loads
- Tracker setup creates a new game with new fields
- Session page shows DoomTrack, PhaseBar, PhaseActions
- Phase cycling works (gather → action → doom → gather)
- Gather Power button sets power correctly
- Score Doom button adds gates to doom
- Ritual button works and increments cost
- Undo reverts last action
- Unit tracker shows/hides and counts work
- Action log records actions
- Doom 30 banner appears when a player hits 30
- Bottom nav shows on mobile viewport
- Guide pages show Related Content at bottom
- PWA manifest accessible at /manifest.json

**Step 5: Commit any final fixes**

```bash
git add -A
git commit -m "chore: final cleanup and integration verification"
```
