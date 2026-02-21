# Cthulhu Wars Strategy Guide - Design Document

**Date:** 2026-02-21
**Status:** Approved

## Project Overview

A comprehensive, visually compelling strategy guide for the board game Cthulhu Wars, built as an interactive Next.js website with PDF export capability. Content is primarily sourced from transcripts of the "Opening the Way" podcast (35 episodes) and supplemented with additional research.

## Goals

1. Transcribe all 35 episodes of the Opening the Way podcast as markdown reference documents
2. Synthesize transcripts into a structured, navigable strategy guide
3. Present the guide as a dark eldritch-themed static site with interactive components
4. Enable PDF export of selected chapters for game-night handouts
5. Include miniature photography and thematic Lovecraftian illustrations

## Content Architecture

### Guide Sections

1. **Overview & Basics** - How to play, intermediate/advanced tactics, threat assessment
2. **Factions** (base 4 first, then expansions in order):
   - Great Cthulhu, Black Goat, Crawling Chaos, Yellow Sign
   - Opener of the Way, Sleeper, Windwalker
   - Tcho-Tcho, Ancients, Daemon Sultan, Bubastis
3. **Monsters & Terrors** - Overview + individual strategic reviews
4. **Neutral Units & Expansions** - Azathoth, Dunwich Horror, Ramsey Campbell 1 & 2, Cosmic Terrors, Beyond Time & Space, Something About Cats, Masks of Nyarlathotep, High Priest
5. **Maps** - Standard Earth, Dreamlands, Yuggoth, Library at Celaeno, Shaggai, Primeval Earth
6. **Great Old One Packs** - Packs 1, 2, and 4
7. **Advanced Strategy** - Politics & diplomacy, matchup matrix

### Faction Chapter Template

Each faction guide follows a consistent structure:
- Overview (lore + gameplay identity)
- Spellbook abilities (unlock conditions + strategic notes)
- Units (stat blocks with combat dice, cost, abilities)
- Opening moves (turn-by-turn opening strategy)
- Mid-game strategy
- Late-game & doom phase
- Matchups (vs each other faction)
- Tips & tricks (key podcast insights)
- Source transcript reference

## Tech Stack

### Frontend
- **Next.js 15** (App Router) with MDX
- **Tailwind CSS 4** for styling
- **next-mdx-remote** for dynamic MDX content loading
- **sharp** for image optimization
- **react-pdf** or Puppeteer for PDF generation

### Transcription Pipeline
- **Download:** Shell script using curl for all 35 Podbean MP3s
- **Transcribe:** Python with faster-whisper (CTranslate2, large-v3 model)
  - Parallel processing (4-8 episodes concurrently)
  - Custom dictionary for game terminology
- **Post-process:** Term correction, markdown formatting with timestamps

### Image Sources
- BGG XML API2 for game images and user-uploaded miniature photos
- Public domain Lovecraft illustrations (Wikimedia Commons, Internet Archive)
- All images stored locally with attribution metadata

## Visual Theme: Dark Eldritch

### Color Palette
- Background: Cosmic void `#0a0a0f`
- Primary: Eldritch green `#1a4a2e`
- Secondary: Tentacle purple `#2d1b4e`
- Text: Bone white `#e8dcc8`
- Accent: Blood red `#8b1a1a`
- Faction-specific accent colors matching game faction colors

### Typography
- Headings: Serif (Cinzel or Uncial Antiqua family)
- Body: Clean sans-serif (Inter)
- Code/stats: Monospace

### Atmosphere
- Subtle dark parchment/cosmic background textures
- Faction color bars and borders on faction pages
- Hero images for each faction with miniature photography
- Responsive design with mobile-friendly navigation

## Interactive Components

| Component | Purpose |
|-----------|---------|
| `FactionHeader` | Hero image, faction color, at-a-glance stats |
| `SpellbookChecklist` | Interactive ability checklist with unlock conditions |
| `UnitStatBlock` | Visual card with combat dice, cost, abilities |
| `MatchupTable` | Faction vs faction ratings with expandable details |
| `TranscriptReference` | Collapsible link to source podcast transcript |
| `MapOverview` | Visual map with annotated regions |
| `PDFExport` | Chapter selection and PDF generation UI |

## PDF Export

- API route (`/api/pdf`) accepts chapter slugs
- Server-side rendering of selected chapters
- Simplified styling (no interactive elements, printer-friendly)
- Less graphically intensive than the web version
- Suitable for quick game-night reference handouts

## Podcast Episode Catalog

35 episodes, January 2023 - February 2024:

