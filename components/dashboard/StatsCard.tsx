type StatsCardProps = {
  title: string;
  value: string;
  subtitle: string;
};

export default function StatsCard({ title, value, subtitle }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-6 transition hover:border-[var(--signal-line)]">
      <h3 className="font-data text-[11px] uppercase tracking-wide text-[var(--paper-faint)]">{title}</h3>
      <h2 className="mt-3 font-display text-4xl text-[var(--paper)]">{value}</h2>
      <p className="mt-2.5 text-[12.5px] text-[var(--paper-dim)]">{subtitle}</p>
    </div>
  );
}
