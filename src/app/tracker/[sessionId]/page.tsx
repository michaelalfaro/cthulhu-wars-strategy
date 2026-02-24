// src/app/tracker/[sessionId]/page.tsx
"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { loadSession, saveSession } from "@/lib/tracker-session";
import { trackerReducer } from "@/lib/tracker-reducer";
import type { TrackerAction } from "@/lib/tracker-reducer";
import type { TrackerSession } from "@/lib/tracker-session";
import { undoReducer, type UndoState, type UndoAction } from "@/lib/use-undo-reducer";
import { FACTION_MAP } from "@/data/faction-data";
import { PlayerCard } from "@/components/tracker/PlayerCard";
import { InteractionWarnings } from "@/components/tracker/InteractionWarnings";
import { DoomTrack } from "@/components/tracker/DoomTrack";
import { PhaseBar } from "@/components/tracker/PhaseBar";
import { PhaseActions } from "@/components/tracker/PhaseActions";
import { ActionLog } from "@/components/tracker/ActionLog";
import { StrategyTab } from "@/components/tracker/StrategyTab";

const EMPTY_SESSION: TrackerSession = {
  id: "",
  createdAt: "",
  map: "earth",
  expansions: [],
  round: 1,
  firstPlayer: 0,
  direction: "cw",
  ritualCost: 5,
  phase: "action" as const,
  actionLog: [],
  players: [],
};

const INITIAL_UNDO_STATE: UndoState = {
  past: [],
  present: EMPTY_SESSION,
};

function wrappedUndoReducer(state: UndoState, action: UndoAction): UndoState {
  return undoReducer(state, action, trackerReducer);
}

export default function TrackerPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [undoState, rawDispatch] = useReducer(wrappedUndoReducer, INITIAL_UNDO_STATE);
  const session = undoState.present;
  const canUndo = undoState.past.length > 0;
  const loaded = useRef(false);
  const [activeTab, setActiveTab] = useState<"game" | "strategy" | "log">("game");
  const [strategyPlayerIdx, setStrategyPlayerIdx] = useState(0);

  // Typed dispatch that accepts both TrackerAction and UndoAction
  const dispatch = useCallback(
    (action: UndoAction) => rawDispatch(action),
    []
  );

  // Load session from localStorage on mount
  useEffect(() => {
    const s = loadSession(sessionId);
    if (!s) {
      router.replace("/tracker");
      return;
    }
    dispatch({ type: "LOAD", session: s });
    loaded.current = true;
  }, [sessionId, router, dispatch]);

  // Auto-save on every state change (after initial load)
  useEffect(() => {
    if (!loaded.current || !session.id) return;
    saveSession(session);
  }, [session]);

  function handleEndGame() {
    dispatch({ type: "END_GAME" });
    // Save after a tick so the reducer processes first
    setTimeout(() => {
      router.push("/tracker");
    }, 100);
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
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

          {/* Phase bar */}
          <PhaseBar
            phase={session.phase}
            onAdvance={() => dispatch({ type: "ADVANCE_PHASE" })}
          />

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
          {/* Undo button */}
          <button
            onClick={() => dispatch({ type: "UNDO" })}
            disabled={!canUndo}
            className="rounded border border-void-lighter px-3 py-1.5 text-xs text-bone-muted transition-colors hover:text-bone disabled:opacity-30 disabled:cursor-not-allowed"
            title={canUndo ? `Undo (${undoState.past.length})` : "Nothing to undo"}
          >
            ↩ Undo{canUndo && ` (${undoState.past.length})`}
          </button>
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

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-lg border border-void-lighter bg-void-light p-1">
        {(["game", "strategy", "log"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-heading font-semibold uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? "bg-void-lighter text-bone"
                : "text-bone-muted hover:text-bone"
            }`}
          >
            {tab === "game" ? "Game" : tab === "strategy" ? "Strategy" : "Log"}
          </button>
        ))}
      </div>

      {activeTab === "game" && (
        <>
          {/* Doom Track */}
          <div className="mb-6">
            <DoomTrack players={session.players} />
          </div>

          {/* Player grid */}
          <div className={`mb-6 grid gap-4 ${gridCols}`}>
            {session.players.map((player, i) => (
              <PlayerCard
                key={player.factionId}
                player={player}
                playerIdx={i}
                isFirstPlayer={i === session.firstPlayer}
                dispatch={dispatch as React.Dispatch<TrackerAction>}
              />
            ))}
          </div>

          {/* Phase Actions */}
          <div className="mb-6">
            <PhaseActions
              phase={session.phase}
              players={session.players}
              ritualCost={session.ritualCost}
              onGatherPower={() => dispatch({ type: "GATHER_POWER" })}
              onScoreDoom={() => dispatch({ type: "SCORE_DOOM" })}
              onPerformRitual={(playerIdx) =>
                dispatch({ type: "PERFORM_RITUAL", playerIdx })
              }
            />
          </div>

          {/* Interaction warnings */}
          <div className="mb-6">
            <InteractionWarnings factionIds={factionIds} />
          </div>

          {/* Doom-30 Final Scoring Banner */}
          {session.players.some((p) => p.doom >= 30) && (
            <div className="rounded-xl border border-gold/40 bg-gold/10 p-4 text-center">
              <p className="font-heading text-lg font-bold text-gold">
                Final Scoring Triggered!
              </p>
              <p className="text-sm text-bone-muted">
                {session.players
                  .filter((p) => p.doom >= 30)
                  .map((p) => p.name)
                  .join(", ")}{" "}
                reached 30 Doom. Reveal Elder Signs for final tally.
              </p>
            </div>
          )}
        </>
      )}

      {activeTab === "strategy" && session.players.length > 0 && (
        <div>
          {/* Player selector */}
          {session.players.length > 1 && (
            <div className="mb-4 flex gap-2">
              {session.players.map((player, i) => {
                const f = FACTION_MAP[player.factionId];
                return (
                  <button
                    key={player.factionId}
                    onClick={() => setStrategyPlayerIdx(i)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      strategyPlayerIdx === i
                        ? "border border-bone-muted/40 bg-void-lighter text-bone"
                        : "border border-void-lighter text-bone-muted hover:text-bone"
                    }`}
                  >
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: f?.color }}
                    />
                    {player.name}
                  </button>
                );
              })}
            </div>
          )}
          <StrategyTab
            factionId={session.players[strategyPlayerIdx].factionId}
            allFactionIds={factionIds}
            playerName={session.players[strategyPlayerIdx].name}
          />
        </div>
      )}

      {activeTab === "log" && (
        <div className="mb-6">
          <ActionLog entries={session.actionLog} />
        </div>
      )}
    </div>
  );
}
