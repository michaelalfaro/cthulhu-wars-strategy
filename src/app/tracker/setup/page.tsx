// src/app/tracker/setup/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import { FactionPicker } from "@/components/tracker/FactionPicker";
import { MAPS, EXPANSIONS } from "@/data/faction-data";
import { saveSession, createDefaultPlayers } from "@/lib/tracker-session";

function SetupForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [factions, setFactions] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [map, setMap] = useState("earth");
  const [expansions, setExpansions] = useState<string[]>([]);
  const [firstPlayer, setFirstPlayer] = useState(0);
  const [direction, setDirection] = useState<"cw" | "ccw">("cw");

  // Pre-populate from URL params
  useEffect(() => {
    const f = params.get("factions");
    if (f) setFactions(f.split(",").filter(Boolean));
    const m = params.get("map");
    if (m) setMap(m);
    const e = params.get("expansions");
    if (e) setExpansions(e.split(",").filter(Boolean));
  }, [params]);

  // Sync names array length to factions
  useEffect(() => {
    setNames((prev) =>
      factions.map((_, i) => prev[i] ?? `Player ${i + 1}`)
    );
  }, [factions]);

  function toggleExpansion(id: string) {
    setExpansions((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  }

  function handleBegin() {
    if (factions.length < 2) return;
    const id = nanoid(6);
    const session = {
      id,
      createdAt: new Date().toISOString(),
      map,
      expansions,
      round: 1,
      firstPlayer,
      direction,
      players: createDefaultPlayers(factions, names),
    };
    saveSession(session);
    router.push(`/tracker/${id}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-heading text-3xl font-bold text-bone">New Game</h1>
      <p className="mt-1 mb-8 text-sm text-bone-muted">
        Configure your session. Select 2–5 factions.
      </p>

      {/* Faction Picker */}
      <section className="mb-8">
        <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-widest text-gold">
          Factions ({factions.length}/5)
        </h2>
        <FactionPicker selected={factions} onChange={setFactions} />
      </section>

      {/* Player Names */}
      {factions.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-widest text-gold">
            Player Names
          </h2>
          <div className="space-y-2">
            {factions.map((fId, i) => (
              <div key={fId} className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full shrink-0" />
                <input
                  type="text"
                  value={names[i] ?? ""}
                  onChange={(e) => {
                    const next = [...names];
                    next[i] = e.target.value;
                    setNames(next);
                  }}
                  placeholder={`Player ${i + 1}`}
                  className="flex-1 rounded border border-void-lighter bg-void-light px-3 py-2 text-sm text-bone placeholder-bone-muted/40 outline-none focus:border-gold"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Map */}
      <section className="mb-8">
        <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-widest text-gold">
          Map
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MAPS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMap(m.id)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                map === m.id
                  ? "border-gold bg-gold/10 text-bone"
                  : "border-void-lighter bg-void-light text-bone-muted hover:text-bone"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </section>

      {/* Expansions */}
      <section className="mb-8">
        <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-widest text-gold">
          Expansions in Play
        </h2>
        <div className="flex flex-wrap gap-2">
          {EXPANSIONS.map((e) => (
            <button
              key={e.id}
              onClick={() => toggleExpansion(e.id)}
              className={`rounded-full border px-3 py-1 text-xs transition-all ${
                expansions.includes(e.id)
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-void-lighter text-bone-muted hover:text-bone"
              }`}
            >
              {e.name}
            </button>
          ))}
        </div>
      </section>

      {/* First Player & Direction */}
      {factions.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-widest text-gold">
            First Player
          </h2>
          <div className="flex flex-wrap gap-2">
            {factions.map((_, i) => (
              <button
                key={i}
                onClick={() => setFirstPlayer(i)}
                className={`rounded border px-3 py-1 text-sm transition-all ${
                  firstPlayer === i
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-void-lighter text-bone-muted"
                }`}
              >
                {names[i] || `Player ${i + 1}`}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            {(["cw", "ccw"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDirection(d)}
                className={`rounded border px-3 py-1 text-sm transition-all ${
                  direction === d
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-void-lighter text-bone-muted"
                }`}
              >
                {d === "cw" ? "↻ Clockwise" : "↺ Counter-clockwise"}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Begin */}
      <button
        onClick={handleBegin}
        disabled={factions.length < 2}
        className="w-full rounded-lg bg-gold py-3 font-heading font-semibold text-void transition-opacity disabled:opacity-40 hover:opacity-90"
      >
        Begin Game →
      </button>
    </div>
  );
}

export default function TrackerSetupPage() {
  return (
    <Suspense fallback={<div className="p-12 text-bone-muted">Loading…</div>}>
      <SetupForm />
    </Suspense>
  );
}
