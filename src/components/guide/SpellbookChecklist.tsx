"use client";

import { useState } from "react";

interface Spellbook {
  name: string;
  unlock: string;
  effect: string;
}

interface SpellbookChecklistProps {
  spellbooks: Spellbook[];
  factionColor?: string;
}

export function SpellbookChecklist({
  spellbooks,
  factionColor = "#e8dcc8",
}: SpellbookChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="my-6">
      <h3 className="mb-3 text-lg font-bold text-bone">
        Spellbooks ({checked.size}/{spellbooks.length})
      </h3>
      <div className="space-y-2">
        {spellbooks.map((sb, i) => (
          <div
            key={sb.name}
            className="rounded-lg border p-3 transition-colors cursor-pointer"
            style={{
              borderColor: checked.has(i) ? `${factionColor}60` : "rgba(255,255,255,0.1)",
              backgroundColor: checked.has(i) ? `${factionColor}10` : "transparent",
            }}
            onClick={() => toggle(i)}
          >
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border"
                style={{
                  borderColor: checked.has(i) ? factionColor : "rgba(255,255,255,0.3)",
                  backgroundColor: checked.has(i) ? factionColor : "transparent",
                }}
              >
                {checked.has(i) && (
                  <span className="text-xs text-white">&#10003;</span>
                )}
              </div>
              <div>
                <div className="font-semibold text-bone">{sb.name}</div>
                <div className="mt-1 text-xs text-bone-muted">
                  Unlock: {sb.unlock}
                </div>
                <div className="mt-1 text-sm text-bone">{sb.effect}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
