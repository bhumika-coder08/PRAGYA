import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MoistureParticlesProps {
  count?: number;
  areaSize?: number;
  centerPos?: [number, number, number];
  visible?: boolean;
}

export const MoistureParticles: React.FC<MoistureParticlesProps> = ({
  count = 140,
  areaSize = 22,
  centerPos = [1.5, 0, -0.5],
  visible = true,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Moisture particles concentrated in 0.4 - 3.8 km layer
  const [positions, metadata] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const meta = [];

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Heavier concentration on maritime west and near convective center
      const bias = Math.random() < 0.6;
      let x = bias
        ? centerPos[0] + (Math.random() - 0.5) * 8
        : (Math.random() - 0.5) * areaSize;
      let z = bias
        ? centerPos[2] + (Math.random() - 0.5) * 8
        : (Math.random() - 0.5) * areaSize;
      let y = 0.4 + Math.random() * 3.4;

      pos[idx] = x;
      pos[idx + 1] = y;
      pos[idx + 2] = z;

      meta.push({
        speed: 0.03 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return [pos, meta];
  }, [count, areaSize, centerPos]);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !visible) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);
      const m = metadata[i];

      // Moisture flows horizontally toward convective cell
      const dx = centerPos[0] - x;
      const dz = centerPos[2] - z;
      const dist = Math.hypot(dx, dz);

      if (dist > 1.0) {
        x += (dx / dist) * m.speed * 0.6;
        z += (dz / dist) * m.speed * 0.6;
        // Wavy gentle ascent
        y += 0.006 + Math.sin(t * 1.5 + m.phase) * 0.002;
      } else {
        // Reached updraft root: parcels condense / rise into cloud base and cycle out
        y += 0.03;
        if (y > 4.2) {
          x = (Math.random() - 0.5) * areaSize;
          z = (Math.random() - 0.5) * areaSize;
          y = 0.5 + Math.random() * 1.5;
        }
      }

      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#38bdf8"
        size={0.22}
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
};
