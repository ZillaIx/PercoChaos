import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { computeLazySideIndices, formatSol, type ChaosParams } from "@/lib/percoMath";
import { SIM_CONFIG } from "@/lib/simConfig";
import type { SimulationState } from "@/hooks/useSimulation";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface SimulationEngineProps {
  params: ChaosParams;
  simulation: SimulationState;
}

function formatRate(value: number) {
  return `${value.toFixed(3)} SOL/s`;
}

export function SimulationEngine({ params, simulation }: SimulationEngineProps) {
  const { points, isDeficit, balance, drainRatePerTick, second, deficitStartedSecond } =
    simulation;

  const stroke = isDeficit ? "#EF4444" : "#14F195";
  const fillA = isDeficit ? "#EF4444" : "#14F195";
  const fillB = isDeficit ? "#EF4444" : "#9945FF";

  const indices = computeLazySideIndices(
    params,
    balance,
    SIM_CONFIG.initialVaultBalance,
    { second, isDeficit, deficitStartedSecond },
  );

  return (
    <div className="space-y-4">
      <div className="relative h-[280px] w-full overflow-hidden rounded-sm border border-slate-800/70 bg-slate-950/40">
        {isDeficit ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-center border-b border-deficit-red/40 bg-deficit-red/15 px-3 py-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-deficit-red animate-chart-flash">
              ⚠ DEFICIT DETECTED: DRAIN-ONLY MODE ACTIVE
            </span>
          </div>
        ) : null}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 18, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="vaultFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillA} stopOpacity={0.35} />
                <stop offset="90%" stopColor={fillB} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="4 4" />
            <XAxis
              dataKey="t"
              tick={{ fill: "rgba(148,163,184,0.8)", fontSize: 10, fontFamily: "var(--font-jetbrains-mono)" }}
              tickLine={false}
              axisLine={{ stroke: "rgba(148,163,184,0.25)" }}
            />
            <YAxis
              domain={[0, SIM_CONFIG.initialVaultBalance]}
              tick={{ fill: "rgba(148,163,184,0.8)", fontSize: 10, fontFamily: "var(--font-jetbrains-mono)" }}
              tickLine={false}
              axisLine={{ stroke: "rgba(148,163,184,0.25)" }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(2,6,23,0.95)",
                border: "1px solid rgba(148,163,184,0.25)",
                borderRadius: 4,
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: 12,
              }}
              formatter={(v: unknown) =>
                typeof v === "number" ? formatSol(v) : String(v)
              }
              labelFormatter={(label) => `${label}s`}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke={stroke}
              strokeWidth={2}
              fill="url(#vaultFill)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke={stroke}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <StatusBadge
          label="A"
          value={indices.A.toFixed(3)}
          tone={isDeficit ? "red" : "green"}
        />
        <StatusBadge
          label="K"
          value={indices.K.toFixed(3)}
          tone={isDeficit ? "red" : "purple"}
        />
        <StatusBadge
          label="F"
          value={indices.F.toFixed(3)}
          tone={isDeficit ? "red" : "green"}
        />
        <StatusBadge
          label="B"
          value={indices.B.toFixed(3)}
          tone={isDeficit ? "red" : "slate"}
        />
        <StatusBadge
          label="H"
          value={indices.H.toFixed(3)}
          tone={isDeficit ? "red" : "slate"}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <StatusBadge
          label="Vault"
          value={formatSol(balance)}
          tone={isDeficit ? "red" : "green"}
        />
        <StatusBadge
          label="Drain"
          value={formatRate(drainRatePerTick)}
          tone={isDeficit ? "red" : "purple"}
        />
      </div>
    </div>
  );
}

