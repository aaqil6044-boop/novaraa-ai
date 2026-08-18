import Link from "next/link";
import {
  Bot,
  FileText,
  Code2,
  BookOpen,
  Image as ImageIcon,
  ListChecks,
} from "lucide-react";

const tools = [
  { icon: Bot, title: "AI Chat", description: "Chat with Gemini, with memory, file uploads, and web search.", href: "/chat" },
  { icon: FileText, title: "Resume Reviewer", description: "Get an ATS score and line-by-line resume feedback.", href: "/tools/resume-reviewer" },
  { icon: Code2, title: "Code Reviewer", description: "Catch bugs and get real code review, not just a linter.", href: "/tools/code-reviewer" },
  { icon: BookOpen, title: "Study Assistant", description: "Turn notes into flashcards, MCQs, and clean study notes.", href: "/tools/study-assistant" },
  { icon: ImageIcon, title: "Image Analyzer", description: "Understand and extract text from any image with Gemini Vision.", href: "/tools/image-analyzer" },
  { icon: ListChecks, title: "17 tools total", description: "SQL, email, grammar, translation, and more — one workspace.", href: "/tools" },
];

export default function Tools() {
  return (
    <section className="bg-[var(--ink-950)] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-14 text-center font-display text-5xl text-[var(--paper)]">
          Explore AI tools
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.title}
                href={tool.href}
                className="rounded-3xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-8 transition hover:-translate-y-1.5 hover:border-[var(--signal-line)]"
              >
                <Icon className="mb-6 h-11 w-11 text-[var(--signal)]" strokeWidth={1.6} />
                <h3 className="font-display text-2xl text-[var(--paper)]">{tool.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--paper-dim)]">{tool.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
