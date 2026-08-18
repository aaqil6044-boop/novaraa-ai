import type { BlogWriterResult } from "@/lib/tools/schemas";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SectionCard, NumberedList, Callout } from "./primitives";
import { Search, ListOrdered, HelpCircle, Megaphone, Clock } from "lucide-react";

export default function BlogWriterView({ data }: { data: BlogWriterResult }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-5">
        <h2 className="font-display text-[22px] text-[var(--paper)]">{data.seoTitle}</h2>
        <p className="mt-1.5 text-[13.5px] text-[var(--paper-faint)]">{data.metaDescription}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-[var(--paper-faint)]">
          <span className="flex items-center gap-1 font-data"><Clock size={12} /> {data.estimatedReadingMinutes} min read</span>
          <span className="flex items-center gap-1 font-data"><Search size={12} /> {data.keywords.length} target keywords</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {data.keywords.map((k, i) => (
            <span key={i} className="rounded-full border border-[var(--signal-line)] bg-[var(--signal-soft)] px-2.5 py-0.5 text-[11.5px] text-[var(--paper)]">
              {k}
            </span>
          ))}
        </div>
      </div>

      <SectionCard title="Outline" icon={<ListOrdered size={13} />}>
        <NumberedList items={data.outline} />
      </SectionCard>

      <div className="rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-6">
        <div className="prose prose-invert max-w-none prose-headings:font-display prose-p:text-[14.5px] prose-p:leading-7 prose-li:text-[14.5px] prose-strong:text-[var(--paper)] prose-a:text-[var(--signal)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.fullBlog}</ReactMarkdown>
        </div>
      </div>

      {data.faq.length > 0 && (
        <SectionCard title="FAQ" icon={<HelpCircle size={13} />} accent="nova">
          <div className="space-y-3">
            {data.faq.map((f, i) => (
              <div key={i}>
                <p className="text-[13.5px] font-semibold text-[var(--paper)]">{f.question}</p>
                <p className="text-[13.5px] leading-6 text-[var(--paper-dim)]">{f.answer}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <div className="flex items-start gap-2.5">
        <Megaphone size={15} className="mt-3 shrink-0 text-[var(--signal)]" />
        <Callout accent="signal">{data.callToAction}</Callout>
      </div>
    </div>
  );
}
