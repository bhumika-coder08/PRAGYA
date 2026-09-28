import React from 'react';
import { AlertTriangle, Layers, Compass, Wind } from 'lucide-react';

interface WebGLFallbackProps {
  message?: string;
  onRetry?: () => void;
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = ({
  message = "WebGL hardware acceleration is unavailable or initializing. A schematic 2D atmospheric projection is active.",
  onRetry
}) => {
  return (
    <div className="relative w-full h-full min-h-[420px] bg-graphite-900 border border-scientific-border rounded-lg p-6 flex flex-col justify-between overflow-hidden">
      {/* Background scientific grid */}
      <div className="absolute inset-0 scientific-grid-dense opacity-20 pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-scientific-border/60 pb-3">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-subtle-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
            SCHEMATIC ATMOSPHERIC PROJECTION (2D SCIENTIFIC FALLBACK)
          </span>
        </div>
        <span className="text-[11px] font-mono text-scientific-muted">
          ALTITUDE 0–12 KM | PSEUDO-CROSS-SECTION
        </span>
      </div>

      {/* Cross section diagram SVG */}
      <div className="relative z-10 my-4 flex-1 flex items-center justify-center">
        <svg viewBox="0 0 800 360" className="w-full max-h-[320px] text-scientific-text">
          <defs>
            <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#475569" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="updraftGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="hailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Altitude grid lines */}
          <line x1="80" y1="40" x2="760" y2="40" stroke="#334155" strokeDasharray="3 3" />
          <text x="30" y="44" fill="#94a3b8" fontSize="10" fontFamily="monospace">12 km</text>
          <text x="680" y="35" fill="#64748b" fontSize="9" fontFamily="monospace">TROPOPAUSE / ANVIL</text>

          <line x1="80" y1="100" x2="760" y2="100" stroke="#334155" strokeDasharray="3 3" />
          <text x="30" y="104" fill="#94a3b8" fontSize="10" fontFamily="monospace">9 km</text>

          {/* Hail Growth Zone */}
          <rect x="80" y="130" width="680" height="70" fill="url(#hailGrad)" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="4 2" />
          <text x="630" y="165" fill="#c084fc" fontSize="9" fontFamily="monospace">HAIL GROWTH ZONE (-10°C to -40°C)</text>

          <line x1="80" y1="180" x2="760" y2="180" stroke="#334155" strokeDasharray="3 3" />
          <text x="30" y="184" fill="#94a3b8" fontSize="10" fontFamily="monospace">6 km</text>
          <text x="680" y="175" fill="#64748b" fontSize="9" fontFamily="monospace">FREEZING LEVEL (0°C)</text>

          <line x1="80" y1="260" x2="760" y2="260" stroke="#334155" strokeDasharray="3 3" />
          <text x="30" y="264" fill="#94a3b8" fontSize="10" fontFamily="monospace">2 km</text>
          <text x="680" y="255" fill="#64748b" fontSize="9" fontFamily="monospace">LFC / CLOUD BASE</text>

          {/* Ground Terrain */}
          <path d="M 80 320 Q 200 310, 320 320 T 480 315 T 600 325 T 760 320 L 760 350 L 80 350 Z" fill="#151e2b" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="30" y="324" fill="#94a3b8" fontSize="10" fontFamily="monospace">0 km</text>
          <text x="120" y="340" fill="#64748b" fontSize="9" fontFamily="monospace">TERRAIN ELEVATION (WESTERN GHATS)</text>

          {/* Developing Convective Column Contour */}
          <path d="M 330 260 Q 300 200, 280 140 Q 240 60, 420 50 Q 600 60, 560 140 Q 540 200, 510 260 Z" fill="url(#cloudGradient)" stroke="#64748b" strokeWidth="1" />
          
          {/* Anvil Outline */}
          <path d="M 230 65 Q 420 40, 620 60 Q 560 90, 420 90 Q 280 90, 230 65 Z" fill="#64748b" fillOpacity="0.4" stroke="#94a3b8" strokeWidth="1" />

          {/* Updraft Core Arrows */}
          <path d="M 400 300 L 400 110 M 390 130 L 400 110 L 410 130" stroke="url(#updraftGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <text x="415" y="200" fill="#f87171" fontSize="11" fontWeight="bold" fontFamily="monospace">UPDRAFT &gt; 18 m/s</text>

          {/* Precipitation Core */}
          <g stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.8">
            <line x1="450" y1="260" x2="440" y2="315" />
            <line x1="465" y1="260" x2="455" y2="315" />
            <line x1="480" y1="260" x2="470" y2="315" />
            <line x1="495" y1="260" x2="485" y2="315" />
          </g>
          <text x="505" y="300" fill="#38bdf8" fontSize="10" fontFamily="monospace">HEAVY PRECIP SHAFT</text>

          {/* Inflow vectors */}
          <path d="M 180 305 L 340 295 M 325 290 L 340 295 L 328 302" stroke="#38bdf8" strokeWidth="2" />
          <text x="190" y="290" fill="#38bdf8" fontSize="9" fontFamily="monospace">MOIST INFLOW (850 hPa)</text>
        </svg>
      </div>

      {/* Footer information */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs text-scientific-muted pt-3 border-t border-scientific-border/60">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>{message}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-graphite-800 hover:bg-graphite-700 text-scientific-text border border-scientific-border rounded text-xs font-mono transition-colors"
          >
            Re-initialize WebGL
          </button>
        )}
      </div>
    </div>
  );
};
