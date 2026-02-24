"use client";

import { getMatchupsForGame } from "@/data/faction-matchups";
import { MatchupCard } from "./MatchupCard";

interface OpponentCardsProps {
  factionId: string;
  allFactionIds: string[];
}

export function OpponentCards({ factionId, allFactionIds }: OpponentCardsProps) {
  const matchups = getMatchupsForGame(factionId, allFactionIds);

  if (matchups.length === 0) {
    return (
      <p className="text-sm text-bone-muted/60 italic">
        No matchup data available for this game combination yet.
      </p>
    );
  }

  const sorted = [...matchups].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.threatLevel] - order[b.threatLevel];
  });

  return (
    <div className="space-y-2">
      {sorted.map((m) => (
        <MatchupCard key={`${m.factionId}-${m.opponentId}`} matchup={m} />
      ))}
    </div>
  );
}
