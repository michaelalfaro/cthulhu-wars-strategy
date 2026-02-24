// src/data/faction-matchups.ts
// Pairwise matchup tips for in-game reference.
// Each entry: how factionId should approach playing against opponentId.

export interface FactionMatchup {
  factionId: string;
  opponentId: string;
  threatLevel: "low" | "medium" | "high";
  attack: string;
  defend: string;
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
      "Desecrate and Dreams both steal gates — race Yellow Sign for vulnerable ones. Devour King in Yellow's escorts to isolate him (he can't be killed, only Pained). Attack Undead stacks before Desecrate tokens accumulate. Hit them before Passion makes combat profitable for them.",
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
