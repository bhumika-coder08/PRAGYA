import React, { useState, useEffect } from 'react';
import {
  Layers,
  Lock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Info
} from 'lucide-react';
import { replayClock } from '../../services/replayClockService';

interface DataAvailabilityMatrixProps {
  className?: string;
  onSelectTimestep?: (offset: number) => void;
}

export const DataAvailabilityMatrix: React.FC<DataAvailabilityMatrixProps> = ({
  className = '',
  onSelectTimestep
}) => {
  const [currentMinute, setCurrentMinute] = useState(replayClock.getCurrentMinute());

  useEffect(() => {
    const unsub = replayClock.subscribe((min) => setCurrentMinute(min));
    return () => unsub();
  }, []);

  const timesteps = [
    { label: 'T-180', minute: -180 },
    { label: 'T-120', minute: -120 },
    { label: 'T-60',  minute: -60 },
    { label: 'T-30',  minute: -30 },
    { label: 'T0',    minute: 0 }
  ];

  const platforms = [
    { id: 'satellite', name: 'INSAT-3DR Satellite' },
    { id: 'radar',     name: 'Doppler Weather Radar' },
    { id: 'lightning', name: 'Lightning Detection' },
    { id: 'surface',   name: 'Surface AWS Network' },
    { id: 'upper air', name: 'Upper-Air Sounding' },
    { id: 'nwp',       name: 'NCUM-R 4km NWP' }
  ];

  const getStatusBadge = (status: 'AVAILABLE' | 'PARTIAL' | 'MISSING' | 'LOCKED') => {
    switch (status) {
      case 'AVAILABLE':
        return {
          icon: CheckCircle2,
          text: 'AVAILABLE',
          style: 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
        };
      case 'PARTIAL':
        return {
          icon: AlertTriangle,
          text: 'PARTIAL',
          style: 'bg-amber-950/60 border-amber-500/50 text-amber-300'
        };
      case 'MISSING':
        return {
          icon: XCircle,
          text: 'MISSING',
          style: 'bg-rose-950/60 border-rose-500/50 text-rose-300'
        };
      case 'LOCKED':
      default:
        return {
          icon: Lock,
          text: 'LOCKED',
          style: 'bg-graphite-950/80 border-slate-700/60 text-slate-500'
        };
    }
  };

  return (
    <div className={`bg-scientific-card border border-scientific-border rounded-lg p-5 font-mono text-xs flex flex-col space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-scientific-border pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded bg-observation/15 text-observation border border-observation/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
              MULTI-TIER DATA AVAILABILITY MATRIX
            </h3>
            <p className="text-[11px] text-scientific-muted">
              Temporal availability and causal time-locking synchronized to ReplayClock.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-scientific-muted">REPLAY CLOCK:</span>
          <span className="px-2.5 py-0.5 rounded bg-observation/20 text-observation font-bold border border-observation/40">
            {currentMinute === 0 ? 'T0 (Initiation)' : `T${currentMinute}m`}
          </span>
        </div>
      </div>

      {/* 2D Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-b border-scientific-border text-[11px] text-scientific-muted">
              <th className="text-left py-2.5 px-3 font-semibold uppercase">Sensor Tier</th>
              {timesteps.map((ts) => {
                const isCurrent = currentMinute === ts.minute;
                return (
                  <th
                    key={ts.label}
                    onClick={() => {
                      replayClock.setTime(ts.minute);
                      if (onSelectTimestep) onSelectTimestep(ts.minute);
                    }}
                    className={`py-2.5 px-3 font-bold cursor-pointer transition-colors ${
                      isCurrent
                        ? 'text-observation bg-observation/10 border-b-2 border-b-observation'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    title={`Jump ReplayClock to ${ts.label}`}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>{ts.label}</span>
                      {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-observation" />}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-scientific-border/40 text-[10px]">
            {platforms.map((plat) => (
              <tr key={plat.id} className="hover:bg-graphite-950/40 transition-colors">
                <td className="text-left py-3 px-3 font-semibold text-slate-200 whitespace-nowrap">
                  {plat.name}
                </td>
                {timesteps.map((ts) => {
                  const state = replayClock.getPlatformState(plat.id, ts.minute);
                  const badge = getStatusBadge(state);
                  const Icon = badge.icon;
                  const isCurrentCol = currentMinute === ts.minute;

                  return (
                    <td
                      key={ts.label}
                      className={`py-2.5 px-2 ${isCurrentCol ? 'bg-observation/5' : ''}`}
                    >
                      <div
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded border ${badge.style}`}
                        title={`${plat.name} at ${ts.label}: ${badge.text}`}
                      >
                        <Icon className="w-3 h-3 shrink-0" />
                        <span className="font-semibold tracking-wide">{badge.text}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Explanatory Callout */}
      <div className="p-3 bg-graphite-950 rounded border border-scientific-border flex items-start space-x-2.5 text-[11px] text-scientific-muted">
        <Info className="w-4 h-4 text-observation shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Strict Causal Locking Rule:</strong> Cells marked{' '}
          <strong className="text-slate-400">LOCKED</strong> exist in the historical archive but are strictly in the future relative to the active ReplayClock ({currentMinute === 0 ? 'T0' : `T${currentMinute}m`}). The central architecture physically rejects retrieval of locked data to guarantee zero predictive leakage.
        </p>
      </div>
    </div>
  );
};
