import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { TerrainSurface } from './TerrainSurface';
import { OrographicLiftVectors } from './OrographicLiftVectors';
import { AtmosphericGrid } from './AtmosphericGrid';
import { ConvectiveColumn } from './ConvectiveColumn';
import { AtmosphericXRayLabels } from './AtmosphericXRayLabels';
import { WindVectors } from './WindVectors';
import { UpdraftDowndraftArrows } from './UpdraftDowndraftArrows';
import { MoistureParticles } from './MoistureParticles';
import { PrecipitationVolume } from './PrecipitationVolume';
import { HailGrowthZone } from './HailGrowthZone';
import { LightningVisual } from './LightningVisual';
import { ObservationGapHighlight } from './ObservationGapHighlight';
import { CellMarkers3D } from './CellMarkers3D';
import { CameraController } from './CameraController';
import { ThreeErrorBoundary } from './ThreeErrorBoundary';
import { VisualLayerState, TimelinePoint } from '../../context/AtmosphericContext';
import { ConvectiveStage, CameraPreset, StormCell } from '../../types';
import { atmosphericService } from '../../services/atmosphericService';

export interface AtmosphericSceneProps {
  layers?: VisualLayerState;
  timelinePoint?: TimelinePoint;
  stage?: ConvectiveStage;
  isXRayMode?: boolean;
  cameraPreset?: CameraPreset;
  selectedCellId?: string;
  onSelectCell?: (id: string) => void;
  selectedAltitudeKm?: number;
  onSelectAltitude?: (km: number) => void;
  showGapHighlight?: boolean;
  gapMinY?: number;
  gapMaxY?: number;
  gapLabel?: string;
  showOrographicLift?: boolean;
  autoRotate?: boolean;
  className?: string;
}

const defaultLayerState: VisualLayerState = {
  cloud: true,
  moisture: true,
  wind: true,
  temperature: true,
  updraft: true,
  downdraft: true,
  lightning: true,
  precipitation: true,
  hailZone: true,
};

const SceneContent: React.FC<AtmosphericSceneProps> = ({
  layers = defaultLayerState,
  timelinePoint = 'NOW',
  stage = 'MATURE',
  isXRayMode = false,
  cameraPreset = 'STORM',
  selectedCellId = 'CX-017',
  onSelectCell,
  selectedAltitudeKm,
  onSelectAltitude,
  showGapHighlight = false,
  gapMinY = 2.1,
  gapMaxY = 3.4,
  gapLabel = 'Vertical Humidity Structure',
  showOrographicLift = true,
  autoRotate = false,
}) => {
  const cells: StormCell[] = atmosphericService.getActiveStormCells();
  const cellMeta = atmosphericService.getCell3DPosition(selectedCellId);
  const cellPos = cellMeta.position;

  return (
    <>
      <PerspectiveCamera makeDefault position={[18, 14, 20]} fov={45} />

      {/* Smooth Camera Controller with presets and target centering */}
      <CameraController
        preset={cameraPreset}
        selectedCellId={selectedCellId}
        autoRotate={autoRotate}
      />

      {/* Atmospheric illumination */}
      <ambientLight intensity={isXRayMode ? 0.6 : 0.45} />
      <directionalLight position={[15, 25, 12]} intensity={1.1} castShadow />
      <directionalLight position={[-15, 15, -10]} intensity={0.35} color="#38bdf8" />
      <pointLight position={[0, 14, 0]} intensity={0.5} color="#93c5fd" />

      {/* 1. Procedural Mountain & Valley Terrain Surface */}
      <TerrainSurface size={26} segments={56} showBadge={true} />

      {/* 2. Orographic Forced Lift Streamlines */}
      {showOrographicLift && <OrographicLiftVectors visible={true} />}

      {/* 3. 0–12 km Vertical Atmospheric Altitude Grid (Clickable) */}
      {layers.temperature && (
        <AtmosphericGrid
          size={26}
          maxAltitude={12}
          showLabels={true}
          selectedAltitudeKm={selectedAltitudeKm}
          onSelectAltitude={onSelectAltitude}
        />
      )}

      {/* 4. Developing Convective Cloud Column (5 Stages & X-Ray support) */}
      {layers.cloud && (
        <ConvectiveColumn
          stage={stage}
          isXRayMode={isXRayMode}
          position={cellPos}
        />
      )}

      {/* 5. Atmospheric X-Ray Scientific Leader Labels */}
      {isXRayMode && <AtmosphericXRayLabels visible={true} />}

      {/* 6. Multi-level Wind Streamlines (Convergence, Shear, Outflow) */}
      {layers.wind && <WindVectors count={84} areaSize={24} centerPos={cellPos} />}

      {/* 7. Updraft & Downdraft Streamline Vectors */}
      {(layers.updraft || layers.downdraft) && (
        <UpdraftDowndraftArrows
          showUpdraft={layers.updraft}
          showDowndraft={layers.downdraft}
          centerPosition={cellPos}
          stage={stage}
          isXRayMode={isXRayMode}
        />
      )}

      {/* 8. Moisture Field Particles */}
      {layers.moisture && (
        <MoistureParticles
          count={140}
          areaSize={22}
          centerPos={cellPos}
          visible={layers.moisture}
        />
      )}

      {/* 9. Precipitation Shaft (Originating from Cloud Base) */}
      {layers.precipitation && (
        <PrecipitationVolume
          stage={stage}
          centerPosition={[cellPos[0] + 0.9, 0, cellPos[2] + 0.8]}
          visible={layers.precipitation}
        />
      )}

      {/* 10. Hail-Growth Zone (-10°C to -40°C) with Scientific Tooltip */}
      {layers.hailZone && (
        <HailGrowthZone
          areaSize={24}
          minAltitude={5.5}
          maxAltitude={8.5}
          stage={stage}
          showTooltip={true}
        />
      )}

      {/* 11. Procedural Lightning Flashes (Stage-Bound Frequency) */}
      {layers.lightning && (
        <LightningVisual
          active={layers.lightning}
          stage={stage}
          centerPos={cellPos}
        />
      )}

      {/* 12. 3D Interactive Cell Markers on Terrain Plane */}
      <CellMarkers3D
        cells={cells}
        selectedCellId={selectedCellId}
        onSelectCell={(id) => onSelectCell && onSelectCell(id)}
      />

      {/* 13. Transparent Observation Gap Volume */}
      {showGapHighlight && (
        <ObservationGapHighlight
          visible={true}
          minY={gapMinY}
          maxY={gapMaxY}
          sizeX={9}
          sizeZ={9}
          variable={gapLabel}
        />
      )}
    </>
  );
};

export const AtmosphericScene: React.FC<AtmosphericSceneProps> = (props) => {
  return (
    <div className={`relative w-full h-full min-h-[480px] bg-graphite-950 overflow-hidden ${props.className || ''}`}>
      <ThreeErrorBoundary fallbackMessage="3D Atmospheric Volume renderer could not initialize. Schematic 2D layer active.">
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center space-y-3 bg-graphite-950">
              <div className="w-8 h-8 border-2 border-predictability border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-scientific-muted">
                INITIALIZING 0–12 KM ATMOSPHERIC DIGITAL TWIN...
              </span>
            </div>
          }
        >
          <Canvas
            shadows
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            dpr={[1, 1.5]} // Performance optimized for normal laptops
          >
            <SceneContent {...props} />
          </Canvas>
        </Suspense>
      </ThreeErrorBoundary>
    </div>
  );
};
