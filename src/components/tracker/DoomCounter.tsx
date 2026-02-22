// src/components/tracker/DoomCounter.tsx
"use client";

interface DoomCounterProps {
  value: number;
  onChange: (v: number) => void;
}

export function DoomCounter({ value, onChange }: DoomCounterProps) {
  const color =
    value >= 25 ? "text-red-400" : value >= 20 ? "text-amber-400" : "text-bone";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(value - 1)}
        className="flex h-7 w-7 items-center justify-center rounded bg-void-lighter text-bone-muted transition-colors hover:text-bone"
      >
        −
      </button>
      <span className={`w-10 text-center font-heading text-2xl font-bold tabular-nums ${color}`}>
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="flex h-7 w-7 items-center justify-center rounded bg-void-lighter text-bone-muted transition-colors hover:text-bone"
      >
        +
      </button>
    </div>
  );
}
