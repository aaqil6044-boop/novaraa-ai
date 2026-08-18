"use client";

import { useState } from "react";
import type { McqGeneratorResult } from "@/lib/tools/schemas";
import { SeverityBadge, ProgressBar } from "./primitives";
import { CheckCircle2, XCircle } from "lucide-react";

export default function McqGeneratorView({ data }: { data: McqGeneratorResult }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  function select(qIndex: number, optIndex: number) {
    if (answers[qIndex] !== undefined) return;
    setAnswers((a) => ({ ...a, [qIndex]: optIndex }));
  }

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.entries(answers).filter(([qi, oi]) => data.questions[Number(qi)]?.correctIndex === oi).length;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-4">
        <div className="mb-2 flex items-center justify-between text-[13px]">
          <p className="font-display text-[16px] text-[var(--paper)]">{data.topic}</p>
          <p className="font-data text-[11px] text-[var(--paper-faint)]">
            {answeredCount}/{data.questions.length} answered {answeredCount > 0 && `· ${correctCount} correct`}
          </p>
        </div>
        <ProgressBar value={answeredCount} max={data.questions.length} accent="nova" />
      </div>

      <div className="space-y-4">
        {data.questions.map((q, qi) => {
          const selected = answers[qi];
          const revealed = selected !== undefined;
          return (
            <div key={qi} className="rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-5">
              <div className="mb-3 flex items-center gap-2">
                <SeverityBadge level={q.difficulty} />
                <p className="text-[13.5px] font-semibold text-[var(--paper)]">
                  {qi + 1}. {q.question}
                </p>
              </div>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.correctIndex;
                  const isSelected = oi === selected;
                  let stateClasses = "border-[var(--ink-700)] hover:border-[var(--signal-line)]";
                  if (revealed && isCorrect) stateClasses = "border-[var(--success)] bg-[rgba(89,200,139,0.1)]";
                  else if (revealed && isSelected && !isCorrect) stateClasses = "border-[var(--danger)] bg-[rgba(242,85,95,0.1)]";

                  return (
                    <button
                      key={oi}
                      onClick={() => select(qi, oi)}
                      disabled={revealed}
                      className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-[13.5px] text-[var(--paper-dim)] transition ${stateClasses}`}
                    >
                      <span>
                        <span className="mr-2 font-data text-[11px] text-[var(--paper-faint)]">{String.fromCharCode(65 + oi)}.</span>
                        {opt}
                      </span>
                      {revealed && isCorrect && <CheckCircle2 size={15} className="shrink-0 text-[var(--success)]" />}
                      {revealed && isSelected && !isCorrect && <XCircle size={15} className="shrink-0 text-[var(--danger)]" />}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <p className="mt-3 text-[12.5px] italic leading-6 text-[var(--paper-faint)]">{q.explanation}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
