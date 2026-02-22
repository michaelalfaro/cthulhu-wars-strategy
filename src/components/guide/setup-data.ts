import type { ChecklistSection } from "./SetupChecklist";

export const setupSections: ChecklistSection[] = [
  {
    title: "Before Anything Else",
    color: "#c4a84d",
    items: [
      "Decide player count (3–5 players; 4 is the sweet spot)",
      { text: "Select your map", note: "Beginners: use the standard Earth map. Each map has a 3-player side and a 5-player side." },
      "Assemble the map — match the two halves to your player count (3P+3P for 3 players, 3P+5P for 4 players, 5P+5P for 5 players)",
      "Place the Doom track board near the map",
      "Set the Ritual of Annihilation cost marker to 5",
      "Shuffle the Elder Sign tokens and place them face-down in a central pile",
      "Set aside the custom combat dice (6 dice per player)",
    ],
  },
  {
    title: "Faction Selection",
    color: "#2d8a4e",
    items: [
      { text: "Each player chooses a faction", note: "For new players, recommend using only the 4 core factions (Cthulhu, Black Goat, Crawling Chaos, Yellow Sign)." },
      "Each player takes their full set of faction units (all unit colors should be distinct)",
      "Each player takes their faction board (player aid card)",
      "Each player takes their 6 Spellbook cards and places them face-up near their board",
      "Place all monster units in your personal pool (off the board)",
      "Place your Great Old One in your pool (off the board)",
    ],
  },
  {
    title: "Placing Starting Cultists & Gates — Core Factions",
    color: "#2d8a4e",
    items: [
      { text: "Great Cthulhu → South Pacific", note: "Place 1 Cultist on the Gate glyph; deploy 5 remaining Cultists in the region." },
      { text: "Black Goat → West Africa", note: "Place 1 Cultist on the Gate glyph; deploy 5 remaining Cultists in the region." },
      { text: "Crawling Chaos → South Asia", note: "Place 1 Cultist on the Gate glyph; deploy 5 remaining Cultists in the region." },
      { text: "Yellow Sign → Europe", note: "Place 1 Cultist on the Gate glyph; deploy 5 remaining Cultists in the region." },
    ],
  },
  {
    title: "Placing Starting Cultists & Gates — Expansion Factions",
    color: "#7a3b8a",
    items: [
      { text: "Daemon Sultan → Central Asia", note: "Place 1 Cultist on the Gate glyph; deploy 5 remaining in the region." },
      { text: "The Sleeper → North America", note: "Place 1 Cultist on the Gate glyph; deploy 5 remaining in the region." },
      { text: "Tcho-Tcho → Southeast Asia", note: "See faction card for precise placement rules." },
      { text: "The Ancients → Australia / Oceania", note: "See faction card for precise placement rules." },
      { text: "Bubastis → North Africa", note: "See faction card for precise placement rules." },
      { text: "Windwalker → North Pole or South Pole (your choice)", note: "Place 1 Cultist on Gate glyph; deploy 5 remaining Cultists in the chosen polar region." },
      { text: "Opener of the Way → Any open Gate glyph", note: "Sets up AFTER all other factions. Choose any remaining Gate glyph on the map." },
    ],
  },
  {
    title: "Build Starting Gates",
    color: "#8b1a1a",
    items: [
      "Each player places 1 Gate token in their starting area (on the glyph)",
      "Each player places 1 Cultist on that Gate to control it",
      "Set each player's Doom marker to 0 on the Doom track",
    ],
  },
  {
    title: "Expansion Content (if using)",
    color: "#4a9ac7",
    items: [
      { text: "Neutral units: sort into groups and keep in the box", note: "Azathoth, Dunwich Horror, Ramsey Campbell Horrors, Cosmic Terrors, etc." },
      { text: "GOO Packs: follow the placement rules in the expansion rulebook", note: "Each GOO Pack GOO has unique setup instructions." },
      "Alternate maps: follow that map's specific setup rules",
      "Set aside any expansion units NOT being used",
    ],
  },
  {
    title: "Round 1 Power & First Player",
    color: "#c4a84d",
    items: [
      "Skip the Gather Power phase on Round 1 — everyone starts at 8 Power",
      { text: "Confirm each player has 8 Power tokens", note: "1 Gate (2 Power) + 6 Cultists (1 Power each) = 8 Power total." },
      "Determine first player randomly (all players are tied at 8 Power)",
      "First player chooses whether play proceeds clockwise or counterclockwise",
    ],
  },
  {
    title: "Final Check Before Starting",
    color: "#c4a84d",
    items: [
      "Every player's starting area has exactly 1 Gate with a Cultist controlling it",
      "Every player has all 6 Spellbook cards visible (none earned yet)",
      "No monsters or Great Old Ones are on the board yet",
      "Elder Sign pile is shuffled and face-down",
      "All Doom track markers are at 0",
      "Ritual cost marker is at 5",
      "Everyone has read their faction card — know your awakening cost & Spellbook requirements",
      "Ready to begin!",
    ],
  },
];
