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
          <Target className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-heading font-semibold text-slate-200 tracking-wide">
            {label}
          </span>
        </div>
        <span className="text-[10px] font-sans font-medium text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
          Confidence Horizon
        </span>
      </div>

      <div className="flex items-center justify-between my-1">
        {/* Metric text */}
        <div>
          <div className="flex items-baseline space-x-1.5">
            <span
              className={`font-mono font-semibold tabular-nums ${
                size === 'lg' ? 'text-3xl' : 'text-2xl'
              } ${isThresholdPassed ? 'text-purple-300' : 'text-slate-400'}`}
            >
              {clamped}%
            </span>
            <span className="text-[11px] text-slate-400 font-sans">Confidence</span>
          </div>

          <div className="mt-1 flex items-center space-x-1 text-xs font-sans">
            {isThresholdPassed ? (
              <span className="inline-flex items-center space-x-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-medium">Defensible Window</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-amber-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="font-medium">High Ambiguity</span>
              </span>
            )}
          </div>
        </div>

        {/* Circular Radar / Target dial */}
        <div className="relative flex items-center justify-center">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              stroke="#172235"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Threshold marker tick */}
            <circle
              stroke="#334155"
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
              stroke={isThresholdPassed ? '#c084fc' : '#64748b'}
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
            <span className="text-[11px] font-mono text-slate-400 font-medium">
              {threshold}%
            </span>
          </div>
        </div>
      </div>

      {/* Threshold Status bar */}
      <div className="mt-2 text-xs font-sans text-slate-400 flex items-center justify-between border-t border-scientific-border/60 pt-2">
        <span className="text-[11px]">Critical threshold: <strong className="font-mono text-slate-300 font-medium">{threshold}%</strong></span>
        <span className="text-[11px] font-medium text-slate-300">
          {isThresholdPassed ? 'Separated from noise' : 'Subsumed by divergence'}
        </span>
      </div>

      {showExplanation && (
        <p className="mt-2 text-[11px] text-slate-400 font-sans leading-relaxed">
          Degree to which atmospheric state distinguishes this outcome from plausible alternatives.
        </p>
      )}
    </div>
  );
};
