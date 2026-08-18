"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Loader2 } from "lucide-react";
import { AVAILABLE_MODELS } from "@/lib/ai/models";

type Prefs = {
  theme: string;
  defaultModel: string;
  memoryEnabled: boolean;
  ttsEnabled: boolean;
  notifyEmail: boolean;
};

export default function SettingsPanel() {
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [facts, setFacts] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/preferences").then((r) => r.json()).then(setPrefs);
    fetch("/api/preferences/memory").then((r) => r.json()).then((d) => setFacts(d.facts || []));
  }, []);

  async function update(partial: Partial<Prefs>) {
    if (!prefs) return;
    setPrefs({ ...prefs, ...partial });
    setSaving(true);
    try {
      await fetch("/api/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial),
      });
    } catch {
      toast.error("Failed to save setting");
    } finally {
      setSaving(false);
    }
  }

  async function clearMemory() {
    if (!confirm("Clear everything Novaraa has learned about you?")) return;
    await fetch("/api/preferences/memory", { method: "DELETE" });
    setFacts([]);
    toast.success("Memory cleared");
  }

  if (!prefs) {
    return <div className="h-40 animate-pulse rounded-2xl bg-[var(--ink-900)]" />;
  }

  return (
    <div className="max-w-2xl space-y-5">
      <Section title="Appearance">
        <Row label="Theme">
          <select
            value={prefs.theme}
            onChange={(e) => update({ theme: e.target.value })}
            className="rounded-lg border border-[var(--ink-700)] bg-[var(--ink-950)] px-3 py-2 text-[13px] text-[var(--paper)]"
          >
            <option value="dark">Dark</option>
            <option value="light">Light (coming soon)</option>
          </select>
        </Row>
      </Section>

      <Section title="AI Model">
        <Row label="Default model for new chats">
          <select
            value={prefs.defaultModel}
            onChange={(e) => update({ defaultModel: e.target.value })}
            className="rounded-lg border border-[var(--ink-700)] bg-[var(--ink-950)] px-3 py-2 text-[13px] text-[var(--paper)]"
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </Row>
      </Section>

      <Section title="Memory">
        <Row label="Let Novaraa remember facts about you across chats">
          <Toggle checked={prefs.memoryEnabled} onChange={(v) => update({ memoryEnabled: v })} />
        </Row>
        {facts.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-[var(--ink-700)] pt-4">
            <p className="font-data text-[10.5px] uppercase tracking-wide text-[var(--paper-faint)]">What Novaraa remembers</p>
            <ul className="space-y-1 text-[13.5px] text-[var(--paper-dim)]">
              {facts.map((f, i) => <li key={i}>· {f}</li>)}
            </ul>
            <button onClick={clearMemory} className="mt-2 flex items-center gap-1.5 text-[12px] text-[var(--danger)] hover:underline">
              <Trash2 size={12} /> Clear memory
            </button>
          </div>
        )}
      </Section>

      <Section title="Voice">
        <Row label="Read AI responses aloud automatically">
          <Toggle checked={prefs.ttsEnabled} onChange={(v) => update({ ttsEnabled: v })} />
        </Row>
      </Section>

      <Section title="Notifications">
        <Row label="Email notifications">
          <Toggle checked={prefs.notifyEmail} onChange={(v) => update({ notifyEmail: v })} />
        </Row>
      </Section>

      <Section title="API Keys">
        <p className="text-[13px] leading-relaxed text-[var(--paper-faint)]">
          Bring-your-own-key support is coming soon — for now Novaraa uses the server's configured Gemini key.
        </p>
      </Section>

      {saving && (
        <div className="flex items-center gap-2 font-data text-[11px] text-[var(--paper-faint)]">
          <Loader2 size={12} className="animate-spin" /> Saving...
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-5">
      <h2 className="mb-4 font-display text-[16px] text-[var(--paper)]">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[13.5px] text-[var(--paper-dim)]">{label}</span>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`h-6 w-11 rounded-full transition ${checked ? "bg-[var(--signal)]" : "bg-[var(--ink-700)]"}`}
    >
      <span
        className={`block h-5 w-5 translate-y-0.5 rounded-full bg-[var(--ink-950)] transition ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
