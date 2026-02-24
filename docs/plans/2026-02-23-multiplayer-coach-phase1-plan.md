# Multiplayer Coach — Phase 1: Data Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create structured data files for all neutral game components (Independent GOOs, Terrors, Neutral Monsters, Unique High Priests, Map Strategies) that the multiplayer coaching engine will use, plus add missing expansion IDs.

**Architecture:** Each data file follows the same pattern as existing `faction-units.ts` — typed interfaces with exported const arrays. All data is extracted from the existing MDX guide content and the Cthulhu Wars wiki. Each file gets a corresponding test file validating structure completeness.

**Tech Stack:** TypeScript, Vitest (globals mode, node environment), existing `@/*` path alias

**Design Doc:** `docs/plans/2026-02-23-multiplayer-coach-design.md`

---

### Task 1: Independent GOOs Data File

**Files:**
- Create: `src/data/independent-goos.ts`
- Create: `src/data/__tests__/independent-goos.test.ts`

**Step 1: Write the failing test**

Create `src/data/__tests__/independent-goos.test.ts`:

```typescript
import { INDEPENDENT_GOOS, type IndependentGOO } from "@/data/independent-goos";

describe("INDEPENDENT_GOOS", () => {
  it("should contain all 18 independent GOOs", () => {
    expect(INDEPENDENT_GOOS).toHaveLength(18);
  });

  it("should have unique ids", () => {
    const ids = INDEPENDENT_GOOS.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have required fields on every entry", () => {
    for (const goo of INDEPENDENT_GOOS) {
      expect(goo.id).toBeTruthy();
      expect(goo.name).toBeTruthy();
      expect(goo.pack).toBeTruthy();
      expect(typeof goo.cost).toBe("number");
      expect(goo.abilitySummary).toBeTruthy();
      expect(Array.isArray(goo.tags)).toBe(true);
    }
  });

  it("should have correct pack distribution", () => {
    const byPack = (pack: string) =>
      INDEPENDENT_GOOS.filter((g) => g.pack === pack).length;
    expect(byPack("goo-pack-1")).toBe(5);
    expect(byPack("goo-pack-2")).toBe(4);
    expect(byPack("goo-pack-3")).toBe(1);
    expect(byPack("goo-pack-4")).toBe(3);
    expect(byPack("ramsey-campbell-1")).toBe(2);
    expect(byPack("ramsey-campbell-2")).toBe(2);
    expect(byPack("masks-nyarlathotep")).toBe(2);
  });

  // Note: Dire GOOs and Hagarg Ryonis are NOT independent GOOs in the
  // standard sense — they come from Onslaught 3 and Something About Cats.
  // We track them separately or as tags if needed. The 18 count covers
  // the 7 packs above. Adjust if the actual game has a different count.
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/independent-goos.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/data/independent-goos.ts`:

