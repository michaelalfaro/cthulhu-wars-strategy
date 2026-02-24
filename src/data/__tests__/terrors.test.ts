import { TERRORS, type Terror } from "@/data/terrors";

describe("TERRORS", () => {
  it("should contain all 5 terrors", () => {
    expect(TERRORS).toHaveLength(5);
  });

  it("should have unique ids", () => {
    const ids = TERRORS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have required fields on every entry", () => {
    for (const terror of TERRORS) {
      expect(terror.id).toBeTruthy();
      expect(terror.name).toBeTruthy();
      expect(terror.expansion).toBeTruthy();
      expect(typeof terror.combat).toBe("string");
      expect(terror.abilitySummary).toBeTruthy();
      expect(terror.abilityName).toBeTruthy();
      expect(Array.isArray(terror.tags)).toBe(true);
    }
  });

  it("should have 3 from cosmic-terrors and 2 from other expansions", () => {
    const cosmicCount = TERRORS.filter(
      (t) => t.expansion === "cosmic-terrors"
    ).length;
    expect(cosmicCount).toBe(3);
  });
});
