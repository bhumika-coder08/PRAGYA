import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface AtmosphericGridProps {
  size?: number;
  maxAltitude?: number;
  showLabels?: boolean;
  selectedAltitudeKm?: number;
  onSelectAltitude?: (km: number) => void;
}

export const AtmosphericGrid: React.FC<AtmosphericGridProps> = ({
  size = 26,
  maxAltitude = 12,
  showLabels = true,
  selectedAltitudeKm,
  onSelectAltitude,
}) => {
  // Required 9 Altitude Levels: 0, 1, 2, 3, 4, 6, 8, 10, 12 km
  const levels = [
    { km: 0, label: '0 km (Surface)', temp: '+29°C', pres: '1004 hPa' },
    { km: 1, label: '1 km (PBL Top)', temp: '+23°C', pres: '902 hPa' },
    { km: 2, label: '2 km (LFC Inflow)', temp: '+16°C', pres: '805 hPa' },
    { km: 3, label: '3 km (Mid-Level Inflow)', temp: '+10°C', pres: '715 hPa' },
    { km: 4, label: '4 km (Freezing Level)', temp: '+1°C', pres: '632 hPa' },
    { km: 6, label: '6 km (Hail Growth -10°C)', temp: '-12°C', pres: '498 hPa' },
    { km: 8, label: '8 km (Hail Zone -25°C)', temp: '-26°C', pres: '382 hPa' },
    { km: 10, label: '10 km (Upper Jet Core)', temp: '-43°C', pres: '288 hPa' },
    { km: 12, label: '12 km (Tropopause Lid)', temp: '-59°C', pres: '210 hPa' },
  ];

  return (
    <group>
      {/* 4 Vertical Pillar Corner Rods with Tick Marks */}
      {[
        [-size / 2, -size / 2],
        [size / 2, -size / 2],
        [size / 2, size / 2],
        [-size / 2, size / 2],
      ].map(([x, z], idx) => (
        <group key={`pillar-${idx}`} position={[x, maxAltitude / 2, z]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, maxAltitude, 8]} />
            <meshBasicMaterial color="#334155" opacity={0.6} transparent />
          </mesh>
        </group>
      ))}

      {/* 9 Interactive Altitude Planes */}
      {levels.map((lvl) => {
        const isSelected = selectedAltitudeKm === lvl.km;

        return (
          <group key={`lvl-${lvl.km}`} position={[0, lvl.km, 0]}>
            {/* Grid helper */}
            <gridHelper
              args={[size, 12, isSelected ? '#38bdf8' : '#1e293b', isSelected ? '#1e293b' : '#0f172a']}
              position={[0, 0, 0]}
            />

            {/* Clickable transparent plane for picking */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectAltitude) onSelectAltitude(lvl.km);
              }}
              position={[0, 0, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[size, size]} />
              <meshBasicMaterial
                color={isSelected ? '#38bdf8' : '#0ea5e9'}
                transparent
                opacity={isSelected ? 0.08 : 0.015}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Bounding Line Perimeter */}
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(size, 0.01, size)]} />
              <lineBasicMaterial
                color={
                  isSelected
                    ? '#38bdf8'
                    : lvl.km === 12
                    ? '#a855f7'
                    : lvl.km === 4
                    ? '#0284c7'
                    : '#334155'
                }
                opacity={isSelected ? 0.95 : lvl.km === 12 ? 0.55 : 0.25}
                transparent
              />
            </lineSegments>

            {/* Altitude Label on northwest corner */}
            {showLabels && (
              <Html
                position={[-size / 2 - 0.4, 0, -size / 2 - 0.4]}
                distanceFactor={30}
                center
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectAltitude) onSelectAltitude(lvl.km);
                  }}
                  className={`border px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap select-none transition-all shadow ${
                    isSelected
                      ? 'bg-observation text-graphite-950 border-observation font-bold scale-105'
                      : 'bg-graphite-900/90 text-scientific-muted border-scientific-border hover:border-observation/70 hover:text-slate-200'
                  }`}
                  title="Click to view simulated sounding profile"
                >
                  <span className="font-semibold">{lvl.km} km</span>
                  <span className="ml-1 text-[8px] opacity-80">[{lvl.temp}]</span>
                </button>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};
