import type { PdfSummarizerResult } from "@/lib/tools/schemas";
import { SectionCard, BulletList, KeyValueGrid, Callout } from "./primitives";
import { FileStack, Hash, CheckSquare, HelpCircle, History, Sparkles } from "lucide-react";

export default function PdfSummarizerView({ data }: { data: PdfSummarizerResult }) {
  return (
    <div className="space-y-5">
      <Callout accent="signal">
        <p className="mb-1 font-data text-[10.5px] uppercase tracking-wide text-[var(--signal)]">Executive Summary</p>
        {data.executiveSummary}
      </Callout>

      <SectionCard title="Detailed Summary" icon={<FileStack size={13} />}>
        <p className="whitespace-pre-line text-[13.5px] leading-7 text-[var(--paper-dim)]">{data.detailedSummary}</p>
      </SectionCard>

      <SectionCard title="Key Insights" icon={<Sparkles size={13} />} accent="nova">
        <BulletList items={data.keyInsights} />
      </SectionCard>

      {data.importantNumbers.length > 0 && (
        <SectionCard title="Important Numbers" icon={<Hash size={13} />}>
          <KeyValueGrid items={data.importantNumbers.map((n) => ({ label: n.label, value: n.context ? `${n.value} — ${n.context}` : n.value }))} />
        </SectionCard>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="Action Items" icon={<CheckSquare size={13} />} accent="success">
          <BulletList items={data.actionItems} />
        </SectionCard>
        {data.timeline.length > 0 && (
          <SectionCard title="Timeline" icon={<History size={13} />}>
            <div className="space-y-3 border-l-2 border-[var(--ink-700)] pl-4">
              {data.timeline.map((t, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-[var(--nova)]" />
                  <p className="font-data text-[11px] text-[var(--paper-faint)]">{t.when}</p>
                  <p className="text-[13.5px] text-[var(--paper-dim)]">{t.what}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>

      {data.questionsAnswered.length > 0 && (
        <SectionCard title="Questions Answered" icon={<HelpCircle size={13} />}>
          <div className="space-y-3">
            {data.questionsAnswered.map((q, i) => (
              <div key={i}>
                <p className="text-[13.5px] font-semibold text-[var(--paper)]">{q.question}</p>
                <p className="text-[13.5px] leading-6 text-[var(--paper-dim)]">{q.answer}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard title="Final Takeaways" accent="signal">
        <BulletList items={data.finalTakeaways} />
      </SectionCard>
    </div>
  );
}
