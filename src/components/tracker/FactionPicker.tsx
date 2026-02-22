// src/components/tracker/FactionPicker.tsx
"use client";

import { FACTIONS, type FactionData } from "@/data/faction-data";

interface FactionPickerProps {
  selected: string[];
  onChange: (ids: string[]) => void;
  maxSelect?: number;
}

export function FactionPicker({ selected, onChange, maxSelect = 5 }: FactionPickerProps) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else if (selected.length < maxSelect) {
      onChange([...selected, id]);
    }
  }

  const base = FACTIONS.filter((f) => f.type === "base");
  const expansion = FACTIONS.filter((f) => f.type === "expansion");

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-bone-muted">
          Core Factions
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {base.map((f) => <FactionCard key={f.id} faction={f} selected={selected.includes(f.id)} onToggle={() => toggle(f.id)} />)}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-bone-muted">
          Expansion Factions
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {expansion.map((f) => <FactionCard key={f.id} faction={f} selected={selected.includes(f.id)} onToggle={() => toggle(f.id)} />)}
        </div>
      </div>
    </div>
  );
}

function FactionCard({ faction, selected, onToggle }: { faction: FactionData; selected: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`rounded-lg border-2 px-3 py-2 text-left transition-all ${
        selected
          ? "border-transparent shadow-md"
          : "border-void-lighter bg-void-light hover:border-void-lighter/60"
      }`}
      style={selected ? { borderColor: faction.color, backgroundColor: `${faction.color}22` } : undefined}
    >
      <div
        className="mb-1 h-1.5 w-8 rounded-full"
        style={{ backgroundColor: faction.color }}
      />
      <p className="text-xs font-semibold text-bone leading-tight">{faction.name}</p>
    </button>
  );
}
