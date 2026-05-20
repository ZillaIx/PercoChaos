import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";

import type { ChaosParams } from "@/lib/percoMath";

function buildCommand(params: ChaosParams) {
  const leverage = Math.max(1, Math.round(10 / (1 + params.volatility / 100)));

  return [
    "percolator-cli init-market",
    `--leverage ${leverage}`,
    "--h-min 5000",
    `--oracle-lag-tolerance ${params.oracleLag}ms`,
    `--volatility-band ${params.volatility}%`,
    `--network-congestion ${params.congestion}%`,
    `--attacker-capital-cap ${params.attackerCapital}SOL`,
    "--insurance-vault-seed 5.00",
  ].join(" ");
}

interface PercoForkTerminalProps {
  params: ChaosParams;
}

export function PercoForkTerminal({ params }: PercoForkTerminalProps) {
  const command = useMemo(() => buildCommand(params), [params]);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be blocked; do nothing.
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
          root@percofork:~$
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-sm border border-slate-700/80 bg-slate-950/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-300 hover:border-solana-green/50 hover:text-solana-green"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </button>
      </div>

      <pre className="overflow-auto rounded-sm border border-slate-800/70 bg-[#0a0a0a]/85 p-4 font-mono text-xs leading-relaxed text-slate-200">
        <code>
          <span className="text-solana-green">root@percofork</span>
          <span className="text-slate-500">:</span>
          <span className="text-solana-purple">~</span>
          <span className="text-slate-500">$</span>{" "}
          {command}
          <span className="ml-1 animate-pulse text-slate-400">▊</span>
        </code>
      </pre>
    </div>
  );
}

