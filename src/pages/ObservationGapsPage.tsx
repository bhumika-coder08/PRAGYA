import React, { useState } from 'react';
import { atmosphericService } from '../services/atmosphericService';
import { ObservationGap } from '../types';
import { AtmosphericScene } from '../components/three/AtmosphericScene';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';
import {
  EyeOff,
  AlertTriangle,
  Layers,
  HelpCircle,
  Scan,
  Compass,
  ArrowRight,
  Maximize2,
  Info
} from 'lucide-react';

export const ObservationGapsPage: React.FC = () => {
  const gaps = atmosphericService.getObservationGaps();
  const [selectedGap, setSelectedGap] = useState<ObservationGap>(gaps[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-graphite-900 border border-scientific-border p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-amber-500/15 border border-amber-500/40 text-amber-400">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-mono text-base font-bold text-slate-100">
                OBSERVATION GAPS & INFORMATION VALUE
              </h2>
              <SimulatedDataBadge size="sm" />
            </div>
            <p className="text-xs text-scientific-muted font-mono">
              Identifying localized observational voids that truncate the convective predictability horizon.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-amber-300 px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30">
          SIMULATED EXAMPLE
        </span>
      </div>

      {/* CORE SCIENTIFIC INQUIRY CARD */}
      <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5">
        <div className="flex items-start space-x-3">
          <HelpCircle className="w-5 h-5 text-observation shrink-0 mt-0.5" />
          <div>
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-observation block mb-1">
              CENTRAL PREDICTABILITY QUESTION:
            </span>
            <h3 className="text-lg font-bold font-mono text-slate-100">
              "What information is currently limiting this forecast?"
            </h3>
            <p className="text-xs font-mono text-scientific-muted mt-1 leading-relaxed">
              When convective forecasts fail, it is frequently due to specific unobserved vertical shear layers or moisture filaments. PRAGYA identifies the physical atmospheric volume where supplemental targeted sensor observations would yield maximum entropy reduction.
            </p>
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKBENCH: 3D VOLUME HIGHLIGHT (7 COLS) + GAP DETAILS (5 COLS) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT: 3D ATMOSPHERIC VOLUME HIGHLIGHTING THE UNCERTAIN VOLUME */}
        <div className="xl:col-span-7 bg-graphite-900 border border-scientific-border rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-scientific-border">
            <div className="flex items-center space-x-2">
              <Scan className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs font-bold text-slate-200 uppercase">
                3D UNCERTAIN VOLUME HIGHLIGHT (IN SITU)
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded bg-graphite-950">
              ALT: {selectedGap.altitudeRangeKm[0]}–{selectedGap.altitudeRangeKm[1]} KM
            </span>
          </div>

          {/* 3D Canvas showing the amber bounding box in the atmosphere */}
          <div className="relative w-full h-[420px] rounded border border-scientific-border overflow-hidden bg-graphite-950">
            <AtmosphericScene
              showGapHighlight={true}
              gapMinY={selectedGap.altitudeRangeKm[0]}
              gapMaxY={selectedGap.altitudeRangeKm[1]}
              gapLabel={`GAP: ${selectedGap.weaklyObservedVariable}`}
              autoRotate={true}
            />

            <div className="absolute bottom-2.5 left-2.5 bg-graphite-900/90 border border-scientific-border px-2.5 py-1.5 rounded text-[10px] font-mono text-slate-300 backdrop-blur-sm">
              <span className="text-amber-400 font-bold block mb-0.5">HIGHLIGHTED VOLUME:</span>
              <span>{selectedGap.spatialRegion}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-mono text-scientific-muted pt-2 border-t border-scientific-border/60">
            <span>TARGET VOLUME: 40 × 60 KM HORIZONTAL | {selectedGap.altitudeRangeKm[1] - selectedGap.altitudeRangeKm[0]} KM DEPTH</span>
            <span className="text-observation font-semibold">ROTATING TESTBED VIEW</span>
          </div>
        </div>

        {/* RIGHT: GAP SELECTOR & DETAILED SCIENTIFIC DIAGNOSIS */}
        <div className="xl:col-span-5 space-y-4">
          {/* Gap Selection Cards */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-scientific-muted uppercase font-semibold block">
              IDENTIFIED OBSERVATIONAL DEFICITS
            </span>

            {gaps.map((gap) => {
              const isSelected = selectedGap.id === gap.id;

              return (
                <div
                  key={gap.id}
                  onClick={() => setSelectedGap(gap)}
                  className={`p-3.5 rounded-lg border font-mono text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-scientific-panel border-amber-400 ring-1 ring-amber-400/50 shadow-md'
                      : 'bg-graphite-900 border-scientific-border hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-100">{gap.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        gap.expectedInformationValue === 'CRITICAL'
                          ? 'bg-red-950 text-red-300 border-red-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {gap.expectedInformationValue} VALUE
                    </span>
                  </div>

                  <p className="text-slate-200 font-semibold mb-1">
                    {gap.weaklyObservedVariable}
                  </p>

                  <div className="text-[11px] text-scientific-muted flex justify-between">
                    <span>Altitude: {gap.altitudeRangeKm[0]}–{gap.altitudeRangeKm[1]} km</span>
                    <span className="text-amber-400">Click to Project in 3D</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Gap Deep Breakdown */}
          <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-scientific-border pb-2">
              <span className="font-bold text-slate-100">
                SCIENTIFIC DIAGNOSTIC: {selectedGap.id}
              </span>
              <span className="text-[10px] text-amber-400">SIMULATED EXAMPLE</span>
            </div>

            <div>
              <span className="text-scientific-muted text-[10px] block">WEAKLY OBSERVED VARIABLE:</span>
              <span className="text-slate-100 font-bold text-sm block">
                {selectedGap.weaklyObservedVariable}
              </span>
            </div>

            <div>
              <span className="text-scientific-muted text-[10px] block">CURRENT UNCERTAINTY:</span>
              <span className="text-amber-300 font-medium block">
                {selectedGap.currentUncertainty}
              </span>
            </div>

            <div>
              <span className="text-scientific-muted text-[10px] block">PHYSICAL PLATFORM LIMITATION:</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {selectedGap.platformLimitation}
              </p>
            </div>

            <div className="p-3 rounded bg-graphite-950 border border-scientific-border">
              <span className="text-observation font-bold text-[11px] block mb-1">
                RECOMMENDED SENSOR TARGET / INSTRUMENTATION:
              </span>
              <p className="text-slate-200 leading-snug text-xs">
                {selectedGap.recommendedSensorTarget}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
