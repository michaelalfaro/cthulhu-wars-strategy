# BGG Resource Integration Design

**Date:** 2026-02-22
**Status:** Approved

## Goal

Integrate official and community resources from BoardGameGeek and Petersen Games into the Cthulhu Wars strategy guide. Four phases, each independently shippable.

## Scope

Six workstreams organized into four phases:

1. Resources page update (links to official + community files)
2. FAQ section (top-level + faction-embedded)
3. Content audit (balance changes, strategy guides, player aids)
4. Colour Out of Space variant page

## Key Research Findings

- **Omega Rulebook PDF** is freely available from Petersen Games Freshdesk (two layouts). The BGG DOCX is the obsolete January 2015 original.
- **Balance changes** are tracked at Petersen Games Freshdesk with an Excel download covering all printings through Final Onslaught. Affects 7+ factions and several neutrals.
- **Official FAQ** is maintained at Petersen Games Freshdesk with 150+ questions organized by core rules, factions, neutrals, terrors, GOOs, maps.
- **Community resources** include paddirn's Faction Player Tips (47 thumbs), Michael_K13's Battle Player Aid (24 thumbs), Faction Info Notes (8 thumbs), Neutral Unit Selection Guides (14 thumbs), and CrawlingLaos's strategy guide blog post.
- **Colour Out of Space** is an official Sandy Petersen variant (30 thumbs).

## Sources

| Resource | Source URL | Format |
|----------|-----------|--------|
| Omega Rulebook PDF | [Petersen Games Freshdesk](https://petersengames.freshdesk.com/support/solutions/articles/48000965908) | PDF (2 layouts) |
| Balance Changes Tracker | [Petersen Games Freshdesk](https://petersengames.freshdesk.com/support/solutions/articles/48000953456) | Web + Excel |
| Official FAQ | [Petersen Games Freshdesk](https://petersengames.freshdesk.com/support/solutions/articles/48000952254) | Web |
| BGG FAQ DOCX | [BGG File 118891](https://boardgamegeek.com/filepage/118891) | DOCX |
| BGG Balance Changes PDF | [BGG File 119995](https://boardgamegeek.com/filepage/119995) | PDF |
| Faction Player Tips (paddirn) | BGG Files, Cthulhu Wars | PDF |
| Battle Player Aid (Michael_K13) | BGG Files, Cthulhu Wars | PDF |
| Faction Info Player Notes | BGG Files, Cthulhu Wars | PDF |
| Neutral Unit Selection (Michael_K13) | BGG Files, Cthulhu Wars | ZIP |
| Colour Out of Space (Sandy Petersen) | BGG Files, Cthulhu Wars | PDF |
| CrawlingLaos Strategy Guide | [BGG Blog 103852](https://boardgamegeek.com/blogpost/103852) | Blog |
| Sandy's Design Corner Strategies v2 | [Scribd](https://www.scribd.com/document/615950276) | PDF |

---

## Phase 1: Resources Page Update

**File:** `content/guide/01-overview/resources.mdx`

### Changes

**Official Resources section:**
- Add Petersen Games Freshdesk rulebook download page (two PDF layouts: old and new)
- Add balance changes/errata tracker with Excel download
- Add official FAQ page
- Demote or remove the obsolete BGG January 2015 DOCX rulebook link if present

**Community Player Aids section:**
- Add Faction Player Tips (paddirn, 47 thumbs)
- Add Battle Player Aid - In-depth (Michael_K13, 24 thumbs)
- Add Faction Info Player Notes (8 thumbs)
- Add Neutral Unit Selection Guides (Michael_K13, 14 thumbs)

**Official Variant:**
- Add link to Colour Out of Space variant PDF (Sandy Petersen, 30 thumbs)
- Cross-reference the variant page created in Phase 4

**Principle:** No files hosted locally. Link to authoritative sources.

---

## Phase 2: FAQ Section

### Top-Level FAQ

**Directory:** `content/guide/08-faq/`

**Files:**
- `index.mdx` — General/core rules FAQ (power, combat, gates, doom, ritual mechanics)
- `factions.mdx` — Cross-faction FAQ (interaction timing, multi-faction edge cases)
- `neutrals.mdx` — Neutral monsters, GOO packs, terrors FAQ
- `maps.mdx` — Map-specific FAQ

**Sources:** Petersen Games Freshdesk FAQ (canonical), BGG FAQ DOCX, community compilations (BGG threads).

**Navigation:** Add `08-faq` section to `src/lib/navigation.ts` with 4 children.

### Faction-Embedded FAQ

**Files:** All 11 faction pages in `content/guide/02-factions/`

**Change:** Add a `## Frequently Asked Questions` section at the bottom of each faction page containing the 5-15 most relevant FAQ items for that faction.

**Format:** Each item is a `### Question?` heading followed by the answer as prose.

**Source attribution:** Each FAQ section credits the Petersen Games FAQ as canonical source.

---

## Phase 3: Content Audit & Updates

### Balance Changes Audit

**Process:**
1. Read the Petersen Games errata tracker
2. Cross-reference against affected faction pages: Great Cthulhu, Black Goat, Yellow Sign, Sleeper, Windwalker, Opener, Tcho-Tcho
3. Cross-reference against affected neutral unit pages
4. Update stats, abilities, or strategy notes where content reflects pre-errata rules
5. Add errata source notes where relevant

### Strategy Guide Review

**Process:**
1. Read CrawlingLaos strategy guide and Sandy's Design Corner Strategies v2
2. Compare insights against faction pages for base + expansion factions
3. Integrate new strategic insights as supplementary paragraphs or tips
4. Do NOT replace existing podcast-sourced content — supplement it

### Player Aid Review

**Process:**
1. Review paddirn's Faction Player Tips — cross-reference against faction pages, add missing beginner advice
2. Review Michael_K13's Battle Player Aid — verify combat coverage in overview/basics is complete
3. Review Faction Info Player Notes — verify faction stats/abilities match our content
4. Review Neutral Unit Selection Guides — integrate selection advice into game setup page as a new section on choosing neutral units

---

## Phase 4: Colour Out of Space Variant Page

**File:** `content/guide/01-overview/colour-out-of-space.mdx`

**Sections:**
- `## Overview` — What the variant is, designer attribution (Sandy Petersen), what it changes
- `## Rules Changes` — Specific rule modifications
- `## Strategy Implications` — How the variant alters faction balance and strategy
- `## Source` — Link to the BGG PDF

**Navigation:** Add as child of Overview section in `src/lib/navigation.ts`, after Resources & Aids.

---

## Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Integration approach | Phased Rollout (A) | Each phase ships independently, lower risk |
| Variant page location | Under Overview section | Near Game Setup and Basics since variants modify core rules |
| FAQ structure | Top-level section + faction-embedded | User requested both dedicated FAQ and per-faction FAQs |
| File hosting | Link only, no local hosting | Authoritative sources stay current; avoids stale copies |
| Content update strategy | Supplement, don't replace | Existing podcast-sourced content is primary; external sources add to it |
