"use client";

import type { PlayerState } from "@/lib/tracker-session";
import { RitualButton } from "./RitualButton";

type Phase = "gather" | "action" | "doom";

interface PhaseActionsProps {
  phase: Phase;
  players: PlayerState[];
  ritualCost: number;
  onGatherPower: () => void;
  onScoreDoom: () => void;
  onPerformRitual: (playerIdx: number) => void;
}

export function PhaseActions({
  phase,
  players,
  ritualCost,
  onGatherPower,
  onScoreDoom,
  onPerformRitual,
}: PhaseActionsProps) {
  return (
    <div className="rounded-xl border border-void-lighter bg-void-light p-4">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-bone-muted">
        Phase Actions
      </p>

      {phase === "gather" && (
        <div className="space-y-2">
          <p className="text-xs text-bone-muted">
            Each player gains Power = 2 x Gates controlled.
          </p>
          <button
            onClick={onGatherPower}
            className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-400/20"
          >
            ⚡ Gather Power for All Players
          </button>
          <div className="flex flex-wrap gap-2 text-xs text-bone-muted/60">
            {players.map((p) => (
              <span key={p.factionId}>
                {p.name}: {p.gates} gates → {2 * p.gates}⚡
              </span>
            ))}
          </div>
        </div>
      )}

      {phase === "action" && (
        <p className="text-xs text-bone-muted">
          Players take turns performing actions. Advance to Doom Phase when all players pass.
        </p>
      )}

      {phase === "doom" && (
        <div className="space-y-4">
          {/* Score Doom */}
          <div>
            <p className="mb-2 text-xs text-bone-muted">
              Each player scores 1 Doom per Gate controlled.
            </p>
            <button
              onClick={onScoreDoom}
              className="rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-400/20"
            >
              💀 Score Doom for All Players
            </button>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-bone-muted/60">
              {players.map((p) => (
                <span key={p.factionId}>
                  {p.name}: +{p.gates} Doom
                </span>
              ))}
            </div>
          </div>

          {/* Ritual of Annihilation */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="text-xs text-bone-muted">Ritual of Annihilation</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                ritualCost > 10
                  ? "bg-red-500/20 text-red-400"
                  : ritualCost >= 8
                  ? "bg-amber-400/20 text-amber-400"
                  : "bg-void-lighter text-bone-muted"
              }`}>
                Cost: {ritualCost > 10 ? "☠ DEAD" : `${ritualCost}⚡`}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {players.map((player, i) => (
                <RitualButton
                  key={player.factionId}
                  player={player}
                  ritualCost={ritualCost}
                  onPerform={() => onPerformRitual(i)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
