// src/components/tracker/SpellbookTracker.tsx
"use client";

interface SpellbookTrackerProps {
  spellbooks: boolean[];
  labels: string[]; // abbrev labels e.g. ["SUB", "DEV", ...]
  color: string;
  onToggle: (idx: number) => void;
}

export function SpellbookTracker({ spellbooks, labels, color, onToggle }: SpellbookTrackerProps) {
  return (
    <div className="flex gap-1">
      {spellbooks.map((checked, i) => (
        <button
          key={i}
          onClick={() => onToggle(i)}
          title={labels[i] ?? `Book ${i + 1}`}
          className={`flex h-7 w-7 items-center justify-center rounded text-[10px] font-bold transition-all ${
            checked ? "text-void" : "border border-void-lighter text-bone-muted/40 hover:text-bone-muted"
          }`}
          style={checked ? { backgroundColor: color } : undefined}
        >
          {labels[i]?.slice(0, 2) ?? i + 1}
        </button>
      ))}
    </div>
  );
}
