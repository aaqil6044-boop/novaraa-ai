"use client";

const SUGGESTIONS = [
  "Summarize a PDF I upload",
  "Write a SQL query for me",
  "Review my code for bugs",
  "Draft a professional email",
];

export default function EmptyChat({ onSuggestion }: { onSuggestion: (text: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-7 text-center">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[var(--signal-line)] bg-[var(--signal-soft)]">
        <span className="pulse-dot" />
      </div>
      <div>
        <h2 className="font-display text-3xl text-[var(--paper)]">What are we working on?</h2>
        <p className="mt-2 text-[14px] text-[var(--paper-dim)]">Powered by Gemini · attach files or search the web anytime.</p>
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="rounded-xl border border-[var(--ink-700)] bg-[var(--ink-900)] px-4 py-3 text-left text-[13.5px] text-[var(--paper-dim)] transition hover:border-[var(--signal-line)] hover:text-[var(--paper)]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
