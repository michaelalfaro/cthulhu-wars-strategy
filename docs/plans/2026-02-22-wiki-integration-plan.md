# Wiki Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix spelling/stat errors from podcast transcripts and add 25 new unit profiles sourced from the Cthulhu Wars wiki.

**Architecture:** Pure MDX content changes across 3 existing files. No new files, no code changes. Each task modifies content in-place following the established profile format (YAML frontmatter, `##` sections, `###` unit profiles with bold stat labels).

**Tech Stack:** MDX content files in `content/guide/03-monsters/`. Next.js build (`npm run build`) as verification.

**Reference:** All card text and stats are in `docs/plans/2026-02-22-wiki-integration-design.md`. Read that file first — it is the single source of truth for every stat, ability, and spelling correction.

---

### Task 1: Spelling & Stat Corrections

**Files:**
- Modify: `content/guide/03-monsters/great-old-ones.mdx`
- Modify: `content/guide/03-monsters/terrors.mdx`
- Modify: `content/guide/03-monsters/by-faction.mdx`

**Step 1: Fix `great-old-ones.mdx` names and stats**

Read the file. Apply these find-and-replace operations (all occurrences):

| Find | Replace |
|---|---|
| `Atlachnatcha` | `Atlach-Nacha` |
| `Gatanathoa` | `Ghatanothoa` |
| `Beatus` | `Byatis` |
| `Nyagtha` | `Nyogtha` |
| `Tulzcha` | `Tulzscha` |
| `Execration of Mew` | `Execration of Mu` |
| `Spinnerettes` | `Spinnerets` |

Also fix the Bokrug awaken cost. Find the line that says `**Awaken cost:** 6 Power` in the Bokrug section and change `6 Power` to `4 Power`. There is a second reference to `6 Power` in the Bokrug strategy text where the host "self-corrected" — update the strategy paragraph to reflect the correct 4 Power cost consistently.

Also fix the section subtitle for Atlach-Nacha: the subtitle says "The Spinner in Darkness" — keep that.

Also fix the section subtitle for Byatis: change from "The Serpent-Bearded (God of Forgetfulness)" to keep as-is after the name change (the subtitle is correct).

**Step 2: Fix `terrors.mdx` names**

Read the file. Apply find-and-replace (all occurrences):

| Find | Replace |
|---|---|
| `Qwakil Utaus` | `Quachil Uttaus` |

This appears in the `###` heading, the bold cost/ability lines, and the strategy paragraphs. There should be 5+ occurrences.

**Step 3: Fix `by-faction.mdx` names**

Read the file. Apply find-and-replace (all occurrences):

| Find | Replace |
|---|---|
| `Nori` | `Gnorri` |
| `Grotto's` | `Grottos` |
| `Lang Spider` | `Leng Spider` |
| `Horber Steed` | `Horror Steed` |

