"use client";

import Link from "next/link";

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
