import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtmosphere } from '../context/AtmosphericContext';
import { RiskGauge } from '../components/common/RiskGauge';
import { PredictabilityGauge } from '../components/common/PredictabilityGauge';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';
import { AtmosphericFingerprintChart } from '../components/common/AtmosphericFingerprintChart';
import { atmosphericService } from '../services/atmosphericService';
import {
  Activity,
  Layers,
  Wind,
  Droplets,
  Zap,
  ArrowUpRight,
  Maximize2,
  Compass,
  AlertTriangle,
  Info,
  Thermometer,
  ShieldAlert,
  ShieldCheck,
  Box
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { cells, selectedCell, setSelectedCellId } = useAtmosphere();
  const navigate = useNavigate();
  const fingerprint = atmosphericService.getCellFingerprint(selectedCell.id);

  const [activeOverlay, setActiveOverlay] = useState<'composite' | 'radar' | 'moisture' | 'cape'>('composite');

  return (
    <div className="space-y-6">
      {/* Top Banner / System Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-graphite-900 border border-scientific-border p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-observation/10 border border-observation/30 text-observation">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-mono text-base font-bold text-slate-100">
                REGIONAL ATMOSPHERIC MONITORING
              </h2>
              <SimulatedDataBadge size="sm" />
            </div>
            <p className="text-xs text-scientific-muted font-mono mt-0.5">
              Domain: Western Ghats Orographic Interface & Coastal Plain | 18.0°N–19.8°N, 72.5°E–74.5°E
            </p>
          </div>
        </div>

        {/* Quick Cell Selector Buttons */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-scientific-muted text-[11px] hidden sm:inline">SELECT CELL:</span>
          {cells.map((cell) => (
            <button
              key={cell.id}
              onClick={() => setSelectedCellId(cell.id)}
              className={`px-3 py-1.5 rounded border transition-all ${
                selectedCell.id === cell.id
                  ? 'bg-scientific-panel border-observation text-observation font-bold shadow'
                  : 'bg-graphite-950 border-scientific-border text-scientific-muted hover:text-slate-200'
              }`}
            >
              {cell.id}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSTATION LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* =================================================================== */}
        {/* LEFT COLUMN: SCHEMATIC ATMOSPHERIC FIELD (7 COLS) */}
        {/* =================================================================== */}
        <div className="xl:col-span-7 bg-graphite-900 border border-scientific-border rounded-lg p-4 flex flex-col justify-between">
          {/* Schematic Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-scientific-border pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-slate-200">
                SIMULATED ATMOSPHERIC FIELD
              </span>
              <span className="text-[10px] font-mono text-scientific-muted border border-scientific-border px-1.5 py-0.2 rounded bg-graphite-950">
                RESOLUTION: 1.0 KM GRID
              </span>
            </div>

            {/* Layer Filter Buttons */}
            <div className="flex items-center space-x-1 font-mono text-[11px] bg-graphite-950 p-1 rounded border border-scientific-border">
              {(['composite', 'radar', 'moisture', 'cape'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveOverlay(layer)}
                  className={`px-2 py-0.5 rounded uppercase font-semibold transition-colors ${
                    activeOverlay === layer
                      ? 'bg-scientific-panel text-observation border border-scientific-border'
                      : 'text-scientific-muted hover:text-slate-200'
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Schematic Map Canvas / SVG */}
          <div className="relative w-full h-[440px] bg-graphite-950 rounded border border-scientific-border/80 overflow-hidden flex items-center justify-center">
            {/* Scientific Grid Backdrop */}
            <div className="absolute inset-0 scientific-grid opacity-30 pointer-events-none" />

            <svg viewBox="0 0 600 440" className="w-full h-full select-none">
              <defs>
                {/* Radar reflectivity contours */}
                <radialGradient id="cellCX017Grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.7" />
                  <stop offset="65%" stopColor="#10b981" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </radialGradient>
                <radialGradient id="cellCX024Grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#b91c1c" stopOpacity="0.95" />
                  <stop offset="40%" stopColor="#ef4444" stopOpacity="0.75" />
                  <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </radialGradient>
                <radialGradient id="cellCX012Grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </radialGradient>
                <radialGradient id="cellCX031Grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </radialGradient>
              </defs>

              {/* Coastal Outline (Schematic Western India Coastline) */}
              <path
                d="M 120 0 Q 140 120, 110 240 T 135 440"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.6"
              />
              <text x="25" y="180" fill="#38bdf8" opacity="0.5" fontSize="10" fontFamily="monospace">
                ARABIAN SEA (MARITIME INFLOW)
              </text>

              {/* Western Ghats Escarpment Ridge Line */}
              <path
                d="M 320 0 Q 290 140, 310 260 T 330 440"
                fill="none"
                stroke="#64748b"
                strokeWidth="2.5"
                opacity="0.7"
              />
              <text x="335" y="420" fill="#64748b" fontSize="9" fontFamily="monospace">
                WESTERN GHATS OROGRAPHIC CREST (1200m AGL)
              </text>

              {/* Moisture Convergence Plumes (when moisture or composite active) */}
              {(activeOverlay === 'moisture' || activeOverlay === 'composite') && (
                <path
                  d="M 130 260 Q 220 250, 300 240 Q 220 280, 130 290 Z"
                  fill="#38bdf8"
                  fillOpacity="0.15"
                  stroke="#38bdf8"
                  strokeWidth="0.8"
                />
              )}

              {/* Simulated Storm Cell Echoes */}
              {/* CX-024 (Coastal Confluence) */}
              <circle cx="160" cy="300" r="55" fill="url(#cellCX024Grad)" />
              
              {/* CX-017 (Primary Focus - Orographic Interface) */}
              <circle cx="280" cy="210" r="68" fill="url(#cellCX017Grad)" />
              
              {/* CX-031 (Valley Trap) */}
              <circle cx="340" cy="320" r="35" fill="url(#cellCX031Grad)" />

              {/* CX-012 (Inland Flank) */}
              <circle cx="450" cy="150" r="45" fill="url(#cellCX012Grad)" />

              {/* Interactive Marker Pins for all cells */}
              {cells.map((cell) => {
                const isSelected = selectedCell.id === cell.id;
                // Schematic mapping coordinates to SVG
                const coords: Record<string, [number, number]> = {
                  'CX-017': [280, 210],
                  'CX-012': [450, 150],
                  'CX-024': [160, 300],
                  'CX-031': [340, 320],
                };
                const [cx, cy] = coords[cell.id] || [280, 210];

                return (
                  <g
                    key={cell.id}
                    onClick={() => setSelectedCellId(cell.id)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="24"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        className="animate-spin"
                        style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: '8s' }}
                      />
                    )}
                    {/* Reticle / Pin */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="9"
                      fill={cell.eventRisk >= 70 ? '#ef4444' : cell.eventRisk >= 40 ? '#f59e0b' : '#10b981'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={cx + 14}
                      y={cy + 4}
                      fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {cell.id}
                    </text>
                    <text
                      x={cx + 14}
                      y={cy + 17}
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      R:{cell.eventRisk}% | P:{cell.predictability}%
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Radar Legend in bottom left */}
            <div className="absolute bottom-2.5 left-2.5 bg-graphite-900/90 border border-scientific-border px-2.5 py-1.5 rounded text-[10px] font-mono backdrop-blur-sm">
              <span className="text-slate-400 block mb-1">REFLECTIVITY (dBZ)</span>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-2 bg-blue-500 rounded-sm" title="20 dBZ" />
                <span className="w-3 h-2 bg-emerald-500 rounded-sm" title="30 dBZ" />
                <span className="w-3 h-2 bg-amber-400 rounded-sm" title="40 dBZ" />
                <span className="w-3 h-2 bg-red-500 rounded-sm" title="50 dBZ" />
                <span className="w-3 h-2 bg-purple-500 rounded-sm" title="60 dBZ" />
                <span className="text-slate-300 ml-1.5 font-bold">20 → 65+</span>
              </div>
            </div>

            {/* Action buttons inside map */}
            <div className="absolute top-2.5 right-2.5 flex items-center space-x-2">
              <button
                onClick={() => navigate('/app/digital-twin')}
                className="px-2.5 py-1.5 bg-graphite-900/90 hover:bg-graphite-800 text-observation border border-observation/40 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors shadow"
              >
                <Box className="w-3.5 h-3.5" />
                <span>OPEN IN 3D TWIN</span>
              </button>
            </div>
          </div>

          {/* Schematic Footer Details */}
          <div className="mt-3 flex flex-wrap items-center justify-between text-xs font-mono text-scientific-muted pt-2 border-t border-scientific-border/60">
            <span>RADAR FEED: SIMULATED SYNTHETIC DOPPLER MOSAIC</span>
            <span className="text-observation">ACTIVE TRACKING: {cells.length} CELLS IN DOMAIN</span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: SELECTED CELL ANALYSIS PANEL (5 COLS) */}
        {/* =================================================================== */}
        <div className="xl:col-span-5 space-y-4">
          <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5">
            {/* Header of analysis panel */}
            <div className="flex items-center justify-between border-b border-scientific-border pb-3 mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-lg font-bold text-slate-100">
                    {selectedCell.name}
                  </span>
                  <SimulatedDataBadge size="sm" />
                </div>
                <span className="text-xs text-scientific-muted font-mono">
                  Region: {selectedCell.region}
                </span>
              </div>

              {/* Status Badge */}
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {selectedCell.status}
              </span>
            </div>

            {/* CRITICAL COMPARISON: EVENT RISK vs PREDICTABILITY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* Event Risk Gauge */}
              <RiskGauge
                value={selectedCell.eventRisk}
                label="EVENT RISK"
                showExplanation={true}
              />

              {/* Predictability Gauge */}
              <PredictabilityGauge
                value={selectedCell.predictability}
                label="PREDICTABILITY"
                showExplanation={true}
              />
            </div>

            {/* Atmosphere Ambiguity Callout */}
            <div className="bg-graphite-950 p-3.5 rounded border border-scientific-border/80 mb-4">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-amber-400 mb-1">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>DYNAMIC AMBIGUITY STATE:</span>
              </div>
              <p className="text-xs font-mono text-slate-300 leading-relaxed">
                "{selectedCell.ambiguityAssessment}"
              </p>
            </div>

            {/* ATMOSPHERIC DYNAMICS GRID (All marked simulated) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-scientific-muted">
                <span className="font-semibold uppercase text-slate-300">
                  ATMOSPHERIC DYNAMICS PARAMETERS
                </span>
                <span className="text-[10px] text-amber-400">SIMULATED VALUES</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="bg-graphite-950 p-2.5 rounded border border-scientific-border/60">
                  <span className="text-[10px] text-scientific-muted block">CAPE (J/kg)</span>
                  <span className="text-slate-100 font-bold tabular-nums text-sm">
                    {selectedCell.cape}
                  </span>
                  <span className="text-[9px] text-slate-500 block">simulated</span>
                </div>

                <div className="bg-graphite-950 p-2.5 rounded border border-scientific-border/60">
                  <span className="text-[10px] text-scientific-muted block">CIN (J/kg)</span>
                  <span className="text-slate-100 font-bold tabular-nums text-sm">
                    {selectedCell.cin}
                  </span>
                  <span className="text-[9px] text-slate-500 block">simulated</span>
                </div>

                <div className="bg-graphite-950 p-2.5 rounded border border-scientific-border/60">
                  <span className="text-[10px] text-scientific-muted block">RH 850hPa</span>
                  <span className="text-slate-100 font-bold tabular-nums text-sm">
                    {selectedCell.relativeHumidity}%
                  </span>
                  <span className="text-[9px] text-slate-500 block">simulated</span>
                </div>

                <div className="bg-graphite-950 p-2.5 rounded border border-scientific-border/60">
                  <span className="text-[10px] text-scientific-muted block">UPDRAFT</span>
                  <span className="text-red-400 font-bold tabular-nums text-sm">
                    {selectedCell.verticalVelocity} m/s
                  </span>
                  <span className="text-[9px] text-slate-500 block">simulated</span>
                </div>

                <div className="bg-graphite-950 p-2.5 rounded border border-scientific-border/60">
                  <span className="text-[10px] text-scientific-muted block">0–6km SHEAR</span>
                  <span className="text-slate-100 font-bold tabular-nums text-sm">
                    {selectedCell.windShear} m/s
                  </span>
                  <span className="text-[9px] text-slate-500 block">simulated</span>
                </div>

                <div className="bg-graphite-950 p-2.5 rounded border border-scientific-border/60">
                  <span className="text-[10px] text-scientific-muted block">MOIST. CONV.</span>
                  <span className="text-observation font-bold tabular-nums text-sm">
                    {selectedCell.moistureConvergence} g/kg
                  </span>
                  <span className="text-[9px] text-slate-500 block">simulated</span>
                </div>

                <div className="bg-graphite-950 p-2.5 rounded border border-scientific-border/60">
                  <span className="text-[10px] text-scientific-muted block">CLOUD COOLING</span>
                  <span className="text-purple-400 font-bold tabular-nums text-sm">
                    {selectedCell.cloudTopCooling} °C/15m
                  </span>
                  <span className="text-[9px] text-slate-500 block">simulated</span>
                </div>

                <div className="bg-graphite-950 p-2.5 rounded border border-scientific-border/60">
                  <span className="text-[10px] text-scientific-muted block">LIGHTNING</span>
                  <span className="text-amber-400 font-bold tabular-nums text-sm">
                    {selectedCell.lightningActivity} fl/min
                  </span>
                  <span className="text-[9px] text-slate-500 block">simulated</span>
                </div>
              </div>
            </div>

            {/* Candidate Precursor Signals */}
            <div className="mt-4 pt-3 border-t border-scientific-border">
              <span className="text-[11px] font-mono text-slate-400 font-semibold block mb-1.5 uppercase">
                CANDIDATE PRECURSOR SIGNALS IDENTIFIED
              </span>
              <ul className="space-y-1 text-xs font-mono text-scientific-muted">
                {selectedCell.candidatePrecursorSignals.map((sig, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-observation font-bold">›</span>
                    <span className="text-slate-300">{sig}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="mt-4 pt-3 border-t border-scientific-border flex items-center justify-between gap-2">
              <button
                onClick={() => navigate('/app/predictability')}
                className="flex-1 py-2 bg-predictability/20 hover:bg-predictability/30 text-predictability-light border border-predictability/40 rounded font-mono text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>PREDICTABILITY TIMELINE</span>
              </button>
              <button
                onClick={() => navigate('/app/digital-twin')}
                className="flex-1 py-2 bg-graphite-950 hover:bg-graphite-800 text-slate-200 border border-scientific-border rounded font-mono text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Box className="w-3.5 h-3.5 text-observation" />
                <span>3D DIGITAL TWIN</span>
              </button>
            </div>
          </div>

          {/* Integrated Atmospheric Fingerprint Radar / Contribution */}
          <AtmosphericFingerprintChart fingerprint={fingerprint} />
        </div>
      </div>
    </div>
  );
};
