# Monsters & Terrors Section — Design Doc

**Date:** 2026-02-21
**Status:** Approved
**Scope:** Fill the three stub pages in `content/guide/03-monsters/`

---

## Context

The Monsters & Terrors section currently has three empty stub files. The goal is to populate them with content extracted from podcast transcripts (Ep 14, 16, 26 for GOOs; Ep 17+18 for neutral monsters; Ep 22 for Cosmic Terrors) following the same rich MDX style as the completed faction guides.

**Scope boundary:** Do NOT re-cover faction-specific monsters (already handled in faction guide pages). Only cover:
- Independent Great Old Ones (GOO Packs)
- Neutral expansion monsters (Dreamlands Surface + Underworld)
- Cosmic Terrors expansion

---

## Approach: Three-Page Structure (Approach A)

Keep the existing 3-page slot structure. Retitle "Monsters by Faction" → "Neutral Monsters" in both the MDX frontmatter and `navigation.ts`.

---

## Page 1: `great-old-ones.mdx`

**Title:** Great Old Ones
**Sources:** Ep 14 (GOO Pack 1), Ep 16 (GOO Pack 2), Ep 26 (GOO Pack 4)

### Content structure

```
## Overview
How independent GOOs work: purchased during the Action Phase (not Doom Phase);
cost Power; require your own GOO to be present at one of your controlled Gates
(most of them); come with a loyalty card, a special ability, and a spellbook
that unlocks after meeting a requirement.

## GOO Pack 1
### Aboth — The Source of Uncleanliness
### [remaining 4 Pack 1 GOOs]

## GOO Pack 2
### Atlachnatcha — The Spinner in Darkness
### [remaining 3 Pack 2 GOOs]

## GOO Pack 4
### [3 Pack 4 GOOs]

## General Tips

## Source References
```

### Unit profile template (for each GOO)
```
### [Name] — [Epithet]
**Awaken cost:** X Power (your GOO must be at a controlled Gate)
**Combat:** Y
**Ability:** [Ability name]: [description]
**Spellbook requirement:** [condition]
**Spellbook:** [Name]: [description]
**Strategy:** [2–4 sentences of practical notes]
```

### Note on GOO Pack 3
The podcast (Opening the Way) has no episode covering GOO Pack 3. The page will include a brief note acknowledging this and directing readers to BGG for Pack 3 profiles.

---

## Page 2: `by-faction.mdx`

**New title:** Neutral Monsters
**Sources:** Ep 17 (Dreamlands Surface), Ep 18 (Dreamlands Underworld)
**Nav update required:** `src/lib/navigation.ts` — change `"Monsters by Faction"` → `"Neutral Monsters"`

### Content structure

```
## Overview
Neutral monsters are different from independent GOOs and Terrors. They are
purchased during the Doom Phase for Power only. No loyalty card, no Action Phase
purchase. Any player can buy them.

## Dreamlands Surface Monsters
(Ep 17: Nori, Moonbeasts, Shantaks)

### Nori
### Moonbeasts
### Shantaks

## Dreamlands Underworld Monsters
(Ep 18: Ghasts, Gugs, Lang Spiders)

### Ghasts
### Gugs
### Lang Spiders

## Tips & Faction Synergies

## Source References
```

### Unit profile template
```
### [Name]
**Cost:** X Power (purchased during Doom Phase)
**Combat:** Y
**Ability:** [Ability name]: [description]
**Best with:** [faction synergies]
**Strategy:** [2–4 sentences]
```

### Key content points (from transcripts)

**Nori** (3 Power, 2 combat): Grotto's ability — 2 Nori = +1 Doom/phase, 3 Nori = +2 Doom/phase. Keep them safe; they pay for themselves over multiple turns.

**Moonbeasts** (2 Power, 0 combat): Blasphemous Obeisance — place on an enemy spellbook to block it; owner pays 1 Doom to remove; stackable on same book. Controversial but powerful disruption.

**Shantaks** (2 Power, 2 combat): Horber Steed — move to ANY area on map (ignoring adjacency), carry 1 Cultist for free. Top-tier gate-stealing unit.

**Ghasts** (2 Power, 0 combat): Hordling — spend 2 Power → ALL Ghasts in pool placed at any gates. Meat shields. Exceptional with Great Cthulhu Absorb.

**Gugs** (1 Power, 3 combat): Clumsy — cannot capture Cultists. Simple, affordable combat filler.

**Lang Spiders** (2 Power, 1 combat): Bloodthirst — each Spider in battle converts 2 pain results to 1 kill. Best of the three underworld monsters.

---

## Page 3: `terrors.mdx`

**Title:** Terrors (or "Cosmic Terrors")
**Source:** Ep 22

### Content structure

```
## Overview
Terrors are a special category of neutral unit. Cost 2 Doom + 2 Power (paid
during the Doom Phase). Unlike regular monsters, Terrors are immune to
monster-targeting spellbooks (e.g. Devour, Flying Polyps). This makes them
harder to remove and dramatically changes their threat profile.

## Cosmic Terrors

### Great Race of Yith
### Dhole
### Qwakil Utaus (Treader of Dust)

## Tips & Synergies

## Source References
```

### Key content points (from Ep 22 transcript)

**Great Race of Yith** (4 Power, 3 combat): Possession — captures units ignoring GOO protection and ignores Ferox; doubles Power return on captured units. Mobile factions love it.

**Dhole** (4 Power, 5 combat): Planetary Destruction — when killed, owner earns 2 Elder Signs; opponent who killed it gets 2 Doom OR 2 Power (their choice). Can pay for itself twice.

**Qwakil Utaus / Treader of Dust** (4 Power, 1 combat): Dust to Dust — each enemy unit killed in battle → opponent must permanently remove one of their units OR give you an Elder Sign. Needs dice support to be effective.

---

## Shared Design Conventions

All three pages follow the faction guide MDX conventions:
- YAML frontmatter: `title`, `description` (+ `episode` or `episodes` array where relevant)
- Sections: `##` for major groups, `###` for individual unit profiles
- Bold stat labels: `**Cost:**`, `**Combat:**`, `**Ability:**`, `**Strategy:**`
- Source references section at the bottom citing episode numbers and titles

---

## Files Changed

| File | Change |
|------|--------|
| `content/guide/03-monsters/great-old-ones.mdx` | Fill stub with GOO Pack profiles |
| `content/guide/03-monsters/by-faction.mdx` | Fill stub with neutral monster profiles; update frontmatter title |
| `content/guide/03-monsters/terrors.mdx` | Fill stub with Cosmic Terrors profiles |
| `src/lib/navigation.ts` | Update `"Monsters by Faction"` → `"Neutral Monsters"` |
