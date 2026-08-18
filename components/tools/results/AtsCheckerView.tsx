import type { AtsCheckerResult } from "@/lib/tools/schemas";
import { ScoreGauge, SectionCard, BulletList, NumberedList, ProgressBar } from "./primitives";
import { ScanEye, ListTree, FileWarning, Wrench } from "lucide-react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function AtsCheckerView({ data }: { data: AtsCheckerResult }) {
  const maxOccurrence = Math.max(1, ...data.keywordDensity.map((k) => Math.max(k.occurrences, k.idealMin)));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-6 rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-5">
        <ScoreGauge value={data.atsCompatibilityScore} label="ATS Compatibility" accent="nova" />
        <div className="flex-1">
          <p className="flex items-center gap-2 font-data text-[11px] uppercase tracking-wide text-[var(--paper-faint)]">
            <ScanEye size={13} /> Parser Simulation
          </p>
          <p className="mt-1.5 text-[13.5px] leading-6 text-[var(--paper-dim)]">
            This mirrors how an automated tracking system would parse the document — structure and keyword matching only.
          </p>
        </div>
      </div>

      <SectionCard title="Keyword Density" icon={<ListTree size={13} />} accent="nova">
        {data.keywordDensity.length ? (
          <div className="space-y-3">
            {data.keywordDensity.map((k, i) => (
              <div key={i}>
                <div className="mb-1 flex justify-between text-[13px] text-[var(--paper-dim)]">
                  <span>{k.keyword}</span>
                  <span className="font-data text-[11px] text-[var(--paper-faint)]">
                    {k.occurrences}/{k.idealMin} ideal
                  </span>
                </div>
                <ProgressBar value={k.occurrences} max={maxOccurrence} accent={k.occurrences >= k.idealMin ? "success" : "signal"} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13.5px] italic text-[var(--paper-faint)]">No keywords analyzed.</p>
        )}
      </SectionCard>

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="Missing Keywords">
          <BulletList items={data.missingKeywords} />
        </SectionCard>
        <SectionCard title="Section Analysis" icon={<ListTree size={13} />}>
          <div className="space-y-2">
            {data.sectionAnalysis.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-[13.5px] text-[var(--paper-dim)]">
                {s.present ? (
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[var(--success)]" />
                ) : (
                  <XCircle size={15} className="mt-0.5 shrink-0 text-[var(--danger)]" />
                )}
                <span>
                  <span className="font-semibold text-[var(--paper)]">{s.section}</span> — {s.note}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="Parsing Problems" icon={<FileWarning size={13} />} accent="danger">
          <BulletList items={data.parsingProblems} />
        </SectionCard>
        <SectionCard title="File Compatibility" icon={<FileWarning size={13} />}>
          <BulletList items={data.fileCompatibilityNotes} />
        </SectionCard>
      </div>

      <SectionCard title="Formatting Issues">
        <BulletList items={data.formattingIssues} />
      </SectionCard>

      <SectionCard title="ATS Improvement Tips" icon={<Wrench size={13} />} accent="success">
        <NumberedList items={data.improvementTips} />
      </SectionCard>
    </div>
  );
}
