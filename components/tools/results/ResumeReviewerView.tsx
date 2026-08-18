import type { ResumeReviewerResult } from "@/lib/tools/schemas";
import { ScoreGauge, SectionCard, BulletList, NumberedList, Callout } from "./primitives";
import { Award, AlertTriangle, KeyRound, PenLine, GraduationCap, Wrench, Gavel } from "lucide-react";

export default function ResumeReviewerView({ data }: { data: ResumeReviewerResult }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-5">
        <ScoreGauge value={data.overallScore} label="Overall Score" accent="signal" />
        <ScoreGauge value={data.atsScore} label="ATS Score" accent="nova" />
        <div className="flex-1 min-w-[220px]">
          <p className="font-data text-[10.5px] uppercase tracking-wide text-[var(--paper-faint)]">Recruiter's First Impression</p>
          <p className="mt-1.5 text-[14px] leading-6 text-[var(--paper)]">{data.recruiterImpression}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="Strengths" icon={<Award size={13} />} accent="success">
          <BulletList items={data.strengths} />
        </SectionCard>
        <SectionCard title="Weaknesses" icon={<AlertTriangle size={13} />} accent="danger">
          <BulletList items={data.weaknesses} />
        </SectionCard>
      </div>

      <SectionCard title="Missing Keywords" icon={<KeyRound size={13} />} accent="nova">
        <div className="flex flex-wrap gap-1.5">
          {data.missingKeywords.length ? (
            data.missingKeywords.map((k, i) => (
              <span key={i} className="rounded-full border border-[var(--nova-soft)] bg-[var(--nova-soft)] px-2.5 py-1 text-[12px] text-[var(--paper)]">
                {k}
              </span>
            ))
          ) : (
            <p className="text-[13.5px] italic text-[var(--paper-faint)]">No obvious gaps found.</p>
          )}
        </div>
      </SectionCard>

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="Formatting Issues" icon={<PenLine size={13} />}>
          <BulletList items={data.formattingIssues} />
        </SectionCard>
        <SectionCard title="Grammar Issues" icon={<PenLine size={13} />}>
          <BulletList items={data.grammarIssues} />
        </SectionCard>
      </div>

      <SectionCard title="Section-by-Section Review" icon={<GraduationCap size={13} />}>
        <div className="space-y-4">
          <div>
            <p className="mb-1 font-data text-[10.5px] uppercase tracking-wide text-[var(--signal)]">Experience</p>
            <p className="text-[13.5px] leading-6 text-[var(--paper-dim)]">{data.experienceAnalysis}</p>
          </div>
          <div>
            <p className="mb-1 font-data text-[10.5px] uppercase tracking-wide text-[var(--signal)]">Education</p>
            <p className="text-[13.5px] leading-6 text-[var(--paper-dim)]">{data.educationReview}</p>
          </div>
          <div>
            <p className="mb-1 font-data text-[10.5px] uppercase tracking-wide text-[var(--signal)]">Skills</p>
            <p className="text-[13.5px] leading-6 text-[var(--paper-dim)]">{data.skillsReview}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Improvement Suggestions" icon={<Wrench size={13} />} accent="success">
        <NumberedList items={data.improvementSuggestions} />
      </SectionCard>

      <div className="flex items-start gap-2.5">
        <Gavel size={15} className="mt-3 shrink-0 text-[var(--signal)]" />
        <Callout accent="signal">
          <span className="font-semibold">Final Verdict — </span>
          {data.finalVerdict}
        </Callout>
      </div>
    </div>
  );
}