```typescript
export interface IndependentGOO {
  id: string;
  name: string;
  pack: string; // expansion id that includes this GOO
  cost: number; // Power cost to awaken
  combat: string; // combat value (can be formula like "# filth tokens")
  abilitySummary: string; // 1-2 sentence ability description
  tags: string[]; // searchable tags for tip engine
}

export const INDEPENDENT_GOOS: IndependentGOO[] = [
  // GOO Pack 1
  {
    id: "abhoth",
    name: "Abhoth",
    pack: "goo-pack-1",
    cost: 4,
    combat: "equals filth token count",
    abilitySummary:
      "Spawns Filth tokens that deny areas. Combat scales with Filth on the board. Area denial specialist.",
    tags: ["area-denial", "scaling-combat", "tokens"],
  },
  {
    id: "cthugha",
    name: "Cthugha",
    pack: "goo-pack-1",
    cost: 4,
    combat: "scales to enemy GOO",
    abilitySummary:
      "Combat scales based on enemy GOO presence. Refunds Power when replacing another GOO. Anti-GOO specialist.",
    tags: ["anti-goo", "scaling-combat", "power-refund"],
  },
  {
    id: "mother-hydra",
    name: "Mother Hydra",
    pack: "goo-pack-1",
    cost: 4,
    combat: "6 minus enemy units in area (min 1)",
    abilitySummary:
      "Strongest in lightly defended areas. Ocean control specialist. Can deploy cultists to ocean areas.",
    tags: ["ocean", "area-control", "cultist-deployment"],
  },
  {
    id: "chaugnar-faugn",
    name: "Chaugnar Faugn",
    pack: "goo-pack-1",
    cost: 4,
    combat: "3",
    abilitySummary:
      "Defensive GOO with Elder Sign manipulation. Protects controlled areas and generates Elder Signs.",
    tags: ["defensive", "elder-signs", "area-protection"],
  },
  {
    id: "yig",
    name: "Yig",
    pack: "goo-pack-1",
    cost: 3,
    combat: "2",
    abilitySummary:
      "Cheapest GOO. Destroys enemy gates and extracts Power from opponents. Gate denial specialist.",
    tags: ["cheap", "gate-denial", "power-extraction"],
  },
  // GOO Pack 2
  {
    id: "atlach-nacha",
    name: "Atlach-Nacha",
    pack: "goo-pack-2",
    cost: 6,
    combat: "4",
    abilitySummary:
      "Places Cosmic Web tokens. 6 webs = instant alternate victory. Threatens a non-Doom win condition.",
    tags: ["alternate-win", "web-tokens", "area-control"],
  },
  {
    id: "bokrug",
    name: "Bokrug",
    pack: "goo-pack-2",
    cost: 4,
    combat: "1",
    abilitySummary:
      "Ghost of Ib resurrection mechanic. When eliminated, returns automatically. Poison pill — killing it helps the owner.",
    tags: ["resurrection", "poison-pill", "unkillable"],
  },
  {
    id: "father-dagon",
    name: "Father Dagon",
    pack: "goo-pack-2",
    cost: 4,
    combat: "2 on land, 6 in ocean",
    abilitySummary:
      "Ocean combat specialist. Devastating in ocean areas, weak on land. Sacrifices cultists for power.",
    tags: ["ocean", "combat-specialist", "cultist-sacrifice"],
  },
  {
    id: "ghatanothoa",
    name: "Ghatanothoa",
    pack: "goo-pack-2",
    cost: 5,
    combat: "equals enemy cultist count",
    abilitySummary:
      "Mummification shuts down enemy cultists. Combat scales with opponent cultist presence. Anti-cultist specialist.",
    tags: ["anti-cultist", "scaling-combat", "mummification"],
  },
  // GOO Pack 3
  {
    id: "gobogeg",
    name: "Gobogeg",
    pack: "goo-pack-3",
    cost: 0,
    combat: "0",
    abilitySummary:
      "Free awakening in late game. Book of Law refunds other GOO costs. Book of Chaos rewards for meta-play. Late-game refund engine.",
    tags: ["free", "late-game", "refund-engine", "meta"],
  },
  // GOO Pack 4
  {
    id: "byatis",
    name: "Byatis",
    pack: "goo-pack-4",
    cost: 4,
    combat: "4",
    abilitySummary:
      "Stationary Elder Sign generator. Stays in one area and passively generates Elder Signs each turn.",
    tags: ["elder-signs", "stationary", "passive-generation"],
  },
  {
    id: "nyogtha",
    name: "Nyogtha",
    pack: "goo-pack-4",
    cost: 4,
    combat: "4 if your faction battles, 1 otherwise",
    abilitySummary:
      "Dual-unit duo mechanic with shared actions. Stronger when you initiate combat. Pair-based tactics.",
    tags: ["dual-unit", "combat-conditional", "faction-synergy"],
  },
  {
    id: "tulzscha",
    name: "Tulzscha",
    pack: "goo-pack-4",
    cost: 4,
    combat: "1",
    abilitySummary:
      "Catch-up engine that scales with how far behind you are. Grants bonus Doom, Elder Signs, or Power based on deficit.",
    tags: ["catch-up", "scaling", "comeback-mechanic"],
  },
  // Ramsey Campbell Horrors 1
  {
    id: "eihort",
    name: "Eihort",
    pack: "ramsey-campbell-1",
    cost: 4,
    combat: "0",
    abilitySummary:
      "Transforms cultists into Brood tokens. Brood tokens are cheaper but can't control gates. Swarm economy.",
    tags: ["transformation", "swarm", "cultist-conversion", "zero-combat"],
  },
  {
    id: "glaaki",
    name: "Gla'aki",
    pack: "ramsey-campbell-1",
    cost: 4,
    combat: "equals acolytes in your pool",
    abilitySummary:
      "Inverted economy — stronger when your acolytes are in the pool (not on the map). Rewards keeping units in reserve.",
    tags: ["inverted-economy", "pool-scaling", "reserve-strategy"],
  },
  // Ramsey Campbell Horrors 2
  {
    id: "daoloth",
    name: "Daoloth",
    pack: "ramsey-campbell-2",
    cost: 6,
    combat: "0",
    abilitySummary:
      "Cosmic Unity suppresses enemy GOO abilities. Generates interdimensional gates. GOO counter and gate specialist.",
    tags: ["goo-suppression", "gate-generation", "zero-combat", "control"],
  },
  {
    id: "ygolonac",
    name: "Y'Golonac",
    pack: "ramsey-campbell-2",
    cost: 4,
    combat: "1",
    abilitySummary:
      "Hot-potato possession via Orifices tokens. Passed between players, penalizing the holder. Disruption specialist.",
    tags: ["possession", "disruption", "hot-potato", "tokens"],
  },
  // Masks of Nyarlathotep
  {
    id: "bloated-woman",
    name: "The Bloated Woman",
    pack: "masks-nyarlathotep",
    cost: 4,
    combat: "1",
    abilitySummary:
      "Economic warfare via The Velvet Fan capture mechanic. Captures enemy units for Power economy. Resource denial.",
    tags: ["economic-warfare", "capture", "resource-denial"],
  },
  {
    id: "haunter-of-the-dark",
    name: "The Haunter of the Dark",
    pack: "masks-nyarlathotep",
    cost: 6,
    combat: "equals enemy spellbook count",
    abilitySummary:
      "Late-game scaling threat. Combat equals number of enemy spellbooks — devastating in late rounds. Spellbook-punisher.",
    tags: ["late-game", "scaling-combat", "spellbook-punisher"],
  },
];

export const INDEPENDENT_GOO_MAP = Object.fromEntries(
  INDEPENDENT_GOOS.map((g) => [g.id, g])
);

/** Get GOOs available from a set of selected expansion packs */
export function getAvailableGOOs(expansions: string[]): IndependentGOO[] {
  return INDEPENDENT_GOOS.filter((g) => expansions.includes(g.pack));
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/__tests__/independent-goos.test.ts`
Expected: PASS (all 4 tests)

