import { motion } from "framer-motion";
import type { Match, Tournament } from "../types";
import { roundName } from "../lib/bracket";

interface Props {
  tournament: Tournament;
  currentMatchId?: string;
  compact?: boolean;
}

function Slot({
  name,
  seed,
  isWinner,
  decided,
}: {
  name?: string | null;
  seed?: number;
  isWinner: boolean;
  decided: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs ${
        isWinner
          ? "bg-grass font-bold text-white"
          : decided
            ? "text-ink/30 line-through"
            : "text-ink/70"
      }`}
    >
      {seed != null && (
        <span className="w-4 shrink-0 text-[10px] font-bold opacity-60">{seed}</span>
      )}
      <span className="truncate">{name ?? "—"}</span>
    </div>
  );
}

function MatchPill({ match, isCurrent }: { match: Match; isCurrent: boolean }) {
  const decided = !!match.winnerId;
  return (
    <motion.div
      layout
      className={`w-32 rounded-lg border-2 bg-white/80 p-1 ${
        isCurrent ? "border-coral shadow-card-sm" : "border-ink/30"
      }`}
      animate={isCurrent ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={isCurrent ? { repeat: Infinity, duration: 1.4 } : {}}
    >
      <Slot
        name={match.a?.name}
        seed={match.a?.seed}
        isWinner={decided && match.winnerId === match.a?.id}
        decided={decided}
      />
      <div className="my-0.5 h-px bg-ink/10" />
      <Slot
        name={match.b?.name}
        seed={match.b?.seed}
        isWinner={decided && match.winnerId === match.b?.id}
        decided={decided}
      />
    </motion.div>
  );
}

export default function BracketView({ tournament, currentMatchId, compact }: Props) {
  const total = tournament.rounds.length;
  return (
    <div className={`overflow-x-auto ${compact ? "" : "pb-2"}`}>
      <div className="flex min-w-max gap-4">
        {tournament.rounds.map((round, r) => (
          <div key={r} className="flex flex-col">
            <p className="mb-2 text-center font-display text-xs uppercase tracking-wider text-ink/50">
              {roundName(r, total)}
            </p>
            <div className="flex flex-1 flex-col justify-around gap-2">
              {round.map((m) => (
                <MatchPill key={m.id} match={m} isCurrent={m.id === currentMatchId} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
