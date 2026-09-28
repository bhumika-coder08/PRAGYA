import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface OrographicLiftVectorsProps {
  visible?: boolean;
}

export const OrographicLiftVectors: React.FC<OrographicLiftVectorsProps> = ({
  visible = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const streamPointsRef = useRef<THREE.Points>(null);

  // Generate 6 smooth streamline curves representing onshore moist air impinging on the ridge
  const curves = useMemo(() => {
    const list: THREE.CatmullRomCurve3[] = [];
    const zOffsets = [-5, -3, -1, 1, 3, 5];

    zOffsets.forEach((z) => {
      // Curve starts horizontally at sea level (x = -9, y = 0.5), moves toward mountain slope (x = -1, y = 1.0),
      // then lifts sharply upward over the crest (x = 1.4, y = 3.2), feeding into the updraft root (x = 2.0, y = 4.2)
      const p1 = new THREE.Vector3(-9.0, 0.4, z + (Math.random() - 0.5) * 0.5);
      const p2 = new THREE.Vector3(-4.5, 0.6, z + (Math.random() - 0.5) * 0.4);
      const p3 = new THREE.Vector3(-1.2, 1.2, z);
      const p4 = new THREE.Vector3(0.8, 2.6, z * 0.8 - 0.3); // Ascent
      const p5 = new THREE.Vector3(1.8, 3.8, z * 0.6 - 0.5); // Lift into convective base

      list.push(new THREE.CatmullRomCurve3([p1, p2, p3, p4, p5]));
    });

    return list;
  }, []);

  // Geometry for static streamline paths
  const lineGeometries = useMemo(() => {
    return curves.map((c) => new THREE.BufferGeometry().setFromPoints(c.getPoints(36)));
  }, [curves]);

  // Moving air parcels along the curves
  const particleCount = 48;
  const [particleData] = useMemo(() => {
    const items = [];
    for (let i = 0; i < particleCount; i++) {
      items.push({
        curveIdx: i % curves.length,
        progress: (i / particleCount) + Math.random() * 0.1,
        speed: 0.14 + Math.random() * 0.05,
      });
    }
    return [items];
  }, [curves, particleCount]);

  const particlePositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);

  useFrame((_, delta) => {
    if (!streamPointsRef.current) return;
    const posAttr = streamPointsRef.current.geometry.attributes.position;

    for (let i = 0; i < particleCount; i++) {
      const item = particleData[i];
      item.progress += item.speed * delta;
      if (item.progress > 1.0) item.progress -= 1.0;

      const curve = curves[item.curveIdx];
      const point = curve.getPoint(item.progress);

      posAttr.setXYZ(i, point.x, point.y, point.z);
    }
    posAttr.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {/* 6 Curved Streamlines with gentle glow */}
      {lineGeometries.map((geo, idx) => (
        <primitive
          key={`curve-${idx}`}
          object={
            new THREE.Line(
              geo,
              new THREE.LineBasicMaterial({
                color: 0x38bdf8,
                transparent: true,
                opacity: 0.35,
              })
            )
          }
        />
      ))}

      {/* Animated Air Parcel Points Traveling along Curves */}
      <points ref={streamPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#38bdf8"
          size={0.24}
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      {/* Floating 3D annotation on the lift slope */}
      <Html position={[-0.5, 2.2, 0]} distanceFactor={30}>
        <div className="bg-graphite-950/85 border border-observation/50 px-2 py-0.5 rounded text-[9px] font-mono text-observation whitespace-nowrap shadow-lg flex items-center space-x-1 select-none pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-observation animate-ping" />
          <span className="font-semibold">OROGRAPHIC FORCED ASCENT</span>
        </div>
      </Html>
    </group>
  );
};