Note: The test expects 18 GOOs but we may need to adjust the pack distribution test. The guide mentions Dire GOOs (Dire Azathoth, Dire Cthulhu) and Hagarg Ryonis — these are from different sources (Onslaught 3, Something About Cats). If those should be included, add them and adjust the count to 21 and add pack entries. The current 18 covers the 7 standard GOO/expansion packs. Verify against the design doc and adjust.

**Step 5: Commit**

```bash
git add src/data/independent-goos.ts src/data/__tests__/independent-goos.test.ts
git commit -m "feat: add independent GOOs structured data with 18 entries across 7 packs"
```

---

### Task 2: Cosmic Terrors Data File

**Files:**
- Create: `src/data/terrors.ts`
- Create: `src/data/__tests__/terrors.test.ts`

**Step 1: Write the failing test**

Create `src/data/__tests__/terrors.test.ts`:

```typescript
import { TERRORS, type Terror } from "@/data/terrors";

describe("TERRORS", () => {
  it("should contain all 5 terrors", () => {
    expect(TERRORS).toHaveLength(5);
  });

  it("should have unique ids", () => {
    const ids = TERRORS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have required fields on every entry", () => {
    for (const terror of TERRORS) {
      expect(terror.id).toBeTruthy();
      expect(terror.name).toBeTruthy();
      expect(terror.expansion).toBeTruthy();
      expect(typeof terror.combat).toBe("string");
      expect(terror.abilitySummary).toBeTruthy();
      expect(terror.abilityName).toBeTruthy();
      expect(Array.isArray(terror.tags)).toBe(true);
    }
  });

  it("should have 3 from cosmic-terrors and 2 from other expansions", () => {
    const cosmicCount = TERRORS.filter(
      (t) => t.expansion === "cosmic-terrors"
    ).length;
    expect(cosmicCount).toBe(3);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/terrors.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/data/terrors.ts`:

```typescript
export interface Terror {
  id: string;
  name: string;
  expansion: string; // which expansion provides this terror
  combat: string;
  cost: string; // typically "2 Doom + 2 Power"
  abilityName: string;
  abilitySummary: string;
  tags: string[];
}

export const TERRORS: Terror[] = [
  // Original Cosmic Terrors
  {
    id: "great-race-of-yith",
    name: "Great Race of Yith",
    expansion: "cosmic-terrors",
    combat: "3",
    cost: "2 Doom + 2 Power",
    abilityName: "Possess",
    abilitySummary:
      "Captures enemy Cultists by possessing them. Stolen cultists become yours. Cultist denial and recruitment.",
    tags: ["cultist-capture", "possession", "recruitment"],
  },
  {
    id: "dhole",
    name: "Dhole",
    expansion: "cosmic-terrors",
    combat: "5",
    cost: "2 Doom + 2 Power",
    abilityName: "Planetary Destruction",
    abilitySummary:
      "Highest combat terror. When eliminated, generates Elder Signs via Planetary Destruction. Worth killing — but at great cost.",
    tags: ["high-combat", "elder-signs-on-death", "deterrent"],
  },
  {
    id: "quachil-uttaus",
    name: "Quachil Uttaus",
    expansion: "cosmic-terrors",
    combat: "1",
    cost: "2 Doom + 2 Power",
    abilityName: "Dust to Dust",
    abilitySummary:
      "Presents a dilemma — opponents must choose between two bad options when engaging. Low combat but high disruption.",
    tags: ["dilemma", "disruption", "choice-punishment"],
  },
  // Masks of Nyarlathotep terror
  {
    id: "shadow-pharaoh",
    name: "The Shadow Pharaoh",
    expansion: "masks-nyarlathotep",
    combat: "2",
    cost: "2 Doom + 2 Power",
    abilityName: "Hebephrenia",
    abilitySummary:
      "Gate denial via Hebephrenia. Prevents gate creation in its area. Area lockdown specialist.",
    tags: ["gate-denial", "area-lockdown", "control"],
  },
  // Something About Cats terror
  {
    id: "cat-from-neptune",
    name: "Cat from Neptune",
    expansion: "cats",
    combat: "3",
    cost: "2 Doom + 2 Power",
    abilityName: "The Final Ritual",
    abilitySummary:
      "Can trigger The Final Ritual ability. Disrupts Ritual of Annihilation timing for opponents.",
    tags: ["ritual-disruption", "timing-interference"],
  },
];

export const TERROR_MAP = Object.fromEntries(
  TERRORS.map((t) => [t.id, t])
);

/** Get terrors available from selected expansions */
export function getAvailableTerrors(expansions: string[]): Terror[] {
  return TERRORS.filter((t) => expansions.includes(t.expansion));
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/__tests__/terrors.test.ts`
Expected: PASS (all 4 tests)

**Step 5: Commit**

```bash
git add src/data/terrors.ts src/data/__tests__/terrors.test.ts
git commit -m "feat: add cosmic terrors structured data with 5 entries across 3 expansions"
```

---

### Task 3: Unique High Priests Data File

**Files:**
- Create: `src/data/unique-high-priests.ts`
- Create: `src/data/__tests__/unique-high-priests.test.ts`

