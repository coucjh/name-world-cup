import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import type { Tournament } from "../types";

interface Props {
  tournament: Tournament;
  onDone: () => void;
}

const QUIPS = [
  "Consulting the naming gods…",
  "Keeping your favourites apart…",
  "Polishing the trophy…",
  "Buttering up the bracket…",
  "Seeding the draw…",
];

export default function SeedingReveal({ tournament, onDone }: Props) {
  const [quip, setQuip] = useState(QUIPS[0]);

  useEffect(() => {
    const names = tournament.rounds[0].flatMap((m) =>
      [m.a?.name, m.b?.name].filter(Boolean)
    ) as string[];
    let i = 0;
    const spin = setInterval(() => {
      i++;
      setQuip(QUIPS[i % QUIPS.length]);
    }, 550);
    const done = setTimeout(onDone, 2300);
    return () => {
      clearInterval(spin);
      clearTimeout(done);
      void names;
    };
  }, [tournament, onDone]);

  // A little scatter of the actual names swirling into place.
  const chips = tournament.rounds[0]
    .flatMap((m) => [m.a, m.b])
    .filter(Boolean)
    .slice(0, 24) as { id: string; name: string; starred: boolean }[];

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="text-center">
        <motion.div
          animate={{ rotate: [0, -12, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
          className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-2xl border-2 border-ink bg-gold shadow-card"
        >
          <Shuffle size={36} strokeWidth={2.5} />
        </motion.div>
        <h2 className="font-display text-4xl uppercase sm:text-5xl">The Draw</h2>
        <motion.p
          key={quip}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm font-semibold text-ink/60"
        >
          {quip}
        </motion.p>

        <div className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-1.5">
          {chips.map((c, i) => (
            <motion.span
              key={c.id}
              initial={{ opacity: 0, scale: 0.3, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 20 }}
              className={`rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-bold ${
                c.starred ? "bg-gold" : "bg-white"
              }`}
            >
              {c.name}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
