"use client";

import { useState } from "react";
import { FACTION_UNITS } from "@/data/faction-units";

interface UnitTrackerProps {
  factionId: string;
  units: Record<string, number>;
  factionColor: string;
  onSetUnit: (unitId: string, count: number) => void;
}

export function UnitTracker({ factionId, units, factionColor, onSetUnit }: UnitTrackerProps) {
  const [open, setOpen] = useState(false);
  const roster = FACTION_UNITS[factionId] ?? [];

  if (roster.length === 0) return null;

  const totalDeployed = roster.reduce((sum, u) => sum + (units[u.id] ?? 0), 0);
  const totalMax = roster.reduce((sum, u) => sum + u.max, 0);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-1"
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest text-bone-muted">
          Units {totalDeployed}/{totalMax}
        </span>
        <span className="text-[10px] text-bone-muted">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-1 space-y-1">
          {roster.map((unit) => {
            const count = units[unit.id] ?? 0;
            return (
              <div key={unit.id} className="flex items-center gap-2">
                <span className={`flex-1 text-xs ${unit.isGOO ? "font-bold text-bone" : "text-bone-muted"}`}>
                  {unit.name}
                  {unit.isGOO && <span className="ml-1 text-[9px] text-gold">GOO</span>}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSetUnit(unit.id, count - 1)}
                    disabled={count <= 0}
                    className="flex h-5 w-5 items-center justify-center rounded bg-void-lighter text-[10px] text-bone-muted hover:text-bone disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-xs font-medium tabular-nums text-bone">
                    {count}
                    <span className="text-bone-muted/40">/{unit.max}</span>
                  </span>
                  <button
                    onClick={() => onSetUnit(unit.id, count + 1)}
                    disabled={count >= unit.max}
                    className="flex h-5 w-5 items-center justify-center rounded bg-void-lighter text-[10px] text-bone-muted hover:text-bone disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