**Step 1: Write the failing test**

Create `src/data/__tests__/unique-high-priests.test.ts`:

```typescript
import {
  UNIQUE_HIGH_PRIESTS,
  type UniqueHighPriest,
} from "@/data/unique-high-priests";

describe("UNIQUE_HIGH_PRIESTS", () => {
  it("should contain all 8 unique high priests", () => {
    expect(UNIQUE_HIGH_PRIESTS).toHaveLength(8);
  });

  it("should have unique ids", () => {
    const ids = UNIQUE_HIGH_PRIESTS.map((hp) => hp.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have required fields on every entry", () => {
    for (const hp of UNIQUE_HIGH_PRIESTS) {
      expect(hp.id).toBeTruthy();
      expect(hp.name).toBeTruthy();
      expect(hp.abilityName).toBeTruthy();
      expect(hp.abilityText).toBeTruthy();
      expect(hp.timing).toBeTruthy();
      expect(hp.tacticalSummary).toBeTruthy();
      expect(Array.isArray(hp.tags)).toBe(true);
    }
  });

  it("should have valid timing values", () => {
    const validTimings = ["ongoing", "pre-battle", "post-battle"];
    for (const hp of UNIQUE_HIGH_PRIESTS) {
      expect(validTimings).toContain(hp.timing);
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/unique-high-priests.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/data/unique-high-priests.ts`:

```typescript
export interface UniqueHighPriest {
  id: string;
  name: string;
  abilityName: string;
  abilityText: string; // exact game text
  timing: "ongoing" | "pre-battle" | "post-battle";
  tacticalSummary: string; // 1-2 sentence coaching-friendly summary
  tags: string[];
}

export const UNIQUE_HIGH_PRIESTS: UniqueHighPriest[] = [
  {
    id: "asenath-waite",
    name: "Asenath Waite",
    abilityName: "The Thing from Beyond",
    abilityText:
      "After any player's Action, choose any enemy Monster or Cultist on the Map and replace it with one of your own Units of 3 or less cost (except Asenath). Then, Eliminate Asenath.",
    timing: "ongoing",
    tacticalSummary:
      "Swap an enemy unit for one of yours. Best used to steal a key position or remove a threatening monster. One-shot.",
    tags: ["unit-swap", "offensive", "one-shot", "flexible-timing"],
  },
  {
    id: "crawford-tillinghast",
    name: "Crawford Tillinghast",
    abilityName: "The Ultra-Violet",
    abilityText:
      "Before any Battle (even if Crawford Tillinghast is not involved), you may Eliminate Crawford Tillinghast and place up to 3 Power cost worth of your Monsters and Cultists from your Pool to the Battle Area, off to one side. These Units participate in the Battle, and can use any Pre-Battle or Post-Battle abilities they may have. But, after the entire Battle is resolved, Eliminate any of these 'extra' Units which survived.",
    timing: "pre-battle",
    tacticalSummary:
      "Drop temporary reinforcements into any battle on the board. Units fight then die regardless. Surprise combat swing.",
    tags: ["combat-reinforcement", "any-battle", "one-shot", "surprise"],
  },
  {
    id: "ermengarde-stubbs",
    name: "Ermengarde Stubbs",
    abilityName: "A Simple Rustic Maid",
    abilityText:
      "Any player (including you) who declares a Battle in Ermengarde Stubbs's Area immediately loses 1 Doom.",
    timing: "ongoing",
    tacticalSummary:
      "Area denial — anyone attacking her location loses 1 Doom. Park her on a key gate to deter aggression. Persistent deterrent.",
    tags: ["area-denial", "deterrent", "doom-penalty", "persistent"],
  },
  {
    id: "herbert-west",
    name: "Herbert West",
    abilityName: "The Reanimator Serum",
    abilityText:
      "After any player's Action, you may Eliminate Herbert West and place up to 3 Acolyte Cultists from your Pool into the Area Herbert West was removed from.",
    timing: "ongoing",
    tacticalSummary:
      "Sacrifice to spawn 3 Acolytes in his area. Great for rapid gate control or recovering from losses. One-shot army rebuild.",
    tags: ["acolyte-spawn", "recovery", "one-shot", "gate-control"],
  },
  {
    id: "keziah-mason",
    name: "Keziah Mason",
    abilityName: "Daemon Heroine",
    abilityText:
      "If Keziah Mason is assigned a Kill or Pain result, add 2 Kills or 2 Pains, respectively, to the total scored against the opponent.",
    timing: "post-battle",
    tacticalSummary:
      "Damage multiplier — when she takes a hit, doubles it back at the enemy. Put her in battles you expect to take casualties in.",
    tags: ["damage-multiplier", "combat-boost", "retaliation", "persistent"],
  },
  {
    id: "lavinia-whateley",
    name: "Lavinia Whateley",
    abilityName: "The Bride",
    abilityText:
      "When you Awaken a Great Old One, you can choose to Eliminate Lavinia Whateley. If you do so, your Great Old One costs 3 Power less to Awaken.",
    timing: "ongoing",
    tacticalSummary:
      "Save 3 Power on GOO awakening. Hold her until you're ready to awaken, then sacrifice. Best with expensive GOOs.",
    tags: ["cost-reduction", "goo-awakening", "one-shot", "power-economy"],
  },
  {
    id: "joseph-curwen",
    name: "Joseph Curwen",
    abilityName: "Beyond the Spheres",
    abilityText:
      "After any player's Action, you may Eliminate Curwen and either remove your Controlled Gate (but not its Controller) from anywhere on the Map, or place a new Gate in any Area in which you have a Unit.",
    timing: "ongoing",
    tacticalSummary:
      "Gate mobility — move a gate or create one anywhere you have a unit. Enables surprise gate placement or escape from danger.",
    tags: ["gate-mobility", "gate-creation", "one-shot", "repositioning"],
  },
  {
    id: "pitpipo",
    name: "Pitpipo",
    abilityName: "The Pit of Despair",
    abilityText:
      "When you take a Kill in Battle, you can assign it to Pitpipo, even if he was not involved in the Battle.",
    timing: "post-battle",
    tacticalSummary:
      "Remote casualty absorber — takes Kills from any of your battles anywhere on the map. Protects key units from elimination.",
    tags: ["casualty-absorber", "remote-protection", "persistent", "defensive"],
  },
];

export const UNIQUE_HIGH_PRIEST_MAP = Object.fromEntries(
  UNIQUE_HIGH_PRIESTS.map((hp) => [hp.id, hp])
);
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/__tests__/unique-high-priests.test.ts`
Expected: PASS (all 4 tests)

