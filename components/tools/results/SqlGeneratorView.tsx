import type { SqlGeneratorResult } from "@/lib/tools/schemas";
import { SectionCard, BulletList, CodeBlock } from "./primitives";
import { Database, Gauge, Table2, GitCompare } from "lucide-react";

export default function SqlGeneratorView({ data }: { data: SqlGeneratorResult }) {
  const columns = data.exampleOutput.length ? Object.keys(data.exampleOutput[0]) : [];

  return (
    <div className="space-y-5">
      <SectionCard title="SQL Query" icon={<Database size={13} />} accent="nova" right={<span className="font-data text-[11px] text-[var(--paper-faint)]">{data.dialect}</span>}>
        <CodeBlock>{data.sqlQuery}</CodeBlock>
        <p className="mt-3 text-[13.5px] leading-6 text-[var(--paper-dim)]">{data.explanation}</p>
      </SectionCard>

      <SectionCard title="Optimization Tips" icon={<Gauge size={13} />} accent="signal">
        <BulletList items={data.optimizationTips} />
      </SectionCard>

      {columns.length > 0 && (
        <SectionCard title="Example Output" icon={<Table2 size={13} />}>
          <div className="overflow-x-auto rounded-xl border border-[var(--ink-700)]">
            <table className="min-w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--ink-700)] bg-[var(--ink-950)]">
                  {columns.map((c) => (
                    <th key={c} className="px-3 py-2 text-left font-data text-[11px] uppercase tracking-wide text-[var(--paper-faint)]">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.exampleOutput.map((row, i) => (
                  <tr key={i} className="border-b border-[var(--ink-800)] last:border-0">
                    {columns.map((c) => (
                      <td key={c} className="px-3 py-2 text-[var(--paper-dim)]">
                        {row[c]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {data.alternativeQueries.length > 0 && (
        <SectionCard title="Alternative Queries" icon={<GitCompare size={13} />} accent="nova">
          <div className="space-y-4">
            {data.alternativeQueries.map((a, i) => (
              <div key={i}>
                <p className="mb-1.5 text-[13.5px] font-semibold text-[var(--paper)]">{a.label}</p>
                <CodeBlock>{a.query}</CodeBlock>
                <p className="mt-1.5 text-[12.5px] italic text-[var(--paper-faint)]">Tradeoff: {a.tradeoff}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
