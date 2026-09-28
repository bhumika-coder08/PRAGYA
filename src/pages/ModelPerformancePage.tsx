import React, { useState, useEffect } from 'react';
import { atmosphericService } from '../services/atmosphericService';
import { predictabilityEngine } from '../services/predictabilityEngine';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';
import { BaselineComparisonSlot } from '../types';
import { apiClient } from '../services/apiClient';
import {
  BarChart3,
  Clock,
  Shield,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileText,
  Lock,
  GitBranch,
  Layers,
  Sparkles,
  ExternalLink,
  Cpu
} from 'lucide-react';

export const ModelPerformancePage: React.FC = () => {
  const metrics = atmosphericService.getModelMetricPlaceholders();
  const baselineSlots: BaselineComparisonSlot[] = predictabilityEngine.getBaselineComparisons();
  const [serverModels, setServerModels] = useState<any[]>([]);

  useEffect(() => {
    apiClient.getModels().then((data) => {
      if (data && data.models) {
        setServerModels(data.models);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-graphite-900 border border-scientific-border p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-predictability/15 border border-predictability/40 text-predictability-light">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-mono text-base font-bold text-slate-100">
                RESEARCH VALIDATION & TRANSPARENT BASELINES
              </h2>
              <SimulatedDataBadge size="sm" />
            </div>
            <p className="text-xs text-scientific-muted font-mono">
              Evaluation architecture prepared for rigorous verification against operational meteorological ground truth.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-amber-400 px-2.5 py-1 rounded bg-amber-950/40 border border-amber-500/40 font-bold">
          AWAITING VALIDATED DATASET
        </span>
      </div>

      {/* Mandatory Scientific Integrity Proclamation */}
      <div className="bg-graphite-900 border-l-4 border-l-amber-500 border-r border-t border-b border-scientific-border p-5 rounded-lg flex items-start space-x-4">
        <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5 font-mono">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-100 tracking-wide">
              "AWAITING VALIDATED DATASET — NO FABRICATED ACCURACY CLAIMS"
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              SCIENTIFIC HONESTY MANDATE
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
            In strict compliance with meteorological research ethics, PRAGYA does not publish synthetic accuracy claims (such as 95% or 98%), fabricated hit rates, or unverified statistical scores. Un-trained machine learning architectures report <code className="text-amber-300">NOT_TRAINED</code>. The verification framework below specifies the formal baseline comparison slots and evaluation protocols that will be run during empirical retrospective blind trials over calibrated Doppler radar archives.
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] text-scientific-muted">
            <span>PLANNED VALIDATION RUN: PHASE II EXPERIMENTAL RETROSPECTIVE</span>
            <span>•</span>
            <span className="text-observation">STANDARDS: WMO-TD-NO.1023 CONVECTIVE NOWCASTING</span>
            <span>•</span>
            <span className="text-emerald-400">HARNESS: READY FOR GROUND TRUTH INGESTION</span>
          </div>
        </div>
      </div>

      {/* Server Baseline Models (Persistence, Threshold Rule, ML Interface) */}
      {serverModels.length > 0 && (
        <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5 font-mono">
          <div className="flex items-center justify-between border-b border-scientific-border pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100 uppercase">
                TRANSPARENT SCIENTIFIC BASELINES & ARCHITECTURES
              </h3>
            </div>
            <span className="text-[10px] text-scientific-muted">
              Live Server Models from /api/models
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {serverModels.map((m) => (
              <div key={m.name} className="p-4 rounded-lg bg-graphite-950 border border-scientific-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-scientific-muted">{m.type}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${
                    m.status === 'HEURISTIC_BASELINE'
                      ? 'bg-blue-950 text-blue-300 border-blue-500/40'
                      : m.status === 'NOT_TRAINED'
                      ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-100">{m.name}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{m.description}</p>
                <div className="text-[10px] text-scientific-muted pt-2 border-t border-scientific-border/40">
                  Version: <span className="text-slate-300">{m.version}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Baseline Comparison Slots */}
      <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-scientific-border pb-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-observation" />
              <h3 className="font-mono text-sm font-bold text-slate-100 uppercase">
                RESEARCH BASELINE COMPARISON SLOTS
              </h3>
            </div>
            <p className="text-xs text-scientific-muted font-mono mt-0.5">
              Targeted comparative evaluation against operational persistence, classical index thresholding, and modern ML.
            </p>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-graphite-950 border border-scientific-border text-slate-400">
            4 ARCHITECTURAL SLOTS PREPARED
          </span>
        </div>

        {/* Baseline Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {baselineSlots.map((slot) => {
            const isPragya = slot.type === 'PRAGYA';
            return (
              <div
                key={slot.id}
                className={`p-4 rounded-lg border font-mono flex flex-col justify-between ${
                  isPragya
                    ? 'bg-scientific-panel border-observation ring-1 ring-observation/40'
                    : 'bg-graphite-950 border-scientific-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-scientific-muted uppercase">{slot.type}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${
                        slot.status === 'RESEARCH_PROTOTYPE'
                          ? 'bg-observation/20 text-observation border-observation/40'
                          : slot.status === 'BENCHMARK_SPECIFIED'
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-graphite-900 text-slate-500 border-scientific-border'
                      }`}
                    >
                      {slot.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 mb-2 leading-snug">
                    {slot.name}
                  </h4>

                  <p className="text-[11px] text-scientific-muted leading-relaxed mb-3">
                    {slot.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-scientific-border text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-scientific-muted">Lead Time:</span>
                    <span className="text-slate-200 font-semibold">{slot.leadTimeExpected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-scientific-muted">Brier Score:</span>
                    <span className="text-amber-400/90 italic">{slot.brierScoreExpected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-scientific-muted">CSI Benchmark:</span>
                    <span className="text-amber-400/90 italic">{slot.csiExpected}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prepared Evaluation Metric Specification Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((item) => (
          <div
            key={item.id}
            className="bg-graphite-900 border border-scientific-border rounded-lg p-5 font-mono text-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-scientific-border mb-3">
                <span className="text-[10px] text-scientific-muted uppercase tracking-wider">
                  {item.category} METRIC
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-graphite-950 text-amber-400 border border-scientific-border font-bold">
                  {item.abbreviation}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-100 mb-2">
                {item.metric}
              </h4>

              {/* Status display */}
              <div className="bg-graphite-950 p-3 rounded border border-scientific-border/80 my-3 text-center">
                <span className="text-xs text-amber-400 font-bold block mb-1">
                  Awaiting validated experimental results.
                </span>
                <span className="text-[10px] text-scientific-muted">
                  Formal blind verification in progress.
                </span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="text-scientific-muted block text-[10px]">
                    MATHEMATICAL DEFINITION:
                  </span>
                  <span className="text-slate-300 italic">
                    {item.mathematicalDefinition}
                  </span>
                </div>

                <div>
                  <span className="text-scientific-muted block text-[10px]">
                    TARGET BENCHMARK:
                  </span>
                  <span className="text-observation font-semibold">
                    {item.targetBenchmark}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-scientific-border/60 text-[10px] text-scientific-muted">
              <span className="text-slate-400 block mb-0.5">GROUND TRUTH REQUIREMENT:</span>
              <span className="text-slate-500 leading-tight block">
                {item.validationDatasetRequirement}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Methodological Validation Rigor Note */}
      <div className="bg-graphite-900 border border-scientific-border p-5 rounded-lg font-mono text-xs text-scientific-muted space-y-2">
        <span className="text-slate-200 font-bold uppercase block">
          METHODOLOGICAL VALIDATION RIGOR & CAUSAL INTEGRITY:
        </span>
        <p className="leading-relaxed text-slate-400">
          All validation experiments strictly enforce causal ordering: no radar echo, lightning flash, or ground gauge observation recorded after time T is ever accessible to the feature extractor at or prior to time T. PRAGYA specifically benchmarks the earliest defensible horizon against operational persistence and optical-flow advection baselines under rigorous blind evaluation.
        </p>
      </div>
    </div>
  );
};
