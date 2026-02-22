# BGG Resource Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate official and community resources from BGG and Petersen Games into the Cthulhu Wars strategy guide across four phases.

**Architecture:** MDX content additions and updates. Phase 1 updates the existing resources page. Phase 2 creates a new `08-faq` content directory with 4 MDX files and adds FAQ sections to all 11 faction pages. Phase 3 audits external sources against existing content and applies updates. Phase 4 creates a new variant page under Overview.

**Tech Stack:** MDX, Next.js App Router, TypeScript (navigation only)

---

### Task 1: Update Resources Page with Official Links

**Files:**
- Modify: `content/guide/01-overview/resources.mdx`

**What to do:**

Update the resources page with all newly discovered official and community links. Make these specific changes:

1. **Replace the Rulebook subsection** (lines 14-18). The current text points to the BGG files page generically. Replace with:

```mdx
### Rulebook

The **Omega Master Rulebook** is the comprehensive, up-to-date rulebook covering the core game and all expansions. Petersen Games provides two free PDF layouts:

- [Download Omega Rulebook (new layout)](https://drive.google.com/file/d/1320UvIs5J2c8kUHPIuItAThc7f1NGwD6/view) — recommended
- [Download Omega Rulebook (old layout)](https://drive.google.com/open?id=1wCEAJffAPaKYqctvlrKnjseLUr2s2psy) — alternate formatting
- [Petersen Games Rulebook Page](https://petersengames.freshdesk.com/support/solutions/articles/48000965908) — official download page

The BGG Files page also hosts the original January 2015 rulebook (DOCX), but the Omega edition above supersedes it entirely.
```

2. **Add a new subsection after Sandy Petersen's Strategy Articles** (after line 37, before the `---`):

```mdx
### Official FAQ & Errata

- [Cthulhu Wars Rules FAQ](https://petersengames.freshdesk.com/support/solutions/articles/48000952254) — 150+ officially answered rules questions, organized by faction and topic. The canonical source for rule disputes.
- [Official Balance Changes & Errata Tracker](https://petersengames.freshdesk.com/support/solutions/articles/48000953456) — complete history of all balance changes across printings, with downloadable Excel spreadsheet.
- [Community FAQ Compilation (BGG)](https://boardgamegeek.com/filepage/118891) — community-uploaded FAQ document (DOCX, 30 thumbs).
- [Official Balance Changes - Formatted (BGG)](https://boardgamegeek.com/filepage/119995) — community-formatted PDF of the November 2017 balance changes.

### Official Variants

- [The Colour Out of Space](https://boardgamegeek.com/boardgame/139976/cthulhu-wars/files) — official variant by Sandy Petersen (PDF, 30 thumbs). Changes the game's resource model. See our [Colour Out of Space guide](/guide/overview/colour-out-of-space) for strategy implications.
```

3. **Add four entries to the Community Player Aids section** (after line 45, within the existing section):

```mdx
Highly rated community player aids available on the BGG Files page:

- **Faction Player Tips** by paddirn — condensed strategy tips for new players across all factions (PDF, 47 thumbs)
- **Battle Player Aid - In-depth** by Michael_K13 — detailed battle rules walkthrough with worked examples, updated for Cats & Daemon Sultan (PDF, 24 thumbs)
- **Neutral Unit Selection Guides** by Michael_K13 — printable reference sheets for choosing neutral monsters (ZIP, 14 thumbs)
- **Cthulhu Wars Faction Info Player Notes** — condensed 9-faction reference covering abilities, units, and spellbooks (PDF, 8 thumbs)
```

4. **Add to the Quick Reference table** at the bottom of the page:

```mdx
| Official rules FAQ | [Petersen Games FAQ](https://petersengames.freshdesk.com/support/solutions/articles/48000952254) |
| Balance changes & errata | [Petersen Games Errata Tracker](https://petersengames.freshdesk.com/support/solutions/articles/48000953456) |
| Official variant | [Colour Out of Space](/guide/overview/colour-out-of-space) |
```

**Verify:** Run `npm run build` and confirm it succeeds. Open `http://localhost:3000/guide/overview/resources` and confirm all links render and are clickable.

