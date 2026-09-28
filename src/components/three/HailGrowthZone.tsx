import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { ConvectiveStage } from '../../types';

interface HailGrowthZoneProps {
  areaSize?: number;
  minAltitude?: number; // 5.5 km
  maxAltitude?: number; // 8.5 km
  stage?: ConvectiveStage;
  showTooltip?: boolean;
}

export const HailGrowthZone: React.FC<HailGrowthZoneProps> = ({
  areaSize = 24,
  minAltitude = 5.5,
  maxAltitude = 8.5,
  stage = 'MATURE',
  showTooltip = true,
}) => {
  const height = maxAltitude - minAltitude;
  const centerY = minAltitude + height / 2;
  const pointsRef = useRef<THREE.Points>(null);

  // Prominence is strictly modulated by stage:
  // Invisible in STABLE and INITIATION
  // Active in DEVELOPING, MATURE, EXTREME
  const isProminent = stage === 'MATURE' || stage === 'EXTREME';
  const isDeveloping = stage === 'DEVELOPING';

  const particleCount = stage === 'EXTREME' ? 120 : stage === 'MATURE' ? 80 : isDeveloping ? 25 : 0;
  const slabOpacity = stage === 'EXTREME' ? 0.22 : stage === 'MATURE' ? 0.14 : isDeveloping ? 0.05 : 0.0;

  // Generate frozen hydrometeor crystal particles
  const [positions] = useMemo(() => {
    const pos = new Float32Array(Math.max(1, particleCount) * 3);
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      pos[idx] = (Math.random() - 0.5) * 8.5 + 1.5;
      pos[idx + 1] = centerY + (Math.random() - 0.5) * (height * 0.85);
      pos[idx + 2] = (Math.random() - 0.5) * 8.5 - 0.5;
    }
    return [pos];
  }, [centerY, height, particleCount]);

  useFrame(({ clock }) => {
    if (!pointsRef.current || particleCount === 0) return;
    const t = clock.getElapsedTime();
    // Swirling graupel/hail embryos inside the convective core
    pointsRef.current.rotation.y = t * (stage === 'EXTREME' ? 0.35 : 0.18);
  });

  if (!isProminent && !isDeveloping) return null;

  return (
    <group position={[0, centerY, 0]}>
      {/* Volumetric horizontal layer slab */}
      <mesh>
        <boxGeometry args={[areaSize, height, areaSize]} />
        <meshStandardMaterial
          color="#9333ea"
          roughness={0.9}
          transparent
          opacity={slabOpacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Layer border outline */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(areaSize, height, areaSize)]} />
        <lineBasicMaterial
          color="#c084fc"
          opacity={stage === 'EXTREME' ? 0.6 : 0.35}
          transparent
        />
      </lineSegments>

      {/* Hail Graupel Embryos Particles */}
      {particleCount > 0 && (
        <points ref={pointsRef} position={[0, -centerY, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#f3e8ff"
            size={stage === 'EXTREME' ? 0.32 : 0.24}
            transparent
            opacity={0.85}
          />
        </points>
      )}

      {/* Scientific Tooltip / Badge */}
      {showTooltip && isProminent && (
        <Html position={[areaSize / 2 - 2, height / 2, -areaSize / 2 + 3]} distanceFactor={30}>
          <div className="bg-graphite-950/95 border border-predictability/60 px-2.5 py-1.5 rounded text-[9px] font-mono text-predictability-light whitespace-nowrap shadow-xl select-none pointer-events-none">
            <div className="font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-predictability animate-pulse" />
              <span>HAIL-GROWTH REGION (-10°C to -40°C)</span>
            </div>
            <div className="text-[8px] text-slate-400 mt-0.5 max-w-xs leading-tight">
              Visualization of thermodynamic potential growth conditions. NOT a real hail detection.
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
