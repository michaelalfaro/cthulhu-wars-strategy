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
      "Devour: pre-battle. Enemy must eliminate 1 of their own monsters or Cultists (enemy's choice, not yours).",
      "Immortal: re-awaken Cthulhu for 4 Power (not 10). Gain 1 Elder Sign each time.",
      "Dreams: 2 Power. Only works if you have Acolytes in your pool. Enemy chooses which Cultist to lose if they have 2+.",
    ],
  },

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
      "Ghroth is your finisher. At 4 Fungi, you need to roll 4 or less on a d6 (67% success). On success, enemies collectively eliminate Cultists equal to your roll — a roll of 4 forces 4 total Cultist deaths split among opponents. Time Ghroth for maximum disruption. Ritual every Doom Phase while Blood Sacrificing for Elder Signs.",
    keyMistakes: [
      "Recruiting expensive monsters before establishing gate economy",
      "Forgetting Blood Sacrifice is once per Doom Phase (not once per turn)",
      "Deploying Fungi without a plan — 4 Fungi deployed means Ghroth has max 67% success rate",
      "Fighting early instead of turtling — Black Goat wins by economy, not combat",
      "Ignoring Ghroth timing — it's political and should be threatened before used",
    ],
    rulesReminders: [
      "Blood Sacrifice: once per Doom Phase. Eliminate 1 of your Cultists → gain 1 Elder Sign.",
      "Ghroth: 2 Power action. Roll d6 ≤ number of areas with your Fungi. On success, enemies eliminate Cultists equal to the roll (divided among themselves; 1 min to decide or you choose).",
      "Fungi (Mi-Go): max 4 in your unit pool. They are your Ghroth enablers.",
      "Fertility Cult (faction ability): you may summon monsters as an unlimited action (still costs Power, but doesn't use your action).",
      "Thousand Young: if Shub is in play, Ghouls/Fungi/Dark Young each cost 1 less Power to summon (Ghouls become free).",
    ],
  },

  "crawling-chaos": {
    factionId: "crawling-chaos",
    spellbookPath: {
      priority: [
        "Madness",
        "Thousand Forms",
        "Emissary of the Outer Gods",
        "Nyarlathotep Rises",
        "Infiltration",
        "Avatar of Nyarlathotep",
      ],
      notes:
        "Emissary + Thousand Forms first — Emissary protects Nyarlathotep (kills → pains), Thousand Forms drains enemy Power. Madness is your biggest political weapon but any order works. Pay 4 and Pay 6 spellbook costs early before the late-game squeeze.",
    },
    opening:
      "Start in South Asia. Turn 1: move an Acolyte out (Flight lets you reach remote areas), build a 2nd gate (3 Power), summon monsters with remaining Power. Push for 2-3 gates quickly. All your units have Flight — they can fly over 2 areas with enemies, making nowhere safe. Plan your economy around a Turn 2 Nyarlathotep awakening (10 Power) — he's your entire strategy.",
    earlyGame:
      "Once Madness is online, you control every battle on the map: Pain results send enemy units where YOU choose, even in fights you're not in. This is devastating political leverage. Thousand Forms (0-cost action: roll d6, enemies lose that much Power) funds your expansion. Take Emissary to protect Nyarlathotep — kills become pains unless an enemy GOO is present. You are a disruption faction — make other players' plans impossible.",
    midGame:
      "Recruit Flying Polyps (2 cost, 1 combat) for Invisibility — they exempt enemy units from battle, making your gates very hard to take. Nyarlathotep with Flight can strike anywhere on the map. His combat dice = your spellbooks + enemy's spellbooks (up to 12 dice late game). Identify the biggest threat and use Madness to scatter their forces. You don't need to kill — just displace.",
    lateGame:
      "Your win condition is Harbinger: fight enemy GOOs, pain/kill them, and choose 2 Elder Signs per GOO instead of Power. Chain unlimited combat battles across 2-3 GOOs for a burst of 4-6 Elder Signs. Hunting Horrors (3 cost, 2 combat) teleport into any battle via Seek and Destroy for free. Madness lets you pain yourself into adjacent areas to chain fights. Time your Harbinger burst from ~20 Doom to close out the game.",
    keyMistakes: [
      "Awakening Nyarlathotep too early without gate economy to support him",
      "Using Madness defensively instead of offensively — scatter enemy units into each other",
      "Forgetting to use Thousand Forms every Action Phase — it's a free action that drains enemy Power",
      "Resummoning Hunting Horrors unnecessarily — at 3 Power each, assign kills to cheaper units first",
    ],
    rulesReminders: [
      "Madness: after Pain results in ANY battle (even ones you're not in), YOU choose where all pained units retreat to.",
      "Thousand Forms: 0-cost action (once per Action Phase). Roll d6 — enemies lose that much Power among them. If they can't agree, you gain it instead.",
      "Emissary of the Outer Gods: post-battle, a Kill on Nyarlathotep becomes Pain instead (unless enemy GOO is in the battle).",
      "Harbinger: post-battle, if enemy GOO is pained/killed, gain Power = half their awaken cost OR choose 2 Elder Signs per GOO instead.",
      "Nightgaunts: 1 Power, 0 combat dice, max 3. Cheap bodies to shield Nyarlathotep and fuel Abduct.",
    ],
  },

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
        "Awaken King in Yellow first (4 Power) for Screaming Dead. Awaken Hastur next and ALWAYS take Third Eye — it halves Desecrate cost and adds Elder Signs. Passion early for Power refund on Cultist deaths. Shriek of the Byakhee enables the Hastur hit squad. He Who Is Not To Be Named and Zingaya are situational — pick based on your opponents.",
    },
    opening:
      "Start in Europe. Turn 1: move a Cultist to Arabia, awaken King in Yellow there (4 Power), build a gate (3 Power). The King has 0 combat — protect him with Undead (1 Power each, max 6). DON'T Desecrate yet — wait for Third Eye (requires Hastur). Turn 2: awaken Hastur (10 Power) at the King's gate, take Third Eye. NOW your engine is online: Screaming Dead moves King + all Undead for 1 Power, then Desecrate as your bonus action.",
    earlyGame:
      "With Third Eye online, every successful Desecrate costs 1 Power and earns an Elder Sign — your primary win condition. Recruit Byakhee (2 cost, scaling combat) for mobile support — use Shriek of the Byakhee to teleport them anywhere. Passion (gain 1 Power when your Cultists are killed/captured) makes your gates deceptively hard to take — opponents pay you for attacking. Spread Cultists to maximize Passion triggers.",
    midGame:
      "Awaken Hastur (10 cost, combat = Ritual cost) when you have the economy. Take Third Eye immediately — it's your win condition. With Hastur's Vengeance, YOU choose which enemy units take combat results, making him a terrifying deterrent. Use He Who Is Not To Be Named to teleport Hastur to any area with a Cultist, then Shriek of the Byakhee as your bonus action for instant reinforcements. Political leverage is key — threaten Desecrate to extort agreements.",
    lateGame:
      "Yellow Sign wins through Elder Sign volume — 6-12 Elder Signs from Desecrate + Third Eye can account for half your Doom. Ritual every Doom Phase you can. Use Passion's Power refund to stay economically viable even under attack. The Hastur hit squad (He Who Is Not To Be Named + Shriek + Vengeance) can snipe enemy GOOs to remove threats. Push for 30 Doom — once opponents realize your Elder Sign pile is massive, they'll gang up.",
    keyMistakes: [
      "Desecrating before Third Eye is online — without it, Desecrate costs 2 Power and gives no Elder Signs",
      "Holding off King in Yellow — place him early even though he has 0 combat",
      "Leaving the King exposed without an Undead/Byakhee escort — he has 0 combat and will die",
      "Spreading Undead too thin — you need more units in an area than your die roll for Desecrate to succeed",
      "Not taking Third Eye when awakening Hastur — it's your win condition, take it every time",
    ],
    rulesReminders: [
      "Desecrate: 2 Power (1 with Third Eye). Roll d6 ≤ your unit count in the area to succeed. On success, place token + gain Elder Sign (with Third Eye). Win or lose, place a free unit costing ≤2.",
      "King in Yellow: 4 cost, 0 combat. Fragile — protect him with Undead/Byakhee. Screaming Dead moves him + all Undead for 1 Power, then grants a bonus action.",
      "Passion: when your Cultists are eliminated by an enemy (kills, captures), gain 1 Power total. Spread Cultists across areas to maximize triggers.",
      "Hastur: 10 cost. Combat dice = current Ritual of Annihilation cost (starts ~5, increases). Vengeance: you choose which enemy units receive combat results.",
      "Third Eye: if Hastur is in play, Desecrate costs 1 instead of 2 AND each success gains an Elder Sign. This is your win condition — get it ASAP.",
    ],
  },
};
