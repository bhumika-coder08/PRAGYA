import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WindVectorsProps {
  count?: number;
  areaSize?: number;
  centerPos?: [number, number, number];
}

export const WindVectors: React.FC<WindVectorsProps> = ({
  count = 84,
  areaSize = 24,
  centerPos = [1.5, 0, -0.5],
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate wind streamline particles at 3 physical tiers:
  // Tier 0: Low-level Boundary Inflow (converging towards centerPos)
  // Tier 1: Mid-level Environmental Shear (Westerly flow moving towards +X)
  // Tier 2: Upper-level Anvil Radial Divergence & Easterly Jet (moving outwards/westwards)
  const [positions, meta, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const m = [];
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const tier = i % 3;
      let x = (Math.random() - 0.5) * areaSize;
      let z = (Math.random() - 0.5) * areaSize;
      let y = 1.0;
      let r = 0.22, g = 0.74, b = 0.97; // Cyan observation default

      if (tier === 0) {
        // Low-level convergence (1-2.5 km)
        y = 0.8 + Math.random() * 1.8;
        r = 0.22; g = 0.74; b = 0.97;
        m.push({ tier, speed: 0.05 + Math.random() * 0.03, yBase: y });
      } else if (tier === 1) {
        // Mid-level shear (4.5-7.0 km)
        y = 4.5 + Math.random() * 2.5;
        r = 0.65; g = 0.52; b = 0.96; // Purple shear
        m.push({ tier, speed: 0.07 + Math.random() * 0.04, yBase: y });
      } else {
        // Upper troposphere outflow / anvil divergence (9.5-11.8 km)
        y = 9.5 + Math.random() * 2.2;
        r = 0.96; g = 0.62; b = 0.14; // Amber divergence
        m.push({ tier, speed: 0.08 + Math.random() * 0.05, yBase: y });
      }

      pos[idx] = x;
      pos[idx + 1] = y;
      pos[idx + 2] = z;

      col[idx] = r;
      col[idx + 1] = g;
      col[idx + 2] = b;
    }

    return [pos, m, col];
  }, [count, areaSize]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const half = areaSize / 2;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const info = meta[i];
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      if (info.tier === 0) {
        // Converging toward convective center
        const dx = centerPos[0] - x;
        const dz = centerPos[2] - z;
        const dist = Math.hypot(dx, dz);

        if (dist > 1.2) {
          x += (dx / dist) * info.speed;
          z += (dz / dist) * info.speed;
        } else {
          // Parcel reaches convective root -> ascends vertically
          y += 0.04;
          if (y > 4.5) {
            // Respawn on outer boundary
            x = (Math.random() - 0.5) * areaSize;
            z = (Math.random() - 0.5) * areaSize;
            y = info.yBase;
          }
        }
      } else if (info.tier === 1) {
        // Deep layer cross-shear: moving towards +X with gentle tilt
        x += info.speed;
        z += 0.01;
        if (x > half) x = -half;
      } else {
        // Upper-level radial divergence outwards from storm core + easterly drift (-X)
        const dx = x - centerPos[0];
        const dz = z - centerPos[2];
        const dist = Math.max(1, Math.hypot(dx, dz));

        x += (dx / dist) * (info.speed * 0.7) - 0.04; // Easterly drift
        z += (dz / dist) * (info.speed * 0.7);

        if (Math.abs(x) > half || Math.abs(z) > half) {
          x = centerPos[0] + (Math.random() - 0.5) * 2;
          z = centerPos[2] + (Math.random() - 0.5) * 2;
        }
      }

      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.28}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
};
