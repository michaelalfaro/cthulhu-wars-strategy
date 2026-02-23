import { describe, it, expect } from "vitest";
import { undoReducer } from "../use-undo-reducer";
import { trackerReducer } from "../tracker-reducer";
import type { TrackerSession } from "../tracker-session";

function makeState(): { past: TrackerSession[]; present: TrackerSession } {
  return {
    past: [],
    present: {
      id: "test",
      createdAt: "2026-01-01T00:00:00Z",
      map: "earth",
      expansions: [],
      round: 1,
      firstPlayer: 0,
      direction: "cw",
      ritualCost: 5,
      phase: "action",
      actionLog: [],
      players: [
        {
          name: "Alice",
          factionId: "great-cthulhu",
          doom: 10,
          gates: 3,
          power: 8,
          spellbooks: Array(6).fill(false),
          elderSigns: 0,
          units: {},
        },
      ],
    },
  };
}

describe("undoReducer", () => {
  it("wraps a normal action and pushes to past", () => {
    const state = makeState();
    const result = undoReducer(state, { type: "SET_DOOM", playerIdx: 0, value: 15 }, trackerReducer);
    expect(result.present.players[0].doom).toBe(15);
    expect(result.past).toHaveLength(1);
    expect(result.past[0].players[0].doom).toBe(10); // old value
  });

  it("UNDO pops the past", () => {
    const state = makeState();
    // Make a change first
    const after = undoReducer(state, { type: "SET_DOOM", playerIdx: 0, value: 15 }, trackerReducer);
    // Undo it
    const undone = undoReducer(after, { type: "UNDO" }, trackerReducer);
    expect(undone.present.players[0].doom).toBe(10);
    expect(undone.past).toHaveLength(0);
  });

  it("UNDO with empty past does nothing", () => {
    const state = makeState();
    const result = undoReducer(state, { type: "UNDO" }, trackerReducer);
    expect(result.present.players[0].doom).toBe(10);
  });

  it("caps history at 50 entries", () => {
    let state = makeState();
    for (let i = 0; i < 60; i++) {
      state = undoReducer(state, { type: "SET_DOOM", playerIdx: 0, value: i }, trackerReducer);
    }
    expect(state.past.length).toBeLessThanOrEqual(50);
  });

  it("LOAD action does not push to history", () => {
    const state = makeState();
    const loaded: TrackerSession = { ...state.present, round: 5 };
    const result = undoReducer(state, { type: "LOAD", session: loaded }, trackerReducer);
    expect(result.present.round).toBe(5);
    expect(result.past).toHaveLength(0);
  });
});
