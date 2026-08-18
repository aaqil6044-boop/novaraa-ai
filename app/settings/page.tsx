import AppLayout from "@/components/layout/AppLayout";
import SettingsPanel from "@/components/settings/SettingsPanel";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <h1 className="font-display text-3xl text-[var(--paper)]">Settings</h1>
        <SettingsPanel />
      </div>
    </AppLayout>
  );
}
