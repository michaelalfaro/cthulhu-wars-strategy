# Multiplayer Shared Tracker with AI Coach

**Date:** 2026-02-23
**Status:** Approved
**Approach:** Content Chunks + RAG (Hybrid rule engine + LLM summarization)

## Overview

A shared multiplayer tracker where friends join via a game code, each sees the live board state, and each gets a private "coach" panel with AI-enhanced strategy tips personalized to their faction, the matchups at the table, the map, and the neutral components in play. Host drives phases/rounds, players manage their own cards. Powered by Supabase for real-time sync.

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth model | Share code / join link | No accounts, lowest friction, Jackbox-style |
| Player view | Shared board + private coach panel | Everyone sees tracker, each gets personal tips |
| Sync model | Host controls tracker, players control own card | Clean permission split, no conflicts |
| Tips engine | Hybrid: rules + AI summary | Rule engine ships first (no AI cost), LLM enriches later |
| Backend | Supabase | Realtime + Postgres + pgvector + Edge Functions in one service |
| Mobile UX | Bottom tab navigation | Primary use case is phones at the game table |

## Section 1: Game Rooms, Faction Draft & Component Voting

### Pre-Game Flow (4 phases)

#### Phase 1: Host Creates Room

Host configures the game skeleton on the setup page:

- Map selection (Earth, Dreamlands, Yuggoth, Library at Celaeno, Shaggai, Primeval Earth)
- Expansions in play (11 checkboxes)
- High Priests: on/off
- Unique High Priests: on/off (requires High Priests on)
- Number of Independent GOOs: 0-5 (pool derived from selected expansion packs)
- Number of Cosmic Terrors: 0-3 (requires Cosmic Terrors expansion)
- Neutral monster packs: auto-included with relevant expansions

Generates a 4-character join code (e.g., `7X3K`) and QR code.

#### Phase 2: Players Join & Draft Factions

Friends visit `/join`, enter code, land in lobby:

1. Browse all available factions via swipeable cards showing identity, playstyle, GOO, key spellbooks (from existing MDX guides)
2. Submit top-3 faction preferences (ordered 1st/2nd/3rd)
3. See other players' status in real-time
4. Host resolves conflicts and assigns factions (auto-assign if no overlap)

#### Phase 3: Vote on Neutral Components

After factions lock, if host enabled GOOs/Terrors:

- Available pool shown based on selected expansion packs
- Each item has a preview card: name, combat, ability summary, strategic context
- Players submit top-3 picks per category
- Votes tallied, host confirms final selection
- Ties broken by host

Votable categories:
1. Independent GOOs (from GOO Packs 1-4, Ramsey Campbell, Masks, Dire, Cats)
2. Cosmic Terrors (if expansion enabled)

Neutral monsters are auto-included based on expansion packs (not voted on).

#### Phase 4: Game Starts

All selections finalized, session created with full configuration feeding into the coaching engine.

### Unique High Priests (Runtime, Not Pre-Game)

Unique High Priests are NOT voted on pre-game. Instead:

- If enabled, all 8 unique HPs form a shared pool tracked in room state
- During gameplay, when a player spends 3 Power to recruit, they choose: generic HP OR pick one available unique HP
- Claimed unique HPs are removed from the pool (first come, first served)
- Player card shows: `[not recruited]` / `[Generic HP]` / `[Asenath Waite]`
- Shared "Available Unique High Priests" panel visible to all

The 8 Unique High Priests:

| Name | Ability | Effect |
|------|---------|--------|
| Asenath Waite | The Thing from Beyond | Sacrifice to swap any enemy Monster/Cultist with your unit (cost <= 3) |
| Crawford Tillinghast | The Ultra-Violet | Sacrifice to deploy up to 3 Power of temp reinforcements to any battle |
| Ermengarde Stubbs | A Simple Rustic Maid | Anyone declaring battle in her area loses 1 Doom |
| Herbert West | The Reanimator Serum | Sacrifice to spawn up to 3 Acolytes in his area |
| Keziah Mason | Daemon Heroine | When she takes Kill/Pain, doubles the result against opponent |
| Lavinia Whateley | The Bride | Sacrifice to reduce GOO awakening cost by 3 Power |
| Joseph Curwen | Beyond the Spheres | Sacrifice to move/remove a gate or place a new gate |
| Pitpipo | The Pit of Despair | Absorbs Kill results from any of your battles, even remotely |

## Section 2: Real-Time Shared Tracker & Player Views

