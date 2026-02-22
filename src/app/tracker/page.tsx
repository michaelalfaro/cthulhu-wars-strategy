// src/app/tracker/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSessionIndex, loadSession, deleteSession } from "@/lib/tracker-session";
import { FACTION_MAP, MAPS } from "@/data/faction-data";
import type { TrackerSession } from "@/lib/tracker-session";

export default function TrackerHubPage() {
  const [sessions, setSessions] = useState<TrackerSession[]>([]);

  useEffect(() => {
    const ids = loadSessionIndex();
    const loaded = ids
      .map((id) => loadSession(id))
      .filter(Boolean) as TrackerSession[];
    // Most recent first
    setSessions(loaded.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }, []);

  function handleDelete(id: string) {
    deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  const mapName = (id: string) =>
    MAPS.find((m) => m.id === id)?.name ?? id;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-bone">Game Tracker</h1>
          <p className="mt-1 text-sm text-bone-muted">
            Round-by-round companion for your Cthulhu Wars sessions.
          </p>
        </div>
        <Link
          href="/tracker/setup"
          className="rounded-lg bg-gold px-4 py-2 font-heading text-sm font-semibold text-void transition-opacity hover:opacity-90"
        >
          New Game →
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-lg border border-void-lighter bg-void-light px-8 py-16 text-center">
          <p className="text-2xl">🎲</p>
          <p className="mt-3 font-heading text-bone">No saved sessions yet</p>
          <p className="mt-1 text-sm text-bone-muted">
            Start a new game to begin tracking.
          </p>
          <Link
            href="/tracker/setup"
            className="mt-4 inline-block rounded-lg bg-gold px-4 py-2 font-heading text-sm font-semibold text-void"
          >
            New Game →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-4 rounded-lg border border-void-lighter bg-void-light px-5 py-4"
            >
              {/* Faction color chips */}
              <div className="flex gap-1">
                {s.players.map((p) => {
                  const f = FACTION_MAP[p.factionId];
                  return (
                    <div
                      key={p.factionId}
                      className="h-5 w-5 rounded-full border-2 border-void"
                      style={{ backgroundColor: f?.color ?? "#666" }}
                      title={f?.name ?? p.factionId}
                    />
                  );
                })}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-bone">
                  {s.players.map((p) => FACTION_MAP[p.factionId]?.name ?? p.factionId).join(" · ")}
                </p>
                <p className="text-xs text-bone-muted">
                  {mapName(s.map)} · Round {s.round} ·{" "}
                  {new Date(s.createdAt).toLocaleDateString()}
                  {s.completedAt && (
                    <span className="ml-2 rounded bg-gold/20 px-1.5 py-0.5 text-gold">
                      Complete
                    </span>
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/tracker/${s.id}`}
                  className="rounded bg-void-lighter px-3 py-1.5 text-xs font-medium text-bone transition-colors hover:bg-void-lighter/80"
                >
                  {s.completedAt ? "View" : "Resume"}
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm("Delete this session? This cannot be undone.")) {
                      handleDelete(s.id);
                    }
                  }}
                  className="rounded px-3 py-1.5 text-xs text-bone-muted/60 transition-colors hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
