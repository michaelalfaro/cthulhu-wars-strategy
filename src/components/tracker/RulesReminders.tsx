"use client";

interface RulesRemindersProps {
  reminders: string[];
  mistakes: string[];
}

export function RulesReminders({ reminders, mistakes }: RulesRemindersProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-bone-muted/60 mb-2">
          Rules
        </p>
        <ul className="space-y-2">
          {reminders.map((r, i) => (
            <li
              key={i}
              className="flex gap-2 rounded-lg border border-void-lighter bg-void px-4 py-2.5 text-sm text-bone-muted leading-relaxed"
            >
              <span className="shrink-0 text-amber-400">{"\u26A0"}</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-bone-muted/60 mb-2">
          Common Mistakes
        </p>
        <ul className="space-y-2">
          {mistakes.map((m, i) => (
            <li
              key={i}
              className="flex gap-2 rounded-lg border border-void-lighter bg-void px-4 py-2.5 text-sm text-bone-muted leading-relaxed"
            >
              <span className="shrink-0 text-red-400">{"\u2717"}</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
