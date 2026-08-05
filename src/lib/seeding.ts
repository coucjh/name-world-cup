import type { NameEntry, Seeded } from "../types";

/**
 * Classic single-elimination seed ordering.
 * Returns the seed number (1..n) that belongs in each bracket slot, so that
 * seed 1 and seed 2 sit at opposite ends and the top seeds are spread across
 * the bracket (they can only meet in later rounds).
 *
 * e.g. seedOrder(8) -> [1, 8, 4, 5, 2, 7, 3, 6]
 */
export function seedOrder(n: number): number[] {
  let order = [1, 2];
  while (order.length < n) {
    const len = order.length * 2 + 1;
    order = order.flatMap((s) => [s, len - s]);
  }
  return order;
}

/** Fisher–Yates shuffle. Accepts an rng for deterministic tests. */
export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Assign seed numbers to names. Starred favourites become the top seeds
 * (1..k, shuffled among themselves) so the bracket keeps them apart; the rest
 * get shuffled seeds after them. Index 0 of the result is seed 1.
 */
export function assignSeeds(
  names: NameEntry[],
  rng: () => number = Math.random
): Seeded[] {
  const starred = shuffle(
    names.filter((n) => n.starred),
    rng
  );
  const rest = shuffle(
    names.filter((n) => !n.starred),
    rng
  );
  return [...starred, ...rest].map((n, i) => ({ ...n, seed: i + 1 }));
}
