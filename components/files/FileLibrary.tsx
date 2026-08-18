"use client";

import { useEffect, useState } from "react";
import { Search, Download, Trash2, Pencil, Check, X, FileText, Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import PdfSummarizerView from "@/components/tools/results/PdfSummarizerView";
import type { PdfSummarizerResult } from "@/lib/tools/schemas";

type FileRecord = {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  status: string;
  createdAt: string;
};

export default function FileLibrary() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [summaryFor, setSummaryFor] = useState<string | null>(null);
  const [summary, setSummary] = useState<PdfSummarizerResult | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      const res = await fetch(`/api/files?${params.toString()}`);
      setFiles(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, query ? 300 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function rename(id: string) {
    if (!editValue.trim()) return;
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, filename: editValue } : f)));
    setEditingId(null);
    const res = await fetch(`/api/files/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: editValue }),
    });
    if (!res.ok) {
      toast.error("Rename failed");
      load();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this file?")) return;
    setFiles((prev) => prev.filter((f) => f.id !== id));
    const res = await fetch(`/api/files/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      load();
    }
  }

  async function summarize(id: string) {
    setSummaryFor(id);
    setSummary(null);
    setSummarizing(true);
    try {
      const res = await fetch("/api/tools/pdf-summarizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "", fileId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSummary(data.output);
    } catch (err: any) {
      toast.error(err.message || "Summary failed");
      setSummaryFor(null);
    } finally {
      setSummarizing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative max-w-xs">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--paper-faint)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files..."
          className="w-full rounded-full border border-[var(--ink-700)] bg-[var(--ink-900)] py-2 pl-8 pr-3 text-[13px] text-[var(--paper)] placeholder:text-[var(--paper-faint)] outline-none focus:border-[var(--signal-line)]"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-[var(--ink-900)]" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <p className="text-[13.5px] text-[var(--paper-faint)]">No files uploaded yet. Attach one from a chat or tool to see it here.</p>
      ) : (
        <div className="space-y-2">
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded-xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-3.5">
              <FileText size={18} className="shrink-0 text-[var(--signal)]" />

              {editingId === f.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && rename(f.id)}
                    className="flex-1 rounded border border-[var(--signal-line)] bg-[var(--ink-950)] px-2 py-1 text-[13px] text-[var(--paper)] outline-none"
                  />
                  <button onClick={() => rename(f.id)}><Check size={14} className="text-[var(--success)]" /></button>
                  <button onClick={() => setEditingId(null)}><X size={14} className="text-[var(--paper-faint)]" /></button>
                </div>
              ) : (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] text-[var(--paper)]">{f.filename}</p>
                  <p className="font-data text-[11px] text-[var(--paper-faint)]">
                    {(f.size / 1024).toFixed(0)} KB · {f.status}
                  </p>
                </div>
              )}

              {editingId !== f.id && (
                <div className="flex shrink-0 items-center gap-3 text-[var(--paper-faint)]">
                  <button title="Summarize with AI" onClick={() => summarize(f.id)} className="transition hover:text-[var(--signal)]">
                    <Sparkles size={15} />
                  </button>
                  <a title="Download" href={f.url} download className="transition hover:text-[var(--paper)]">
                    <Download size={15} />
                  </a>
                  <button title="Rename" onClick={() => { setEditingId(f.id); setEditValue(f.filename); }} className="transition hover:text-[var(--paper)]">
                    <Pencil size={15} />
                  </button>
                  <button title="Delete" onClick={() => remove(f.id)} className="transition hover:text-[var(--danger)]">
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {summaryFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSummaryFor(null)}>
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-950)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg text-[var(--paper)]">AI Summary</h3>
              <button onClick={() => setSummaryFor(null)}><X size={18} className="text-[var(--paper-dim)]" /></button>
            </div>
            {summarizing ? (
              <div className="flex items-center gap-2 text-[var(--paper-dim)]">
                <Loader2 size={16} className="animate-spin text-[var(--signal)]" /> Summarizing...
              </div>
            ) : summary ? (
              <PdfSummarizerView data={summary} />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
