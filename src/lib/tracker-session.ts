// src/lib/tracker-session.ts

export interface PlayerState {
  name: string;
  factionId: string;
  doom: number;
  gates: number;
  power: number;
  spellbooks: boolean[]; // 6 entries
  elderSigns: number;
}

export interface TrackerSession {
  id: string;
  createdAt: string;
  completedAt?: string;
  map: string;
  expansions: string[];
  round: number;
  firstPlayer: number;
  direction: "cw" | "ccw";
  players: PlayerState[];
}

const INDEX_KEY = "cw-sessions-index";
const sessionKey = (id: string) => `cw-session-${id}`;

export function loadSessionIndex(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveSessionIndex(ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
}

export function loadSession(id: string): TrackerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(sessionKey(id));
    return raw ? (JSON.parse(raw) as TrackerSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: TrackerSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(sessionKey(session.id), JSON.stringify(session));
  const index = loadSessionIndex();
  if (!index.includes(session.id)) {
    saveSessionIndex([...index, session.id]);
  }
}

export function deleteSession(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(sessionKey(id));
  const index = loadSessionIndex();
  saveSessionIndex(index.filter((i) => i !== id));
}

export function createDefaultPlayers(
  factionIds: string[],
  names: string[]
): PlayerState[] {
  return factionIds.map((factionId, i) => ({
    name: names[i] ?? `Player ${i + 1}`,
    factionId,
    doom: 0,
    gates: 1,
    power: 8,
    spellbooks: Array(6).fill(false),
    elderSigns: 0,
  }));
}
