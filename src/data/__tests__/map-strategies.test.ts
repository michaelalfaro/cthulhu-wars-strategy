import { MAP_STRATEGIES, type MapStrategy } from "@/data/map-strategies";
import { MAPS, FACTIONS } from "@/data/faction-data";

describe("MAP_STRATEGIES", () => {
  it("should have a strategy entry for every map", () => {
    for (const map of MAPS) {
      expect(MAP_STRATEGIES[map.id]).toBeDefined();
    }
  });

  it("should have required fields on every entry", () => {
    for (const [, strategy] of Object.entries(MAP_STRATEGIES)) {
      expect(strategy.description).toBeTruthy();
      expect(Array.isArray(strategy.keyFeatures)).toBe(true);
      expect(strategy.keyFeatures.length).toBeGreaterThan(0);
      expect(Array.isArray(strategy.factionNotes)).toBe(true);
    }
  });

  it("should have faction notes referencing valid faction ids", () => {
    const factionIds = new Set(FACTIONS.map((f) => f.id));
    for (const [, strategy] of Object.entries(MAP_STRATEGIES)) {
      for (const note of (strategy as MapStrategy).factionNotes) {
        expect(factionIds.has(note.factionId)).toBe(true);
      }
    }
  });
});
