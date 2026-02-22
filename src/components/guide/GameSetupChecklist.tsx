"use client";

import Link from "next/link";
import { SetupChecklist } from "./SetupChecklist";
import { setupSections } from "./setup-data";

/**
 * Pre-wired game setup checklist for Cthulhu Wars.
 * Used in game-setup.mdx with no props: <GameSetupChecklist />
 */
export function GameSetupChecklist() {
  return (
    <div>
      <SetupChecklist sections={setupSections} />
      <div className="mt-6 flex justify-end">
        <Link
          href="/tracker/setup"
          className="inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 font-heading text-sm font-semibold text-gold transition-colors hover:bg-gold/20"
        >
          Start Game Tracker →
        </Link>
      </div>
    </div>
  );
}
