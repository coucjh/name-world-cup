import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, LayoutGrid } from "lucide-react";
import { useTournament } from "./hooks/useTournament";
import { roundName } from "./lib/bracket";
import ShortlistView from "./components/ShortlistView";
import SeedingReveal from "./components/SeedingReveal";
import MatchupArena from "./components/MatchupArena";
import BracketView from "./components/BracketView";
import ChampionView from "./components/ChampionView";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25 },
};

export default function App() {
  const t = useTournament();
  const [showBracket, setShowBracket] = useState(false);

  // Each phase mounts immediately via a keyed enter animation. We deliberately
  // avoid AnimatePresence mode="wait" here: gating the next screen on the
  // previous screen's exit-complete callback could intermittently hang (leaving
  // a blank screen) when the exiting screen had its own nested animations.
  return (
    <div className="bg-stadium min-h-screen">
      <motion.div key={t.phase} {...fade}>
        {t.phase === "shortlist" && (
          <ShortlistView
            names={t.names}
            size={t.size}
            canStart={t.canStart}
            starredCount={t.starredCount}
            onAdd={t.addName}
            onRemove={t.removeName}
            onToggleStar={t.toggleStar}
            onClear={t.clearAll}
            onSetSize={t.setSize}
            onStart={t.start}
          />
        )}

        {t.phase === "seeding" && t.tournament && (
          <SeedingReveal tournament={t.tournament} onDone={t.finishSeeding} />
        )}

        {t.phase === "playing" && t.tournament && (
          <div className="py-6 sm:py-10">
            <PlayHeader
              onBack={t.backToSquad}
              showBracket={showBracket}
              onToggleBracket={() => setShowBracket((s) => !s)}
              current={roundName(t.tournament.currentRound, t.tournament.rounds.length)}
            />

            <ArenaForCurrent t={t} />

            <AnimatePresence>
              {showBracket && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mx-auto mt-8 w-full max-w-5xl overflow-hidden px-4"
                >
                  <div className="rounded-2xl border-2 border-ink bg-white/50 p-3 shadow-card-sm">
                    <BracketView
                      tournament={t.tournament}
                      currentMatchId={
                        t.tournament.rounds[t.tournament.currentRound]?.[
                          t.tournament.currentMatchIndex
                        ]?.id
                      }
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {t.phase === "champion" && t.tournament && (
          <ChampionView tournament={t.tournament} onPlayAgain={t.backToSquad} />
        )}
      </motion.div>
    </div>
  );
}

function PlayHeader({
  onBack,
  showBracket,
  onToggleBracket,
  current,
}: {
  onBack: () => void;
  showBracket: boolean;
  onToggleBracket: () => void;
  current: string;
}) {
  return (
    <div className="mx-auto mb-6 flex w-full max-w-3xl items-center justify-between px-4">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-white px-3 py-1.5 text-sm font-bold shadow-card-sm transition hover:-translate-y-0.5"
      >
        <ChevronLeft size={16} strokeWidth={3} /> Squad
      </button>
      <span className="font-display text-xl uppercase tracking-wide text-ink/70">{current}</span>
      <button
        onClick={onToggleBracket}
        className={`inline-flex items-center gap-1 rounded-full border-2 border-ink px-3 py-1.5 text-sm font-bold shadow-card-sm transition hover:-translate-y-0.5 ${
          showBracket ? "bg-ink text-paper" : "bg-white"
        }`}
      >
        <LayoutGrid size={16} strokeWidth={2.5} /> Bracket
      </button>
    </div>
  );
}

function ArenaForCurrent({ t }: { t: ReturnType<typeof useTournament> }) {
  const tour = t.tournament!;
  const round = tour.rounds[tour.currentRound];
  const match = round?.[tour.currentMatchIndex];
  if (!match || !match.a || !match.b) return null;

  // Keyed by match id so each new matchup remounts and plays its enter
  // animation, without gating on the previous matchup's exit.
  return (
    <motion.div
      key={match.id}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <MatchupArena
        match={match}
        roundLabel={roundName(tour.currentRound, tour.rounds.length)}
        matchNumber={tour.currentMatchIndex + 1}
        matchesInRound={round.length}
        onPick={(winnerId) => t.pick(match.id, winnerId)}
      />
    </motion.div>
  );
}
