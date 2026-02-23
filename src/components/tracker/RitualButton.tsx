"use client";

import { FACTION_MAP } from "@/data/faction-data";
import type { PlayerState } from "@/lib/tracker-session";

interface RitualButtonProps {
  player: PlayerState;
  ritualCost: number;
  onPerform: () => void;
}

export function RitualButton({ player, ritualCost, onPerform }: RitualButtonProps) {
  const faction = FACTION_MAP[player.factionId];
  const canAfford = player.power >= ritualCost;
  const isInstantDeath = ritualCost > 10;

  if (isInstantDeath) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
        <span className="text-sm">☠</span>
        <span className="text-xs font-bold text-red-400">INSTANT DEATH</span>
      </div>
    );
  }

  return (
    <button
      onClick={onPerform}
      disabled={!canAfford}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
        canAfford
          ? "border-gold/40 bg-gold/10 text-gold hover:bg-gold/20"
          : "border-void-lighter text-bone-muted/40 cursor-not-allowed"
      }`}
    >
      <div
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: faction?.color }}
      />
      <span>{player.name}</span>
      <span className="text-bone-muted">
        Ritual ({ritualCost}⚡ → +{player.gates} Doom, +1 ES)
      </span>
    </button>
  );
}
