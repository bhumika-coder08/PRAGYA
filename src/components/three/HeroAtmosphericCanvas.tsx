import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TerrainSurface } from './TerrainSurface';
import { AtmosphericGrid } from './AtmosphericGrid';
import { ConvectiveColumn } from './ConvectiveColumn';
import { WindVectors } from './WindVectors';
import { MoistureParticles } from './MoistureParticles';
import { HailGrowthZone } from './HailGrowthZone';
import { ThreeErrorBoundary } from './ThreeErrorBoundary';

const HeroOrbitingRig: React.FC = () => {
  const rigRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    if (!rigRef.current) return;
    const t = clock.getElapsedTime() * 0.12;

    // Slow cinematic evolution with subtle mouse parallax
    const targetRotY = t + mouseRef.current.x * 0.25;
    const targetRotX = mouseRef.current.y * 0.08;

    rigRef.current.rotation.y = THREE.MathUtils.lerp(rigRef.current.rotation.y, targetRotY, 0.04);
    rigRef.current.rotation.x = THREE.MathUtils.lerp(rigRef.current.rotation.x, targetRotX, 0.04);
  });

  return (
    <group ref={rigRef} position={[0, -2, 0]}>
      {/* 1. Terrain elevation */}
      <TerrainSurface size={26} segments={44} />

      {/* 2. Vertical Atmospheric Grid */}
      <AtmosphericGrid size={26} maxAltitude={12} showLabels={false} />

      {/* 3. Developing Convective Column */}
      <ConvectiveColumn timelinePoint="NOW" position={[1.2, 0, -0.4]} opacity={0.8} />

      {/* 4. Wind Vectors & Shear Streamlines */}
      <WindVectors count={80} areaSize={24} />

      {/* 5. Moisture Flux Cloud */}
      <MoistureParticles count={140} areaSize={22} />

      {/* 6. Hail Zone (-10°C to -40°C) */}
      <HailGrowthZone areaSize={24} minAltitude={5.5} maxAltitude={8.5} />
    </group>
  );
};

export const HeroAtmosphericCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full min-h-[480px] overflow-hidden pointer-events-none ${className}`}>
      <ThreeErrorBoundary fallbackMessage="Scientific visual active in 2D mode">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-graphite-950">
              <span className="text-xs font-mono text-scientific-muted animate-pulse">
                INITIALIZING ATMOSPHERIC SIMULATION ENGINE...
              </span>
            </div>
          }
        >
          <Canvas
            camera={{ position: [17, 11, 19], fov: 42 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 1.5]}
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[18, 22, 12]} intensity={1.2} />
            <directionalLight position={[-14, 12, -10]} intensity={0.35} color="#38bdf8" />
            <pointLight position={[0, 10, 0]} intensity={0.6} color="#c084fc" />

            <HeroOrbitingRig />
          </Canvas>
        </Suspense>
      </ThreeErrorBoundary>

      {/* Subtle vignette & bottom gradient to blend into page */}
      <div className="absolute inset-0 bg-gradient-to-t from-graphite-950 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-graphite-950/80 via-transparent to-graphite-950/80 pointer-events-none" />
    </div>
  );
};
