// src/data/independent-goos.ts

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
