import type { MDXComponents } from "mdx/types";
import {
  FactionHeader,
  UnitStatBlock,
  SpellbookChecklist,
  MatchupTable,
  TranscriptReference,
  SetupChecklist,
  GameSetupChecklist,
} from "@/components/guide";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    FactionHeader,
    UnitStatBlock,
    SpellbookChecklist,
    MatchupTable,
    TranscriptReference,
    SetupChecklist,
    GameSetupChecklist,
    ...components,
  };
}
