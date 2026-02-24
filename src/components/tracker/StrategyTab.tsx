"use client";

import { useState } from "react";
import { FACTION_MAP } from "@/data/faction-data";
import { FACTION_STRATEGIES } from "@/data/faction-strategies";
import { SpellbookPath } from "./SpellbookPath";
import { GamePhases } from "./GamePhases";
import { OpponentCards } from "./OpponentCards";
import { RulesReminders } from "./RulesReminders";

interface StrategyTabProps {
  factionId: string;
  allFactionIds: string[];
  playerName: string;
}

type Section = "spellbook" | "phases" | "opponents" | "rules";

export function StrategyTab({ factionId, allFactionIds, playerName }: StrategyTabProps) {
  const [openSections, setOpenSections] = useState<Set<Section>>(
    new Set(["spellbook"])
  );

  const faction = FACTION_MAP[factionId];
  const strategy = FACTION_STRATEGIES[factionId];

  if (!faction || !strategy) {
    return (
      <div className="rounded-xl border border-void-lighter bg-void-light p-6 text-center">
        <p className="text-bone-muted">
          Strategy guide not yet available for {faction?.name ?? factionId}.
        </p>
        <p className="mt-1 text-xs text-bone-muted/60">
          Expansion faction guides are coming in a future update.
        </p>
      </div>
    );
  }

  const toggle = (section: Section) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const sectionHeader = (
    section: Section,
    emoji: string,
    label: string,
    badge?: string
  ) => (
    <button
      onClick={() => toggle(section)}
      className="flex w-full items-center justify-between px-5 py-3 text-left"
    >
      <span className="font-heading text-sm font-semibold uppercase tracking-wider text-bone-muted">
        {emoji} {label}
        {badge && (
          <span className="ml-2 text-[10px] font-normal normal-case tracking-normal text-bone-muted/60">
            {badge}
          </span>
        )}
      </span>
      <span className="text-bone-muted">
        {openSections.has(section) ? "\u25B2" : "\u25BC"}
      </span>
    </button>
  );

  const opponentCount = allFactionIds.filter((id) => id !== factionId).length;

  return (
    <div className="space-y-4">
      {/* Player/Faction header */}
      <div className="flex items-center gap-3 px-1">
        <div
          className="h-4 w-4 rounded-full"
          style={{ backgroundColor: faction.color }}
        />
        <div>
          <h2 className="font-heading text-lg font-bold text-bone">
            {playerName}
          </h2>
          <p className="text-xs text-bone-muted">{faction.name} Strategy Guide</p>
        </div>
      </div>

      {/* Section 1: Spellbook Path */}
      <div className="rounded-xl border border-void-lighter bg-void-light">
        {sectionHeader("spellbook", "\u{1F4D6}", "Spellbook Path")}
        {openSections.has("spellbook") && (
          <div className="border-t border-void-lighter px-5 py-4">
            <SpellbookPath
              factionId={factionId}
              priority={strategy.spellbookPath.priority}
              notes={strategy.spellbookPath.notes}
            />
          </div>
        )}
      </div>

      {/* Section 2: Game Phases */}
      <div className="rounded-xl border border-void-lighter bg-void-light">
        {sectionHeader("phases", "\u2694\uFE0F", "Opening & Game Phases")}
        {openSections.has("phases") && (
          <div className="border-t border-void-lighter px-5 py-4">
            <GamePhases
              opening={strategy.opening}
              earlyGame={strategy.earlyGame}
              midGame={strategy.midGame}
              lateGame={strategy.lateGame}
            />
          </div>
        )}
      </div>

      {/* Section 3: vs Opponents */}
      <div className="rounded-xl border border-void-lighter bg-void-light">
        {sectionHeader("opponents", "\u{1F3AF}", "vs Opponents", `${opponentCount} in game`)}
        {openSections.has("opponents") && (
          <div className="border-t border-void-lighter px-5 py-4">
            <OpponentCards
              factionId={factionId}
              allFactionIds={allFactionIds}
            />
          </div>
        )}
      </div>

      {/* Section 4: Rules & Mistakes */}
      <div className="rounded-xl border border-void-lighter bg-void-light">
        {sectionHeader("rules", "\u26A0\uFE0F", "Rules & Common Mistakes")}
        {openSections.has("rules") && (
          <div className="border-t border-void-lighter px-5 py-4">
            <RulesReminders
              reminders={strategy.rulesReminders}
              mistakes={strategy.keyMistakes}
            />
          </div>
        )}
      </div>
    </div>
  );
}
