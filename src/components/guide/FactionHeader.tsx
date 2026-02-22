"use client";

import { theme, type FactionId } from "@/lib/theme";

interface FactionHeaderProps {
  factionId: FactionId;
  subtitle?: string;
  type?: "base" | "expansion";
}

export function FactionHeader({
  factionId,
  subtitle,
  type,
}: FactionHeaderProps) {
  const faction = theme.factions[factionId];
  if (!faction) return null;

  return (
    <div
      className="relative -mx-4 mb-8 overflow-hidden rounded-lg border p-6 sm:-mx-6 lg:-mx-8 lg:p-8"
      style={{
        borderColor: `${faction.color}40`,
        background: `linear-gradient(135deg, ${faction.color}15 0%, #0a0a0f 60%)`,
      }}
    >
      <div
        className="absolute top-0 left-0 h-1 w-full"
        style={{ backgroundColor: faction.color }}
      />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold lg:text-4xl" style={{ color: faction.color }}>
            {faction.name}
          </h1>
          {subtitle && (
            <p className="mt-2 text-lg text-bone-muted">{subtitle}</p>
          )}
        </div>
        {type && (
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: `${faction.color}20`,
              color: faction.color,
              border: `1px solid ${faction.color}40`,
            }}
          >
            {type}
          </span>
        )}
      </div>
    </div>
  );
}
