// src/lib/tracker-session.ts

export interface PlayerState {
  name: string;
  factionId: string;
  doom: number;
  gates: number;
  power: number;
  spellbooks: boolean[]; // 6 entries
  elderSigns: number;
  units: Record<string, number>;
}

export interface ActionLogEntry {
  round: number;
  phase: string;
  description: string;
  timestamp: string;
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
  ritualCost: number;
  phase: "gather" | "action" | "doom";
  actionLog: ActionLogEntry[];
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

export function migrateSession(session: TrackerSession): TrackerSession {
  // Cast to partial type to handle sessions saved before new fields were added
  const s = session as Partial<TrackerSession> & { players: Partial<PlayerState>[] };
  return {
    ...session,
    ritualCost: s.ritualCost ?? 5,
    phase: s.phase ?? "action",
    actionLog: s.actionLog ?? [],
    players: session.players.map((p) => ({
      ...p,
      units: (p as Partial<PlayerState>).units ?? {},
    })),
  };
}

export function loadSession(id: string): TrackerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(sessionKey(id));
    if (!raw) return null;
    const session = JSON.parse(raw) as TrackerSession;
    return migrateSession(session);
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
    units: {},
  }));
}
