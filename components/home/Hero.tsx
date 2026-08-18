"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--ink-950)]">
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--signal)]/10 blur-[150px]" />
      <div className="absolute right-0 top-40 h-[400px] w-[400px] rounded-full bg-[var(--nova)]/10 blur-[150px]" />

      <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 font-data text-[12px] uppercase tracking-[0.25em] text-[var(--signal)]"
        >
          Gemini-powered · one workspace
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-6xl leading-[1.05] text-[var(--paper)] md:text-8xl"
        >
          One AI platform.
          <br />
          <span className="text-[var(--nova)]">Every kind of work.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 max-w-2xl text-[17px] leading-relaxed text-[var(--paper-dim)]"
        >
          Chat, code, write, study, and analyze documents — all from one place, backed by
          Gemini and a growing library of purpose-built AI tools.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-11 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/login"
            className="rounded-full bg-[var(--signal)] px-8 py-4 text-[15px] font-semibold text-[var(--ink-950)] transition hover:brightness-110"
          >
            Get started free
          </Link>
          <Link
            href="/tools"
            className="rounded-full border border-[var(--ink-600)] px-8 py-4 text-[15px] text-[var(--paper)] transition hover:border-[var(--signal-line)]"
          >
            Explore tools
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
