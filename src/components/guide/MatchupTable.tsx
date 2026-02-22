"use client";

interface Matchup {
  faction: string;
  rating: number;
  notes: string;
  color?: string;
}

interface MatchupTableProps {
  matchups: Matchup[];
  factionColor?: string;
}

const ratingLabels: Record<number, string> = {
  1: "Very Hard",
  2: "Hard",
  3: "Even",
  4: "Favorable",
  5: "Very Favorable",
};

export function MatchupTable({ matchups, factionColor = "#e8dcc8" }: MatchupTableProps) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-elder-700">
            <th className="py-2 pr-4 text-left text-sm font-semibold text-bone-muted">
              Opponent
            </th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-bone-muted">
              Rating
            </th>
            <th className="py-2 pl-4 text-left text-sm font-semibold text-bone-muted">
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          {matchups.map((m) => (
            <tr key={m.faction} className="border-b border-elder-800">
              <td className="py-2 pr-4 font-medium text-bone" style={{ color: m.color }}>
                {m.faction}
              </td>
              <td className="py-2 px-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="h-2 w-4 rounded-sm"
                        style={{
                          backgroundColor:
                            n <= m.rating ? factionColor : "rgba(255,255,255,0.1)",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-bone-muted">
                    {ratingLabels[m.rating] || ""}
                  </span>
                </div>
              </td>
              <td className="py-2 pl-4 text-sm text-bone-muted">{m.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
