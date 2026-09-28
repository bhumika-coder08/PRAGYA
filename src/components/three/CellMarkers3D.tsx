import React from 'react';
import { Html } from '@react-three/drei';
import { StormCell } from '../../types';
import { DEMO_CELL_POSITIONS_3D } from '../../data/demoAtmosphericData';

interface CellMarkers3DProps {
  cells: StormCell[];
  selectedCellId: string;
  onSelectCell: (cellId: string) => void;
}

export const CellMarkers3D: React.FC<CellMarkers3DProps> = ({
  cells,
  selectedCellId,
  onSelectCell,
}) => {
  return (
    <group>
      {cells.map((cell) => {
        const meta = DEMO_CELL_POSITIONS_3D[cell.id] || { position: [0, 0, 0] as [number, number, number] };
        const [x, y, z] = meta.position;
        const isSelected = selectedCellId === cell.id;

        const pinColor =
          cell.eventRisk >= 70 ? '#ef4444' : cell.eventRisk >= 40 ? '#f59e0b' : '#10b981';

        return (
          <group key={cell.id} position={[x, y + 0.3, z]}>
            {/* Base target ring on terrain surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[isSelected ? 1.0 : 0.6, isSelected ? 1.15 : 0.72, 24]} />
              <meshBasicMaterial
                color={isSelected ? '#38bdf8' : pinColor}
                transparent
                opacity={isSelected ? 0.9 : 0.55}
                side={2}
              />
            </mesh>

            {/* Vertical laser beacon pillar */}
            <mesh position={[0, isSelected ? 3.0 : 1.5, 0]}>
              <cylinderGeometry args={[0.03, 0.03, isSelected ? 6.0 : 3.0, 8]} />
              <meshBasicMaterial
                color={pinColor}
                transparent
                opacity={isSelected ? 0.75 : 0.35}
              />
            </mesh>

            {/* Clickable Sphere Reticle Pin */}
            <mesh
              position={[0, isSelected ? 6.2 : 3.2, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectCell(cell.id);
              }}
            >
              <sphereGeometry args={[isSelected ? 0.32 : 0.22, 16, 12]} />
              <meshStandardMaterial
                color={pinColor}
                emissive={pinColor}
                emissiveIntensity={isSelected ? 0.8 : 0.4}
              />
            </mesh>

            {/* 3D Label & Status Badge */}
            <Html
              position={[0, isSelected ? 6.8 : 3.8, 0]}
              distanceFactor={28}
              center
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCell(cell.id);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap transition-all shadow-lg flex items-center space-x-1.5 border ${
                  isSelected
                    ? 'bg-graphite-950 text-observation border-observation font-bold scale-105 ring-1 ring-observation/60'
                    : 'bg-graphite-900/90 text-slate-300 border-scientific-border hover:border-slate-500'
                }`}
                title="Click to focus camera and inspect cell dynamics"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pinColor }} />
                <span>{cell.id}</span>
                <span className="text-[8px] text-scientific-muted">
                  R:{cell.eventRisk}% P:{cell.predictability}%
                </span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
