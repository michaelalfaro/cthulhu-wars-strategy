# Strategy Tab — Per-Player Game Guide Design

> **Goal:** Add a third tab to the tracker (Game | Strategy | Log) that gives each player a condensed, context-aware strategy guide for their faction — including spellbook paths, phase-by-phase advice, matchup tips against opponents in the current game, and rules reminders.

## Approach

**Static Data Cards (Approach A)** — All strategy content is authored as structured TypeScript data files with condensed, mobile-optimized text (~200 words per section). No API calls, no AI generation, works offline. Content is distilled from the existing 31-40KB MDX faction guides and cross-checked against the Cthulhu Wars wiki for rules accuracy.

## Data Model

### `src/data/faction-strategies.ts` — 11 entries (one per faction)

```typescript
interface FactionStrategy {
  factionId: string;
  spellbookPath: {
    priority: string[];     // ordered spellbook names: ["Submerge", "Devolve", ...]
    notes: string;          // ~50 words on when to deviate
  };
  opening: string;          // ~150 words: turn 1-3 condensed playbook
  earlyGame: string;        // ~100 words
  midGame: string;          // ~100 words
  lateGame: string;         // ~100 words
  keyMistakes: string[];    // 3-5 bullets
  rulesReminders: string[]; // 3-5 key mechanical limits
}
```

### `src/data/faction-matchups.ts` — pairwise entries

```typescript
interface FactionMatchup {
  factionId: string;        // the player reading this
  opponentId: string;       // who they're facing
  threatLevel: "low" | "medium" | "high";
  attack: string;           // ~75 words: how to pressure this opponent
  defend: string;           // ~75 words: how to protect against their tricks
}
```

Starting with 4 core factions (12 pairwise matchups). Expansion factions added incrementally.

## Accuracy Safeguards

- All unit counts, costs, timing rules cross-checked against the Cthulhu Wars wiki
- `faction-units.ts` is the single source of truth for stat claims
- Cards include `rulesReminders` field for commonly misplayed rules
- Key known fixes needed:
  - `faction-units.ts`: Mi-Go max 3 → 4 (wiki confirms 4)
  - `unique-high-priests.ts`: add `cost: 3` and `combat: 0` (confirmed by official PDF from Arthur Petersen)
- User reviews all condensed strategy content before commit
- Example rules reminders for Black Goat:
  - "Blood Sacrifice: once per Doom phase, eliminate 1 Cultist → 1 Elder Sign"
  - "Ghroth: 2 Power action. Roll d6 ≤ areas with Fungi = success. 4 Fungi max."

## Strategy Tab UI Layout

### Tab Bar

The tracker page gets a 3-tab bar: **Game | Strategy | Log**

- `Game` = current tracker UI (doom track, player cards, phase bar, etc.)
- `Strategy` = new per-player strategy guide
- `Log` = action log (already exists)
- Default tab: Game
- Tab state: local (not persisted)

### Strategy Tab Sections (mobile accordion)

**1. 📖 Spellbook Path** (expanded by default)
- Ordered list of 6 spellbooks with recommended pickup order
- Short deviation notes
- Tappable spellbooks show ability description

**2. ⚔️ Opening & Game Phases** (collapsed, tap to expand)
- Opening (~150 words): condensed turn 1-3 playbook with Power allocations
- Early Game (~100 words): turns 1-3 priorities
- Mid Game (~100 words): turns 4-5 transition
- Late Game (~100 words): closing/doom rush

**3. 🎯 vs Opponents** (collapsed, badges for each opponent)
- One card per opponent faction in the current game (context-aware)
- Threat level badge (🟢 low / 🟡 medium / 🔴 high)
- Attack tips (~75 words) + Defend tips (~75 words)

**4. ⚠️ Rules Reminders** (collapsed)
- 3-5 bullet points of commonly misplayed rules
- Key mechanical limits (unit counts, timing, costs)

## Component Architecture

```
TrackerSession (knows factionIds, mapId)
  └─ StrategyTab
       ├─ SpellbookPath ← FACTION_STRATEGIES[factionId].spellbookPath
       ├─ GamePhases ← FACTION_STRATEGIES[factionId].opening/early/mid/late
       ├─ OpponentCards ← FACTION_MATCHUPS.filter(matchesCurrentGame)
       └─ RulesReminders ← FACTION_STRATEGIES[factionId].rulesReminders
```

**New components:**
- `StrategyTab.tsx` — top-level, receives factionId + opponentFactionIds + mapId
- `SpellbookPath.tsx` — ordered spellbook list
- `GamePhases.tsx` — accordion with 4 phase sections
- `OpponentCards.tsx` — renders MatchupCards for current game opponents
- `MatchupCard.tsx` — threat badge + attack/defend
- `RulesReminders.tsx` — bullet list

All data is static imports. No API calls, no loading states, works offline.

## Implementation Phases

### Phase 1A: Data Fixes (immediate)
- Fix Mi-Go max: 3 → 4 in `faction-units.ts`
- Add `cost: 3` and `combat: 0` to `unique-high-priests.ts`

### Phase 1B: Strategy Tab Data (core factions)
- Create `faction-strategies.ts` with 4 core faction entries
- Create `faction-matchups.ts` with 12 pairwise matchups
- Tests for both files

### Phase 1C: Strategy Tab UI
- Add tab bar to tracker page (Game | Strategy | Log)
- Build all 6 components
- Wire to tracker session state
- Mobile-responsive accordion layout

### Phase 2: Expansion Factions (later)
- Add 7 expansion faction strategies
- Add remaining pairwise matchups (prioritize common matchups)
- Optional: HP card images from PDF in UI

### Out of Scope
- AI-generated tips (deferred to multiplayer Phase 7)
- Real-time multiplayer sync (deferred to multiplayer Phase 5)
- Investigator content (deferred)

## Reference Materials

- Faction MDX guides: `content/guide/02-factions/*.mdx` (31-40KB each, complete)
- Cthulhu Wars wiki: https://cthulhuwars.fandom.com/ (canonical unit counts)
- Official Unique High Priests PDF: `Unique High Priests.pdf` (from Arthur Petersen)
- Existing interaction tips: `src/data/faction-interactions.ts` (20 tips)
