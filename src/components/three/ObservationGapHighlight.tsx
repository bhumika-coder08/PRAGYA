import React from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface ObservationGapHighlightProps {
  visible?: boolean;
  minY?: number;
  maxY?: number;
  sizeX?: number;
  sizeZ?: number;
  variable?: string;
}

export const ObservationGapHighlight: React.FC<ObservationGapHighlightProps> = ({
  visible = true,
  minY = 2.1,
  maxY = 3.4,
  sizeX = 9,
  sizeZ = 9,
  variable = 'Vertical Humidity Structure',
}) => {
  if (!visible) return null;

  const height = maxY - minY;
  const centerY = minY + height / 2;

  return (
    <group position={[-1.2, centerY, 0]}>
      {/* Semi-transparent bounding box slab */}
      <mesh>
        <boxGeometry args={[sizeX, height, sizeZ]} />
        <meshStandardMaterial
          color="#f59e0b"
          roughness={0.9}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Amber wireframe dashed border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(sizeX, height, sizeZ)]} />
        <lineBasicMaterial color="#f59e0b" opacity={0.85} transparent />
      </lineSegments>

      {/* Floating 3D annotation badge */}
      <Html position={[0, height / 2 + 0.35, 0]} center distanceFactor={26}>
        <div className="bg-graphite-950/95 border-2 border-amber-500/80 text-amber-300 px-3 py-1.5 rounded-lg text-[10px] font-mono whitespace-nowrap shadow-2xl space-y-0.5 select-none pointer-events-none">
          <div className="flex items-center space-x-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>OBSERVATION GAP VOLUME (INSUFFICIENT OBSERVATION)</span>
          </div>
          <div className="text-slate-300">
            Variable: <strong>{variable}</strong> ({minY}–{maxY} km AGL)
          </div>
          <div className="text-slate-400 text-[9px] italic">
            "Forecast uncertainty may be sensitive to this atmospheric region."
          </div>
          <div className="text-amber-400 font-bold text-[8px] tracking-wider pt-0.5">
            [SIMULATED EXAMPLE]
          </div>
        </div>
      </Html>
    </group>
  );
};
