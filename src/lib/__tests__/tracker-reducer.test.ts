import { describe, it, expect } from "vitest";
import { trackerReducer } from "../tracker-reducer";
import type { TrackerSession } from "../tracker-session";

function makeSession(overrides?: Partial<TrackerSession>): TrackerSession {
  return {
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
      {
        name: "Bob",
        factionId: "black-goat",
        doom: 8,
        gates: 2,
        power: 6,
        spellbooks: Array(6).fill(false),
        elderSigns: 0,
        units: {},
      },
    ],
    ...overrides,
  };
}

describe("SET_PHASE", () => {
  it("changes the phase", () => {
    const state = makeSession();
    const result = trackerReducer(state, { type: "SET_PHASE", phase: "doom" });
    expect(result.phase).toBe("doom");
  });
});

describe("GATHER_POWER", () => {
  it("sets each player power to 2 * gates", () => {
    const state = makeSession();
    state.players[0].gates = 3;
    state.players[0].power = 0;
    state.players[1].gates = 2;
    state.players[1].power = 0;

    const result = trackerReducer(state, { type: "GATHER_POWER" });
    expect(result.players[0].power).toBe(6);
    expect(result.players[1].power).toBe(4);
  });
});

describe("SCORE_DOOM", () => {
  it("adds gates to doom for each player", () => {
    const state = makeSession();
    state.players[0].doom = 10;
    state.players[0].gates = 3;
    state.players[1].doom = 8;
    state.players[1].gates = 2;

    const result = trackerReducer(state, { type: "SCORE_DOOM" });
    expect(result.players[0].doom).toBe(13);
    expect(result.players[1].doom).toBe(10);
  });

  it("logs the action", () => {
    const state = makeSession();
    const result = trackerReducer(state, { type: "SCORE_DOOM" });
    expect(result.actionLog.length).toBeGreaterThan(0);
    expect(result.actionLog[result.actionLog.length - 1].description).toContain("Doom scored");
  });
});

describe("PERFORM_RITUAL", () => {
  it("adds doom equal to gates, adds 1 elder sign, increments ritual cost, subtracts power", () => {
    const state = makeSession({ ritualCost: 5 });
    state.players[0].doom = 10;
    state.players[0].gates = 3;
    state.players[0].power = 10;
    state.players[0].elderSigns = 0;

    const result = trackerReducer(state, { type: "PERFORM_RITUAL", playerIdx: 0 });
    expect(result.players[0].doom).toBe(13);       // +3 gates
    expect(result.players[0].elderSigns).toBe(1);   // +1
    expect(result.players[0].power).toBe(5);         // 10 - 5 cost
    expect(result.ritualCost).toBe(6);               // 5 + 1
  });

  it("logs the ritual", () => {
    const state = makeSession({ ritualCost: 5 });
    state.players[0].power = 10;
    const result = trackerReducer(state, { type: "PERFORM_RITUAL", playerIdx: 0 });
    const lastLog = result.actionLog[result.actionLog.length - 1];
    expect(lastLog.description).toContain("Ritual");
  });
});

describe("SET_UNITS", () => {
  it("sets a unit count for a player", () => {
    const state = makeSession();
    const result = trackerReducer(state, {
      type: "SET_UNITS",
      playerIdx: 0,
      unitId: "deep-ones",
      count: 3,
    });
    expect(result.players[0].units["deep-ones"]).toBe(3);
  });

  it("clamps to 0 minimum", () => {
    const state = makeSession();
    const result = trackerReducer(state, {
      type: "SET_UNITS",
      playerIdx: 0,
      unitId: "deep-ones",
      count: -1,
    });
    expect(result.players[0].units["deep-ones"]).toBe(0);
  });
});

describe("LOG_ACTION", () => {
  it("appends an entry to actionLog", () => {
    const state = makeSession();
    const result = trackerReducer(state, { type: "LOG_ACTION", description: "Test entry" });
    expect(result.actionLog).toHaveLength(1);
    expect(result.actionLog[0].description).toBe("Test entry");
    expect(result.actionLog[0].round).toBe(1);
  });
});

describe("ADVANCE_PHASE", () => {
  it("cycles gather -> action -> doom -> gather (with round increment)", () => {
    let state = makeSession({ phase: "gather", round: 1 });

    state = trackerReducer(state, { type: "ADVANCE_PHASE" });
    expect(state.phase).toBe("action");
    expect(state.round).toBe(1);

    state = trackerReducer(state, { type: "ADVANCE_PHASE" });
    expect(state.phase).toBe("doom");
    expect(state.round).toBe(1);

    state = trackerReducer(state, { type: "ADVANCE_PHASE" });
    expect(state.phase).toBe("gather");
    expect(state.round).toBe(2); // new round
  });
});
