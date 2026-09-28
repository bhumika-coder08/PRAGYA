import React, { useState } from 'react';
import { atmosphericService } from '../services/atmosphericService';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';
import { CounterfactualSandbox } from '../components/common/CounterfactualSandbox';
import {
  FlaskConical,
  GitCompare,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const StormLaboratoryPage: React.FC = () => {
  const differenceSignals = atmosphericService.getDifferenceSignals();

  const [selectedParameter, setSelectedParameter] = useState<string>('convergence');

  // Synchronized parameter timeline comparison data (T-120 to T-0)
  const synchronizedTimelineData = [
    {
      time: 'T-120',
      capeA: 2350, capeB: 2320,
      cinA: -85, cinB: -88,
      moistureA: 3.2, moistureB: 3.0,
      convergenceA: 2.1, convergenceB: 1.9,
      shearA: 18, shearB: 16,
    },
    {
      time: 'T-90',
      capeA: 2480, capeB: 2410,
      cinA: -62, cinB: -72,
      moistureA: 3.9, moistureB: 3.1,
      convergenceA: 2.9, convergenceB: 2.1,
      shearA: 20, shearB: 15,
    },
    {
      time: 'T-60',
      capeA: 2590, capeB: 2450,
      cinA: -38, cinB: -54,
      moistureA: 4.6, moistureB: 2.8,
      convergenceA: 4.1, convergenceB: 1.8,
      shearA: 22, shearB: 14,
    },
    {
      time: 'T-45', // Bifurcation Point
      capeA: 2650, capeB: 2480,
      cinA: -18, cinB: -46,
      moistureA: 5.2, moistureB: 2.1,
      convergenceA: 5.0, convergenceB: 1.6,
      shearA: 24, shearB: 14,
    },
    {
      time: 'T-30',
      capeA: 2620, capeB: 2420,
      cinA: -8, cinB: -42,
      moistureA: 5.4, moistureB: 1.8,
      convergenceA: 5.4, convergenceB: 1.5,
      shearA: 24, shearB: 13,
    },
    {
      time: 'NOW',
      capeA: 2400, capeB: 2380,
      cinA: 0, cinB: -38,
      moistureA: 5.1, moistureB: 1.7,
      convergenceA: 5.2, convergenceB: 1.4,
      shearA: 23, shearB: 13,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-graphite-900 border border-scientific-border p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-amber-500/15 border border-amber-500/40 text-amber-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-mono text-base font-bold text-slate-100">
                STORM LABORATORY: COUNTERFACTUAL PAIR & NEAR-MISS SANDBOX
              </h2>
              <SimulatedDataBadge size="sm" />
            </div>
            <p className="text-xs text-scientific-muted font-mono">
              Controlled comparative environment: Why did Event A produce extreme convection while Event B failed?
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-scientific-muted">
          <span>EXPERIMENT: </span>
          <span className="text-slate-200 font-bold">EXP-GHATS-PAIR-088</span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* INTERACTIVE WHAT-IF COUNTERFACTUAL SANDBOX */}
      {/* ===================================================================== */}
      <CounterfactualSandbox />

      {/* ===================================================================== */}
      {/* THE TWO COMPETING CASES (EVENT A vs EVENT B) */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EVENT A CARD */}
        <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between pb-2 border-b border-scientific-border mb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-red-400" />
              <span className="font-mono font-bold text-xs text-red-400 tracking-wider">
                EVENT A: SEVERE CONVECTION DEVELOPED
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
              OUTCOME: MATURE SUPERCELL (142 mm/h)
            </span>
          </div>

          <p className="text-xs font-mono text-scientific-muted mb-4 leading-relaxed">
            Case Date: 2024-07-26 | Rapidly organizing localized convective cell. High surface CAPE coupled with sustained low-level moisture convergence and capped-lid perforation.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="bg-graphite-950 p-2 rounded border border-scientific-border">
              <span className="text-[10px] text-scientific-muted block">CAPE (J/kg)</span>
              <span className="text-slate-100 font-bold">2,650</span>
            </div>
            <div className="bg-graphite-950 p-2 rounded border border-scientific-border">
              <span className="text-[10px] text-scientific-muted block">CIN EROSION</span>
              <span className="text-red-400 font-bold">-8 J/kg</span>
            </div>
            <div className="bg-graphite-950 p-2 rounded border border-scientific-border">
              <span className="text-[10px] text-scientific-muted block">CONVERGENCE</span>
              <span className="text-observation font-bold">5.4 g/kg</span>
            </div>
            <div className="bg-graphite-950 p-2 rounded border border-scientific-border">
              <span className="text-[10px] text-scientific-muted block">SHEAR</span>
              <span className="text-purple-300 font-bold">24.1 m/s</span>
            </div>
          </div>
        </div>

        {/* EVENT B CARD */}
        <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5 border-l-4 border-l-slate-500">
          <div className="flex items-center justify-between pb-2 border-b border-scientific-border mb-3">
            <div className="flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-slate-400" />
              <span className="font-mono font-bold text-xs text-slate-300 tracking-wider">
                EVENT B: SIMILAR ENVIRONMENT, CONVECTION FAILED
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-graphite-950 text-slate-400 border border-scientific-border">
              OUTCOME: CAPPING INVERSION HELD
            </span>
          </div>

          <p className="text-xs font-mono text-scientific-muted mb-4 leading-relaxed">
            Case Date: 2024-08-11 | Surface CAPE was similarly high (2,480 J/kg), leading standard indices to false-alarm. Entrainment of dry mid-level air aborted vertical acceleration.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="bg-graphite-950 p-2 rounded border border-scientific-border">
              <span className="text-[10px] text-scientific-muted block">CAPE (J/kg)</span>
              <span className="text-slate-100 font-bold">2,480</span>
            </div>
            <div className="bg-graphite-950 p-2 rounded border border-scientific-border">
              <span className="text-[10px] text-scientific-muted block">CIN EROSION</span>
              <span className="text-slate-400 font-bold">-42 J/kg</span>
            </div>
            <div className="bg-graphite-950 p-2 rounded border border-scientific-border">
              <span className="text-[10px] text-scientific-muted block">CONVERGENCE</span>
              <span className="text-slate-400 font-bold">1.8 g/kg</span>
            </div>
            <div className="bg-graphite-950 p-2 rounded border border-scientific-border">
              <span className="text-[10px] text-scientific-muted block">SHEAR</span>
              <span className="text-slate-400 font-bold">13.8 m/s</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SYNCHRONIZED PARAMETER TIMELINES */}
      {/* ===================================================================== */}
      <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-scientific-border pb-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <GitCompare className="w-5 h-5 text-observation" />
              <h3 className="font-mono text-sm font-bold text-slate-100">
                SYNCHRONIZED PARAMETER TIMELINES (T-120m TO NOW)
              </h3>
            </div>
            <p className="text-xs text-scientific-muted font-mono">
              Notice the divergence point around T-45m where boundary layer convergence separated the two outcomes.
            </p>
          </div>

          {/* Parameter Selector */}
          <div className="flex items-center space-x-1 font-mono text-xs bg-graphite-950 p-1 rounded border border-scientific-border">
            {[
              { id: 'convergence', label: 'Moisture Convergence' },
              { id: 'cin', label: 'CIN Depletion' },
              { id: 'cape', label: 'CAPE Trajectory' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedParameter(p.id)}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedParameter === p.id
                    ? 'bg-scientific-panel text-observation font-bold border border-scientific-border'
                    : 'text-scientific-muted hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dual Trajectory Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={synchronizedTimelineData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222f40" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-graphite-950 border border-scientific-border p-2.5 rounded text-xs font-mono">
                        <p className="font-bold text-slate-100 mb-1">{data.time}</p>
                        <p className="text-red-400">Event A (Severe): {payload[0]?.value}</p>
                        <p className="text-slate-400">Event B (Failed): {payload[1]?.value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }} />
              <Line
                type="monotone"
                name="Event A (Severe Developed)"
                dataKey={
                  selectedParameter === 'convergence'
                    ? 'convergenceA'
                    : selectedParameter === 'cin'
                    ? 'cinA'
                    : 'capeA'
                }
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                name="Event B (Convection Failed)"
                dataKey={
                  selectedParameter === 'convergence'
                    ? 'convergenceB'
                    : selectedParameter === 'cin'
                    ? 'cinB'
                    : 'capeB'
                }
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ATMOSPHERIC DIFFERENCE FINDER */}
      {/* ===================================================================== */}
      <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-scientific-border pb-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h3 className="font-mono text-sm font-bold text-slate-100 uppercase">
                ATMOSPHERIC DIFFERENCE FINDER
              </h3>
              <SimulatedDataBadge size="sm" />
            </div>
            <p className="text-xs text-scientific-muted font-mono mt-0.5">
              Highlighting the strongest discriminating signals between developed and failed convection.
            </p>
          </div>
        </div>

        {/* Signals Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-scientific-border text-scientific-muted">
                <th className="py-2 px-3">CANDIDATE DISCRIMINATING SIGNAL</th>
                <th className="py-2 px-3 text-red-400">EVENT A (DEVELOPED)</th>
                <th className="py-2 px-3 text-slate-400">EVENT B (FAILED)</th>
                <th className="py-2 px-3">DELTA (Δ)</th>
                <th className="py-2 px-3 text-amber-400">DISCRIMINATING POWER</th>
                <th className="py-2 px-3">PHYSICAL CONTEXT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-scientific-border/60">
              {differenceSignals.map((sig, idx) => (
                <tr key={idx} className="hover:bg-graphite-950/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-200">
                    {sig.variable}
                  </td>
                  <td className="py-3 px-3 text-red-300 font-bold">
                    {sig.eventAValue} {sig.unit}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {sig.eventBValue} {sig.unit}
                  </td>
                  <td className="py-3 px-3 text-observation font-semibold">
                    {sig.delta > 0 ? `+${sig.delta}` : sig.delta} {sig.unit}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-graphite-950 rounded overflow-hidden border border-scientific-border">
                        <div
                          className={`h-full ${
                            sig.candidateDiscriminatingPower > 80
                              ? 'bg-amber-400'
                              : sig.candidateDiscriminatingPower > 50
                              ? 'bg-observation'
                              : 'bg-slate-600'
                          }`}
                          style={{ width: `${sig.candidateDiscriminatingPower}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-300">
                        {sig.candidateDiscriminatingPower}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-scientific-muted">
                    {sig.physicalContext}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scientific Wording Requirement & Disclaimer */}
        <div className="mt-4 p-3.5 bg-graphite-950 rounded border border-scientific-border flex items-start space-x-2.5 text-xs font-mono">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-slate-400 leading-relaxed">
            <strong className="text-slate-200">SCIENTIFIC METHODOLOGY NOTE:</strong> The identified metrics represent <span className="text-amber-300 font-semibold">"Candidate discriminating signals"</span> derived from multidimensional phase space separation. <strong className="text-slate-200">Do not claim these differences are causal.</strong> Thermodynamic state correlation does not establish hydrodynamic cause.
          </p>
        </div>
      </div>
    </div>
  );
};
