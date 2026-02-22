"use client";

interface UnitStatBlockProps {
  name: string;
  cost: number;
  combat: number;
  count?: number;
  abilities?: string[];
  factionColor?: string;
  type?: "cultist" | "monster" | "terror" | "goo";
}

const typeLabels: Record<string, string> = {
  cultist: "Cultist",
  monster: "Monster",
  terror: "Terror",
  goo: "Great Old One",
};

export function UnitStatBlock({
  name,
  cost,
  combat,
  count,
  abilities,
  factionColor = "#e8dcc8",
  type,
}: UnitStatBlockProps) {
  return (
    <div
      className="my-4 overflow-hidden rounded-lg border"
      style={{ borderColor: `${factionColor}30` }}
    >
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ backgroundColor: `${factionColor}15` }}
      >
        <div className="flex items-center gap-3">
          <h4 className="m-0 text-lg font-bold" style={{ color: factionColor }}>
            {name}
          </h4>
          {type && (
            <span className="text-xs uppercase tracking-wider text-bone-muted">
              {typeLabels[type] || type}
            </span>
          )}
        </div>
        {count !== undefined && (
          <span className="text-sm text-bone-muted">x{count}</span>
        )}
      </div>
      <div className="px-4 py-3">
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-bone-muted">
              Cost
            </div>
            <div className="text-2xl font-bold text-bone">{cost}</div>
          </div>
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-bone-muted">
              Combat
            </div>
            <div className="text-2xl font-bold text-bone">{combat}</div>
          </div>
        </div>
        {abilities && abilities.length > 0 && (
          <div className="mt-3 border-t border-elder-700 pt-3">
            <div className="text-xs uppercase tracking-wider text-bone-muted mb-1">
              Abilities
            </div>
            <ul className="m-0 list-none space-y-1 p-0">
              {abilities.map((ability) => (
                <li key={ability} className="text-sm text-bone">
                  {ability}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
