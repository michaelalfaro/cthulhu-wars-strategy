"use client";

import Link from "next/link";
import { SearchBar } from "./SearchBar";

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-eldritch/30 bg-void/95 px-6 py-3 backdrop-blur-sm">
      <Link href="/" className="flex shrink-0 items-center gap-3">
        <h1 className="font-heading text-xl font-bold text-bone">
          Cthulhu Wars
        </h1>
        <span className="hidden text-sm text-gold sm:inline">
          Strategy Guide
        </span>
      </Link>

      {/* Search bar — centred on desktop, full-width capable */}
      <div className="flex flex-1 justify-center">
        <SearchBar />
      </div>

      <Link
        href="/tracker"
        className="font-heading text-sm text-bone-muted transition-colors hover:text-bone"
      >
        🎲 Tracker
      </Link>

      <button
        onClick={onMenuToggle}
        className="shrink-0 text-bone-muted hover:text-bone lg:hidden"
        aria-label="Toggle menu"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>
  );
}
