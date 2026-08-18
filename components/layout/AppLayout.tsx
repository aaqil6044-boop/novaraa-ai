"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import AppTopbar from "./AppTopbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[var(--ink-950)] text-[var(--paper)]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppTopbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
