# PercoChaos — Implementation Plan

## Overview

**PercoChaos** is a hyper-modern, dark-mode single-page interactive protocol simulator for Anatoly Yakovenko's open-source *percolator* perpetual futures risk engine on Solana. The UI design language is a **tactical defense grid**: `slate-950` backgrounds, sharp neon borders, outer glow accents in Solana Green (`#14F195`) and Purple (`#9945FF`), with a hard flip to Crimson Red (`#EF4444`) on vault depletion.

**Stack:** Next.js 14 (App Router) · React · Tailwind CSS · Lucide Icons · Recharts

---

## Proposed Architecture

```
percoChaos/
├── app/
│   ├── layout.tsx          # Root layout, fonts, global meta
│   └── page.tsx            # Dashboard shell (3-panel grid)
├── components/
│   ├── GlobalChaosControls.tsx   # Left panel — sliders + Toly's Nightmare btn
│   ├── SimulationEngine.tsx      # Center panel — Recharts chart + lazy indices
│   ├── PercoForkTerminal.tsx     # Bottom panel — mock CLI terminal
│   └── ui/
│       ├── ChaosSlider.tsx       # Styled range slider component
│       ├── GlowPanel.tsx         # Reusable neon-bordered card wrapper
│       └── StatusBadge.tsx       # Animated status pill
├── hooks/
│   ├── useSimulation.ts          # Core math engine + vault drain logic
│   └── useGlitchEffect.ts        # Toly's Nightmare screen glitch hook
├── lib/
│   └── percoMath.ts              # Lazy side indices math (A, K, F, B, H-Ratio)
└── styles/
    └── globals.css               # Tailwind base + custom glitch/glow keyframes
```

---

## Proposed Changes

### Layer 1 — Project Bootstrap

#### [NEW] Next.js App in `c:\Users\FM-C\Desktop\Zilla\PercoChaos`
- `npx create-next-app@latest` with TypeScript, Tailwind CSS, App Router, ESLint
- Install dependencies: `recharts`, `lucide-react`, `clsx`, `tailwind-merge`

---

### Layer 2 — Design System & Shell

#### [NEW] `app/layout.tsx`
- `slate-950` root background (`#020617`)
- Google Fonts: **Space Grotesk** (headings) + **JetBrains Mono** (terminal/data)
- Global metadata: title `PercoChaos | Percolator Risk Engine Simulator`

#### [NEW] `styles/globals.css`
Custom Tailwind keyframes:
- `@keyframes glitch` — rapid horizontal RGB offset shifts for screen glitch effect
- `@keyframes neon-pulse` — subtle brightness oscillation on panel borders
- `@keyframes chart-flash` — opacity strobe on deficit trigger
- `@keyframes scanline` — subtle CRT scanline overlay

#### [NEW] `app/page.tsx`
Three-zone responsive grid layout:
```
┌─────────────────────────────────────────────────────────┐
│  HEADER — PercoChaos wordmark + live system clock       │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│   LEFT       │        CENTER PANEL                      │
│   PANEL      │  (Vault chart + Lazy Side Indices)       │
│  (Controls)  │                                          │
│              ├──────────────────────────────────────────┤
│              │  BOTTOM PANEL (PercoFork Terminal)        │
└──────────────┴──────────────────────────────────────────┘
```
Grid: `grid-cols-[320px_1fr]` with `grid-rows-[auto_1fr_auto]`

---

### Layer 3 — Global Chaos Controls (Left Panel)

#### [NEW] `components/GlobalChaosControls.tsx`
- GlowPanel wrapper with neon-green/purple border pulse
- **"Toly's Nightmare" button** — primary CTA at top:
  - Bright `#14F195` → `#9945FF` gradient background
  - Skull + Zap icon from Lucide
  - On click: fires `useGlitchEffect` hook (150ms glitch burst) then sets all sliders to max via shared state
- 4× `ChaosSlider` components with labeled value readouts

#### [NEW] `components/ui/ChaosSlider.tsx`
- Custom-styled `<input type="range">` via Tailwind + CSS
- Track: dark slate with neon gradient fill proportional to value
- Thumb: glowing circular handle with active scale transform
- Live numeric value display badge on the right

**Slider specs:**

| Slider | Min | Max | Unit | Default |
|---|---|---|---|---|
| Asset Volatility | 0 | 150 | % | 25 |
| Attacker Capital | 1 | 500 | SOL | 50 |
| Oracle Price Lag | 0 | 500 | ms | 0 |
| Network Congestion | 0 | 90 | % | 0 |

#### [NEW] `hooks/useGlitchEffect.ts`
- Applies `animate-glitch` CSS class to `<body>` for 600ms
- Returns `triggerGlitch()` function

---

### Layer 4 — Simulation Engine & Reactive Chart (Center Panel)

#### [NEW] `hooks/useSimulation.ts`
Core simulation loop (`setInterval` at 1s tick, 60-point rolling window):

