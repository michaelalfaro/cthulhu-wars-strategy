export const theme = {
  colors: {
    void: "#0a0a0f",
    voidLight: "#12121a",
    voidLighter: "#1a1a26",
    green: "#1a4a2e",
    greenLight: "#2a6b44",
    purple: "#2d1b4e",
    purpleLight: "#4a2d7a",
    bone: "#e8dcc8",
    boneMuted: "#b8a88c",
    blood: "#8b1a1a",
    bloodLight: "#b52a2a",
    gold: "#c4a84d",
  },
  factions: {
    "great-cthulhu": { color: "#2d8a4e", name: "Great Cthulhu" },
    "black-goat": { color: "#8b1a1a", name: "Black Goat" },
    "crawling-chaos": { color: "#1a3d8b", name: "Crawling Chaos" },
    "yellow-sign": { color: "#c4a84d", name: "Yellow Sign" },
    "opener-of-the-way": { color: "#d4a017", name: "Opener of the Way" },
    sleeper: { color: "#6b4e2a", name: "The Sleeper" },
    windwalker: { color: "#4a9ac7", name: "Windwalker" },
    "tcho-tcho": { color: "#7a3b8a", name: "Tcho-Tcho" },
    ancients: { color: "#8a8a5a", name: "The Ancients" },
    "daemon-sultan": { color: "#2a2a2a", name: "Daemon Sultan" },
    bubastis: { color: "#c77a4a", name: "Bubastis" },
  },
} as const;

export type FactionId = keyof typeof theme.factions;