**Step 5: Commit**

```bash
git add src/data/unique-high-priests.ts src/data/__tests__/unique-high-priests.test.ts
git commit -m "feat: add unique high priests data with 8 named characters and abilities"
```

---

### Task 4: Neutral Monsters Data File

**Files:**
- Create: `src/data/neutral-monsters.ts`
- Create: `src/data/__tests__/neutral-monsters.test.ts`

**Step 1: Write the failing test**

Create `src/data/__tests__/neutral-monsters.test.ts`:

```typescript
import { NEUTRAL_MONSTERS, type NeutralMonster } from "@/data/neutral-monsters";

describe("NEUTRAL_MONSTERS", () => {
  it("should have at least 15 neutral monster types", () => {
    expect(NEUTRAL_MONSTERS.length).toBeGreaterThanOrEqual(15);
  });

  it("should have unique ids", () => {
    const ids = NEUTRAL_MONSTERS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have required fields on every entry", () => {
    for (const monster of NEUTRAL_MONSTERS) {
      expect(monster.id).toBeTruthy();
      expect(monster.name).toBeTruthy();
      expect(monster.expansion).toBeTruthy();
      expect(typeof monster.maxCount).toBe("number");
      expect(typeof monster.combat).toBe("number");
      expect(monster.abilitySummary).toBeTruthy();
      expect(Array.isArray(monster.tags)).toBe(true);
    }
  });

  it("should include dreamlands monsters", () => {
    const dreamlands = NEUTRAL_MONSTERS.filter(
      (m) => m.expansion === "dreamlands"
    );
    expect(dreamlands.length).toBeGreaterThanOrEqual(6);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/neutral-monsters.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/data/neutral-monsters.ts`:

