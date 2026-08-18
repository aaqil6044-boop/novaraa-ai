import type { Metadata } from "next";
import { Fraunces, Sora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

import AuthProvider from "@/components/providers/SessionProvider";
import { Toaster } from "react-hot-toast";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Novaraa",
  description: "AI Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sora.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="novaraa-app min-h-full flex flex-col">
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--ink-800)",
                color: "var(--paper)",
                border: "1px solid var(--ink-600)",
                fontFamily: "var(--font-body)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
