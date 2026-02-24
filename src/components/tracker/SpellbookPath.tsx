"use client";

import { useState } from "react";
import { FACTION_MAP } from "@/data/faction-data";

interface SpellbookPathProps {
  factionId: string;
  priority: string[];
  notes: string;
}

export function SpellbookPath({ factionId, priority, notes }: SpellbookPathProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const faction = FACTION_MAP[factionId];
  if (!faction) return null;

  const spellbookLookup = Object.fromEntries(
    faction.spellbooks.map((sb) => [sb.name, sb])
  );

  return (
    <div>
      <ol className="space-y-2">
        {priority.map((name, i) => {
          const sb = spellbookLookup[name];
          const isExpanded = expandedIdx === i;
          return (
            <li key={name}>
              <button
                onClick={() => setExpandedIdx(isExpanded ? null : i)}
                className="flex w-full items-center gap-3 rounded-lg border border-void-lighter bg-void px-4 py-2.5 text-left transition-colors hover:border-bone-muted/30"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-void-lighter text-xs font-bold text-bone-muted">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-semibold text-bone">
                  {name}
                </span>
                {sb && (
                  <span className="rounded bg-void-lighter px-2 py-0.5 text-[10px] font-bold text-bone-muted">
                    {sb.abbrev}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
      {notes && (
        <p className="mt-3 text-xs text-bone-muted/80 italic leading-relaxed">
          {notes}
        </p>
      )}
    </div>
  );
}
