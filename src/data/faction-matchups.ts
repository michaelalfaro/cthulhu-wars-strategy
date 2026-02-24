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
      "Target Black Goat's Cultists to slow their economy. Ghroth requires Fungi deployment — if you can kill Mi-Go before they reach 4, you weaken Ghroth's success rate. Use Dreams to steal their weakly-defended gates. Devour forces BG to sacrifice a unit before combat — use it to thin escorts before engaging Dark Young.",
    defend:
      "Ghroth on success forces enemies to eliminate Cultists equal to the die roll (divided among opponents). Cluster your Acolytes together so you lose fewer to the split. Keep Deep Ones in your pool for Devolve. Blood Sacrifice is once per Doom Phase — it can't be stacked.",
  },
  {
    factionId: "great-cthulhu",
    opponentId: "crawling-chaos",
    threatLevel: "high",
    attack:
      "CC's Nightgaunts have 0 combat — Devour forces CC to sacrifice one of their own units before dice roll (their choice, but still costly). Attack areas with expensive Polyps or Hunting Horrors. Force CC to defend instead of disrupting. If Nyarlathotep is alone, strike hard — Emissary only converts kills to pains if no enemy GOO is present.",
    defend:
      "Madness is your biggest threat: Pain results send your units where CC chooses. Never Submerge into an area CC can reach — they'll scatter your forces on emergence. Keep your units together so Madness can't isolate them. Submerge away from CC's reach, then emerge far from their Nightgaunts.",
  },
  {
    factionId: "great-cthulhu",
    opponentId: "yellow-sign",
    threatLevel: "medium",
    attack:
      "Desecrate and Dreams both target gates — race Yellow Sign for vulnerable ones. Devour forces YS to sacrifice a unit pre-combat, thinning King in Yellow's escorts. The King CAN be killed — if you strip his Undead escort, he's defenseless at 0 combat. Attack before Desecrate tokens accumulate.",
    defend:
      "Passion gives YS Power when you eliminate their Cultists — avoid killing their Cultists unnecessarily. Don't leave single Acolytes on gates (Dreams AND Desecrate both target them). Watch the Doom track: YS can surge with gates + Ritual + Elder Signs from Third Eye. Alert the table when YS approaches 20 Doom.",
  },

  // ── Black Goat vs others ──
  {
    factionId: "black-goat",
    opponentId: "great-cthulhu",
    threatLevel: "medium",
    attack:
      "GC is vulnerable during Submerge — they're off the map and can't defend gates. Time Ghroth when Cthulhu is submerged and GC's Acolytes are exposed for maximum impact. With Thousand Young online (Shub in play), your monsters cost less to summon — use cheap Ghouls to flood GC's ocean-adjacent gates.",
    defend:
      "Devour forces you to sacrifice one of your own units before combat (your choice) — never send Dark Young or Shub without expendable Ghoul escorts. Devolve can create defenders instantly — don't assume a lone GC Acolyte is undefended. Dreams steals your gates at 2 Power each — always leave 2+ Cultists per gate.",
  },
  {
    factionId: "black-goat",
    opponentId: "crawling-chaos",
    threatLevel: "medium",
    attack:
      "CC is fragile — Nightgaunts have 0 combat dice. Dark Young with combat support can wipe CC positions efficiently. With Thousand Young online (Shub in play), your monsters are cheaper to summon, letting you flood the board. Ghroth hits CC's Acolytes across the map, disrupting their gate economy.",
    defend:
      "Madness scatters your carefully positioned units — CC chooses where ALL pained units retreat, even in battles they're not in. Keep Dark Young in pairs for mutual defense. Don't overextend Cultists into CC territory — Madness turns them into CC's positioning tools. Emissary protects Nyarlathotep (kills → pains) — you need an enemy GOO present to actually kill him.",
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
      "Devour forces you to sacrifice one of your own units before combat dice roll (your choice, but still painful). Never send Nyarlathotep into GC without expendable escorts. Cthulhu + Absorb can roll many dice — avoid fighting into stacked GC positions. Submerge makes GC unpredictable. Keep reserve Power for emergency retreats.",
  },
  {
    factionId: "crawling-chaos",
    opponentId: "black-goat",
    threatLevel: "medium",
    attack:
      "Black Goat turtles — use Madness to pull their units out of defended positions. When Shub is in play, BG's monsters cost less (Thousand Young) — hit them before she's summoned. Nightgaunts are cheap probes against BG's defenses. Use Thousand Forms to drain BG's Power each Action Phase.",
    defend:
      "Ghroth on success eliminates Cultists equal to the die roll (split among enemies) — keep Nightgaunts (monsters, not Cultists) as primary map presence when possible. With Thousand Young online, BG summons monsters cheaply — don't try to out-build them, out-disrupt them instead.",
  },
  {
    factionId: "crawling-chaos",
    opponentId: "yellow-sign",
    threatLevel: "medium",
    attack:
      "Madness scatters YS's Undead stacks, breaking their Desecrate setups (Desecrate needs units ≥ die roll to succeed). Target King in Yellow's area — he CAN be killed (0 combat, fragile), so strip his escorts with Madness. Use Flight to strike YS's backline gates while they push forward.",
    defend:
      "Passion gives YS Power when their Cultists are eliminated — avoid killing YS Cultists unnecessarily, as it fuels their economy. Desecrate threatens your gates: maintain 2+ defenders per gate. Watch for the Doom surge: YS with Third Eye gains Elder Signs from every successful Desecrate.",
  },

  // ── Yellow Sign vs others ──
  {
    factionId: "yellow-sign",
    opponentId: "great-cthulhu",
    threatLevel: "medium",
    attack:
      "Desecrate and Dreams both target gates — use this to compete directly. Your Undead are cheaper and more numerous than GC's Deep Ones. Target GC's non-ocean gates while Cthulhu is submerged. Passion gives you Power when GC eliminates your Cultists — spread them to maximize triggers. Protect King in Yellow (0 combat, fragile) with Undead escorts.",
    defend:
      "Devour forces you to sacrifice one of your own units pre-combat (your choice) — send Undead as expendable escorts, not Byakhee or Hastur. Dreams steals your gates at 2 Power — always have 2+ Cultists per gate. Cthulhu's Absorb can wipe a defensive position. Don't stack expensive units where GC can reach with Submerge.",
  },
  {
    factionId: "yellow-sign",
    opponentId: "black-goat",
    threatLevel: "high",
    attack:
      "You and BG are in a Doom race — you need to win it. Desecrate BG's outer gates while they turtle. Your Undead swarm matches BG's Cultist count, and Passion gives you Power when BG eliminates your Cultists. Target Mi-Go (Fungi) to reduce Ghroth success rate. Byakhee Flight lets you strike past BG's monster wall.",
    defend:
      "Ghroth on success eliminates Cultists equal to the die roll (split among enemies). When BG has 3-4 Fungi deployed, expect Ghroth — consolidate your forces to minimize casualties. Blood Sacrifice generates Elder Signs every Doom Phase — BG's Elder Sign collection rivals yours. With Thousand Young, BG summons monsters cheaply — don't ignore their board presence. Don't ignore BG's Doom track.",
  },
  {
    factionId: "yellow-sign",
    opponentId: "crawling-chaos",
    threatLevel: "medium",
    attack:
      "CC relies on positioning — Desecrate disrupts their gate control cheaply. Your Undead outnumber their Nightgaunts. King in Yellow's area presence forces CC to play around you. Passion gives you Power when CC eliminates your Cultists — spread Cultists to maximize triggers and fund your economy.",
    defend:
      "Madness is your biggest threat: CC chooses where ALL pained units retreat (even in battles they're not in), scattering your Desecrate setups. Keep Undead in groups so Madness can't isolate them. Flight lets Nyarlathotep strike deep — protect backline gates. Emissary protects Nyarlathotep (kills → pains unless your GOO is present) — bring Hastur to fights against him.",
  },
];
