import React from 'react';
import {
  X,
  Database,
  Radio,
  Clock,
  ShieldCheck,
  Cpu,
  Layers,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { DataProvenance, QualityState } from '../../types/observation';

interface DataProvenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  variableName: string;
  provenance: DataProvenance;
}

export const DataProvenanceModal: React.FC<DataProvenanceModalProps> = ({
  isOpen,
  onClose,
  variableName,
  provenance,
}) => {
  if (!isOpen) return null;

  const getQualityBadge = (quality: QualityState) => {
    switch (quality) {
      case 'VERIFIED':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/50';
      case 'GOOD':
        return 'bg-observation/20 text-observation border-observation/40';
      case 'PARTIAL':
        return 'bg-amber-950 text-amber-300 border-amber-500/50';
      case 'LOW CONFIDENCE':
        return 'bg-orange-950 text-orange-300 border-orange-500/50';
      case 'MISSING':
      default:
        return 'bg-rose-950 text-rose-300 border-rose-500/50';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="data-provenance-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite-950/80 backdrop-blur-sm"
    >
      <div className="bg-graphite-900 border-2 border-scientific-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl font-mono text-xs animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-graphite-950 px-5 py-3.5 border-b border-scientific-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded bg-observation/15 text-observation border border-observation/30">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 id="data-provenance-title" className="font-bold text-slate-100 uppercase tracking-wider text-xs">
                DATA PROVENANCE INSPECTOR
              </h3>
              <span className="text-[10px] text-scientific-muted">
                Variable: <strong className="text-slate-200">{variableName}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-graphite-800 rounded transition-colors"
            title="Close Inspector"
            aria-label="Close Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Main Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Source */}
            <div className="bg-graphite-950 p-3 rounded-lg border border-scientific-border col-span-2">
              <span className="text-[10px] text-scientific-muted uppercase block">Authoritative Sensor Source</span>
              <span className="text-sm font-bold text-slate-100 mt-0.5 block">
                {provenance.source}
              </span>
            </div>

            {/* Platform */}
            <div className="bg-graphite-950 p-3 rounded-lg border border-scientific-border">
              <span className="text-[10px] text-scientific-muted uppercase block">Sensor Platform</span>
              <span className="text-xs font-semibold text-slate-200 mt-0.5 block truncate">
                {provenance.sensorPlatform}
              </span>
            </div>

            {/* Quality Flag */}
            <div className="bg-graphite-950 p-3 rounded-lg border border-scientific-border">
              <span className="text-[10px] text-scientific-muted uppercase block">Quality State</span>
              <div className="mt-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getQualityBadge(provenance.quality)}`}>
                  {provenance.quality}
                </span>
              </div>
            </div>

            {/* Classification */}
            <div className="bg-graphite-950 p-3 rounded-lg border border-scientific-border">
              <span className="text-[10px] text-scientific-muted uppercase block">Observation Type</span>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className={`w-2 h-2 rounded-full ${provenance.isObserved ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
                <span className="font-semibold text-slate-200">
                  {provenance.isObserved ? 'Direct Instrument Observation' : 'Derived Atmospheric Field'}
                </span>
              </div>
            </div>

            {/* Timestamp */}
            <div className="bg-graphite-950 p-3 rounded-lg border border-scientific-border">
              <span className="text-[10px] text-scientific-muted uppercase block">Data Timestamp</span>
              <span className="font-mono text-slate-200 mt-1 block">
                {provenance.timestamp.substring(11, 19)} UTC
              </span>
            </div>
          </div>

          {/* Derivation Method if applicable */}
          {provenance.derivationMethod && (
            <div className="bg-graphite-950 p-3 rounded-lg border border-scientific-border space-y-1">
              <div className="flex items-center space-x-1.5 text-cyan-300 font-semibold text-[11px]">
                <Cpu className="w-3.5 h-3.5" />
                <span>Derivation Algorithm / Method:</span>
              </div>
              <p className="text-scientific-muted leading-relaxed text-[11px]">
                {provenance.derivationMethod}
              </p>
            </div>
          )}

          {/* Calibration Note */}
          {provenance.calibrationNote && (
            <div className="bg-graphite-950 p-3 rounded-lg border border-scientific-border space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-300 font-semibold text-[11px]">
                <FileCheck className="w-3.5 h-3.5 text-observation" />
                <span>Calibration & Quality Control:</span>
              </div>
              <p className="text-scientific-muted leading-relaxed text-[11px]">
                {provenance.calibrationNote}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-graphite-950 px-5 py-3 border-t border-scientific-border flex items-center justify-between text-[10px] text-scientific-muted">
          <span>SCIENTIFIC METADATA AUDIT</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-graphite-800 hover:bg-graphite-700 text-slate-200 rounded font-bold transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
