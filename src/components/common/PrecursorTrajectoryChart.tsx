import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Activity, Clock, Compass, Layers, Info, CheckCircle2 } from 'lucide-react';
import { predictabilityEngine } from '../../services/predictabilityEngine';
import { PrecursorTrajectoryPoint } from '../../types';

interface PrecursorTrajectoryChartProps {
  className?: string;
  onSelectOffset?: (offset: number) => void;
  activeOffset?: number;
}

export const PrecursorTrajectoryChart: React.FC<PrecursorTrajectoryChartProps> = ({
  className = '',
  onSelectOffset,
  activeOffset
}) => {
  const [metricMode, setMetricMode] = useState<'predictability' | 'thermodynamic' | 'kinematic'>('predictability');

  const trajectoryData: PrecursorTrajectoryPoint[] = useMemo(() => {
    return predictabilityEngine.getPrecursorTrajectory();
  }, []);

  const chartData = useMemo(() => {
    return trajectoryData.map((d) => ({
      ...d,
      formattedTime: d.label,
      predictability: Math.round((1 - d.divergenceIndex) * 100),
      divergencePercent: Math.round(d.divergenceIndex * 100),
      cinAbs: Math.abs(d.cin),
    }));
  }, [trajectoryData]);

  // Custom Dark Scientific Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as PrecursorTrajectoryPoint & {
        formattedTime: string;
        predictability: number;
        divergencePercent: number;
        cinAbs: number;
      };

      return (
        <div className="bg-graphite-950 border border-scientific-border p-3 rounded-lg shadow-xl text-xs font-mono max-w-xs space-y-1.5 z-50">
          <div className="flex items-center justify-between border-b border-scientific-border pb-1">
            <span className="font-bold text-observation">{dataPoint.formattedTime}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-graphite-800 text-slate-300 border border-scientific-border">
              {dataPoint.regime}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] pt-1">
            <div className="text-scientific-muted">Predictability:</div>
            <div className="font-bold text-predictability text-right">{dataPoint.predictability}%</div>

            <div className="text-scientific-muted">Divergence Index:</div>
            <div className="font-bold text-amber-400 text-right">{dataPoint.divergenceIndex.toFixed(2)}</div>

            <div className="text-scientific-muted">Moisture Conv:</div>
            <div className="font-bold text-cyan-300 text-right">+{dataPoint.convergence} g/kg/h</div>

            <div className="text-scientific-muted">CAPE / CIN:</div>
            <div className="font-bold text-slate-200 text-right">
              {dataPoint.cape} / {dataPoint.cin} J/kg
            </div>

            <div className="text-scientific-muted">Vertical Updraft:</div>
            <div className="font-bold text-rose-400 text-right">+{dataPoint.verticalVelocity} m/s</div>

            <div className="text-scientific-muted">Lightning Flashes:</div>
            <div className="font-bold text-amber-300 text-right">{dataPoint.lightning} /min</div>
          </div>

          {dataPoint.minute === -47 && (
            <div className="pt-1 border-t border-emerald-500/30 text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>★ PREDICTABILITY HORIZON (Persistent 70%)</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-scientific-card border border-scientific-border rounded-lg p-5 flex flex-col space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-scientific-border pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-observation" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              Precursor Trajectory & Horizon Crossing (T-180m to T0)
            </h3>
          </div>
          <p className="text-xs font-mono text-scientific-muted mt-0.5">
            Phase space evolution tracing the emergence of predictability out of synoptic ambiguity.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center space-x-1 bg-graphite-950 p-1 rounded border border-scientific-border text-[11px] font-mono">
          <button
            onClick={() => setMetricMode('predictability')}
            className={`px-2.5 py-1 rounded transition-colors ${
              metricMode === 'predictability'
                ? 'bg-observation text-graphite-950 font-bold'
                : 'text-scientific-muted hover:text-slate-200'
            }`}
          >
            Predictability vs Divergence
          </button>
          <button
            onClick={() => setMetricMode('thermodynamic')}
            className={`px-2.5 py-1 rounded transition-colors ${
              metricMode === 'thermodynamic'
                ? 'bg-observation text-graphite-950 font-bold'
                : 'text-scientific-muted hover:text-slate-200'
            }`}
          >
            CAPE vs CIN Cap
          </button>
          <button
            onClick={() => setMetricMode('kinematic')}
            className={`px-2.5 py-1 rounded transition-colors ${
              metricMode === 'kinematic'
                ? 'bg-observation text-graphite-950 font-bold'
                : 'text-scientific-muted hover:text-slate-200'
            }`}
          >
            Convergence & Updraft
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 15, right: 30, left: 10, bottom: 5 }}
            onClick={(e) => {
              if (e && e.activePayload && e.activePayload[0] && onSelectOffset) {
                onSelectOffset(e.activePayload[0].payload.minute);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis
              dataKey="formattedTime"
              stroke="#737373"
              tick={{ fontSize: 11, fontFamily: 'monospace' }}
            />

            {/* Left Y Axis */}
            <YAxis
              yAxisId="left"
              stroke="#737373"
              domain={metricMode === 'thermodynamic' ? [1800, 3000] : [0, 100]}
              tick={{ fontSize: 11, fontFamily: 'monospace' }}
              label={{
                value:
                  metricMode === 'thermodynamic'
                    ? 'CAPE (J/kg)'
                    : metricMode === 'kinematic'
                    ? 'Updraft Velocity (m/s)'
                    : 'Index Score (%)',
                angle: -90,
                position: 'insideLeft',
                fill: '#737373',
                fontSize: 10,
                fontFamily: 'monospace'
              }}
            />

            {/* Right Y Axis for dual metrics */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#737373"
              domain={metricMode === 'thermodynamic' ? [0, 100] : [0, 100]}
              tick={{ fontSize: 11, fontFamily: 'monospace' }}
              label={{
                value: metricMode === 'thermodynamic' ? '|CIN| Lid (J/kg)' : 'Divergence (%)',
                angle: 90,
                position: 'insideRight',
                fill: '#737373',
                fontSize: 10,
                fontFamily: 'monospace'
              }}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }}
            />

            {/* Reference Line for Predictability Horizon at T-47m */}
            <ReferenceLine
              x="T-47"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4 4"
              yAxisId="left"
              label={{
                value: '★ HORIZON (T-47)',
                position: 'top',
                fill: '#10b981',
                fontSize: 10,
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
            />

            {/* Reference Line for 70% threshold in predictability mode */}
            {metricMode === 'predictability' && (
              <ReferenceLine
                y={70}
                stroke="#06b6d4"
                strokeDasharray="3 3"
                yAxisId="left"
                label={{
                  value: 'Threshold (70%)',
                  position: 'right',
                  fill: '#06b6d4',
                  fontSize: 9,
                  fontFamily: 'monospace'
                }}
              />
            )}

            {/* Metric Mode 1: Predictability vs Divergence */}
            {metricMode === 'predictability' && (
              <>
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="predictability"
                  name="Predictability Score (%)"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#06b6d4' }}
                  activeDot={{ r: 6, fill: '#38bdf8' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="divergencePercent"
                  name="Future Divergence Index (%)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#f59e0b' }}
                />
              </>
            )}

            {/* Metric Mode 2: Thermodynamic */}
            {metricMode === 'thermodynamic' && (
              <>
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="cape"
                  name="MUCAPE (J/kg)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#ef4444' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cinAbs"
                  name="|CIN| Lid (J/kg)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#38bdf8' }}
                />
              </>
            )}

            {/* Metric Mode 3: Kinematic */}
            {metricMode === 'kinematic' && (
              <>
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="verticalVelocity"
                  name="Updraft Max (m/s)"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#ec4899' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="divergencePercent"
                  name="Divergence Index (%)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#f59e0b' }}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory Milestone Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-scientific-border text-[11px] font-mono">
        <div className="bg-graphite-950 p-2 rounded border border-scientific-border/60">
          <div className="text-slate-400 font-bold">T-180m to T-90m</div>
          <div className="text-scientific-muted text-[10px] mt-0.5">
            Divergence high (0.88). Multiple attractor paths. Capped atmosphere.
          </div>
        </div>
        <div className="bg-graphite-950 p-2 rounded border border-scientific-border/60">
          <div className="text-amber-400 font-bold">T-60m (Emerging)</div>
          <div className="text-scientific-muted text-[10px] mt-0.5">
            CIN erodes below -35 J/kg. Convergence organizes along boundary.
          </div>
        </div>
        <div className="bg-emerald-950/40 p-2 rounded border border-emerald-500/40">
          <div className="text-emerald-400 font-bold">★ T-47m (Horizon)</div>
          <div className="text-emerald-300 text-[10px] mt-0.5 font-semibold">
            Persistent 70% threshold crossed. Earliest defensible warning.
          </div>
        </div>
        <div className="bg-graphite-950 p-2 rounded border border-scientific-border/60">
          <div className="text-rose-400 font-bold">T0 (Initiation)</div>
          <div className="text-scientific-muted text-[10px] mt-0.5">
            Updraft &gt;26 m/s. Cloudburst precipitation verified at surface.
          </div>
        </div>
      </div>
    </div>
  );
};
