export interface ChaosParams {
  volatility: number; // 0–150 (%)
  attackerCapital: number; // 1–500 (SOL)
  oracleLag: number; // 0–500 (ms)
  congestion: number; // 0–90 (%)
}

export interface LazySideIndices {
  /** Position Scaler */
  A: number;
  /** Mark Effect */
  K: number;
  /** Funding Pool (0..1) */
  F: number;
  /** Bankruptcy Loss */
  B: number;
  /** Haircut H-Ratio */
  H: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function computeLazySideIndices(
  params: ChaosParams,
  vaultBalance: number,
  initialVaultBalance: number,
  context?: {
    second: number;
    isDeficit: boolean;
    deficitStartedSecond: number | null;
  },
): LazySideIndices {
  const A = Math.max(0.1, 1 - params.volatility / 200);
  const K = 1 / (1 + params.oracleLag / 1000);
  const F = clamp(vaultBalance / Math.max(0.0001, initialVaultBalance), 0, 1);
  const B = Math.sqrt(
    (params.volatility / 100) *
      (params.congestion / 100) *
      (params.attackerCapital / 500),
  );

  // Vital Haircut ratio:
  // - Solvent: pinned at 1.0
  // - Deficit: linearly drains 1.0 -> 0.0 over 10 seconds after deficit triggers
  let H = 1;
  if (context?.isDeficit) {
    const start = context.deficitStartedSecond ?? context.second;
    const elapsed = Math.max(0, context.second - start);
    H = clamp(1 - elapsed / 10, 0, 1);
  } else if (vaultBalance <= 0) {
    // Fallback if caller doesn't provide context
    H = 0;
  }

  return { A, K, F, B, H };
}

export function formatSol(value: number) {
  return `${value.toFixed(2)} SOL`;
}

