import { useEffect, useRef, useState } from "react";

import { SIM_CONFIG } from "@/lib/simConfig";
import type { ChaosParams } from "@/lib/percoMath";

export interface VaultPoint {
  t: number; // seconds within active loop
  balance: number; // SOL
}

export interface SimulationState {
  second: number; // 0..59
  balance: number; // SOL
  isDeficit: boolean;
  deficitStartedSecond: number | null;
  drainRatePerTick: number; // SOL / tick
  points: VaultPoint[]; // rolling window (60)
}

function clampToTwoDecimals(value: number) {
  return Math.max(0, Math.round(value * 100) / 100);
}

function computeDrainRatePerTick(params: ChaosParams) {
  const base = SIM_CONFIG.baseDrainPerTick; // 0.05
  const v = 1 + params.volatility / 100;
  const c = 1 + params.congestion / 100;
  const o = 1 + params.oracleLag / 500;
  const a = Math.pow(params.attackerCapital / 50, 1.4);

  return base * v * v * c * o * a;
}

function makeInitialPoints(balance: number, seconds: number) {
  return Array.from({ length: seconds }, (_, t) => ({ t, balance }));
}

export function useSimulation(params: ChaosParams) {
  const latestParamsRef = useRef(params);
  latestParamsRef.current = params;

  const initialBalance = SIM_CONFIG.initialVaultBalance;
  const loopSeconds = SIM_CONFIG.loopDurationSeconds;

  const [state, setState] = useState<SimulationState>(() => {
    const balance = clampToTwoDecimals(initialBalance);
    return {
      second: 0,
      balance,
      isDeficit: false,
      deficitStartedSecond: null,
      drainRatePerTick: computeDrainRatePerTick(params),
      points: makeInitialPoints(balance, loopSeconds),
    };
  });

  useEffect(() => {
    const id = window.setInterval(() => {
      setState((prev) => {
        const drainRatePerTick = computeDrainRatePerTick(latestParamsRef.current);

        // Advance time inside the active 60-second block.
        const nextSecond = prev.second + 1;

        // If loop ends, hard reset: full health, solvent state, fresh series.
        if (nextSecond >= loopSeconds) {
          const balance = clampToTwoDecimals(initialBalance);
          return {
            second: 0,
            balance,
            isDeficit: false,
            deficitStartedSecond: null,
            drainRatePerTick,
            points: makeInitialPoints(balance, loopSeconds),
          };
        }

        // During a deficit lock, balance stays at 0 for remainder of the loop.
        const shouldDrain = !prev.isDeficit && prev.balance > 0;
        const nextBalance = shouldDrain
          ? clampToTwoDecimals(prev.balance - drainRatePerTick)
          : prev.balance;

        const isDeficit = prev.isDeficit || nextBalance <= 0;
        const deficitStartedSecond =
          prev.deficitStartedSecond ?? (isDeficit ? nextSecond : null);

        const lockedBalance = isDeficit ? 0 : nextBalance;

        const nextPoints = prev.points
          .slice(1)
          .concat({ t: nextSecond, balance: lockedBalance });

        return {
          second: nextSecond,
          balance: lockedBalance,
          isDeficit,
          deficitStartedSecond,
          drainRatePerTick,
          points: nextPoints,
        };
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [initialBalance, loopSeconds]);

  return state;
}

