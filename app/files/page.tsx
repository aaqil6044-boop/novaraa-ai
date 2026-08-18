import AppLayout from "@/components/layout/AppLayout";
import FileLibrary from "@/components/files/FileLibrary";

export default function FilesPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl text-[var(--paper)]">File Library</h1>
          <p className="mt-2 text-[14px] text-[var(--paper-dim)]">Every file you've uploaded, in one place.</p>
        </div>
        <FileLibrary />
      </div>
    </AppLayout>
  );
}
