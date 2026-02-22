// src/components/tracker/PlayerCard.tsx
"use client";

import { FACTION_MAP } from "@/data/faction-data";
import type { PlayerState } from "@/lib/tracker-session";
import type { TrackerAction } from "@/lib/tracker-reducer";
import { DoomCounter } from "./DoomCounter";
import { SpellbookTracker } from "./SpellbookTracker";

interface PlayerCardProps {
  player: PlayerState;
  playerIdx: number;
  isFirstPlayer: boolean;
  dispatch: React.Dispatch<TrackerAction>;
}

export function PlayerCard({ player, playerIdx, isFirstPlayer, dispatch }: PlayerCardProps) {
  const faction = FACTION_MAP[player.factionId];
  const allBooks = player.spellbooks.every(Boolean);
  const bookLabels = faction?.spellbooks.map((b) => b.abbrev) ?? [];

  return (
    <div
      className={`rounded-xl border-2 bg-void-light p-5 transition-shadow ${
        allBooks ? "shadow-lg" : ""
      }`}
      style={{
        borderColor: allBooks ? faction?.color : `${faction?.color}44`,
        boxShadow: allBooks ? `0 0 20px ${faction?.color}33` : undefined,
      }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: faction?.color }}
          />
          <span className="font-heading text-sm font-semibold text-bone">
            {player.name}
          </span>
          {isFirstPlayer && (
            <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[10px] font-bold text-gold">
              FIRST
            </span>
          )}
        </div>
        <span className="text-xs text-bone-muted">{faction?.name}</span>
      </div>

      {/* Doom */}
      <div className="mb-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-bone-muted">
          Doom
        </p>
        <DoomCounter
          value={player.doom}
          onChange={(v) => dispatch({ type: "SET_DOOM", playerIdx, value: v })}
        />
      </div>

      {/* Stats row */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: "Gates", value: player.gates, type: "SET_GATES" as const },
          { label: "Elder Signs", value: player.elderSigns, type: "SET_ELDER_SIGNS" as const },
          { label: "Power", value: player.power, type: "SET_POWER" as const },
        ].map(({ label, value, type }) => (
          <div key={label}>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-bone-muted">
              {label}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => dispatch({ type, playerIdx, value: value - 1 })}
                className="flex h-5 w-5 items-center justify-center rounded bg-void-lighter text-xs text-bone-muted hover:text-bone"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-bold text-bone tabular-nums">
                {value}
              </span>
              <button
                onClick={() => dispatch({ type, playerIdx, value: value + 1 })}
                className="flex h-5 w-5 items-center justify-center rounded bg-void-lighter text-xs text-bone-muted hover:text-bone"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Spellbooks */}
      <div>
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-bone-muted">
          Spellbooks {allBooks && <span className="text-gold">✓ Complete</span>}
        </p>
        <SpellbookTracker
          spellbooks={player.spellbooks}
          labels={bookLabels}
          color={faction?.color ?? "#c4a84d"}
          onToggle={(bookIdx) =>
            dispatch({ type: "TOGGLE_SPELLBOOK", playerIdx, bookIdx })
          }
        />
      </div>
    </div>
  );
}
