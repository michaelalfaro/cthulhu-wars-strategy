# Monsters & Terrors Content Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fill the three empty stub pages in `content/guide/03-monsters/` with rich strategy content extracted from podcast transcripts, matching the style of the completed faction guides.

**Architecture:** Each page is an MDX file with YAML frontmatter. Content is extracted from podcast transcript files and written in the same format as `content/guide/02-factions/black-goat.mdx` (the canonical reference). No code changes except a one-line nav title update.

**Tech Stack:** MDX, Next.js App Router, existing guide content pipeline (no new components needed)

---

## Reference File

Before starting any task, read this file to understand the expected MDX style:
- `content/guide/02-factions/black-goat.mdx` — canonical content format

Key conventions:
- YAML frontmatter: `title`, `description` fields (no `faction` or `color` needed for these pages)
- `##` for major sections, `###` for individual unit/GOO profiles
- Bold stat labels: `**Cost:**`, `**Combat:**`, `**Ability:**`, `**Strategy:**`
- Prose paragraphs (not just bullet lists) for strategy sections
- Source references section at the bottom

---

## Task 1: Fill `great-old-ones.mdx` — GOO Pack 1

**Files:**
- Read: `content/transcripts/14-goo-pack-1.md` (full file)
- Modify: `content/guide/03-monsters/great-old-ones.mdx`

**What to build:**

Replace the stub with:
1. A frontmatter block
2. An `## Overview` section explaining how independent GOOs work
3. A `## GOO Pack 1` section with a profile for each of the 5 GOOs covered in episode 14

**Step 1: Read the transcript**

Read `content/transcripts/14-goo-pack-1.md` in full. For each GOO discussed, extract:
- Name and epithet
- Awakening cost (Power amount and any prerequisites)
- Combat value
- Special ability (name and effect)
- Spellbook requirement (what condition unlocks the spellbook)
- Spellbook ability (name and effect)
- Any strategy tips the host mentions

**Step 2: Write the frontmatter and overview**

```mdx
---
title: "Great Old Ones"
description: "Strategy guide for the independent Great Old Ones available as neutral expansions."
---

# Great Old Ones

## Overview

Independent Great Old Ones are neutral expansion units that any player can
purchase during the Action Phase. Unlike neutral monsters (which are bought
during the Doom Phase), independent GOOs cost Power and are acquired as an
action — most of them require your own Great Old One to be present at one
of your controlled Gates before you can awaken them.

Each independent GOO comes with a loyalty card. When you purchase an
independent GOO, you place a loyalty token on your faction card. The GOO
follows your orders just like your own Great Old One, and you unlock its
Spellbook by meeting its specific requirement. If the GOO is killed, you
lose the loyalty card, the Spellbook falls off, and another player can
purchase the GOO from the pool.

Independent GOOs are a high-commitment, high-reward investment. They
dramatically expand your strategic options — but they can be stolen.
```

**Step 3: Write the GOO Pack 1 section**

After the Overview, add:

```mdx
## GOO Pack 1

*Covered in Episode 14: "Stop Faugn With My Elder Signs"*

[One profile per GOO using this template:]

### [Name] — [Epithet]
**Awaken cost:** X Power (your GOO must be present at a controlled Gate)
**Combat:** Y
**[Ability name]:** [Effect description]
**Spellbook requirement:** [Condition]
**Spellbook:** [Name]: [Effect]

[2–4 sentences of strategy. What makes this GOO strong? What factions benefit most? Any notable combos or warnings?]
```

**Step 4: Write the file**

Write the complete `content/guide/03-monsters/great-old-ones.mdx` with frontmatter + Overview + GOO Pack 1 section only. Leave a TODO comment at the bottom:

```mdx
{/* TODO: Add GOO Pack 2 and Pack 4 in next task */}
```

**Step 5: Verify it renders**

Run the dev server (`npm run dev`) and navigate to `/guide/monsters/great-old-ones`. Confirm the page renders without errors and the content displays correctly.

**Step 6: Commit**

```bash
git add content/guide/03-monsters/great-old-ones.mdx
git commit -m "content: add Great Old Ones overview and GOO Pack 1 profiles"
```

---

## Task 2: Extend `great-old-ones.mdx` — Pack 2, Pack 4, Tips, References

**Files:**
- Read: `content/transcripts/16-goo-pack-2.md` (full file)
- Read: `content/transcripts/26-goo-pack-4.md` (full file)
- Modify: `content/guide/03-monsters/great-old-ones.mdx`

**What to build:**

Extend the file from Task 1 with:
1. `## GOO Pack 2` section (4 GOOs from Ep 16)
2. `## GOO Pack 4` section (3 GOOs from Ep 26)
3. `## GOO Pack 3` stub note
4. `## General Tips` section
5. `## Source References` section

**Step 1: Read both transcripts**

Read `content/transcripts/16-goo-pack-2.md` and `content/transcripts/26-goo-pack-4.md` in full. Extract the same data points as Task 1 for each GOO.

