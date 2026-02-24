// src/data/terrors.ts

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
