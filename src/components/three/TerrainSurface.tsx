import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface TerrainSurfaceProps {
  size?: number;
  segments?: number;
  showBadge?: boolean;
}

export const TerrainSurface: React.FC<TerrainSurfaceProps> = ({
  size = 26,
  segments = 56,
  showBadge = true,
}) => {
  const { geometry, ridgePeakCoord } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    let maxH = 0;
    let peakX = 1.5, peakZ = 0;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Procedural Western Ghats topography:
      // Maritime Coastal plain to the west (x < -4, elevation ~0.2)
      // Steep escarpment ridge around x = 1.2 to 2.2 (elevation up to 2.4 units ~ 1,200m)
      // Escarpment notch / valley pass around z = 2.5
      // Inland Deccan plateau to the east (x > 3, elevation ~0.8 to 1.1)
      const baseRidge = Math.exp(-Math.pow((x - 1.6) / 2.6, 2)) * 2.2;
      const notchValley = Math.sin(z * 0.45) * 0.45 + Math.cos(x * 0.5) * 0.3;
      const microTerrain = Math.sin(x * 1.8) * Math.cos(z * 1.8) * 0.18;
      const coastalDrop = 1 / (1 + Math.exp(-(x + 3.5))); // Dampens height westward

      let height = Math.max(0.08, (baseRidge + notchValley + microTerrain) * coastalDrop);

      if (height > maxH) {
        maxH = height;
        peakX = x;
        peakZ = z;
      }

      pos.setY(i, height);
    }

    geo.computeVertexNormals();
    return { geometry: geo, ridgePeakCoord: [peakX, maxH, peakZ] as [number, number, number] };
  }, [size, segments]);

  return (
    <group position={[0, -0.05, 0]}>
      {/* Topographic Shaded Terrain Mesh */}
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          color="#121820"
          roughness={0.88}
          metalness={0.12}
          flatShading={true}
        />
      </mesh>

      {/* Wireframe Elevation Contour Layer */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color="#223348"
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      {/* Ground Boundary Bounding Frame */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(size, 0.1, size)]} />
        <lineBasicMaterial color="#334155" opacity={0.6} transparent />
      </lineSegments>

      {/* Scientific Terrain Badge in 3D */}
      {showBadge && (
        <Html position={[-size / 2 + 3.0, 0.25, size / 2 - 1.5]} distanceFactor={30}>
          <div className="bg-graphite-900/90 border border-scientific-border px-2 py-0.5 rounded text-[9px] font-mono text-scientific-muted select-none pointer-events-none whitespace-nowrap shadow-md">
            <span className="text-amber-400 font-bold mr-1">SIMULATED TERRAIN</span>
            <span>| WESTERN GHATS OROGRAPHY</span>
          </div>
        </Html>
      )}

      {/* Ridge crest annotation */}
      {showBadge && (
        <Html position={[1.6, 2.4, -6]} distanceFactor={32}>
          <div className="bg-graphite-950/85 border border-slate-700/80 px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-400 select-none pointer-events-none whitespace-nowrap">
            ESCARPMENT CREST (1,200m AGL)
          </div>
        </Html>
      )}
    </group>
  );
};
