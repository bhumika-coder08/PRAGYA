import React from 'react';
import { predictabilityEngine } from '../../services/predictabilityEngine';
import { TrendingUp, TrendingDown, Radio, Info, Activity } from 'lucide-react';
import { SimulatedDataBadge } from './SimulatedDataBadge';

interface ExplainabilitySignalPanelProps {
  minuteOffset?: number;
  className?: string;
}

export const ExplainabilitySignalPanel: React.FC<ExplainabilitySignalPanelProps> = ({
  minuteOffset = -47,
  className = '',
}) => {
  const signals = predictabilityEngine.getModelContributionSignals(minuteOffset);

  return (
    <div className={`bg-graphite-900 border border-scientific-border rounded-xl p-5 lg:p-6 font-mono text-xs ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-scientific-border pb-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-predictability" />
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
              WHY DID THE MODEL STATE CHANGE?
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-predictability/15 text-predictability-light font-bold border border-predictability/40">
              MODEL CONTRIBUTION SIGNALS
            </span>
          </div>
          <p className="text-[11px] text-scientific-muted">
            Attribution of phase space divergence reduction to specific observational state components.
          </p>
        </div>

        <SimulatedDataBadge size="sm" />
      </div>

      {/* Signals List */}
      <div className="space-y-2.5 mb-4">
        {signals.map((sig, idx) => {
          const isUp = sig.trend === 'INCREASING';
          const isObs = sig.trend === 'OBSERVATION_IMPROVEMENT';

          return (
            <div
              key={idx}
              className="bg-graphite-950 p-3 rounded-lg border border-scientific-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
            >
              <div className="flex items-center space-x-2.5">
                <span
                  className={`p-1.5 rounded ${
                    isObs
                      ? 'bg-observation/20 text-observation'
                      : isUp
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {isObs ? (
                    <Radio className="w-4 h-4" />
                  ) : isUp ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </span>
                <div>
                  <span className="font-bold text-slate-100">{sig.variable}</span>
                  <span className="text-slate-400 text-[11px] ml-2">({sig.magnitude})</span>
                  <p className="text-[10px] text-scientific-muted mt-0.5">{sig.note}</p>
                </div>
              </div>

              {/* Attribution weight bar */}
              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                <div className="w-20 h-1.5 bg-graphite-900 rounded overflow-hidden border border-scientific-border">
                  <div
                    className={`h-full ${
                      isObs ? 'bg-observation' : isUp ? 'bg-predictability' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${sig.signalPower}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-300 tabular-nums">
                  {sig.signalPower}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Scientific Honesty Disclaimer */}
      <div className="p-3 bg-graphite-950 rounded border border-scientific-border text-[11px] text-slate-400 flex items-start space-x-2">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">SCIENTIFIC INTEGRITY RULE:</strong> Model contribution signals reflect mathematical sensitivity gradients in the neural phase space projection. <span className="text-amber-300 font-semibold">Model contribution does not imply physical causation.</span>
        </p>
      </div>
    </div>
  );
};
