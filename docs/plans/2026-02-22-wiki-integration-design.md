# Wiki Integration Design — Spelling Fixes + New Content

**Date:** 2026-02-22
**Source:** cthulhuwars.fandom.com/wiki (CC-BY-SA)
**Approach:** Research-first, then parallel subagent execution

---

## Task 1: Spelling & Stat Corrections

Find-and-replace across three files. No structural changes.

### `great-old-ones.mdx`

| Current | Corrected | Notes |
|---|---|---|
| Atlachnatcha | Atlach-Nacha | Section title + all body text |
| Gatanathoa | Ghatanothoa | Section title + all body text |
| Beatus | Byatis | Section title, subtitle, all body text |
| Nyagtha | Nyogtha | Section title + all body text |
| Tulzcha | Tulzscha | Section title + all body text |
| Execration of Mew | Execration of Mu | Spellbook name |
| Spinnerettes | Spinnerets | Ability name |
| Bokrug awaken cost "6 Power" | 4 Power | Cost line — wiki card text says 4 |

### `terrors.mdx`

| Current | Corrected | Notes |
|---|---|---|
| Qwakil Utaus | Quachil Uttaus | Section title + all body text (3+ occurrences) |

### `by-faction.mdx`

| Current | Corrected | Notes |
|---|---|---|
| Nori | Gnorri | Section title + all body text + tips (many occurrences) |
| Grotto's | Grottos | Ability name (all occurrences) |
| Lang Spider | Leng Spider | Section title + all body text + tips (many occurrences) |
| Horber Steed | Horror Steed | Ability name |

---

## Task 2: Gobogeg Profile (GOO Pack 3)

Replace the two-line stub in `great-old-ones.mdx` with a full profile.

### Card Text (from wiki)

- **Awaken cost:** 0 Power. Prereq: at least one player has 6 Faction Spellbooks; your controlled Gate is in an area with your Great Old One.
- **Combat:** 0 dice. If Gobogeg is Killed or Pained, all units in the area are Pained (regardless of faction).
- **Ability — Book of Law:** Ongoing. While Gobogeg is in play, whenever a Great Old One is Awakened, the owner receives 6 Power after the Awakening.
- **Spellbook requirement:** Someone wins the game (need not be you).
- **Spellbook — Book of Chaos:** Post-game. If the game ends while you control Gobogeg, YOU get to pick the Factions, Expansions, Map, Neutral Monsters, and Independent Great Old Ones for the next game.

### Strategy Direction

- Free to awaken but has a late-game prereq (someone needs 6 spellbooks).
- Book of Law creates a "GOO awakening chain" incentive: each indie GOO awakened nets +2 Power (most cost 4, so 6-4=2 profit).
- 0 combat + AoE pain on death/pain makes Gobogeg a deterrent piece, not a fighter.
- Book of Chaos is a meta-game reward — no in-game Doom value, but social/competitive leverage.
- Wiki strategy tip: awaken Gobogeg then race to awaken as many indie GOOs as possible.
- Source attribution required (no podcast episode).

---

## Task 3: Extended Neutral Monsters (`by-faction.mdx`)

Add new `##` sections after existing Dreamlands content, organized by expansion.

### Opener of the Way (Azathoth) Expansion Neutrals

**Dimensional Shambler** — Monster, 3x, Cost 2, Combat 2
- Walk Between Worlds (Ongoing): When summoned, place on your Faction Card. After any Action (by any player), place one or more from your Faction Card in any Area.
- Strategy: instant-deployment ambush unit; appears anywhere after any action.

**Elder Thing** — Monster, 3x, Cost 2, Combat 2
- Mind Control: If an Elder Thing shares an Area with an enemy GOO, that GOO may not use its Special Ability.
- Strategy: targeted GOO shutdown; forces opponents to clear them before using abilities.

**Star Vampire** — Monster, 3x, Cost 2, Combat 1
- Vampirism (Battle): Roll Star Vampire's dice separately. Each Pain drains 1 Power from enemy. Each Kill drains 1 Doom from enemy.
- Strategy: economic warfare unit; damages opponent's resources even on low rolls.

**Servitor of the Outer Gods** — Monster, 3x, Cost 1, Combat -1
- Adulation (Ongoing): The owner may not Summon any Monsters except Servitors if any Servitors are still in their pool.
- Loyalty card is given to another player (offensive purchase).
- Strategy: sabotage unit; forces opponent to waste actions summoning useless -1 combat monsters.

