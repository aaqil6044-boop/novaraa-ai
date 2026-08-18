import { getTool } from "@/lib/tools";

export default function ToolUsage({ usage }: { usage: { slug: string; count: number }[] }) {
  return (
    <div className="rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-6">
      <h2 className="mb-5 font-display text-xl text-[var(--paper)]">Most Used Tools</h2>
      {usage.length === 0 ? (
        <p className="text-[13.5px] text-[var(--paper-faint)]">Run an AI tool to see usage stats here.</p>
      ) : (
        <div className="space-y-3.5">
          {usage.slice(0, 6).map((u) => {
            const tool = getTool(u.slug);
            const max = usage[0].count || 1;
            return (
              <div key={u.slug}>
                <div className="mb-1.5 flex justify-between text-[13px]">
                  <span className="text-[var(--paper-dim)]">{tool?.label ?? u.slug}</span>
                  <span className="font-data text-[11px] text-[var(--paper-faint)]">{u.count}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--ink-800)]">
                  <div
                    className="h-1.5 rounded-full bg-[var(--signal)]"
                    style={{ width: `${(u.count / max) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
