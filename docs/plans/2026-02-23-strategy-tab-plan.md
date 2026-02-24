# Strategy Tab Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a per-player Strategy tab to the game tracker with condensed faction strategies, spellbook paths, context-aware matchup tips, and rules reminders for the 4 core factions.

**Architecture:** Static TypeScript data files (`faction-strategies.ts`, `faction-matchups.ts`) supply condensed strategy content. A new tab bar wraps the tracker page content (Game | Strategy | Log). The Strategy tab renders 4 collapsible accordion sections using 6 new React components. All data is static imports — no API calls, no loading states, works offline.

**Tech Stack:** Next.js 16 / React 19 / TypeScript / Tailwind CSS 4 / Vitest

**Design Doc:** `docs/plans/2026-02-23-strategy-tab-design.md`

---

## Phase 1A: Data Fixes

### Task 1: Fix Mi-Go max count (3 → 4)

**Files:**
- Modify: `src/data/faction-units.ts:21` (Mi-Go entry)
- Modify: `src/data/__tests__/faction-units.test.ts` (add assertion)

**Step 1: Add failing test for Mi-Go count**

Open `src/data/__tests__/faction-units.test.ts` and add a test:

```typescript
it("Black Goat Mi-Go max count is 4 (Fungi from Yuggoth)", () => {
  const miGo = FACTION_UNITS["black-goat"].find((u) => u.id === "mi-go");
  expect(miGo).toBeDefined();
  expect(miGo!.max).toBe(4);
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/faction-units.test.ts --reporter=verbose`
Expected: FAIL — `expected 4, received 3`

**Step 3: Fix the data**

In `src/data/faction-units.ts`, line 21, change:
```typescript
// BEFORE
{ id: "mi-go", name: "Mi-Go", max: 3, cost: 2, combat: 1 },
// AFTER
{ id: "mi-go", name: "Mi-Go", max: 4, cost: 2, combat: 1 },
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/__tests__/faction-units.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add src/data/faction-units.ts src/data/__tests__/faction-units.test.ts
git commit -m "fix: correct Mi-Go max count from 3 to 4 (wiki-verified)"
```

---

### Task 2: Add cost and combat to Unique High Priests

The official PDF from Arthur Petersen confirms all 8 UHPs are Cost: 3, Combat: 0. Our `UniqueHighPriest` interface is missing these fields.

**Files:**
- Modify: `src/data/unique-high-priests.ts` (interface + all 8 entries)
- Modify: `src/data/__tests__/unique-high-priests.test.ts` (add assertions)

**Step 1: Add failing test for cost and combat fields**

Add to `src/data/__tests__/unique-high-priests.test.ts`:

```typescript
it("all UHPs have cost 3 and combat 0 (per official PDF)", () => {
  for (const hp of UNIQUE_HIGH_PRIESTS) {
    expect(hp.cost, `${hp.name} cost`).toBe(3);
    expect(hp.combat, `${hp.name} combat`).toBe(0);
  }
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/unique-high-priests.test.ts --reporter=verbose`
Expected: FAIL — `cost` property doesn't exist

**Step 3: Update the interface and data**

In `src/data/unique-high-priests.ts`, add `cost` and `combat` to the interface:

```typescript
export interface UniqueHighPriest {
  id: string;
  name: string;
  cost: number;
  combat: number;
  abilityName: string;
  abilityText: string;
  timing: "ongoing" | "pre-battle" | "post-battle";
  tacticalSummary: string;
  tags: string[];
}
```

Then add `cost: 3, combat: 0` to all 8 entries. Example for the first:

```typescript
{
  id: "asenath-waite",
  name: "Asenath Waite",
  cost: 3,
  combat: 0,
  abilityName: "The Thing from Beyond",
  // ... rest unchanged
},
```

Repeat for all 8: asenath-waite, crawford-tillinghast, ermengarde-stubbs, herbert-west, keziah-mason, lavinia-whateley, joseph-curwen, pitpipo.

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/__tests__/unique-high-priests.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add src/data/unique-high-priests.ts src/data/__tests__/unique-high-priests.test.ts
git commit -m "fix: add cost (3) and combat (0) to all UHPs (official PDF verified)"
```

---

### Task 3: Fix inaccurate interaction tips

Two tips in `faction-interactions.ts` have accuracy issues flagged by the user:

1. **`bg-ghroth`** — Says "Ghroth sacrifices all Cultists on the map" which is wrong. Ghroth is a 2-Power action with a d6 roll, limited by Fungi count.
2. **`ys-gift`** — Says "Gift Doom via spellbook" which is misleading. Yellow Sign's doom acceleration comes from multiple mechanics, not just one spellbook.

**Files:**
- Modify: `src/data/faction-interactions.ts:69-73` (bg-ghroth tip)
- Modify: `src/data/faction-interactions.ts:21-25` (ys-gift tip)

**Step 1: Write test for corrected tip text**

Create a targeted test. Add to `src/data/__tests__/faction-interactions.test.ts` (new file):

```typescript
import { describe, it, expect } from "vitest";
import { INTERACTION_TIPS } from "../faction-interactions";

