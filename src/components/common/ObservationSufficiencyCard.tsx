import React from 'react';
import { predictabilityEngine } from '../../services/predictabilityEngine';
import { Radio, Eye, Activity, Zap, AlertTriangle, ShieldCheck, HelpCircle, Scan, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ObservationSufficiencyCardProps {
  minuteOffset?: number;
  className?: string;
  show3DLink?: boolean;
}

export const ObservationSufficiencyCard: React.FC<ObservationSufficiencyCardProps> = ({
  minuteOffset = -47,
  className = '',
  show3DLink = true,
}) => {
  const navigate = useNavigate();
  const assessment = predictabilityEngine.getObservationSufficiency(minuteOffset);
  const gap = assessment.mostInfluentialGap;

  const getStatusBadge = (status: 'AVAILABLE' | 'PARTIAL' | 'MISSING') => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'PARTIAL':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'MISSING':
        return 'bg-red-950 text-red-300 border-red-800';
    }
  };

  return (
    <div className={`bg-graphite-900 border border-scientific-border rounded-xl p-5 lg:p-6 font-mono text-xs ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-scientific-border pb-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-observation animate-pulse" />
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
              DO WE KNOW ENOUGH? — OBSERVATION SUFFICIENCY
            </h3>
            <span className="px-2 py-0.5 rounded bg-graphite-950 border border-scientific-border text-[9px] text-amber-400 font-bold">
              SIMULATED EXAMPLE
            </span>
          </div>
          <p className="text-[11px] text-scientific-muted">
            Assessing whether the physical observation network can constrain the forecast.
          </p>
        </div>

        {/* Observation Confidence Score */}
        <div className="flex items-center space-x-2 bg-graphite-950 px-3 py-1.5 rounded border border-scientific-border">
          <span className="text-scientific-muted">OBSERVATION CONFIDENCE:</span>
          <span className={`text-base font-bold tabular-nums ${assessment.overallConfidenceScore >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {assessment.overallConfidenceScore}%
          </span>
        </div>
      </div>

      {/* Observation-Limited Warning Banner */}
      <div className={`p-4 rounded-lg border mb-5 flex items-start space-x-3 ${
        assessment.overallConfidenceScore < 75
          ? 'bg-amber-950/20 border-amber-500/50 text-amber-300'
          : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
      }`}>
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block uppercase text-xs">
            {assessment.overallConfidenceScore < 75 ? 'OBSERVATION-LIMITED WARNING' : 'OBSERVATIONAL BASELINE ADEQUATE'}
          </span>
          <p className="text-slate-300 text-xs mt-0.5">
            "{assessment.limitingHeadline}"
          </p>
        </div>
      </div>

      {/* 6 Sensor Platforms Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {assessment.items.map((item) => (
          <div
            key={item.id}
            className="bg-graphite-950 p-3 rounded-lg border border-scientific-border/80 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-200 truncate">{item.sourceName}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-[10px] text-scientific-muted leading-tight mb-2">
                {item.limitingFactorNote}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-scientific-border/40 text-[9px] text-slate-400">
              <span>Cadence: {item.cadence}</span>
              <span>Weight: {item.informationContributionWeight}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* =================================================================== */}
      {/* MOST INFLUENTIAL OBSERVATION GAP (SECTION 13) */}
      {/* =================================================================== */}
      <div className="bg-graphite-950 border border-amber-500/40 rounded-lg p-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-scientific-border pb-2">
          <div className="flex items-center space-x-2 text-amber-400">
            <Scan className="w-4 h-4" />
            <span className="font-bold text-xs uppercase">
              MOST INFLUENTIAL OBSERVATION GAP
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
            {gap.estimatedSensitivity} SENSITIVITY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div>
            <span className="text-scientific-muted text-[10px] block">VARIABLE:</span>
            <span className="font-bold text-slate-100">{gap.variable}</span>
          </div>
          <div>
            <span className="text-scientific-muted text-[10px] block">ALTITUDE RANGE:</span>
            <span className="font-bold text-observation">{gap.altitudeRangeKm[0]}–{gap.altitudeRangeKm[1]} km AGL</span>
          </div>
          <div>
            <span className="text-scientific-muted text-[10px] block">COVERAGE STATUS:</span>
            <span className="font-semibold text-amber-300">{gap.coverageStatus}</span>
          </div>
        </div>

        <div className="p-2.5 rounded bg-graphite-900 border border-scientific-border/70 text-[11px] text-slate-300">
          <span className="text-amber-400 font-bold mr-1">Candidate high-information observation region:</span>
          {gap.recommendation}
        </div>

        {show3DLink && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => navigate('/app/digital-twin')}
              className="px-3 py-1 bg-graphite-900 hover:bg-graphite-850 text-observation border border-observation/40 rounded text-[11px] font-bold flex items-center space-x-1.5 transition-colors"
            >
              <span>HIGHLIGHT VOLUME IN 3D TWIN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
