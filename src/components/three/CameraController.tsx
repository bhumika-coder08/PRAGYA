import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { CameraPreset } from '../../types';
import { DEMO_CELL_POSITIONS_3D } from '../../data/demoAtmosphericData';

interface CameraControllerProps {
  preset: CameraPreset;
  selectedCellId?: string;
  autoRotate?: boolean;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  preset,
  selectedCellId = 'CX-017',
  autoRotate = false,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Target coordinates for smooth lerping
  const targetCameraPos = useRef(new THREE.Vector3(18, 14, 20));
  const targetLookAt = useRef(new THREE.Vector3(0, 4.5, 0));
  const isTransitioning = useRef(true);

  // Update target positions when preset or selected cell changes
  useEffect(() => {
    const cellMeta = DEMO_CELL_POSITIONS_3D[selectedCellId] || { position: [1.5, 0, -0.5] as [number, number, number] };
    const [cx, cy, cz] = cellMeta.position;

    switch (preset) {
      case 'REGIONAL':
        targetCameraPos.current.set(24, 18, 26);
        targetLookAt.current.set(0, 3, 0);
        break;
      case 'STORM':
        targetCameraPos.current.set(cx + 7.5, cy + 6.5, cz + 8.5);
        targetLookAt.current.set(cx, cy + 4.5, cz);
        break;
      case 'CROSS_SECTION':
        targetCameraPos.current.set(22, 5.5, 0);
        targetLookAt.current.set(0, 5.0, 0);
        break;
      case 'TOP_DOWN':
        targetCameraPos.current.set(0.05, 27, 0.05);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'GROUND_VIEW':
        targetCameraPos.current.set(cx + 2.5, 1.2, cz + 6.5);
        targetLookAt.current.set(cx, cy + 5.5, cz);
        break;
      default:
        targetCameraPos.current.set(18, 14, 20);
        targetLookAt.current.set(0, 4.5, 0);
        break;
    }

    isTransitioning.current = true;
  }, [preset, selectedCellId]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioning.current) {
      // Smooth lerp camera position
      camera.position.lerp(targetCameraPos.current, Math.min(1, delta * 3.5));
      // Smooth lerp orbit target
      controlsRef.current.target.lerp(targetLookAt.current, Math.min(1, delta * 3.5));
      controlsRef.current.update();

      // Check if close enough to stop forced transition
      if (
        camera.position.distanceTo(targetCameraPos.current) < 0.15 &&
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.15
      ) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    // OrbitControls with support for pan, zoom, rotate
    <primitive
      object={
        new OrbitControlsImpl(camera, document.querySelector('canvas') || undefined)
      }
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.04} // Prevent camera going below terrain plane
      minDistance={6}
      maxDistance={48}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      autoRotate={autoRotate}
      autoRotateSpeed={0.4}
    />
  );
};
