import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ConvectiveStage } from '../../types';

interface ConvectiveColumnProps {
  stage?: ConvectiveStage;
  timelinePoint?: string;
  isXRayMode?: boolean;
  position?: [number, number, number];
  opacity?: number;
}

export const ConvectiveColumn: React.FC<ConvectiveColumnProps> = ({
  stage,
  timelinePoint,
  isXRayMode = false,
  position = [1.5, 0, -0.5],
  opacity,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const anvilRef = useRef<THREE.Mesh>(null);
  const overshootingDomeRef = useRef<THREE.Mesh>(null);

  // Derive stage from timelinePoint if stage was not explicitly provided
  const resolvedStage: ConvectiveStage = useMemo(() => {
    if (stage) return stage;
    if (timelinePoint) {
      if (timelinePoint === '-3h' || timelinePoint === '+6h') return 'STABLE';
      if (timelinePoint === '-2h') return 'INITIATION';
      if (timelinePoint === '-1h') return 'DEVELOPING';
      if (timelinePoint === '+30m' || timelinePoint === '+1h') return 'EXTREME';
      return 'MATURE';
    }
    return 'MATURE';
  }, [stage, timelinePoint]);

  // Compute physical dimensions based on the 5 Convective Stages
  const { height, towerRadius, anvilRadius, verticalOffset, cloudColor, puffCount, showAnvil, showOvershoot } =
    useMemo(() => {
      switch (resolvedStage) {
        case 'STABLE':
          return {
            height: 2.2,
            towerRadius: 1.1,
            anvilRadius: 1.0,
            verticalOffset: 1.2,
            cloudColor: '#94a3b8',
            puffCount: 14,
            showAnvil: false,
            showOvershoot: false,
          };
        case 'INITIATION':
          return {
            height: 4.8,
            towerRadius: 1.6,
            anvilRadius: 2.0,
            verticalOffset: 2.5,
            cloudColor: '#cbd5e1',
            puffCount: 22,
            showAnvil: false,
            showOvershoot: false,
          };
        case 'DEVELOPING':
          return {
            height: 7.8,
            towerRadius: 2.2,
            anvilRadius: 4.2,
            verticalOffset: 4.1,
            cloudColor: '#e2e8f0',
            puffCount: 34,
            showAnvil: true,
            showOvershoot: false,
          };
        case 'MATURE':
          return {
            height: 10.6,
            towerRadius: 2.9,
            anvilRadius: 6.8,
            verticalOffset: 5.5,
            cloudColor: '#ffffff',
            puffCount: 46,
            showAnvil: true,
            showOvershoot: false,
          };
        case 'EXTREME':
          return {
            height: 12.0, // Pierces tropopause
            towerRadius: 3.4,
            anvilRadius: 8.5,
            verticalOffset: 6.2,
            cloudColor: '#f8fafc',
            puffCount: 54,
            showAnvil: true,
            showOvershoot: true,
          };
        default:
          return {
            height: 10.6,
            towerRadius: 2.9,
            anvilRadius: 6.8,
            verticalOffset: 5.5,
            cloudColor: '#ffffff',
            puffCount: 46,
            showAnvil: true,
            showOvershoot: false,
          };
      }
    }, [resolvedStage]);

  // Subtle convective boiling animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.04) * 0.04;
    }
    if (anvilRef.current) {
      anvilRef.current.scale.x = 1 + Math.sin(t * 0.25) * 0.02;
      anvilRef.current.scale.z = 1 + Math.cos(t * 0.25) * 0.02;
    }
    if (overshootingDomeRef.current) {
      overshootingDomeRef.current.position.y = height + 1.2 + Math.sin(t * 0.8) * 0.08;
    }
  });

  // Procedural cloud volumetric puffs (ellipsoids) distributed along height
  const cloudPuffs = useMemo(() => {
    const puffs = [];
    for (let i = 0; i < puffCount; i++) {
      const frac = i / puffCount;
      const y = frac * height + 1.1;
      const rad = (1 - frac * 0.25) * (towerRadius * 0.75);
      const angle = (i * 2.39996) % (Math.PI * 2); // Golden spiral
      const dist = Math.sqrt(frac) * rad * 0.85;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const scale = 0.95 + (i % 4) * 0.25;
      puffs.push({ x, y, z, scale, frac });
    }
    return puffs;
  }, [height, towerRadius, puffCount]);

  // Opacity modulation for Atmospheric X-Ray mode
  const effectiveOpacity = isXRayMode ? 0.18 : (opacity ?? 0.82);

  return (
    <group ref={groupRef} position={position}>
      {/* 1. Outer Convective Cloud Shell / Column */}
      <mesh position={[0, verticalOffset, 0]}>
        <cylinderGeometry
          args={[towerRadius * 1.15, towerRadius * 0.7, height, 20, 8, true]}
        />
        <meshStandardMaterial
          color={cloudColor}
          roughness={0.75}
          metalness={0.05}
          transparent
          opacity={effectiveOpacity * 0.55}
          side={THREE.DoubleSide}
          wireframe={isXRayMode}
        />
      </mesh>

      {/* 2. Procedural Volumetric Cloud Puffs */}
      {cloudPuffs.map((puff, idx) => (
        <mesh key={idx} position={[puff.x, puff.y, puff.z]}>
          <sphereGeometry args={[puff.scale * 1.12, 12, 10]} />
          <meshStandardMaterial
            color={puff.frac > 0.8 ? '#cbd5e1' : '#f8fafc'}
            roughness={0.85}
            transparent
            opacity={effectiveOpacity * (puff.frac > 0.75 ? 0.5 : 0.7)}
          />
        </mesh>
      ))}

      {/* 3. Internal Updraft Chimney Cylinder (Visible prominently in X-Ray mode) */}
      {isXRayMode && (
        <mesh position={[0, height / 2 + 0.5, 0]}>
          <cylinderGeometry args={[towerRadius * 0.45, towerRadius * 0.35, height * 0.9, 16]} />
          <meshStandardMaterial
            color="#ef4444"
            roughness={0.4}
            metalness={0.2}
            transparent
            opacity={0.45}
            emissive="#b91c1c"
            emissiveIntensity={0.25}
          />
        </mesh>
      )}

      {/* 4. Upper Anvil Outflow Shield (active in DEVELOPING, MATURE, EXTREME) */}
      {showAnvil && (
        <group position={[0, height + 0.6, 0]}>
          <mesh ref={anvilRef} position={[1.4, 0, -0.4]}>
            <cylinderGeometry
              args={[anvilRadius, anvilRadius * 0.65, 0.8, 24]}
            />
            <meshStandardMaterial
              color="#e2e8f0"
              roughness={0.9}
              transparent
              opacity={effectiveOpacity * 0.65}
              wireframe={isXRayMode}
            />
          </mesh>
        </group>
      )}

      {/* 5. Overshooting Top Dome (EXTREME Stage piercing tropopause >11 km) */}
      {showOvershoot && (
        <mesh ref={overshootingDomeRef} position={[0, height + 1.2, 0]}>
          <sphereGeometry args={[1.4, 16, 12]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.5}
            transparent
            opacity={effectiveOpacity * 0.85}
            emissive="#ffffff"
            emissiveIntensity={0.2}
          />
        </mesh>
      )}

      {/* 6. Cloud Base Dark Condensation Inversion Disk */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[towerRadius * 1.1, towerRadius * 0.85, 0.35, 16]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.95}
          transparent
          opacity={isXRayMode ? 0.25 : 0.85}
        />
      </mesh>
    </group>
  );
};
