import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ConvectiveStage } from '../../types';

interface PrecipitationVolumeProps {
  stage?: ConvectiveStage;
  centerPosition?: [number, number, number];
  visible?: boolean;
}

export const PrecipitationVolume: React.FC<PrecipitationVolumeProps> = ({
  stage = 'MATURE',
  centerPosition = [2.4, 0, 0.4],
  visible = true,
}) => {
  // Count & speed dynamically scaled by stage
  const { count, fallSpeed, rainAlpha, spreadRadius, cloudBaseY } = useMemo(() => {
    switch (stage) {
      case 'STABLE':
        return { count: 0, fallSpeed: 0.05, rainAlpha: 0.0, spreadRadius: 1.0, cloudBaseY: 1.5 };
      case 'INITIATION':
        return { count: 35, fallSpeed: 0.1, rainAlpha: 0.35, spreadRadius: 2.0, cloudBaseY: 1.8 };
      case 'DEVELOPING':
        return { count: 110, fallSpeed: 0.16, rainAlpha: 0.6, spreadRadius: 2.8, cloudBaseY: 2.0 };
      case 'MATURE':
        return { count: 240, fallSpeed: 0.22, rainAlpha: 0.8, spreadRadius: 3.6, cloudBaseY: 2.2 };
      case 'EXTREME':
        return { count: 380, fallSpeed: 0.28, rainAlpha: 0.95, spreadRadius: 4.5, cloudBaseY: 2.4 };
      default:
        return { count: 240, fallSpeed: 0.22, rainAlpha: 0.8, spreadRadius: 3.6, cloudBaseY: 2.2 };
    }
  }, [stage]);

  const linesRef = useRef<THREE.LineSegments>(null);

  // Rain shafts falling from cloud base (cloudBaseY) to ground (0 km)
  const [positions] = useMemo(() => {
    const validCount = Math.max(1, count);
    const pos = new Float32Array(validCount * 6); // 2 vertices per rain line
    for (let i = 0; i < validCount; i++) {
      const idx = i * 6;
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random()) * spreadRadius;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const yTop = 0.5 + Math.random() * (cloudBaseY - 0.5);
      const len = 0.35 + Math.random() * 0.25;
      const yBot = Math.max(0.05, yTop - len);

      pos[idx] = x;
      pos[idx + 1] = yTop;
      pos[idx + 2] = z;

      pos[idx + 3] = x - 0.08; // Slanted due to surface inflow
      pos[idx + 4] = yBot;
      pos[idx + 5] = z + 0.05;
    }
    return [pos];
  }, [count, spreadRadius, cloudBaseY]);

  useFrame(() => {
    if (!linesRef.current || count === 0 || !visible) return;
    const posAttr = linesRef.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const idx = i * 6;
      let yTop = posAttr.getY(i) - fallSpeed;
      let yBot = posAttr.getY(i + 1) - fallSpeed;

      if (yBot < 0.05) {
        yTop = cloudBaseY + Math.random() * 0.3;
        yBot = yTop - 0.4;
      }

      posAttr.setY(i, yTop);
      posAttr.setY(i + 1, yBot);
    }
    posAttr.needsUpdate = true;
  });

  if (!visible || count === 0) return null;

  return (
    <group position={centerPosition}>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count * 2}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#38bdf8"
          transparent
          opacity={rainAlpha * 0.75}
        />
      </lineSegments>
    </group>
  );
};