```typescript
export interface NeutralMonster {
  id: string;
  name: string;
  expansion: string; // which expansion/map includes this monster
  maxCount: number; // how many available
  combat: number;
  abilitySummary: string;
  tags: string[];
}

export const NEUTRAL_MONSTERS: NeutralMonster[] = [
  // Dreamlands Surface
  {
    id: "gnorri",
    name: "Gnorri",
    expansion: "dreamlands",
    maxCount: 3,
    combat: 2,
    abilitySummary: "Standard combat neutral. Solid mid-tier fighter.",
    tags: ["dreamlands", "surface", "combat"],
  },
  {
    id: "moonbeast",
    name: "Moonbeast",
    expansion: "dreamlands",
    maxCount: 4,
    combat: 0,
    abilitySummary:
      "Zero combat but high availability. Useful as gate controllers or sacrificial units.",
    tags: ["dreamlands", "surface", "zero-combat", "expendable"],
  },
  {
    id: "shantak",
    name: "Shantak",
    expansion: "dreamlands",
    maxCount: 2,
    combat: 2,
    abilitySummary: "Flying combat neutral. Limited availability.",
    tags: ["dreamlands", "surface", "flying", "combat"],
  },
  {
    id: "leng-spider",
    name: "Leng Spider",
    expansion: "dreamlands",
    maxCount: 3,
    combat: 1,
    abilitySummary: "Underworld monster. Moderate availability.",
    tags: ["dreamlands", "underworld", "combat"],
  },
  {
    id: "gug",
    name: "Gug",
    expansion: "dreamlands",
    maxCount: 2,
    combat: 3,
    abilitySummary:
      "Underworld heavy hitter. Highest combat among Dreamlands neutrals.",
    tags: ["dreamlands", "underworld", "high-combat"],
  },
  {
    id: "ghast",
    name: "Ghast",
    expansion: "dreamlands",
    maxCount: 4,
    combat: 0,
    abilitySummary:
      "Underworld zero-combat swarm unit. High availability, expendable.",
    tags: ["dreamlands", "underworld", "zero-combat", "expendable"],
  },
  // Opener of the Way pack neutrals
  {
    id: "dimensional-shambler",
    name: "Dimensional Shambler",
    expansion: "opener-of-the-way",
    maxCount: 3,
    combat: 2,
    abilitySummary:
      "Dimension-hopping neutral. Can move between areas unconventionally.",
    tags: ["opener-pack", "mobility", "combat"],
  },
  {
    id: "elder-thing",
    name: "Elder Thing",
    expansion: "opener-of-the-way",
    maxCount: 3,
    combat: 2,
    abilitySummary: "Ancient neutral fighter. Solid combat value.",
    tags: ["opener-pack", "combat"],
  },
  {
    id: "star-vampire",
    name: "Star Vampire",
    expansion: "opener-of-the-way",
    maxCount: 3,
    combat: 1,
    abilitySummary: "Light combat neutral from the Opener pack.",
    tags: ["opener-pack", "combat"],
  },
  {
    id: "servitor-outer-gods",
    name: "Servitor of the Outer Gods",
    expansion: "opener-of-the-way",
    maxCount: 3,
    combat: -1,
    abilitySummary:
      "Sabotage unit with negative combat. Hurts the army it's in — place in enemy forces for disruption.",
    tags: ["opener-pack", "sabotage", "negative-combat", "disruption"],
  },
  // Ramsey Campbell Horrors 1
  {
    id: "insects-from-shaggai",
    name: "Insects from Shaggai",
    expansion: "ramsey-campbell-1",
    maxCount: 3,
    combat: 0,
    abilitySummary:
      "Zero-combat swarm. Shaggai-themed insects with special interaction rules.",
    tags: ["ramsey-campbell", "zero-combat", "swarm"],
  },
  // Ramsey Campbell Horrors 2
  {
    id: "satyr",
    name: "Satyr",
    expansion: "ramsey-campbell-2",
    maxCount: 3,
    combat: 1,
    abilitySummary: "Light combat neutral from Ramsey Campbell expansion.",
    tags: ["ramsey-campbell", "combat"],
  },
  // Beyond Time & Space
  {
    id: "voonith",
    name: "Voonith",
    expansion: "beyond-time-space",
    maxCount: 2,
    combat: 1,
    abilitySummary: "Limited availability combat neutral from Beyond Time & Space.",
    tags: ["beyond-time-space", "combat"],
  },
  {
    id: "wamp",
    name: "Wamp",
    expansion: "beyond-time-space",
    maxCount: 4,
    combat: 0,
    abilitySummary:
      "Offensive placement sabotage unit. Placed into enemy areas for disruption.",
    tags: ["beyond-time-space", "sabotage", "zero-combat", "placement"],
  },
  // CATaclysm
  {
    id: "giant-blind-albino-penguin",
    name: "Giant Blind Albino Penguin",
    expansion: "cats",
    maxCount: 2,
    combat: -2,
    abilitySummary:
      "Deeply negative combat. Placed to sabotage enemy armies. Thematic joke unit with real mechanical impact.",
    tags: ["cats", "sabotage", "negative-combat"],
  },
  // Something About Cats
  {
    id: "asteroid-cat",
    name: "Asteroid Cat",
    expansion: "cats",
    maxCount: 2,
    combat: 1,
    abilitySummary: "Light combat cat neutral.",
    tags: ["cats", "combat"],
  },
  {
    id: "cat-from-mercury",
    name: "Cat from Mercury",
    expansion: "cats",
    maxCount: 2,
    combat: 1,
    abilitySummary: "Light combat cat neutral.",
    tags: ["cats", "combat"],
  },
  {
    id: "cat-from-venus",
    name: "Cat from Venus",
    expansion: "cats",
    maxCount: 2,
    combat: 1,
    abilitySummary: "Light combat cat neutral.",
    tags: ["cats", "combat"],
  },
  // Yuggoth map-specific
  {
    id: "slime-mold",
    name: "Slime Mold",
    expansion: "yuggoth",
    maxCount: 6,
    combat: 2,
    abilitySummary:
      "Yuggoth map-specific neutral. High availability, solid combat. Dominates the Yuggoth landscape.",
    tags: ["yuggoth", "map-specific", "high-availability", "combat"],
  },
];

export const NEUTRAL_MONSTER_MAP = Object.fromEntries(
  NEUTRAL_MONSTERS.map((m) => [m.id, m])
);

/** Get neutral monsters available from selected expansions/maps */
export function getAvailableNeutralMonsters(
  expansions: string[],
  map: string
): NeutralMonster[] {
  return NEUTRAL_MONSTERS.filter(
    (m) => expansions.includes(m.expansion) || m.expansion === map
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/__tests__/neutral-monsters.test.ts`
Expected: PASS (all 4 tests)

**Step 5: Commit**

```bash
git add src/data/neutral-monsters.ts src/data/__tests__/neutral-monsters.test.ts
git commit -m "feat: add neutral monsters data with 19 types across 8 expansions/maps"
```

---

### Task 5: Map Strategies Data File

**Files:**
- Create: `src/data/map-strategies.ts`
- Create: `src/data/__tests__/map-strategies.test.ts`

**Step 1: Write the failing test**

Create `src/data/__tests__/map-strategies.test.ts`:

