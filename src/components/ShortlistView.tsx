import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, X, Trophy, Sparkles, Trash2 } from "lucide-react";
import type { BracketSize, NameEntry } from "../types";
import SuggestionLibrary from "./SuggestionLibrary";

interface Props {
  names: NameEntry[];
  size: BracketSize;
  canStart: boolean;
  starredCount: number;
  onAdd: (name: string) => boolean;
  onRemove: (id: string) => void;
  onToggleStar: (id: string) => void;
  onClear: () => void;
  onSetSize: (size: BracketSize) => void;
  onStart: () => void;
}

const SIZES: BracketSize[] = [8, 16, 32];

export default function ShortlistView(props: Props) {
  const { names, size, canStart, starredCount } = props;
  const [draft, setDraft] = useState("");

  const existing = useMemo(
    () => new Set(names.map((n) => n.name.trim().toLowerCase())),
    [names]
  );
  const isFull = names.length >= size;

  const submit = () => {
    if (props.onAdd(draft)) setDraft("");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      {/* Hero */}
      <header className="text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-1 text-xs font-bold uppercase tracking-widest shadow-card-sm">
          <Trophy size={14} className="text-gold" strokeWidth={3} /> The naming tournament
        </div>
        <h1 className="font-display text-6xl leading-[0.85] tracking-tight sm:text-8xl">
          <span className="text-grass">NAME</span>{" "}
          <span className="text-coral">WORLD</span>{" "}
          <span className="text-ink">CUP</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm font-medium text-ink/70 sm:text-base">
          Build your squad, ⭐ your favourites so they dodge each other early, then
          fight it out head-to-head until one name lifts the trophy.
        </p>
      </header>

      {/* Setup controls */}
      <section className="mt-8">
        <div className="rounded-2xl border-2 border-ink bg-white/60 p-3 shadow-card-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink/50">
            How many names?
          </p>
          <div className="flex gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => props.onSetSize(s)}
                className={`flex-1 rounded-xl border-2 border-ink px-3 py-2 font-display text-lg transition active:translate-y-0.5 ${
                  size === s ? "bg-grass text-white" : "bg-paper hover:bg-gold/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Add + suggestions */}
      <section className="mt-3 grid gap-3">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            disabled={isFull}
            placeholder={isFull ? "Squad full!" : "Type a name and hit Enter…"}
            className="w-full rounded-xl border-2 border-ink bg-white px-4 py-3 font-semibold shadow-card-sm outline-none placeholder:text-ink/30 focus:bg-gold/20 disabled:opacity-50"
          />
          <button
            onClick={submit}
            disabled={isFull || !draft.trim()}
            className="shrink-0 rounded-xl border-2 border-ink bg-ink px-5 py-3 font-extrabold text-paper transition active:translate-y-0.5 disabled:opacity-40"
          >
            Add
          </button>
        </div>
        <SuggestionLibrary
          isAdded={(n) => existing.has(n.trim().toLowerCase())}
          isFull={isFull}
          onAdd={(n) => props.onAdd(n)}
        />
      </section>

      {/* Squad */}
      <section className="mt-6">
        <div className="mb-2 flex items-end justify-between">
          <h2 className="font-display text-2xl">
            Your squad{" "}
            <span className={names.length === size ? "text-grass" : "text-ink/40"}>
              {names.length}/{size}
            </span>
          </h2>
          {names.length > 0 && (
            <button
              onClick={props.onClear}
              className="inline-flex items-center gap-1 text-xs font-bold text-ink/50 hover:text-coral"
            >
              <Trash2 size={13} /> Clear
            </button>
          )}
        </div>

        {names.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-ink/30 p-8 text-center text-sm font-medium text-ink/40">
            No names yet — add your own or tap the suggestions above.
          </div>
        ) : (
          <motion.div layout className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {names.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`group inline-flex items-center gap-1 rounded-full border-2 border-ink py-1 pl-1 pr-2 font-semibold shadow-card-sm ${
                    n.starred ? "bg-gold" : "bg-white"
                  }`}
                >
                  <button
                    onClick={() => props.onToggleStar(n.id)}
                    aria-label={n.starred ? "Unstar" : "Star favourite"}
                    className="grid h-6 w-6 place-items-center rounded-full transition hover:scale-110"
                  >
                    <Star
                      size={16}
                      strokeWidth={2.5}
                      className={n.starred ? "fill-ink text-ink" : "text-ink/30"}
                    />
                  </button>
                  <span>{n.name}</span>
                  <button
                    onClick={() => props.onRemove(n.id)}
                    aria-label="Remove"
                    className="grid h-5 w-5 place-items-center rounded-full text-ink/40 transition hover:bg-coral hover:text-white"
                  >
                    <X size={13} strokeWidth={3} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Start bar */}
      <footer className="sticky bottom-4 mt-8">
        <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-ink bg-white p-3 shadow-card sm:flex-row sm:justify-between">
          <p className="px-2 text-sm font-medium text-ink/70">
            {!canStart ? (
              `${size - names.length} more name${size - names.length === 1 ? "" : "s"} to fill the bracket`
            ) : starredCount > 0 ? (
              <>
                <Sparkles size={14} className="mb-0.5 mr-1 inline text-gold" />
                {starredCount} favourite{starredCount > 1 ? "s" : ""} seeded apart
              </>
            ) : (
              "Tip: ⭐ a few favourites so they don't clash early"
            )}
          </p>
          <button
            onClick={props.onStart}
            disabled={!canStart}
            className="w-full rounded-xl border-2 border-ink bg-grass px-8 py-3 font-display text-xl uppercase tracking-wide text-white shadow-card-sm transition enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:bg-ink/20 sm:w-auto"
          >
            Kick off →
          </button>
        </div>
      </footer>
    </div>
  );
}
