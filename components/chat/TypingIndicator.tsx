export default function TypingIndicator() {
  return (
    <div className="mr-auto flex max-w-[85%] items-center gap-1.5 rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-4">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--nova)]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--nova)] [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--nova)] [animation-delay:-0.3s]" />
    </div>
  );
}
