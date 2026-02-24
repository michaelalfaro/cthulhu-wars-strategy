import { EXPANSIONS, MAPS } from "@/data/faction-data";
import { INDEPENDENT_GOOS } from "@/data/independent-goos";
import { TERRORS } from "@/data/terrors";
import { NEUTRAL_MONSTERS } from "@/data/neutral-monsters";

describe("EXPANSIONS completeness", () => {
  it("should include every expansion referenced by independent GOOs", () => {
    const expansionIds = new Set(EXPANSIONS.map((e) => e.id));
    for (const goo of INDEPENDENT_GOOS) {
      expect(expansionIds.has(goo.pack)).toBe(true);
    }
  });

  it("should include every expansion referenced by terrors", () => {
    const expansionIds = new Set(EXPANSIONS.map((e) => e.id));
    for (const terror of TERRORS) {
      expect(expansionIds.has(terror.expansion)).toBe(true);
    }
  });

  it("should include every expansion referenced by neutral monsters (excluding map-specific)", () => {
    const expansionIds = new Set(EXPANSIONS.map((e) => e.id));
    const mapIds = new Set(MAPS.map((m) => m.id));
    for (const monster of NEUTRAL_MONSTERS) {
      // Skip map-specific monsters (they reference map ids, not expansion ids)
      if (!mapIds.has(monster.expansion)) {
        expect(expansionIds.has(monster.expansion)).toBe(true);
      }
    }
  });
});
