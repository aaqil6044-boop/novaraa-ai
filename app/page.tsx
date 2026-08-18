import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Tools from "@/components/home/Tools";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--ink-950)]">
      <Navbar />
      <Hero />
      <Features />
      <Tools />
    </main>
  );
}