### Ramsey Campbell Horrors 1 Neutrals

**Insects from Shaggai** — Monster, 3x, Cost 2, Combat 0
- Mind Parasite (Ongoing): Grants player control over enemy Acolyte Cultists sharing an area with Insects for movement and combat purposes.
- Strategy: Cultist hijacking; turn enemy Cultists into your own combat dice and movement targets.

### Ramsey Campbell Horrors 2 Neutrals

**Satyr** — Monster, 3x, Cost 2, Combat 1
- Fecund (Ongoing): Each time you Summon a Satyr, also place an Acolyte Cultist from your Pool in the same Area.
- Strategy: free Cultist generation on each summon; excellent for factions that burn through Cultists.

### Beyond Time and Space Neutrals

**Voonith** — Monster, 2x, Cost 3, Combat 1
- Vicious (Post-Battle): For each Kill scored fewer than the number of Vooniths in the Battle, add 1 Kill.
- Strategy: guaranteed kills; 2 Vooniths in a battle guarantee at least 2 kills regardless of dice.

**Wamp** — Monster, 4x, Cost 1, Combat 0
- Loyalty card: choose an enemy to place all 4 Wamps in any Area or Areas without a Gate.
- Strategy: offensive placement on enemy; floods areas with 0-combat bodies that block captures.

### CATaclysm Neutrals

**Giant Blind Albino Penguin** — Monster, 2x, Cost 1, Combat -2
- Laughingstock (Pre-Battle): Move one or more Penguins to the Battle area, even if you are not part of the battle. Choose which side the Penguin fights on.
- Strategy: comedy sabotage; inject -2 combat dice into an opponent's side of a battle you're not even in.

### Something About Cats Neutrals

**Asteroid Cat** — Monster, 2x, Cost 1, Combat 1
- Abandoned to Lusts (Action: Cost 0): If sharing an Area with an enemy with ≤5 Faction Spellbooks, remove Cat from map and place on one of that enemy's empty Spellbook slots.
- Strategy: spellbook denial; blocks an empty slot and influences which spellbook they must take.

**Cat from Mercury** — Monster, 2x, Cost 1, Combat 1
- Needs Affection (Pre-Battle): In a battle with Cat from Mercury, replace your Monsters with Acolyte Cultists from your Pool.
- Strategy: monster-to-Cultist conversion; refill Gate defenders mid-battle.

**Cat from Venus** — Monster, 2x, Cost 1, Combat 1
- Honeymoon (Ongoing): When Cat from Venus Captures a Cultist, gain 1 Power and immediately return the Cultist to the owner's Pool.
- Strategy: Power generation through non-destructive capture; doesn't permanently steal Cultists.

### Yuggoth Map Neutrals

**Slime Mold** — Monster, 6x, Cost 1, Combat 2
- Map-specific: tied to the Slime Sea Overlook Gate on the Yuggoth Map. First Slime Mold placed for free; subsequent cost 1 Power each.
- Strategy: map-dependent; strong on Yuggoth but unavailable on other maps.

---

## Task 4: Extended GOOs + Terrors

### Additional GOOs for `great-old-ones.mdx`

Organized by expansion (not numbered GOO packs — there are only 4 numbered packs).

#### Ramsey Campbell Horrors 1

**Eihort** — GOO, Cost 4, Combat 0
- The Brood: replaces all Acolyte Cultists with Brood tokens upon awakening.
- Spellbook — Unclean Bargain: converts Acolyte Cultists to Brood tokens during Doom Phase.
- Brood tokens: Cost 1, Combat 1, cannot move.

**Gla'aki** — GOO, Cost 4, Combat = number of Acolyte Cultists in your pool
- The Tomb-Herd: earns 1 Power per Acolyte Cultist in pool during Gather Power Phase.
- Spellbook — Green Decay: gain Elder Sign instead of Power when captured Cultists are sacrificed.

#### Ramsey Campbell Horrors 2

**Daoloth** — GOO, Cost 6, Combat 0
- Cosmic Unity (Pre-Battle): In a Battle involving Daoloth, choose one enemy GOO. It rolls no Combat dice.
- Spellbook — Interdimensional (Ongoing): When Daoloth enters an Area without a Gate, immediately place a Gate there. Spellbook requirement: a Great Old One is killed anywhere.

