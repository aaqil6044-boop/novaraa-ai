"use client";

import { useState } from "react";
import type { FlashcardGeneratorResult } from "@/lib/tools/schemas";
import { SeverityBadge, ProgressBar } from "./primitives";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";

export default function FlashcardGeneratorView({ data }: { data: FlashcardGeneratorResult }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = data.flashcards[index];
  const total = data.flashcards.length;

  function go(delta: number) {
    setFlipped(false);
    setIndex((i) => Math.max(0, Math.min(total - 1, i + delta)));
  }

  if (!card) return <p className="text-[13.5px] italic text-[var(--paper-faint)]">No flashcards generated.</p>;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-[16px] text-[var(--paper)]">{data.topic}</p>
        <p className="font-data text-[11px] text-[var(--paper-faint)]">
          {index + 1} / {total}
        </p>
      </div>
      <ProgressBar value={index + 1} max={total} accent="nova" />

      <button
        onClick={() => setFlipped((f) => !f)}
        className="flex min-h-[220px] w-full flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-8 text-center transition hover:border-[var(--signal-line)]"
      >
        <div className="flex items-center gap-2">
          <SeverityBadge level={card.difficulty} />
          <span className="font-data text-[10px] uppercase tracking-wide text-[var(--paper-faint)]">{flipped ? "Answer" : "Question"}</span>
        </div>
        <p className="font-display text-[19px] leading-8 text-[var(--paper)]">{flipped ? card.answer : card.question}</p>
        <span className="flex items-center gap-1.5 font-data text-[11px] text-[var(--paper-faint)]">
          <RotateCw size={12} /> tap card to flip
        </span>
      </button>

      <div className="flex items-center justify-between">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          className="flex items-center gap-1.5 rounded-xl border border-[var(--ink-700)] px-4 py-2 text-[13px] text-[var(--paper-dim)] transition hover:border-[var(--signal-line)] disabled:opacity-30"
        >
          <ChevronLeft size={14} /> Prev
        </button>
        <button
          onClick={() => go(1)}
          disabled={index === total - 1}
          className="flex items-center gap-1.5 rounded-xl border border-[var(--ink-700)] px-4 py-2 text-[13px] text-[var(--paper-dim)] transition hover:border-[var(--signal-line)] disabled:opacity-30"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
