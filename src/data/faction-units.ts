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
