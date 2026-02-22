// src/lib/tracker-reducer.ts
import type { TrackerSession } from "./tracker-session";

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
  | { type: "LOAD"; session: TrackerSession };

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
    default:
      return state;
  }
}
