"use client";

import { useState } from "react";
import { FACTION_MAP } from "@/data/faction-data";
import type { FactionMatchup } from "@/data/faction-matchups";

interface MatchupCardProps {
  matchup: FactionMatchup;
}

const THREAT_STYLES = {
  low: { badge: "bg-green-500/20 text-green-400", dot: "\u{1F7E2}" },
  medium: { badge: "bg-amber-400/20 text-amber-400", dot: "\u{1F7E1}" },
  high: { badge: "bg-red-500/20 text-red-400", dot: "\u{1F534}" },
};

export function MatchupCard({ matchup }: MatchupCardProps) {
  const [open, setOpen] = useState(false);
  const opponent = FACTION_MAP[matchup.opponentId];
  const styles = THREAT_STYLES[matchup.threatLevel];

  return (
    <div className="rounded-lg border border-void-lighter bg-void">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <div
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: opponent?.color ?? "#666" }}
        />
        <span className="flex-1 text-sm font-semibold text-bone">
          vs {opponent?.name ?? matchup.opponentId}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${styles.badge}`}>
          {styles.dot} {matchup.threatLevel}
        </span>
        <span className="text-bone-muted text-xs">{open ? "\u25B2" : "\u25BC"}</span>
      </button>
      {open && (
        <div className="border-t border-void-lighter px-4 py-3 space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-green-400 mb-1">
              Attack
            </p>
            <p className="text-sm text-bone-muted leading-relaxed">
              {matchup.attack}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">
              Defend
            </p>
            <p className="text-sm text-bone-muted leading-relaxed">
              {matchup.defend}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
