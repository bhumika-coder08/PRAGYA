import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { AtmosphericFingerprint } from '../../types';
import { Info, BarChart2, Radio } from 'lucide-react';
import { SimulatedDataBadge } from './SimulatedDataBadge';

interface AtmosphericFingerprintChartProps {
  fingerprint: AtmosphericFingerprint;
  className?: string;
}

export const AtmosphericFingerprintChart: React.FC<AtmosphericFingerprintChartProps> = ({
  fingerprint,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'radar' | 'bars'>('radar');

  const radarData = fingerprint.parameters.map((p) => ({
    metric: p.label,
    value: p.normalized,
    raw: `${p.value} ${p.unit}`,
    contribution: p.modelContributionWeight,
    meaning: p.physicalMeaning,
  }));

  return (
    <div className={`bg-graphite-900 border border-scientific-border rounded-lg p-5 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-scientific-border pb-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono font-bold tracking-wider text-slate-200">
              ATMOSPHERIC FINGERPRINT — {fingerprint.cellId}
            </span>
            <SimulatedDataBadge size="sm" />
          </div>
          <p className="text-xs text-scientific-muted mt-0.5">
            Multivariate thermodynamic & kinematic state vector normalization.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center space-x-1 bg-graphite-950 p-1 rounded border border-scientific-border text-xs font-mono">
          <button
            onClick={() => setViewMode('radar')}
            className={`px-2.5 py-1 rounded flex items-center space-x-1.5 transition-colors ${
              viewMode === 'radar'
                ? 'bg-scientific-panel text-observation font-semibold border border-scientific-border'
                : 'text-scientific-muted hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>RADAR</span>
          </button>
          <button
            onClick={() => setViewMode('bars')}
            className={`px-2.5 py-1 rounded flex items-center space-x-1.5 transition-colors ${
              viewMode === 'bars'
                ? 'bg-scientific-panel text-predictability font-semibold border border-scientific-border'
                : 'text-scientific-muted hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>CONTRIBUTION BARS</span>
          </button>
        </div>
      </div>

      {/* Main visualization container */}
      <div className="h-64 w-full">
        {viewMode === 'radar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="75%">
              <PolarGrid stroke="#222f40" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="#334155"
                tick={{ fill: '#64748b', fontSize: 9 }}
              />
              <Radar
                name="Normalized Atmospheric State"
                dataKey="value"
                stroke="#38bdf8"
                fill="#38bdf8"
                fillOpacity={0.25}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={radarData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 95, bottom: 5 }}
            >
              <XAxis type="number" domain={[0, 100]} stroke="#334155" tick={{ fill: '#64748b', fontSize: 9 }} unit="%" />
              <YAxis
                type="category"
                dataKey="metric"
                stroke="#334155"
                tick={{ fill: '#cbd5e1', fontSize: 10, fontFamily: 'monospace' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-graphite-950 border border-scientific-border p-2.5 rounded shadow-lg text-xs font-mono">
                        <p className="font-bold text-slate-200">{data.metric}</p>
                        <p className="text-observation">Measured: {data.raw}</p>
                        <p className="text-predictability">Model Attention Weight: {data.contribution}%</p>
                        <p className="text-scientific-muted text-[10px] mt-1">{data.meaning}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="contribution" fill="#a855f7" radius={[0, 4, 4, 0]}>
                {radarData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.contribution > 18 ? '#a855f7' : '#0284c7'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Model Attention / Contribution Summary */}
      <div className="mt-4 pt-3 border-t border-scientific-border">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-slate-300 font-semibold uppercase">
            MODEL ATTENTION / CONTRIBUTION (TOP PREDICTORS)
          </span>
          <span className="text-[10px] text-predictability">
            TOTAL INFORMATIVE WEIGHT: 100%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          {fingerprint.parameters.slice(0, 4).map((p) => (
            <div key={p.key} className="bg-graphite-950 p-2 rounded border border-scientific-border/60">
              <span className="text-[10px] text-scientific-muted block truncate">{p.label}</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-slate-200 font-semibold tabular-nums">{p.value} {p.unit}</span>
                <span className="text-predictability font-bold">{p.modelContributionWeight}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mandatory Scientific Disclaimer */}
        <div className="mt-3 flex items-start space-x-2 text-[11px] text-scientific-muted bg-graphite-950/60 p-2.5 rounded border border-scientific-border/40">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-300">SCIENTIFIC INTEGRITY RULE:</strong> Model attention / contribution reflects feature attribution in the current neural phase-space projection. <span className="text-amber-300 font-semibold">Contribution does not imply physical causation.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
