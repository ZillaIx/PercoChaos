import { clsx } from "clsx";

type Tone = "green" | "purple" | "red" | "slate";

const toneStyles: Record<Tone, string> = {
  green: "border-solana-green/40 text-solana-green bg-solana-green/10",
  purple: "border-solana-purple/40 text-solana-purple bg-solana-purple/10",
  red: "border-deficit-red/50 text-deficit-red bg-deficit-red/10",
  slate: "border-slate-700/70 text-slate-200 bg-slate-950/40",
};

interface StatusBadgeProps {
  label: string;
  value: string;
  tone?: Tone;
}

export function StatusBadge({ label, value, tone = "slate" }: StatusBadgeProps) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between gap-3 rounded-sm border px-3 py-2",
        toneStyles[tone],
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-80">
        {label}
      </span>
      <span className="font-mono text-xs font-semibold tabular-nums">{value}</span>
    </div>
  );
}

