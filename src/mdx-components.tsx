import type { MDXComponents } from "mdx/types";
import {
  FactionHeader,
  UnitStatBlock,
  SpellbookChecklist,
  MatchupTable,
  TranscriptReference,
} from "@/components/guide";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    FactionHeader,
    UnitStatBlock,
    SpellbookChecklist,
    MatchupTable,
    TranscriptReference,
    ...components,
  };
}