IMPORTANT: "Nori" appears in section headings, body text, and the Tips section. Replace ALL occurrences. Be careful not to match partial words (e.g. don't change "ignore" — use case-sensitive whole-word matching where possible).

**Step 4: Verify build**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npm run build`
Expected: Build succeeds with no errors.

**Step 5: Commit**

```bash
git add content/guide/03-monsters/great-old-ones.mdx content/guide/03-monsters/terrors.mdx content/guide/03-monsters/by-faction.mdx
git commit -m "fix: correct spelling and stats from wiki card text

Fix phonetic misspellings from podcast transcripts:
- Atlachnatcha→Atlach-Nacha, Gatanathoa→Ghatanothoa
- Beatus→Byatis, Nyagtha→Nyogtha, Tulzcha→Tulzscha
- Qwakil Utaus→Quachil Uttaus
- Nori→Gnorri, Lang Spider→Leng Spider
- Bokrug cost 6→4 Power (matches card text)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Gobogeg Profile (GOO Pack 3)

**Files:**
- Modify: `content/guide/03-monsters/great-old-ones.mdx`

**Step 1: Read the design doc**

Read `docs/plans/2026-02-22-wiki-integration-design.md` — the Task 2 section has all the card text and strategy direction for Gobogeg.

**Step 2: Read `great-old-ones.mdx` and locate the Pack 3 stub**

Find the section that starts with `## GOO Pack 3` (around line 152). It currently contains:
```
## GOO Pack 3

*The Opening the Way podcast did not produce an episode covering GOO Pack 3. For profiles and strategy on the Pack 3 GOOs, see the [BoardGameGeek Cthulhu Wars strategy forum](https://boardgamegeek.com/boardgame/139976/cthulhu-wars/forums/72).*
```

**Step 3: Replace the stub with a full Gobogeg profile**

Replace the stub content (keep the `## GOO Pack 3` heading) with:
- A note that this pack contains a single GOO (Gobogeg) and that no podcast episode covers it.
- A `### Gobogeg — The Moon Lens` profile following the EXACT format of existing profiles:
  - `**Awaken cost:**` line with prereqs
  - `**Combat:**` line
  - `**Book of Law:**` ability description
  - `**Spellbook requirement:**` line
  - `**Spellbook — Book of Chaos:**` description
  - Full strategy paragraph (3-5 sentences minimum) covering:
    - The free awakening with a late-game prereq
    - The GOO awakening chain strategy (most indie GOOs cost 4 Power, Book of Law refunds 6 = net +2 per awakening)
    - The 0 combat + AoE pain mechanic as a deterrent
    - Book of Chaos as a meta-game reward
    - Which factions benefit most
- Source attribution line: `*Stats and card text sourced from the [Cthulhu Wars Strategy Wiki](https://cthulhuwars.fandom.com/) (CC-BY-SA).*`

The strategy paragraph should match the depth and tone of existing profiles (see Abhoth, Cthugha, etc. for reference — 150-250 words, specific tactical advice, faction pairings).

**Step 4: Verify build**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npm run build`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add content/guide/03-monsters/great-old-ones.mdx
git commit -m "feat: add Gobogeg profile for GOO Pack 3

Replace BGG stub with full profile sourced from wiki card text.
Gobogeg is the only GOO in Pack 3 — free to awaken but requires
someone to have 6 Faction Spellbooks.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: Extended Neutral Monsters

**Files:**
- Modify: `content/guide/03-monsters/by-faction.mdx`

**Step 1: Read the design doc**

Read `docs/plans/2026-02-22-wiki-integration-design.md` — the Task 3 section has all card text for 14 new neutral monsters organized by expansion.

**Step 2: Read `by-faction.mdx` and identify insertion point**

Read the file. The new content goes AFTER the existing `## Tips & Faction Synergies` section and BEFORE the `## Source References` section. The page currently ends with Tips, then Source References.

Actually — restructure as follows:
1. Keep existing Dreamlands sections as-is
2. Add new `##` sections for each expansion AFTER Dreamlands Underworld and BEFORE Tips
3. Keep Tips at the end (before Source References) — add a few new tips for the new monsters

**Step 3: Update frontmatter**

Change the description to reflect broader coverage:
```yaml
description: "Strategy guide for neutral expansion monsters — Dreamlands, Opener of the Way pack, Ramsey Campbell Horrors, and more."
```

Remove the `episodes` field since the new content is not podcast-sourced. Or keep it and note the podcast episodes only cover Dreamlands.

**Step 4: Add expansion sections**

Add these `##` sections in order, each with a brief overview paragraph and `###` profiles:

1. `## Opener of the Way Expansion Neutrals` — Dimensional Shambler, Elder Thing, Star Vampire, Servitor of the Outer Gods
2. `## Ramsey Campbell Horrors 1 Neutrals` — Insects from Shaggai
3. `## Ramsey Campbell Horrors 2 Neutrals` — Satyr
4. `## Beyond Time and Space Neutrals` — Voonith, Wamp
5. `## CATaclysm Neutrals` — Giant Blind Albino Penguin
6. `## Something About Cats Neutrals` — Asteroid Cat, Cat from Mercury, Cat from Venus
7. `## Yuggoth Map Neutrals` — Slime Mold

Each `###` profile follows the established format:
```
### [Unit Name]
**Cost:** 2 Doom (loyalty card) + N Power per monster (summoned during Doom Phase)
**Count:** N
**Combat:** N
**[Ability Name]:** [Description]

[Strategy paragraph — 100-200 words, first-principles analysis, faction pairings]
```

For the Servitor of the Outer Gods, note the unique mechanic: the loyalty card is given to an opponent as a handicap (negative combat, forced summoning). This is an offensive purchase.

For the Slime Mold, note it is map-specific (Yuggoth Map only).

**Step 5: Update Tips section**

Add 2-3 new tips covering the new monsters. Focus on:
- Servitor of the Outer Gods as a sabotage tool
- Elder Thing as a GOO-shutdown counter
- Voonith's guaranteed-kill mechanic

**Step 6: Update Source References**

Add: `*Additional stats and card text sourced from the [Cthulhu Wars Strategy Wiki](https://cthulhuwars.fandom.com/) (CC-BY-SA).*`

**Step 7: Verify build**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npm run build`
Expected: Build succeeds.

**Step 8: Commit**

```bash
git add content/guide/03-monsters/by-faction.mdx
git commit -m "feat: add 14 neutral monster profiles from 7 expansions

Cover Dimensional Shambler, Elder Thing, Star Vampire, Servitor
of the Outer Gods, Insects from Shaggai, Satyr, Voonith, Wamp,
Giant Blind Albino Penguin, Asteroid Cat, Cat from Mercury,
Cat from Venus, and Slime Mold. Wiki-sourced card text with
original strategy analysis.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Extended GOOs + Terrors

**Files:**
- Modify: `content/guide/03-monsters/great-old-ones.mdx`
- Modify: `content/guide/03-monsters/terrors.mdx`

**Step 1: Read the design doc**

Read `docs/plans/2026-02-22-wiki-integration-design.md` — the Task 4 section has all card text for 9 GOOs and 2 Terrors.

**Step 2: Read `great-old-ones.mdx` and identify insertion point**

New GOO sections go AFTER the existing GOO Pack 3 section and BEFORE the `## General Tips` section.

**Step 3: Add GOO expansion sections**

Add these `##` sections in order:

1. `## Ramsey Campbell Horrors 1` — Eihort, Gla'aki
2. `## Ramsey Campbell Horrors 2` — Daoloth, Y'Golonac
3. `## Masks of Nyarlathotep` — The Bloated Woman, The Haunter of the Dark
4. `## Onslaught Three` — Dire Azathoth, Dire Cthulhu
5. `## Something About Cats` — Hagarg Ryonis (note this is an "Elder God" type, not a standard Independent GOO)

Each section gets a brief intro note (1 sentence about the expansion) and `###` profiles following established format:
```
### [Unit Name] — [Epithet]
**Awaken cost:** N Power (prereqs)
**Combat:** N
**[Ability Name]:** [Description]
**Spellbook requirement:** [Condition]
**Spellbook — [Name]:** [Description]

[Strategy paragraph — 150-250 words]
```

For Ramsey Campbell Horrors 1: note that the Brood cultist units are part of Eihort's mechanics but are NOT covered separately (they're faction-specific to whoever controls Eihort).

