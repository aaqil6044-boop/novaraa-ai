"use client";

import { useEffect, useState } from "react";
import { Loader2, Copy, Check, Download, RotateCcw, Sparkles, FileWarning, Trash2, History, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import FileUpload, { type UploadedFileInfo } from "@/components/chat/FileUpload";
import { getTool } from "@/lib/tools";
import { RESULT_VIEWS } from "@/components/tools/results";

type RecentRun = { id: string; input: string; createdAt: string };

export default function ToolWorkspace({ slug }: { slug: string }) {
  const tool = getTool(slug);

  const [input, setInput] = useState("");
  const [file, setFile] = useState<UploadedFileInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [recentRuns, setRecentRuns] = useState<RecentRun[]>([]);

  useEffect(() => {
    if (!tool) return;
    fetch(`/api/tools/${tool.slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data?.runs && setRecentRuns(data.runs))
      .catch(() => {});
  }, [tool?.slug]);

  useEffect(() => {
    if (!loading || !tool) return;
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((s) => Math.min(tool.loadingSteps.length - 1, s + 1));
    }, 1100);
    return () => clearInterval(interval);
  }, [loading, tool]);

  if (!tool) return null;

  const ResultView = RESULT_VIEWS[tool.slug];

  async function run() {
    if (!input.trim() && !file) {
      toast.error("Add some text or attach a file first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/tools/${tool!.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, fileId: file?.id }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data.output);
      setCompletedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      fetch(`/api/tools/${tool!.slug}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d?.runs && setRecentRuns(d.runs))
        .catch(() => {});
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function markdown() {
    if (!result) return "";
    try {
      return tool!.toMarkdown(result);
    } catch {
      return JSON.stringify(result, null, 2);
    }
  }

  function copyResult() {
    if (!result) return;
    navigator.clipboard.writeText(markdown());
    toast.success("Copied to clipboard");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function exportResult() {
    if (!result) return;
    const blob = new Blob([markdown()], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool!.slug}-result.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    setInput("");
    setFile(null);
    setResult(null);
    setError(null);
  }

  const Icon = tool.icon;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="flex items-start gap-4">
        <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--signal-line)] bg-[var(--signal-soft)]">
          <Icon size={22} className="text-[var(--signal)]" />
        </div>
        <div>
          <h1 className="font-display text-[30px] leading-tight text-[var(--paper)]">{tool.label}</h1>
          <p className="mt-1 text-[14px] leading-6 text-[var(--paper-dim)]">{tool.description}</p>
        </div>
      </div>

      {/* Examples */}
      {tool.examples.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tool.examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setInput(ex)}
              className="flex items-center gap-1.5 rounded-full border border-[var(--ink-700)] bg-[var(--ink-900)] px-3 py-1.5 text-[12.5px] text-[var(--paper-dim)] transition hover:border-[var(--signal-line)] hover:text-[var(--paper)]"
            >
              <Wand2 size={11} className="text-[var(--paper-faint)]" />
              {ex}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-5">
            <p className="mb-2 font-data text-[11px] uppercase tracking-wide text-[var(--paper-faint)]">Input</p>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tool.placeholder}
              rows={10}
              className="w-full resize-none rounded-xl border border-[var(--ink-700)] bg-[var(--ink-950)] p-4 text-[14.5px] leading-6 text-[var(--paper)] placeholder:text-[var(--paper-faint)] outline-none focus:border-[var(--signal-line)]"
            />

            {tool.acceptsFile && (
              <div className="mt-3">
                <FileUpload
                  chatId={null}
                  files={file ? [file] : []}
                  onFilesChange={(files) => setFile(files[files.length - 1] || null)}
                />
                {tool.fileHint && <p className="mt-1.5 text-[11.5px] text-[var(--paper-faint)]">{tool.fileHint}</p>}
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={run}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--signal)] py-3 text-[14px] font-semibold text-[var(--ink-950)] transition hover:brightness-110 disabled:opacity-40"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={15} />}
                {loading ? "Working..." : "Generate"}
              </button>
              <button
                onClick={clearAll}
                title="Clear"
                className="flex items-center justify-center rounded-xl border border-[var(--ink-700)] px-3.5 text-[var(--paper-faint)] transition hover:border-[var(--danger-soft)] hover:text-[var(--danger)]"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Recent usage */}
          {recentRuns.length > 0 && (
            <div className="rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-5">
              <p className="mb-3 flex items-center gap-1.5 font-data text-[11px] uppercase tracking-wide text-[var(--paper-faint)]">
                <History size={12} /> Recent Usage
              </p>
              <div className="space-y-2">
                {recentRuns.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setInput(r.input.startsWith("[file:") ? "" : r.input)}
                    className="block w-full truncate rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-[var(--paper-dim)] transition hover:bg-[var(--ink-800)] hover:text-[var(--paper)]"
                    title={r.input}
                  >
                    {r.input}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Result panel */}
        <div className="relative overflow-hidden rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-5">
          <div className="absolute inset-y-0 left-0 w-[3px] bg-[var(--nova)]" />

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="font-data text-[11px] uppercase tracking-wide text-[var(--paper-faint)]">Result</p>
              {completedAt && !loading && (
                <span className="font-data text-[11px] text-[var(--paper-faint)]">· {completedAt}</span>
              )}
            </div>
            {result && !loading && (
              <div className="flex items-center gap-3 text-[var(--paper-faint)]">
                <button onClick={copyResult} title="Copy" className="transition hover:text-[var(--paper)]">
                  {copied ? <Check size={15} className="text-[var(--success)]" /> : <Copy size={15} />}
                </button>
                <button onClick={exportResult} title="Export as Markdown" className="transition hover:text-[var(--paper)]">
                  <Download size={15} />
                </button>
                <button onClick={run} title="Retry" className="transition hover:text-[var(--paper)]">
                  <RotateCcw size={15} />
                </button>
              </div>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center gap-5 py-12">
              <div className="relative flex h-14 w-14 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-[var(--signal-soft)]" />
                <Sparkles size={22} className="relative text-[var(--signal)]" />
              </div>
              <div className="space-y-2 text-center">
                {tool.loadingSteps.map((step, i) => (
                  <p
                    key={i}
                    className={`text-[13px] transition-opacity duration-500 ${
                      i === loadingStep ? "text-[var(--paper)] opacity-100" : i < loadingStep ? "text-[var(--paper-faint)] opacity-40" : "text-[var(--paper-faint)] opacity-0 h-0"
                    }`}
                  >
                    {i <= loadingStep ? step : ""}
                  </p>
                ))}
              </div>
              <div className="w-full max-w-[220px] space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-2.5 animate-pulse rounded-full bg-[var(--ink-800)]" style={{ width: `${88 - i * 14}%` }} />
                ))}
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-[var(--danger-soft)] bg-[var(--danger-soft)] p-4">
              <FileWarning size={16} className="mt-0.5 shrink-0 text-[var(--danger)]" />
              <p className="text-[13.5px] leading-6 text-[var(--paper)]">{error}</p>
            </div>
          )}

          {!loading && !error && !result && (
            <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
              <Sparkles size={20} className="text-[var(--paper-faint)]" />
              <p className="text-[13.5px] text-[var(--paper-faint)]">Your result will appear here.</p>
            </div>
          )}

          {!loading && result && ResultView && (
            <div className="max-h-[75vh] overflow-y-auto pr-1">
              <ResultView data={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
