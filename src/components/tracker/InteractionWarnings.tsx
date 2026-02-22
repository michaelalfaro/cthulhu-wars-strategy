// src/components/tracker/InteractionWarnings.tsx
"use client";

import { useState } from "react";
import { INTERACTION_TIPS, type Severity } from "@/data/faction-interactions";
import { FACTION_MAP } from "@/data/faction-data";

interface InteractionWarningsProps {
  factionIds: string[];
}

const SEVERITY_STYLES: Record<Severity, { border: string; bg: string; dot: string }> = {
  critical: { border: "border-red-500/30", bg: "bg-red-500/5", dot: "bg-red-500" },
  warning: { border: "border-amber-400/30", bg: "bg-amber-400/5", dot: "bg-amber-400" },
  info: { border: "border-bone-muted/20", bg: "bg-void-light", dot: "bg-bone-muted" },
};

export function InteractionWarnings({ factionIds }: InteractionWarningsProps) {
  const [open, setOpen] = useState(true);

  const relevantTips = INTERACTION_TIPS.filter((tip) =>
    tip.factions.every((f) => factionIds.includes(f))
  );

  // Sort: critical first, then warning, then info
  const sorted = [...relevantTips].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });

  if (sorted.length === 0) return null;

  return (
    <div className="rounded-xl border border-void-lighter bg-void-light">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-3 text-left"
      >
        <span className="font-heading text-sm font-semibold uppercase tracking-wider text-bone-muted">
          ⚠ Interaction Warnings ({sorted.length})
        </span>
        <span className="text-bone-muted">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="divide-y divide-void-lighter border-t border-void-lighter">
          {sorted.map((tip) => {
            const styles = SEVERITY_STYLES[tip.severity];
            return (
              <div
                key={tip.id}
                className={`flex gap-3 px-5 py-3 ${styles.bg}`}
              >
                <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${styles.dot}`} />
                <div className="flex-1">
                  {tip.factions.length > 1 && (
                    <div className="mb-1 flex flex-wrap gap-1">
                      {tip.factions.map((fId) => {
                        const f = FACTION_MAP[fId];
                        return (
                          <span
                            key={fId}
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold text-void"
                            style={{ backgroundColor: f?.color ?? "#666" }}
                          >
                            {f?.name ?? fId}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-sm text-bone-muted">{tip.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
