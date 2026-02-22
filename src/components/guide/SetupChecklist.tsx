"use client";

import { useState, useCallback, useMemo } from "react";

export interface ChecklistItem {
  text: string;
  note?: string;
}

export interface ChecklistSection {
  title: string;
  color?: string;
  items: (string | ChecklistItem)[];
}

interface SetupChecklistProps {
  sections?: ChecklistSection[];
}

function normalise(item: string | ChecklistItem): ChecklistItem {
  return typeof item === "string" ? { text: item } : item;
}

export function SetupChecklist({ sections = [] }: SetupChecklistProps) {
  // Pre-calculate flat items and per-section start indices (avoids mutation during render)
  const { flatItems, sectionOffsets } = useMemo(() => {
    const flat: ChecklistItem[] = [];
    const offsets: number[] = [];
    for (const section of sections) {
      offsets.push(flat.length);
      for (const item of section.items) flat.push(normalise(item));
    }
    return { flatItems: flat, sectionOffsets: offsets };
  }, [sections]);

  const total = flatItems.length;
  const [checked, setChecked] = useState<boolean[]>(() => Array(total).fill(false));
  const done = checked.filter(Boolean).length;

  const toggle = useCallback((idx: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  }, []);

  const reset = useCallback(() => setChecked(Array(total).fill(false)), [total]);

  if (sections.length === 0) return null;

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-void-lighter bg-void-light">
      {/* Progress header */}
      <div className="flex items-center justify-between border-b border-void-lighter px-5 py-3">
        <div className="flex items-center gap-3">
          <div
            className="h-2 w-24 overflow-hidden rounded-full bg-void-lighter"
            title={`${done} of ${total} steps complete`}
          >
            <div
              className="h-full rounded-full bg-gold transition-all duration-300"
              style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }}
            />
          </div>
          <span className="text-xs text-bone-muted">
            {done} / {total} complete
          </span>
        </div>
        <button
          onClick={reset}
          className="text-xs text-bone-muted/60 transition-colors hover:text-bone-muted"
        >
          Reset all
        </button>
      </div>

      {/* Sections */}
      <div className="divide-y divide-void-lighter">
        {sections.map((section, sIdx) => {
          const startIdx = sectionOffsets[sIdx] ?? 0;
          const sectionItems = section.items.map(normalise);
          const accentColor = section.color ?? "#c4a84d";

          return (
            <div key={`section-${sIdx}`} className="px-5 py-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-3 w-1 rounded-full" style={{ backgroundColor: accentColor }} />
                <h3
                  className="font-heading text-sm font-semibold uppercase tracking-wide"
                  style={{ color: accentColor }}
                >
                  {section.title}
                </h3>
              </div>

              <ul className="space-y-2">
                {sectionItems.map((item, i) => {
                  const idx = startIdx + i;
                  const isChecked = checked[idx] ?? false;

                  return (
                    <li key={`item-${idx}`}>
                      <label className="group flex cursor-pointer items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggle(idx)}
                            className="sr-only"
                          />
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                              isChecked
                                ? "border-transparent"
                                : "border-bone-muted/30 group-hover:border-bone-muted/60"
                            }`}
                            style={isChecked ? { backgroundColor: accentColor } : undefined}
                          >
                            {isChecked && (
                              <svg className="h-2.5 w-2.5 text-void" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div>
                          <span
                            className={`text-sm leading-snug transition-colors ${
                              isChecked ? "text-bone-muted/40 line-through" : "text-bone"
                            }`}
                          >
                            {item.text}
                          </span>
                          {item.note && (
                            <p className="mt-0.5 text-xs text-bone-muted/60">{item.note}</p>
                          )}
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
