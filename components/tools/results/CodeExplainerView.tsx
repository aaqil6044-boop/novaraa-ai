import type { CodeExplainerResult } from "@/lib/tools/schemas";
import { SectionCard, BulletList, CodeBlock, Callout } from "./primitives";
import { Lightbulb, ListOrdered, Brain, AlertCircle } from "lucide-react";

export default function CodeExplainerView({ data }: { data: CodeExplainerResult }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-4">
        <span className="rounded-full bg-[rgba(89,200,139,0.14)] px-3 py-1 font-data text-[11px] uppercase tracking-wide text-[var(--success)]">
          {data.language}
        </span>
      </div>

      <Callout accent="success">
        <p className="mb-1 flex items-center gap-2 font-data text-[10.5px] uppercase tracking-wide text-[var(--success)]">
          <Lightbulb size={13} /> Overall Purpose
        </p>
        {data.overallPurpose}
      </Callout>

      <SectionCard title="Step by Step" icon={<ListOrdered size={13} />}>
        <div className="space-y-4">
          {data.steps.map((s, i) => (
            <div key={i} className="border-l-2 border-[var(--ink-700)] pl-4">
              <p className="text-[13.5px] font-semibold text-[var(--paper)]">
                <span className="text-[var(--signal)]">{i + 1}.</span> {s.title}
              </p>
              <p className="mt-1 text-[13.5px] leading-6 text-[var(--paper-dim)]">{s.explanation}</p>
              {s.codeExcerpt && <div className="mt-2"><CodeBlock>{s.codeExcerpt}</CodeBlock></div>}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Key Concepts" icon={<Brain size={13} />} accent="nova">
        <div className="space-y-2">
          {data.keyConcepts.map((k, i) => (
            <div key={i} className="text-[13.5px]">
              <span className="font-semibold text-[var(--paper)]">{k.concept}</span>
              <span className="text-[var(--paper-dim)]"> — {k.whyItMatters}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {data.potentialGotchas.length > 0 && (
        <SectionCard title="Potential Gotchas" icon={<AlertCircle size={13} />} accent="danger">
          <BulletList items={data.potentialGotchas} />
        </SectionCard>
      )}
    </div>
  );
}
