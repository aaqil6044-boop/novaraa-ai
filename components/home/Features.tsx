"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Brain, Cloud } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate AI responses in seconds with optimized performance.",
  },
  {
    icon: ShieldCheck,
    title: "Secure",
    description: "Your data is protected with enterprise-grade security.",
  },
  {
    icon: Brain,
    title: "Powerful AI",
    description: "Access advanced AI models for writing, coding and learning.",
  },
  {
    icon: Cloud,
    title: "Cloud Based",
    description: "Use Novaraa anywhere on any device.",
  },
];

export default function Features() {
  return (
    <section className="bg-[var(--ink-950)] py-24 px-6">
      <div className="mx-auto max-w-7xl">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center text-5xl font-display text-[var(--paper)]"
        >
          Why Choose Novaraa?
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                className="rounded-3xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-8 shadow-lg transition"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--signal-soft)]">
                  <Icon className="h-8 w-8 text-[var(--signal)]" />
                </div>

                <h3 className="text-2xl font-display text-[var(--paper)]">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-[var(--paper-dim)]">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}