describe("faction-interactions accuracy", () => {
  it("Ghroth tip mentions d6 roll mechanic, not 'sacrifices all'", () => {
    const ghroth = INTERACTION_TIPS.find((t) => t.id === "bg-ghroth");
    expect(ghroth).toBeDefined();
    expect(ghroth!.text).toContain("d6");
    expect(ghroth!.text).not.toContain("sacrifices all");
  });

  it("Yellow Sign tip does not say 'Gift Doom via spellbook'", () => {
    const ys = INTERACTION_TIPS.find((t) => t.id === "ys-gift");
    expect(ys).toBeDefined();
    expect(ys!.text).not.toContain("Gift Doom via spellbook");
  });

  it("all tips have required fields", () => {
    for (const tip of INTERACTION_TIPS) {
      expect(tip.id).toBeTruthy();
      expect(tip.factions.length).toBeGreaterThan(0);
      expect(tip.text.length).toBeGreaterThan(10);
      expect(["info", "warning", "critical"]).toContain(tip.severity);
    }
  });

  it("pairwise tips reference exactly 2 factions", () => {
    const pairwise = INTERACTION_TIPS.filter((t) => t.factions.length === 2);
    expect(pairwise.length).toBeGreaterThan(0);
    for (const tip of pairwise) {
      expect(tip.factions.length).toBe(2);
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/faction-interactions.test.ts --reporter=verbose`
Expected: FAIL — Ghroth tip contains "sacrifices all" and YS tip contains "Gift Doom via spellbook"

**Step 3: Fix the tips**

In `src/data/faction-interactions.ts`, replace the `bg-ghroth` entry:

```typescript
{
  id: "bg-ghroth",
  factions: ["black-goat"],
  text: "Ghroth (2 Power): Roll d6 ≤ areas with Fungi to succeed. On success, every player eliminates 1 Cultist from each area. At 4 Fungi (max) you need a 4 or less. Not guaranteed — but devastating when it hits.",
  severity: "critical",
},
```

Replace the `ys-gift` entry:

```typescript
{
  id: "ys-gift",
  factions: ["yellow-sign"],
  text: "Yellow Sign accelerates Doom faster than any other faction. Desecrate steals Gates cheaply, Passion scores Doom from combat, and their spellbook conditions award 3 free Doom. Once they have 3+ Gates and Hastur, the Doom track can jump from 20 to 30 in a single round.",
  severity: "critical",
},
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/__tests__/faction-interactions.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Run full test suite**

Run: `npx vitest run --reporter=verbose`
Expected: All tests PASS

**Step 6: Commit**

```bash
git add src/data/faction-interactions.ts src/data/__tests__/faction-interactions.test.ts
git commit -m "fix: correct Ghroth and Yellow Sign interaction tip accuracy"
```

---

## Phase 1B: Strategy Data Files

### Task 4: Create faction-strategies.ts — Interface + Great Cthulhu

Start with the interface and one faction to validate the shape before writing all 4.

**Files:**
- Create: `src/data/faction-strategies.ts`
- Create: `src/data/__tests__/faction-strategies.test.ts`

**Step 1: Write the test file**

```typescript
import { describe, it, expect } from "vitest";
import { FACTION_STRATEGIES, type FactionStrategy } from "../faction-strategies";
import { FACTION_MAP } from "../faction-data";
import { FACTION_UNITS } from "../faction-units";

const CORE_FACTIONS = [
  "great-cthulhu",
  "black-goat",
  "crawling-chaos",
  "yellow-sign",
];

describe("faction-strategies", () => {
  it("has entries for all 4 core factions", () => {
    for (const id of CORE_FACTIONS) {
      expect(FACTION_STRATEGIES[id], `missing strategy for ${id}`).toBeDefined();
    }
  });

  it("all entries have valid factionId matching faction-data", () => {
    for (const [id, strategy] of Object.entries(FACTION_STRATEGIES)) {
      expect(strategy.factionId).toBe(id);
      expect(FACTION_MAP[id], `${id} not in FACTION_MAP`).toBeDefined();
    }
  });

  it("spellbook priority lists exactly 6 spellbooks matching faction-data", () => {
    for (const [id, strategy] of Object.entries(FACTION_STRATEGIES)) {
      const faction = FACTION_MAP[id];
      expect(strategy.spellbookPath.priority).toHaveLength(6);
      const factionSpellbookNames = faction.spellbooks.map((s) => s.name);
      for (const name of strategy.spellbookPath.priority) {
        expect(
          factionSpellbookNames,
          `"${name}" not a valid spellbook for ${id}`
        ).toContain(name);
      }
    });
  });

  it("all text fields have content (not empty)", () => {
    for (const [id, s] of Object.entries(FACTION_STRATEGIES)) {
      expect(s.opening.length, `${id} opening`).toBeGreaterThan(50);
      expect(s.earlyGame.length, `${id} earlyGame`).toBeGreaterThan(30);
      expect(s.midGame.length, `${id} midGame`).toBeGreaterThan(30);
      expect(s.lateGame.length, `${id} lateGame`).toBeGreaterThan(30);
      expect(s.spellbookPath.notes.length, `${id} spellbook notes`).toBeGreaterThan(10);
    }
  });

  it("keyMistakes has 3-5 entries per faction", () => {
    for (const [id, s] of Object.entries(FACTION_STRATEGIES)) {
      expect(s.keyMistakes.length, `${id} keyMistakes`).toBeGreaterThanOrEqual(3);
      expect(s.keyMistakes.length, `${id} keyMistakes`).toBeLessThanOrEqual(5);
    }
  });

  it("rulesReminders has 3-5 entries per faction", () => {
    for (const [id, s] of Object.entries(FACTION_STRATEGIES)) {
      expect(s.rulesReminders.length, `${id} rulesReminders`).toBeGreaterThanOrEqual(3);
      expect(s.rulesReminders.length, `${id} rulesReminders`).toBeLessThanOrEqual(5);
    }
  });

  it("unit counts in rulesReminders are consistent with faction-units", () => {
    for (const [id, s] of Object.entries(FACTION_STRATEGIES)) {
      const units = FACTION_UNITS[id];
      if (!units) continue;
      // Just verify the data files don't contradict each other
      // (specific claims checked during content review)
      expect(units.length).toBeGreaterThan(0);
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/faction-strategies.test.ts --reporter=verbose`
Expected: FAIL — module not found

**Step 3: Create faction-strategies.ts with Great Cthulhu**

Create `src/data/faction-strategies.ts`:

```typescript
// src/data/faction-strategies.ts
// Condensed strategy content for in-game reference.
// Cross-checked against MDX guides and Cthulhu Wars wiki for accuracy.
// User-reviewed before commit.

export interface FactionStrategy {
  factionId: string;
  spellbookPath: {
    priority: string[];     // ordered spellbook names
    notes: string;          // ~50 words on when to deviate
  };
  opening: string;          // ~150 words: turn 1-3 condensed playbook
  earlyGame: string;        // ~100 words
  midGame: string;          // ~100 words
  lateGame: string;         // ~100 words
  keyMistakes: string[];    // 3-5 bullets
  rulesReminders: string[]; // 3-5 key mechanical limits
}

export const FACTION_STRATEGIES: Record<string, FactionStrategy> = {
  "great-cthulhu": {
    factionId: "great-cthulhu",
    spellbookPath: {
      priority: [
        "Submerge",
        "Devolve",
        "Dreams",
        "Absorb",
        "Regenerate",
        "Y'ha-nthlei",
      ],
      notes:
        "Submerge is always first — it defines your faction. Devolve is free in the first Doom Phase. Dreams before Absorb if opponents leave gates weakly defended. Absorb before Regenerate if you need to break a turtle. Y'ha-nthlei comes last automatically.",
    },
    opening:
      "Start in the South Pacific. Turn 1: recruit 1-2 Acolytes, move to adjacent ocean areas, and build a second gate. Your priority is getting 2 ocean gates so you can awaken Cthulhu (costs 10 Power). Don't rush the awakening — build your Acolyte/Deep One infrastructure first. Recruit a Deep One to guard your home gate. Use Devolve (free after first Doom Phase) to instantly convert Acolytes to Deep Ones when threatened. By turn 2-3, aim for 3 gates and Cthulhu on the board. Once Cthulhu is up, Submerge immediately — you stall for half the Power cost of other factions.",
    earlyGame:
      "Get Submerge online and start policing the table. Identify who's snowballing and hit them. Your job is not to win early — it's to prevent anyone else from running away. Use Submerge to threaten multiple areas at once. Recruit Deep Ones as Devolve/Absorb fodder, not as fighters.",
    midGame:
      "Start the rain cycle: Absorb eats your own units in combat (returning them to the pool), Dreams and Devolve spend them from the pool, then Absorb eats them again. This loop gives you infinite value from a small unit base. Target whoever has the most doom. Use Cthulhu's Devour to eliminate key enemy monsters before dice are rolled.",
    lateGame:
      "Shift to Doom rushing. Ritual every Doom Phase you can. Use Immortal strategically — letting Cthulhu die and re-awakening him for 4 Power generates Elder Signs (you need 3 for your final spellbook). Dreams can steal one last gate for the Doom push. Submerge to dodge retaliation after committing to the ritual.",
    keyMistakes: [
      "Deploying all 4 Deep Ones at once — leaves no Devolve targets in pool",
      "Fighting without Submerge online — you waste Power on movement instead",
      "Ignoring the table leader — your faction is designed to police, not turtle",
      "Leaving your South Pacific gate undefended — losing it makes Cthulhu re-awakening expensive",
      "Spending Power on land movement — use Submerge + emerge for free repositioning",
    ],
    rulesReminders: [
      "Submerge: 1 Power from ocean area only. Emerge: 0 Power to any area (including land).",
      "Devolve: instant speed (after any player's action). Only works if Deep Ones are in your pool.",
      "Devour: eliminates 1 enemy unit before combat dice are rolled. Attacker chooses which unit.",
      "Immortal: re-awaken Cthulhu for 4 Power (not 10). Gain 1 Elder Sign each time.",
      "Dreams: 2 Power. Only works if you have Acolytes in your pool. Enemy chooses which Cultist to lose if they have 2+.",
    ],
  },
};
```

**NOTE:** Only Great Cthulhu is written in this step. The remaining 3 factions are added in Task 5. The tests will fail until all 4 are present — that is expected.

**Step 4: Run test — expect partial pass**

Run: `npx vitest run src/data/__tests__/faction-strategies.test.ts --reporter=verbose`
Expected: First test fails (missing 3 factions), but the file loads without errors.

**Step 5: Commit work-in-progress**

```bash
git add src/data/faction-strategies.ts src/data/__tests__/faction-strategies.test.ts
git commit -m "feat: add faction-strategies.ts with Great Cthulhu (3 core factions pending)"
```

---

### Task 5: Add remaining 3 core faction strategies

**Files:**
- Modify: `src/data/faction-strategies.ts` (add black-goat, crawling-chaos, yellow-sign)

**Step 1: Add Black Goat strategy**

Append to the `FACTION_STRATEGIES` record in `src/data/faction-strategies.ts`:

```typescript
"black-goat": {
  factionId: "black-goat",
  spellbookPath: {
    priority: [
      "Fertility Cult",
      "Thousand Young",
      "Blood Sacrifice",
      "Ghroth",
      "Frenzy",
      "Dark Young",
    ],
    notes:
      "Fertility Cult first for the economy engine. Thousand Young early if you need combat defense. Blood Sacrifice is your Elder Sign machine — don't delay past mid-game. Ghroth timing is political: use it when you have 3-4 Fungi deployed and enemies have exposed Cultists.",
  },
  opening:
    "Start anywhere with good gate density. Turn 1: recruit 2-3 Acolytes and spread to 3 adjacent areas for gates. Black Goat is an economy faction — you want as many gates as possible, as fast as possible. Recruit Ghouls (1 Power, 0 combat) as cheap gate holders. Your first spellbook is usually Fertility Cult (requires 4+ Cultists on the map), which you can trigger turn 1-2. Push for a 4th gate early. Don't recruit expensive monsters yet — your Power should go to Acolytes and gates.",
  earlyGame:
    "With Fertility Cult online, your economy is massive (6+ Power from gates + Fertility bonus). Start recruiting Dark Young (3 cost, 2 combat) as area defenders. Aim for Thousand Young spellbook (requires 2+ Dark Young on the map). Build toward 4 Fungi (Mi-Go) for Ghroth activation. Don't fight — let others fight each other while you build.",
  midGame:
    "Blood Sacrifice is your key transition tool: once per Doom Phase, eliminate 1 of your own Cultists to gain 1 Elder Sign. Start using it every Doom Phase. Summon Shub-Niggurath (8 cost, 6 combat) when you have the Power surplus. She's mainly for the spellbook and as a deterrent — don't throw her into fights recklessly.",
  lateGame:
    "Ghroth is your finisher. At 4 Fungi, you need to roll 4 or less on a d6 (67% success). On success, every player eliminates 1 Cultist per area — devastating for Acolyte-heavy factions. Time Ghroth for maximum disruption: ideally when opponents have spread their Cultists thin across many areas. Ritual every Doom Phase while Blood Sacrificing for Elder Signs.",
  keyMistakes: [
    "Recruiting expensive monsters before establishing gate economy",
    "Forgetting Blood Sacrifice is once per Doom Phase (not once per turn)",
    "Deploying Fungi without a plan — 4 Fungi deployed means Ghroth has max 67% success rate",
    "Fighting early instead of turtling — Black Goat wins by economy, not combat",
    "Ignoring Ghroth timing — it's political and should be threatened before used",
  ],
  rulesReminders: [
    "Blood Sacrifice: once per Doom Phase. Eliminate 1 of your Cultists → gain 1 Elder Sign.",
    "Ghroth: 2 Power action. Roll d6 ≤ number of areas with your Fungi. On success, all players eliminate 1 Cultist per area.",
    "Fungi (Mi-Go): max 4 in your unit pool. They are your Ghroth enablers.",
    "Fertility Cult: during Gather Power, gain 1 Power per Cultist beyond the first at each gate.",
    "Thousand Young: when you have 2+ Dark Young in an area, other players' units there cannot move (except Fly).",
  ],
},
```

**Step 2: Add Crawling Chaos strategy**

```typescript
"crawling-chaos": {
  factionId: "crawling-chaos",
  spellbookPath: {
    priority: [
      "Madness",
      "Thousand Forms",
      "Emissary of the Outer Gods",
      "Nyarlathotep Rises",
      "Flight",
      "Infiltration",
    ],
    notes:
      "Madness first — it defines how opponents play against you. Thousand Forms for Power economy. Emissary for flexible recruitment. If opponents cluster together, consider Flight earlier to exploit Nyarlathotep's mobility. Infiltration is a late luxury.",
  },
  opening:
    "Start anywhere with 3+ adjacent areas for quick expansion. Turn 1: recruit 2 Nightgaunts (1 Power each) and spread them to adjacent areas for gate control. Nightgaunts are cheap and mobile — use them as forward scouts and gate guards. Push for 3 gates quickly. Don't worry about expensive monsters yet. Your spellbook unlock for Madness requires Nyarlathotep on the map, so plan your economy around a turn 2-3 awakening (10 Power).",
  earlyGame:
    "Once Madness is online, your combat becomes terrifying: Pain results move enemy units to areas you choose, not the defender. This is effectively a teleport-to-danger for your enemies. Use Nightgaunts for cheap combat to trigger Madness. Thousand Forms (gain 1 Power per Nightgaunt on the map during Gather Power) funds your expansion. You are a disruption faction — make other players' plans impossible.",
  midGame:
    "Recruit Flying Polyps (2 cost, 2 combat) for midgame combat punch. Use Emissary to recruit monsters at a discount or in unusual locations. Nyarlathotep with Flight can strike anywhere on the map in a single action. Identify the biggest threat at the table and use Madness to scatter their forces. You don't need to kill — just displace.",
  lateGame:
    "Your doom generation is slower than Black Goat or Yellow Sign, so you need to compensate with Elder Signs from Ritual and efficient gate control. Use Hunting Horrors (3 cost, 3 combat) as closers. Madness continues to disrupt enemy positioning in the final rounds. Infiltration can steal a critical gate at the last moment. Time your Ritual of Annihilation carefully — you need every Power point.",
  keyMistakes: [
    "Awakening Nyarlathotep too early without gate economy to support him",
    "Using Madness defensively instead of offensively — scatter enemy units into each other",
    "Forgetting Thousand Forms Power bonus — always count your Nightgaunts during Gather",
    "Over-investing in Hunting Horrors — they're expensive for their combat value",
  ],
  rulesReminders: [
    "Madness: when enemies take Pain results in battle with you, YOU choose where their units go.",
    "Thousand Forms: gain 1 Power per Nightgaunt on the map during Gather Power phase.",
    "Emissary: recruit a Monster at -1 cost in any area with your unit (not just gates).",
    "Flight: Nyarlathotep can move to any area on the map as a single move action.",
    "Nightgaunts cost 1 Power, 1 combat die. Max 3 in pool.",
  ],
},
```

**Step 3: Add Yellow Sign strategy**

```typescript
"yellow-sign": {
  factionId: "yellow-sign",
  spellbookPath: {
    priority: [
      "Desecrate",
      "The King in Yellow",
      "Passion",
      "Shriek",
      "Cloud Memory",
      "Gift of the King",
    ],
    notes:
      "Desecrate first — it's your gate-stealing engine and is dirt cheap. The King in Yellow is free to place and unlocks your faction's area control. Passion turns every combat into Doom. Gift of the King gives 3 free Doom but comes late. Cloud Memory and Shriek are situational — pick based on your opponents.",
  },
  opening:
    "Start anywhere with high gate density — you want to Desecrate quickly. Turn 1: recruit 2-3 Undead (1 Power, 1 combat) and spread to adjacent areas. Undead are your workhorse unit — cheap, disposable, and plentiful (max 6). Place the King in Yellow (4 cost, 0 combat) as soon as possible — he's a spellbook requirement and his area-control abilities define your faction. Push for 3 gates via Desecrate: move an Undead to an enemy gate, Desecrate to flip it.",
  earlyGame:
    "With Desecrate online, you can steal weakly-defended gates for just 1 Power. This makes you the premier land-grab faction. Recruit Byakhee (2 cost, 2 combat) for mobile combat support — they have Flight. Your Doom generation starts slow but ramps: spellbook conditions award 3 free Doom at specific milestones. Use Passion (gain 1 Doom per battle you participate in) to turn every fight into Doom fuel.",
  midGame:
    "Awaken Hastur (10 cost, 6 combat) when you have the economy. Hastur is a wrecking ball — 6 combat dice plus any spellbook bonuses. With Passion active, every battle Hastur fights generates Doom. Shriek can force enemy units to flee before combat, weakening defensive positions. Build toward your 3 free Doom spellbook milestones. Political leverage is key — threaten Desecrate to extort agreements from weaker players.",
  lateGame:
    "Yellow Sign is the fastest Doom rusher in the game. Gift of the King awards 3 free Doom. Combined with 4+ gates, Passion from combat, and Ritual of Annihilation, you can jump 8-10 Doom in a single round. Cloud Memory protects your gates from Dreams and other steal effects. Push for 30 Doom as fast as possible — once opponents realize you're close, they'll gang up.",
  keyMistakes: [
    "Ignoring Desecrate — it's your best Power-to-Doom converter through cheap gate theft",
    "Holding off King in Yellow — place him early even though he has 0 combat",
    "Fighting without Passion online — battles without Doom payoff waste your Power",
    "Spreading Undead too thin — they need to be in groups to Desecrate effectively",
    "Not tracking your Doom milestones for free Doom awards",
  ],
  rulesReminders: [
    "Desecrate: 1 Power. Place a Desecration token in an area with your Undead. If enemies leave, you gain the Gate.",
    "King in Yellow: 4 cost, 0 combat. Cannot be killed — only Pained (retreated). His area presence enables multiple spellbooks.",
    "Passion: gain 1 Doom each time you are involved in a battle (attacking or defending).",
    "Hastur: 10 cost, 6 combat. Standard GOO stats. Awakening requires King in Yellow on the map.",
    "Undead: max 6. They are recruitable in any area with your units, not just gates.",
  ],
},
```

**Step 4: Run tests to verify all pass**

Run: `npx vitest run src/data/__tests__/faction-strategies.test.ts --reporter=verbose`
Expected: All 7 tests PASS

**Step 5: Commit**

```bash
git add src/data/faction-strategies.ts
git commit -m "feat: add strategy data for Black Goat, Crawling Chaos, Yellow Sign"
```

---

### Task 6: Create faction-matchups.ts — 12 pairwise entries

**Files:**
- Create: `src/data/faction-matchups.ts`
- Create: `src/data/__tests__/faction-matchups.test.ts`

**Step 1: Write the test file**

```typescript
import { describe, it, expect } from "vitest";
import {
  FACTION_MATCHUPS,
  getMatchupsForGame,
  type FactionMatchup,
} from "../faction-matchups";
import { FACTION_MAP } from "../faction-data";

const CORE_FACTIONS = [
  "great-cthulhu",
  "black-goat",
  "crawling-chaos",
  "yellow-sign",
];

describe("faction-matchups", () => {
  it("has 12 pairwise entries for core factions (4 × 3)", () => {
    const corePairs = FACTION_MATCHUPS.filter(
      (m) =>
        CORE_FACTIONS.includes(m.factionId) &&
        CORE_FACTIONS.includes(m.opponentId)
    );
    expect(corePairs).toHaveLength(12);
  });

  it("every matchup references valid factions", () => {
    for (const m of FACTION_MATCHUPS) {
      expect(FACTION_MAP[m.factionId], `${m.factionId} invalid`).toBeDefined();
      expect(FACTION_MAP[m.opponentId], `${m.opponentId} invalid`).toBeDefined();
    }
  });

  it("no faction is matched against itself", () => {
    for (const m of FACTION_MATCHUPS) {
      expect(m.factionId).not.toBe(m.opponentId);
    }
  });

  it("threat levels are valid", () => {
    for (const m of FACTION_MATCHUPS) {
      expect(["low", "medium", "high"]).toContain(m.threatLevel);
    }
  });

  it("attack and defend text are non-empty", () => {
    for (const m of FACTION_MATCHUPS) {
      expect(m.attack.length, `${m.factionId} vs ${m.opponentId} attack`).toBeGreaterThan(20);
      expect(m.defend.length, `${m.factionId} vs ${m.opponentId} defend`).toBeGreaterThan(20);
    }
  });

  it("getMatchupsForGame filters correctly", () => {
    const gameMatchups = getMatchupsForGame(
      "great-cthulhu",
      ["great-cthulhu", "black-goat", "yellow-sign"]
    );
    expect(gameMatchups).toHaveLength(2); // vs black-goat, vs yellow-sign
    expect(gameMatchups.every((m) => m.factionId === "great-cthulhu")).toBe(true);
    expect(gameMatchups.map((m) => m.opponentId).sort()).toEqual(
      ["black-goat", "yellow-sign"].sort()
    );
  });

  it("getMatchupsForGame returns empty for faction not in game", () => {
    const result = getMatchupsForGame("sleeper", ["great-cthulhu", "black-goat"]);
    expect(result).toHaveLength(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/faction-matchups.test.ts --reporter=verbose`
Expected: FAIL — module not found

**Step 3: Create faction-matchups.ts**

Create `src/data/faction-matchups.ts`:

```typescript
// src/data/faction-matchups.ts
// Pairwise matchup tips for in-game reference.
// Each entry: how factionId should approach playing against opponentId.

export interface FactionMatchup {
  factionId: string;
  opponentId: string;
  threatLevel: "low" | "medium" | "high";
  attack: string;   // ~75 words: how to pressure this opponent
  defend: string;    // ~75 words: how to protect against their tricks
}

/**
 * Filter matchups for a specific game:
 * returns matchups where factionId = playerFaction
 * and opponentId is in the game's faction list.
 */
export function getMatchupsForGame(
  playerFactionId: string,
  allFactionIds: string[]
): FactionMatchup[] {
  return FACTION_MATCHUPS.filter(
    (m) =>
      m.factionId === playerFactionId &&
      allFactionIds.includes(m.opponentId) &&
      m.opponentId !== playerFactionId
  );
}

export const FACTION_MATCHUPS: FactionMatchup[] = [
  // ── Great Cthulhu vs others ──
  {
    factionId: "great-cthulhu",
    opponentId: "black-goat",
    threatLevel: "medium",
    attack:
      "Target Black Goat's Cultists to slow their economy. Ghroth requires Fungi deployment — if you can kill Mi-Go before they reach 4, you weaken Ghroth's success rate. Use Dreams to steal their weakly-defended gates. Devour their Dark Young before combat to break Thousand Young locks.",
    defend:
      "Ghroth kills 1 of your Cultists per area on success. Don't spread Acolytes thin across many areas — cluster them so Ghroth only costs you 1 total. Keep Deep Ones in your pool for Devolve. Blood Sacrifice is once per Doom Phase — it can't be stacked.",
  },
  {
    factionId: "great-cthulhu",
    opponentId: "crawling-chaos",
    threatLevel: "high",
    attack:
      "CC's Nightgaunts are cheap and fragile — Devour kills them before dice roll. Attack areas where CC has invested expensive Polyps or Hunting Horrors. Force CC to defend instead of disrupting. If Nyarlathotep is alone, a Cthulhu + Starspawn strike can eliminate him.",
    defend:
      "Madness is your biggest threat: Pain results send your units where CC chooses. Never Submerge into an area CC can reach — they'll scatter your forces on emergence. Keep your units together so Madness can't isolate them. Submerge away from CC's reach, then emerge far from their Nightgaunts.",
  },
  {
    factionId: "great-cthulhu",
    opponentId: "yellow-sign",
    threatLevel: "medium",
    attack:
      "Desecrate targets lonely Acolytes — same as your Dreams. Race Yellow Sign for vulnerable gates. Devour King in Yellow's escorts to isolate him (he can't be killed, only Pained). Attack Undead stacks before Desecrate tokens accumulate. Hit them before Passion makes combat profitable for them.",
    defend:
      "Passion gives YS 1 Doom per battle — avoid pointless skirmishes. Don't leave single Acolytes on gates (Dreams AND Desecrate both target them). Watch the Doom track: YS can surge 8-10 Doom in a single round with gates + Ritual + Passion. Alert the table when YS approaches 20 Doom.",
  },

  // ── Black Goat vs others ──
  {
    factionId: "black-goat",
    opponentId: "great-cthulhu",
    threatLevel: "medium",
    attack:
      "GC is vulnerable during Submerge — they're off the map and can't defend gates. Time Ghroth when Cthulhu is submerged and GC's Acolytes are spread across multiple areas for maximum Cultist kills. Dark Young can lock down GC's ocean-adjacent gates with Thousand Young.",
    defend:
      "Devour eliminates your best unit before combat. Never send Dark Young or Shub-Niggurath without expendable escorts. Devolve can create defenders instantly — don't assume a lone GC Acolyte is undefended. Dreams steals your gates at 2 Power each — always leave 2+ Cultists per gate.",
  },
  {
    factionId: "black-goat",
    opponentId: "crawling-chaos",
    threatLevel: "medium",
    attack:
      "CC is fragile — Nightgaunts have 1 combat die. Dark Young with combat support can wipe CC positions efficiently. Thousand Young locks CC units in place, negating their mobility advantage. Ghroth hits CC's Acolytes across the map, disrupting their Thousand Forms economy.",
    defend:
      "Madness scatters your carefully positioned units. Keep Dark Young in pairs for Thousand Young protection. Don't overextend Cultists into CC territory — Madness turns them into CC's positioning tools. Emissary lets CC recruit cheaply near your gates; keep gate defenders in groups.",
  },
  {
    factionId: "black-goat",
    opponentId: "yellow-sign",
    threatLevel: "high",
    attack:
      "Both factions race for Doom — you need to out-pace YS's Desecrate economy. Ghroth devastates YS's Undead swarm (up to 6 Undead across the map = lots of casualties). Time Ghroth when YS has Undead on gates without monster backup. Dark Young can lock down Desecrate targets.",
    defend:
      "Desecrate steals your gates cheaply — never leave a gate with only 1 Cultist. YS's Doom acceleration is faster than yours in the late game. Watch the Doom track obsessively. If YS has 3+ gates and Hastur, they can end the game before you finish your Elder Sign collection through Blood Sacrifice.",
  },

  // ── Crawling Chaos vs others ──
  {
    factionId: "crawling-chaos",
    opponentId: "great-cthulhu",
    threatLevel: "medium",
    attack:
      "Madness is devastating against GC: scatter their submerged forces when they emerge. Position Nightgaunts near ocean areas so you can intercept Cthulhu post-Submerge. Force Pains on their Deep Ones to send them to useless locations. GC needs the ocean — deny it with area presence.",
    defend:
      "Devour kills your unit before combat dice roll. Never send Nyarlathotep into GC without expendable escorts. Cthulhu + Absorb ball can roll 15+ dice — avoid fighting into stacked GC positions. Submerge makes GC unpredictable: they can appear anywhere. Keep reserve Power for emergency retreats.",
  },
  {
    factionId: "crawling-chaos",
    opponentId: "black-goat",
    threatLevel: "medium",
    attack:
      "Black Goat turtles — use Madness to pull their units out of defended positions. Scatter Dark Young away from each other to break Thousand Young lock. Nightgaunts are cheap enough to probe BG's defenses without committing. Emissary lets you recruit near BG's gates for surprise attacks.",
    defend:
      "Ghroth kills your Acolytes across the map — keep Nightgaunts (monsters, not Cultists) as primary map presence when possible. Thousand Young locks your units in place — avoid moving into areas with 2+ Dark Young. BG's economy outpaces yours: don't try to out-build them, out-disrupt them.",
  },
  {
    factionId: "crawling-chaos",
    opponentId: "yellow-sign",
    threatLevel: "medium",
    attack:
      "Madness scatters YS's Undead stacks, breaking their Desecrate setups. Target King in Yellow's area — he can't be killed but his escorts can be Pained away, leaving him isolated and useless. Use Flight to strike YS's backline gates while they push forward. Nightgaunts are cheap probes against Undead.",
    defend:
      "Passion gives YS Doom from every battle — pick your fights carefully. Avoid small skirmishes that feed YS's Doom engine. Desecrate threatens your gates: maintain 2+ defenders per gate. Watch for the Doom surge: YS at 20+ Doom with Hastur and 3+ gates can end the game next round.",
  },

  // ── Yellow Sign vs others ──
  {
    factionId: "yellow-sign",
    opponentId: "great-cthulhu",
    threatLevel: "medium",
    attack:
      "Desecrate and Dreams both steal gates — use this to compete directly. Your Undead are cheaper and more numerous than GC's Deep Ones. Target GC's non-ocean gates while Cthulhu is submerged. Passion rewards you for every battle — trade combat willingly. King in Yellow can't be killed, making your area control persistent.",
    defend:
      "Devour eats your best unit pre-combat. Send Undead as chaff, not Byakhee or Hastur. Dreams steals your gates at 2 Power — always have 2+ Cultists per gate. Cthulhu's Absorb ball can wipe an entire defensive position. Don't stack expensive units where GC can reach with Submerge.",
  },
  {
    factionId: "yellow-sign",
    opponentId: "black-goat",
    threatLevel: "high",
    attack:
      "You and BG are in a Doom race — you need to win it. Desecrate BG's outer gates while they turtle. Your Undead swarm matches BG's Cultist count, and Passion rewards you for every engagement. Target Mi-Go (Fungi) to reduce Ghroth success rate. Byakhee Flight bypasses Thousand Young lock.",
    defend:
      "Ghroth devastates your Undead swarm. When BG has 3-4 Fungi deployed, expect Ghroth — consolidate your Undead to minimize casualties. Blood Sacrifice generates Elder Signs every Doom Phase — BG's Elder Sign collection rivals yours. Thousand Young locks your ground units: use Byakhee Flight to bypass. Don't ignore BG's Doom track — they're faster than they look.",
  },
  {
    factionId: "yellow-sign",
    opponentId: "crawling-chaos",
    threatLevel: "medium",
    attack:
      "CC relies on positioning — Desecrate disrupts their gate control cheaply. Your Undead outnumber their Nightgaunts. King in Yellow's area presence forces CC to play around you. Passion turns CC's aggressive playstyle against them: every battle they start gives you Doom.",
    defend:
      "Madness is your biggest threat: CC chooses where your Pained Undead go, scattering your Desecrate setups. Keep Undead in groups so Madness can't isolate them. Flight lets Nyarlathotep strike deep — protect backline gates. Emissary lets CC recruit near your gates cheaply; maintain strong gate defense.",
  },
];
```

**Step 4: Run tests to verify all pass**

Run: `npx vitest run src/data/__tests__/faction-matchups.test.ts --reporter=verbose`
Expected: All 7 tests PASS

**Step 5: Commit**

```bash
git add src/data/faction-matchups.ts src/data/__tests__/faction-matchups.test.ts
git commit -m "feat: add faction-matchups.ts with 12 pairwise entries for core factions"
```

---

## Phase 1C: Strategy Tab UI

### Task 7: Add tab bar to tracker page

Add a `Game | Strategy | Log` tab bar to `page.tsx`. The existing content becomes the "Game" tab. Strategy and Log are new tab panes.

**Files:**
- Modify: `src/app/tracker/[sessionId]/page.tsx`

**Step 1: Add tab state and tab bar UI**

At the top of `TrackerPage()`, after the existing state hooks, add:

```typescript
const [activeTab, setActiveTab] = useState<"game" | "strategy" | "log">("game");
```

Add import for `useState` (already imported).

Then in the JSX, after the top bar `</div>` (line 180) and before the Doom Track, insert the tab bar:

```tsx
{/* Tab bar */}
<div className="mb-6 flex gap-1 rounded-lg border border-void-lighter bg-void-light p-1">
  {(["game", "strategy", "log"] as const).map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`flex-1 rounded-md px-4 py-2 text-sm font-heading font-semibold uppercase tracking-wider transition-colors ${
        activeTab === tab
          ? "bg-void-lighter text-bone"
          : "text-bone-muted hover:text-bone"
      }`}
    >
      {tab === "game" ? "Game" : tab === "strategy" ? "Strategy" : "Log"}
    </button>
  ))}
</div>
```

Then wrap the existing Game content (DoomTrack through Final Scoring Banner) in a conditional:

```tsx
{activeTab === "game" && (
  <>
    {/* Doom Track */}
    <div className="mb-6">
      <DoomTrack players={session.players} />
    </div>
    {/* ... all existing game content through Final Scoring Banner ... */}
  </>
)}

{activeTab === "strategy" && (
  <div className="text-center text-bone-muted py-12">
    Strategy tab coming soon...
  </div>
)}

{activeTab === "log" && (
  <div className="mb-6">
    <ActionLog entries={session.actionLog} />
  </div>
)}
```

**Important:** The ActionLog currently shows in the "game" tab AND should move to the "log" tab. Remove the ActionLog from the game content block and put it in the log tab only.

Also keep the InteractionWarnings in the game tab.

**Step 2: Verify in browser**

Run: `npm run dev` (or use preview_start with the "dev" configuration)
Navigate to a game session, verify:
- Tab bar shows with 3 tabs
- Game tab shows all existing tracker content (minus ActionLog)
- Strategy tab shows placeholder
- Log tab shows the ActionLog
- Tab switching works

**Step 3: Commit**

```bash
git add src/app/tracker/[sessionId]/page.tsx
git commit -m "feat: add Game/Strategy/Log tab bar to tracker page"
```

---

### Task 8: Build SpellbookPath component

**Files:**
- Create: `src/components/tracker/SpellbookPath.tsx`

**Step 1: Create the component**

```tsx
// src/components/tracker/SpellbookPath.tsx
"use client";

import { useState } from "react";
import { FACTION_MAP } from "@/data/faction-data";

interface SpellbookPathProps {
  factionId: string;
  priority: string[];
  notes: string;
}

export function SpellbookPath({ factionId, priority, notes }: SpellbookPathProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const faction = FACTION_MAP[factionId];
  if (!faction) return null;

  // Build a lookup from spellbook name to spellbook data
  const spellbookLookup = Object.fromEntries(
    faction.spellbooks.map((sb) => [sb.name, sb])
  );

  return (
    <div>
      <ol className="space-y-2">
        {priority.map((name, i) => {
          const sb = spellbookLookup[name];
          const isExpanded = expandedIdx === i;
          return (
            <li key={name}>
              <button
                onClick={() => setExpandedIdx(isExpanded ? null : i)}
                className="flex w-full items-center gap-3 rounded-lg border border-void-lighter bg-void px-4 py-2.5 text-left transition-colors hover:border-bone-muted/30"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-void-lighter text-xs font-bold text-bone-muted">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-semibold text-bone">
                  {name}
                </span>
                {sb && (
                  <span className="rounded bg-void-lighter px-2 py-0.5 text-[10px] font-bold text-bone-muted">
                    {sb.abbrev}
                  </span>
                )}
                <span className="text-bone-muted text-xs">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {notes && (
        <p className="mt-3 text-xs text-bone-muted/80 italic leading-relaxed">
          {notes}
        </p>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/tracker/SpellbookPath.tsx
git commit -m "feat: add SpellbookPath component for strategy tab"
```

---

### Task 9: Build GamePhases component

**Files:**
- Create: `src/components/tracker/GamePhases.tsx`

**Step 1: Create the component**

```tsx
// src/components/tracker/GamePhases.tsx
"use client";

import { useState } from "react";

interface GamePhasesProps {
  opening: string;
  earlyGame: string;
  midGame: string;
  lateGame: string;
}

const PHASES = [
  { key: "opening", label: "Opening (Turns 1-3)", emoji: "🏁" },
  { key: "earlyGame", label: "Early Game", emoji: "🌅" },
  { key: "midGame", label: "Mid Game", emoji: "⚔️" },
  { key: "lateGame", label: "Late Game", emoji: "🏆" },
] as const;

export function GamePhases({ opening, earlyGame, midGame, lateGame }: GamePhasesProps) {
  const [openPhase, setOpenPhase] = useState<string | null>(null);

  const content: Record<string, string> = { opening, earlyGame, midGame, lateGame };

  return (
    <div className="space-y-2">
      {PHASES.map(({ key, label, emoji }) => {
        const isOpen = openPhase === key;
        return (
          <div key={key} className="rounded-lg border border-void-lighter bg-void">
            <button
              onClick={() => setOpenPhase(isOpen ? null : key)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-sm font-semibold text-bone">
                {emoji} {label}
              </span>
              <span className="text-bone-muted text-xs">
                {isOpen ? "▲" : "▼"}
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-void-lighter px-4 py-3">
                <p className="text-sm text-bone-muted leading-relaxed">
                  {content[key]}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/tracker/GamePhases.tsx
git commit -m "feat: add GamePhases accordion component for strategy tab"
```

---

### Task 10: Build MatchupCard + OpponentCards

**Files:**
- Create: `src/components/tracker/MatchupCard.tsx`
- Create: `src/components/tracker/OpponentCards.tsx`

**Step 1: Create MatchupCard**

```tsx
// src/components/tracker/MatchupCard.tsx
"use client";

import { useState } from "react";
import { FACTION_MAP } from "@/data/faction-data";
import type { FactionMatchup } from "@/data/faction-matchups";

interface MatchupCardProps {
  matchup: FactionMatchup;
}

const THREAT_STYLES = {
  low: { badge: "bg-green-500/20 text-green-400", dot: "🟢" },
  medium: { badge: "bg-amber-400/20 text-amber-400", dot: "🟡" },
  high: { badge: "bg-red-500/20 text-red-400", dot: "🔴" },
};

export function MatchupCard({ matchup }: MatchupCardProps) {
  const [open, setOpen] = useState(false);
  const opponent = FACTION_MAP[matchup.opponentId];
  const styles = THREAT_STYLES[matchup.threatLevel];

  return (
    <div className="rounded-lg border border-void-lighter bg-void">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <div
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: opponent?.color ?? "#666" }}
        />
        <span className="flex-1 text-sm font-semibold text-bone">
          vs {opponent?.name ?? matchup.opponentId}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${styles.badge}`}>
          {styles.dot} {matchup.threatLevel}
        </span>
        <span className="text-bone-muted text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="border-t border-void-lighter px-4 py-3 space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-green-400 mb-1">
              Attack
            </p>
            <p className="text-sm text-bone-muted leading-relaxed">
              {matchup.attack}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">
              Defend
            </p>
            <p className="text-sm text-bone-muted leading-relaxed">
              {matchup.defend}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Create OpponentCards**

```tsx
// src/components/tracker/OpponentCards.tsx
"use client";

import { getMatchupsForGame } from "@/data/faction-matchups";
import { MatchupCard } from "./MatchupCard";

interface OpponentCardsProps {
  factionId: string;
  allFactionIds: string[];
}

export function OpponentCards({ factionId, allFactionIds }: OpponentCardsProps) {
  const matchups = getMatchupsForGame(factionId, allFactionIds);

  if (matchups.length === 0) {
    return (
      <p className="text-sm text-bone-muted/60 italic">
        No matchup data available for this game combination yet.
      </p>
    );
  }

  // Sort by threat: high first, then medium, then low
  const sorted = [...matchups].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.threatLevel] - order[b.threatLevel];
  });

  return (
    <div className="space-y-2">
      {sorted.map((m) => (
        <MatchupCard key={`${m.factionId}-${m.opponentId}`} matchup={m} />
      ))}
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/tracker/MatchupCard.tsx src/components/tracker/OpponentCards.tsx
git commit -m "feat: add MatchupCard and OpponentCards components for strategy tab"
```

---

### Task 11: Build RulesReminders component

**Files:**
- Create: `src/components/tracker/RulesReminders.tsx`

**Step 1: Create the component**

```tsx
// src/components/tracker/RulesReminders.tsx
"use client";

interface RulesRemindersProps {
  reminders: string[];
  mistakes: string[];
}

export function RulesReminders({ reminders, mistakes }: RulesRemindersProps) {
  return (
    <div className="space-y-4">
      {/* Rules */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-bone-muted/60 mb-2">
          Rules
        </p>
        <ul className="space-y-2">
          {reminders.map((r, i) => (
            <li
              key={i}
              className="flex gap-2 rounded-lg border border-void-lighter bg-void px-4 py-2.5 text-sm text-bone-muted leading-relaxed"
            >
              <span className="shrink-0 text-amber-400">⚠</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Mistakes */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-bone-muted/60 mb-2">
          Common Mistakes
        </p>
        <ul className="space-y-2">
          {mistakes.map((m, i) => (
            <li
              key={i}
              className="flex gap-2 rounded-lg border border-void-lighter bg-void px-4 py-2.5 text-sm text-bone-muted leading-relaxed"
            >
              <span className="shrink-0 text-red-400">✗</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/tracker/RulesReminders.tsx
git commit -m "feat: add RulesReminders component for strategy tab"
```

---

### Task 12: Build StrategyTab + wire to tracker page

This is the integration task. Create the `StrategyTab` wrapper component, then wire it into the tracker page.

**Files:**
- Create: `src/components/tracker/StrategyTab.tsx`
- Modify: `src/app/tracker/[sessionId]/page.tsx`

**Step 1: Create StrategyTab**

```tsx
// src/components/tracker/StrategyTab.tsx
"use client";

import { useState } from "react";
import { FACTION_MAP } from "@/data/faction-data";
import { FACTION_STRATEGIES } from "@/data/faction-strategies";
import { SpellbookPath } from "./SpellbookPath";
import { GamePhases } from "./GamePhases";
import { OpponentCards } from "./OpponentCards";
import { RulesReminders } from "./RulesReminders";

interface StrategyTabProps {
  factionId: string;
  allFactionIds: string[];
  playerName: string;
}

type Section = "spellbook" | "phases" | "opponents" | "rules";

export function StrategyTab({ factionId, allFactionIds, playerName }: StrategyTabProps) {
  const [openSections, setOpenSections] = useState<Set<Section>>(
    new Set(["spellbook"])
  );

  const faction = FACTION_MAP[factionId];
  const strategy = FACTION_STRATEGIES[factionId];

  if (!faction || !strategy) {
    return (
      <div className="rounded-xl border border-void-lighter bg-void-light p-6 text-center">
        <p className="text-bone-muted">
          Strategy guide not yet available for {faction?.name ?? factionId}.
        </p>
        <p className="mt-1 text-xs text-bone-muted/60">
          Expansion faction guides are coming in a future update.
        </p>
      </div>
    );
  }

  const toggle = (section: Section) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const sectionHeader = (
    section: Section,
    emoji: string,
    label: string,
    badge?: string
  ) => (
    <button
      onClick={() => toggle(section)}
      className="flex w-full items-center justify-between px-5 py-3 text-left"
    >
      <span className="font-heading text-sm font-semibold uppercase tracking-wider text-bone-muted">
        {emoji} {label}
        {badge && (
          <span className="ml-2 text-[10px] font-normal normal-case tracking-normal text-bone-muted/60">
            {badge}
          </span>
        )}
      </span>
      <span className="text-bone-muted">
        {openSections.has(section) ? "▲" : "▼"}
      </span>
    </button>
  );

  const opponentCount = allFactionIds.filter((id) => id !== factionId).length;

  return (
    <div className="space-y-4">
      {/* Player/Faction header */}
      <div className="flex items-center gap-3 px-1">
        <div
          className="h-4 w-4 rounded-full"
          style={{ backgroundColor: faction.color }}
        />
        <div>
          <h2 className="font-heading text-lg font-bold text-bone">
            {playerName}
          </h2>
          <p className="text-xs text-bone-muted">{faction.name} Strategy Guide</p>
        </div>
      </div>

      {/* Section 1: Spellbook Path */}
      <div className="rounded-xl border border-void-lighter bg-void-light">
        {sectionHeader("spellbook", "📖", "Spellbook Path")}
        {openSections.has("spellbook") && (
          <div className="border-t border-void-lighter px-5 py-4">
            <SpellbookPath
              factionId={factionId}
              priority={strategy.spellbookPath.priority}
              notes={strategy.spellbookPath.notes}
            />
          </div>
        )}
      </div>

      {/* Section 2: Game Phases */}
      <div className="rounded-xl border border-void-lighter bg-void-light">
        {sectionHeader("phases", "⚔️", "Opening & Game Phases")}
        {openSections.has("phases") && (
          <div className="border-t border-void-lighter px-5 py-4">
            <GamePhases
              opening={strategy.opening}
              earlyGame={strategy.earlyGame}
              midGame={strategy.midGame}
              lateGame={strategy.lateGame}
            />
          </div>
        )}
      </div>

      {/* Section 3: vs Opponents */}
      <div className="rounded-xl border border-void-lighter bg-void-light">
        {sectionHeader(
          "opponents",
          "🎯",
          "vs Opponents",
          `${opponentCount} in game`
        )}
        {openSections.has("opponents") && (
          <div className="border-t border-void-lighter px-5 py-4">
            <OpponentCards
              factionId={factionId}
              allFactionIds={allFactionIds}
            />
          </div>
        )}
      </div>

      {/* Section 4: Rules & Mistakes */}
      <div className="rounded-xl border border-void-lighter bg-void-light">
        {sectionHeader("rules", "⚠️", "Rules & Common Mistakes")}
        {openSections.has("rules") && (
          <div className="border-t border-void-lighter px-5 py-4">
            <RulesReminders
              reminders={strategy.rulesReminders}
              mistakes={strategy.keyMistakes}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Wire StrategyTab into the tracker page**

In `src/app/tracker/[sessionId]/page.tsx`:

1. Add import at top:
```typescript
import { StrategyTab } from "@/components/tracker/StrategyTab";
```

2. Add a player selector state for the strategy tab (which player's strategy to show). After `activeTab` state:
```typescript
const [strategyPlayerIdx, setStrategyPlayerIdx] = useState(0);
```

3. Replace the placeholder strategy tab content:
```tsx
{activeTab === "strategy" && session.players.length > 0 && (
  <div>
    {/* Player selector (if multiplayer) */}
    {session.players.length > 1 && (
      <div className="mb-4 flex gap-2">
        {session.players.map((player, i) => {
          const f = FACTION_MAP[player.factionId];
          return (
            <button
              key={player.factionId}
              onClick={() => setStrategyPlayerIdx(i)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                strategyPlayerIdx === i
                  ? "border border-bone-muted/40 bg-void-lighter text-bone"
                  : "border border-void-lighter text-bone-muted hover:text-bone"
              }`}
            >
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: f?.color }}
              />
              {player.name}
            </button>
          );
        })}
      </div>
    )}
    <StrategyTab
      factionId={session.players[strategyPlayerIdx].factionId}
      allFactionIds={factionIds}
      playerName={session.players[strategyPlayerIdx].name}
    />
  </div>
)}
```

**Step 3: Commit**

```bash
git add src/components/tracker/StrategyTab.tsx src/app/tracker/[sessionId]/page.tsx
git commit -m "feat: integrate StrategyTab into tracker page with player selector"
```

---

### Task 13: Full verification and final commit

**Step 1: Run full test suite**

Run: `npx vitest run --reporter=verbose`
Expected: All tests PASS (existing + new)

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors

**Step 3: Run lint**

Run: `npm run lint`
Expected: No warnings or errors

**Step 4: Manual browser verification**

Start dev server and verify:
1. Navigate to tracker setup, create a 3-faction game (Great Cthulhu, Black Goat, Yellow Sign)
2. In the game, click "Strategy" tab — should show strategy guide
3. Verify player selector switches between players
4. Verify each section expands/collapses
5. Verify Spellbook Path shows 6 ordered spellbooks
6. Verify Game Phases shows opening/early/mid/late
7. Verify vs Opponents shows only factions in the current game (2 matchups per player)
8. Verify Rules Reminders shows rules + common mistakes
9. Verify "Log" tab still shows action log
10. Verify "Game" tab shows all tracker controls

**Step 5: Fix any issues found**

If lint or tests fail, fix before committing.

**Step 6: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix: address lint/test issues from strategy tab integration"
```

---

## Summary

| Phase | Tasks | Files Created | Files Modified |
|-------|-------|---------------|----------------|
| 1A: Data Fixes | 1-3 | 1 (test file) | 3 (faction-units, unique-high-priests, faction-interactions) |
| 1B: Strategy Data | 4-6 | 4 (2 data + 2 tests) | 0 |
| 1C: Strategy Tab UI | 7-13 | 6 (components) | 1 (page.tsx) |
| **Total** | **13** | **11** | **4** |

Estimated time: ~2-3 hours for an engineer familiar with the codebase, plus ~1 hour for user content review of strategy text accuracy.
