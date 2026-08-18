"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ToolCard from "./ToolCard";
import { TOOLS, getToolCategories } from "@/lib/tools";

export default function ToolGrid() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | "All">("All");
  const categories = useMemo(() => ["All", ...getToolCategories()], []);

  const filtered = TOOLS.filter((t) => {
    const matchesQuery = t.label.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || t.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-8 pr-3 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c as any)}
              className={`rounded-md px-2.5 py-1.5 transition ${
                category === c ? "bg-blue-600 text-white" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-500">No tools match your search.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((tool) => (
            <ToolCard
              key={tool.slug}
              title={tool.label}
              description={tool.description}
              href={`/tools/${tool.slug}`}
              icon={tool.icon}
            />
          ))}
        </div>
      )}
    </div>
  );
}
