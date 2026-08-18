"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

export type UploadedFileInfo = {
  id: string;
  filename: string;
  url: string;
  status: string;
};

export default function FileUpload({
  chatId,
  files,
  onFilesChange,
}: {
  chatId: string | null;
  files: UploadedFileInfo[];
  onFilesChange: (files: UploadedFileInfo[]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      if (chatId) formData.append("chatId", chatId);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Upload failed");
          return;
        }

        onFilesChange([...files, { id: data.file.id, filename: data.file.filename, url: data.file.url, status: data.file.status }]);
        toast.success(`${file.name} attached`);
      } catch {
        toast.error("Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [chatId, files, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      "text/plain": [".txt"],
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
  });

  return (
    <div className="mx-auto mb-2 max-w-4xl px-4">
      {files.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-2 rounded-full border border-[var(--ink-700)] bg-[var(--ink-900)] px-3 py-1.5 font-data text-[11px] text-[var(--paper-dim)]">
              <FileText size={13} className="text-[var(--signal)]" />
              <span className="max-w-[160px] truncate">{f.filename}</span>
              <button onClick={() => onFilesChange(files.filter((x) => x.id !== f.id))}>
                <X size={12} className="text-[var(--paper-faint)] hover:text-[var(--danger)]" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-3 text-center text-[12px] transition ${
          isDragActive ? "border-[var(--signal)] bg-[var(--signal-soft)]" : "border-[var(--ink-700)] text-[var(--paper-faint)] hover:border-[var(--ink-600)]"
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <span className="flex items-center justify-center gap-2 text-[var(--paper-dim)]">
            <Loader2 size={14} className="animate-spin text-[var(--signal)]" /> Uploading & analyzing...
          </span>
        ) : (
          <span>Drag & drop a PDF, image, DOCX, TXT or CSV — or click to browse</span>
        )}
      </div>
    </div>
  );
}