**Commit:**
```bash
git add content/guide/01-overview/resources.mdx
git commit -m "Update resources page with Omega rulebook, FAQ, errata, player aids, and variant links"
```

---

### Task 2: Create FAQ Navigation and General Rules FAQ

**Files:**
- Create: `content/guide/08-faq/index.mdx`
- Modify: `src/lib/navigation.ts`

**What to do:**

1. **Create directory** `content/guide/08-faq/`

2. **Update navigation** in `src/lib/navigation.ts`. Add a new section after the Advanced section (line 88):

```typescript
  {
    title: "FAQ",
    href: "/guide/faq",
    children: [
      { title: "General Rules", href: "/guide/faq" },
      { title: "Faction Interactions", href: "/guide/faq/factions" },
      { title: "Neutrals & Terrors", href: "/guide/faq/neutrals" },
      { title: "Maps", href: "/guide/faq/maps" },
    ],
  },
```

3. **Create `content/guide/08-faq/index.mdx`** — General rules FAQ covering core mechanics. Source content from the [Petersen Games FAQ](https://petersengames.freshdesk.com/support/solutions/articles/48000952254). Navigate to that page in a browser, read the FAQ content, and organize it into the following structure:

```mdx
---
title: "General Rules FAQ"
description: "Frequently asked questions about Cthulhu Wars core rules — power, combat, gates, doom, and ritual mechanics."
---

# General Rules FAQ

Answers to the most common rules questions about Cthulhu Wars core mechanics. Sourced from the [official Petersen Games FAQ](https://petersengames.freshdesk.com/support/solutions/articles/48000952254) and community compilations.

---

## Power & Actions

### [Question from FAQ]?

[Answer]

### [Question from FAQ]?

[Answer]

## Combat

### [Question from FAQ]?

[Answer]

## Gates & Control

### [Question from FAQ]?

[Answer]

## Doom & Ritual

### [Question from FAQ]?

[Answer]

## Miscellaneous

### [Question from FAQ]?

[Answer]

---

*Sourced from the [Petersen Games Rules FAQ](https://petersengames.freshdesk.com/support/solutions/articles/48000952254). For the complete list of 150+ questions, visit the official FAQ page.*
```

Include 15-25 of the most commonly asked general rules questions. Focus on questions that apply to ALL factions (not faction-specific ones — those go in later tasks). Rewrite answers in your own words; do not copy verbatim.

**Verify:** Run `npm run build` and confirm it succeeds. Check `http://localhost:3000/guide/faq` renders correctly and appears in the sidebar navigation.

**Commit:**
```bash
git add content/guide/08-faq/index.mdx src/lib/navigation.ts
git commit -m "Add FAQ section with general rules FAQ and navigation"
```

---

### Task 3: Create Faction Interactions FAQ

**Files:**
- Create: `content/guide/08-faq/factions.mdx`

**What to do:**

Create the cross-faction FAQ page covering timing questions, ability interactions, and edge cases that span multiple factions.

Source content from the [Petersen Games FAQ](https://petersengames.freshdesk.com/support/solutions/articles/48000952254) — navigate to that page, read the faction-specific sections, and extract questions about faction INTERACTIONS (not single-faction questions, which go in the faction pages).

Also check these BGG threads for additional cross-faction FAQ content:
- [Compilation of FAQs](https://boardgamegeek.com/thread/1390262/compilation-of-faqs)
- [Cthulhu Wars FAQ: Trickiest Questions](https://boardgamegeek.com/thread/2364358/cthulhu-wars-faq-trickiest-questions)

```mdx
---
title: "Faction Interactions FAQ"
description: "FAQ covering ability interactions, timing disputes, and edge cases between Cthulhu Wars factions."
---

# Faction Interactions FAQ

Questions about how faction abilities interact with each other — timing conflicts, ability stacking, and edge cases that come up in multi-faction games.

---

## Combat Interactions

### [Questions about abilities triggering during combat across factions]

## Timing & Priority

### [Questions about simultaneous ability triggers, action ordering]

## Spellbook Interactions

### [Questions about how one faction's spellbook affects another]

## Special Cases

### [Edge cases, unusual interactions]

---

*Sourced from the [Petersen Games Rules FAQ](https://petersengames.freshdesk.com/support/solutions/articles/48000952254) and community compilations.*
```

Include 10-20 questions. Focus on the trickiest, most commonly disputed interactions. Rewrite answers in your own words.

**Verify:** Run `npm run build`. Check `http://localhost:3000/guide/faq/factions` renders correctly.

**Commit:**
```bash
git add content/guide/08-faq/factions.mdx
git commit -m "Add faction interactions FAQ page"
```

---

### Task 4: Create Neutrals & Terrors FAQ

**Files:**
- Create: `content/guide/08-faq/neutrals.mdx`

**What to do:**

Create the FAQ page for neutral monsters, GOO packs, terrors, independent GOOs, and neutral spellbooks.

Source from the Petersen Games FAQ sections on "Neutral Spellbooks," "Neutral Monsters," "Terrors," and "Independent Great Old Ones."

```mdx
---
title: "Neutrals & Terrors FAQ"
description: "FAQ for neutral monsters, GOO packs, cosmic terrors, and independent Great Old Ones."
---

# Neutrals & Terrors FAQ

Questions about neutral units, cosmic terrors, independent Great Old Ones, and neutral spellbook mechanics.

---

## Neutral Monster Mechanics

### [General neutral monster questions]

## Independent Great Old Ones

### [GOO pack specific questions — Cthugha, Bokrug, etc.]

## Cosmic Terrors

### [Terror-specific questions — Great Race, Dhole, Quachil Uttaus, etc.]

## Neutral Spellbooks

### [Azathoth and general neutral spellbook questions]

---

*Sourced from the [Petersen Games Rules FAQ](https://petersengames.freshdesk.com/support/solutions/articles/48000952254).*
```

Include 10-15 questions. Rewrite answers in your own words.

**Verify:** Run `npm run build`. Check `http://localhost:3000/guide/faq/neutrals` renders.

**Commit:**
```bash
git add content/guide/08-faq/neutrals.mdx
git commit -m "Add neutrals and terrors FAQ page"
```

---

### Task 5: Create Maps FAQ

**Files:**
- Create: `content/guide/08-faq/maps.mdx`

**What to do:**

Create the FAQ page for map-specific rules questions.

Source from the Petersen Games FAQ section on "Additional Maps" and any map-related questions from other sections.

```mdx
---
title: "Maps FAQ"
description: "FAQ for Cthulhu Wars map variants — Dreamlands, Yuggoth, Library at Celaeno, Shaggai, and Primeval Earth."
---

# Maps FAQ

Map-specific rules questions for all Cthulhu Wars maps beyond Standard Earth.

---

## Dreamlands

### [Dreamlands-specific questions]

## Yuggoth

### [Yuggoth-specific questions]

## Library at Celaeno

### [Library-specific questions]

## Shaggai

### [Shaggai-specific questions]

## Primeval Earth

### [Primeval Earth-specific questions]

## Multi-Map / General

### [Questions about map selection, multi-map games]

---

*Sourced from the [Petersen Games Rules FAQ](https://petersengames.freshdesk.com/support/solutions/articles/48000952254).*
```

Include 8-15 questions. Rewrite answers in your own words.

**Verify:** Run `npm run build`. Check `http://localhost:3000/guide/faq/maps` renders.

**Commit:**
```bash
git add content/guide/08-faq/maps.mdx
git commit -m "Add maps FAQ page"
```

---

### Task 6: Add FAQ to Base Faction Pages (Great Cthulhu, Black Goat, Crawling Chaos, Yellow Sign)

**Files:**
- Modify: `content/guide/02-factions/great-cthulhu.mdx`
- Modify: `content/guide/02-factions/black-goat.mdx`
- Modify: `content/guide/02-factions/crawling-chaos.mdx`
- Modify: `content/guide/02-factions/yellow-sign.mdx`

**What to do:**

For each of the 4 base faction pages, add a `## Frequently Asked Questions` section between `## Tips & Tricks from the Podcast` and `## Source References`.

Source faction-specific FAQ items from the [Petersen Games FAQ](https://petersengames.freshdesk.com/support/solutions/articles/48000952254). Navigate to the FAQ page, find questions specific to each faction, and write them into each page.

**Format for each faction page:**

```mdx
## Frequently Asked Questions

*Common rules questions specific to [Faction Name]. Sourced from the [official Petersen Games FAQ](https://petersengames.freshdesk.com/support/solutions/articles/48000952254).*

### [Faction-specific question]?

[Answer in your own words]

### [Faction-specific question]?

[Answer in your own words]
```

**Per-faction guidance:**

- **Great Cthulhu:** Focus on Submerge timing, Devour targeting rules, Devolve instant-speed trigger, Dreams targeting restrictions, Absorb mechanics, Immortal re-awakening rules. Aim for 8-12 questions.
- **Black Goat:** Focus on Fertility Cult timing, Avatar interaction with Shub-Niggurath, The Thousand Young combat bonuses, Blood Sacrifice targeting, Ghroth trigger conditions. Aim for 6-10 questions.
- **Crawling Chaos:** Focus on Madness targeting and restrictions, Flight movement rules, Emissary of the Outer Gods ability scope, Nyarlathotep's combat abilities, Harbinger placement rules. Aim for 6-10 questions.
- **Yellow Sign:** Focus on Desecration mechanics, The Screaming Dead combat triggers, Undead interaction with other abilities, Hastur's combat and movement, The King in Yellow special rules. Aim for 6-10 questions.

Rewrite all answers in your own words. Do not copy text verbatim from the FAQ source.

**Verify:** Run `npm run build`. Spot-check 2 faction pages in the browser to confirm the FAQ section renders between Tips and Source References.

**Commit:**
```bash
git add content/guide/02-factions/great-cthulhu.mdx content/guide/02-factions/black-goat.mdx content/guide/02-factions/crawling-chaos.mdx content/guide/02-factions/yellow-sign.mdx
git commit -m "Add faction-specific FAQ sections to base faction pages"
```

---

### Task 7: Add FAQ to Expansion Faction Pages (7 factions)

**Files:**
- Modify: `content/guide/02-factions/opener-of-the-way.mdx`
- Modify: `content/guide/02-factions/sleeper.mdx`
- Modify: `content/guide/02-factions/windwalker.mdx`
- Modify: `content/guide/02-factions/tcho-tcho.mdx`
- Modify: `content/guide/02-factions/ancients.mdx`
- Modify: `content/guide/02-factions/daemon-sultan.mdx`
- Modify: `content/guide/02-factions/bubastis.mdx`

**What to do:**

Same pattern as Task 6. For each of the 7 expansion faction pages, add a `## Frequently Asked Questions` section between `## Tips & Tricks from the Podcast` and `## Source References`.

Source from the [Petersen Games FAQ](https://petersengames.freshdesk.com/support/solutions/articles/48000952254).

**Per-faction guidance:**

- **Opener of the Way:** Dragon Ascending/Descending timing, Yog-Sothoth movement rules, gate placement mechanics, They Break Through targeting. Aim for 6-10 questions.
- **The Sleeper:** Cursed Slumber gate removal interactions with other factions, Tsathoggua awakening requirements, Lethargy restrictions, Demand Sacrifice mechanics. Aim for 6-10 questions.
- **Windwalker:** Hibernate timing, Ithaqua's ice movement, Ferox vs Terror immunity interaction, Arctic Wind restrictions, Gnoph-Keh combat. Aim for 6-10 questions.
- **Tcho-Tcho:** Martyrdom mechanics, Terror sacrifice rules, High Priest interaction, Ubbo-Sathla combat abilities, Sycophancy mechanics. Aim for 6-10 questions.
- **The Ancients:** Cathedral building rules, Yig's combat, cursed unit mechanics, spellbook unlock interactions. Aim for 5-8 questions.
- **Daemon Sultan:** Azathoth summoning, Nyarlathotep unique mechanics in Daemon Sultan context, cultist abilities, spellbook timing. Aim for 5-8 questions.
- **Bubastis:** Bast movement rules, cat unit mechanics, Pharaoh interactions, spellbook triggers. Aim for 5-8 questions.

Rewrite all answers in your own words.

**Verify:** Run `npm run build`. Spot-check 2 faction pages.

**Commit:**
```bash
git add content/guide/02-factions/opener-of-the-way.mdx content/guide/02-factions/sleeper.mdx content/guide/02-factions/windwalker.mdx content/guide/02-factions/tcho-tcho.mdx content/guide/02-factions/ancients.mdx content/guide/02-factions/daemon-sultan.mdx content/guide/02-factions/bubastis.mdx
git commit -m "Add faction-specific FAQ sections to expansion faction pages"
```

---

### Task 8: Audit Balance Changes Against Existing Content

**Files:**
- No file modifications in this task — research only

**What to do:**

This is a **research task**. Read the official balance changes and produce a report of what needs updating.

1. Navigate to [Petersen Games Balance Changes](https://petersengames.freshdesk.com/support/solutions/articles/48000953456) in a browser and read the full errata tracker.

2. Read each of the 11 faction MDX files in `content/guide/02-factions/` and compare their stated stats, abilities, and spellbook effects against the official errata.

3. Read the neutral unit files in `content/guide/03-monsters/` and `content/guide/04-neutrals/` and compare against errata for neutral units, GOOs, and loyalty cards.

4. Produce a report listing:
   - **File path** and **line number** where outdated content exists
   - **What the content currently says**
   - **What it should say** per the errata
   - **Which printing/errata batch** introduced the change

If no discrepancies are found (because our content already reflects the latest rules), report that explicitly with evidence.

**Do NOT modify any files.** Report findings only.

**Commit:** None for this task.

---

### Task 9: Apply Balance Change Updates

**Files:**
- Modify: Files identified in Task 8 report

**What to do:**

Using the report from Task 8, update all identified discrepancies. For each change:

1. Edit the specific lines identified in the report
2. Ensure the updated text flows naturally with surrounding content
3. Do NOT add inline errata notes — just update the content to reflect current rules

If Task 8 found no discrepancies, skip this task.

**Verify:** Run `npm run build`.

**Commit:**
```bash
git add [files changed]
git commit -m "Update faction and neutral content to reflect official balance changes"
```

---

### Task 10: Review Strategy Guides and Integrate Insights

**Files:**
- Modify: Faction pages in `content/guide/02-factions/` (as needed)

**What to do:**

This is a **research + content task**.

1. Navigate to the [CrawlingLaos Strategy Guide](https://boardgamegeek.com/blogpost/103852/cthulhu-wars-strategy-guide) in a browser and read it. Note any strategic insights that are NOT already covered in our faction pages.

2. Navigate to [Sandy's Design Corner Strategies v2](https://www.scribd.com/document/615950276) and read it. Note additional strategic insights.

3. Navigate to the [paddirn Faction Player Tips](https://boardgamegeek.com/boardgame/139976/cthulhu-wars/files) on BGG files and read the PDF content. Note beginner-friendly tips not in our pages.

4. For each faction where you find new insights, add them as additional bullet points in the `## Tips & Tricks from the Podcast` section (rename to `## Tips & Tricks` since some tips now come from community sources, not just the podcast). Add a brief attribution like "(community insight)" after each new tip.

**Rules:**
- Do NOT replace existing podcast-sourced content
- Only add insights that are genuinely new and strategically valuable
- Keep additions concise — 1-3 sentences per new tip
- If a strategy guide contradicts our content, note both perspectives rather than replacing

**Verify:** Run `npm run build`.

**Commit:**
```bash
git add content/guide/02-factions/*.mdx
git commit -m "Integrate community strategy insights into faction pages"
```

---

### Task 11: Add Neutral Unit Selection to Game Setup

**Files:**
- Modify: `content/guide/01-overview/game-setup.mdx`

**What to do:**

1. Navigate to the [BGG Files page](https://boardgamegeek.com/boardgame/139976/cthulhu-wars/files) and find Michael_K13's Neutral Unit Selection Guides. Read the content.

2. Add a new section to `game-setup.mdx` after the existing content (after the "Starting Power Quick Reference" section). This section should cover:

```mdx
---

## Choosing Neutral Units

When setting up a game with neutral monster expansions, the choice of which neutral units to include significantly affects faction balance and game dynamics. Here are guidelines for selecting neutrals:

### For New Players

[Recommendations for which neutrals to include in a first game — keep it simple, 1-2 packs max]

### Recommended Combinations

[2-3 suggested neutral unit combinations for different player counts and experience levels]

### Faction Considerations

[Brief notes on which factions benefit most from specific neutral units, helping players make informed pre-game choices]

### What to Avoid

[Combinations that create problematic game states or are overwhelming for the table]

---

*Neutral unit selection advice informed by Michael_K13's Neutral Unit Selection Guides ([BGG Files](https://boardgamegeek.com/boardgame/139976/cthulhu-wars/files)) and community experience.*
```

Write the actual content based on what you learn from Michael_K13's guides and from the existing content in our neutral unit pages (`content/guide/04-neutrals/`).

**Verify:** Run `npm run build`. Check `http://localhost:3000/guide/overview/game-setup` renders the new section.

**Commit:**
```bash
git add content/guide/01-overview/game-setup.mdx
git commit -m "Add neutral unit selection guide to game setup page"
```

---

### Task 12: Create Colour Out of Space Variant Page

**Files:**
- Create: `content/guide/01-overview/colour-out-of-space.mdx`
- Modify: `src/lib/navigation.ts`

**What to do:**

1. Navigate to the [BGG Files page](https://boardgamegeek.com/boardgame/139976/cthulhu-wars/files) and find "The Colour Out of Space" variant by Sandy Petersen. Read the variant rules.

2. **Update navigation** in `src/lib/navigation.ts`. Add a new child to the Overview section, after "Resources & Aids" (after line 16):

```typescript
      { title: "Colour Out of Space", href: "/guide/overview/colour-out-of-space" },
```

3. **Create the variant page:**

```mdx
---
title: "The Colour Out of Space"
description: "Official Cthulhu Wars variant by Sandy Petersen. Alternative resource mechanics that change how factions generate and spend Power."
---

# The Colour Out of Space

## Overview

[What this variant is, that it's an official variant designed by Sandy Petersen himself, and a 2-3 sentence summary of what it changes about the game]

## Rules Changes

[Detail each rule modification from the variant PDF. Be specific about what changes and what stays the same]

## Strategy Implications

[How the variant affects faction balance — which factions get stronger or weaker, how the meta shifts, whether certain strategies become more or less viable]

### Faction-by-Faction Impact

[Brief notes on how each of the 4 base factions is affected, plus any expansion factions significantly impacted]

## When to Use This Variant

[Recommendations for when this variant improves the game experience — player count, experience level, variety purposes]

---

*Variant rules by Sandy Petersen. Original PDF available on the [Cthulhu Wars BGG Files page](https://boardgamegeek.com/boardgame/139976/cthulhu-wars/files).*
```

Write the actual content based on the variant PDF. Use your own words; do not copy the PDF text verbatim.

**Verify:** Run `npm run build`. Check `http://localhost:3000/guide/overview/colour-out-of-space` renders. Verify it appears in the sidebar navigation under Overview.

**Commit:**
```bash
git add content/guide/01-overview/colour-out-of-space.mdx src/lib/navigation.ts
git commit -m "Add Colour Out of Space official variant page"
```

---

## Task Dependency Graph

```
Phase 1:  Task 1 (resources page)
              |
Phase 2:  Task 2 (nav + general FAQ) → Task 3 (factions FAQ) → Task 4 (neutrals FAQ) → Task 5 (maps FAQ)
              |                                                                                    |
          Task 6 (base faction FAQs) ──────────────────────────────────────────────────────────────┤
              |                                                                                    |
          Task 7 (expansion faction FAQs) ─────────────────────────────────────────────────────────┘
              |
Phase 3:  Task 8 (balance audit - research) → Task 9 (apply balance changes)
              |
          Task 10 (strategy guide review + integration)
              |
          Task 11 (neutral selection → game setup)
              |
Phase 4:  Task 12 (Colour Out of Space variant page)
```

**Parallelism notes:**
- Tasks 1, 2, and 12 can run in parallel (no dependencies)
- Tasks 3, 4, 5 can run in parallel after Task 2 (they only depend on navigation existing)
- Tasks 6 and 7 can run in parallel (different files)
- Task 9 depends on Task 8 (research before application)
- Tasks 10 and 11 can run in parallel
