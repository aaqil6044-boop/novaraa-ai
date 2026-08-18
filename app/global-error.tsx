"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0b0912] p-6 text-center text-[#f3efe7]">
        <h1 className="text-2xl font-bold">Novaraa hit an unexpected error</h1>
        <p className="max-w-md text-sm text-[#a99fb3]">{error.message}</p>
        <button
          onClick={reset}
          className="rounded-full bg-[#f0a63d] px-4 py-2 text-sm font-semibold text-[#0b0912]"
        >
          Reload
        </button>
      </body>
    </html>
  );
}
