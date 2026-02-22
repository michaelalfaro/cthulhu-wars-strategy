export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    title: "Overview",
    href: "/guide/overview",
    children: [
      { title: "Game Setup", href: "/guide/overview/game-setup" },
      { title: "Basics", href: "/guide/overview/basics" },
      { title: "Advanced Tactics", href: "/guide/overview/advanced-tactics" },
      { title: "Threat Assessment", href: "/guide/overview/threat-assessment" },
      { title: "Resources & Aids", href: "/guide/overview/resources" },
    ],
  },
  {
    title: "Factions",
    href: "/guide/factions",
    children: [
      { title: "Great Cthulhu", href: "/guide/factions/great-cthulhu" },
      { title: "Black Goat", href: "/guide/factions/black-goat" },
      { title: "Crawling Chaos", href: "/guide/factions/crawling-chaos" },
      { title: "Yellow Sign", href: "/guide/factions/yellow-sign" },
      { title: "Opener of the Way", href: "/guide/factions/opener-of-the-way" },
      { title: "The Sleeper", href: "/guide/factions/sleeper" },
      { title: "Windwalker", href: "/guide/factions/windwalker" },
      { title: "Tcho-Tcho", href: "/guide/factions/tcho-tcho" },
      { title: "The Ancients", href: "/guide/factions/ancients" },
      { title: "Daemon Sultan", href: "/guide/factions/daemon-sultan" },
      { title: "Bubastis", href: "/guide/factions/bubastis" },
    ],
  },
  {
    title: "Monsters & Terrors",
    href: "/guide/monsters",
    children: [
      { title: "Great Old Ones", href: "/guide/monsters/great-old-ones" },
      { title: "Monsters by Faction", href: "/guide/monsters/by-faction" },
      { title: "Terrors", href: "/guide/monsters/terrors" },
    ],
  },
  {
    title: "Neutral Units",
    href: "/guide/neutrals",
    children: [
      { title: "Azathoth", href: "/guide/neutrals/azathoth" },
      { title: "Dunwich Horror", href: "/guide/neutrals/dunwich-horror" },
      { title: "Ramsey Campbell 1", href: "/guide/neutrals/ramsey-campbell-1" },
      { title: "Ramsey Campbell 2", href: "/guide/neutrals/ramsey-campbell-2" },
      { title: "Cosmic Terrors", href: "/guide/neutrals/cosmic-terrors" },
      { title: "Beyond Time & Space", href: "/guide/neutrals/beyond-time-space" },
      { title: "Something About Cats", href: "/guide/neutrals/something-about-cats" },
      { title: "Masks of Nyarlathotep", href: "/guide/neutrals/masks-nyarlathotep" },
      { title: "High Priest", href: "/guide/neutrals/high-priest" },
    ],
  },
  {
    title: "Maps",
    href: "/guide/maps",
    children: [
      { title: "Standard Earth", href: "/guide/maps/earth" },
      { title: "Dreamlands", href: "/guide/maps/dreamlands" },
      { title: "Yuggoth", href: "/guide/maps/yuggoth" },
      { title: "Library at Celaeno", href: "/guide/maps/library-celaeno" },
      { title: "Shaggai", href: "/guide/maps/shaggai" },
      { title: "Primeval Earth", href: "/guide/maps/primeval-earth" },
    ],
  },
  {
    title: "GOO Packs",
    href: "/guide/goo-packs",
    children: [
      { title: "Pack 1", href: "/guide/goo-packs/pack-1" },
      { title: "Pack 2", href: "/guide/goo-packs/pack-2" },
      { title: "Pack 4", href: "/guide/goo-packs/pack-4" },
    ],
  },
  {
    title: "Advanced",
    href: "/guide/advanced",
    children: [
      { title: "Politics & Diplomacy", href: "/guide/advanced/politics" },
      { title: "Matchup Matrix", href: "/guide/advanced/matchups" },
    ],
  },
];
