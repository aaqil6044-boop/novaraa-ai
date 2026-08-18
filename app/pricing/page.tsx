import Navbar from "@/components/layout/Navbar";
import PricingTable from "@/components/pricing/PricingTable";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--ink-950)]">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-data text-[11px] uppercase tracking-[0.2em] text-[var(--signal)]">Pricing</p>
          <h1 className="mt-3 font-display text-5xl text-[var(--paper)]">Simple plans, real work</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--paper-dim)]">
            Start free. Upgrade when the tools become part of how you work.
          </p>
        </div>

        <div className="mt-14">
          <PricingTable />
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-[12.5px] text-[var(--paper-faint)]">
          Team and Pro billing isn't wired up to a payment processor yet — "Upgrade" and "Contact us"
          are placeholders until that's connected.
        </p>
      </div>
    </main>
  );
}
