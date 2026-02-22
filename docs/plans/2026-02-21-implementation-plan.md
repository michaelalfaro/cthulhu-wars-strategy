# Cthulhu Wars Strategy Guide - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a dark eldritch-themed Next.js strategy guide for Cthulhu Wars, sourced from 35 transcribed podcast episodes.

**Architecture:** Next.js 15 App Router with MDX content, Tailwind CSS 4 for the dark eldritch theme, faster-whisper for podcast transcription. Content lives in `content/` (transcripts + guide chapters as MDX), presentation in `src/`. PDF export via API route.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 4, @next/mdx, next-mdx-remote, faster-whisper (Python), sharp, Google Fonts (Cinzel, Inter)

---

## Phase 1: Project Foundation

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `mdx-components.tsx`

**Step 1: Create the Next.js project**

Run inside `/Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack
```

When prompted, accept defaults. This creates the full Next.js 15 scaffold with Tailwind and App Router.

Expected: Project files created, `node_modules/` installed.

**Step 2: Verify the dev server starts**

```bash
npm run dev
```

Expected: Server starts on `http://localhost:3000`, shows Next.js welcome page. Stop with Ctrl+C.

**Step 3: Install additional dependencies**

```bash
npm install next-mdx-remote @next/mdx @mdx-js/loader @mdx-js/react gray-matter sharp
npm install -D @types/mdx
```

**Step 4: Configure MDX in next.config.ts**

Replace `next.config.ts` with:

```typescript
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
```

**Step 5: Create mdx-components.tsx at project root**

```tsx
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
```

**Step 6: Add .gitignore entries**

Ensure `.gitignore` includes:
```
node_modules/
.next/
content/transcripts/audio/
*.mp3
```

**Step 7: Verify MDX works**

Create `src/app/test/page.mdx`:
```mdx
# Test MDX Page

This is a test page rendered from MDX.

export const metadata = { title: "Test" };
```

Run `npm run dev`, visit `http://localhost:3000/test`. Expected: see "Test MDX Page" heading.

Delete the test page after verifying.

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 15 project with Tailwind and MDX"
```

---

### Task 2: Configure Dark Eldritch Theme

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/lib/theme.ts`

**Step 1: Define theme constants**

Create `src/lib/theme.ts`:

```typescript
export const theme = {
  colors: {
    void: "#0a0a0f",
    voidLight: "#12121a",
    voidLighter: "#1a1a26",
    green: "#1a4a2e",
    greenLight: "#2a6b44",
    purple: "#2d1b4e",
    purpleLight: "#4a2d7a",
    bone: "#e8dcc8",
    boneMuted: "#b8a88c",
    blood: "#8b1a1a",
    bloodLight: "#b52a2a",
    gold: "#c4a84d",
  },
  factions: {
    "great-cthulhu": { color: "#2d8a4e", name: "Great Cthulhu" },
    "black-goat": { color: "#8b1a1a", name: "Black Goat" },
    "crawling-chaos": { color: "#1a3d8b", name: "Crawling Chaos" },
    "yellow-sign": { color: "#c4a84d", name: "Yellow Sign" },
    "opener-of-the-way": { color: "#d4a017", name: "Opener of the Way" },
    sleeper: { color: "#6b4e2a", name: "The Sleeper" },
    windwalker: { color: "#4a9ac7", name: "Windwalker" },
    "tcho-tcho": { color: "#7a3b8a", name: "Tcho-Tcho" },
    ancients: { color: "#8a8a5a", name: "The Ancients" },
    "daemon-sultan": { color: "#2a2a2a", name: "Daemon Sultan" },
    bubastis: { color: "#c77a4a", name: "Bubastis" },
  },
} as const;

export type FactionId = keyof typeof theme.factions;
```

**Step 2: Configure global CSS with Tailwind v4 theme**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-void: #0a0a0f;
  --color-void-light: #12121a;
  --color-void-lighter: #1a1a26;
  --color-eldritch: #1a4a2e;
  --color-eldritch-light: #2a6b44;
  --color-tentacle: #2d1b4e;
  --color-tentacle-light: #4a2d7a;
  --color-bone: #e8dcc8;
  --color-bone-muted: #b8a88c;
  --color-blood: #8b1a1a;
  --color-blood-light: #b52a2a;
  --color-gold: #c4a84d;

  --font-heading: "Cinzel", serif;
  --font-body: "Inter", sans-serif;
}

