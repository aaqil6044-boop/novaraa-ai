import type { ImageAnalyzerResult } from "@/lib/tools/schemas";
import { ScoreGauge, SectionCard, ProgressBar } from "./primitives";
import { Eye, ScanText, Palette, HelpCircle } from "lucide-react";

export default function ImageAnalyzerView({ data }: { data: ImageAnalyzerResult }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-6 rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-5">
        <ScoreGauge value={data.overallConfidence} label="Confidence" accent="nova" />
        <div className="flex-1">
          <p className="flex items-center gap-2 font-data text-[10.5px] uppercase tracking-wide text-[var(--paper-faint)]">
            <Eye size={13} /> Scene Description
          </p>
          <p className="mt-1.5 text-[13.5px] leading-6 text-[var(--paper)]">{data.sceneDescription}</p>
        </div>
      </div>

      <SectionCard title="Objects Detected">
        {data.objects.length ? (
          <div className="space-y-2.5">
            {data.objects.map((o, i) => (
              <div key={i}>
                <div className="mb-1 flex justify-between text-[13px] text-[var(--paper-dim)]">
                  <span>{o.name}</span>
                  <span className="font-data text-[11px] text-[var(--paper-faint)]">{o.confidence}%</span>
                </div>
                <ProgressBar value={o.confidence} accent="nova" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13.5px] italic text-[var(--paper-faint)]">No distinct objects detected.</p>
        )}
      </SectionCard>

      {data.ocrText && (
        <SectionCard title="Text Found (OCR)" icon={<ScanText size={13} />} accent="success">
          <p className="whitespace-pre-line font-data text-[13px] leading-6 text-[var(--paper)]">{data.ocrText}</p>
        </SectionCard>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="Dominant Colors" icon={<Palette size={13} />}>
          <div className="flex flex-wrap gap-2">
            {data.colors.map((c, i) => (
              <span key={i} className="rounded-full border border-[var(--ink-700)] bg-[var(--ink-950)] px-3 py-1 text-[12px] text-[var(--paper-dim)]">
                {c}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Summary">
          <p className="text-[13.5px] leading-6 text-[var(--paper-dim)]">{data.summary}</p>
        </SectionCard>
      </div>

      {data.questionsAnswered.length > 0 && (
        <SectionCard title="Questions Answered" icon={<HelpCircle size={13} />} accent="nova">
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
    </div>
  );
}
