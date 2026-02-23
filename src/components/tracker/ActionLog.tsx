"use client";

import { useState } from "react";
import type { ActionLogEntry } from "@/lib/tracker-session";

interface ActionLogProps {
  entries: ActionLogEntry[];
}

export function ActionLog({ entries }: ActionLogProps) {
  const [open, setOpen] = useState(false);

  if (entries.length === 0) return null;

  // Group by round, most recent first
  const reversed = [...entries].reverse();
  const grouped: Record<number, ActionLogEntry[]> = {};
  for (const entry of reversed) {
    if (!grouped[entry.round]) grouped[entry.round] = [];
    grouped[entry.round].push(entry);
  }
  const rounds = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="rounded-xl border border-void-lighter bg-void-light">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-3 text-left"
      >
        <span className="font-heading text-sm font-semibold uppercase tracking-wider text-bone-muted">
          📜 Action Log ({entries.length})
        </span>
        <span className="text-bone-muted">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="max-h-60 overflow-y-auto border-t border-void-lighter">
          {rounds.map((round) => (
            <div key={round}>
              <div className="sticky top-0 bg-void-lighter px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-bone-muted/60">
                Round {round}
              </div>
              {grouped[round].map((entry, i) => (
                <div
                  key={`${round}-${i}`}
                  className="flex items-start gap-2 px-5 py-1.5"
                >
                  <span className="mt-0.5 text-[10px] text-bone-muted/40 tabular-nums shrink-0">
                    {new Date(entry.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-xs text-bone-muted">{entry.description}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
