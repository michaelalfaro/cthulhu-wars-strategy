// src/data/neutral-monsters.ts

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
    abilitySummary:
      "Limited availability combat neutral from Beyond Time & Space.",
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
  // CATaclysm / Something About Cats
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
