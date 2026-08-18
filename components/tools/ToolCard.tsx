import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Sparkles } from "lucide-react";

type ToolCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export default function ToolCard({
  title,
  description,
  href,
  icon: Icon,
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-zinc-800
        bg-gradient-to-br
        from-zinc-900
        via-zinc-950
        to-black
        p-7
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:border-amber-400/40
        hover:shadow-2xl
        hover:shadow-amber-400/10
      "
    >
      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl transition-all duration-500 group-hover:bg-amber-400/20" />

      <div className="relative">

        {/* Header */}

        <div className="flex items-start justify-between">

          {/* Icon */}

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-500/20 ring-1 ring-amber-400/20 transition-all duration-300 group-hover:scale-110 group-hover:ring-amber-300/40">

            <Icon
              size={30}
              strokeWidth={1.8}
              className="text-amber-400 transition duration-300 group-hover:text-yellow-300"
            />

          </div>

          {/* Badge */}

          <span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-400">

            <Sparkles size={12} />

            AI

          </span>

        </div>

        {/* Title */}

        <h2 className="mt-6 text-xl font-bold tracking-tight text-white">

          {title}

        </h2>

        {/* Description */}

        <p className="mt-3 text-sm leading-7 text-zinc-400">

          {description}

        </p>

        {/* Footer */}

        <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-4">

          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">

            Launch Tool

          </span>

          <ArrowRight
            size={18}
            className="transition duration-300 group-hover:translate-x-1 group-hover:text-amber-400"
          />

        </div>

      </div>
    </Link>
  );
}