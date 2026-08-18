"use client";

import type { ReactNode } from "react";

/* A radial score gauge — used differently per tool (0-100 quality/ATS/readability/etc). */
export function ScoreGauge({
  value,
  label,
  accent = "signal",
  size = 92,
}: {
  value: number;
  label: string;
  accent?: "signal" | "nova" | "success" | "danger";
  size?: number;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color = `var(--${accent})`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--ink-700)" strokeWidth={7} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={7}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-[22px] text-[var(--paper)]">{Math.round(clamped)}</span>
        </div>
      </div>
      <p className="text-center font-data text-[10.5px] uppercase tracking-wide text-[var(--paper-faint)]">{label}</p>
    </div>
  );
}

export function ProgressBar({
  value,
  max = 100,
  accent = "signal",
}: {
  value: number;
  max?: number;
  accent?: "signal" | "nova" | "success" | "danger";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-1.5 w-full rounded-full bg-[var(--ink-800)]">
      <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: `var(--${accent})` }} />
    </div>
  );
}

const SEVERITY_COLOR: Record<string, string> = {
  low: "#59c88b",
  medium: "#f0a63d",
  high: "#f2555f",
  critical: "#f2555f",
  easy: "#59c88b",
  hard: "#f2555f",
};

function withAlpha(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function SeverityBadge({ level }: { level: string }) {
  const color = SEVERITY_COLOR[level] || "#8e7cf2";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-data text-[10px] uppercase tracking-wide"
      style={{ color, background: withAlpha(color, 0.14), border: `1px solid ${withAlpha(color, 0.4)}` }}
    >
      {level}
    </span>
  );
}

const ACCENT_SOFT_FALLBACK: Record<string, string> = {
  signal: "rgba(240, 166, 61, 0.14)",
  nova: "rgba(142, 124, 242, 0.14)",
  success: "rgba(89, 200, 139, 0.14)",
  danger: "rgba(242, 85, 95, 0.14)",
};

const ACCENT_COLOR: Record<string, string> = {
  signal: "var(--signal)",
  nova: "var(--nova)",
  success: "var(--success)",
  danger: "var(--danger)",
};

export function SectionCard({
  title,
  icon,
  accent = "signal",
  children,
  right,
}: {
  title: string;
  icon?: ReactNode;
  accent?: "signal" | "nova" | "success" | "danger";
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <span
              className="flex h-6 w-6 items-center justify-center rounded-lg"
              style={{ background: ACCENT_SOFT_FALLBACK[accent], color: ACCENT_COLOR[accent] }}
            >
              {icon}
            </span>
          )}
          <h3 className="font-display text-[16px] text-[var(--paper)]">{title}</h3>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

export function EmptyNote({ children = "Nothing to report." }: { children?: ReactNode }) {
  return <p className="text-[13.5px] italic text-[var(--paper-faint)]">{children}</p>;
}

export function BulletList({ items }: { items: string[] }) {
  if (!items?.length) return <EmptyNote />;
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-[13.5px] leading-6 text-[var(--paper-dim)]">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--paper-faint)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function NumberedList({ items }: { items: string[] }) {
  if (!items?.length) return <EmptyNote />;
  return (
    <ol className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-[13.5px] leading-6 text-[var(--paper-dim)]">
          <span className="font-data text-[11px] text-[var(--signal)]">{String(i + 1).padStart(2, "0")}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function CodeBlock({ children, language }: { children: string; language?: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-[var(--ink-700)] bg-[var(--ink-950)] p-4 font-data text-[12.5px] leading-6 text-[var(--paper)]">
      <code>{children}</code>
    </pre>
  );
}

export function KeyValueGrid({ items }: { items: { label: string; value: string }[] }) {
  if (!items?.length) return <EmptyNote />;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-[var(--ink-700)] bg-[var(--ink-950)] p-3">
          <p className="font-data text-[10.5px] uppercase tracking-wide text-[var(--paper-faint)]">{item.label}</p>
          <p className="mt-0.5 text-[14px] text-[var(--paper)]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function IssueRow({
  title,
  detail,
  severity,
  location,
  fix,
}: {
  title: string;
  detail: string;
  severity: string;
  location?: string;
  fix?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--ink-700)] bg-[var(--ink-950)] p-3.5">
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <SeverityBadge level={severity} />
        <p className="text-[13.5px] font-semibold text-[var(--paper)]">{title}</p>
        {location && <span className="font-data text-[11px] text-[var(--paper-faint)]">· {location}</span>}
      </div>
      <p className="text-[13px] leading-6 text-[var(--paper-dim)]">{detail}</p>
      {fix && (
        <p className="mt-1.5 text-[12.5px] leading-6 text-[var(--success)]">
          <span className="font-semibold">Fix:</span> {fix}
        </p>
      )}
    </div>
  );
}

export function Callout({ children, accent = "signal" }: { children: ReactNode; accent?: "signal" | "nova" | "success" | "danger" }) {
  return (
    <div
      className="rounded-xl border p-4 text-[13.5px] leading-6"
      style={{ borderColor: ACCENT_COLOR[accent], background: ACCENT_SOFT_FALLBACK[accent], color: "var(--paper)" }}
    >
      {children}
    </div>
  );
}
