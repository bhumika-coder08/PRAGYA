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
          <div className="p-2 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="font-heading text-base font-bold text-slate-100">
                Predictability & Risk Research Instruments
              </h2>
              <SimulatedDataBadge size="sm" />
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Temporal bifurcation dynamics & earliest defensible warning verification for <span className="font-mono text-slate-300">{selectedCell.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-sans">
          <span className="text-slate-400 font-medium">Critical Threshold:</span>
          <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/30 font-mono text-xs">
            70% Predictability
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
              <span className="text-xs font-heading font-semibold text-rose-400 tracking-wide uppercase">
                Instrument 01: Event Risk
              </span>
              <span className="text-[10px] font-sans font-medium text-slate-400 uppercase tracking-wide">
                Likelihood Metric
              </span>
            </div>

            <RiskGauge
              value={selectedPoint.eventRisk}
              label={`Event Risk at ${selectedPoint.label}`}
              size="lg"
            />

            <div className="mt-4 p-3 rounded-md bg-graphite-950 border border-scientific-border text-xs font-sans">
              <strong className="text-slate-200 block mb-1 font-heading text-xs uppercase tracking-wide">Scientific Definition:</strong>
              <p className="text-slate-300 leading-relaxed">
                <span className="text-rose-400 font-medium">Event Risk</span> measures how likely severe convection is to manifest within the designated spatial domain, derived from thermodynamic fuel (CAPE) and trigger energetics.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-scientific-border/80 text-xs font-sans text-slate-400">
            Current Risk at {selectedPoint.label}: <strong className="text-slate-100 font-mono font-semibold">{selectedPoint.eventRisk}%</strong> <span className="text-slate-400">(estimated severe potential)</span>
          </div>
        </div>

        {/* INSTRUMENT 2: PREDICTABILITY */}
        <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-scientific-border mb-3">
              <span className="text-xs font-heading font-semibold text-purple-300 tracking-wide uppercase">
                Instrument 02: Predictability
              </span>
              <span className="text-[10px] font-sans font-medium text-purple-300 uppercase tracking-wide">
                State Separation Confidence
              </span>
            </div>

            <PredictabilityGauge
              value={selectedPoint.predictability}
              label={`Predictability at ${selectedPoint.label}`}
              threshold={70}
              size="lg"
            />

            <div className="mt-4 p-3 rounded-md bg-graphite-950 border border-scientific-border text-xs font-sans">
              <strong className="text-slate-200 block mb-1 font-heading text-xs uppercase tracking-wide">Scientific Definition:</strong>
              <p className="text-slate-300 leading-relaxed">
                <span className="text-purple-300 font-medium">Predictability</span> measures how confidently current atmospheric observation and model phase space allow this event to be distinguished from plausible alternative futures (such as dry failure or harmless ordinary showers).
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-scientific-border/80 text-xs font-sans text-slate-400">
            Current Predictability at {selectedPoint.label}: <strong className="text-purple-300 font-mono font-semibold">{selectedPoint.predictability}%</strong>
            {selectedPoint.predictability >= 70 ? (
              <span className="text-emerald-400 ml-2 font-medium">✓ Defensible Warning Capable</span>
            ) : (
              <span className="text-amber-400 ml-2 font-medium">⚠ Atmosphere Remains Ambiguous</span>
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
            <div className="flex items-center space-x-2.5">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              <h3 className="font-heading text-sm font-bold text-slate-100">
                Discrete Sampling Stages (Timeline Audit)
              </h3>
              <SimulatedDataBadge size="sm" />
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Temporal trace illustrating when information separation crosses the defensible threshold.
            </p>
          </div>

          {/* Markers Legend */}
          <div className="flex items-center space-x-4 text-xs font-sans">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-rose-400" />
              <span className="text-slate-300">Event Risk %</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-purple-400" />
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
              <CartesianGrid strokeDasharray="3 3" stroke="#172235" />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
              <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'IBM Plex Mono' }} unit="%" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-graphite-950 border border-scientific-border p-3 rounded-md shadow-xl text-xs font-sans space-y-1">
                        <p className="font-heading font-semibold text-slate-100">{data.label} (T{data.minute}m)</p>
                        <p className="text-rose-400 font-mono">Event Risk: {data.eventRisk}%</p>
                        <p className="text-purple-300 font-mono">Predictability: {data.predictability}%</p>
                        <p className="text-slate-400 text-[11px] font-mono">Information Entropy: {data.entropy} bits</p>
                        {data.isEarliestDefensible && (
                          <p className="text-emerald-400 font-medium text-[11px] mt-1 pt-1 border-t border-scientific-border">
                            ★ Earliest Defensible Warning
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '70% PREDICTABILITY THRESHOLD', fill: '#f59e0b', fontSize: 10, position: 'insideBottomRight' }} />
              <Area type="monotone" dataKey="predictability" fill="#a855f7" fillOpacity={0.12} stroke="#c084fc" strokeWidth={2.5} />
              <Line type="monotone" dataKey="eventRisk" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Interactive Timeline Stepper Cards */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-sans text-slate-400 mb-2">
            <span className="font-heading font-semibold uppercase tracking-wide text-slate-300">
              Discrete Sampling Stages (Click to Inspect)
            </span>
            <span className="text-slate-400 text-[11px]">Demo Predictability Timeline</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {timelineData.map((step, idx) => {
              const isSelected = selectedPointIndex === idx;
              return (
                <button
                  key={step.label}
                  onClick={() => setSelectedPointIndex(idx)}
                  className={`p-3 rounded-md border text-left transition-colors font-sans ${
                    isSelected
                      ? 'bg-purple-500/10 border-purple-500/50 shadow-xs'
                      : 'bg-graphite-950 border-scientific-border hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-semibold text-slate-200">{step.label}</span>
                    {step.isEarliestDefensibleWarning && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-medium border border-emerald-500/30">
                        ★ Horizon
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] space-y-0.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Risk:</span>
                      <span className="text-rose-400 font-mono font-semibold">{step.eventRisk}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pred:</span>
                      <span className="text-purple-300 font-mono font-semibold">{step.predictability}%</span>
                    </div>
                  </div>
                  {step.isThresholdCrossed ? (
                    <span className="text-[10px] text-emerald-400 font-medium block mt-1.5">
                      ✓ Crossed
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 block mt-1.5">
                      Ambiguous
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Detail Callout */}
        <div className="mt-4 p-4 rounded-lg bg-graphite-950 border border-scientific-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-heading font-semibold text-slate-100">
                Stage {selectedPoint.label} Analysis Note:
              </span>
              {selectedPoint.isEarliestDefensibleWarning && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 font-medium text-[10px] border border-emerald-500/30">
                  Earliest Defensible Warning Window
                </span>
              )}
            </div>
            <p className="text-slate-300 leading-relaxed">{selectedPoint.atmosphereStateNote}</p>
          </div>

          <div className="shrink-0 flex items-center space-x-3.5 text-xs text-slate-400">
            <div>
              <span>Entropy: </span>
              <strong className="text-slate-200 font-mono">{selectedPoint.entropyBits} bits</strong>
            </div>
            <div>
              <span>Divergence: </span>
              <strong className="text-slate-200 font-mono">{selectedPoint.divergenceIndex}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