body {
  background-color: var(--color-void);
  color: var(--color-bone);
  font-family: var(--font-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}
```

**Step 3: Update layout.tsx with Google Fonts and metadata**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cthulhu Wars Strategy Guide",
  description:
    "A comprehensive strategy guide for the Cthulhu Wars board game. Faction guides, unit analysis, map strategies, and advanced tactics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-void text-bone antialiased">
        {children}
      </body>
    </html>
  );
}
```

**Step 4: Create a placeholder homepage**

Replace `src/app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="font-heading text-5xl font-bold text-bone mb-4">
        Cthulhu Wars
      </h1>
      <h2 className="font-heading text-2xl text-gold mb-8">Strategy Guide</h2>
      <p className="text-bone-muted max-w-xl text-center">
        A comprehensive guide to dominating the board. Faction strategies, unit
        analysis, map tactics, and the wisdom of the Old Ones.
      </p>
    </main>
  );
}
```

**Step 5: Verify the theme renders correctly**

```bash
npm run dev
```

Visit `http://localhost:3000`. Expected: Dark background (#0a0a0f), bone-white text, Cinzel heading font, Inter body font, gold subtitle.

**Step 6: Commit**

```bash
git add src/lib/theme.ts src/app/globals.css src/app/layout.tsx src/app/page.tsx
git commit -m "feat: configure dark eldritch theme with custom colors and typography"
```

---

### Task 3: Build Site Layout Shell

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/ContentArea.tsx`
- Create: `src/lib/navigation.ts`
- Modify: `src/app/layout.tsx`

**Step 1: Define navigation structure**

Create `src/lib/navigation.ts`:

```typescript
export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    title: "Overview",
    href: "/guide/overview",
    children: [
      { title: "Basics", href: "/guide/overview/basics" },
      { title: "Advanced Tactics", href: "/guide/overview/advanced-tactics" },
      { title: "Threat Assessment", href: "/guide/overview/threat-assessment" },
    ],
  },
  {
    title: "Factions",
    href: "/guide/factions",
    children: [
      { title: "Great Cthulhu", href: "/guide/factions/great-cthulhu" },
      { title: "Black Goat", href: "/guide/factions/black-goat" },
      { title: "Crawling Chaos", href: "/guide/factions/crawling-chaos" },
      { title: "Yellow Sign", href: "/guide/factions/yellow-sign" },
      { title: "Opener of the Way", href: "/guide/factions/opener-of-the-way" },
      { title: "The Sleeper", href: "/guide/factions/sleeper" },
      { title: "Windwalker", href: "/guide/factions/windwalker" },
      { title: "Tcho-Tcho", href: "/guide/factions/tcho-tcho" },
      { title: "The Ancients", href: "/guide/factions/ancients" },
      { title: "Daemon Sultan", href: "/guide/factions/daemon-sultan" },
      { title: "Bubastis", href: "/guide/factions/bubastis" },
    ],
  },
  {
    title: "Monsters & Terrors",
    href: "/guide/monsters",
    children: [
      { title: "Great Old Ones", href: "/guide/monsters/great-old-ones" },
      { title: "Monsters by Faction", href: "/guide/monsters/by-faction" },
      { title: "Terrors", href: "/guide/monsters/terrors" },
    ],
  },
  {
    title: "Neutral Units",
    href: "/guide/neutrals",
    children: [
      { title: "Azathoth", href: "/guide/neutrals/azathoth" },
      { title: "Dunwich Horror", href: "/guide/neutrals/dunwich-horror" },
      { title: "Ramsey Campbell 1", href: "/guide/neutrals/ramsey-campbell-1" },
      { title: "Ramsey Campbell 2", href: "/guide/neutrals/ramsey-campbell-2" },
      { title: "Cosmic Terrors", href: "/guide/neutrals/cosmic-terrors" },
      { title: "Beyond Time & Space", href: "/guide/neutrals/beyond-time-space" },
      { title: "Something About Cats", href: "/guide/neutrals/something-about-cats" },
      { title: "Masks of Nyarlathotep", href: "/guide/neutrals/masks-nyarlathotep" },
      { title: "High Priest", href: "/guide/neutrals/high-priest" },
    ],
  },
  {
    title: "Maps",
    href: "/guide/maps",
    children: [
      { title: "Standard Earth", href: "/guide/maps/earth" },
      { title: "Dreamlands", href: "/guide/maps/dreamlands" },
      { title: "Yuggoth", href: "/guide/maps/yuggoth" },
      { title: "Library at Celaeno", href: "/guide/maps/library-celaeno" },
      { title: "Shaggai", href: "/guide/maps/shaggai" },
      { title: "Primeval Earth", href: "/guide/maps/primeval-earth" },
    ],
  },
  {
    title: "GOO Packs",
    href: "/guide/goo-packs",
    children: [
      { title: "Pack 1", href: "/guide/goo-packs/pack-1" },
      { title: "Pack 2", href: "/guide/goo-packs/pack-2" },
      { title: "Pack 4", href: "/guide/goo-packs/pack-4" },
    ],
  },
  {
    title: "Advanced",
    href: "/guide/advanced",
    children: [
      { title: "Politics & Diplomacy", href: "/guide/advanced/politics" },
      { title: "Matchup Matrix", href: "/guide/advanced/matchups" },
    ],
  },
];
```

**Step 2: Build the Header component**

Create `src/components/layout/Header.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-eldritch/30 bg-void/95 px-6 py-4 backdrop-blur-sm">
      <Link href="/" className="flex items-center gap-3">
        <h1 className="font-heading text-xl font-bold text-bone">
          Cthulhu Wars
        </h1>
        <span className="hidden text-sm text-gold sm:inline">
          Strategy Guide
        </span>
      </Link>
      <button
        onClick={onMenuToggle}
        className="text-bone-muted hover:text-bone lg:hidden"
        aria-label="Toggle menu"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>
  );
}
```

**Step 3: Build the Sidebar component**

Create `src/components/layout/Sidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigation, type NavItem } from "@/lib/navigation";