### Permission Model

| Element | Host | Player (own card) | Player (others) |
|---------|------|-------------------|-----------------|
| Phase/Round advance | Yes | No | No |
| First player / direction | Yes | No | No |
| Gather Power (all) | Yes | No | No |
| Score Doom (all) | Yes | No | No |
| My Doom/Gates/Power/ES | Yes | Yes | No |
| My Spellbooks | Yes | Yes | No |
| My Units | Yes | Yes | No |
| Recruit High Priest | Yes | Yes (own) | No |
| Perform Ritual | Yes | Yes (own) | No |
| End Game | Yes | No | No |

### Mobile Layout (Primary Use Case)

Bottom tab bar with 4 tabs:

1. **Game** - Phase bar, YOUR player card (hero view, prominent), other players' cards (compact/collapsed, tap to expand)
2. **Board** - Doom Track visualization, all player doom comparison, overall game state
3. **Coach** - Private tips panel (only you see your tips), notification badge for new tips
4. **Log** - Action log, interaction warnings, game history

### Desktop Layout

Side-by-side: shared tracker (main area) + coach panel (sidebar, ~300px wide).

### Coach Tip Categories

- **Phase Tip** - Phase-specific strategic advice
- **Threat Alert** - Opponents approaching dangerous thresholds
- **Matchup Intel** - Your faction vs. specific opponents on this map
- **Component Warning** - GOOs/Terrors/neutrals in play that affect you
- **Ability Reminder** - Your Unique HP, spellbook timing, unit abilities

Coach tab shows notification badge (red dot + count) when new tips arrive from game state changes.

## Section 3: Content Pipeline & Tips Engine

### Layer 1: Structured Game Knowledge (new data files)

```
src/data/independent-goos.ts    - 18 GOOs: id, name, pack, cost, combat, ability, synergies[], threats[]
src/data/terrors.ts              - 5 Terrors: same structure
src/data/neutral-monsters.ts    - ~23 monster types: id, name, expansion, count, combat, ability
src/data/unique-high-priests.ts - 8 unique HPs: id, name, ability_name, ability_text, synergies[]
src/data/map-strategies.ts      - Per-map notes: key areas, gate advice, faction advantages
```

### Layer 2: Rule Engine (deterministic, no AI)

~80-100 trigger rules evaluating GameContext:

```typescript
interface GameContext {
  myFaction: string
  opponents: string[]
  map: string
  phase: Phase
  round: number
  myDoom: number, myGates: number, myPower: number
  mySpellbooks: boolean[]
  myUnits: Record<string, number>
  allPlayerDoom: number[]
  maxDoom: number
  goosInPlay: string[]
  terrorsInPlay: string[]
  uniqueHPPool: string[]     // remaining available
  myHighPriest: string | null
  highPriestEnabled: boolean
  uniqueHPEnabled: boolean
}
```

Each rule has a `fallbackText` that works without AI. This layer ships first and runs entirely client-side.

Tip refresh triggers:
- Phase advances
- Doom crosses threshold (15, 20, 25, 28)
- Unique HP recruited
- Spellbook unlocked
- Every ~3 rounds (general refresh)

### Layer 3: AI Enrichment (LLM summarization)

- Rule engine selects relevant tips + MDX content chunks via pgvector search
- Supabase Edge Function calls Claude API with game context + content chunks
- Returns 2-4 personalized tips
- Cached by `(triggeredRuleIds + gameStateHash)` - same state = cache hit
- ~5-10 LLM calls per player per game (~$0.15-0.30 total per game)
- Graceful fallback to Layer 2 fallbackText if LLM unavailable

### Content Embedding Pipeline (build-time)

1. Parse all MDX files, extract sections by heading
2. Tag each chunk: faction, topic, phase_relevance, components[]
3. Generate embeddings (OpenAI/Voyage)
4. Store in Supabase `content_chunks` table with pgvector

## Section 4: Supabase Schema

### Tables

