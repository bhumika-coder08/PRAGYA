import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface AtmosphericXRayLabelsProps {
  visible?: boolean;
}

export const AtmosphericXRayLabels: React.FC<AtmosphericXRayLabelsProps> = ({
  visible = true,
}) => {
  if (!visible) return null;

  const labels = [
    {
      text: 'HAIL GROWTH ZONE (-10°C to -40°C)',
      sub: 'Hydrometeor accretion layer',
      variable: 'Temperature Profile',
      level: '500-300 hPa (~6.0-9.2 km)',
      source: 'INSAT-3DR Sounder / Radiosonde',
      type: 'OBSERVED',
      quality: 'VALID',
      color: 'border-purple-500/80 text-purple-300',
      pos: [2.0, 7.2, -0.5] as [number, number, number],
      lineEnd: [4.5, 8.0, 0] as [number, number, number],
    },
    {
      text: 'UPDRAFT CORE (>18 m/s)',
      sub: 'Buoyant parcel acceleration',
      variable: 'Vertical Velocity (w)',
      level: '600 hPa (~4.8 km)',
      source: 'Doppler Radar Radial Velocity Diagnostic',
      type: 'DERIVED',
      quality: 'VALID',
      color: 'border-red-500/80 text-red-300',
      pos: [1.5, 5.2, -0.5] as [number, number, number],
      lineEnd: [-1.8, 5.8, -1.0] as [number, number, number],
    },
    {
      text: 'FREEZING LEVEL (0°C / 4.2 km)',
      sub: 'Supercooled liquid threshold',
      variable: 'Isotherm Height',
      level: '620 hPa (4.2 km)',
      source: 'ERA5 Synoptic Reanalysis',
      type: 'REANALYSIS',
      quality: 'VALID',
      color: 'border-cyan-500/80 text-cyan-300',
      pos: [-4.0, 4.2, -4.0] as [number, number, number],
      lineEnd: [-7.0, 4.2, -4.0] as [number, number, number],
    },
    {
      text: 'DOWNDRAFT SHAFT',
      sub: 'Precipitation drag & evaporative cooling',
      variable: 'Reflectivity Divergence',
      level: 'Surface - 850 hPa',
      source: 'IMD Doppler Radar Delhi',
      type: 'OBSERVED',
      quality: 'VALID',
      color: 'border-blue-500/80 text-blue-300',
      pos: [3.2, 3.2, 1.2] as [number, number, number],
      lineEnd: [6.0, 3.8, 2.0] as [number, number, number],
    },
    {
      text: 'PRECIPITATION CORE (>50 dBZ)',
      sub: 'High reflectivity rain column',
      variable: 'Radar Reflectivity (Z)',
      level: 'Surface - 3.5 km',
      source: 'IMD Doppler Radar Palam',
      type: 'OBSERVED',
      quality: 'VALID',
      color: 'border-emerald-500/80 text-emerald-300',
      pos: [2.5, 1.8, 0.6] as [number, number, number],
      lineEnd: [5.2, 1.5, 0.8] as [number, number, number],
    },
    {
      text: 'MOISTURE INFLOW (850 hPa)',
      sub: 'Low-level converging water vapor',
      variable: 'Relative Humidity & Convergence',
      level: '850 hPa (~1.5 km)',
      source: 'Surface AWS & Regional Profiler Grid',
      type: 'INTERPOLATED',
      quality: 'INTERPOLATED',
      color: 'border-sky-500/80 text-sky-300',
      pos: [-1.4, 1.3, 0.8] as [number, number, number],
      lineEnd: [-4.2, 1.8, 1.2] as [number, number, number],
    },
  ];

  return (
    <group>
      {labels.map((item, idx) => {
        const points = [
          new THREE.Vector3(...item.pos),
          new THREE.Vector3(...item.lineEnd),
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <group key={idx}>
            {/* Connecting line */}
            <primitive
              object={
                new THREE.Line(
                  lineGeo,
                  new THREE.LineBasicMaterial({
                    color: 0x94a3b8,
                    transparent: true,
                    opacity: 0.45,
                  })
                )
              }
            />

            {/* Target reticle dot */}
            <mesh position={item.pos}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Scientific HUD Label with Provenance */}
            <Html position={item.lineEnd} distanceFactor={26} center>
              <div
                className={`bg-graphite-950/95 border px-2.5 py-1.5 rounded text-[10px] font-mono shadow-2xl select-none pointer-events-none max-w-xs ${item.color}`}
              >
                <div className="font-bold flex items-center justify-between space-x-2 mb-0.5">
                  <div className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>{item.text}</span>
                  </div>
                  <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${
                    item.type === 'OBSERVED' ? 'bg-emerald-950 text-emerald-300' :
                    item.type === 'REANALYSIS' ? 'bg-blue-950 text-blue-300' :
                    item.type === 'INTERPOLATED' ? 'bg-amber-950 text-amber-300' : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {item.type}
                  </span>
                </div>
                <div className="text-[9px] text-slate-300 pl-2.5">
                  {item.sub}
                </div>
                <div className="text-[8px] text-slate-400 pl-2.5 mt-1 pt-1 border-t border-scientific-border/40 grid grid-cols-2 gap-x-2">
                  <span>Level: <span className="text-slate-200">{item.level}</span></span>
                  <span>Source: <span className="text-slate-200">{item.source}</span></span>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
