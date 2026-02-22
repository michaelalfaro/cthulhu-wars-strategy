"use client";

import { SetupChecklist } from "./SetupChecklist";
import { setupSections } from "./setup-data";

/**
 * Pre-wired game setup checklist for Cthulhu Wars.
 * Used in game-setup.mdx with no props: <GameSetupChecklist />
 */
export function GameSetupChecklist() {
  return <SetupChecklist sections={setupSections} />;
}
