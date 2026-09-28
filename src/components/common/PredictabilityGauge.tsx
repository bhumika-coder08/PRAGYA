import React from 'react';
import { Target, HelpCircle, ShieldCheck, ShieldAlert } from 'lucide-react';

interface PredictabilityGaugeProps {
  value: number; // 0 to 100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  threshold?: number; // default 70%
  showExplanation?: boolean;
}

export const PredictabilityGauge: React.FC<PredictabilityGaugeProps> = ({
  value,
  label = "PREDICTABILITY",
  size = 'md',
  threshold = 70,
  showExplanation = false,
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  const isThresholdPassed = clamped >= threshold;

  // Circular gauge calculations
  const radius = size === 'lg' ? 44 : 36;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="bg-graphite-900 border border-scientific-border rounded-lg p-3.5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1.5">
          <Target className="w-4 h-4 text-predictability" />
          <span className="text-xs font-mono font-semibold text-slate-300 tracking-wider uppercase">
            {label}
          </span>
        </div>
        <span className="text-[10px] font-mono text-predictability-light uppercase px-1.5 py-0.5 rounded bg-predictability/15 border border-predictability/40">
          CONFIDENCE HORIZON
        </span>
      </div>

      <div className="flex items-center justify-between my-1">
        {/* Metric text */}
        <div>
          <div className="flex items-baseline space-x-1">
            <span
              className={`font-mono font-bold tabular-nums ${
                size === 'lg' ? 'text-3xl' : 'text-2xl'
              } ${isThresholdPassed ? 'text-predictability-light' : 'text-slate-400'}`}
            >
              {clamped}%
            </span>
            <span className="text-xs text-scientific-muted font-mono">CONFIDENCE</span>
          </div>

          <div className="mt-1 flex items-center space-x-1 text-[11px] font-mono">
            {isThresholdPassed ? (
              <span className="inline-flex items-center space-x-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DEFENSIBLE WINDOW</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-amber-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>HIGH AMBIGUITY</span>
              </span>
            )}
          </div>
        </div>

        {/* Circular Radar / Target dial */}
        <div className="relative flex items-center justify-center">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              stroke="#1e293b"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Threshold marker tick */}
            <circle
              stroke="#475569"
              strokeDasharray={`${(threshold / 100) * circumference} ${circumference}`}
              strokeDashoffset="0"
              fill="transparent"
              strokeWidth={strokeWidth + 2}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              opacity={0.3}
            />
            {/* Active value ring */}
            <circle
              stroke={isThresholdPassed ? '#a855f7' : '#64748b'}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-mono text-scientific-muted">
              {threshold}%
            </span>
          </div>
        </div>
      </div>

      {/* Threshold Status bar */}
      <div className="mt-2 text-[10px] font-mono text-scientific-muted flex items-center justify-between border-t border-scientific-border/60 pt-2">
        <span>CRITICAL THRESHOLD: {threshold}%</span>
        <span>
          {isThresholdPassed ? 'SEPARATED FROM NOISE' : 'SUBSUMED BY DIVERGENCE'}
        </span>
      </div>

      {showExplanation && (
        <p className="mt-2 text-[11px] text-scientific-muted leading-tight">
          Degree to which atmospheric state distinguishes this outcome from plausible alternatives.
        </p>
      )}
    </div>
  );
};
