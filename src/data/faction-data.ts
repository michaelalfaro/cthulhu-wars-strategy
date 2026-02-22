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
      { id: "infiltration", name: "Infiltration", abbrev: "INF" },
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
