"use client";

import { FACTION_MAP } from "@/data/faction-data";
import type { PlayerState } from "@/lib/tracker-session";

interface DoomTrackProps {
  players: PlayerState[];
}

const MAX_DOOM = 30;
const TICKS = [0, 5, 10, 15, 20, 25, 30];

export function DoomTrack({ players }: DoomTrackProps) {
  return (
    <div className="rounded-xl border border-void-lighter bg-void-light p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-bone-muted">
          Doom Track
        </span>
        <span className="text-[10px] text-bone-muted/60">30 = Final Scoring</span>
      </div>

      {/* Track bar */}
      <div className="relative h-8">
        {/* Background track */}
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-void-lighter" />

        {/* Danger zone (25-30) */}
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-r-full bg-red-500/20"
          style={{ left: `${(25 / MAX_DOOM) * 100}%`, right: "0%" }}
        />

        {/* Tick marks */}
        {TICKS.map((tick) => (
          <div
            key={tick}
            className="absolute top-1/2 -translate-x-1/2"
            style={{ left: `${(tick / MAX_DOOM) * 100}%` }}
          >
            <div className="h-3 w-px -translate-y-1/2 bg-bone-muted/30" />
            <span className="absolute top-4 -translate-x-1/2 text-[9px] text-bone-muted/50 tabular-nums">
              {tick}
            </span>
          </div>
        ))}

        {/* Player markers */}
        {players.map((player, i) => {
          const faction = FACTION_MAP[player.factionId];
          const position = Math.min(player.doom, MAX_DOOM);
          const atMax = player.doom >= MAX_DOOM;

          return (
            <div
              key={player.factionId}
              className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                atMax ? "animate-pulse" : ""
              }`}
              style={{
                left: `${(position / MAX_DOOM) * 100}%`,
                // Stack overlapping markers vertically
                marginTop: `${(i % 2 === 0 ? -1 : 1) * 8}px`,
              }}
              title={`${player.name}: ${player.doom} Doom`}
            >
              <div
                className="h-4 w-4 rounded-full border-2 border-void"
                style={{ backgroundColor: faction?.color ?? "#666" }}
              />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-3">
        {players.map((player) => {
          const faction = FACTION_MAP[player.factionId];
          return (
            <div key={player.factionId} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: faction?.color ?? "#666" }}
              />
              <span className="text-xs text-bone-muted">
                {player.name}{" "}
                <span className={`font-bold tabular-nums ${
                  player.doom >= 25 ? "text-red-400" : player.doom >= 20 ? "text-amber-400" : "text-bone"
                }`}>
                  {player.doom}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
