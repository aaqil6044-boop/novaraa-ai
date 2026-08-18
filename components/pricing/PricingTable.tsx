"use client";

import Link from "next/link";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "Try Novaraa with everyday AI work.",
    cta: "Get started",
    href: "/login",
    featured: false,
    features: [
      "Gemini 2.5 Flash chat",
      "5 AI tool runs / day",
      "10 file uploads / month",
      "Chat history & search",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    tagline: "For daily, serious AI-assisted work.",
    cta: "Upgrade to Pro",
    href: "/settings",
    featured: true,
    features: [
      "Gemini 2.5 Flash + Pro",
      "Unlimited AI tool runs",
      "Unlimited file uploads",
      "AI memory across chats",
      "Web search in chat",
      "Priority response speed",
    ],
  },
  {
    name: "Team",
    price: "$49",
    period: "/ seat / month",
    tagline: "Shared workspace for small teams.",
    cta: "Contact us",
    href: "mailto:hello@novaraa.app",
    featured: false,
    features: [
      "Everything in Pro",
      "Shared chat folders",
      "Centralized billing",
      "Usage analytics per seat",
      "Priority support",
    ],
  },
];

export default function PricingTable() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {PLANS.map((plan) => (
        <div
          key={plan.name}
          className={`relative flex flex-col rounded-3xl border p-7 ${
            plan.featured
              ? "border-[var(--signal-line)] bg-[var(--signal-soft)]"
              : "border-[var(--ink-700)] bg-[var(--ink-900)]"
          }`}
        >
          {plan.featured && (
            <span className="absolute -top-3 left-7 rounded-full bg-[var(--signal)] px-3 py-1 font-data text-[10px] font-semibold uppercase tracking-wide text-[var(--ink-950)]">
              Most popular
            </span>
          )}

          <h3 className="font-display text-xl text-[var(--paper)]">{plan.name}</h3>
          <p className="mt-1.5 text-[13px] text-[var(--paper-dim)]">{plan.tagline}</p>

          <div className="mt-6 flex items-baseline gap-1.5">
            <span className="font-display text-4xl text-[var(--paper)]">{plan.price}</span>
            <span className="text-[13px] text-[var(--paper-faint)]">{plan.period}</span>
          </div>

          <Link
            href={plan.href}
            className={`mt-6 flex items-center justify-center rounded-full py-2.5 text-[13.5px] font-semibold transition ${
              plan.featured
                ? "bg-[var(--signal)] text-[var(--ink-950)] hover:brightness-110"
                : "border border-[var(--ink-600)] text-[var(--paper)] hover:border-[var(--signal-line)]"
            }`}
          >
            {plan.cta}
          </Link>

          <ul className="mt-7 space-y-3">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-[var(--paper-dim)]">
                <Check size={15} className="mt-0.5 shrink-0 text-[var(--signal)]" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
