"use client";

import { useState } from "react";
import type { StudyAssistantResult } from "@/lib/tools/schemas";
import { SectionCard, BulletList, Callout } from "./primitives";
import { Lightbulb, Sparkles, Layers, HelpCircle } from "lucide-react";

function MiniFlashcard({ question, answer }: { question: string; answer: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="w-full rounded-xl border border-[var(--ink-700)] bg-[var(--ink-950)] p-4 text-left text-[13.5px] transition hover:border-[var(--signal-line)]"
    >
      <p className="font-data text-[10px] uppercase tracking-wide text-[var(--paper-faint)]">{flipped ? "Answer" : "Question"} · tap to flip</p>
      <p className="mt-1.5 text-[var(--paper)]">{flipped ? answer : question}</p>
    </button>
  );
}

export default function StudyAssistantView({ data }: { data: StudyAssistantResult }) {
  return (
    <div className="space-y-5">
      <Callout accent="signal">{data.summary}</Callout>

      <SectionCard title="Explanation" icon={<Lightbulb size={13} />}>
        <p className="whitespace-pre-line text-[13.5px] leading-7 text-[var(--paper-dim)]">{data.explanation}</p>
      </SectionCard>

      <SectionCard title="Examples" icon={<Sparkles size={13} />} accent="nova">
        <BulletList items={data.examples} />
      </SectionCard>

      {data.mnemonics.length > 0 && (
        <SectionCard title="Mnemonics" accent="success">
          <BulletList items={data.mnemonics} />
        </SectionCard>
      )}

      <SectionCard title="Exam Notes">
        <BulletList items={data.examNotes} />
      </SectionCard>

      {data.flashcards.length > 0 && (
        <SectionCard title="Quick Flashcards" icon={<Layers size={13} />} accent="nova">
          <div className="grid gap-3 sm:grid-cols-2">
            {data.flashcards.map((f, i) => (
              <MiniFlashcard key={i} question={f.question} answer={f.answer} />
            ))}
          </div>
        </SectionCard>
      )}

      {data.practiceQuestions.length > 0 && (
        <SectionCard title="Practice Questions" icon={<HelpCircle size={13} />}>
          <div className="space-y-3">
            {data.practiceQuestions.map((p, i) => (
              <details key={i} className="rounded-xl border border-[var(--ink-700)] bg-[var(--ink-950)] p-3">
                <summary className="cursor-pointer text-[13.5px] font-semibold text-[var(--paper)]">{p.question}</summary>
                <p className="mt-2 text-[13.5px] leading-6 text-[var(--paper-dim)]">{p.answer}</p>
              </details>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
