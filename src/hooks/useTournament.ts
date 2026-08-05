import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BracketSize, NameEntry } from "../types";
import { createTournament, pickWinner } from "../lib/bracket";
import {
  loadShortlist,
  loadTournament,
  saveShortlist,
  saveTournament,
} from "../lib/storage";
import { clearShareParam, readShortlistFromUrl } from "../lib/share";
import type { Tournament } from "../types";

export type Phase = "shortlist" | "seeding" | "playing" | "champion";

const MAX_SIZE: BracketSize = 32;
const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2)}`;

export function useTournament() {
  const [names, setNames] = useState<NameEntry[]>([]);
  const [size, setSize] = useState<BracketSize>(MAX_SIZE);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [phase, setPhase] = useState<Phase>("shortlist");
  const hydrated = useRef(false);

  // Hydrate once: a shared link wins, otherwise resume saved state.
  useEffect(() => {
    const shared = readShortlistFromUrl();
    if (shared) {
      setNames(shared.names);
      setSize(shared.size);
      clearShareParam();
      hydrated.current = true;
      return;
    }
    const savedList = loadShortlist();
    if (savedList) setNames(savedList);
    const savedT = loadTournament();
    if (savedT) {
      setTournament(savedT);
      setSize(savedT.size);
      setPhase(savedT.champion ? "champion" : "playing");
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (hydrated.current) saveShortlist(names);
  }, [names]);

  useEffect(() => {
    if (hydrated.current) saveTournament(tournament);
  }, [tournament]);

  const existing = useMemo(
    () => new Set(names.map((n) => n.name.trim().toLowerCase())),
    [names]
  );

  const addName = useCallback(
    (raw: string) => {
      const name = raw.trim();
      if (!name) return false;
      if (existing.has(name.toLowerCase())) return false;
      if (names.length >= size) return false;
      setNames((prev) => [...prev, { id: newId(), name, starred: false }]);
      return true;
    },
    [existing, names.length, size]
  );

  const removeName = useCallback((id: string) => {
    setNames((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const toggleStar = useCallback((id: string) => {
    setNames((prev) =>
      prev.map((n) => (n.id === id ? { ...n, starred: !n.starred } : n))
    );
  }, []);

  const clearAll = useCallback(() => setNames([]), []);

  const canStart = names.length === size;
  const starredCount = names.filter((n) => n.starred).length;

  const start = useCallback(() => {
    if (!canStart) return;
    setTournament(createTournament(names, size));
    setPhase("seeding");
  }, [canStart, names, size]);

  const finishSeeding = useCallback(() => setPhase("playing"), []);

  const pick = useCallback((matchId: string, winnerId: string) => {
    setTournament((prev) => {
      if (!prev) return prev;
      const next = pickWinner(prev, matchId, winnerId);
      if (next.champion) setPhase("champion");
      return next;
    });
  }, []);

  const backToSquad = useCallback(() => {
    setTournament(null);
    setPhase("shortlist");
  }, []);

  return {
    // state
    names,
    size,
    tournament,
    phase,
    canStart,
    starredCount,
    // shortlist actions
    addName,
    removeName,
    toggleStar,
    clearAll,
    setSize,
    // flow actions
    start,
    finishSeeding,
    pick,
    backToSquad,
  };
}
