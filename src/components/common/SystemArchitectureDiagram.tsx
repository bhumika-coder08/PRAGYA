import React from 'react';
import {
  Database,
  ArrowRight,
  Layers,
  Cpu,
  Activity,
  GitBranch,
  Shield,
  Eye,
  Radio,
  FileCode,
  Users,
  Compass
} from 'lucide-react';

export const SystemArchitectureDiagram: React.FC = () => {
  const pipelineStages = [
    {
      step: '01',
      title: 'DATA INGESTION',
      subtitle: 'Authoritative Sources',
      icon: Radio,
      items: ['IMD Radar & AWS', 'INSAT-3DR Geostationary', 'Copernicus ERA5', 'SRTM 30m Topography'],
      accent: 'border-cyan-500/40 text-cyan-300',
    },
    {
      step: '02',
      title: 'NORMALIZATION',
      subtitle: 'Strict Provenance Layer',
      icon: Layers,
      items: ['Unit Normalization', 'Spatiotemporal Alignment', 'Quality Flags (Valid/Missing)', 'availableAt >= observedAt'],
      accent: 'border-blue-500/40 text-blue-300',
    },
    {
      step: '03',
      title: 'PERSISTENCE',
      subtitle: 'Neon Serverless DB',
      icon: Database,
      items: ['Neon PostgreSQL', 'Prisma 7 Adapter-PG', '81 Seeded Research Obs', 'Zero Future Leakage'],
      accent: 'border-emerald-500/40 text-emerald-300',
    },
    {
      step: '04',
      title: 'FEATURE ENGINE',
      subtitle: 'Thermodynamics & Shear',
      icon: Cpu,
      items: ['CAPE & CIN Integration', 'Low-Level Mixing Ratio', '0-6km Bulk Wind Shear', 'Magnus-Tetens Dew Point'],
      accent: 'border-amber-500/40 text-amber-300',
    },
    {
      step: '05',
      title: 'INTELLIGENCE',
      subtitle: 'Predictability Engine',
      icon: Compass,
      items: ['Event Risk (Favorability)', 'Predictability (Constraint)', 'Observation Confidence', 'Predictability Horizon'],
      accent: 'border-purple-500/40 text-purple-300',
    },
    {
      step: '06',
      title: 'INTERFACES',
      subtitle: 'User Personas',
      icon: Users,
      items: ['Researcher (3D & Lab)', 'Authority Command Centre', 'Citizen Safety (Trilingual)', 'Open Geo Impact Map'],
      accent: 'border-observation/40 text-observation',
    },
  ];

  return (
    <div className="bg-graphite-950 border border-scientific-border rounded-lg p-5 font-mono text-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-scientific-border pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-observation" />
            <h3 className="font-bold text-slate-100 uppercase tracking-wider text-xs">
              END-TO-END RESEARCH ARCHITECTURE FLOW
            </h3>
          </div>
          <p className="text-[11px] text-scientific-muted mt-0.5">
            Scientific data transformation pipeline: from raw multi-sensor telemetry to decision-support and citizen safety.
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-graphite-900 border border-scientific-border text-slate-400">
          PROTOTYPE PIPELINE SPECIFICATION
        </span>
      </div>

      {/* Pipeline Stage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        {pipelineStages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.step}
              className={`p-3.5 rounded-lg bg-graphite-900/90 border ${stage.accent} flex flex-col justify-between space-y-3 relative group hover:border-slate-400 transition-colors`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-scientific-muted font-bold">{stage.step}</span>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-100 leading-tight">{stage.title}</h4>
                <span className="text-[10px] text-scientific-muted block mb-2">{stage.subtitle}</span>

                <ul className="space-y-1 text-[10px] text-slate-300">
                  {stage.items.map((item, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-slate-500">•</span>
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Architectural Guarantee Notes */}
      <div className="pt-3 border-t border-scientific-border grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] text-scientific-muted">
        <div>
          <span className="font-bold text-slate-300 block mb-0.5">STRICT TEMPORAL TIME-GATING:</span>
          <span>Guarantees availableAt &le; T_replay, mathematically eliminating future-data leakage.</span>
        </div>
        <div>
          <span className="font-bold text-slate-300 block mb-0.5">ORTHOGONAL SEPARATION:</span>
          <span>Event Risk, Predictability, and Observation Confidence are evaluated as separate quantities.</span>
        </div>
        <div>
          <span className="font-bold text-slate-300 block mb-0.5">ETHICAL SCIENTIFIC INTEGRITY:</span>
          <span>Zero fabricated accuracy claims. Un-trained machine learning architectures report NOT_TRAINED.</span>
        </div>
      </div>
    </div>
  );
};
