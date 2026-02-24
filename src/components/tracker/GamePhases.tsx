"use client";

import { useState } from "react";

interface GamePhasesProps {
  opening: string;
  earlyGame: string;
  midGame: string;
  lateGame: string;
}

const PHASES = [
  { key: "opening", label: "Opening (Turns 1-3)", emoji: "\u{1F3C1}" },
  { key: "earlyGame", label: "Early Game", emoji: "\u{1F305}" },
  { key: "midGame", label: "Mid Game", emoji: "\u2694\uFE0F" },
  { key: "lateGame", label: "Late Game", emoji: "\u{1F3C6}" },
] as const;

export function GamePhases({ opening, earlyGame, midGame, lateGame }: GamePhasesProps) {
  const [openPhase, setOpenPhase] = useState<string | null>(null);

  const content: Record<string, string> = { opening, earlyGame, midGame, lateGame };

  return (
    <div className="space-y-2">
      {PHASES.map(({ key, label, emoji }) => {
        const isOpen = openPhase === key;
        return (
          <div key={key} className="rounded-lg border border-void-lighter bg-void">
            <button
              onClick={() => setOpenPhase(isOpen ? null : key)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-sm font-semibold text-bone">
                {emoji} {label}
              </span>
              <span className="text-bone-muted text-xs">
                {isOpen ? "\u25B2" : "\u25BC"}
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-void-lighter px-4 py-3">
                <p className="text-sm text-bone-muted leading-relaxed">
                  {content[key]}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
