// src/data/unique-high-priests.ts

export interface UniqueHighPriest {
  id: string;
  name: string;
  abilityName: string;
  abilityText: string; // exact game text
  timing: "ongoing" | "pre-battle" | "post-battle";
  tacticalSummary: string; // 1-2 sentence coaching-friendly summary
  tags: string[];
}

export const UNIQUE_HIGH_PRIESTS: UniqueHighPriest[] = [
  {
    id: "asenath-waite",
    name: "Asenath Waite",
    abilityName: "The Thing from Beyond",
    abilityText:
      "After any player's Action, choose any enemy Monster or Cultist on the Map and replace it with one of your own Units of 3 or less cost (except Asenath). Then, Eliminate Asenath.",
    timing: "ongoing",
    tacticalSummary:
      "Swap an enemy unit for one of yours. Best used to steal a key position or remove a threatening monster. One-shot.",
    tags: ["unit-swap", "offensive", "one-shot", "flexible-timing"],
  },
  {
    id: "crawford-tillinghast",
    name: "Crawford Tillinghast",
    abilityName: "The Ultra-Violet",
    abilityText:
      "Before any Battle (even if Crawford Tillinghast is not involved), you may Eliminate Crawford Tillinghast and place up to 3 Power cost worth of your Monsters and Cultists from your Pool to the Battle Area, off to one side. These Units participate in the Battle, and can use any Pre-Battle or Post-Battle abilities they may have. But, after the entire Battle is resolved, Eliminate any of these 'extra' Units which survived.",
    timing: "pre-battle",
    tacticalSummary:
      "Drop temporary reinforcements into any battle on the board. Units fight then die regardless. Surprise combat swing.",
    tags: ["combat-reinforcement", "any-battle", "one-shot", "surprise"],
  },
  {
    id: "ermengarde-stubbs",
    name: "Ermengarde Stubbs",
    abilityName: "A Simple Rustic Maid",
    abilityText:
      "Any player (including you) who declares a Battle in Ermengarde Stubbs's Area immediately loses 1 Doom.",
    timing: "ongoing",
    tacticalSummary:
      "Area denial — anyone attacking her location loses 1 Doom. Park her on a key gate to deter aggression. Persistent deterrent.",
    tags: ["area-denial", "deterrent", "doom-penalty", "persistent"],
  },
  {
    id: "herbert-west",
    name: "Herbert West",
    abilityName: "The Reanimator Serum",
    abilityText:
      "After any player's Action, you may Eliminate Herbert West and place up to 3 Acolyte Cultists from your Pool into the Area Herbert West was removed from.",
    timing: "ongoing",
    tacticalSummary:
      "Sacrifice to spawn 3 Acolytes in his area. Great for rapid gate control or recovering from losses. One-shot army rebuild.",
    tags: ["acolyte-spawn", "recovery", "one-shot", "gate-control"],
  },
  {
    id: "keziah-mason",
    name: "Keziah Mason",
    abilityName: "Daemon Heroine",
    abilityText:
      "If Keziah Mason is assigned a Kill or Pain result, add 2 Kills or 2 Pains, respectively, to the total scored against the opponent.",
    timing: "post-battle",
    tacticalSummary:
      "Damage multiplier — when she takes a hit, doubles it back at the enemy. Put her in battles you expect to take casualties in.",
    tags: ["damage-multiplier", "combat-boost", "retaliation", "persistent"],
  },
  {
    id: "lavinia-whateley",
    name: "Lavinia Whateley",
    abilityName: "The Bride",
    abilityText:
      "When you Awaken a Great Old One, you can choose to Eliminate Lavinia Whateley. If you do so, your Great Old One costs 3 Power less to Awaken.",
    timing: "ongoing",
    tacticalSummary:
      "Save 3 Power on GOO awakening. Hold her until you're ready to awaken, then sacrifice. Best with expensive GOOs.",
    tags: ["cost-reduction", "goo-awakening", "one-shot", "power-economy"],
  },
  {
    id: "joseph-curwen",
    name: "Joseph Curwen",
    abilityName: "Beyond the Spheres",
    abilityText:
      "After any player's Action, you may Eliminate Curwen and either remove your Controlled Gate (but not its Controller) from anywhere on the Map, or place a new Gate in any Area in which you have a Unit.",
    timing: "ongoing",
    tacticalSummary:
      "Gate mobility — move a gate or create one anywhere you have a unit. Enables surprise gate placement or escape from danger.",
    tags: ["gate-mobility", "gate-creation", "one-shot", "repositioning"],
  },
  {
    id: "pitpipo",
    name: "Pitpipo",
    abilityName: "The Pit of Despair",
    abilityText:
      "When you take a Kill in Battle, you can assign it to Pitpipo, even if he was not involved in the Battle.",
    timing: "post-battle",
    tacticalSummary:
      "Remote casualty absorber — takes Kills from any of your battles anywhere on the map. Protects key units from elimination.",
    tags: ["casualty-absorber", "remote-protection", "persistent", "defensive"],
  },
];

export const UNIQUE_HIGH_PRIEST_MAP = Object.fromEntries(
  UNIQUE_HIGH_PRIESTS.map((hp) => [hp.id, hp])
);
