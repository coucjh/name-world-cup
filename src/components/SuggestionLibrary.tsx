import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { SUGGESTION_GROUPS } from "../data/nameLibrary";

interface Props {
  isAdded: (name: string) => boolean;
  isFull: boolean;
  onAdd: (name: string) => void;
}

export default function SuggestionLibrary({ isAdded, isFull, onAdd }: Props) {
  const [active, setActive] = useState(SUGGESTION_GROUPS[0].id);
  const group = SUGGESTION_GROUPS.find((g) => g.id === active)!;

  return (
    <div className="rounded-2xl border-2 border-ink bg-white/60 p-3 shadow-card-sm">
      <div className="mb-3 flex flex-wrap gap-2">
        {SUGGESTION_GROUPS.map((g) => (
          <button
            key={g.id}
            onClick={() => setActive(g.id)}
            className={`rounded-full border-2 border-ink px-3 py-1 text-sm font-bold transition-transform active:translate-y-0.5 ${
              active === g.id
                ? "bg-ink text-paper"
                : "bg-paper text-ink hover:-translate-y-0.5"
            }`}
          >
            <span className="mr-1">{g.emoji}</span>
            {g.label}
          </button>
        ))}
      </div>

      <div className="flex max-h-52 flex-wrap gap-2 overflow-y-auto pr-1">
        {group.names.map((name) => {
          const added = isAdded(name);
          const disabled = added || isFull;
          return (
            <button
              key={name}
              onClick={() => !disabled && onAdd(name)}
              disabled={disabled}
              className={`group inline-flex items-center gap-1 rounded-full border-2 border-ink px-3 py-1 text-sm font-semibold transition ${
                added
                  ? "bg-grass text-white"
                  : disabled
                    ? "cursor-not-allowed bg-paper/60 text-ink/30"
                    : "bg-paper hover:bg-gold hover:-translate-y-0.5"
              }`}
            >
              {name}
              {added ? (
                <Check size={14} strokeWidth={3} />
              ) : (
                <Plus size={14} strokeWidth={3} className="opacity-40 group-hover:opacity-100" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