| # | Title | Topic | Date |
|---|-------|-------|------|
| 1 | Introductions are in Order | Podcast intro | 2023-01-04 |
| 2 | The Basics of Cthulhu Wars | How to play | 2023-01-04 |
| 3 | Intermediate/Advanced Tactics | Advanced strategy | 2023-01-04 |
| 4 | The Deepest of Dives | Great Cthulhu faction | 2023-01-04 |
| 5 | G.O.A.T. | Black Goat faction | 2023-01-19 |
| 6 | Getting High For the First Time | High Priest expansion | 2023-01-19 |
| 7 | Schaemin' with the Daemon | Daemon Sultan faction | 2023-02-06 |
| 8 | Fifty Shades of Graey | Azathoth neutral expansion | 2023-02-06 |
| 9 | Chaos Theory | Crawling Chaos faction | 2023-02-27 |
| 10 | You Masked For It | Masks of Nyarlathotep | 2023-02-27 |
| 11 | Fly Me to the Moon | Bubastis faction | 2023-04-07 |
| 12 | Look Who's Talking Meow | Something About Cats | 2023-04-07 |
| 13 | Threat Assessment and the Power of Friendship | Politics & diplomacy | 2023-05-01 |
| 14 | Stop Faugn With My Elder Signs | GOO Pack 1 | 2023-05-01 |
| 15 | The Thorough Threefold Tribal Tcho Tcho Thesis | Tcho-Tcho faction | 2023-06-02 |
| 16 | Weaving a Worldwide Web | GOO Pack 2 | 2023-06-02 |
| 17 | A Surface Level Discussion | Dreamlands Surface Monsters | 2023-06-30 |
| 18 | The Land Down Under | Underworld Monsters | 2023-06-30 |
| 19 | Don't Sleep On This Map | Dreamlands Map | 2023-06-30 |
| 20 | Sign Me the Hell Up | Yellow Sign faction | 2023-08-01 |
| 21 | Reading the Room | Library at Celaeno Map | 2023-08-01 |
| 22 | Out of Body Experience | Cosmic Terrors | 2023-09-01 |
| 23 | Waste Not Wamp Not | Beyond Time & Space | 2023-09-01 |
| 24 | You Can Yuggoth If You Don't Like this Episode Title | Yuggoth Map | 2023-09-01 |
| 25 | Foightin' 'Round the World | Ancients faction | 2023-10-01 |
| 26 | Seeing Double | GOO Pack 4 | 2023-10-01 |
| 27 | Gateway Drug | Opener of the Way faction | 2023-10-31 |
| 28 | A Family Affair | Dunwich Horror | 2023-10-31 |
| 29 | Slugs and Bugs | Ramsey Campbell Horrors 1 | 2023-11-29 |
| 30 | Consider This Veil Rended | Ramsey Campbell Horrors 2 | 2023-11-29 |
| 31 | This Map is Blowing Up Right Now | Shaggai Map | 2023-11-29 |
| 32 | Great Cold Ones | Windwalker faction | 2023-12-29 |
| 33 | This Map is Pretty Chill | Primeval Earth Map | 2023-12-29 |
| 34 | Talking a Whole Load About the Toad | Sleeper faction | 2024-02-02 |
| 35 | Season 1 Finale: A Multitude of Monstrosities | Remaining neutral units | 2024-02-02 |

## Audio File URLs

All episodes available via Podbean CDN:
- Base URL pattern: `https://mcdn.podbean.com/mf/web/{id}/{filename}.mp3`
- Full URL list maintained in `scripts/episode-urls.json`

## Implementation Phases

### Phase 1: Foundation
- Initialize git repo and push to GitHub
- Set up Next.js + Tailwind + MDX project
- Establish dark eldritch theme (global styles, colors, fonts)
- Create basic layout (sidebar nav, content area, responsive)

### Phase 2: Transcription Pipeline
- Download all 35 episodes (~20 hours audio)
- Set up faster-whisper with game-term dictionary
- Run parallel transcriptions
- Post-process and store as markdown

### Phase 3: Content Scaffolding
- Create all guide chapter MDX stubs with frontmatter
- Build core interactive components
- Extract strategy content from transcripts into guide chapters
- Start with base 4 factions as template

### Phase 4: Images & Polish
- Fetch images from BGG API + public domain sources
- Integrate into faction pages and components
- Add map visualizations
- Responsive design polish

### Phase 5: PDF Export & Advanced Features
- PDF generation API route
- Chapter selection UI for PDF bundles
- Search functionality
- Matchup matrix and other interactive features
