import type { CodeReviewerResult } from "@/lib/tools/schemas";
import { ScoreGauge, SectionCard, IssueRow, BulletList, NumberedList, CodeBlock } from "./primitives";
import { ShieldAlert, Gauge, Bug, Trash2, ThumbsUp, Wrench, FileCode2 } from "lucide-react";

export default function CodeReviewerView({ data }: { data: CodeReviewerResult }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-6 rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-5">
        <ScoreGauge value={data.codeQualityScore} label="Code Quality" accent="nova" />
        <div>
          <p className="font-data text-[10.5px] uppercase tracking-wide text-[var(--paper-faint)]">Detected Language</p>
          <p className="mt-1 text-[18px] font-display text-[var(--paper)]">{data.language}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="Security Issues" icon={<ShieldAlert size={13} />} accent="danger">
          {data.securityIssues.length ? (
            <div className="space-y-2.5">
              {data.securityIssues.map((i, idx) => (
                <IssueRow key={idx} {...i} />
              ))}
            </div>
          ) : (
            <p className="text-[13.5px] italic text-[var(--paper-faint)]">No security issues found.</p>
          )}
        </SectionCard>

        <SectionCard title="Performance Issues" icon={<Gauge size={13} />} accent="signal">
          {data.performanceIssues.length ? (
            <div className="space-y-2.5">
              {data.performanceIssues.map((i, idx) => (
                <IssueRow key={idx} {...i} />
              ))}
            </div>
          ) : (
            <p className="text-[13.5px] italic text-[var(--paper-faint)]">No performance issues found.</p>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="Bugs" icon={<Bug size={13} />} accent="danger">
          {data.bugs.length ? (
            <div className="space-y-2.5">
              {data.bugs.map((i, idx) => (
                <IssueRow key={idx} {...i} />
              ))}
            </div>
          ) : (
            <p className="text-[13.5px] italic text-[var(--paper-faint)]">No bugs found.</p>
          )}
        </SectionCard>

        <SectionCard title="Code Smells" icon={<Trash2 size={13} />}>
          {data.codeSmells.length ? (
            <div className="space-y-2.5">
              {data.codeSmells.map((i, idx) => (
                <IssueRow key={idx} {...i} />
              ))}
            </div>
          ) : (
            <p className="text-[13.5px] italic text-[var(--paper-faint)]">None found.</p>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Best Practices" icon={<ThumbsUp size={13} />} accent="success">
        <BulletList items={data.bestPractices} />
      </SectionCard>

      <SectionCard title="Suggested Improvements" icon={<Wrench size={13} />}>
        <NumberedList items={data.suggestedImprovements} />
      </SectionCard>

      <SectionCard title="Refactored Code" icon={<FileCode2 size={13} />} accent="nova">
        <CodeBlock>{data.refactoredCode || "// No changes needed"}</CodeBlock>
      </SectionCard>
    </div>
  );
}