**Step 2: Write the Pack 2 section**

```mdx
## GOO Pack 2

*Covered in Episode 16: "Weaving a Worldwide Web"*

[One profile per GOO, same template as Pack 1]
```

The first GOO is Atlachnatcha (The Spinner in Darkness). Its spellbook, Cosmic Web, is an alternate win condition: zero-cost action to immediately win the game if web tokens are in 6 different areas. This is a major note to include.

**Step 3: Write the Pack 4 section**

```mdx
## GOO Pack 4

*Covered in Episode 26: "Seeing Double"*

[One profile per GOO, same template]
```

**Step 4: Write the Pack 3 stub note**

```mdx
## GOO Pack 3

*The Opening the Way podcast did not produce an episode covering GOO Pack 3.
For profiles and strategy on the Pack 3 GOOs, see the
[BoardGameGeek Cthulhu Wars strategy forum](https://boardgamegeek.com/boardgame/139976/cthulhu-wars/forums/72).*
```

**Step 5: Write the General Tips section**

Based on the host's commentary across the transcripts, include 3–5 practical tips that apply to independent GOOs in general (e.g., protecting the GOO since losing it costs you the spellbook, timing the purchase correctly, the risk/reward tradeoff of high-cost GOOs).

**Step 6: Write the Source References section**

```mdx
## Source References

*Primary sources:*
- *Episode 14 — "Stop Faugn With My Elder Signs" (Opening the Way podcast, May 1, 2023)*
- *Episode 16 — "Weaving a Worldwide Web" (Opening the Way podcast, June 2, 2023)*
- *Episode 26 — "Seeing Double" (Opening the Way podcast, October 1, 2023)*
```

**Step 7: Remove the TODO comment and write the final file**

Replace the full `content/guide/03-monsters/great-old-ones.mdx` with the complete content (Overview + Pack 1 + Pack 2 + Pack 4 + Pack 3 note + Tips + References).

**Step 8: Verify it renders**

Navigate to `/guide/monsters/great-old-ones` and confirm all sections display correctly.

**Step 9: Commit**

```bash
git add content/guide/03-monsters/great-old-ones.mdx
git commit -m "content: complete Great Old Ones page with Pack 2, Pack 4, tips"
```

---

## Task 3: Fill `by-faction.mdx` — Neutral Monsters

**Files:**
- Read: `content/transcripts/17-dreamlands-surface-monsters.md` (full file — already read, notes below)
- Read: `content/transcripts/18-underworld-monsters.md` (full file — already read, notes below)
- Modify: `content/guide/03-monsters/by-faction.mdx`
- Modify: `src/lib/navigation.ts` (title update only)

**What to build:**

Replace the stub with a full Neutral Monsters page covering the 6 Dreamlands neutral monsters (3 surface, 3 underworld). Also update the nav title from "Monsters by Faction" to "Neutral Monsters".

**Key content already extracted (supplement with full transcript read):**

Surface monsters (Ep 17):
- **Nori** — 3 Power, 2 combat. Grotto's ability: 2 Nori on map = +1 Doom/phase, 3 Nori = +2 Doom/phase. Keep safe. Pay for themselves passively.
- **Moonbeasts** — 2 Power, 0 combat. Blasphemous Obeisance: place on an enemy spellbook to block it. Enemy pays 1 Doom to remove. Stackable on the same book. Powerful disruption.
- **Shantaks** — 2 Power, 2 combat. Horber Steed: move to ANY area on the map (ignoring adjacency), carry 1 Cultist for free. Top-tier gate-stealing unit.

Underworld monsters (Ep 18):
- **Ghasts** — 2 Power, 0 combat. Hordling: spend 2 Power → ALL Ghasts in pool placed at any gates immediately. Meat shields. Exceptional with Great Cthulhu's Absorb.
- **Gugs** — 1 Power, 3 combat. Clumsy: cannot capture Cultists. Simple, affordable combat filler. Best value per Power for raw dice.
- **Lang Spiders** — 2 Power, 1 combat. Bloodthirst: each Spider in a battle can convert 2 pain results to 1 kill. Best of the three underworld monsters.

**Step 1: Read both transcripts fully**

Read `content/transcripts/17-dreamlands-surface-monsters.md` and `content/transcripts/18-underworld-monsters.md` in full. Supplement the key points above with any additional strategy notes, faction synergies, or warnings the host mentions.

**Step 2: Write the complete MDX file**

