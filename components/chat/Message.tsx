"use client";

import { useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Copy,
  Check,
  Pencil,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import toast from "react-hot-toast";

export type MessageProps = {
  id: string;
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
  onEdit?: (id: string, content: string) => void;
  onRegenerate?: (id: string) => void;
};

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className={`transition hover:scale-110 ${className ?? ""}`}
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast.success("Copied!");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

export default function Message({ id, role, content, pending, onEdit, onRegenerate }: MessageProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content);
  const isUser = role === "user";

  const markdownComponents: Components = {
    code({ className, children, ...rest }) {
      const match = /language-(\w+)/.exec(className || "");
      const codeText = String(children).replace(/\n$/, "");

      if (match) {
        return (
          <div className="my-5 overflow-hidden rounded-2xl border border-[var(--ink-700)] shadow-lg">
            <div className="flex items-center justify-between bg-[var(--ink-800)] px-4 py-2 font-data text-[11px] uppercase tracking-wide text-[var(--paper-dim)]">
              <span>{match[1]}</span>
              <CopyButton text={codeText} className="text-[var(--paper-dim)] hover:text-[var(--paper)]" />
            </div>
            <SyntaxHighlighter
              language={match[1]}
              style={oneDark}
              PreTag="div"
              customStyle={{ margin: 0, padding: "18px", fontSize: "13.5px", background: "var(--ink-950)" }}
            >
              {codeText}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code className="rounded-md bg-[var(--ink-800)] px-1.5 py-0.5 font-data text-[13px] text-[var(--signal)]" {...rest}>
          {children}
        </code>
      );
    },
    table({ children }) {
      return (
        <div className="my-5 overflow-x-auto rounded-xl border border-[var(--ink-700)]">
          <table className="min-w-full">{children}</table>
        </div>
      );
    },
  };

  if (editing) {
    return (
      <div className="ml-auto w-full max-w-3xl rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-5 shadow-xl">
        <textarea
          autoFocus
          value={draft}
          rows={4}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full resize-none rounded-xl border border-[var(--ink-600)] bg-[var(--ink-950)] p-4 text-[15px] leading-7 text-[var(--paper)] outline-none focus:border-[var(--signal-line)]"
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-xl border border-[var(--ink-600)] px-4 py-2 text-[13px] text-[var(--paper-dim)] transition hover:bg-[var(--ink-800)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { setEditing(false); onEdit?.(id, draft); }}
            className="rounded-xl bg-[var(--signal)] px-4 py-2 text-[13px] font-semibold text-[var(--ink-950)] transition hover:brightness-110"
          >
            Save & Resend
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative ${isUser ? "ml-auto max-w-[80%]" : "mr-auto max-w-[92%]"}`}>
      <div
        className={`rounded-2xl border px-6 py-5 shadow-lg transition-colors ${
          isUser
            ? "border-[var(--signal-line)] bg-[var(--signal-soft)]"
            : "border-[var(--ink-700)] bg-[var(--ink-900)]"
        }`}
      >
        <div className="mb-3.5 flex items-center gap-2.5">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full font-display text-[11px] font-semibold ${
              isUser ? "bg-[var(--signal)] text-[var(--ink-950)]" : "bg-[var(--nova)] text-[var(--ink-950)]"
            }`}
          >
            {isUser ? "Y" : "N"}
          </div>
          <p className="font-display text-[13px] text-[var(--paper)]">
            {isUser ? "You" : "Novaraa"}
          </p>
          {pending && <span className="pulse-dot" />}
        </div>

        <div className="prose prose-invert max-w-none prose-headings:font-display prose-p:text-[15px] prose-p:leading-7 prose-li:text-[15px] prose-strong:text-[var(--paper)] prose-a:text-[var(--signal)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content || ""}
          </ReactMarkdown>

          {pending && !content && (
            <div className="mt-2 flex gap-1.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--nova)]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--nova)] [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--nova)] [animation-delay:-0.4s]" />
            </div>
          )}
        </div>
      </div>

      {!pending && (
        <div className={`mt-1.5 hidden gap-3 text-[var(--paper-faint)] group-hover:flex ${isUser ? "justify-end" : ""}`}>
          <CopyButton text={content} className="hover:text-[var(--paper)]" />
          {isUser && onEdit && (
            <button type="button" onClick={() => { setDraft(content); setEditing(true); }} className="transition hover:text-[var(--paper)]">
              <Pencil size={13} />
            </button>
          )}
          {!isUser && onRegenerate && (
            <button type="button" onClick={() => onRegenerate(id)} className="transition hover:text-[var(--paper)]">
              <RotateCcw size={13} />
            </button>
          )}
          {!isUser && <SpeakButton text={content} />}
        </div>
      )}
    </div>
  );
}

function SpeakButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);

  function toggle() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Speech isn't supported in this browser.");
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const cleaned = text.replace(/```[\s\S]*?```/g, " code block ").replace(/`/g, "").replace(/[#>*_-]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button type="button" onClick={toggle} title={speaking ? "Stop reading" : "Read aloud"} className="transition hover:text-[var(--paper)]">
      {speaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
    </button>
  );
}