**Y'Golonac** — GOO, Cost 2, Combat 1
- Orifices (Post-Battle): If Y'Golonac is Killed in Battle, select a surviving enemy Terror, Monster, or Cultist and replace it with Y'Golonac.
- Spellbook — The Revelations (Doom Phase): Every player except you gets 1 Elder Sign. Spellbook requirement: receive Y'Golonac through the Orifices ability.

#### Masks of Nyarlathotep

**The Bloated Woman** — GOO, Cost 4, Combat 1
- The Velvet Fan: Captures killed enemy units; their recruitment costs go to this unit's controller.
- Spellbook — Disaster Looms: Gates earn Elder Signs instead of Power.

**The Haunter of the Dark** — GOO, Cost 6, Combat = number of enemy spellbooks earned
- Fly-the-Light: Enemy single kills must target the Haunter.
- Spellbook — The Shining Trapezohedron: Enemies roll for their units; 6s eliminate their own units.

#### Onslaught Three

**Dire Azathoth** — GOO, Cost 10, Combat = 1d6
- Awaken prereq: Control a Gate on an enemy faction's starting area.
- Mindless Destruction: Any Faction battling in Dire Azathoth's Area gains his choice of 1 Doom or 1 Power per unit Killed/Eliminated.
- Spellbook — The Blind Idiot God: Pay 20 Power to immediately win the game. Alternate win condition.

**Dire Cthulhu** — GOO, Cost 6, Combat 3
- Awaken: Gain 1 Elder Sign on awakening.
- Lord and Master (Ongoing): When you Awaken an Independent GOO (except Dire Cthulhu), gain 1 Elder Sign.
- Spellbook — Non-Euclidean (Post-Battle): Flexible assignment of battle results to any faction with units in the area.
- Spellbook requirement: Kill 3 enemy units in a single battle.

#### Something About Cats

**Hagarg Ryonis (Cat from Jupiter)** — Elder God (not Independent GOO), Cost 4, Combat = 3 Pains (rolls no dice)
- Subversion (First Player Phase): Choose a player. If that player performs a Ritual of Annihilation in the Doom Phase, steal 1 Elder Sign they earn.
- Spellbook — Laziness: Force power loss.
- Note: "Elder God" is a distinct unit type from Independent GOOs with potentially different rules.

### Additional Terrors for `terrors.mdx`

#### Masks of Nyarlathotep

**The Shadow Pharaoh** — Terror, Cost 4 Power (2 for Crawling Chaos), Combat 2
- Hebephrenia: Gates cannot be controlled in the Shadow Pharaoh's area; occupying units abandon gates.

#### Something About Cats

**Cat from Neptune** — Terror, Cost 1, Combat 3
- The Final Ritual (Post-Battle): If killed in Battle, you may immediately perform a Ritual of Annihilation.

---

## Exclusions

- **Brood** (RCH1): Faction-specific cultist variant tied to Eihort's mechanics, not a standalone neutral.
- **The Dark Demon** (Masks of Nyarlathotep): Faction-specific cultist, not a neutral monster.
- **Glorantha crossover units**: Boggle, Dragonewts, Duck, Dwarf, Elf, Luathan, Scorpion Man, Slarge, Vadeli Raider, Waertagi Dragon Ship, Lady of Disease, Mad God, Magna Mater, Red Goddess, The Churner, Titan.
- **Planet Apocalypse crossover units**: Argus, Asmod, Baphomet, Chthon, Geryon, Humbaba, Jabootu, Orobas, Procrustes, Pulgasaur, Scylla, Stheno, Stroma, Tarasque, Gryllus, Fiend.
- **Glow variants**: Cosmetic alternate sculpts of faction GOOs.

---

## Source Attribution

Every new section sourced from the wiki gets:
> *Stats and card text sourced from the [Cthulhu Wars Strategy Wiki](https://cthulhuwars.fandom.com/) (CC-BY-SA).*

Added alongside existing podcast source references where applicable.

---

## Implementation

Approach A: Research-first, then parallel subagent dispatch.

1. Save all card text to a research reference doc for subagents.
2. Write implementation plan (4 tasks).
3. Dispatch 4 parallel subagents with spec reviewer + quality reviewer per task.
