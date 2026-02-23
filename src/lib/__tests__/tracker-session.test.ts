import { describe, it, expect } from "vitest";
import { migrateSession, type TrackerSession } from "../tracker-session";

function makeOldSession(): Record<string, unknown> {
  return {
    id: "abc123",
    createdAt: "2026-01-01T00:00:00Z",
    map: "earth",
    expansions: [],
    round: 3,
    firstPlayer: 0,
    direction: "cw",
    players: [
      {
        name: "Alice",
        factionId: "great-cthulhu",
        doom: 12,
        gates: 3,
        power: 5,
        spellbooks: [true, false, false, false, false, false],
        elderSigns: 0,
        // no 'units' field — old format
      },
    ],
    // no ritualCost, phase, actionLog — old format
  };
}

describe("migrateSession", () => {
  it("fills missing fields with defaults", () => {
    const old = makeOldSession() as unknown as TrackerSession;
    const migrated = migrateSession(old);

    expect(migrated.ritualCost).toBe(5);
    expect(migrated.phase).toBe("action");
    expect(migrated.actionLog).toEqual([]);
  });

  it("fills missing player.units with empty object", () => {
    const old = makeOldSession() as unknown as TrackerSession;
    const migrated = migrateSession(old);

    expect(migrated.players[0].units).toEqual({});
  });

  it("preserves existing new fields if present", () => {
    const session: TrackerSession = {
      ...makeOldSession(),
      ritualCost: 7,
      phase: "doom",
      actionLog: [{ round: 1, phase: "doom", description: "test", timestamp: "T" }],
      players: [
        {
          name: "Alice",
          factionId: "great-cthulhu",
          doom: 12,
          gates: 3,
          power: 5,
          spellbooks: [true, false, false, false, false, false],
          elderSigns: 0,
          units: { "deep-ones": 2 },
        },
      ],
    } as TrackerSession;

    const migrated = migrateSession(session);
    expect(migrated.ritualCost).toBe(7);
    expect(migrated.phase).toBe("doom");
    expect(migrated.actionLog).toHaveLength(1);
    expect(migrated.players[0].units).toEqual({ "deep-ones": 2 });
  });
});
