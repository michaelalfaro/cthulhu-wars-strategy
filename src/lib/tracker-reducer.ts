// src/lib/tracker-reducer.ts
import type { TrackerSession, ActionLogEntry } from "./tracker-session";

export type TrackerAction =
  | { type: "SET_DOOM"; playerIdx: number; value: number }
  | { type: "SET_GATES"; playerIdx: number; value: number }
  | { type: "SET_POWER"; playerIdx: number; value: number }
  | { type: "SET_ELDER_SIGNS"; playerIdx: number; value: number }
  | { type: "TOGGLE_SPELLBOOK"; playerIdx: number; bookIdx: number }
  | { type: "NEXT_ROUND" }
  | { type: "PREV_ROUND" }
  | { type: "SET_FIRST_PLAYER"; playerIdx: number }
  | { type: "SET_DIRECTION"; direction: "cw" | "ccw" }
  | { type: "END_GAME" }
  | { type: "LOAD"; session: TrackerSession }
  | { type: "SET_PHASE"; phase: "gather" | "action" | "doom" }
  | { type: "ADVANCE_PHASE" }
  | { type: "GATHER_POWER" }
  | { type: "SCORE_DOOM" }
  | { type: "PERFORM_RITUAL"; playerIdx: number }
  | { type: "SET_UNITS"; playerIdx: number; unitId: string; count: number }
  | { type: "LOG_ACTION"; description: string };

export function trackerReducer(
  state: TrackerSession,
  action: TrackerAction
): TrackerSession {
  switch (action.type) {
    case "LOAD":
      return action.session;
    case "SET_DOOM": {
      const players = state.players.map((p, i) =>
        i === action.playerIdx ? { ...p, doom: Math.max(0, action.value) } : p
      );
      return { ...state, players };
    }
    case "SET_GATES": {
      const players = state.players.map((p, i) =>
        i === action.playerIdx
          ? { ...p, gates: Math.max(0, Math.min(7, action.value)) }
          : p
      );
      return { ...state, players };
    }
    case "SET_POWER": {
      const players = state.players.map((p, i) =>
        i === action.playerIdx ? { ...p, power: Math.max(0, action.value) } : p
      );
      return { ...state, players };
    }
    case "SET_ELDER_SIGNS": {
      const players = state.players.map((p, i) =>
        i === action.playerIdx
          ? { ...p, elderSigns: Math.max(0, action.value) }
          : p
      );
      return { ...state, players };
    }
    case "TOGGLE_SPELLBOOK": {
      const players = state.players.map((p, i) => {
        if (i !== action.playerIdx) return p;
        const spellbooks = [...p.spellbooks];
        spellbooks[action.bookIdx] = !spellbooks[action.bookIdx];
        return { ...p, spellbooks };
      });
      return { ...state, players };
    }
    case "NEXT_ROUND":
      return { ...state, round: state.round + 1 };
    case "PREV_ROUND":
      return { ...state, round: Math.max(1, state.round - 1) };
    case "SET_FIRST_PLAYER":
      return { ...state, firstPlayer: action.playerIdx };
    case "SET_DIRECTION":
      return { ...state, direction: action.direction };
    case "END_GAME":
      return { ...state, completedAt: new Date().toISOString() };

    case "SET_PHASE":
      return { ...state, phase: action.phase };

    case "ADVANCE_PHASE": {
      const phases: Array<"gather" | "action" | "doom"> = ["gather", "action", "doom"];
      const idx = phases.indexOf(state.phase);
      const nextIdx = (idx + 1) % phases.length;
      const nextRound = nextIdx === 0 ? state.round + 1 : state.round;
      return { ...state, phase: phases[nextIdx], round: nextRound };
    }

    case "GATHER_POWER": {
      const players = state.players.map((p) => ({
        ...p,
        power: 2 * p.gates,
      }));
      return { ...state, players };
    }

    case "SCORE_DOOM": {
      const players = state.players.map((p) => ({
        ...p,
        doom: p.doom + p.gates,
      }));
      const entry: ActionLogEntry = {
        round: state.round,
        phase: state.phase,
        description: `Doom scored: ${state.players.map((p) => `${p.name} +${p.gates}`).join(", ")}`,
        timestamp: new Date().toISOString(),
      };
      return { ...state, players, actionLog: [...state.actionLog, entry] };
    }

    case "PERFORM_RITUAL": {
      const p = state.players[action.playerIdx];
      const players = state.players.map((pl, i) =>
        i === action.playerIdx
          ? {
              ...pl,
              doom: pl.doom + pl.gates,
              elderSigns: pl.elderSigns + 1,
              power: pl.power - state.ritualCost,
            }
          : pl
      );
      const entry: ActionLogEntry = {
        round: state.round,
        phase: state.phase,
        description: `${p.name} performed Ritual of Annihilation (cost ${state.ritualCost}, +${p.gates} Doom, +1 Elder Sign)`,
        timestamp: new Date().toISOString(),
      };
      return {
        ...state,
        players,
        ritualCost: state.ritualCost + 1,
        actionLog: [...state.actionLog, entry],
      };
    }

    case "SET_UNITS": {
      const players = state.players.map((p, i) =>
        i === action.playerIdx
          ? { ...p, units: { ...p.units, [action.unitId]: Math.max(0, action.count) } }
          : p
      );
      return { ...state, players };
    }

    case "LOG_ACTION": {
      const entry: ActionLogEntry = {
        round: state.round,
        phase: state.phase,
        description: action.description,
        timestamp: new Date().toISOString(),
      };
      return { ...state, actionLog: [...state.actionLog, entry] };
    }

    default:
      return state;
  }
}
