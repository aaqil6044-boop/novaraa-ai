import type { BugFinderResult } from "@/lib/tools/schemas";
import { SectionCard, IssueRow, CodeBlock } from "./primitives";
import { Zap, Brain, GitBranch, Skull, MemoryStick, Wrench } from "lucide-react";

function IssueList({ items }: { items: BugFinderResult["runtimeErrors"] }) {
  if (!items.length) return <p className="text-[13.5px] italic text-[var(--paper-faint)]">None found.</p>;
  return (
    <div className="space-y-2.5">
      {items.map((i, idx) => (
        <IssueRow key={idx} {...i} />
      ))}
    </div>
  );
}

export default function BugFinderView({ data }: { data: BugFinderResult }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--danger-soft)] bg-[var(--danger-soft)] p-4">
        <Skull size={20} className="text-[var(--danger)]" />
        <p className="text-[14px] text-[var(--paper)]">
          <span className="font-display text-[22px]">{data.totalIssuesFound}</span>{" "}
          {data.totalIssuesFound === 1 ? "defect" : "defects"} found — this pass ignores code style entirely.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="Runtime Errors" icon={<Zap size={13} />} accent="danger">
          <IssueList items={data.runtimeErrors} />
        </SectionCard>
        <SectionCard title="Logical Errors" icon={<Brain size={13} />} accent="danger">
          <IssueList items={data.logicalErrors} />
        </SectionCard>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="Edge Cases" icon={<GitBranch size={13} />} accent="signal">
          <IssueList items={data.edgeCases} />
        </SectionCard>
        <SectionCard title="Potential Crashes" icon={<Skull size={13} />} accent="danger">
          <IssueList items={data.potentialCrashes} />
        </SectionCard>
      </div>

      <SectionCard title="Memory Issues" icon={<MemoryStick size={13} />}>
        <IssueList items={data.memoryIssues} />
      </SectionCard>

      <SectionCard title="Fix Suggestions" icon={<Wrench size={13} />} accent="success">
        {data.fixSuggestions.length ? (
          <div className="space-y-3">
            {data.fixSuggestions.map((f, i) => (
              <div key={i}>
                <p className="text-[13.5px] font-semibold text-[var(--paper)]">{f.issue}</p>
                <p className="text-[13.5px] leading-6 text-[var(--paper-dim)]">{f.fix}</p>
                {f.codeSnippet && <div className="mt-2"><CodeBlock>{f.codeSnippet}</CodeBlock></div>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13.5px] italic text-[var(--paper-faint)]">No fixes needed.</p>
        )}
      </SectionCard>
    </div>
  );
}