```mdx
---
title: "Neutral Monsters"
description: "Strategy guide for the neutral expansion monsters from the Dreamlands expansion."
---

# Neutral Monsters

## Overview

Neutral monsters are purchased during the **Doom Phase** (not the Action Phase)
using Power. Any player can buy them — there is no loyalty card requirement and
no need to have your own Great Old One present. They go directly to the board
when purchased.

This page covers the neutral monsters from the Dreamlands expansion: three
surface-world creatures (Nori, Moonbeasts, and Shantaks) and three underworld
creatures (Ghasts, Gugs, and Lang Spiders).

## Dreamlands Surface Monsters

*Covered in Episode 17: "[episode title]"*

### Nori
**Cost:** 3 Power (purchased during Doom Phase)
**Combat:** 2
**Grotto's:** [exact ability text]

[2–4 sentences of strategy]

### Moonbeasts
...

### Shantaks
...

## Dreamlands Underworld Monsters

*Covered in Episode 18: "[episode title]"*

### Ghasts
...

### Gugs
...

### Lang Spiders
...

## Tips & Faction Synergies

[3–5 tips extracted from both episodes — e.g., Shantak gate-stealing timing,
Moonbeast stacking tactics, Ghast + Absorb combo, when NOT to buy neutrals]

## Source References

*Primary sources:*
- *Episode 17 — "[title]" (Opening the Way podcast)*
- *Episode 18 — "[title]" (Opening the Way podcast)*
```

Fill in the episode titles from the transcript frontmatter.

**Step 3: Update the nav title**

In `src/lib/navigation.ts`, find:
```ts
{ title: "Monsters by Faction", href: "/guide/monsters/by-faction" },
```

Change to:
```ts
{ title: "Neutral Monsters", href: "/guide/monsters/by-faction" },
```

**Step 4: Verify it renders**

Navigate to `/guide/monsters/by-faction` and confirm the page displays. Also check that the sidebar nav shows "Neutral Monsters" instead of "Monsters by Faction".

**Step 5: Commit**

```bash
git add content/guide/03-monsters/by-faction.mdx src/lib/navigation.ts
git commit -m "content: add Neutral Monsters page (Ep 17+18), update nav title"
```

---

## Task 4: Fill `terrors.mdx` — Cosmic Terrors

**Files:**
- Read: `content/transcripts/22-cosmic-terrors.md` (full file — already read, notes below)
- Modify: `content/guide/03-monsters/terrors.mdx`

**What to build:**

Replace the stub with a full Cosmic Terrors page covering the 3 Terror units from Ep 22.

**Key content already extracted (supplement with full transcript read):**

- **Great Race of Yith** — 4 Power, 3 combat. Possession: captures units ignoring GOO protection AND Ferox; captured unit returns double Power. Mobile factions love it. Strong value engine.
- **Dhole** — 4 Power, 5 combat. Planetary Destruction: when killed, owner earns 2 Elder Signs; the player who killed it gains 2 Doom OR 2 Power. Pays for itself multiple times if acquired early.
- **Qwakil Utaus (Treader of Dust)** — 4 Power, 1 combat. Dust to Dust: for each enemy unit killed in a battle involving Qwakil, that enemy must permanently remove one of their own units OR give you an Elder Sign. Needs combat support to be effective.

**Step 1: Read the full transcript**

Read `content/transcripts/22-cosmic-terrors.md` in full. Extract:
- Exact ability text for each Terror
- The episode's discussion of when each Terror is strong vs. weak
- Any specific faction synergies mentioned
- Notes about the Terrors rule (immune to monster-targeting spellbooks)

**Step 2: Write the complete MDX file**

```mdx
---
title: "Terrors"
description: "Strategy guide for the Cosmic Terrors neutral expansion units."
---

# Terrors

## Overview

Terrors are a special category of neutral unit from the Cosmic Terrors expansion.
Unlike regular neutral monsters (bought with Power during the Doom Phase), Terrors
cost **2 Doom + 2 Power** — you pay with both resources. This makes them a
significant investment.

Terrors have a key defensive property: they are **immune to spellbook abilities
that target monsters specifically** (such as Devour, Flying Polyps, and similar
monster-removal effects). This immunity makes them much stickier on the board
than regular monsters, dramatically changing the threat assessment for opponents
who rely on those spellbooks.

## Cosmic Terrors

*Covered in Episode 22: "[episode title]"*

### Great Race of Yith
**Cost:** 2 Doom + 2 Power (Doom Phase)
**Combat:** 3
**Possession:** [exact ability text]

[2–4 sentences of strategy]

### Dhole
**Cost:** 2 Doom + 2 Power (Doom Phase)
**Combat:** 5
**Planetary Destruction:** [exact ability text]

[2–4 sentences of strategy — include the "pays for itself" angle]

### Qwakil Utaus (Treader of Dust)
**Cost:** 2 Doom + 2 Power (Doom Phase)
**Combat:** 1
**Dust to Dust:** [exact ability text]

[2–4 sentences — include the "needs dice support" caveat]

## Tips & Synergies

[3–5 tips from the episode — e.g., Dhole timing, Yith with mobile factions,
when the Doom cost makes Terrors not worth it]

## Source References

*Primary source: Episode 22 — "[title]" (Opening the Way podcast)*
```

**Step 3: Verify it renders**

Navigate to `/guide/monsters/terrors` and confirm the page displays without errors.

**Step 4: Commit**

```bash
git add content/guide/03-monsters/terrors.mdx
git commit -m "content: add Cosmic Terrors page (Ep 22)"
```
