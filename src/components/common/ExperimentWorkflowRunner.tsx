import React, { useState, useMemo } from 'react';
import {
  FlaskConical,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Compass,
  AlertTriangle,
  GitBranch,
  Info,
  Layers,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  Activity
} from 'lucide-react';
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
import { experimentEngine } from '../../services/experimentEngine';
import {
  HistoricalEventMetadata,
  ExperimentConfiguration,
  ExperimentRun
} from '../../types/observation';

interface ExperimentWorkflowRunnerProps {
  className?: string;
  onOpenProvenance?: (variable: string) => void;
}

export const ExperimentWorkflowRunner: React.FC<ExperimentWorkflowRunnerProps> = ({
  className = '',
  onOpenProvenance
}) => {
  const events = useMemo(() => experimentEngine.getHistoricalEvents(), []);
  const modelVersion = useMemo(() => experimentEngine.getActiveModelVersion(), []);
  const metricSpecs = useMemo(() => experimentEngine.getEvaluationMetricSpecifications(), []);

  const [selectedEventId, setSelectedEventId] = useState<string>(events[0].eventId);
  const [threshold, setThreshold] = useState<number>(70);
  const [persistenceSteps, setPersistenceSteps] = useState<number>(2);
  const [reconstructionMethod, setReconstructionMethod] = useState<
    'ENTROPY_BIFURCATION' | 'RADAR_PERSISTENCE' | 'THERMODYNAMIC_THRESHOLD'
  >('ENTROPY_BIFURCATION');

  const selectedEvent = events.find(e => e.eventId === selectedEventId) || events[0];

  // Execute initial reproducible experiment
  const [experimentRun, setExperimentRun] = useState<ExperimentRun>(() => {
    return experimentEngine.runReproducibleExperiment(events[0].eventId, {
      predictabilityThreshold: 70,
      persistenceStepsRequired: 2,
      dataSourcesIncluded: ['SATELLITE', 'RADAR', 'LIGHTNING', 'SURFACE_AWS', 'UPPER_AIR'],
      reconstructionMethod: 'ENTROPY_BIFURCATION'
    });
  });

  const handleRunExperiment = () => {
    const config: ExperimentConfiguration = {
      predictabilityThreshold: threshold,
      persistenceStepsRequired: persistenceSteps,
      dataSourcesIncluded: ['SATELLITE', 'RADAR', 'LIGHTNING', 'SURFACE_AWS', 'UPPER_AIR'],
      reconstructionMethod
    };
    const run = experimentEngine.runReproducibleExperiment(selectedEventId, config);
    setExperimentRun(run);
  };

  // Synthetic trajectory curve for the selected event
  const experimentTrajectoryData = useMemo(() => {
    const isNearMiss = selectedEvent.isNearMiss;
    return [
      { time: 'T-180', minute: -180, risk: 24, pred: 18, obsConf: 72, divergence: 0.88 },
      { time: 'T-120', minute: -120, risk: 36, pred: 28, obsConf: 78, divergence: 0.74 },
      { time: 'T-90',  minute: -90,  risk: 48, pred: 38, obsConf: 82, divergence: 0.62 },
      { time: 'T-60',  minute: -60,  risk: 62, pred: 52, obsConf: 85, divergence: 0.48 },
      { time: 'T-47',  minute: -47,  risk: isNearMiss ? 38 : 72, pred: isNearMiss ? 46 : 74, obsConf: 88, divergence: isNearMiss ? 0.68 : 0.28 },
      { time: 'T-30',  minute: -30,  risk: isNearMiss ? 32 : 82, pred: isNearMiss ? 42 : 86, obsConf: 91, divergence: isNearMiss ? 0.72 : 0.16 },
      { time: 'T-15',  minute: -15,  risk: isNearMiss ? 28 : 88, pred: isNearMiss ? 38 : 94, obsConf: 94, divergence: isNearMiss ? 0.76 : 0.08 },
      { time: 'T0',    minute: 0,    risk: isNearMiss ? 26 : 94, pred: isNearMiss ? 35 : 98, obsConf: 96, divergence: isNearMiss ? 0.80 : 0.03 }
    ];
  }, [selectedEvent]);

  return (
    <div className={`bg-scientific-card border border-scientific-border rounded-lg p-5 font-mono text-xs space-y-6 ${className}`}>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-scientific-border pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-observation/15 text-observation border border-observation/30">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
                PREDICTABILITY HORIZON EXPERIMENT DASHBOARD
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-observation/15 text-observation font-bold border border-observation/30">
                ACTIVE MODEL: {modelVersion.version}
              </span>
            </div>
            <p className="text-[11px] text-scientific-muted">
              End-to-end reproducible research workflow testing early horizon detection against historical convective onsets.
            </p>
          </div>
        </div>

        {/* Reproducible Re-Run Button */}
        <button
          onClick={handleRunExperiment}
          className="flex items-center space-x-2 px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-graphite-950 font-bold transition-all shadow-md shadow-amber-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RE-RUN EXPERIMENT</span>
        </button>
      </div>

      {/* Workflow Step 1 & 2: Event Selection & Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-graphite-950/70 p-4 rounded-lg border border-scientific-border">
        {/* Event Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-300 block uppercase">
            1. Target Historical Event
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full bg-graphite-900 border border-scientific-border text-slate-200 px-3 py-1.5 rounded focus:outline-none focus:border-observation text-xs"
          >
            {events.map((ev) => (
              <option key={ev.eventId} value={ev.eventId}>
                {ev.eventName} ({ev.date})
              </option>
            ))}
          </select>
          <span className="text-[10px] text-scientific-muted block">
            {selectedEvent.isNearMiss ? '⚠ Near-Miss Control Case' : '✓ Severe Genesis Event'}
          </span>
        </div>

        {/* Predictability Threshold Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 uppercase">2. Horizon Threshold</span>
            <span className="font-bold text-predictability">{threshold}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="90"
            step="5"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="w-full accent-predictability bg-graphite-800 h-1.5 rounded cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-scientific-muted">
            <span>50% (Lenient)</span>
            <span>70% (Standard)</span>
            <span>90% (Strict)</span>
          </div>
        </div>

        {/* Reconstruction Model */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-300 block uppercase">
            3. Reconstruction Model
          </label>
          <select
            value={reconstructionMethod}
            onChange={(e: any) => setReconstructionMethod(e.target.value)}
            className="w-full bg-graphite-900 border border-scientific-border text-slate-200 px-3 py-1.5 rounded focus:outline-none focus:border-observation text-xs"
          >
            <option value="ENTROPY_BIFURCATION">PRAGYA Entropy Bifurcation</option>
            <option value="RADAR_PERSISTENCE">Radar Echo Persistence Baseline</option>
            <option value="THERMODYNAMIC_THRESHOLD">Severe Index (CAPE×Shear) Baseline</option>
          </select>
          <span className="text-[10px] text-scientific-muted block">
            Temporal window: {selectedEvent.dataWindowStartUTC} to {selectedEvent.dataWindowEndUTC}
          </span>
        </div>
      </div>

      {/* Experiment Run Outcome Card */}
      <div className="bg-graphite-900 border border-scientific-border rounded-lg p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-scientific-border pb-2.5">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200 text-xs uppercase">
              EXPERIMENT EXECUTION RESULT: {experimentRun.experimentId}
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold">
            {experimentRun.result.status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-graphite-950 p-3 rounded border border-scientific-border">
            <span className="text-[10px] text-scientific-muted block">PREDICTABILITY HORIZON</span>
            <span className="text-base font-bold text-emerald-400 mt-0.5 block">
              {experimentRun.result.thresholdCrossingMinute !== null
                ? `T${experimentRun.result.thresholdCrossingMinute}m`
                : 'NOT REACHED'}
            </span>
          </div>
          <div className="bg-graphite-950 p-3 rounded border border-scientific-border">
            <span className="text-[10px] text-scientific-muted block">DEFENSIBLE LEAD TIME</span>
            <span className="text-base font-bold text-slate-100 mt-0.5 block">
              {experimentRun.result.leadTimeMinutes !== null
                ? `${experimentRun.result.leadTimeMinutes} Minutes`
                : '0 Minutes'}
            </span>
          </div>
          <div className="bg-graphite-950 p-3 rounded border border-scientific-border">
            <span className="text-[10px] text-scientific-muted block">OBSERVATION CONFIDENCE</span>
            <span className="text-base font-bold text-observation mt-0.5 block">
              {experimentRun.result.observationConfidenceAtCrossing}%
            </span>
          </div>
          <div className="bg-graphite-950 p-3 rounded border border-scientific-border">
            <span className="text-[10px] text-scientific-muted block">FUTURE DIVERGENCE (FDI)</span>
            <span className="text-base font-bold text-amber-400 mt-0.5 block">
              {experimentRun.result.divergenceAtCrossing}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-scientific-muted pt-1">
          {experimentRun.notes}
        </p>
      </div>

      {/* Multi-Metric Trajectory Graph */}
      <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-scientific-border pb-2.5">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-observation" />
            <h3 className="font-bold text-slate-200 uppercase text-xs">
              EXPERIMENT TRAJECTORY: RISK, PREDICTABILITY & DIVERGENCE
            </h3>
          </div>
          <div className="flex items-center space-x-3 text-[10px] text-scientific-muted">
            <span className="flex items-center space-x-1">
              <span className="w-3 h-0.5 bg-red-400" />
              <span>Risk %</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-0.5 bg-predictability" />
              <span>Predictability %</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-0.5 bg-amber-400" />
              <span>Divergence (x100)</span>
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={experimentTrajectoryData} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222f40" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} unit="%" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-graphite-950 border border-scientific-border p-2.5 rounded shadow-xl text-xs font-mono space-y-1">
                        <span className="font-bold text-slate-100 block">{d.time} Offset</span>
                        <div className="text-red-400">Event Risk: {d.risk}%</div>
                        <div className="text-predictability">Predictability: {d.pred}%</div>
                        <div className="text-amber-400">Divergence Index: {d.divergence}</div>
                        <div className="text-observation">Obs Confidence: {d.obsConf}%</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={threshold} stroke="#06b6d4" strokeDasharray="3 3" label={{ value: `Threshold (${threshold}%)`, fill: '#06b6d4', fontSize: 9, position: 'insideBottomRight' }} />
              <ReferenceLine x="T-47" stroke="#10b981" strokeDasharray="4 4" strokeWidth={2} label={{ value: '★ Horizon (T-47m)', fill: '#10b981', fontSize: 10, position: 'top' }} />

              <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="pred" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="obsConf" stroke="#38bdf8" strokeWidth={1.5} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Baseline Comparison & Evaluation Metric Specifications */}
      <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-scientific-border pb-2.5">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-slate-200 uppercase text-xs">
              SCIENTIFIC EVALUATION METRIC SPECIFICATIONS
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
            AWAITING VALIDATED COMPARISON
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {metricSpecs.map((m) => (
            <div key={m.abbreviation} className="bg-graphite-950 p-3.5 rounded border border-scientific-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">{m.name}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-graphite-900 border border-scientific-border text-observation font-bold">
                  {m.abbreviation}
                </span>
              </div>
              <div className="text-[10px] font-mono text-cyan-300 bg-graphite-900 px-2 py-1 rounded border border-scientific-border/40 truncate">
                {m.formula}
              </div>
              <p className="text-[11px] text-scientific-muted leading-relaxed">
                {m.description}
              </p>
              <div className="pt-1 text-[10px] text-amber-400 italic">
                {m.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
