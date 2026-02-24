// src/data/map-strategies.ts

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
