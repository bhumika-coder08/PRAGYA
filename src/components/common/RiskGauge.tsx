import React from 'react';
import { Flame, AlertTriangle } from 'lucide-react';

interface RiskGaugeProps {
  value: number; // 0 to 100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showExplanation?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  value,
  label = "EVENT RISK",
  size = 'md',
  showExplanation = false,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  // Determine severity tier
  const tierColor =
    clamped >= 70
      ? 'text-red-400 border-red-500/50 bg-red-950/30'
      : clamped >= 40
      ? 'text-amber-400 border-amber-500/50 bg-amber-950/30'
      : 'text-emerald-400 border-emerald-500/50 bg-emerald-950/30';

  const barColor =
    clamped >= 70
      ? 'bg-gradient-to-r from-amber-500 to-red-500'
      : clamped >= 40
      ? 'bg-gradient-to-r from-emerald-500 to-amber-500'
      : 'bg-emerald-500';

  return (
    <div className="bg-graphite-900 border border-scientific-border rounded-lg p-3.5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1.5">
          <Flame className="w-4 h-4 text-red-400" />
          <span className="text-xs font-mono font-semibold text-slate-300 tracking-wider uppercase">
            {label}
          </span>
        </div>
        <span className="text-[10px] font-mono text-scientific-muted uppercase px-1.5 py-0.5 rounded bg-graphite-800 border border-scientific-border">
          LIKELIHOOD
        </span>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline space-x-1">
          <span className={`font-mono font-bold tabular-nums ${size === 'lg' ? 'text-3xl' : 'text-2xl'} ${clamped >= 70 ? 'text-red-400' : clamped >= 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {clamped}%
          </span>
          <span className="text-xs text-scientific-muted font-mono">P(SEVERE)</span>
        </div>
        <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${tierColor}`}>
          {clamped >= 75 ? 'HIGH THREAT' : clamped >= 45 ? 'ELEVATED' : 'LOW RISK'}
        </span>
      </div>

      {/* Stepped progress track with warning threshold markers */}
      <div className="relative w-full h-2.5 bg-graphite-950 rounded border border-scientific-border overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
        {/* 50% & 75% tick marks */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-graphite-800 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-3/4 w-0.5 bg-graphite-800 pointer-events-none" />
      </div>

      {showExplanation && (
        <p className="mt-2 text-[11px] text-scientific-muted leading-tight">
          Estimated probability of convective initiation and severe phenomena occurrence.
        </p>
      )}
    </div>
  );
};
