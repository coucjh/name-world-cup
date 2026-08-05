import type { NameEntry, Tournament } from "../types";

const SHORTLIST_KEY = "nwc:shortlist:v1";
const TOURNAMENT_KEY = "nwc:tournament:v1";

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — ignore, it's non-critical */
  }
}

export const loadShortlist = () => read<NameEntry[]>(SHORTLIST_KEY);
export const saveShortlist = (names: NameEntry[]) => write(SHORTLIST_KEY, names);

export const loadTournament = () => read<Tournament>(TOURNAMENT_KEY);
export const saveTournament = (t: Tournament | null) => {
  if (t) write(TOURNAMENT_KEY, t);
  else localStorage.removeItem(TOURNAMENT_KEY);
};
