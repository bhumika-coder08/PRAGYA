import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import { useAtmosphere } from '../context/AtmosphericContext';
import { atmosphericService } from '../services/atmosphericService';
import { predictabilityEngine } from '../services/predictabilityEngine';
import { RiskGauge } from '../components/common/RiskGauge';
import { PredictabilityGauge } from '../components/common/PredictabilityGauge';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';
import { RiskPredictabilityMatrix } from '../components/common/RiskPredictabilityMatrix';
import { PredictabilityHorizonCard } from '../components/common/PredictabilityHorizonCard';
import { ExplainabilitySignalPanel } from '../components/common/ExplainabilitySignalPanel';
import { PrecursorTrajectoryChart } from '../components/common/PrecursorTrajectoryChart';
import {
  Compass,
  AlertTriangle,
  Info,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Activity,
  GitBranch,
  Layers,
  Sparkles
} from 'lucide-react';

export const PredictabilityPage: React.FC = () => {
  const { selectedCell } = useAtmosphere();
  const timelineData = atmosphericService.getPredictabilityTimeline(selectedCell.id);
  const [selectedPointIndex, setSelectedPointIndex] = useState(3); // Default to T-47

  const selectedPoint = timelineData[selectedPointIndex];

  // Chart formatted data
  const chartData = timelineData.map((d) => ({
    label: d.label,
    minute: d.timeOffsetMin,
    eventRisk: d.eventRisk,
    predictability: d.predictability,
    entropy: d.entropyBits,
    threshold: 70, // Predictability Threshold
    isThresholdCrossed: d.isThresholdCrossed,
    isEarliestDefensible: d.isEarliestDefensibleWarning,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-graphite-900 border border-scientific-border p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-predictability/15 border border-predictability/40 text-predictability-light">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-mono text-base font-bold text-slate-100">
                PREDICTABILITY & RISK RESEARCH INSTRUMENTS
              </h2>
              <SimulatedDataBadge size="sm" />
            </div>
            <p className="text-xs text-scientific-muted font-mono">
              Temporal bifurcation dynamics & earliest defensible warning verification for {selectedCell.id}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-scientific-muted">CRITICAL THRESHOLD:</span>
          <span className="px-2 py-0.5 rounded bg-predictability/20 text-predictability-light font-bold border border-predictability/40">
            70% PREDICTABILITY (PERSISTENT)
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TOP ROW: PREDICTABILITY HORIZON DETECTOR & 2x2 SEPARATION MATRIX */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictabilityHorizonCard cellId={selectedCell.id} threshold={70} />
        <RiskPredictabilityMatrix
          currentRisk={selectedPoint.eventRisk}
          currentPredictability={selectedPoint.predictability}
          cellName={selectedCell.id}
        />
      </div>

      {/* ===================================================================== */}
      {/* THE TWO MAJOR INSTRUMENTS (SIDE BY SIDE COMPARISON) */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* INSTRUMENT 1: EVENT RISK */}
        <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-scientific-border mb-3">
              <span className="text-xs font-mono font-bold text-red-400 tracking-wider">
                INSTRUMENT 01: EVENT RISK
              </span>
              <span className="text-[10px] font-mono text-scientific-muted">
                CURRENT LIKELIHOOD METRIC
              </span>
            </div>

            <RiskGauge
              value={selectedPoint.eventRisk}
              label={`EVENT RISK AT ${selectedPoint.label}`}
              size="lg"
            />

            <div className="mt-4 p-3 rounded bg-graphite-950 border border-scientific-border text-xs font-mono">
              <strong className="text-slate-200 block mb-1">SCIENTIFIC DEFINITION:</strong>
              <p className="text-scientific-muted leading-relaxed">
                <span className="text-red-400 font-semibold">Event Risk</span> measures how likely severe convection is to manifest within the designated spatial domain, derived from thermodynamic fuel (CAPE) and trigger energetics.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-scientific-border/80 text-[11px] font-mono text-slate-400">
            Current Risk at {selectedPoint.label}: <strong className="text-slate-100">{selectedPoint.eventRisk}%</strong> (Estimated severe potential)
          </div>
        </div>

        {/* INSTRUMENT 2: PREDICTABILITY */}
        <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-scientific-border mb-3">
              <span className="text-xs font-mono font-bold text-predictability-light tracking-wider">
                INSTRUMENT 02: PREDICTABILITY
              </span>
              <span className="text-[10px] font-mono text-predictability">
                STATE SEPARATION CONFIDENCE
              </span>
            </div>

            <PredictabilityGauge
              value={selectedPoint.predictability}
              label={`PREDICTABILITY AT ${selectedPoint.label}`}
              threshold={70}
              size="lg"
            />

            <div className="mt-4 p-3 rounded bg-graphite-950 border border-scientific-border text-xs font-mono">
              <strong className="text-slate-200 block mb-1">SCIENTIFIC DEFINITION:</strong>
              <p className="text-scientific-muted leading-relaxed">
                <span className="text-predictability-light font-semibold">Predictability</span> measures how confidently current atmospheric observation and model phase space allow this event to be distinguished from plausible alternative futures (such as dry failure or harmless ordinary showers).
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-scientific-border/80 text-[11px] font-mono text-slate-400">
            Current Predictability at {selectedPoint.label}: <strong className="text-predictability-light">{selectedPoint.predictability}%</strong>
            {selectedPoint.predictability >= 70 ? (
              <span className="text-emerald-400 ml-2 font-semibold">✓ Defensible Warning Capable</span>
            ) : (
              <span className="text-amber-400 ml-2 font-semibold">⚠ Atmosphere Remains Ambiguous</span>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* PRECURSOR TRAJECTORY & DIVERGENCE INDEX (PHASE SPACE EVOLUTION) */}
      {/* ===================================================================== */}
      <PrecursorTrajectoryChart
        activeOffset={selectedPoint.timeOffsetMin}
        onSelectOffset={(offset) => {
          const matchIdx = timelineData.findIndex((p) => p.timeOffsetMin === offset);
          if (matchIdx !== -1) setSelectedPointIndex(matchIdx);
        }}
      />

      {/* ===================================================================== */}
      {/* EXPLAINABILITY PANEL: WHY DID THE MODEL STATE CHANGE? */}
      {/* ===================================================================== */}
      <ExplainabilitySignalPanel minuteOffset={selectedPoint.timeOffsetMin} />

      {/* ===================================================================== */}
      {/* PREDICTABILITY TIMELINE & EVOLUTION STAGE STEPPER */}
      {/* ===================================================================== */}
      <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-scientific-border pb-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-observation" />
              <h3 className="font-mono text-sm font-bold text-slate-100">
                DISCRETE SAMPLING STAGES (TIMELINE AUDIT)
              </h3>
              <SimulatedDataBadge size="sm" />
            </div>
            <p className="text-xs text-scientific-muted font-mono">
              Temporal trace illustrating when information separation crosses the defensible threshold.
            </p>
          </div>

          {/* Markers Legend */}
          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-red-400" />
              <span className="text-slate-300">Event Risk %</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-predictability" />
              <span className="text-slate-300">Predictability %</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-amber-400" />
              <span className="text-amber-300">Threshold (70%)</span>
            </div>
          </div>
        </div>

        {/* Recharts Dual Curve Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222f40" />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} unit="%" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-graphite-950 border border-scientific-border p-3 rounded shadow-xl text-xs font-mono space-y-1">
                        <p className="font-bold text-slate-100">{data.label} (T{data.minute}m)</p>
                        <p className="text-red-400">Event Risk: {data.eventRisk}%</p>
                        <p className="text-predictability-light">Predictability: {data.predictability}%</p>
                        <p className="text-slate-400 text-[10px]">Information Entropy: {data.entropy} bits</p>
                        {data.isEarliestDefensible && (
                          <p className="text-emerald-400 font-bold text-[10px] mt-1 pt-1 border-t border-scientific-border">
                            ★ EARLIEST DEFENSIBLE WARNING
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '70% PREDICTABILITY THRESHOLD', fill: '#f59e0b', fontSize: 10, position: 'insideBottomRight' }} />
              <Area type="monotone" dataKey="predictability" fill="#a855f7" fillOpacity={0.15} stroke="#a855f7" strokeWidth={3} />
              <Line type="monotone" dataKey="eventRisk" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Interactive Timeline Stepper Cards */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-mono text-scientific-muted mb-2">
            <span className="font-semibold uppercase text-slate-300">
              DISCRETE SAMPLING STAGES (CLICK TO INSPECT)
            </span>
            <span>DATA SOURCE: DEMO PREDICTABILITY TIMELINE</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {timelineData.map((step, idx) => {
              const isSelected = selectedPointIndex === idx;
              return (
                <button
                  key={step.label}
                  onClick={() => setSelectedPointIndex(idx)}
                  className={`p-3 rounded border text-left transition-all font-mono ${
                    isSelected
                      ? 'bg-scientific-panel border-predictability ring-1 ring-predictability/50 shadow-md'
                      : 'bg-graphite-950 border-scientific-border hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200">{step.label}</span>
                    {step.isEarliestDefensibleWarning && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        ★ HORIZON
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] space-y-0.5">
                    <div className="flex justify-between">
                      <span className="text-scientific-muted">Risk:</span>
                      <span className="text-red-400 font-semibold">{step.eventRisk}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-scientific-muted">Pred:</span>
                      <span className="text-predictability font-semibold">{step.predictability}%</span>
                    </div>
                  </div>
                  {step.isThresholdCrossed ? (
                    <span className="text-[9px] text-emerald-400 font-semibold block mt-1.5">
                      ✓ Crossed
                    </span>
                  ) : (
                    <span className="text-[9px] text-scientific-muted block mt-1.5">
                      Ambiguous
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Detail Callout */}
        <div className="mt-4 p-4 rounded-lg bg-graphite-950 border border-scientific-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-100">
                STAGE {selectedPoint.label} ANALYSIS NOTE:
              </span>
              {selectedPoint.isEarliestDefensibleWarning && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40">
                  EARLIEST DEFENSIBLE WARNING WINDOW
                </span>
              )}
            </div>
            <p className="text-slate-300">{selectedPoint.atmosphereStateNote}</p>
          </div>

          <div className="shrink-0 flex items-center space-x-3 text-[11px] text-scientific-muted">
            <div>
              <span>ENTROPY: </span>
              <strong className="text-slate-200">{selectedPoint.entropyBits} bits</strong>
            </div>
            <div>
              <span>DIVERGENCE: </span>
              <strong className="text-slate-200">{selectedPoint.divergenceIndex}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
