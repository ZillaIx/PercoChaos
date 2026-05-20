/**
 * Locked simulation parameters (approved open questions).
 */
export const SIM_CONFIG = {
  /** Toly mainnet Percolator bounty pool baseline */
  initialVaultBalance: 5.0,
  /** Vault resets to full health at each new 60s loop */
  loopDurationSeconds: 60,
  /** Base drain per tick — scaled for 5.00 SOL → 0.00 SOL over ~60s at default sliders */
  baseDrainPerTick: 0.05,
  /** Dev server port */
  port: 3000,
} as const;
