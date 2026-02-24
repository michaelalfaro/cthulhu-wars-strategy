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
    text: "Yellow Sign accelerates Doom faster than any other faction. Desecrate steals Gates cheaply, Passion scores Doom from combat, and their spellbook conditions award 3 free Doom. Once they have 3+ Gates and Hastur, the Doom track can jump from 20 to 30 in a single round.",
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
    text: "Ghroth (2 Power): Roll d6 \u2264 areas with Fungi to succeed. On success, every player eliminates 1 Cultist from each area. At 4 Fungi (max) you need a 4 or less. Not guaranteed \u2014 but devastating when it hits.",
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
