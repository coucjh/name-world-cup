import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, Share2, Check } from "lucide-react";
import type { Tournament } from "../types";
import { fireChampionConfetti } from "../lib/confetti";
import { buildShareUrl } from "../lib/share";
import BracketView from "./BracketView";

interface Props {
  tournament: Tournament;
  onPlayAgain: () => void;
}

export default function ChampionView({ tournament, onPlayAgain }: Props) {
  const [copied, setCopied] = useState(false);
  const champ = tournament.champion!;
  const runnerUp = (() => {
    const final = tournament.rounds[tournament.rounds.length - 1][0];
    return final.a?.id === champ.id ? final.b : final.a;
  })();

  useEffect(() => {
    fireChampionConfetti();
  }, []);

  const share = async () => {
    const url = buildShareUrl({
      names: tournament.rounds[0]
        .flatMap((m) => [m.a, m.b])
        .filter(Boolean)
        .map((s) => ({ id: s!.id, name: s!.name, starred: s!.starred })),
      size: tournament.size,
      category: tournament.category,
    });
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard blocked — fall through, still show confirmation */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-3xl border-2 border-ink bg-gold shadow-card"
      >
        <Trophy size={52} strokeWidth={2} />
      </motion.div>

      <p className="font-display text-sm uppercase tracking-[0.3em] text-ink/50">
        Your champion is
      </p>
      <motion.h1
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 16 }}
        className="my-2 font-display text-7xl leading-none text-grass sm:text-8xl"
      >
        {champ.name}
      </motion.h1>
      <p className="text-sm font-semibold text-ink/60">
        {champ.starred ? "A seeded favourite goes all the way ⭐ " : "Seed #" + champ.seed + " lifts the trophy "}
        {runnerUp && <>· beat {runnerUp.name} in the final</>}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={share}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-white px-5 py-3 font-extrabold shadow-card-sm transition hover:-translate-y-0.5 active:translate-y-0"
        >
          {copied ? <Check size={18} strokeWidth={3} /> : <Share2 size={18} strokeWidth={2.5} />}
          {copied ? "Link copied!" : "Share this squad"}
        </button>
        <button
          onClick={onPlayAgain}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-coral px-5 py-3 font-extrabold text-white shadow-card-sm transition hover:-translate-y-0.5 active:translate-y-0"
        >
          <RotateCcw size={18} strokeWidth={2.5} /> Run it back
        </button>
      </div>

      <div className="mt-10 text-left">
        <h2 className="mb-3 text-center font-display text-2xl uppercase">The road to glory</h2>
        <div className="rounded-2xl border-2 border-ink bg-white/50 p-3 shadow-card-sm">
          <BracketView tournament={tournament} />
        </div>
      </div>
    </div>
  );
}
