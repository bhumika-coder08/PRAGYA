import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ConvectiveStage } from '../../types';

interface UpdraftDowndraftArrowsProps {
  showUpdraft?: boolean;
  showDowndraft?: boolean;
  centerPosition?: [number, number, number];
  stage?: ConvectiveStage;
  isXRayMode?: boolean;
}

export const UpdraftDowndraftArrows: React.FC<UpdraftDowndraftArrowsProps> = ({
  showUpdraft = true,
  showDowndraft = true,
  centerPosition = [1.5, 0, -0.5],
  stage = 'MATURE',
  isXRayMode = false,
}) => {
  const updraftGroup = useRef<THREE.Group>(null);
  const downdraftGroup = useRef<THREE.Group>(null);

  // Speed and height modulated by convective stage
  const { updraftHeight, updraftSpeed, downdraftHeight, showDown } = React.useMemo(() => {
    switch (stage) {
      case 'STABLE':
        return { updraftHeight: 2.0, updraftSpeed: 0.15, downdraftHeight: 1.0, showDown: false };
      case 'INITIATION':
        return { updraftHeight: 4.5, updraftSpeed: 0.35, downdraftHeight: 1.5, showDown: false };
      case 'DEVELOPING':
        return { updraftHeight: 7.5, updraftSpeed: 0.6, downdraftHeight: 3.0, showDown: true };
      case 'MATURE':
        return { updraftHeight: 10.2, updraftSpeed: 0.9, downdraftHeight: 4.8, showDown: true };
      case 'EXTREME':
        return { updraftHeight: 11.5, updraftSpeed: 1.2, downdraftHeight: 5.5, showDown: true };
      default:
        return { updraftHeight: 10.2, updraftSpeed: 0.9, downdraftHeight: 4.8, showDown: true };
    }
  }, [stage]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (updraftGroup.current) {
      updraftGroup.current.position.y = (t * updraftSpeed) % 1.6;
    }
    if (downdraftGroup.current) {
      downdraftGroup.current.position.y = -((t * (updraftSpeed * 0.7)) % 1.6);
    }
  });

  const arrowOpacity = isXRayMode ? 0.95 : 0.75;

  return (
    <group position={centerPosition}>
      {/* UPDRAFT STREAMLINE VECTORS (Rising Core) */}
      {showUpdraft && (
        <group ref={updraftGroup}>
          {[
            { x: -0.5, y: updraftHeight * 0.45, z: 0.2, h: updraftHeight * 0.7, r: 0.16 },
            { x: 0.0, y: updraftHeight * 0.52, z: -0.1, h: updraftHeight * 0.88, r: 0.24 }, // Central core chimney
            { x: 0.6, y: updraftHeight * 0.42, z: 0.3, h: updraftHeight * 0.65, r: 0.15 },
          ].map((arrow, i) => (
            <group key={`up-${i}`} position={[arrow.x, arrow.y, arrow.z]}>
              {/* Shaft */}
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[arrow.r * 0.45, arrow.r * 0.65, arrow.h, 12]} />
                <meshBasicMaterial
                  color="#ef4444"
                  transparent
                  opacity={arrowOpacity}
                />
              </mesh>
              {/* Arrowhead */}
              <mesh position={[0, arrow.h / 2 + 0.35, 0]}>
                <coneGeometry args={[arrow.r * 1.8, 0.7, 12]} />
                <meshBasicMaterial color="#dc2626" />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* DOWNDRAFT STREAMLINE VECTORS (Descending Rain Shaft) */}
      {showDowndraft && showDown && (
        <group ref={downdraftGroup} position={[2.6, downdraftHeight * 0.6, 1.0]}>
          {[
            { x: 0.0, y: 0, z: 0.0, h: downdraftHeight, r: 0.18 },
            { x: 0.8, y: -0.4, z: 0.5, h: downdraftHeight * 0.8, r: 0.14 },
          ].map((arrow, i) => (
            <group key={`down-${i}`} position={[arrow.x, arrow.y, arrow.z]}>
              {/* Shaft */}
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[arrow.r * 0.65, arrow.r * 0.45, arrow.h, 12]} />
                <meshBasicMaterial
                  color="#38bdf8"
                  transparent
                  opacity={arrowOpacity}
                />
              </mesh>
              {/* Arrowhead pointing down */}
              <mesh position={[0, -arrow.h / 2 - 0.35, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[arrow.r * 1.8, 0.7, 12]} />
                <meshBasicMaterial color="#0284c7" />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </group>
  );
};
