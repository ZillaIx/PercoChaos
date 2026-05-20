import { Skull, Zap } from "lucide-react";

import type { ChaosParams } from "@/lib/percoMath";
import { useGlitchEffect } from "@/hooks/useGlitchEffect";
import { ChaosSlider } from "@/components/ui/ChaosSlider";

interface GlobalChaosControlsProps {
  params: ChaosParams;
  onChange: (next: ChaosParams) => void;
}

export function GlobalChaosControls({ params, onChange }: GlobalChaosControlsProps) {
  const { triggerGlitch } = useGlitchEffect();

  const setParam = <K extends keyof ChaosParams>(key: K, value: ChaosParams[K]) => {
    onChange({ ...params, [key]: value });
  };

  const triggerNightmare = () => {
    triggerGlitch();
    onChange({
      volatility: 150,
      attackerCapital: 500,
      oracleLag: 500,
      congestion: 90,
    });
  };

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={triggerNightmare}
        className="group flex w-full items-center justify-between gap-3 rounded-sm border border-solana-green/50 bg-gradient-to-r from-solana-green/20 via-slate-950/40 to-solana-purple/20 px-4 py-3 shadow-neon-green transition hover:border-solana-purple/60 hover:shadow-neon-purple"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-slate-800/80 bg-slate-950/60">
            <Skull className="h-5 w-5 text-solana-green group-hover:text-solana-purple" />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold tracking-tight text-slate-100">
              Toly&apos;s Nightmare
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
              max chaos · trigger glitch
            </div>
          </div>
        </div>
        <Zap className="h-5 w-5 text-solana-purple opacity-80 group-hover:text-solana-green" />
      </button>

      <div className="space-y-5">
        <ChaosSlider
          label="Asset Volatility"
          valueLabel={`${params.volatility.toFixed(0)}%`}
          value={params.volatility}
          min={0}
          max={150}
          step={1}
          onChange={(v) => setParam("volatility", v)}
        />

        <ChaosSlider
          label="Attacker Capital"
          valueLabel={`${params.attackerCapital.toFixed(0)} SOL`}
          value={params.attackerCapital}
          min={1}
          max={500}
          step={1}
          onChange={(v) => setParam("attackerCapital", v)}
        />

        <ChaosSlider
          label="Oracle Price Lag"
          valueLabel={`${params.oracleLag.toFixed(0)} ms`}
          value={params.oracleLag}
          min={0}
          max={500}
          step={1}
          onChange={(v) => setParam("oracleLag", v)}
        />

        <ChaosSlider
          label="Network Congestion"
          valueLabel={`${params.congestion.toFixed(0)}%`}
          value={params.congestion}
          min={0}
          max={90}
          step={1}
          onChange={(v) => setParam("congestion", v)}
        />
      </div>
    </div>
  );
}

