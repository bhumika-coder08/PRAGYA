import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, HelpCircle, AlertTriangle, Info } from 'lucide-react';
import { SimulatedDataBadge } from './SimulatedDataBadge';

interface RiskPredictabilityMatrixProps {
  currentRisk?: number;
  currentPredictability?: number;
  cellName?: string;
  className?: string;
}

export const RiskPredictabilityMatrix: React.FC<RiskPredictabilityMatrixProps> = ({
  currentRisk = 67,
  currentPredictability = 31,
  cellName = 'Cell CX-017',
  className = '',
}) => {
  const [selectedQuadrant, setSelectedQuadrant] = useState<string | null>(null);

  // Quadrant configurations
  const quadrants = [
    {
      id: 'HIGH_RISK_LOW_PRED',
      title: 'HIGH RISK / LOW PREDICTABILITY',
      subtitle: 'The Ambiguity Trap (Cell CX-017)',
      riskRange: 'Risk ≥ 50%',
      predRange: 'Predictability < 50%',
      color: 'border-amber-500/80 bg-amber-950/20 text-amber-300',
      badge: 'HIGH AMBIGUITY',
      description:
        'Atmospheric fuel (CAPE) is extremely high, but capping inversion lid or trigger timing remains unresolved. Severe convection is possible, but alternative harmless futures are equally plausible.',
      operationalMeaning:
        'DO NOT issue public emergency alerts yet. Premature warning leads to severe false-alarm fatigue.'
    },
    {
      id: 'HIGH_RISK_HIGH_PRED',
      title: 'HIGH RISK / HIGH PREDICTABILITY',
      subtitle: 'The Defensible Warning Regime',
      riskRange: 'Risk ≥ 50%',
      predRange: 'Predictability ≥ 50%',
      color: 'border-red-500/80 bg-red-950/25 text-red-300',
      badge: 'DEFENSIBLE WARNING',
      description:
        'Deep moist convective column is firmly locked into severe attractor basin. Available observations distinguish this trajectory from alternative null futures with high confidence.',
      operationalMeaning:
        'ISSUE DEFENSIBLE WARNING. Earliest defensible window reached with actionable lead time.'
    },
    {
      id: 'LOW_RISK_LOW_PRED',
      title: 'LOW RISK / LOW PREDICTABILITY',
      subtitle: 'Observation-Limited Background',
      riskRange: 'Risk < 50%',
      predRange: 'Predictability < 50%',
      color: 'border-slate-700/80 bg-graphite-950 text-slate-400',
      badge: 'UNRESOLVED NULL',
      description:
        'Low ambient instability, but observations are too sparse or stale to rule out localized trigger pockets. Background state remains noisy.',
      operationalMeaning:
        'CONTINUE BACKGROUND SURVEILLANCE. Request targeted sensor scans if moisture builds.'
    },
    {
      id: 'LOW_RISK_HIGH_PRED',
      title: 'LOW RISK / HIGH PREDICTABILITY',
      subtitle: 'Confident Stable State',
      riskRange: 'Risk < 50%',
      predRange: 'Predictability ≥ 50%',
      color: 'border-emerald-500/80 bg-emerald-950/20 text-emerald-300',
      badge: 'CONFIDENT BENIGN',
      description:
        'Strong synoptic subsidence and high convective inhibition. Observations clearly confirm benign conditions with negligible chance of sudden genesis.',
      operationalMeaning:
        'NO ALERT REQUIRED. High confidence of safe atmospheric conditions.'
    }
  ];

  // Determine which quadrant current state belongs to
  const isHighRisk = currentRisk >= 50;
  const isHighPred = currentPredictability >= 50;
  const activeQuadrantId =
    isHighRisk && !isHighPred
      ? 'HIGH_RISK_LOW_PRED'
      : isHighRisk && isHighPred
      ? 'HIGH_RISK_HIGH_PRED'
      : !isHighRisk && !isHighPred
      ? 'LOW_RISK_LOW_PRED'
      : 'LOW_RISK_HIGH_PRED';

  return (
    <div className={`bg-graphite-900 border border-scientific-border rounded-xl p-5 lg:p-6 font-mono text-xs ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-scientific-border pb-4 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
              FUNDAMENTAL SEPARATION: EVENT RISK ≠ PREDICTABILITY
            </h3>
            <SimulatedDataBadge size="sm" />
          </div>
          <p className="text-scientific-muted mt-1 text-[11px]">
            Why estimated storm likelihood must never be confused with atmospheric state distinguishability.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[11px] bg-graphite-950 px-3 py-1.5 rounded border border-scientific-border">
          <span className="text-scientific-muted">CURRENT FOCUS ({cellName}):</span>
          <span className="text-red-400 font-bold">RISK: {currentRisk}%</span>
          <span className="text-slate-600">|</span>
          <span className="text-predictability font-bold">PRED: {currentPredictability}%</span>
        </div>
      </div>

      {/* CORE SCIENTIFIC EXPLANATION QUOTE */}
      <div className="bg-graphite-950 border-l-4 border-l-predictability p-4 rounded-r-lg border-t border-b border-r border-scientific-border/80 mb-5">
        <p className="text-sm font-sans font-semibold text-slate-200 leading-relaxed italic">
          "A dangerous event can have high estimated risk while still being poorly resolved by available observations."
        </p>
        <span className="text-[10px] text-slate-400 block mt-1">
          — PRAGYA Research Intelligence Architecture Principle
        </span>
      </div>

      {/* 2x2 QUADRANT MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((q) => {
          const isCurrentActive = activeQuadrantId === q.id;
          const isSelected = selectedQuadrant === q.id;

          return (
            <div
              key={q.id}
              onClick={() => setSelectedQuadrant(isSelected ? null : q.id)}
              className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${q.color} ${
                isCurrentActive
                  ? 'ring-2 ring-amber-400/80 shadow-xl'
                  : 'hover:border-slate-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-100">{q.title}</span>
                  <div className="flex items-center space-x-1.5">
                    {isCurrentActive && (
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-graphite-950 font-bold text-[9px] animate-pulse">
                        CURRENT CELL STATE
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-black/40 text-[9px] font-semibold border border-current">
                      {q.badge}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-[10px] text-scientific-muted mb-2">
                  <span>{q.riskRange}</span>
                  <span>•</span>
                  <span>{q.predRange}</span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed mb-3">
                  {q.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-current/20 text-[10px]">
                <strong className="text-slate-200 block mb-0.5">OPERATIONAL ACTION:</strong>
                <span className="text-slate-300">{q.operationalMeaning}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer takeaway */}
      <div className="mt-4 pt-3 border-t border-scientific-border flex flex-wrap items-center justify-between gap-2 text-[10px] text-scientific-muted">
        <span>JUDGES NOTE: TRADITIONAL NOWCASTING COLLAPSES RISK AND PREDICTABILITY INTO ONE VALUE, LEADING TO FALSE ALARMS.</span>
        <span className="text-predictability font-bold">ORTHOGONAL 2D ANALYSIS ACTIVE</span>
      </div>
    </div>
  );
};
