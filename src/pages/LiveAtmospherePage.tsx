import React, { useState } from 'react';
import { useAtmosphere } from '../context/AtmosphericContext';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';
import {
  Radio,
  Activity,
  Layers,
  Zap,
  Wind,
  Droplets,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Eye,
  Sliders
} from 'lucide-react';

export const LiveAtmospherePage: React.FC = () => {
  const { selectedCell } = useAtmosphere();
  const [activeSensor, setActiveSensor] = useState<'all' | 'radar' | 'satellite' | 'surface' | 'lightning'>('all');
  const [sweepAngle, setSweepAngle] = useState<number>(0.5); // Elevation angle deg

  // Simulated observational sensor stations across Western Ghats
  const telemetryStations = [
    {
      id: 'AWS-LON-01',
      name: 'Lonavala Plateau AWS',
      altitude: '625 m',
      pressure: '938.4 hPa',
      temp: '26.8 °C',
      dewPoint: '24.2 °C',
      rh: '86%',
      wind: '240° / 14 kt',
      trend: 'Pressure falling (-1.8 hPa/hr)',
      status: 'OPTIMAL'
    },
    {
      id: 'AWS-KHD-02',
      name: 'Khandala Escarpment AWS',
      altitude: '580 m',
      pressure: '942.1 hPa',
      temp: '27.4 °C',
      dewPoint: '24.8 °C',
      rh: '88%',
      wind: '255° / 18 kt',
      trend: 'Rapid dewpoint convergence (+1.4 °C)',
      status: 'OPTIMAL'
    },
    {
      id: 'AWS-KJT-03',
      name: 'Karjat Valley Station',
      altitude: '110 m',
      pressure: '992.5 hPa',
      temp: '30.2 °C',
      dewPoint: '25.6 °C',
      rh: '79%',
      wind: '230° / 9 kt',
      trend: 'Anabatic upslope wind accelerating',
      status: 'OPTIMAL'
    },
    {
      id: 'DWR-MUM-01',
      name: 'Mumbai DWR Doppler Radar',
      altitude: '85 m',
      pressure: '1004.2 hPa',
      temp: '31.0 °C',
      dewPoint: '26.1 °C',
      rh: '82%',
      wind: '260° / 12 kt',
      trend: 'Volume scan complete (0.5°–19.5°)',
      status: 'ACTIVE SWEEP'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-graphite-900 border border-scientific-border p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-observation/15 border border-observation/40 text-observation">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-mono text-base font-bold text-slate-100">
                LIVE ATMOSPHERE: OBSERVATIONAL INGESTION STREAM
              </h2>
              <SimulatedDataBadge size="sm" />
            </div>
            <p className="text-xs text-scientific-muted font-mono">
              High-cadence multi-platform sensor telemetry feeding continuous 4D variational assimilation.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-emerald-400 bg-graphite-950 px-2.5 py-1 rounded border border-scientific-border">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>INGESTION CADENCE: 60 SECONDS</span>
          </div>
        </div>
      </div>

      {/* SENSOR HEALTH & TELEMETRY NETWORK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-graphite-900 border border-scientific-border p-4 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] text-scientific-muted uppercase block">DOPPLER RADAR (DWR)</span>
            <span className="text-base font-bold text-observation mt-0.5 block">6.0 MIN CYCLE</span>
            <span className="text-[10px] text-emerald-400">Status: Dual-Pol Active</span>
          </div>
          <Radio className="w-7 h-7 text-observation/60" />
        </div>

        <div className="bg-graphite-900 border border-scientific-border p-4 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] text-scientific-muted uppercase block">INSAT-3DR SATELLITE</span>
            <span className="text-base font-bold text-purple-300 mt-0.5 block">15 MIN RAPID IR</span>
            <span className="text-[10px] text-emerald-400">Quality: 99.4% Verified</span>
          </div>
          <Eye className="w-7 h-7 text-purple-400/60" />
        </div>

        <div className="bg-graphite-900 border border-scientific-border p-4 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] text-scientific-muted uppercase block">SURFACE AWS NETWORK</span>
            <span className="text-base font-bold text-slate-100 mt-0.5 block">32 STATIONS LIVE</span>
            <span className="text-[10px] text-emerald-400">Mean Latency: 14 sec</span>
          </div>
          <Activity className="w-7 h-7 text-slate-400/60" />
        </div>

        <div className="bg-graphite-900 border border-scientific-border p-4 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] text-scientific-muted uppercase block">LIGHTNING DETECTOR (LLS)</span>
            <span className="text-base font-bold text-amber-400 mt-0.5 block">164 FLASHES/HR</span>
            <span className="text-[10px] text-amber-400">Active Core Detected</span>
          </div>
          <Zap className="w-7 h-7 text-amber-400/60" />
        </div>
      </div>

      {/* TWO COLUMN INGESTION WORKBENCH: DOPPLER RADAR SWEEP (7 COLS) + AWS TELEMETRY (5 COLS) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT: DOPPLER RADAR PLAN POSITION INDICATOR (PPI) SWEEP */}
        <div className="xl:col-span-7 bg-graphite-900 border border-scientific-border rounded-lg p-5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-scientific-border text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-200">
                DOPPLER VELOCITY & REFLECTIVITY SCAN (PPI)
              </span>
              <SimulatedDataBadge size="sm" />
            </div>

            {/* Sweep Angle Selector */}
            <div className="flex items-center space-x-1.5 bg-graphite-950 px-2 py-1 rounded border border-scientific-border text-[11px]">
              <span className="text-scientific-muted">BEAM TILT:</span>
              {[0.5, 1.5, 3.0, 6.0].map((deg) => (
                <button
                  key={deg}
                  onClick={() => setSweepAngle(deg)}
                  className={`px-1.5 py-0.2 rounded transition-colors ${
                    sweepAngle === deg
                      ? 'bg-observation text-graphite-950 font-bold'
                      : 'text-scientific-muted hover:text-slate-200'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>

          {/* Radar Sweep PPI Screen */}
          <div className="relative w-full h-[380px] bg-graphite-950 rounded border border-scientific-border overflow-hidden flex items-center justify-center">
            {/* Concentric distance range rings */}
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <circle cx="200" cy="200" r="40" fill="none" stroke="#222f40" strokeWidth="1" />
              <circle cx="200" cy="200" r="80" fill="none" stroke="#222f40" strokeWidth="1" />
              <circle cx="200" cy="200" r="120" fill="none" stroke="#222f40" strokeWidth="1" />
              <circle cx="200" cy="200" r="160" fill="none" stroke="#334155" strokeWidth="1.5" />

              {/* Crosshair azimuth lines */}
              <line x1="200" y1="20" x2="200" y2="380" stroke="#222f40" strokeWidth="1" />
              <line x1="20" y1="200" x2="380" y2="200" stroke="#222f40" strokeWidth="1" />

              {/* Range labels */}
              <text x="205" y="165" fill="#64748b" fontSize="8" fontFamily="monospace">50 km</text>
              <text x="205" y="125" fill="#64748b" fontSize="8" fontFamily="monospace">100 km</text>
              <text x="205" y="85" fill="#64748b" fontSize="8" fontFamily="monospace">150 km</text>
              <text x="205" y="45" fill="#64748b" fontSize="8" fontFamily="monospace">200 km</text>

              {/* Rotating radar sweep beam */}
              <line
                x1="200"
                y1="200"
                x2="370"
                y2="100"
                stroke="#38bdf8"
                strokeWidth="1.5"
                opacity="0.8"
                className="animate-radar-sweep"
              />

              {/* High Reflectivity Core of Cell CX-017 */}
              <g transform="translate(230, 160)">
                <ellipse cx="0" cy="0" rx="35" ry="24" fill="#ef4444" fillOpacity="0.65" />
                <ellipse cx="-4" cy="-2" rx="20" ry="14" fill="#dc2626" fillOpacity="0.85" />
                <text x="28" y="5" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  CX-017 (54 dBZ)
                </text>
              </g>

              {/* Coastal Echoes */}
              <path
                d="M 120 40 Q 140 160, 110 280 T 130 380"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="4 2"
                opacity="0.4"
              />
            </svg>

            {/* Sweep Status Tag */}
            <div className="absolute top-3 left-3 bg-graphite-900/90 border border-scientific-border px-2.5 py-1 rounded text-[10px] font-mono text-slate-300">
              <span className="text-observation font-bold">RADAR MODE:</span> DUAL-POL POLARIMETRIC (ZDR, KDP)
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-mono text-scientific-muted pt-2 border-t border-scientific-border/60">
            <span>DWR LOCATION: MUMBAI COASTAL RADAR (18.91°N, 72.82°E)</span>
            <span className="text-observation font-semibold">REFLECTIVITY RANGE: 0 TO 70 dBZ</span>
          </div>
        </div>

        {/* RIGHT: REAL-TIME SURFACE AWS TELEMETRY FEED */}
        <div className="xl:col-span-5 space-y-4">
          <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-scientific-border text-xs font-mono">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-slate-200">
                  SURFACE MESONET STATIONS (IN SITU)
                </span>
              </div>
              <span className="text-[10px] text-emerald-400">ALL STATIONS REPORTING</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {telemetryStations.map((st) => (
                <div
                  key={st.id}
                  className="bg-graphite-950 p-3.5 rounded-lg border border-scientific-border/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-100">{st.name}</span>
                      <span className="text-[10px] text-scientific-muted ml-2">[{st.id}]</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-graphite-900 text-slate-400 border border-scientific-border">
                      Alt: {st.altitude}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-scientific-muted block text-[10px]">TEMP / DP</span>
                      <span className="text-slate-200 font-bold">{st.temp} / {st.dewPoint}</span>
                    </div>
                    <div>
                      <span className="text-scientific-muted block text-[10px]">PRESSURE</span>
                      <span className="text-slate-200 font-bold">{st.pressure}</span>
                    </div>
                    <div>
                      <span className="text-scientific-muted block text-[10px]">WIND VECTOR</span>
                      <span className="text-observation font-bold">{st.wind}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-amber-300 pt-1 border-t border-scientific-border/50">
                    › {st.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