For Y'Golonac: note the unique "passed around" mechanic — you buy it, it dies, it possesses an enemy unit and transfers to the killer.

For Dire Azathoth: note this is the most expensive GOO in the game (10 Power) with an alternate win condition (20 Power for The Blind Idiot God).

For Hagarg Ryonis: note this is classified as an "Elder God" (distinct from Independent GOOs) and explain any mechanical differences if known.

**Step 4: Add source attribution per section**

Each new `##` section gets: `*Stats and card text sourced from the [Cthulhu Wars Strategy Wiki](https://cthulhuwars.fandom.com/) (CC-BY-SA).*`

**Step 5: Update General Tips**

Add 1-2 tips covering the new GOOs. Focus on:
- The "Ramsey Campbell" GOOs as a thematic group with unusual mechanics
- Dire GOOs as high-risk/high-reward endgame plays

**Step 6: Update Source References**

Add: `*Additional stats and card text sourced from the [Cthulhu Wars Strategy Wiki](https://cthulhuwars.fandom.com/) (CC-BY-SA).*`

**Step 7: Read `terrors.mdx` and add new Terrors**

Add a new `## Additional Terrors` section AFTER the existing `## Tips & Synergies` section and BEFORE `## Source References`. Include:

1. `### The Shadow Pharaoh` — from Masks of Nyarlathotep. Cost 4 Power (2 for Crawling Chaos), Combat 2, Hebephrenia ability. Full strategy paragraph.
2. `### Cat from Neptune` — from Something About Cats. Cost 1, Combat 3, The Final Ritual ability. Full strategy paragraph.

Add source attribution.

**Step 8: Verify build**

Run: `cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy && npm run build`
Expected: Build succeeds.

**Step 9: Commit**

```bash
git add content/guide/03-monsters/great-old-ones.mdx content/guide/03-monsters/terrors.mdx
git commit -m "feat: add 9 GOO + 2 Terror profiles from 5 expansions

GOOs: Eihort, Gla'aki (RCH1), Daoloth, Y'Golonac (RCH2),
The Bloated Woman, The Haunter of the Dark (Masks of Nyarlathotep),
Dire Azathoth, Dire Cthulhu (Onslaught Three),
Hagarg Ryonis (Something About Cats).
Terrors: The Shadow Pharaoh, Cat from Neptune.
Wiki-sourced card text with original strategy analysis.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
