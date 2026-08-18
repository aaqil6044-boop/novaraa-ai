import type { GrammarCheckerResult } from "@/lib/tools/schemas";
import { ScoreGauge, SectionCard } from "./primitives";
import { SpellCheck2, PenTool } from "lucide-react";

export default function GrammarCheckerView({ data }: { data: GrammarCheckerResult }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-6 rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-5">
        <ScoreGauge value={data.readabilityScore} label="Readability" accent="success" />
        <p className="flex-1 text-[13.5px] leading-6 text-[var(--paper-dim)]">
          {data.grammarErrors.length + data.spellingErrors.length} correction
          {data.grammarErrors.length + data.spellingErrors.length === 1 ? "" : "s"} applied below.
        </p>
      </div>

      {(data.grammarErrors.length > 0 || data.spellingErrors.length > 0) && (
        <SectionCard title="Corrections" icon={<SpellCheck2 size={13} />}>
          <div className="space-y-2.5">
            {data.grammarErrors.map((e, i) => (
              <div key={`g${i}`} className="rounded-xl border border-[var(--ink-700)] bg-[var(--ink-950)] p-3 text-[13.5px]">
                <span className="text-[var(--danger)] line-through">{e.original}</span>
                <span className="mx-2 text-[var(--paper-faint)]">→</span>
                <span className="font-semibold text-[var(--success)]">{e.corrected}</span>
                <p className="mt-1 text-[12.5px] text-[var(--paper-faint)]">{e.explanation}</p>
              </div>
            ))}
            {data.spellingErrors.map((e, i) => (
              <div key={`s${i}`} className="rounded-xl border border-[var(--ink-700)] bg-[var(--ink-950)] p-3 text-[13.5px]">
                <span className="text-[var(--danger)] line-through">{e.original}</span>
                <span className="mx-2 text-[var(--paper-faint)]">→</span>
                <span className="font-semibold text-[var(--success)]">{e.corrected}</span>
                <span className="ml-2 font-data text-[10px] uppercase text-[var(--paper-faint)]">spelling</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {data.sentenceImprovements.length > 0 && (
        <SectionCard title="Sentence Improvements" icon={<PenTool size={13} />} accent="nova">
          <div className="space-y-2.5">
            {data.sentenceImprovements.map((s, i) => (
              <div key={i} className="text-[13.5px] leading-6">
                <p className="text-[var(--paper-faint)]">{s.original}</p>
                <p className="text-[var(--paper)]">→ {s.improved}</p>
                <p className="text-[12px] italic text-[var(--paper-faint)]">{s.reason}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard title="Corrected Text">
        <p className="whitespace-pre-line text-[13.5px] leading-7 text-[var(--paper-dim)]">{data.correctedText}</p>
      </SectionCard>

      <SectionCard title="Professional Rewrite" accent="signal">
        <p className="whitespace-pre-line text-[13.5px] leading-7 text-[var(--paper)]">{data.professionalRewrite}</p>
      </SectionCard>
    </div>
  );
}
