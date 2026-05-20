import { clsx } from "clsx";
import type { ReactNode } from "react";

export type GlowColor = "green" | "purple" | "red" | "none";

const glowStyles: Record<GlowColor, string> = {
  green: "glow-border-green shadow-neon-green",
  purple: "glow-border-purple shadow-neon-purple",
  red: "glow-border-red shadow-neon-red",
  none: "border border-slate-800/80",
};

interface GlowPanelProps {
  children: ReactNode;
  glowColor?: GlowColor;
  className?: string;
  title?: string;
}

export function GlowPanel({
  children,
  glowColor = "green",
  className,
  title,
}: GlowPanelProps) {
  return (
    <section
      className={clsx(
        "relative overflow-hidden rounded-sm bg-slate-900/50 backdrop-blur-sm",
        glowStyles[glowColor],
        className,
      )}
    >
      {title ? (
        <header className="border-b border-slate-800/80 px-4 py-2">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
            {title}
          </h2>
        </header>
      ) : null}
      <div className="relative z-10 p-4">{children}</div>
    </section>
  );
}
