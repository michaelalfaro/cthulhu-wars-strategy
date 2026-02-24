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
      "Devour: eliminates 1 enemy unit before combat dice are rolled. Attacker chooses which unit.",
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
      "Ghroth is your finisher. At 4 Fungi, you need to roll 4 or less on a d6 (67% success). On success, every player eliminates 1 Cultist per area — devastating for Acolyte-heavy factions. Time Ghroth for maximum disruption: ideally when opponents have spread their Cultists thin across many areas. Ritual every Doom Phase while Blood Sacrificing for Elder Signs.",
    keyMistakes: [
      "Recruiting expensive monsters before establishing gate economy",
      "Forgetting Blood Sacrifice is once per Doom Phase (not once per turn)",
      "Deploying Fungi without a plan — 4 Fungi deployed means Ghroth has max 67% success rate",
      "Fighting early instead of turtling — Black Goat wins by economy, not combat",
      "Ignoring Ghroth timing — it's political and should be threatened before used",
    ],
    rulesReminders: [
      "Blood Sacrifice: once per Doom Phase. Eliminate 1 of your Cultists → gain 1 Elder Sign.",
      "Ghroth: 2 Power action. Roll d6 ≤ number of areas with your Fungi. On success, all players eliminate 1 Cultist per area.",
      "Fungi (Mi-Go): max 4 in your unit pool. They are your Ghroth enablers.",
      "Fertility Cult: during Gather Power, gain 1 Power per Cultist beyond the first at each gate.",
      "Thousand Young: when you have 2+ Dark Young in an area, other players' units there cannot move (except Fly).",
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
        "Madness first — it defines how opponents play against you. Thousand Forms for Power economy. Emissary for flexible recruitment. If opponents cluster together, consider Nyarlathotep Rises earlier to exploit mobility. Avatar is a late luxury.",
    },
    opening:
      "Start anywhere with 3+ adjacent areas for quick expansion. Turn 1: recruit 2 Nightgaunts (1 Power each) and spread them to adjacent areas for gate control. Nightgaunts are cheap and mobile — use them as forward scouts and gate guards. Push for 3 gates quickly. Don't worry about expensive monsters yet. Your spellbook unlock for Madness requires Nyarlathotep on the map, so plan your economy around a turn 2-3 awakening (10 Power).",
    earlyGame:
      "Once Madness is online, your combat becomes terrifying: Pain results move enemy units to areas you choose, not the defender. This is effectively a teleport-to-danger for your enemies. Use Nightgaunts for cheap combat to trigger Madness. Thousand Forms (gain 1 Power per Nightgaunt on the map during Gather Power) funds your expansion. You are a disruption faction — make other players' plans impossible.",
    midGame:
      "Recruit Flying Polyps (2 cost, 2 combat) for midgame combat punch. Use Emissary to recruit monsters at a discount or in unusual locations. Nyarlathotep with Flight can strike anywhere on the map in a single action. Identify the biggest threat at the table and use Madness to scatter their forces. You don't need to kill — just displace.",
    lateGame:
      "Your doom generation is slower than Black Goat or Yellow Sign, so you need to compensate with Elder Signs from Ritual and efficient gate control. Use Hunting Horrors (3 cost, 3 combat) as closers. Madness continues to disrupt enemy positioning in the final rounds. Infiltration can steal a critical gate at the last moment. Time your Ritual of Annihilation carefully — you need every Power point.",
    keyMistakes: [
      "Awakening Nyarlathotep too early without gate economy to support him",
      "Using Madness defensively instead of offensively — scatter enemy units into each other",
      "Forgetting Thousand Forms Power bonus — always count your Nightgaunts during Gather",
      "Over-investing in Hunting Horrors — they're expensive for their combat value",
    ],
    rulesReminders: [
      "Madness: when enemies take Pain results in battle with you, YOU choose where their units go.",
      "Thousand Forms: gain 1 Power per Nightgaunt on the map during Gather Power phase.",
      "Emissary: recruit a Monster at -1 cost in any area with your unit (not just gates).",
      "Nyarlathotep Rises: Nyarlathotep can move to any area on the map as a single move action.",
      "Nightgaunts cost 1 Power, 1 combat die. Max 3 in pool.",
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
        "Desecrate first — it's your gate-stealing engine and is dirt cheap. The King in Yellow is free to place and unlocks your faction's area control. Passion turns every combat into Doom. Gift of the King gives 3 free Doom but comes late. Cloud Memory and Shriek are situational — pick based on your opponents.",
    },
    opening:
      "Start anywhere with high gate density — you want to Desecrate quickly. Turn 1: recruit 2-3 Undead (1 Power, 1 combat) and spread to adjacent areas. Undead are your workhorse unit — cheap, disposable, and plentiful (max 6). Place the King in Yellow (4 cost, 0 combat) as soon as possible — he's a spellbook requirement and his area-control abilities define your faction. Push for 3 gates via Desecrate: move an Undead to an enemy gate, Desecrate to flip it.",
    earlyGame:
      "With Desecrate online, you can steal weakly-defended gates for just 1 Power. This makes you the premier land-grab faction. Recruit Byakhee (2 cost, 2 combat) for mobile combat support — they have Flight. Your Doom generation starts slow but ramps: spellbook conditions award 3 free Doom at specific milestones. Use Passion (gain 1 Doom per battle you participate in) to turn every fight into Doom fuel.",
    midGame:
      "Awaken Hastur (10 cost, 6 combat) when you have the economy. Hastur is a wrecking ball — 6 combat dice plus any spellbook bonuses. With Passion active, every battle Hastur fights generates Doom. Shriek can force enemy units to flee before combat, weakening defensive positions. Build toward your 3 free Doom spellbook milestones. Political leverage is key — threaten Desecrate to extort agreements from weaker players.",
    lateGame:
      "Yellow Sign is the fastest Doom rusher in the game. Gift of the King awards 3 free Doom. Combined with 4+ gates, Passion from combat, and Ritual of Annihilation, you can jump 8-10 Doom in a single round. Cloud Memory protects your gates from Dreams and other steal effects. Push for 30 Doom as fast as possible — once opponents realize you're close, they'll gang up.",
    keyMistakes: [
      "Ignoring Desecrate — it's your best Power-to-Doom converter through cheap gate theft",
      "Holding off King in Yellow — place him early even though he has 0 combat",
      "Fighting without Passion online — battles without Doom payoff waste your Power",
      "Spreading Undead too thin — they need to be in groups to Desecrate effectively",
      "Not tracking your Doom milestones for free Doom awards",
    ],
    rulesReminders: [
      "Desecrate: 1 Power. Place a Desecration token in an area with your Undead. If enemies leave, you gain the Gate.",
      "King in Yellow: 4 cost, 0 combat. Cannot be killed — only Pained (retreated). His area presence enables multiple spellbooks.",
      "Passion: gain 1 Doom each time you are involved in a battle (attacking or defending).",
      "Hastur: 10 cost, 6 combat. Standard GOO stats. Awakening requires King in Yellow on the map.",
      "Undead: max 6. They are recruitable in any area with your units, not just gates.",
    ],
  },
};
