import type {
  BracketSize,
  Match,
  NameCategory,
  NameEntry,
  Seeded,
  Tournament,
} from "../types";
import { assignSeeds, seedOrder } from "./seeding";

/** The match in the next round that a given match feeds into. */
function feed(matchIndex: number): { nextIndex: number; slot: "a" | "b" } {
  return { nextIndex: Math.floor(matchIndex / 2), slot: matchIndex % 2 === 0 ? "a" : "b" };
}

/** Number of first-round names needed to make the target bracket meaningful. */
export function minNamesFor(size: BracketSize): number {
  return size / 2 + 1;
}

export function roundName(roundIndex: number, totalRounds: number): string {
  const fromEnd = totalRounds - 1 - roundIndex;
  if (fromEnd === 0) return "Final";
  if (fromEnd === 1) return "Semi-final";
  if (fromEnd === 2) return "Quarter-final";
  const teams = 2 ** (totalRounds - roundIndex);
  return `Round of ${teams}`;
}

/**
 * Build the full round structure and place names into first-round slots via
 * the seed order. Fewer names than slots means the top seeds get byes, which
 * are auto-resolved and propagated forward.
 */
export function buildBracket(seeded: Seeded[], size: BracketSize): Match[][] {
  const bySeed = new Map(seeded.map((s) => [s.seed, s]));
  const slots = seedOrder(size).map((seed) => bySeed.get(seed) ?? null);

  const rounds: Match[][] = [];
  let first: Match[] = [];
  for (let i = 0; i < size; i += 2) {
    first.push({ id: `r0-m${i / 2}`, round: 0, a: slots[i], b: slots[i + 1] });
  }
  rounds.push(first);

  let count = first.length;
  let r = 1;
  while (count > 1) {
    const next: Match[] = [];
    for (let i = 0; i < count / 2; i++) {
      next.push({ id: `r${r}-m${i}`, round: r, a: null, b: null });
    }
    rounds.push(next);
    count = next.length;
    r++;
  }

  resolveByes(rounds);
  return rounds;
}

/** Auto-advance any match where one name faces an empty slot. */
function resolveByes(rounds: Match[][]): void {
  for (let r = 0; r < rounds.length - 1; r++) {
    for (let m = 0; m < rounds[r].length; m++) {
      const match = rounds[r][m];
      const bye = match.a && !match.b ? match.a : !match.a && match.b ? match.b : null;
      if (bye && !match.winnerId) {
        match.winnerId = bye.id;
        placeWinner(rounds, r, m, bye);
      }
    }
  }
}

function placeWinner(rounds: Match[][], round: number, matchIndex: number, winner: Seeded): void {
  if (round + 1 >= rounds.length) return;
  const { nextIndex, slot } = feed(matchIndex);
  rounds[round + 1][nextIndex][slot] = winner;
}

/** First playable match (both names present, no winner yet), in reading order. */
export function findNextPending(rounds: Match[][]): { round: number; index: number } | null {
  for (let r = 0; r < rounds.length; r++) {
    for (let m = 0; m < rounds[r].length; m++) {
      const match = rounds[r][m];
      if (match.a && match.b && !match.winnerId) return { round: r, index: m };
    }
  }
  return null;
}

export function createTournament(
  names: NameEntry[],
  size: BracketSize,
  category: NameCategory,
  rng: () => number = Math.random
): Tournament {
  const seeded = assignSeeds(names.slice(0, size), rng);
  const rounds = buildBracket(seeded, size);
  const next = findNextPending(rounds);
  return {
    size,
    category,
    rounds,
    currentRound: next?.round ?? rounds.length - 1,
    currentMatchIndex: next?.index ?? 0,
    champion: undefined,
  };
}

/** Record a pick and advance the bracket. Returns a new Tournament. */
export function pickWinner(t: Tournament, matchId: string, winnerId: string): Tournament {
  const next: Tournament = structuredClone(t);
  const rounds = next.rounds;

  outer: for (let r = 0; r < rounds.length; r++) {
    for (let m = 0; m < rounds[r].length; m++) {
      const match = rounds[r][m];
      if (match.id !== matchId) continue;
      const winner = match.a?.id === winnerId ? match.a : match.b?.id === winnerId ? match.b : null;
      if (!winner || match.winnerId) return t; // invalid or already decided
      match.winnerId = winnerId;
      placeWinner(rounds, r, m, winner);
      break outer;
    }
  }

  const pending = findNextPending(rounds);
  if (pending) {
    next.currentRound = pending.round;
    next.currentMatchIndex = pending.index;
    next.champion = undefined;
  } else {
    const finalMatch = rounds[rounds.length - 1][0];
    const champ =
      finalMatch.winnerId && finalMatch.a?.id === finalMatch.winnerId
        ? finalMatch.a
        : finalMatch.b;
    next.champion = champ ?? undefined;
    next.currentRound = rounds.length - 1;
    next.currentMatchIndex = 0;
  }
  return next;
}
