import React, { useState } from 'react';
import {
  MapPin,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Radio,
  Eye,
  EyeOff,
  Navigation,
  Shield,
  Info
} from 'lucide-react';

interface ImpactZoneMapProps {
  centerLat?: number;
  centerLon?: number;
  locationName?: string;
  impactRadiusKm?: number;
  uncertaintyRadiusKm?: number;
  className?: string;
  isSimulated?: boolean;
}

export const ImpactZoneMap: React.FC<ImpactZoneMapProps> = ({
  centerLat = 28.5921,
  centerLon = 77.1611,
  locationName = 'Dhaula Kuan Corridor (NCT Delhi)',
  impactRadiusKm = 8.5,
  uncertaintyRadiusKm = 18.0,
  className = '',
  isSimulated = true,
}) => {
  const [zoom, setZoom] = useState(1);
  const [showRadarOverlay, setShowRadarOverlay] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  // Key observation stations in the Delhi / NCR domain
  const stations = [
    { id: 'stn-palam', name: 'IMD Palam Doppler Radar', lat: 28.58, lon: 77.12, type: 'DWR RADAR', status: 'ACTIVE' },
    { id: 'stn-safdarjung', name: 'Safdarjung Base AWS', lat: 28.58, lon: 77.21, type: 'AWS SURFACE', status: 'ACTIVE' },
    { id: 'stn-ridge', name: 'Delhi Ridge In-Situ Node', lat: 28.60, lon: 77.17, type: 'DISDROMETER', status: 'ACTIVE' },
    { id: 'stn-gurugram', name: 'Gurugram Southern Flank', lat: 28.45, lon: 77.03, type: 'AWS SURFACE', status: 'ACTIVE' },
    { id: 'stn-noida', name: 'East Yamuna Floodplain', lat: 28.57, lon: 77.32, type: 'AWS SURFACE', status: 'ACTIVE' },
  ];

  return (
    <div className={`bg-graphite-950 border border-scientific-border rounded-lg overflow-hidden flex flex-col font-mono text-xs ${className}`}>
      {/* Map Control Bar */}
      <div className="bg-graphite-900 border-b border-scientific-border px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center space-x-2">
          <MapPin className="w-3.5 h-3.5 text-observation" />
          <span className="font-bold text-slate-200 truncate">{locationName}</span>
          <span className="text-[10px] text-scientific-muted">
            ({centerLat.toFixed(4)}°N, {centerLon.toFixed(4)}°E)
          </span>
          {isSimulated && (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
              SIMULATED TRAJECTORY
            </span>
          )}
        </div>

        {/* Map Toggles */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowRadarOverlay(!showRadarOverlay)}
            className={`px-2 py-0.5 rounded text-[10px] flex items-center space-x-1 border transition-colors ${
              showRadarOverlay
                ? 'bg-observation/20 text-observation border-observation/40'
                : 'bg-graphite-950 text-scientific-muted border-scientific-border'
            }`}
            title="Toggle Radar Reflectivity Overlay"
          >
            <Radio className="w-3 h-3" />
            <span>Radar Echo</span>
          </button>

          <button
            onClick={() => setShowStations(!showStations)}
            className={`px-2 py-0.5 rounded text-[10px] flex items-center space-x-1 border transition-colors ${
              showStations
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                : 'bg-graphite-950 text-scientific-muted border-scientific-border'
            }`}
            title="Toggle In-Situ Monitoring Stations"
          >
            <Layers className="w-3 h-3" />
            <span>Stations</span>
          </button>

          <div className="flex items-center space-x-1 pl-2 border-l border-scientific-border">
            <button
              onClick={() => setZoom((z) => Math.min(2.0, z + 0.25))}
              className="p-1 rounded bg-graphite-950 hover:bg-graphite-800 text-slate-300 border border-scientific-border"
              title="Zoom In"
              aria-label="Zoom in on map"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.75, z - 0.25))}
              className="p-1 rounded bg-graphite-950 hover:bg-graphite-800 text-slate-300 border border-scientific-border"
              title="Zoom Out"
              aria-label="Zoom out on map"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Vector GIS Canvas */}
      <div className="relative w-full h-80 bg-[#090d16] overflow-hidden select-none">
        {/* Map Grid / Topographic Mesh Backdrop */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
          viewBox="0 0 600 400"
        >
          <defs>
            <pattern id="gisGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#162238" strokeWidth="0.75" />
            </pattern>
            <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.65" />
              <stop offset="70%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </radialGradient>
            <radialGradient id="uncertaintyZone" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.0" />
              <stop offset="90%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="600" height="400" fill="url(#gisGrid)" />

          {/* Topographic Elevation Contours (Aravalli Ridge & Yamuna River Vector) */}
          <path
            d="M 120 400 Q 250 240 310 180 T 480 0"
            fill="none"
            stroke="#1e3a5f"
            strokeWidth="3.5"
            strokeDasharray="4 2"
            opacity="0.6"
          />
          <text x="430" y="30" fill="#3b82f6" fontSize="9" opacity="0.6">Yamuna Drainage Axis</text>

          {/* Delhi Ridge Orogenic Feature */}
          <path
            d="M 230 400 Q 280 260 300 200 T 340 50"
            fill="none"
            stroke="#2e384d"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.4"
          />
          <text x="210" y="380" fill="#64748b" fontSize="8" opacity="0.5">Delhi Ridge Elevation Crest</text>

          {/* Uncertainty Envelope Polygon */}
          <circle
            cx="300"
            cy="200"
            r={uncertaintyRadiusKm * 7}
            fill="url(#uncertaintyZone)"
            stroke="#f59e0b"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.8"
          />

          {/* Radar Reflectivity Overlay (Convective Genesis Core) */}
          {showRadarOverlay && (
            <g>
              <ellipse
                cx="300"
                cy="200"
                rx={impactRadiusKm * 6}
                ry={impactRadiusKm * 4.5}
                transform="rotate(-15 300 200)"
                fill="url(#radarSweep)"
              />
              {/* High Reflectivity Inner Core (>52 dBZ) */}
              <circle cx="305" cy="195" r="18" fill="#dc2626" opacity="0.85" />
              <circle cx="305" cy="195" r="8" fill="#ffffff" opacity="0.9" />
            </g>
          )}

          {/* Primary Epicentre / Core Genesis Target */}
          <circle cx="300" cy="200" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="300" cy="200" r="10" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.6">
            <animate attributeName="r" from="4" to="24" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" repeatCount="indefinite" />
          </circle>

          {/* Stations Overlay */}
          {showStations &&
            stations.map((stn, i) => {
              const sx = 300 + (stn.lon - centerLon) * 1200;
              const sy = 200 - (stn.lat - centerLat) * 1200;
              const isSelected = selectedStation === stn.id;
              return (
                <g key={stn.id} onClick={() => setSelectedStation(stn.id)} className="cursor-pointer">
                  <circle
                    cx={sx}
                    cy={sy}
                    r={isSelected ? 5 : 3.5}
                    fill={stn.type === 'DWR RADAR' ? '#f59e0b' : '#38bdf8'}
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                  <text x={sx + 7} y={sy + 3} fill="#cbd5e1" fontSize="9" fontWeight="600">
                    {stn.name}
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-2 left-2 bg-graphite-950/90 border border-scientific-border p-2 rounded text-[10px] space-y-1 shadow-lg pointer-events-none">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span className="text-slate-300">Convective Core (&gt;50 dBZ)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full border border-amber-500 border-dashed inline-block" />
            <span className="text-slate-300">Uncertainty Envelope ({uncertaintyRadiusKm} km)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
            <span className="text-slate-300">Ground Telemetry Node</span>
          </div>
        </div>

        {/* Selected Station Popover */}
        {selectedStation && (
          <div className="absolute top-2 right-2 bg-graphite-950/95 border border-cyan-500/50 p-2.5 rounded shadow-xl text-[10px] space-y-1 max-w-xs">
            <div className="flex items-center justify-between font-bold text-cyan-300 border-b border-scientific-border pb-1">
              <span>{stations.find((s) => s.id === selectedStation)?.name}</span>
              <button onClick={() => setSelectedStation(null)} className="text-slate-400 hover:text-white" aria-label="Close station details">×</button>
            </div>
            <div className="text-slate-300">Type: {stations.find((s) => s.id === selectedStation)?.type}</div>
            <div className="text-slate-400 text-[9px]">Telemetry Cadence: 10–15 min | Status: Operational</div>
          </div>
        )}
      </div>

      {/* Map Footer Metadata */}
      <div className="px-3 py-1.5 bg-graphite-900 border-t border-scientific-border flex items-center justify-between text-[10px] text-scientific-muted">
        <span>Cartographic Baseline: OpenStreetMap WGS-84 / SRTM Topography</span>
        <span className="text-slate-400">Scale: 1:50,000 Local Micro-Domain</span>
      </div>
    </div>
  );
};