```typescript
import { MAP_STRATEGIES, type MapStrategy } from "@/data/map-strategies";
import { MAPS } from "@/data/faction-data";

describe("MAP_STRATEGIES", () => {
  it("should have a strategy entry for every map", () => {
    for (const map of MAPS) {
      expect(MAP_STRATEGIES[map.id]).toBeDefined();
    }
  });

  it("should have required fields on every entry", () => {
    for (const [, strategy] of Object.entries(MAP_STRATEGIES)) {
      expect(strategy.description).toBeTruthy();
      expect(Array.isArray(strategy.keyFeatures)).toBe(true);
      expect(strategy.keyFeatures.length).toBeGreaterThan(0);
      expect(Array.isArray(strategy.factionNotes)).toBe(true);
    }
  });

  it("should have faction notes referencing valid faction ids", () => {
    const { FACTIONS } = require("@/data/faction-data");
    const factionIds = new Set(FACTIONS.map((f: { id: string }) => f.id));
    for (const [, strategy] of Object.entries(MAP_STRATEGIES)) {
      for (const note of (strategy as MapStrategy).factionNotes) {
        expect(factionIds.has(note.factionId)).toBe(true);
      }
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/map-strategies.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/data/map-strategies.ts`:

```typescript
export interface FactionMapNote {
  factionId: string;
  advantage: boolean; // true = advantage, false = disadvantage
  note: string;
}

export interface MapStrategy {
  description: string;
  keyFeatures: string[];
  gateNotes: string;
  factionNotes: FactionMapNote[];
}

export const MAP_STRATEGIES: Record<string, MapStrategy> = {
  earth: {
    description:
      "The standard map. Balanced layout with no special mechanics. Best for learning and balanced play.",
    keyFeatures: [
      "Balanced area distribution",
      "No special map mechanics",
      "Standard gate placement rules",
      "Ocean areas available for Dagon/Hydra strategies",
    ],
    gateNotes:
      "Standard gate placement. Central areas are contested, edges are safer for early gates.",
    factionNotes: [
      {
        factionId: "great-cthulhu",
        advantage: true,
        note: "Ocean areas provide safe Submerge retreats and Y'ha-nthlei options.",
      },
      {
        factionId: "yellow-sign",
        advantage: true,
        note: "Desecrate works well on the spread-out map with many lone-Acolyte gates.",
      },
      {
        factionId: "windwalker",
        advantage: false,
        note: "Ice Age is less impactful on the large Earth map — harder to freeze key areas.",
      },
    ],
  },
  dreamlands: {
    description:
      "Dual-layer map with Surface and Underworld connected by portals. Adds vertical strategic dimension.",
    keyFeatures: [
      "Surface and Underworld layers",
      "Portal connections between layers",
      "Unique Dreamlands neutral monsters",
      "Gate placement differs between layers",
    ],
    gateNotes:
      "Gates can be placed on both layers. Underworld gates are harder to contest but also harder to reinforce.",
    factionNotes: [
      {
        factionId: "crawling-chaos",
        advantage: true,
        note: "Flight and teleportation abilities shine on the dual-layer map.",
      },
      {
        factionId: "sleeper",
        advantage: true,
        note: "Underworld provides safe hibernation locations away from main conflicts.",
      },
    ],
  },
  yuggoth: {
    description:
      "Alien landscape with faction territories and Brain Cylinder mechanics. More structured than Earth.",
    keyFeatures: [
      "Faction starting territories",
      "Brain Cylinder mechanic",
      "Slime Mold neutral monsters (6 available, 2 combat)",
      "More constrained gate placement",
    ],
    gateNotes:
      "Territories provide natural defensive positions. Brain Cylinders add resource manipulation.",
    factionNotes: [
      {
        factionId: "opener-of-the-way",
        advantage: true,
        note: "Beyond One ability leverages the territory structure for dimensional movement.",
      },
      {
        factionId: "tcho-tcho",
        advantage: true,
        note: "High Priests benefit from the territory control structure.",
      },
    ],
  },
  "library-celaeno": {
    description:
      "Knowledge-focused map with Tome tokens and knowledge mechanics. Rewards strategic research.",
    keyFeatures: [
      "Tome tokens scattered across map",
      "Knowledge token collection mechanic",
      "Altered Ritual of Annihilation requirements",
      "Smaller, more concentrated layout",
    ],
    gateNotes:
      "Smaller map means gates are closer together — more frequent combat. Tome locations are strategic.",
    factionNotes: [
      {
        factionId: "ancients",
        advantage: true,
        note: "Knowledge mechanics synergize with the Ancients' scholarly theme and Cathedral placement.",
      },
      {
        factionId: "black-goat",
        advantage: true,
        note: "Compact map favors Fertility Cult and Dark Young area coverage.",
      },
    ],
  },
  shaggai: {
    description:
      "Insect-themed volatile map with unstable areas. High chaos potential.",
    keyFeatures: [
      "Volatile areas that can shift or collapse",
      "Insect mechanics (Insects from Shaggai)",
      "Unpredictable area connections",
      "Rewards adaptive play over rigid strategy",
    ],
    gateNotes:
      "Volatile areas make gate placement risky. Spread gates to hedge against area collapse.",
    factionNotes: [
      {
        factionId: "daemon-sultan",
        advantage: true,
        note: "Chaos and destruction mechanics align with Shaggai's volatile nature.",
      },
      {
        factionId: "ancients",
        advantage: false,
        note: "Cathedral placement is risky when areas can collapse. Plan for contingencies.",
      },
    ],
  },
  "primeval-earth": {
    description:
      "Prehistoric map with pre-placed gates and primal areas. Unique starting conditions.",
    keyFeatures: [
      "Pre-placed gates at game start",
      "Primal areas with unique properties",
      "Altered starting positions",
      "Different gate economy from standard",
    ],
    gateNotes:
      "Pre-placed gates change the opening. Gate control is contested from turn 1.",
    factionNotes: [
      {
        factionId: "great-cthulhu",
        advantage: true,
        note: "Pre-placed gates give Cthulhu early Power income for faster Starspawn summoning.",
      },
      {
        factionId: "yellow-sign",
        advantage: true,
        note: "Pre-placed gates are prime Desecrate targets from the very first round.",
      },
    ],
  },
};
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/__tests__/map-strategies.test.ts`
Expected: PASS (all 3 tests)

