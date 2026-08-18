"use client";

import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function UsageChart({ data }: { data: { day: string; count: number }[] }) {
  return (
    <div className="rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-6">
      <h2 className="mb-5 font-display text-xl text-[var(--paper)]">Messages — Last 7 Days</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="var(--ink-700)" strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="var(--paper-faint)" fontSize={11} />
            <Tooltip
              contentStyle={{
                background: "var(--ink-800)",
                border: "1px solid var(--ink-600)",
                borderRadius: "10px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "var(--paper)" }}
            />
            <Line type="monotone" dataKey="count" stroke="var(--signal)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--signal)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
