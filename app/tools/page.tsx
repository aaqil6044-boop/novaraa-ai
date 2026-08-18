import AppLayout from "@/components/layout/AppLayout";
import ToolGrid from "@/components/tools/ToolGrid";

export default function ToolsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl text-[var(--paper)]">AI Tools</h1>
          <p className="mt-2 text-[14px] text-[var(--paper-dim)]">Purpose-built tools to help you work faster.</p>
        </div>
        <ToolGrid />
      </div>
    </AppLayout>
  );
}