**Step 5: Commit**

```bash
git add src/data/map-strategies.ts src/data/__tests__/map-strategies.test.ts
git commit -m "feat: add map strategies data with faction advantages for all 6 maps"
```

---

### Task 6: Add Missing Expansion IDs

The current `EXPANSIONS` array in `faction-data.ts` is missing GOO Pack 3 and the Cats/CATaclysm expansions, which our new data files reference.

**Files:**
- Modify: `src/data/faction-data.ts` (lines 185-197)
- Modify: `src/data/__tests__/faction-units.test.ts` (add coverage)

**Step 1: Write the failing test**

Add to an existing test or create a new test in `src/data/__tests__/faction-data.test.ts`:

```typescript
import { EXPANSIONS, MAPS } from "@/data/faction-data";
import { INDEPENDENT_GOOS } from "@/data/independent-goos";
import { TERRORS } from "@/data/terrors";
import { NEUTRAL_MONSTERS } from "@/data/neutral-monsters";

describe("EXPANSIONS completeness", () => {
  it("should include every expansion referenced by independent GOOs", () => {
    const expansionIds = new Set(EXPANSIONS.map((e) => e.id));
    for (const goo of INDEPENDENT_GOOS) {
      expect(expansionIds.has(goo.pack)).toBe(true);
    }
  });

  it("should include every expansion referenced by terrors", () => {
    const expansionIds = new Set(EXPANSIONS.map((e) => e.id));
    for (const terror of TERRORS) {
      expect(expansionIds.has(terror.expansion)).toBe(true);
    }
  });

  it("should include every expansion referenced by neutral monsters (excluding map-specific)", () => {
    const expansionIds = new Set(EXPANSIONS.map((e) => e.id));
    const mapIds = new Set(MAPS.map((m) => m.id));
    for (const monster of NEUTRAL_MONSTERS) {
      // Skip map-specific monsters (they reference map ids, not expansion ids)
      if (!mapIds.has(monster.expansion)) {
        expect(expansionIds.has(monster.expansion)).toBe(true);
      }
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/faction-data.test.ts`
Expected: FAIL — missing "goo-pack-3" and "cats" in EXPANSIONS

**Step 3: Update EXPANSIONS array**

In `src/data/faction-data.ts`, add the missing entries to the EXPANSIONS array:

```typescript
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
  { id: "goo-pack-3", name: "GOO Pack 3" },
  { id: "goo-pack-4", name: "GOO Pack 4" },
  { id: "cats", name: "Something About Cats / CATaclysm" },
  { id: "opener-of-the-way", name: "Opener of the Way Neutrals" },
];
```

Note: `opener-of-the-way` is already a faction id but also provides neutral monsters. If this causes ambiguity, use a distinct expansion id like `opener-neutrals` and update `neutral-monsters.ts` to match. Check for conflicts and resolve.

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/__tests__/faction-data.test.ts`
Expected: PASS

Also run the full suite to check for regressions:
Run: `npx vitest run`
Expected: All tests pass

**Step 5: Commit**

```bash
git add src/data/faction-data.ts src/data/__tests__/faction-data.test.ts
git commit -m "feat: add missing expansion ids (GOO Pack 3, Cats, Opener neutrals) for data completeness"
```

---

### Task 7: Full Test Suite Verification & Cleanup

**Step 1: Run the complete test suite**

Run: `npx vitest run`
Expected: All tests pass (existing + 5 new test files)

**Step 2: Run lint**

Run: `npx eslint src/data/`
Expected: No new lint errors

**Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds — new data files are tree-shaken if unused by pages but should not cause build errors

**Step 4: Fix any issues found in steps 1-3**

Address lint warnings (unused variables, any types, etc.) following existing patterns.

**Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "chore: phase 1 cleanup - fix lint and test issues"
```

---

## Summary

| Task | Files Created | Tests |
|------|--------------|-------|
| 1. Independent GOOs | `src/data/independent-goos.ts` | 4 tests |
| 2. Cosmic Terrors | `src/data/terrors.ts` | 4 tests |
| 3. Unique High Priests | `src/data/unique-high-priests.ts` | 4 tests |
| 4. Neutral Monsters | `src/data/neutral-monsters.ts` | 4 tests |
| 5. Map Strategies | `src/data/map-strategies.ts` | 3 tests |
| 6. Missing Expansions | Modified `src/data/faction-data.ts` | 3 tests |
| 7. Verification | N/A | Full suite |

**Total: 6 new files, 1 modified file, ~22 new tests, 7 commits**

After Phase 1, all neutral game component data is structured and queryable — ready for the lobby voting UI (Phase 4) and the coaching engine (Phase 6).