```sql
rooms (
  id              uuid PRIMARY KEY,
  join_code       text UNIQUE,
  host_token      text,
  status          text,  -- lobby | drafting | voting | active | completed
  map             text,
  expansions      text[],
  high_priest     boolean DEFAULT false,
  unique_hp       boolean DEFAULT false,
  goo_count       int DEFAULT 0,
  goo_pool        text[],
  selected_goos   text[],
  terror_count    int DEFAULT 0,
  selected_terrors text[],
  neutral_packs   text[],
  round           int DEFAULT 1,
  phase           text DEFAULT 'gather',
  first_player    int DEFAULT 0,
  direction       text DEFAULT 'cw',
  ritual_cost     int DEFAULT 5,
  available_uhp   text[],
  created_at      timestamptz,
  completed_at    timestamptz
)

players (
  id              uuid PRIMARY KEY,
  room_id         uuid REFERENCES rooms,
  player_token    text,
  name            text,
  seat_order      int,
  is_host         boolean DEFAULT false,
  faction_prefs   text[],
  faction_id      text,
  goo_votes       text[],
  terror_votes    text[],
  doom            int DEFAULT 0,
  gates           int DEFAULT 1,
  power           int DEFAULT 8,
  elder_signs     int DEFAULT 0,
  spellbooks      boolean[] DEFAULT '{f,f,f,f,f,f}',
  units           jsonb DEFAULT '{}',
  high_priest     text,  -- null | "generic" | unique HP id
  joined_at       timestamptz
)

action_log (
  id              uuid PRIMARY KEY,
  room_id         uuid REFERENCES rooms,
  player_id       uuid REFERENCES players,
  round           int,
  phase           text,
  action_type     text,
  description     text,
  created_at      timestamptz
)

tip_cache (
  id              uuid PRIMARY KEY,
  room_id         uuid REFERENCES rooms,
  faction_id      text,
  state_hash      text,
  tips            jsonb,
  created_at      timestamptz,
  expires_at      timestamptz
)

content_chunks (
  id              uuid PRIMARY KEY,
  source_file     text,
  heading         text,
  body            text,
  tags            jsonb,
  embedding       vector(1536)
)
```

### Real-Time Subscriptions

Three channels per client:
1. `room:{roomId}` - room state changes (phase, round, HP pool)
2. `players:{roomId}` - all player state changes (doom, gates, etc.)
3. `log:{roomId}` - action log inserts

### Security

Token-based RLS policies:
- Players update only their own row
- Only host updates room state
- Anyone in room can read all room data

### Offline Fallback

- Existing localStorage tracker path completely preserved
- Setup page offers "Create Online Game" vs "Begin Game (Offline)"
- Coach Layer 1 + Layer 2 work entirely client-side without Supabase
- Only Layer 3 (LLM) requires connectivity

## Section 5: Build Phases

### Phase 1: Data Foundation & Supabase Setup (~1 session)
- Create Supabase project, deploy schema
- Build structured data files from existing MDX content
- No changes to existing offline tracker

### Phase 2: Game Rooms & Join Flow (~1-2 sessions)
- `/join` page with code entry
- "Create Online Game" on setup page
- Room creation, join code + QR, lobby page
- Host configuration UI
- Supabase Realtime subscriptions
- Token-based identity

### Phase 3: Faction Draft (~1 session)
- Faction browser in lobby (swipeable cards from MDX)
- Top-3 preference submission
- Host conflict resolution and assignment
- Real-time updates

### Phase 4: Component Voting (~1 session)
- GOO/Terror voting UI with preview cards
- Top-3 picks, tally, host confirmation

### Phase 5: Shared Real-Time Tracker (~2 sessions)
- Tracker reads/writes Supabase instead of localStorage
- Host/player permission split
- Unique HP recruitment from shared pool
- Synced action log
- Mobile tab navigation (Game, Board, Log)
- Offline mode preserved

### Phase 6: Rule Engine & Coach Panel (~1-2 sessions)
- Coach tab (mobile) / sidebar (desktop)
- ~80-100 trigger rules with fallback text
- Tip categories: phase, threat, matchup, component, ability
- Notification badge on Coach tab
- Zero AI dependency - fully client-side

### Phase 7: AI Enrichment (~1 session)
- MDX content embedding pipeline
- Supabase Edge Function for LLM calls
- Rule engine feeds context + chunks to Claude API
- Response caching
- Graceful fallback to Layer 2

## Content Gaps to Fill

- **Independent GOO structured data** - currently only in MDX prose, needs extraction to `src/data/`
- **Matchups guide** (`07-advanced/matchups.mdx`) - placeholder only, needs content
- **Investigators** - deferred to future iteration
- **Unique High Priests** - rules sourced from wiki, need to create data file
- **Map-specific strategies** - scattered across guides, needs consolidation

## Out of Scope (Future)

- User accounts / persistent identity
- Game history / statistics
- Friend lists
- Spectator mode
- Investigator expansion support
