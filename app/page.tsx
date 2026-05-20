"use client";

import { Activity, Shield } from "lucide-react";
import { useEffect, useState } from "react";

import { GlobalChaosControls } from "@/components/GlobalChaosControls";
import { PercoForkTerminal } from "@/components/PercoForkTerminal";
import { SimulationEngine } from "@/components/SimulationEngine";
import { GlowPanel } from "@/components/ui/GlowPanel";
import { useSimulation } from "@/hooks/useSimulation";
import type { ChaosParams } from "@/lib/percoMath";
import { SIM_CONFIG } from "@/lib/simConfig";

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatted =
    now?.toISOString().replace("T", " ").slice(0, 19) ?? "SYNCING...";

  return (
    <span className="font-mono text-xs tabular-nums text-solana-green/90">
      {formatted} UTC
    </span>
  );
}

export default function Home() {
  const [params, setParams] = useState<ChaosParams>({
    volatility: 25,
    attackerCapital: 50,
    oracleLag: 0,
    congestion: 0,
  });

  const simulation = useSimulation(params);
  const isDeficit = simulation.isDeficit;

  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER */}
      <header className="flex shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Shield className="h-7 w-7 text-solana-green drop-shadow-[0_0_8px_rgba(20,241,149,0.6)]" />
          <div>
            <h1 className="bg-gradient-to-r from-solana-green via-white to-solana-purple bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              PercoChaos
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
              Percolator Risk Engine Simulator
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-solana-green shadow-[0_0_8px_#14F195]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
              System Online
            </span>
          </div>
          <LiveClock />
        </div>
      </header>

      {/* MAIN GRID: left | center+bottom */}
      <main className="grid flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[320px_1fr] lg:grid-rows-[1fr_auto]">
        {/* LEFT — Global Chaos Controls */}
        <GlowPanel
          title="Global Chaos Controls"
          glowColor={isDeficit ? "red" : "green"}
          className="min-h-[280px] lg:row-span-2"
        >
          <GlobalChaosControls params={params} onChange={setParams} />
        </GlowPanel>

        {/* CENTER — Simulation Engine */}
        <GlowPanel
          title="Simulation Engine"
          glowColor={isDeficit ? "red" : "purple"}
          className="min-h-[360px]"
        >
          <div className="mb-4 flex items-center justify-between gap-4 border-b border-slate-800/60 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-solana-purple" />
              <span className="font-mono text-xs text-slate-400">
                Insurance Vault Pool
              </span>
            </div>
            <span className="font-mono text-sm font-semibold text-solana-green">
              {SIM_CONFIG.initialVaultBalance.toFixed(2)} SOL
            </span>
          </div>
          <SimulationEngine params={params} simulation={simulation} />
        </GlowPanel>

        {/* BOTTOM — PercoFork Terminal */}
        <GlowPanel
          title="PercoFork Protocol Terminal"
          glowColor="none"
          className="min-h-[200px] font-mono lg:col-start-2"
        >
          <PercoForkTerminal params={params} />
        </GlowPanel>
      </main>

      {/* FOOTER STATUS BAR */}
      <footer className="flex shrink-0 items-center justify-between border-t border-slate-800/80 px-6 py-2 font-mono text-[10px] uppercase tracking-widest text-slate-600">
        <span>
          Vault baseline: {SIM_CONFIG.initialVaultBalance.toFixed(2)} SOL
        </span>
        <span className="text-solana-green/70">
          Deficit locks until loop reset
        </span>
        <span>localhost:{SIM_CONFIG.port}</span>
      </footer>
    </div>
  );
}
