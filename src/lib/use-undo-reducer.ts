import type { TrackerSession } from "./tracker-session";
import type { TrackerAction } from "./tracker-reducer";

const MAX_HISTORY = 50;

export interface UndoState {
  past: TrackerSession[];
  present: TrackerSession;
}

export type UndoAction = TrackerAction | { type: "UNDO" };

export function undoReducer(
  state: UndoState,
  action: UndoAction,
  innerReducer: (s: TrackerSession, a: TrackerAction) => TrackerSession
): UndoState {
  if (action.type === "UNDO") {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    return {
      past: state.past.slice(0, -1),
      present: previous,
    };
  }

  // LOAD bypasses history — we don't want loading a session to be undoable
  if (action.type === "LOAD") {
    return {
      past: [],
      present: innerReducer(state.present, action),
    };
  }

  const newPresent = innerReducer(state.present, action as TrackerAction);
  const newPast = [...state.past, state.present].slice(-MAX_HISTORY);

  return {
    past: newPast,
    present: newPresent,
  };
}