function NavSection({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(item.href);
  const [isOpen, setIsOpen] = useState(isActive);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded px-3 py-2 text-sm font-heading font-semibold transition-colors ${
          isActive
            ? "bg-eldritch/20 text-gold"
            : "text-bone-muted hover:bg-void-lighter hover:text-bone"
        }`}
      >
        {item.title}
        {item.children && (
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
      {isOpen && item.children && (
        <div className="ml-3 mt-1 border-l border-eldritch/20 pl-3">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={`block rounded px-3 py-1.5 text-sm transition-colors ${
                pathname === child.href
                  ? "bg-eldritch/20 text-gold"
                  : "text-bone-muted hover:bg-void-lighter hover:text-bone"
              }`}
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 overflow-y-auto border-r border-eldritch/30 bg-void-light p-4 pt-20 transition-transform lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav>
          {navigation.map((item) => (
            <NavSection key={item.href} item={item} />
          ))}
        </nav>
      </aside>
    </>
  );
}
```

**Step 4: Build the layout wrapper**

Create `src/components/layout/GuideLayout.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function GuideLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-void">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 px-6 py-8 lg:px-12 lg:py-10">
          <div className="prose prose-invert mx-auto max-w-4xl prose-headings:font-heading prose-headings:text-bone prose-p:text-bone-muted prose-a:text-gold prose-strong:text-bone prose-code:text-eldritch-light">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

**Step 5: Install Tailwind typography plugin**

```bash
npm install @tailwindcss/typography
```

Add to `src/app/globals.css` at top:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

**Step 6: Create guide layout route**

Create `src/app/guide/layout.tsx`:

```tsx
import { GuideLayout } from "@/components/layout/GuideLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GuideLayout>{children}</GuideLayout>;
}
```

Create `src/app/guide/page.tsx`:

```tsx
export default function GuidePage() {
  return (
    <div>
      <h1>The Guide to Cthulhu Wars</h1>
      <p>
        Welcome to the comprehensive strategy guide. Select a section from the
        sidebar to begin your descent into madness.
      </p>
    </div>
  );
}
```

**Step 7: Verify layout renders**

```bash
npm run dev
```

Visit `http://localhost:3000/guide`. Expected: Header with title, sidebar with all navigation sections (collapsible), content area with welcome text. Sidebar collapses to hamburger on mobile.

**Step 8: Commit**

```bash
git add src/components/ src/lib/navigation.ts src/app/guide/
git commit -m "feat: add site layout shell with sidebar navigation and eldritch styling"
```

---

### Task 4: Create GitHub Remote and Push

**Step 1: Create GitHub repo**

```bash
gh repo create cthulhu-wars-strategy --public --source=. --description "Comprehensive strategy guide for the Cthulhu Wars board game"
```

**Step 2: Push to remote**

```bash
git push -u origin main
```

**Step 3: Verify**

```bash
gh repo view --web
```

Expected: Repo visible on GitHub with all commits.

---

## Phase 2: Transcription Pipeline

### Task 5: Create Episode URL Manifest

**Files:**
- Create: `scripts/episodes.json`

**Step 1: Create the episode manifest**

Create `scripts/episodes.json` with all 35 episodes:

```json
[
  {
    "number": 1,
    "title": "Introductions are in Order",
    "topic": "Podcast intro",
    "date": "2023-01-04",
    "slug": "01-introductions",
    "url": "https://mcdn.podbean.com/mf/web/a53pr8/opening_the_way_ep1_OMEGA.mp3"
  },
  {
    "number": 2,
    "title": "The Basics of Cthulhu Wars",
    "topic": "How to play",
    "date": "2023-01-04",
    "slug": "02-basics-of-cthulhu-wars",
    "url": "https://mcdn.podbean.com/mf/web/w7f8ff/CW_howtoplay_FINALFINAL.mp3"
  },
  {
    "number": 3,
    "title": "Intermediate/Advanced Tactics",
    "topic": "Advanced strategy",
    "date": "2023-01-04",
    "slug": "03-intermediate-advanced-tactics",
    "url": "https://mcdn.podbean.com/mf/web/c6gptq/howtoplay2_OMEGA.mp3"
  },
  {
    "number": 4,
    "title": "The Deepest of Dives",
    "topic": "Great Cthulhu faction",
    "date": "2023-01-04",
    "slug": "04-great-cthulhu",
    "url": "https://mcdn.podbean.com/mf/web/6wiid2/GC_GOOD_OMEGA.mp3"
  },
  {
    "number": 5,
    "title": "G.O.A.T.",
    "topic": "Black Goat faction",
    "date": "2023-01-19",
    "slug": "05-black-goat",
    "url": "https://mcdn.podbean.com/mf/web/5jq9e2/BG_guide_FINAL.mp3"
  },
  {
    "number": 6,
    "title": "Getting High For the First Time",
    "topic": "High Priest expansion",
    "date": "2023-01-19",
    "slug": "06-high-priest",
    "url": "https://mcdn.podbean.com/mf/web/5fymqu/high_priests_FINAL.mp3"
  },
  {
    "number": 7,
    "title": "Schaemin' with the Daemon",
    "topic": "Daemon Sultan faction",
    "date": "2023-02-06",
    "slug": "07-daemon-sultan",
    "url": "https://mcdn.podbean.com/mf/web/gm9kes/daemon_sultan_guide80lnm.mp3"
  },
  {
    "number": 8,
    "title": "Fifty Shades of Graey",
    "topic": "Azathoth neutral expansion",
    "date": "2023-02-06",
    "slug": "08-azathoth",
    "url": "https://mcdn.podbean.com/mf/web/wkee77/azathoth_expansion.mp3"
  },
  {
    "number": 9,
    "title": "Chaos Theory",
    "topic": "Crawling Chaos faction",
    "date": "2023-02-27",
    "slug": "09-crawling-chaos",
    "url": "https://mcdn.podbean.com/mf/web/b8vbsa/crawling_chaos_guide.mp3"
  },
  {
    "number": 10,
    "title": "You Masked For It",
    "topic": "Masks of Nyarlathotep",
    "date": "2023-02-27",
    "slug": "10-masks-nyarlathotep",
    "url": "https://mcdn.podbean.com/mf/web/fca8pf/masks_of_nyar.mp3"
  },
  {
    "number": 11,
    "title": "Fly Me to the Moon",
    "topic": "Bubastis faction",
    "date": "2023-04-07",
    "slug": "11-bubastis",
    "url": "https://mcdn.podbean.com/mf/web/whyn3t/bubastis_guide7ljd7.mp3"
  },
  {
    "number": 12,
    "title": "Look Who's Talking Meow",
    "topic": "Something About Cats",
    "date": "2023-04-07",
    "slug": "12-something-about-cats",
    "url": "https://mcdn.podbean.com/mf/web/ahn2s5/something_about_kets.mp3"
  },
  {
    "number": 13,
    "title": "Threat Assessment and the Power of Friendship",
    "topic": "Politics & diplomacy",
    "date": "2023-05-01",
    "slug": "13-threat-assessment",
    "url": "https://mcdn.podbean.com/mf/web/5uysxy/politics.mp3"
  },
  {
    "number": 14,
    "title": "Stop Faugn With My Elder Signs",
    "topic": "GOO Pack 1",
    "date": "2023-05-01",
    "slug": "14-goo-pack-1",
    "url": "https://mcdn.podbean.com/mf/web/the65v/IGOO1.mp3"
  },
  {
    "number": 15,
    "title": "The Thorough Threefold Tribal Tcho Tcho Thesis",
    "topic": "Tcho-Tcho faction",
    "date": "2023-06-02",
    "slug": "15-tcho-tcho",
    "url": "https://mcdn.podbean.com/mf/web/hbxtmb/TT_tribes.mp3"
  },
  {
    "number": 16,
    "title": "Weaving a Worldwide Web",
    "topic": "GOO Pack 2",
    "date": "2023-06-02",
    "slug": "16-goo-pack-2",
    "url": "https://mcdn.podbean.com/mf/web/v6chkb/IGOO2.mp3"
  },
  {
    "number": 17,
    "title": "A Surface Level Discussion",
    "topic": "Dreamlands Surface Monsters",
    "date": "2023-06-30",
    "slug": "17-dreamlands-surface-monsters",
    "url": "https://mcdn.podbean.com/mf/web/pvscae/dreamlands_surface_monsters.mp3"
  },
  {
    "number": 18,
    "title": "The Land Down Under",
    "topic": "Underworld Monsters",
    "date": "2023-06-30",
    "slug": "18-underworld-monsters",
    "url": "https://mcdn.podbean.com/mf/web/f6x4ju/underworld_monsters.mp3"
  },
  {
    "number": 19,
    "title": "Don't Sleep On This Map",
    "topic": "Dreamlands Map",
    "date": "2023-06-30",
    "slug": "19-dreamlands-map",
    "url": "https://mcdn.podbean.com/mf/web/cb6phk/dreamlands_map.mp3"
  },
  {
    "number": 20,
    "title": "Sign Me the Hell Up",
    "topic": "Yellow Sign faction",
    "date": "2023-08-01",
    "slug": "20-yellow-sign",
    "url": "https://mcdn.podbean.com/mf/web/7h4ev6/yellow_sign.mp3"
  },
  {
    "number": 21,
    "title": "Reading the Room",
    "topic": "Library at Celaeno Map",
    "date": "2023-08-01",
    "slug": "21-library-celaeno",
    "url": "https://mcdn.podbean.com/mf/web/bh764r/library.mp3"
  },
  {
    "number": 22,
    "title": "Out of Body Experience",
    "topic": "Cosmic Terrors",
    "date": "2023-09-01",
    "slug": "22-cosmic-terrors",
    "url": "https://mcdn.podbean.com/mf/web/hq74yp/cosmicterrors.mp3"
  },
  {
    "number": 23,
    "title": "Waste Not Wamp Not",
    "topic": "Beyond Time & Space",
    "date": "2023-09-01",
    "slug": "23-beyond-time-space",
    "url": "https://mcdn.podbean.com/mf/web/vacjjw/beyondtimespace.mp3"
  },
  {
    "number": 24,
    "title": "You Can Yuggoth If You Don't Like this Episode Title",
    "topic": "Yuggoth Map",
    "date": "2023-09-01",
    "slug": "24-yuggoth-map",
    "url": "https://mcdn.podbean.com/mf/web/heis2s/yuggoth.mp3"
  },
  {
    "number": 25,
    "title": "Foightin' 'Round the World",
    "topic": "Ancients faction",
    "date": "2023-10-01",
    "slug": "25-ancients",
    "url": "https://mcdn.podbean.com/mf/web/cp758n/ancients_guide.mp3"
  },
  {
    "number": 26,
    "title": "Seeing Double",
    "topic": "GOO Pack 4",
    "date": "2023-10-01",
    "slug": "26-goo-pack-4",
    "url": "https://mcdn.podbean.com/mf/web/zq27ji/GOO_pack4.mp3"
  },
  {
    "number": 27,
    "title": "Gateway Drug",
    "topic": "Opener of the Way faction",
    "date": "2023-10-31",
    "slug": "27-opener-of-the-way",
    "url": "https://mcdn.podbean.com/mf/web/2be3nm/opener_guide.mp3"
  },
  {
    "number": 28,
    "title": "A Family Affair",
    "topic": "Dunwich Horror",
    "date": "2023-10-31",
    "slug": "28-dunwich-horror",
    "url": "https://mcdn.podbean.com/mf/web/9newyw/dunwich_horror.mp3"
  },
  {
    "number": 29,
    "title": "Slugs and Bugs",
    "topic": "Ramsey Campbell Horrors 1",
    "date": "2023-11-29",
    "slug": "29-ramsey-campbell-1",
    "url": "https://mcdn.podbean.com/mf/web/gjfvyz/RC_horrors_1.mp3"
  },
  {
    "number": 30,
    "title": "Consider This Veil Rended",
    "topic": "Ramsey Campbell Horrors 2",
    "date": "2023-11-29",
    "slug": "30-ramsey-campbell-2",
    "url": "https://mcdn.podbean.com/mf/web/f4piwm/RC_horrors_2.mp3"
  },
  {
    "number": 31,
    "title": "This Map is Blowing Up Right Now",
    "topic": "Shaggai Map",
    "date": "2023-11-29",
    "slug": "31-shaggai-map",
    "url": "https://mcdn.podbean.com/mf/web/rya8h3/shaggai.mp3"
  },
  {
    "number": 32,
    "title": "Great Cold Ones",
    "topic": "Windwalker faction",
    "date": "2023-12-29",
    "slug": "32-windwalker",
    "url": "https://mcdn.podbean.com/mf/web/kbqjdk/windwalker_guide.mp3"
  },
  {
    "number": 33,
    "title": "This Map is Pretty Chill",
    "topic": "Primeval Earth Map",
    "date": "2023-12-29",
    "slug": "33-primeval-earth-map",
    "url": "https://mcdn.podbean.com/mf/web/ybueca/primeval_map.mp3"
  },
  {
    "number": 34,
    "title": "Talking a Whole Load About the Toad",
    "topic": "Sleeper faction",
    "date": "2024-02-02",
    "slug": "34-sleeper",
    "url": "https://mcdn.podbean.com/mf/web/vjqpvh/sleeper_guide.mp3"
  },
  {
    "number": 35,
    "title": "Season 1 Finale: A Multitude of Monstrosities",
    "topic": "Remaining neutral units",
    "date": "2024-02-02",
    "slug": "35-season-finale",
    "url": "https://mcdn.podbean.com/mf/web/jvd73n/season1_finale.mp3"
  }
]
```

**Step 2: Commit**

```bash
git add scripts/episodes.json
git commit -m "feat: add podcast episode manifest with all 35 episode URLs"
```

---

### Task 6: Build Download Script

**Files:**
- Create: `scripts/download-episodes.sh`

**Step 1: Create the download script**

Create `scripts/download-episodes.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AUDIO_DIR="$SCRIPT_DIR/../content/transcripts/audio"
EPISODES_JSON="$SCRIPT_DIR/episodes.json"

mkdir -p "$AUDIO_DIR"

echo "Downloading Opening the Way podcast episodes..."
echo "================================================"

# Use python to parse JSON and download with curl
python3 -c "
import json, subprocess, os, sys

with open('$EPISODES_JSON') as f:
    episodes = json.load(f)

audio_dir = '$AUDIO_DIR'
for ep in episodes:
    filename = f\"{ep['slug']}.mp3\"
    filepath = os.path.join(audio_dir, filename)
    if os.path.exists(filepath):
        print(f\"[SKIP] Episode {ep['number']}: {ep['title']} (already downloaded)\")
        continue
    print(f\"[DOWN] Episode {ep['number']}: {ep['title']}\")
    result = subprocess.run(
        ['curl', '-L', '-o', filepath, '--progress-bar', ep['url']],
        capture_output=False
    )
    if result.returncode != 0:
        print(f\"[FAIL] Episode {ep['number']}: download failed\", file=sys.stderr)
    else:
        print(f\"[DONE] Episode {ep['number']}: saved to {filename}\")

print()
print('Download complete!')
print(f\"Files in {audio_dir}:\")
for f in sorted(os.listdir(audio_dir)):
    if f.endswith('.mp3'):
        size_mb = os.path.getsize(os.path.join(audio_dir, f)) / (1024*1024)
        print(f\"  {f} ({size_mb:.1f} MB)\")
"
```

**Step 2: Make it executable and test with one episode**

```bash
chmod +x scripts/download-episodes.sh
```

Test by downloading just episode 1 manually:

```bash
mkdir -p content/transcripts/audio
curl -L -o content/transcripts/audio/01-introductions.mp3 --progress-bar "https://mcdn.podbean.com/mf/web/a53pr8/opening_the_way_ep1_OMEGA.mp3"
ls -lh content/transcripts/audio/
```

Expected: MP3 file downloaded successfully (likely 10-50MB).

Delete the test file after verifying: `rm content/transcripts/audio/01-introductions.mp3`

**Step 3: Commit**

```bash
git add scripts/download-episodes.sh
git commit -m "feat: add podcast episode download script"
```

---

### Task 7: Install Transcription Dependencies

**Step 1: Install ffmpeg (required by whisper)**

```bash
brew install ffmpeg
```

Expected: ffmpeg installed. Verify with `ffmpeg -version`.

**Step 2: Create Python virtual environment and install faster-whisper**

```bash
cd /Users/michaelalfaro/Dropbox/git/cthulhu-wars-strategy
python3 -m venv .venv
source .venv/bin/activate
pip install faster-whisper
```

Expected: faster-whisper installed in venv.

**Step 3: Add venv to .gitignore**

Append to `.gitignore`:
```
.venv/
```

**Step 4: Create requirements.txt**

```bash
source .venv/bin/activate && pip freeze > scripts/requirements.txt
```

**Step 5: Commit**

```bash
git add .gitignore scripts/requirements.txt
git commit -m "feat: add Python venv and faster-whisper dependency"
```

---

### Task 8: Build Transcription Script

**Files:**
- Create: `scripts/transcribe.py`
- Create: `scripts/game-terms.txt`

**Step 1: Create the game terminology dictionary**

Create `scripts/game-terms.txt`:

```
Cthulhu
Nyarlathotep
Shub-Niggurath
Hastur
Azathoth
Yog-Sothoth
Tsathoggua
Nodens
Abhoth
Atlach-Nacha
Bokrug
Chaugnar Faugn
Cthugha
Dagon
Ghatanothoa
Ithaqua
Mother Hydra
Rhan-Tegoth
Yig
Tcho-Tcho
Shoggoth
Nightgaunt
Byakhee
Ghoul
Deep One
Starspawn
Dark Young
Fungi
Cultist
Mi-Go
Shantak
Gnorri
Moonbeast
Ghast
Gug
Leng Spider
Dhole
Wamp
Hound of Tindalos
Elder Sign
Spellbook
Doom Track
Gate
Ritual of Annihilation
Power
Desecrate
Dreamlands
Yuggoth
Celaeno
Shaggai
Bubastis
Windwalker
Opener of the Way
Dunwich
Ramsey Campbell
```

**Step 2: Create the transcription script**

Create `scripts/transcribe.py`:

```python
#!/usr/bin/env python3
"""
Transcribe Opening the Way podcast episodes using faster-whisper.
Processes episodes in parallel and outputs markdown files.
"""

import json
import os
import sys
import re
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor, as_completed

from faster_whisper import WhisperModel


SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
AUDIO_DIR = PROJECT_DIR / "content" / "transcripts" / "audio"
OUTPUT_DIR = PROJECT_DIR / "content" / "transcripts"
EPISODES_JSON = SCRIPT_DIR / "episodes.json"
GAME_TERMS_FILE = SCRIPT_DIR / "game-terms.txt"

MODEL_SIZE = "large-v3"
DEVICE = "cpu"
COMPUTE_TYPE = "int8"
NUM_WORKERS = 4


def load_game_terms() -> dict[str, str]:
    """Load game terminology for post-processing corrections."""
    terms = {}
    if GAME_TERMS_FILE.exists():
        for line in GAME_TERMS_FILE.read_text().strip().split("\n"):
            line = line.strip()
            if line:
                terms[line.lower()] = line
    return terms


def fix_game_terms(text: str, terms: dict[str, str]) -> str:
    """Fix capitalization and spelling of game-specific terms."""
    for lower, correct in terms.items():
        pattern = re.compile(re.escape(lower), re.IGNORECASE)
        text = pattern.sub(correct, text)
    return text


def format_timestamp(seconds: float) -> str:
    """Convert seconds to HH:MM:SS format."""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    if h > 0:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"


def transcribe_episode(episode: dict, model_size: str, device: str, compute_type: str) -> str:
    """Transcribe a single episode and return the output path."""
    audio_path = AUDIO_DIR / f"{episode['slug']}.mp3"
    output_path = OUTPUT_DIR / f"{episode['slug']}.md"

    if output_path.exists():
        return f"[SKIP] Episode {episode['number']}: {episode['title']} (already transcribed)"

    if not audio_path.exists():
        return f"[MISS] Episode {episode['number']}: {episode['title']} (audio not found)"

    try:
        model = WhisperModel(model_size, device=device, compute_type=compute_type)
        segments, info = model.transcribe(str(audio_path), beam_size=5)

        terms = load_game_terms()

        lines = []
        lines.append(f"---")
        lines.append(f"title: \"{episode['title']}\"")
        lines.append(f"episode: {episode['number']}")
        lines.append(f"topic: \"{episode['topic']}\"")
        lines.append(f"date: \"{episode['date']}\"")
        lines.append(f"duration: \"{format_timestamp(info.duration)}\"")
        lines.append(f"language: \"{info.language}\"")
        lines.append(f"---")
        lines.append(f"")
        lines.append(f"# Episode {episode['number']}: {episode['title']}")
        lines.append(f"")
        lines.append(f"**Topic:** {episode['topic']}  ")
        lines.append(f"**Date:** {episode['date']}  ")
        lines.append(f"**Duration:** {format_timestamp(info.duration)}")
        lines.append(f"")
        lines.append(f"---")
        lines.append(f"")
        lines.append(f"## Transcript")
        lines.append(f"")

        for segment in segments:
            timestamp = format_timestamp(segment.start)
            text = fix_game_terms(segment.text.strip(), terms)
            lines.append(f"**[{timestamp}]** {text}")
            lines.append(f"")

        output_path.write_text("\n".join(lines))
        return f"[DONE] Episode {episode['number']}: {episode['title']} -> {output_path.name}"

    except Exception as e:
        return f"[FAIL] Episode {episode['number']}: {episode['title']} - {e}"


def main():
    with open(EPISODES_JSON) as f:
        episodes = json.load(f)

    # Filter to only episodes with downloaded audio
    available = [ep for ep in episodes if (AUDIO_DIR / f"{ep['slug']}.mp3").exists()]

    if not available:
        print("No audio files found. Run download-episodes.sh first.")
        sys.exit(1)

    print(f"Transcribing {len(available)} episodes with faster-whisper ({MODEL_SIZE})...")
    print(f"Device: {DEVICE}, Compute: {COMPUTE_TYPE}, Workers: {NUM_WORKERS}")
    print("=" * 60)

    with ProcessPoolExecutor(max_workers=NUM_WORKERS) as executor:
        futures = {
            executor.submit(
                transcribe_episode, ep, MODEL_SIZE, DEVICE, COMPUTE_TYPE
            ): ep
            for ep in available
        }
        for future in as_completed(futures):
            print(future.result())

    print()
    print("Transcription complete!")

    # Summary
    transcribed = list(OUTPUT_DIR.glob("*.md"))
    print(f"Total transcripts: {len(transcribed)}")


if __name__ == "__main__":
    main()
```

**Step 3: Verify the script imports correctly**

```bash
source .venv/bin/activate
python3 -c "from faster_whisper import WhisperModel; print('OK')"
```

Expected: `OK`

**Step 4: Commit**

```bash
git add scripts/transcribe.py scripts/game-terms.txt
git commit -m "feat: add parallel transcription script with game-term post-processing"
```

---

### Task 9: Download All Episodes

**Step 1: Run the download script**

```bash
bash scripts/download-episodes.sh
```

Expected: All 35 MP3 files downloaded to `content/transcripts/audio/`. This will take several minutes depending on connection speed (~2-4 GB total).

**Step 2: Verify all files downloaded**

```bash
ls -lh content/transcripts/audio/ | wc -l
ls -lh content/transcripts/audio/ | tail -5
```

Expected: 35 MP3 files.

---

### Task 10: Run Transcriptions

**Step 1: Activate venv and run transcription**

```bash
source .venv/bin/activate
python3 scripts/transcribe.py
```

This will take a while (several hours on CPU with large-v3, faster with GPU). The script processes 4 episodes in parallel by default.

**Step 2: Verify transcripts**

```bash
ls content/transcripts/*.md | wc -l
head -30 content/transcripts/01-introductions.md
```

Expected: 35 markdown files with frontmatter, title, and timestamped transcript text.

**Step 3: Commit transcripts**

```bash
git add content/transcripts/*.md
git commit -m "feat: add transcribed podcast episodes (35 episodes)"
```

---

## Phase 3: Content Scaffolding

### Task 11: Create MDX Content Loader

**Files:**
- Create: `src/lib/content.ts`

**Step 1: Create the content loading utility**

Create `src/lib/content.ts`:

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const GUIDE_DIR = path.join(process.cwd(), "content", "guide");
const TRANSCRIPT_DIR = path.join(process.cwd(), "content", "transcripts");

export interface GuideFrontmatter {
  title: string;
  faction?: string;
  type?: string;
  color?: string;
  episode?: number;
  description?: string;
}

export interface GuideChapter {
  slug: string;
  frontmatter: GuideFrontmatter;
  content: string;
  section: string;
}

export function getGuideChapter(
  section: string,
  slug: string
): GuideChapter | null {
  const filePath = path.join(GUIDE_DIR, section, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as GuideFrontmatter,
    content,
    section,
  };
}

export function getGuideSectionChapters(section: string): GuideChapter[] {
  const dirPath = path.join(GUIDE_DIR, section);
  if (!fs.existsSync(dirPath)) return [];

  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => {
      const slug = f.replace(".mdx", "");
      return getGuideChapter(section, slug);
    })
    .filter(Boolean) as GuideChapter[];
}

