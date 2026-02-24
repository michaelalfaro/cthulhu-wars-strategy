import { UNIQUE_HIGH_PRIESTS } from "@/data/unique-high-priests";

describe("UNIQUE_HIGH_PRIESTS", () => {
  it("should contain all 8 unique high priests", () => {
    expect(UNIQUE_HIGH_PRIESTS).toHaveLength(8);
  });

  it("should have unique ids", () => {
    const ids = UNIQUE_HIGH_PRIESTS.map((hp) => hp.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have required fields on every entry", () => {
    for (const hp of UNIQUE_HIGH_PRIESTS) {
      expect(hp.id).toBeTruthy();
      expect(hp.name).toBeTruthy();
      expect(hp.abilityName).toBeTruthy();
      expect(hp.abilityText).toBeTruthy();
      expect(hp.timing).toBeTruthy();
      expect(hp.tacticalSummary).toBeTruthy();
      expect(Array.isArray(hp.tags)).toBe(true);
    }
  });

  it("should have valid timing values", () => {
    const validTimings = ["ongoing", "pre-battle", "post-battle"];
    for (const hp of UNIQUE_HIGH_PRIESTS) {
      expect(validTimings).toContain(hp.timing);
    }
  });
});
