"use client";

import { useRef, useState } from "react";
import { Send, Square, Mic, Paperclip, Globe } from "lucide-react";
import { AVAILABLE_MODELS } from "@/lib/ai/models";

type ChatInputProps = {
  onSend: (message: string, opts: { webSearch: boolean; modelId: string }) => void;
  onStop: () => void;
  isStreaming: boolean;
  modelId: string;
  onModelChange: (id: string) => void;
  onAttachClick: () => void;
  attachedCount?: number;
};

export default function ChatInput({
  onSend,
  onStop,
  isStreaming,
  modelId,
  onModelChange,
  onAttachClick,
  attachedCount = 0,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [webSearch, setWebSearch] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  function handleSend() {
    if (!message.trim() || isStreaming) return;
    onSend(message, { webSearch, modelId });
    setMessage("");
  }

  function toggleVoice() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input isn't supported in this browser.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join("");
      setMessage(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  return (
    <div className="border-t border-[var(--ink-700)] bg-[var(--ink-950)] p-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-2.5">
        <div className="flex items-center gap-2 font-data text-[11px] text-[var(--paper-faint)]">
          <select
            value={modelId}
            onChange={(e) => onModelChange(e.target.value)}
            className="rounded-full border border-[var(--ink-700)] bg-[var(--ink-900)] px-2.5 py-1.5 text-[var(--paper-dim)] outline-none"
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>

          <button
            onClick={() => setWebSearch((v) => !v)}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 transition ${
              webSearch
                ? "border-[var(--signal-line)] bg-[var(--signal-soft)] text-[var(--signal)]"
                : "border-[var(--ink-700)] hover:border-[var(--ink-600)]"
            }`}
          >
            <Globe size={12} /> Web search
          </button>

          {attachedCount > 0 && (
            <span className="rounded-full bg-[var(--ink-900)] px-2.5 py-1.5">{attachedCount} file(s) attached</span>
          )}
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={onAttachClick}
            title="Attach file"
            className="rounded-2xl border border-[var(--ink-700)] p-3 text-[var(--paper-dim)] transition hover:border-[var(--ink-600)] hover:text-[var(--paper)]"
          >
            <Paperclip size={18} />
          </button>

          <textarea
            value={message}
            placeholder="Message Novaraa..."
            rows={1}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="max-h-40 flex-1 resize-none rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] px-4 py-3 text-[15px] text-[var(--paper)] placeholder:text-[var(--paper-faint)] outline-none focus:border-[var(--signal-line)]"
          />

          <button
            onClick={toggleVoice}
            title="Voice input"
            className={`rounded-2xl border p-3 transition ${
              listening ? "border-[var(--danger)] text-[var(--danger)]" : "border-[var(--ink-700)] text-[var(--paper-dim)] hover:border-[var(--ink-600)]"
            }`}
          >
            <Mic size={18} />
          </button>

          {isStreaming ? (
            <button
              onClick={onStop}
              className="flex items-center gap-2 rounded-2xl bg-[var(--danger)] px-5 py-3 text-[13px] font-semibold text-white transition hover:brightness-110"
            >
              <Square size={15} /> Stop
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="flex items-center gap-2 rounded-2xl bg-[var(--signal)] px-5 py-3 text-[var(--ink-950)] transition hover:brightness-110 disabled:opacity-30"
            >
              <Send size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
