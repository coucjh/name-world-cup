import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Match, Seeded } from "../types";
import { firePickPop } from "../lib/confetti";

interface Props {
  match: Match;
  roundLabel: string;
  matchNumber: number;
  matchesInRound: number;
  onPick: (winnerId: string) => void;
}

function upsetLine(winner: Seeded, loser: Seeded): string {
  const gap = loser.seed - winner.seed; // negative = the underdog won
  if (gap <= -12) return "🚨 ENORMOUS UPSET. The bracket is shaking.";
  if (gap <= -5) return "😲 Upset! The underdog strikes.";
  if (Math.abs(gap) <= 1) return "🪙 Coin-flip stuff, that.";
  if (gap >= 10) return "🥱 Business as usual for the top seed.";
  return "✅ Through to the next round!";
}

export default function MatchupArena({
  match,
  roundLabel,
  matchNumber,
  matchesInRound,
  onPick,
}: Props) {
  const [picked, setPicked] = useState<string | null>(null);

  const a = match.a!;
  const b = match.b!;

  const choose = (winner: Seeded, e: React.MouseEvent) => {
    if (picked) return;
    setPicked(winner.id);
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    firePickPop((r.left + r.width / 2) / window.innerWidth, (r.top + r.height / 2) / window.innerHeight);
    window.setTimeout(() => onPick(winner.id), 820);
  };

  const loser = picked ? (picked === a.id ? b : a) : null;
  const winner = picked ? (picked === a.id ? a : b) : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <div className="mb-4 text-center">
        <span className="inline-block rounded-full border-2 border-ink bg-ink px-4 py-1 font-display text-sm uppercase tracking-widest text-paper">
          {roundLabel}
        </span>
        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-ink/40">
          Match {matchNumber} of {matchesInRound}
        </p>
      </div>

      <div className="relative grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <Fighter side="left" name={a} state={cardState(picked, a.id)} onClick={(e) => choose(a, e)} />

        <div className="grid place-items-center py-1 sm:py-0">
          <motion.div
            animate={picked ? { scale: [1, 1.4, 1], rotate: [0, -8, 0] } : {}}
            className="grid h-14 w-14 place-items-center rounded-full border-2 border-ink bg-coral font-display text-xl text-white shadow-card-sm"
          >
            VS
          </motion.div>
        </div>

        <Fighter side="right" name={b} state={cardState(picked, b.id)} onClick={(e) => choose(b, e)} />
      </div>

      <div className="mt-4 h-8 text-center">
        <AnimatePresence>
          {picked && winner && loser && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-lg uppercase tracking-wide"
            >
              {upsetLine(winner, loser)}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

type CardState = "idle" | "won" | "lost";
function cardState(picked: string | null, id: string): CardState {
  if (!picked) return "idle";
  return picked === id ? "won" : "lost";
}

function Fighter({
  name,
  side,
  state,
  onClick,
}: {
  name: Seeded;
  side: "left" | "right";
  state: CardState;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={state !== "idle"}
      initial={{ opacity: 0, x: side === "left" ? -40 : 40 }}
      animate={
        state === "won"
          ? { opacity: 1, x: 0, scale: 1.03 }
          : state === "lost"
            ? { opacity: 0.35, x: 0, scale: 0.95, rotate: side === "left" ? -2 : 2 }
            : { opacity: 1, x: 0, scale: 1 }
      }
      whileHover={state === "idle" ? { y: -6, rotate: side === "left" ? -1 : 1 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`relative flex min-h-[9rem] flex-col justify-between overflow-hidden rounded-3xl border-2 border-ink p-4 text-left shadow-card sm:min-h-[13rem] ${
        state === "won" ? "bg-grass text-white" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`grid h-8 w-8 place-items-center rounded-lg border-2 border-ink font-display text-sm ${
            state === "won" ? "bg-gold text-ink" : "bg-paper"
          }`}
        >
          {name.seed}
        </span>
        {name.starred && <span title="Favourite">⭐</span>}
      </div>
      <span className="font-display text-3xl leading-[0.95] sm:text-5xl">{name.name}</span>
      {state === "won" && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-3 -top-3 grid h-16 w-16 rotate-12 place-items-center rounded-full bg-gold font-display text-xs uppercase text-ink"
        >
          Winner!
        </motion.span>
      )}
    </motion.button>
  );
}
