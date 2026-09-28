import React, { useState } from 'react';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';
import {
  Waves,
  CloudRain,
  Mountain,
  AlertTriangle,
  ArrowDownRight,
  ShieldAlert,
  Info,
  Sliders,
  CheckCircle
} from 'lucide-react';

export const ImpactSimulatorPage: React.FC = () => {
  const [rainfallRate, setRainfallRate] = useState<number>(95); // mm/hr
  const [soilSaturation, setSoilSaturation] = useState<number>(82); // %
  const [showRunoffVectors, setShowRunoffVectors] = useState<boolean>(true);
  const [showExposureZones, setShowExposureZones] = useState<boolean>(true);

  // Computed impact projections based on rainfall rate
  const isExtreme = rainfallRate >= 75;
  const runoffCoeff = Math.min(0.95, (soilSaturation / 100) * 0.7 + (rainfallRate / 150) * 0.3);
  const peakDischargeM3 = Math.round((rainfallRate * 12.4 * runoffCoeff));
  const flashLagTimeMin = Math.max(18, Math.round(65 - (rainfallRate / 140) * 42));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-graphite-900 border border-scientific-border p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-observation/15 border border-observation/40 text-observation">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-mono text-base font-bold text-slate-100">
                ATMOSPHERE-TO-SURFACE IMPACT SIMULATOR
              </h2>
              <SimulatedDataBadge size="sm" />
            </div>
            <p className="text-xs text-scientific-muted font-mono">
              Hydro-meteorological coupling: translating intense convective precipitation into topographic runoff response.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
          EXPERIMENTAL IMPACT VISUALIZATION
        </span>
      </div>

      {/* MANDATORY SCIENTIFIC INTEGRITY BANNER */}
      <div className="bg-graphite-900 border-l-4 border-l-amber-500 border-r border-t border-b border-scientific-border p-4 rounded-lg flex items-start space-x-3 text-xs font-mono">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-100 uppercase tracking-wide">
            EXPERIMENTAL RESEARCH VISUALIZATION — NOT A REAL FLOOD PREDICTION
          </strong>
          <p className="text-scientific-muted leading-relaxed">
            This module illustrates conceptual downstream consequences of high-intensity precipitation cores on steep orography. It does not replace hydraulic flood models or official hydrological forecasts from state water resources authorities.
          </p>
        </div>
      </div>

      {/* TWO COLUMN INTERACTION: MAP / TERRAIN SVG (7 COLS) + SLIDER CONTROLS (5 COLS) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT: TERRAIN & RUNOFF VISUALIZATION CANVAS */}
        <div className="xl:col-span-7 bg-graphite-900 border border-scientific-border rounded-lg p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-scientific-border text-xs font-mono">
            <div className="flex items-center space-x-2">
              <Mountain className="w-4 h-4 text-observation" />
              <span className="font-bold text-slate-200">
                TOPOGRAPHIC RUNOFF ACCUMULATION MODEL
              </span>
            </div>
            <span className="text-scientific-muted">
              CATCHMENT: ULHAS-PATALGANGA UPPER BASIN
            </span>
          </div>

          {/* Schematic Topographic Catchment SVG */}
          <div className="relative w-full h-[400px] bg-graphite-950 rounded border border-scientific-border overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 scientific-grid opacity-25 pointer-events-none" />

            <svg viewBox="0 0 600 400" className="w-full h-full select-none">
              <defs>
                <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                <radialGradient id="waterAccumGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8 * (rainfallRate / 140)} />
                  <stop offset="70%" stopColor="#0284c7" stopOpacity={0.4 * (rainfallRate / 140)} />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Contour Elevation Bands */}
              <path d="M 0 50 Q 150 120, 300 80 T 600 60 L 600 400 L 0 400 Z" fill="#141c28" opacity="0.6" />
              <path d="M 0 140 Q 180 200, 320 160 T 600 130 L 600 400 L 0 400 Z" fill="#182333" opacity="0.7" />
              <path d="M 0 230 Q 160 280, 340 250 T 600 220 L 600 400 L 0 400 Z" fill="#1e2d42" opacity="0.85" />

              {/* Mountain Ridge line (Western Ghats Escarpment) */}
              <path
                d="M 50 30 L 140 70 L 220 40 L 330 85 L 420 50 L 550 90"
                fill="none"
                stroke="#64748b"
                strokeWidth="2.5"
                strokeDasharray="6 3"
              />
              <text x="70" y="25" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                RIDGELINE WATERSHED DIVIDE (ELEVATION: 1,050m)
              </text>

              {/* Surface Water Accumulation Depressions */}
              <ellipse cx="280" cy="270" rx={80 * (rainfallRate / 100)} ry={35 * (rainfallRate / 100)} fill="url(#waterAccumGrad)" />
              <ellipse cx="440" cy="320" rx={60 * (rainfallRate / 100)} ry={25 * (rainfallRate / 100)} fill="url(#waterAccumGrad)" />

              {/* Potential Runoff Direction Vectors (Arrows flowing down slope) */}
              {showRunoffVectors && (
                <g stroke="#38bdf8" strokeWidth={isExtreme ? "2.5" : "1.5"} opacity="0.85">
                  {/* Gully 1 */}
                  <path d="M 160 90 Q 180 180, 260 250 M 245 240 L 260 250 L 248 258" />
                  {/* Gully 2 */}
                  <path d="M 330 100 Q 310 190, 290 250 M 282 238 L 290 250 L 298 240" />
                  {/* Main Drainage Channel */}
                  <path d="M 300 280 Q 360 320, 420 330 M 405 322 L 420 330 L 410 338" />
                  <path d="M 460 335 L 560 365 M 545 358 L 560 365 L 550 372" />
                </g>
              )}

              {/* Highlighted Exposure Areas */}
              {showExposureZones && (
                <g>
                  {/* Exposure 1: Mountain Road Culvert */}
                  <g transform="translate(250, 240)">
                    <rect x="-10" y="-10" width="130" height="26" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                    <text x="5" y="7" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      GHAT HIGHWAY CUT
                    </text>
                  </g>

                  {/* Exposure 2: Valley Settlement Inundation Point */}
                  <g transform="translate(410, 310)">
                    <rect x="-10" y="-10" width="140" height="26" rx="4" fill="#0f172a" stroke={isExtreme ? "#ef4444" : "#38bdf8"} strokeWidth="1.5" />
                    <text x="5" y="7" fill={isExtreme ? "#f87171" : "#38bdf8"} fontSize="9" fontFamily="monospace" fontWeight="bold">
                      LOW-LEVEL CAUSEWAY
                    </text>
                  </g>
                </g>
              )}

              {/* Rain Particle Indicator */}
              <text x="20" y="380" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                PRECIPITATION INTENSITY: {rainfallRate} MM/HR
              </text>
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-mono text-scientific-muted pt-2 border-t border-scientific-border/60">
            <span>SOIL INFILTRATION SATURATION: {soilSaturation}%</span>
            <span className="text-observation">HYDRAULIC RESPONSE TIME: ~{flashLagTimeMin} MIN</span>
          </div>
        </div>

        {/* RIGHT: INTERACTIVE SIMULATION SLIDERS & TELEMETRY */}
        <div className="xl:col-span-5 space-y-4">
          <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5 space-y-5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-scientific-border pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-observation" />
                <span className="font-bold text-slate-100">
                  SIMULATION PARAMETER FORCING
                </span>
              </div>
              <span className="text-[10px] text-amber-400">INTERACTIVE CONTROLS</span>
            </div>

            {/* Slider 1: Simulated Rain Rate */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-300 font-semibold">
                  SIMULATED RAINFALL RATE:
                </span>
                <span className={`font-bold tabular-nums text-sm ${rainfallRate > 80 ? 'text-red-400' : 'text-observation'}`}>
                  {rainfallRate} mm/hr
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="140"
                value={rainfallRate}
                onChange={(e) => setRainfallRate(Number(e.target.value))}
                className="w-full accent-observation bg-graphite-950 h-2 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-scientific-muted mt-1">
                <span>10 mm/h (Shower)</span>
                <span>75 mm/h (Severe)</span>
                <span>140 mm/h (Cloudburst)</span>
              </div>
            </div>

            {/* Slider 2: Antecedent Soil Moisture Saturation */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-300 font-semibold">
                  ANTECEDENT SOIL SATURATION:
                </span>
                <span className="text-slate-100 font-bold tabular-nums text-sm">
                  {soilSaturation}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={soilSaturation}
                onChange={(e) => setSoilSaturation(Number(e.target.value))}
                className="w-full accent-predictability bg-graphite-950 h-2 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-scientific-muted mt-1">
                <span>20% (Dry Base)</span>
                <span>60% (Moderate)</span>
                <span>100% (Fully Saturated)</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2 border-t border-scientific-border">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showRunoffVectors}
                  onChange={(e) => setShowRunoffVectors(e.target.checked)}
                  className="rounded bg-graphite-950 border-scientific-border text-observation focus:ring-0"
                />
                <span>Show Potential Runoff Vectors</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showExposureZones}
                  onChange={(e) => setShowExposureZones(e.target.checked)}
                  className="rounded bg-graphite-950 border-scientific-border text-observation focus:ring-0"
                />
                <span>Highlight Infrastructure Exposure Zones</span>
              </label>
            </div>

            {/* POPULATION & DEMOGRAPHIC DATA HONEST STATUS */}
            <div className="pt-3 border-t border-scientific-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  DEMOGRAPHIC DATA INTEGRATION
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  POPULATION DATA NOT CONNECTED
                </span>
              </div>
              <p className="text-[11px] text-scientific-muted leading-tight">
                Live census block counts and cellular mobility feeds are not integrated. Demographic numbers below are strictly for scenario experimentation.
              </p>
            </div>

            {/* USER-PROVIDED SCENARIO CONTROLS */}
            <div className="p-3 bg-graphite-950/80 rounded border border-scientific-border/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-observation uppercase">
                  USER-PROVIDED SCENARIO
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-observation/10 text-observation border border-observation/30">
                  HYPOTHETICAL DEMOGRAPHIC
                </span>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">
                  Settlement Exposure Density (Estimated):
                </label>
                <select
                  aria-label="Settlement Exposure Density"
                  className="w-full bg-graphite-900 border border-scientific-border rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-observation"
                  defaultValue="medium"
                >
                  <option value="low">Sparse / Hamlets (~1,200 residents in valley)</option>
                  <option value="medium">Medium / Valley Town (~8,500 residents)</option>
                  <option value="high">High / Urban Peri-Catchment (~28,000 residents)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">
                  Corridor Activity State:
                </label>
                <select
                  aria-label="Corridor Activity State"
                  className="w-full bg-graphite-900 border border-scientific-border rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-observation"
                  defaultValue="peak"
                >
                  <option value="normal">Standard Traffic Flow (Low Transit Delay)</option>
                  <option value="peak">Ghat Tourism / Peak Freight Transit</option>
                  <option value="night">Night / Restricted Movement Protocol</option>
                </select>
              </div>
            </div>

            {/* Simulated Hydrological Response Metrics */}
            <div className="pt-3 border-t border-scientific-border space-y-2">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                HYDROLOGICAL PROJECTION SUMMARY (SIMULATED)
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-graphite-950 p-2.5 rounded border border-scientific-border">
                  <span className="text-[10px] text-scientific-muted block">RUNOFF COEFFICIENT</span>
                  <span className="text-slate-100 font-bold text-sm block mt-0.5">
                    {(runoffCoeff * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="bg-graphite-950 p-2.5 rounded border border-scientific-border">
                  <span className="text-[10px] text-scientific-muted block">PEAK DISCHARGE PROXY</span>
                  <span className="text-observation font-bold text-sm block mt-0.5">
                    {peakDischargeM3} m³/s
                  </span>
                </div>

                <div className="bg-graphite-950 p-2.5 rounded border border-scientific-border">
                  <span className="text-[10px] text-scientific-muted block">CATCHMENT LAG TIME</span>
                  <span className="text-amber-400 font-bold text-sm block mt-0.5">
                    ~{flashLagTimeMin} min
                  </span>
                </div>

                <div className="bg-graphite-950 p-2.5 rounded border border-scientific-border">
                  <span className="text-[10px] text-scientific-muted block">EXPOSURE STATUS</span>
                  <span className={`font-bold text-sm block mt-0.5 ${isExtreme ? 'text-red-400' : 'text-emerald-400'}`}>
                    {isExtreme ? 'CRITICAL WATCH' : 'MODERATE FLOW'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MULTI-HAZARD IMPACT CATEGORIES SECTION */}
      <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-scientific-border pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-observation" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              MULTI-HAZARD IMPACT MATRIX & VULNERABILITY ANALYSIS
            </h3>
          </div>
          <span className="text-xs text-scientific-muted">
            SCIENTIFIC DOMAIN HAZARD EVALUATION (NON-OPERATIONAL)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Hazard 1 */}
          <div className="p-4 bg-graphite-950 rounded border border-scientific-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Urban & Micro-Drainage Flooding</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rainfallRate > 70 ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-amber-500/20 text-amber-300'}`}>
                {rainfallRate > 70 ? 'SEVERE EXPOSURE' : 'MODERATE RISK'}
              </span>
            </div>
            <p className="text-scientific-muted text-[11px] leading-relaxed">
              Precipitation intensity exceeds standard urban stormwater discharge capacity (40 mm/hr). Low-lying subway underpasses and railway culverts accumulate localized inundation.
            </p>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-scientific-border/60">
              Primary Vulnerability: Undersized culverts & subterranean transit nodes
            </div>
          </div>

          {/* Hazard 2 */}
          <div className="p-4 bg-graphite-950 rounded border border-scientific-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Flash Flooding & Torrent Runoff</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${soilSaturation > 75 && rainfallRate > 60 ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-sky-500/20 text-sky-300'}`}>
                {soilSaturation > 75 && rainfallRate > 60 ? 'CRITICAL WATCH' : 'ELEVATED FLOW'}
              </span>
            </div>
            <p className="text-scientific-muted text-[11px] leading-relaxed">
              Steep catchment gradient produces rapid hydrograph peaking (~{flashLagTimeMin} min lag). Narrow mountain nallahs and bridge causeways face sudden hydraulic surges.
            </p>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-scientific-border/60">
              Primary Vulnerability: Low-level riverbed causeways & riverside settlements
            </div>
          </div>

          {/* Hazard 3 */}
          <div className="p-4 bg-graphite-950 rounded border border-scientific-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Road Corridor & Ghat Disruption</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rainfallRate > 80 ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-amber-500/20 text-amber-300'}`}>
                {rainfallRate > 80 ? 'HIGH IMPEDANCE' : 'PARTIAL CAUTION'}
              </span>
            </div>
            <p className="text-scientific-muted text-[11px] leading-relaxed">
              Combination of saturation and cutting slope seepage elevates mudslip risk along ghat highway turns. Water ponding reduces transit throughput.
            </p>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-scientific-border/60">
              Primary Vulnerability: Cut slopes, retaining wall overflows & vehicle stranding
            </div>
          </div>

          {/* Hazard 4 */}
          <div className="p-4 bg-graphite-950 rounded border border-scientific-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Visibility Reduction (Squall Core)</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rainfallRate > 65 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300'}`}>
                {rainfallRate > 65 ? '&lt; 400m SEVERE BLIND' : 'MODERATE (&gt; 1km)'}
              </span>
            </div>
            <p className="text-scientific-muted text-[11px] leading-relaxed">
              Torrential rain curtain and spray from intense convective precipitation collapse horizontal visibility along highway expressways and approach corridors.
            </p>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-scientific-border/60">
              Primary Vulnerability: Expressways, aviation approach paths & marine pilots
            </div>
          </div>

          {/* Hazard 5 */}
          <div className="p-4 bg-graphite-950 rounded border border-scientific-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Lightning & Ground Discharge</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                ACTIVE CHARGE CORE
              </span>
            </div>
            <p className="text-scientific-muted text-[11px] leading-relaxed">
              Intense mixed-phase updraft collision generates severe dipole charge separation. Cloud-to-ground strikes concentrated along ridgelines and open agricultural basins.
            </p>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-scientific-border/60">
              Primary Vulnerability: Open field agricultural workers & electrical sub-stations
            </div>
          </div>

          {/* Hazard 6 */}
          <div className="p-4 bg-graphite-950 rounded border border-scientific-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Hail & Convective Microburst</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rainfallRate > 90 ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-slate-700 text-slate-300'}`}>
                {rainfallRate > 90 ? 'POTENTIAL DOWNDRAFT' : 'LOW PROBABILITY'}
              </span>
            </div>
            <p className="text-scientific-muted text-[11px] leading-relaxed">
              Evaporative cooling beneath high-reflectivity convective cores can induce localized straight-line gust surges capable of roof and temporary canopy disruption.
            </p>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-scientific-border/60">
              Primary Vulnerability: Temporary roofing, power distribution wires & fruit orchards
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

