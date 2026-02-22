// src/app/tracker/[sessionId]/page.tsx
"use client";

import { useEffect, useReducer, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { loadSession, saveSession } from "@/lib/tracker-session";
import { trackerReducer } from "@/lib/tracker-reducer";
import type { TrackerSession } from "@/lib/tracker-session";
import { FACTION_MAP } from "@/data/faction-data";
import { PlayerCard } from "@/components/tracker/PlayerCard";
import { InteractionWarnings } from "@/components/tracker/InteractionWarnings";

const EMPTY_SESSION: TrackerSession = {
  id: "",
  createdAt: "",
  map: "earth",
  expansions: [],
  round: 1,
  firstPlayer: 0,
  direction: "cw",
  players: [],
};

export default function TrackerPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [session, dispatch] = useReducer(trackerReducer, EMPTY_SESSION);
  const loaded = useRef(false);

  // Load session from localStorage on mount
  useEffect(() => {
    const s = loadSession(sessionId);
    if (!s) {
      router.replace("/tracker");
      return;
    }
    dispatch({ type: "LOAD", session: s });
    loaded.current = true;
  }, [sessionId, router]);

  // Auto-save on every state change (after initial load)
  useEffect(() => {
    if (!loaded.current || !session.id) return;
    saveSession(session);
  }, [session]);

  function handleEndGame() {
    const completed = { ...session, completedAt: new Date().toISOString() };
    saveSession(completed);
    router.push("/tracker");
  }

  if (!session.id) {
    return (
      <div className="p-12 text-center text-bone-muted">Loading session…</div>
    );
  }

  const factionIds = session.players.map((p) => p.factionId);
  const playerCount = session.players.length;
  const gridCols =
    playerCount <= 2 ? "grid-cols-1 sm:grid-cols-2" :
    playerCount === 3 ? "grid-cols-1 sm:grid-cols-3" :
    playerCount === 4 ? "grid-cols-2" :
    "grid-cols-2 sm:grid-cols-3";

  const firstPlayerName =
    session.players[session.firstPlayer]?.name ?? `Player ${session.firstPlayer + 1}`;
  const firstFaction = FACTION_MAP[session.players[session.firstPlayer]?.factionId ?? ""];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Round controls */}
          <div className="flex items-center gap-2 rounded-lg border border-void-lighter bg-void-light px-4 py-2">
            <button
              onClick={() => dispatch({ type: "PREV_ROUND" })}
              className="text-bone-muted transition-colors hover:text-bone disabled:opacity-30"
              disabled={session.round <= 1}
            >
              ←
            </button>
            <span className="font-heading text-sm font-bold text-bone">
              Round {session.round}
            </span>
            <button
              onClick={() => dispatch({ type: "NEXT_ROUND" })}
              className="text-bone-muted transition-colors hover:text-bone"
            >
              →
            </button>
          </div>

          {/* First player */}
          <div className="flex items-center gap-2 text-sm text-bone-muted">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: firstFaction?.color }}
            />
            <span>
              {firstPlayerName}{" "}
              <span className="text-bone-muted/60">
                {session.direction === "cw" ? "↻" : "↺"}
              </span>
            </span>
            {/* Cycle first player */}
            <button
              onClick={() =>
                dispatch({
                  type: "SET_FIRST_PLAYER",
                  playerIdx: (session.firstPlayer + 1) % playerCount,
                })
              }
              className="rounded border border-void-lighter px-2 py-0.5 text-[10px] text-bone-muted hover:text-bone"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/tracker"
            className="rounded border border-void-lighter px-3 py-1.5 text-xs text-bone-muted hover:text-bone"
          >
            ← Hub
          </Link>
          <button
            onClick={handleEndGame}
            className="rounded border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/20"
          >
            End Game
          </button>
        </div>
      </div>

      {/* Player grid */}
      <div className={`mb-6 grid gap-4 ${gridCols}`}>
        {session.players.map((player, i) => (
          <PlayerCard
            key={player.factionId}
            player={player}
            playerIdx={i}
            isFirstPlayer={i === session.firstPlayer}
            dispatch={dispatch}
          />
        ))}
      </div>

      {/* Interaction warnings */}
      <InteractionWarnings factionIds={factionIds} />
    </div>
  );
}
