"use client";

type Phase = "gather" | "action" | "doom";

interface PhaseBarProps {
  phase: Phase;
  onAdvance: () => void;
}

const PHASE_LABELS: Record<Phase, { label: string; icon: string; color: string }> = {
  gather: { label: "Gather Power", icon: "⚡", color: "text-amber-400" },
  action: { label: "Action Phase", icon: "⚔️", color: "text-blue-400" },
  doom: { label: "Doom Phase", icon: "💀", color: "text-red-400" },
};

const PHASE_ORDER: Phase[] = ["gather", "action", "doom"];

export function PhaseBar({ phase, onAdvance }: PhaseBarProps) {
  const current = PHASE_LABELS[phase];
  const nextPhase = PHASE_ORDER[(PHASE_ORDER.indexOf(phase) + 1) % PHASE_ORDER.length];
  const isNewRound = nextPhase === "gather";

  return (
    <div className="flex items-center gap-3">
      {/* Phase steps */}
      <div className="flex items-center gap-1">
        {PHASE_ORDER.map((p) => {
          const info = PHASE_LABELS[p];
          const isActive = p === phase;
          const isPast = PHASE_ORDER.indexOf(p) < PHASE_ORDER.indexOf(phase);

          return (
            <div
              key={p}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                isActive
                  ? `${info.color} bg-void-lighter border border-current`
                  : isPast
                  ? "text-bone-muted/40 line-through"
                  : "text-bone-muted/40"
              }`}
            >
              <span>{info.icon}</span>
              <span className="hidden sm:inline">{info.label}</span>
            </div>
          );
        })}
      </div>

      {/* Advance button */}
      <button
        onClick={onAdvance}
        className="rounded-lg border border-void-lighter bg-void-lighter px-3 py-1.5 text-xs font-medium text-bone-muted transition-colors hover:text-bone hover:border-gold/40"
      >
        {isNewRound ? "Next Round →" : `${PHASE_LABELS[nextPhase].icon} ${PHASE_LABELS[nextPhase].label} →`}
      </button>
    </div>
  );
}
