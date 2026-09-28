import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { ConvectiveStage } from '../../types';

interface LightningVisualProps {
  active?: boolean;
  stage?: ConvectiveStage;
  centerPos?: [number, number, number];
}

export const LightningVisual: React.FC<LightningVisualProps> = ({
  active = true,
  stage = 'MATURE',
  centerPos = [1.5, 0, -0.5],
}) => {
  const [boltVisible, setBoltVisible] = useState(false);

  // Generate a procedural jagged lightning branch
  const boltPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    let current = new THREE.Vector3(centerPos[0] + 0.1, 7.8, centerPos[2] + 0.1);
    points.push(current.clone());

    const targetY = 0.25;
    const steps = 15;
    const dy = (targetY - current.y) / steps;

    for (let i = 0; i < steps; i++) {
      current.y += dy;
      current.x += (Math.random() - 0.5) * 0.65;
      current.z += (Math.random() - 0.5) * 0.65;
      points.push(current.clone());
    }

    return points;
  }, [boltVisible, centerPos]);

  // Create THREE.Line primitive object
  const lineObject = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(boltPoints);
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 3,
      transparent: true,
      opacity: 0.95,
    });
    return new THREE.Line(geometry, material);
  }, [boltPoints]);

  // Flash scheduler strictly dependent on storm stage
  useEffect(() => {
    if (!active || stage === 'STABLE' || stage === 'INITIATION') {
      setBoltVisible(false);
      return;
    }

    let isMounted = true;
    let timeoutId: any = null;

    const getDelayForStage = () => {
      switch (stage) {
        case 'EXTREME':
          return 1800 + Math.random() * 2200; // 1.8s to 4.0s
        case 'MATURE':
          return 4000 + Math.random() * 4000; // 4.0s to 8.0s
        case 'DEVELOPING':
          return 8000 + Math.random() * 6000; // 8.0s to 14.0s
        default:
          return 5000;
      }
    };

    const triggerFlash = () => {
      if (!isMounted) return;
      setBoltVisible(true);

      setTimeout(() => {
        if (!isMounted) return;
        setBoltVisible(false);
        timeoutId = setTimeout(triggerFlash, getDelayForStage());
      }, 100);
    };

    timeoutId = setTimeout(triggerFlash, getDelayForStage() * 0.5);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [active, stage]);

  if (!active || !boltVisible || stage === 'STABLE' || stage === 'INITIATION') return null;

  return (
    <group>
      {/* Lightning Bolt Line */}
      <primitive object={lineObject} />

      {/* Atmospheric illumination burst (restrained and non-distracting) */}
      <pointLight
        position={[centerPos[0], 6.5, centerPos[2]]}
        intensity={stage === 'EXTREME' ? 7.5 : 4.5}
        distance={22}
        color="#e0e7ff"
      />
    </group>
  );
};
