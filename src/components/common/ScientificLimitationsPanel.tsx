import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  Scale,
  FileText,
  CheckCircle2
} from 'lucide-react';

interface ScientificLimitationsPanelProps {
  className?: string;
}

export const ScientificLimitationsPanel: React.FC<ScientificLimitationsPanelProps> = ({
  className = '',
}) => {
  const limitations = [
    {
      title: 'Research Prototype Status',
      desc: 'PRAGYA is an experimental research framework developed to investigate convective predictability limits. It is NOT an operational weather forecasting system.'
    },
    {
      title: 'Simulated Data Boundary',
      desc: 'Demonstration values, parameters, and horizon times operate on synthetic demonstration datasets and cannot be interpreted as actual meteorological advisories.'
    },
    {
      title: 'Causation vs Statistical Contribution',
      desc: 'Model attention weights and candidate discriminating signals reflect phase space separation. State correlation does not establish hydrodynamic physical causality.'
    },
    {
      title: 'Predictability Horizon Validation Mandate',
      desc: 'The T-47m earliest defensible warning horizon represents a theoretical benchmark requiring rigorous blind validation against calibrated dual-polarization radar archives.'
    },
    {
      title: 'Statutory Warning Authority',
      desc: 'All official operational weather advisories, watches, and public warnings across India remain the sole statutory mandate of the India Meteorological Department (IMD) and National Disaster Management Authority (NDMA).'
    }
  ];

  return (
    <div className={`bg-scientific-card border-2 border-amber-500/50 rounded-lg p-5 font-mono text-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-scientific-border">
        <div className="p-2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
              SCIENTIFIC ETHICS & RESEARCH LIMITATIONS
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              MANDATORY NOTICE
            </span>
          </div>
          <p className="text-scientific-muted text-[11px]">
            Formal disclosure on prototype boundaries, methodology constraints, and jurisdictional authority.
          </p>
        </div>
      </div>

      {/* Grid of Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {limitations.map((lim, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-lg border border-scientific-border bg-graphite-950/60 space-y-1.5 ${
              idx === limitations.length - 1 ? 'md:col-span-2 border-amber-500/40 bg-amber-950/20' : ''
            }`}
          >
            <div className="flex items-center space-x-2 text-slate-200 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{lim.title}</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed pl-3.5">
              {lim.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Banner */}
      <div className="pt-2 border-t border-scientific-border flex items-center justify-between text-[10px] text-scientific-muted">
        <span>RESEARCH PROTOCOL: PRAGYA-GOV-2026</span>
        <span className="text-amber-400 font-bold">ZERO FALSE-PRECISION MANDATE</span>
      </div>
    </div>
  );
};
