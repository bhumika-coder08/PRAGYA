import React from 'react';
import { predictabilityEngine } from '../../services/predictabilityEngine';
import { ShieldCheck, Compass, Clock, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { SimulatedDataBadge } from './SimulatedDataBadge';

interface PredictabilityHorizonCardProps {
  cellId?: string;
  threshold?: number;
  persistenceSteps?: number;
  className?: string;
}

export const PredictabilityHorizonCard: React.FC<PredictabilityHorizonCardProps> = ({
  cellId = 'CX-017',
  threshold = 70,
  persistenceSteps = 2,
  className = '',
}) => {
  const result = predictabilityEngine.detectPredictabilityHorizon(cellId, threshold, persistenceSteps);

  return (
    <div className={`bg-graphite-900 border border-scientific-border rounded-xl p-5 lg:p-6 font-mono text-xs ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-scientific-border pb-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded bg-predictability/20 border border-predictability/40 text-predictability-light">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
                PREDICTABILITY HORIZON DETECTOR
              </h3>
              <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-[9px]">
                DEMO RESULT
              </span>
            </div>
            <p className="text-[11px] text-scientific-muted">
              Evaluates temporal sequence persistence to reject temporary stochastic spikes.
            </p>
          </div>
        </div>

        {/* State Regime Badge */}
        <span className="px-3 py-1 rounded bg-predictability/15 text-predictability-light border border-predictability/40 font-bold text-xs">
          STATE: {result.state}
        </span>
      </div>

      {/* Primary Horizon Callout Box */}
      <div className="bg-graphite-950 border border-scientific-border rounded-lg p-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-scientific-muted uppercase tracking-widest block font-bold">
            PREDICTABILITY HORIZON
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-observation tabular-nums">
              T−{result.leadTimeMinutes} MINUTES
            </span>
            <span className="text-slate-400 font-semibold text-xs">
              (Earliest Defensible Warning)
            </span>
          </div>
          <p className="text-xs text-slate-300 italic pt-0.5">
            "{result.summaryText}"
          </p>
        </div>

        <div className="bg-graphite-900 border border-scientific-border px-4 py-3 rounded-lg text-right shrink-0">
          <span className="text-[10px] text-scientific-muted block">PERSISTENT CONFIDENCE</span>
          <span className="text-2xl font-bold text-predictability-light tabular-nums">
            {result.confidenceScore}%
          </span>
          <span className="text-[9px] text-emerald-400 block font-semibold mt-0.5">
            ✓ PERSISTENCE VERIFIED
          </span>
        </div>
      </div>

      {/* Metric Breakdown Table / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        <div className="bg-graphite-950 p-3 rounded border border-scientific-border">
          <span className="text-[10px] text-scientific-muted block">THRESHOLD</span>
          <span className="text-sm font-bold text-amber-400 tabular-nums">
            {result.thresholdPercentage}%
          </span>
          <span className="text-[9px] text-slate-500 block">Demonstration</span>
        </div>

        <div className="bg-graphite-950 p-3 rounded border border-scientific-border">
          <span className="text-[10px] text-scientific-muted block">FIRST CROSSING</span>
          <span className="text-sm font-bold text-slate-200 tabular-nums">
            T{result.firstCrossingMinute}m
          </span>
          <span className="text-[9px] text-slate-500 block">Instantaneous</span>
        </div>

        <div className="bg-graphite-950 p-3 rounded border border-scientific-border">
          <span className="text-[10px] text-scientific-muted block">PERSISTENT CROSSING</span>
          <span className="text-sm font-bold text-observation tabular-nums">
            T{result.persistentCrossingMinute}m
          </span>
          <span className="text-[9px] text-emerald-400 block">&ge; 2 Steps Confirmed</span>
        </div>

        <div className="bg-graphite-950 p-3 rounded border border-scientific-border">
          <span className="text-[10px] text-scientific-muted block">LEAD TIME</span>
          <span className="text-sm font-bold text-observation tabular-nums">
            {result.leadTimeMinutes} min
          </span>
          <span className="text-[9px] text-slate-500 block">Prior to severe</span>
        </div>

        <div className="bg-graphite-950 p-3 rounded border border-scientific-border">
          <span className="text-[10px] text-scientific-muted block">STATE REGIME</span>
          <span className="text-sm font-bold text-predictability-light truncate block">
            {result.state}
          </span>
          <span className="text-[9px] text-slate-500 block">Phase Space Attractor</span>
        </div>

        <div className="bg-graphite-950 p-3 rounded border border-scientific-border">
          <span className="text-[10px] text-scientific-muted block">WARNING CAPABILITY</span>
          <span className="text-sm font-bold text-emerald-400 block">
            DEFENSIBLE
          </span>
          <span className="text-[9px] text-slate-500 block">High Signal-to-Noise</span>
        </div>
      </div>

      {/* Verification Protocol explanation */}
      <div className="p-3 bg-graphite-950 rounded border border-scientific-border/80 text-[11px] text-slate-400 flex items-start space-x-2">
        <Info className="w-4 h-4 text-observation shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Persistence Protocol:</strong> A single momentary predictability spike does not qualify as a Predictability Horizon. The detector requires predictability to exceed the demonstration threshold ({threshold}%) and remain consistently non-decreasing over consecutive temporal evaluations.
        </p>
      </div>
    </div>
  );
};
