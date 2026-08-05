import { describe, expect, it } from "vitest";
import type { NameEntry } from "../types";
import { assignSeeds, seedOrder, shuffle } from "./seeding";

/** Deterministic rng cycling through fixed values, for repeatable tests. */
function seededRng(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

function makeNames(n: number, starredCount = 0): NameEntry[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `n${i}`,
    name: `Name${i}`,
    starred: i < starredCount,
  }));
}

describe("seedOrder", () => {
  it("produces the classic ordering for small brackets", () => {
    expect(seedOrder(2)).toEqual([1, 2]);
    expect(seedOrder(4)).toEqual([1, 4, 2, 3]);
    expect(seedOrder(8)).toEqual([1, 8, 4, 5, 2, 7, 3, 6]);
  });

  it("keeps seeds 1 and 2 at opposite ends for 32", () => {
    const order = seedOrder(32);
    expect(order).toHaveLength(32);
    expect(order[0]).toBe(1);
    // seed 2 tops the bottom half, so 1 and 2 can only meet in the final
    expect(order[16]).toBe(2);
    // every seed 1..32 appears exactly once
    expect(new Set(order).size).toBe(32);
  });

  it("seeds 1 and 2 land in opposite halves", () => {
    const order = seedOrder(32);
    const half1 = order.slice(0, 16);
    const half2 = order.slice(16);
    expect(half1).toContain(1);
    expect(half2).toContain(2);
  });
});

describe("assignSeeds", () => {
  it("gives starred names the top seeds", () => {
    const names = makeNames(8, 3); // n0,n1,n2 starred
    const seeded = assignSeeds(names, seededRng([0]));
    const topThree = seeded
      .filter((s) => s.seed <= 3)
      .map((s) => s.id)
      .sort();
    expect(topThree).toEqual(["n0", "n1", "n2"]);
  });

  it("assigns every seed 1..n exactly once", () => {
    const seeded = assignSeeds(makeNames(16, 4));
    const seeds = seeded.map((s) => s.seed).sort((a, b) => a - b);
    expect(seeds).toEqual(Array.from({ length: 16 }, (_, i) => i + 1));
  });
});

describe("shuffle", () => {
  it("preserves all elements", () => {
    const out = shuffle([1, 2, 3, 4, 5]);
    expect(out.sort()).toEqual([1, 2, 3, 4, 5]);
  });
});
