import { clsx } from "clsx";

interface ChaosSliderProps {
  label: string;
  valueLabel: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (next: number) => void;
}

export function ChaosSlider({
  label,
  valueLabel,
  value,
  min,
  max,
  step = 1,
  onChange,
}: ChaosSliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-sm font-semibold text-slate-200">{label}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
            {min} → {max}
          </div>
        </div>
        <div className="rounded-sm border border-slate-700/80 bg-slate-950/60 px-2 py-1 font-mono text-xs tabular-nums text-solana-green">
          {valueLabel}
        </div>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-sm bg-gradient-to-r from-solana-green/60 to-solana-purple/60"
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={clsx(
            "relative z-10 h-10 w-full cursor-pointer appearance-none bg-transparent",
            "[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-sm [&::-webkit-slider-runnable-track]:bg-slate-800/70",
            "[&::-webkit-slider-thumb]:-mt-2 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-950 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(20,241,149,0.55)] [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-solana-green/80",
            "[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-sm [&::-moz-range-track]:bg-slate-800/70",
            "[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-slate-950 [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(20,241,149,0.55)]",
          )}
          aria-label={label}
        />
      </div>
    </div>
  );
}