export function getTranscript(slug: string): string | null {
  const filePath = path.join(TRANSCRIPT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}
```

**Step 2: Commit**

```bash
git add src/lib/content.ts
git commit -m "feat: add MDX content loader utility for guide chapters and transcripts"
```

---

### Task 12: Create Faction Chapter Stubs

**Files:**
- Create: `content/guide/02-factions/*.mdx` (11 files)

**Step 1: Create the content directory structure**

```bash
mkdir -p content/guide/{01-overview,02-factions,03-monsters-terrors,04-neutral-units,05-maps,06-goo-packs,07-advanced}
```

**Step 2: Create faction MDX stubs**

Create each faction file with frontmatter and section headers. Example for `content/guide/02-factions/great-cthulhu.mdx`:

```mdx
---
title: "Great Cthulhu"
faction: "great-cthulhu"
type: "base"
color: "#2d8a4e"
episode: 4
description: "The iconic faction of the deep sea. Powerful combat, gate control, and the terrifying Devour ability."
---

# Great Cthulhu

## Overview

*Content to be extracted from Episode 4: "The Deepest of Dives"*

## Spellbook Abilities

## Units

### Cultists
### Deep Ones
### Shoggoths
### Starspawn
### Great Cthulhu (GOO)

## Opening Moves

## Mid-Game Strategy

## Late-Game & Doom Phase

## Matchups

## Tips & Tricks
```

Repeat for all 11 factions:
- `great-cthulhu.mdx` (episode 4)
- `black-goat.mdx` (episode 5)
- `crawling-chaos.mdx` (episode 9)
- `yellow-sign.mdx` (episode 20)
- `opener-of-the-way.mdx` (episode 27)
- `sleeper.mdx` (episode 34)
- `windwalker.mdx` (episode 32)
- `tcho-tcho.mdx` (episode 15)
- `ancients.mdx` (episode 25)
- `daemon-sultan.mdx` (episode 7)
- `bubastis.mdx` (episode 11)

**Step 3: Create overview stubs**

Create `content/guide/01-overview/basics.mdx`:
```mdx
---
title: "The Basics of Cthulhu Wars"
episode: 2
description: "Core rules, turn structure, and fundamental concepts."
---

# The Basics of Cthulhu Wars

*Content to be extracted from Episode 2: "The Basics of Cthulhu Wars"*
```

Similarly for `advanced-tactics.mdx` (episode 3) and `threat-assessment.mdx` (episode 13).

**Step 4: Commit**

```bash
git add content/guide/
git commit -m "feat: scaffold all guide chapter stubs with frontmatter"
```

---

### Task 13: Build Dynamic Guide Routes

**Files:**
- Create: `src/app/guide/[...slug]/page.tsx`

**Step 1: Create catch-all route for guide pages**

Create `src/app/guide/[...slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getGuideChapter } from "@/lib/content";
import matter from "gray-matter";
import fs from "fs";
import path from "path";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const section = slug[0];
  const page = slug[1];

  if (!section || !page) {
    return notFound();
  }

  const sectionDirMap: Record<string, string> = {
    overview: "01-overview",
    factions: "02-factions",
    monsters: "03-monsters-terrors",
    neutrals: "04-neutral-units",
    maps: "05-maps",
    "goo-packs": "06-goo-packs",
    advanced: "07-advanced",
  };

  const dirName = sectionDirMap[section];
  if (!dirName) return notFound();

  const filePath = path.join(
    process.cwd(),
    "content",
    "guide",
    dirName,
    `${page}.mdx`
  );

  if (!fs.existsSync(filePath)) return notFound();

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return (
    <article>
      <MDXRemote source={content} />
    </article>
  );
}
```

**Step 2: Verify a guide page renders**

```bash
npm run dev
```

Visit `http://localhost:3000/guide/factions/great-cthulhu`. Expected: The stub content for Great Cthulhu renders with proper styling.

**Step 3: Commit**

```bash
git add src/app/guide/
git commit -m "feat: add dynamic catch-all route for guide chapters"
```

---

### Task 14: Build Core Interactive Components

**Files:**
- Create: `src/components/guide/FactionHeader.tsx`
- Create: `src/components/guide/UnitStatBlock.tsx`
- Create: `src/components/guide/TranscriptReference.tsx`

**Step 1: Create FactionHeader component**

Create `src/components/guide/FactionHeader.tsx`:

```tsx
import { theme, type FactionId } from "@/lib/theme";

interface FactionHeaderProps {
  faction: FactionId;
  description?: string;
}

export function FactionHeader({ faction, description }: FactionHeaderProps) {
  const factionData = theme.factions[faction];
  if (!factionData) return null;

  return (
    <div
      className="mb-8 rounded-lg border p-6"
      style={{
        borderColor: factionData.color,
        background: `linear-gradient(135deg, ${factionData.color}15, transparent)`,
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="h-12 w-12 rounded-full"
          style={{ backgroundColor: factionData.color }}
        />
        <div>
          <h2 className="font-heading text-2xl font-bold text-bone m-0">
            {factionData.name}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-bone-muted m-0">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create UnitStatBlock component**

Create `src/components/guide/UnitStatBlock.tsx`:

```tsx
interface UnitStatBlockProps {
  name: string;
  cost: number;
  combat: number;
  type: "cultist" | "monster" | "terror" | "goo";
  abilities?: string[];
  description?: string;
}

export function UnitStatBlock({
  name,
  cost,
  combat,
  type,
  abilities = [],
  description,
}: UnitStatBlockProps) {
  const typeColors = {
    cultist: "border-bone-muted",
    monster: "border-eldritch",
    terror: "border-tentacle",
    goo: "border-gold",
  };

  return (
    <div
      className={`my-4 rounded-lg border bg-void-light p-4 ${typeColors[type]}`}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-heading text-lg font-bold text-bone m-0">
          {name}
        </h4>
        <div className="flex gap-3 text-sm">
          <span className="text-gold">Cost: {cost}</span>
          <span className="text-blood-light">Combat: {combat}d6</span>
        </div>
      </div>
      {description && (
        <p className="mt-2 text-sm text-bone-muted m-0">{description}</p>
      )}
      {abilities.length > 0 && (
        <ul className="mt-2 space-y-1">
          {abilities.map((ability) => (
            <li key={ability} className="text-sm text-eldritch-light">
              {ability}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Step 3: Create TranscriptReference component**

Create `src/components/guide/TranscriptReference.tsx`:

```tsx
"use client";

import { useState } from "react";

interface TranscriptReferenceProps {
  episode: number;
  title: string;
}

export function TranscriptReference({
  episode,
  title,
}: TranscriptReferenceProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 rounded-lg border border-void-lighter bg-void-light p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm text-bone-muted">
          Source: Episode {episode} - &quot;{title}&quot;
        </span>
        <svg
          className={`h-4 w-4 text-bone-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <p className="mt-3 text-xs text-bone-muted">
          Content sourced from the Opening the Way podcast. Visit{" "}
          <a
            href="https://openingtheway.podbean.com/"
            className="text-gold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            openingtheway.podbean.com
          </a>{" "}
          to listen.
        </p>
      )}
    </div>
  );
}
```

**Step 4: Register components for MDX**

Update `mdx-components.tsx`:

```tsx
import type { MDXComponents } from "mdx/types";
import { FactionHeader } from "@/components/guide/FactionHeader";
import { UnitStatBlock } from "@/components/guide/UnitStatBlock";
import { TranscriptReference } from "@/components/guide/TranscriptReference";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    FactionHeader,
    UnitStatBlock,
    TranscriptReference,
    ...components,
  };
}
```

**Step 5: Verify components render in dev**

```bash
npm run dev
```

Update one faction MDX stub to use the components and verify they render.

**Step 6: Commit**

```bash
git add src/components/guide/ mdx-components.tsx
git commit -m "feat: add FactionHeader, UnitStatBlock, and TranscriptReference components"
```

---

## Phase 4: Content Extraction (Per-Faction, Iterative)

### Task 15: Extract Content from Transcripts into Guide Chapters

This is an iterative task. For each faction/section:

1. Read the corresponding transcript(s)
2. Extract key strategy points, unit descriptions, opening moves, matchups
3. Write them into the MDX chapter
4. Use the interactive components where appropriate

**Process per chapter:**
- Read `content/transcripts/<slug>.md`
- Identify strategy sections (openings, mid-game, late-game, matchups, tips)
- Write concise strategy content into `content/guide/02-factions/<faction>.mdx`
- Include `<FactionHeader>`, `<UnitStatBlock>`, and `<TranscriptReference>` components

Start with the 4 base factions (Great Cthulhu, Black Goat, Crawling Chaos, Yellow Sign) as templates, then extend to expansion factions.

**Commit after each faction is complete.**

---

## Phase 5: Images, Polish & PDF (Future)

### Task 16: BGG Image Fetcher Script

Create `scripts/fetch-bgg-images.py` that queries the BGG XML API2 for Cthulhu Wars images. The BGG API endpoint for game details is:

```
https://boardgamegeek.com/xmlapi2/thing?id=139976&type=boardgame
```

Download the primary game image and any linked expansion images.

### Task 17: PDF Export API Route

Create `src/app/api/pdf/route.ts` that accepts chapter slugs via query params, renders them server-side with simplified styling, and returns a PDF.

### Task 18: Search Implementation

Add client-side search across all guide content using a pre-built search index.

### Task 19: Matchup Matrix Component

Create `src/components/guide/MatchupTable.tsx` - an interactive matrix showing faction vs faction difficulty ratings.

### Task 20: Responsive Polish & Final Deployment

- Mobile navigation refinements
- Image optimization with next/image
- Lighthouse performance audit
- Deploy to Vercel or GitHub Pages

---

## Reference: Cthulhu Wars Strategy Wiki

Additional strategy content can be sourced from:
- [Cthulhu Wars Strategy Wiki (Fandom)](https://cthulhuwars.fandom.com/wiki/Main_Page)
- [BGG Cthulhu Wars Strategy Forum](https://boardgamegeek.com/forum/1386893/cthulhu-wars/strategy)
- [Petersen Games Official](https://petersengames.com/cthulhu-wars/)