**Vault drain math:**
```
drainRate = baseDrain
  × (1 + volatility/100)²
  × (1 + congestion/100)
  × (1 + oracleLag/500)
  × (attackerCapital/50)^1.4
```
- `baseDrain` = 3 SOL/tick (configurable)
- `vaultBalance` starts at 10,000 SOL
- Vault resets every 60-second loop
- `isDeficit` flag toggles when `vaultBalance <= 0`

#### [NEW] `lib/percoMath.ts`
Lazy Side Indices derived from slider values:

| Index | Formula | Label |
|---|---|---|
| Position Scaler (A) | `max(0.1, 1 - vol/200)` | A |
| Mark Effect (K) | `1 / (1 + oracleLag/1000)` | K |
| Funding Pool (F) | `vaultBalance / 10000` clamped `[0,1]` | F |
| Bankruptcy Loss (B) | `(vol/100 × congestion/100 × cap/500)^0.5` | B |
| H-Ratio | `1.0` if vault > 0, else linear drain `1→0` over 10s | H |

#### [NEW] `components/SimulationEngine.tsx`
- **Recharts `LineChart`** with `ResponsiveContainer`
  - X-axis: 0→60s ticker labels
  - Y-axis: SOL balance
  - `<Line>` stroke: `#14F195` (solvent) / `#EF4444` (deficit)
  - `<Area>` fill with gradient: green→purple (solvent) / red (deficit)
  - Animated entry with `isAnimationActive`
  - Custom `<Tooltip>` styled to match dark theme
- **Deficit Alert Banner** — conditionally rendered overlay:
  - `⚠ DEFICIT DETECTED: DRAIN-ONLY MODE ACTIVE`
  - Crimson red background with flash animation
  - Absolute positioned over chart
- **Lazy Side Indices row** — 5 metric cards below chart:
  - Each: label, computed value, colored status bar

#### [NEW] `components/ui/GlowPanel.tsx`
- Reusable `div` wrapper
- Props: `glowColor: 'green' | 'purple' | 'red' | 'none'`
- Applies `box-shadow` neon glow + animated border pulse

---

### Layer 5 — PercoFork Protocol Terminal (Bottom Panel)

#### [NEW] `components/PercoForkTerminal.tsx`
- Dark terminal background (`#0a0a0a`), JetBrains Mono font
- Ubuntu-style prompt: `root@percofork:~$`
- Dynamically generated CLI command block based on current slider values:
```bash
percolator-cli init-market \
  --leverage $(calculated) \
  --h-min 5000 \
  --oracle-lag-tolerance ${oracleLag}ms \
  --volatility-band ${volatility}% \
  --network-congestion ${congestion}% \
  --attacker-capital-cap ${capital}SOL \
  --insurance-vault-seed 10000
```
- Leverage calculated: `Math.max(1, Math.round(10 / (1 + volatility/100)))`
- Blinking cursor `▊` at end of output
- **"Copy Code" button** — Lucide `Copy` icon, triggers `navigator.clipboard.writeText()`
  - Confirmation flash: icon swaps to `Check` for 2s after copy

---

## Shared State Strategy

All slider values live in a top-level `useState` in `app/page.tsx` and passed down as props + callbacks. The simulation hook `useSimulation(params)` consumes these values reactively — any slider change immediately recalculates drain rate for the *next* tick.

```typescript
interface ChaosParams {
  volatility: number;       // 0–150
  attackerCapital: number;  // 1–500
  oracleLag: number;        // 0–500
  congestion: number;       // 0–90
}
```

---

## Visual State Summary

| System State | Border Glow | Chart Line | Chart Fill | Text Accent |
|---|---|---|---|---|
| Solvent (vault > 0) | `#14F195` pulsing | `#14F195` | green→purple gradient | `#14F195` |
| Deficit (vault = 0) | `#EF4444` strobing | `#EF4444` | red fade | `#EF4444` |
| Glitch (Toly's btn) | white RGB split | — | — | — |

---

## Verification Plan

### Automated
- `npm run build` — verify zero TypeScript/ESLint errors
- `npm run dev` — confirm app starts on `localhost:3000`

### Browser Testing
- Verify slider interactions update chart drain rate in real-time
- Verify "Toly's Nightmare" triggers glitch + slams all sliders to max
- Verify deficit state transition at vault = 0 (crimson flip + banner)
- Verify terminal CLI command string updates on each slider change
- Verify "Copy Code" clipboard functionality

---

## Open Questions

> [!IMPORTANT]
> **Vault Reset Behavior**: Should the 60-second loop *always* reset the vault to 10,000 SOL, or should it carry over the deficit into the next cycle (staying at 0 or negative indefinitely until sliders change)?

> [!NOTE]
> **Initial Vault Balance**: I've assumed 10,000 SOL as the starting insurance vault pool. Is this the right order of magnitude for the sim, or would you prefer a different starting value (e.g., 50,000 SOL)?

> [!NOTE]
> **Port**: The dev server will run on `localhost:3000` by default. Any preference to use a different port?
