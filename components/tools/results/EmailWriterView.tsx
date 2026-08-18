import type { EmailWriterResult } from "@/lib/tools/schemas";
import { SectionCard } from "./primitives";
import { Mail, Zap, Clock3 } from "lucide-react";

export default function EmailWriterView({ data }: { data: EmailWriterResult }) {
  return (
    <div className="space-y-5">
      <SectionCard title="Subject Line Options" icon={<Mail size={13} />}>
        <div className="space-y-1.5">
          {data.subjectLines.map((s, i) => (
            <p key={i} className="rounded-lg border border-[var(--ink-700)] bg-[var(--ink-950)] px-3 py-2 text-[13.5px] text-[var(--paper)]">
              {s}
            </p>
          ))}
        </div>
        <p className="mt-2 font-data text-[11px] uppercase tracking-wide text-[var(--paper-faint)]">Tone: {data.tone}</p>
      </SectionCard>

      <SectionCard title="Email Body" accent="signal">
        <p className="whitespace-pre-line text-[13.5px] leading-7 text-[var(--paper)]">{data.body}</p>
      </SectionCard>

      <SectionCard title="Shorter Version" icon={<Zap size={13} />} accent="nova">
        <p className="whitespace-pre-line text-[13.5px] leading-7 text-[var(--paper-dim)]">{data.shorterVersion}</p>
      </SectionCard>

      <SectionCard title="Suggested Follow-Up" icon={<Clock3 size={13} />}>
        <p className="text-[13.5px] leading-6 text-[var(--paper-dim)]">{data.followUpSuggestion}</p>
      </SectionCard>
    </div>
  );
}
