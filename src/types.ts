export type BracketSize = 8 | 16 | 32;

export interface NameEntry {
  id: string;
  name: string;
  starred: boolean;
}

export interface Seeded extends NameEntry {
  seed: number;
}

export interface Match {
  id: string;
  round: number; // 0 = first round
  a: Seeded | null;
  b: Seeded | null;
  winnerId?: string;
}

export interface Tournament {
  size: BracketSize;
  category: NameCategory;
  rounds: Match[][]; // rounds[0] = first round, last round holds the final
  currentRound: number;
  currentMatchIndex: number;
  champion?: Seeded;
}

export type NameCategory = "baby" | "pet";
