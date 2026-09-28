import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtmosphere } from '../context/AtmosphericContext';
import { atmosphericService } from '../services/atmosphericService';
import { predictabilityEngine } from '../services/predictabilityEngine';
import { FutureCategory, EnsembleFuture } from '../types';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';
import {
  GitBranch,
  Layers,
  CloudRain,
  Flame,
  Sun,
  Zap,
  Filter,
  BarChart2,
  AlertTriangle,
  Info,
  Box,
  Compass,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const FutureEnsemblesPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCell } = useAtmosphere();
  const allFutures = atmosphericService.getEnsembleFutures(selectedCell.id);

  const [activeCategory, setActiveCategory] = useState<FutureCategory | 'ALL'>('ALL');
  const [selectedFuture, setSelectedFuture] = useState<EnsembleFuture>(allFutures[7] || allFutures[0]);
  const [activeMultiverseBranch, setActiveMultiverseBranch] = useState<FutureCategory>('Extreme Rainfall');

  const filteredFutures =
    activeCategory === 'ALL'
      ? allFutures
      : allFutures.filter((f) => f.category === activeCategory);

  // Distribution counts across the 20 members
  const categoryCounts: Record<FutureCategory, number> = {
    'Dissipation': allFutures.filter((f) => f.category === 'Dissipation').length,
    'Ordinary Convection': allFutures.filter((f) => f.category === 'Ordinary Convection').length,
    'Severe Thunderstorm': allFutures.filter((f) => f.category === 'Severe Thunderstorm').length,
    'Extreme Rainfall': allFutures.filter((f) => f.category === 'Extreme Rainfall').length,
  };

  const totalMembers = allFutures.length || 20;

  const distributionChartData = [
    { category: 'Dissipation', count: categoryCounts['Dissipation'], percentage: Math.round((categoryCounts['Dissipation'] / totalMembers) * 100), color: '#94a3b8' },
    { category: 'Ordinary Convection', count: categoryCounts['Ordinary Convection'], percentage: Math.round((categoryCounts['Ordinary Convection'] / totalMembers) * 100), color: '#38bdf8' },
    { category: 'Severe Thunderstorm', count: categoryCounts['Severe Thunderstorm'], percentage: Math.round((categoryCounts['Severe Thunderstorm'] / totalMembers) * 100), color: '#f59e0b' },
    { category: 'Extreme Rainfall', count: categoryCounts['Extreme Rainfall'], percentage: Math.round((categoryCounts['Extreme Rainfall'] / totalMembers) * 100), color: '#ef4444' },
  ];

  const multiverseBranchesMap: Record<FutureCategory, {
    category: FutureCategory;
    title: string;
    description: string;
    peakRain: string;
    updraft: string;
    divergencePoint: string;
    color: string;
    badgeStyle: string;
  }> = {
    'Dissipation': {
      category: 'Dissipation',
      title: 'Branch A: Synoptic Dissipation',
      description: 'Mid-tropospheric dry slot (700-500 hPa) entrains into updraft flank. Convection rapidly collapses into benign stratocumulus anvil.',
      peakRain: '1.2 mm/hr',
      updraft: '3.2 m/s',
      divergencePoint: 'T+15m',
      color: 'border-slate-600 bg-slate-950/40 text-slate-300',
      badgeStyle: 'bg-slate-800 text-slate-300 border-slate-700'
    },
    'Ordinary Convection': {
      category: 'Ordinary Convection',
      title: 'Branch B: Pulse Single-Cell Showers',
      description: 'Localized thermal overcomes CIN but lacks vertical shear. Rapid precipitation loading cuts off inflow within 30 minutes.',
      peakRain: '18.4 mm/hr',
      updraft: '11.8 m/s',
      divergencePoint: 'T+25m',
      color: 'border-sky-700 bg-sky-950/40 text-sky-300',
      badgeStyle: 'bg-sky-950 text-sky-300 border-sky-800'
    },
    'Severe Thunderstorm': {
      category: 'Severe Thunderstorm',
      title: 'Branch C: Organized Multicell Cluster',
      description: 'Moderate 0-6 km shear (18 m/s) organizes gust front, triggering new updrafts along cold pool leading edge with localized hail.',
      peakRain: '68.0 mm/hr',
      updraft: '26.4 m/s',
      divergencePoint: 'T+40m',
      color: 'border-amber-700 bg-amber-950/40 text-amber-300',
      badgeStyle: 'bg-amber-950 text-amber-300 border-amber-800'
    },
    'Extreme Rainfall': {
      category: 'Extreme Rainfall',
      title: 'Branch D: Stationary Back-Building Supercell (Cloudburst)',
      description: 'Orographic barrier anchors boundary convergence line. Continuous train of high-efficiency convective cores producing catastrophic localized deluges.',
      peakRain: '142.5 mm/hr',
      updraft: '38.6 m/s',
      divergencePoint: 'T+47m',
      color: 'border-rose-700 bg-rose-950/40 text-rose-300',
      badgeStyle: 'bg-rose-950 text-rose-300 border-rose-800'
    }
  };

  const multiverseBranches = multiverseBranchesMap[activeMultiverseBranch];

  const getCategoryBadge = (category: FutureCategory) => {
    switch (category) {
      case 'Dissipation':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'Ordinary Convection':
        return 'bg-sky-950 text-sky-300 border-sky-800';
      case 'Severe Thunderstorm':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'Extreme Rainfall':
        return 'bg-rose-950 text-rose-300 border-rose-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-graphite-900 border border-scientific-border p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-predictability/15 border border-predictability/40 text-predictability-light">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-mono text-base font-bold text-slate-100">
                ATMOSPHERIC MULTIVERSE & 20-MEMBER ENSEMBLE CLUSTERING
              </h2>
              <SimulatedDataBadge size="sm" />
            </div>
            <p className="text-xs text-scientific-muted font-mono">
              20 deterministic super-ensemble trajectories representing competing dynamical phase space attractors
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-2.5 py-1 rounded bg-graphite-950 border border-scientific-border text-scientific-muted">
            <span>ENSEMBLE MEMBERS: </span>
            <span className="text-observation font-bold">20 DETERMINISTIC RUNS</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FUTURE DIVERGENCE INDEX & MULTIVERSE BRANCH SELECTOR */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Future Divergence Index Diagnostic */}
        <div className="lg:col-span-5 bg-graphite-900 border border-scientific-border rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-scientific-border mb-3">
              <span className="text-xs font-mono font-bold text-observation tracking-wider uppercase">
                Future Divergence Index (FDI)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-graphite-950 border border-scientific-border text-slate-400">
                EXPERIMENTAL METRIC
              </span>
            </div>

            <div className="flex items-baseline space-x-3 my-2">
              <div className="text-3xl font-mono font-bold text-slate-100">
                0.88 <span className="text-xs font-normal text-scientific-muted">→</span> 0.28
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                COLLAPSING TO ATTRACTOR
              </span>
            </div>

            <p className="text-xs font-mono text-scientific-muted leading-relaxed">
              Future Divergence Index quantifies state variance across ensemble trajectories. Early in development (T-180m), FDI is high (0.88), indicating multiple plausible futures. As the predictability horizon is reached (T-47m), FDI drops sharply (0.28) as the system collapses into the extreme attractor.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-scientific-border text-xs font-mono space-y-1">
            <div className="flex justify-between text-scientific-muted">
              <span>Synoptic Ambiguity (T-180m):</span>
              <span className="text-slate-200">0.88 (High Uncertainty)</span>
            </div>
            <div className="flex justify-between text-scientific-muted">
              <span>Pre-Convective Stage (T-60m):</span>
              <span className="text-amber-400">0.54 (Branching)</span>
            </div>
            <div className="flex justify-between text-scientific-muted">
              <span>Horizon Crossing (T-47m):</span>
              <span className="text-emerald-400 font-bold">0.28 (Deterministic Lock)</span>
            </div>
          </div>
        </div>

        {/* Right: Atmospheric Multiverse 4-Branch Explorer */}
        <div className="lg:col-span-7 bg-graphite-900 border border-scientific-border rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between pb-2 border-b border-scientific-border mb-3 gap-2">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-predictability" />
                <span className="text-xs font-mono font-bold text-slate-100 uppercase">
                  Atmospheric Multiverse: 4 Dominant Branches
                </span>
              </div>

              {/* Branch Selector Tabs */}
              <div className="flex items-center space-x-1 bg-graphite-950 p-1 rounded border border-scientific-border text-[11px] font-mono">
                {(['Dissipation', 'Ordinary Convection', 'Severe Thunderstorm', 'Extreme Rainfall'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveMultiverseBranch(cat)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      activeMultiverseBranch === cat
                        ? 'bg-observation text-graphite-950 font-bold'
                        : 'text-scientific-muted hover:text-slate-200'
                    }`}
                  >
                    {cat.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Branch Detail Card */}
            <div className={`p-4 rounded-lg border ${multiverseBranches.color} space-y-2 mt-2`}>
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold">{multiverseBranches.title}</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${multiverseBranches.badgeStyle}`}>
                  {multiverseBranches.category}
                </span>
              </div>
              <p className="text-xs font-mono leading-relaxed opacity-90">
                {multiverseBranches.description}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono border-t border-scientific-border/40">
                <div>
                  <span className="text-scientific-muted block">Peak Rain:</span>
                  <span className="font-bold text-slate-100">{multiverseBranches.peakRain}</span>
                </div>
                <div>
                  <span className="text-scientific-muted block">Updraft Max:</span>
                  <span className="font-bold text-slate-100">{multiverseBranches.updraft}</span>
                </div>
                <div>
                  <span className="text-scientific-muted block">Bifurcation Point:</span>
                  <span className="font-bold text-slate-100">{multiverseBranches.divergencePoint}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-scientific-border flex items-center justify-between">
            <span className="text-xs font-mono text-scientific-muted">
              Inspect full 3D atmospheric column for this branch:
            </span>
            <button
              onClick={() => navigate('/app/digital-twin')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-predictability/20 hover:bg-predictability/30 text-predictability-light border border-predictability/40 text-xs font-mono transition-colors"
            >
              <Box className="w-3.5 h-3.5" />
              <span>EXPLORE IN 3D TWIN</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODEL ENSEMBLE DISTRIBUTION PANEL */}
      {/* ===================================================================== */}
      <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-scientific-border pb-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-observation" />
              <h3 className="font-mono text-sm font-bold text-slate-100 uppercase">
                20-MEMBER ENSEMBLE PROBABILITY DENSITY
              </h3>
            </div>
            <p className="text-xs text-scientific-muted font-mono">
              Aggregated probability mass across 20 deterministic simulated trajectories.
            </p>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-graphite-950 border border-scientific-border text-slate-400">
            ENSEMBLE: PRAGYA-ENS-20-DETERMINISTIC
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Bar Chart Visualization */}
          <div className="lg:col-span-7 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionChartData} layout="vertical" margin={{ left: 130, right: 30, top: 10, bottom: 10 }}>
                <XAxis type="number" domain={[0, 50]} stroke="#334155" unit="%" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis type="category" dataKey="category" stroke="#334155" tick={{ fill: '#cbd5e1', fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-graphite-950 border border-scientific-border p-2 rounded text-xs font-mono">
                          <p className="font-bold text-slate-100">{data.category}</p>
                          <p className="text-observation">Probability Mass: {data.percentage}%</p>
                          <p className="text-scientific-muted">Members: {data.count} / 20</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                  {distributionChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Metric Summary Blocks */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 font-mono text-xs">
            {distributionChartData.map((d) => (
              <div key={d.category} className="bg-graphite-950 p-3 rounded border border-scientific-border">
                <span className="text-[10px] text-scientific-muted block truncate">{d.category}</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-base font-bold text-slate-100">{d.percentage}%</span>
                  <span className="text-[10px] text-slate-400">{d.count} of 20</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 20 DETERMINISTIC ENSEMBLE CARDS WITH CATEGORY FILTER */}
      {/* ===================================================================== */}
      <div>
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-1.5 font-mono text-xs bg-graphite-900 p-1 rounded border border-scientific-border">
            <span className="px-2 text-scientific-muted flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>FILTER:</span>
            </span>
            {(['ALL', 'Dissipation', 'Ordinary Convection', 'Severe Thunderstorm', 'Extreme Rainfall'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeCategory === cat
                      ? 'bg-scientific-panel text-observation font-bold border border-scientific-border'
                      : 'text-scientific-muted hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <span className="text-xs font-mono text-scientific-muted">
            SHOWING {filteredFutures.length} OF 20 DETERMINISTIC TRAJECTORIES
          </span>
        </div>

        {/* 20 Ensemble Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredFutures.map((future) => {
            const isSelected = selectedFuture.id === future.id;

            return (
              <div
                key={future.id}
                onClick={() => setSelectedFuture(future)}
                className={`p-4 rounded-lg border font-mono transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-scientific-panel border-observation ring-1 ring-observation/60 shadow-lg'
                    : 'bg-graphite-900 border-scientific-border hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">{future.memberId}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getCategoryBadge(future.category)}`}>
                      {future.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-scientific-muted line-clamp-2 mb-3 leading-snug">
                    {future.description}
                  </p>
                </div>

                {/* Key parameters */}
                <div className="space-y-1.5 pt-2 border-t border-scientific-border/80 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-scientific-muted">Probability:</span>
                    <span className="text-observation font-semibold">{future.probability}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-scientific-muted">Predictability:</span>
                    <span className="text-predictability font-semibold">{future.predictabilityScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-scientific-muted">Peak Rain:</span>
                    <span className="text-slate-200 font-semibold">{future.peakRainfallRate} mm/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-scientific-muted">Updraft Max:</span>
                    <span className="text-rose-400 font-semibold">{future.maxVerticalVelocity} m/s</span>
                  </div>
                </div>

                {/* Footer flag */}
                <div className="mt-3 pt-2 border-t border-scientific-border/40 flex items-center justify-between text-[10px] text-slate-500">
                  <span>DIVERGES: T+{future.divergencePointMin}m</span>
                  <span>SIMULATED</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
