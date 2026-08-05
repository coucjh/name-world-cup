import { describe, expect, it } from "vitest";
import type { NameEntry, Tournament } from "../types";
import { seedOrder } from "./seeding";
import { buildBracket, createTournament, findNextPending, pickWinner } from "./bracket";
import { assignSeeds } from "./seeding";

function makeNames(n: number, starredCount = 0): NameEntry[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `n${i}`,
    name: `Name${i}`,
    starred: i < starredCount,
  }));
}

/** Play the whole tournament, always advancing the better (lower) seed. */
function playFavouredSeed(start: Tournament): Tournament {
  let t = start;
  let guard = 0;
  while (!t.champion && guard++ < 1000) {
    const match = t.rounds[t.currentRound][t.currentMatchIndex];
    if (!match.a || !match.b) break;
    const winner = match.a.seed < match.b.seed ? match.a : match.b;
    t = pickWinner(t, match.id, winner.id);
  }
  return t;
}

describe("buildBracket", () => {
  it("creates the right round structure for 32", () => {
    const seeded = assignSeeds(makeNames(32));
    const rounds = buildBracket(seeded, 32);
    expect(rounds.map((r) => r.length)).toEqual([16, 8, 4, 2, 1]);
  });

  it("spreads the top 4 seeds into 4 different quarters", () => {
    const order = seedOrder(32);
    const quarterOf = (seed: number) => Math.floor(order.indexOf(seed) / 8);
    const quarters = [1, 2, 3, 4].map(quarterOf);
    expect(new Set(quarters).size).toBe(4);
  });

  it("gives byes to the top seeds when the bracket is not full", () => {
    const seeded = assignSeeds(makeNames(20)); // 12 byes in a 32 bracket
    const rounds = buildBracket(seeded, 32);
    const decided = rounds[0].filter((m) => m.winnerId);
    expect(decided).toHaveLength(12);
    // Byes must belong to the strongest seeds (1..12).
    for (const m of decided) {
      const survivor = m.a ?? m.b!;
      expect(survivor.seed).toBeLessThanOrEqual(12);
    }
  });
});

describe("pickWinner / full playthrough", () => {
  it("crowns the top seed when the better seed always wins (full 32)", () => {
    const t = createTournament(makeNames(32, 4), 32);
    const done = playFavouredSeed(t);
    expect(done.champion).toBeDefined();
    expect(done.champion!.seed).toBe(1);
  });

  it("handles a bye-filled bracket to a champion", () => {
    const t = createTournament(makeNames(11, 2), 16);
    const done = playFavouredSeed(t);
    expect(done.champion).toBeDefined();
    expect(done.champion!.seed).toBe(1);
  });

  it("ignores an already-decided match", () => {
    const t = createTournament(makeNames(8), 8);
    const m = t.rounds[0][0];
    const once = pickWinner(t, m.id, m.a!.id);
    const twice = pickWinner(once, m.id, m.b!.id);
    // second pick on the same match is a no-op
    expect(twice.rounds[0][0].winnerId).toBe(m.a!.id);
  });

  it("has no pending match once a champion exists", () => {
    const t = createTournament(makeNames(8), 8);
    const done = playFavouredSeed(t);
    expect(findNextPending(done.rounds)).toBeNull();
  });
});
