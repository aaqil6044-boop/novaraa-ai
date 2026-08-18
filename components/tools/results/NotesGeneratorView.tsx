import type { NotesGeneratorResult } from "@/lib/tools/schemas";
import { SectionCard, BulletList, Callout } from "./primitives";
import { BookOpenText } from "lucide-react";

export default function NotesGeneratorView({ data }: { data: NotesGeneratorResult }) {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-[22px] text-[var(--paper)]">{data.title}</h2>

      {data.sections.map((s, i) => (
        <SectionCard key={i} title={s.heading} icon={<BookOpenText size={13} />}>
          <BulletList items={s.bullets} />
        </SectionCard>
      ))}

      {data.keyTerms.length > 0 && (
        <SectionCard title="Key Terms" accent="nova">
          <div className="grid gap-3 sm:grid-cols-2">
            {data.keyTerms.map((k, i) => (
              <div key={i} className="rounded-xl border border-[var(--ink-700)] bg-[var(--ink-950)] p-3">
                <p className="text-[13.5px] font-semibold text-[var(--paper)]">{k.term}</p>
                <p className="text-[12.5px] leading-5 text-[var(--paper-dim)]">{k.definition}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <Callout accent="signal">{data.summary}</Callout>
    </div>
  );
}
