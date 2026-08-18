import type { TranslatorResult } from "@/lib/tools/schemas";
import { SectionCard, BulletList } from "./primitives";
import { Languages, BookA } from "lucide-react";

export default function TranslatorView({ data }: { data: TranslatorResult }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-4 font-data text-[12.5px] text-[var(--paper-dim)]">
        <Languages size={14} className="text-[var(--nova)]" />
        <span>{data.detectedSourceLanguage}</span>
        <span className="text-[var(--paper-faint)]">→</span>
        <span className="text-[var(--paper)]">{data.targetLanguage}</span>
      </div>

      <SectionCard title="Translation" accent="signal">
        <p className="text-[15px] leading-7 text-[var(--paper)]">{data.translation}</p>
      </SectionCard>

      <SectionCard title="Literal Translation" icon={<BookA size={13} />}>
        <p className="text-[13.5px] leading-6 text-[var(--paper-dim)]">{data.literalTranslation}</p>
      </SectionCard>

      {data.toneNotes.length > 0 && (
        <SectionCard title="Tone & Idiom Notes" accent="nova">
          <BulletList items={data.toneNotes} />
        </SectionCard>
      )}

      {data.alternativePhrasings.length > 0 && (
        <SectionCard title="Alternative Phrasings">
          <BulletList items={data.alternativePhrasings} />
        </SectionCard>
      )}
    </div>
  );
}
