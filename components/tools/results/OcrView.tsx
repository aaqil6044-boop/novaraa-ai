import type { OcrResult } from "@/lib/tools/schemas";
import { SectionCard, BulletList } from "./primitives";
import { ScanText, AlertTriangle } from "lucide-react";

export default function OcrView({ data }: { data: OcrResult }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-4">
        <span className="rounded-full border border-[var(--ink-700)] px-3 py-1 font-data text-[11px] text-[var(--paper-dim)]">{data.documentType}</span>
        <span className="rounded-full border border-[var(--ink-700)] px-3 py-1 font-data text-[11px] text-[var(--paper-dim)]">{data.language}</span>
        <span className="ml-auto font-data text-[11px] text-[var(--paper-faint)]">Confidence: {data.confidence}%</span>
      </div>

      <SectionCard title="Extracted Text" icon={<ScanText size={13} />} accent="success">
        <pre className="max-h-[480px] overflow-y-auto whitespace-pre-wrap font-data text-[13px] leading-6 text-[var(--paper)]">{data.extractedText}</pre>
      </SectionCard>

      {data.uncertainSections.length > 0 && (
        <SectionCard title="Uncertain Sections" icon={<AlertTriangle size={13} />} accent="danger">
          <BulletList items={data.uncertainSections} />
        </SectionCard>
      )}
    </div>
  );
}
