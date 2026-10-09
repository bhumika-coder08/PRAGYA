import React, { useState, useEffect } from 'react';
import { useAtmosphere, TimelinePoint, VisualLayerState } from '../context/AtmosphericContext';
import { AtmosphericScene } from '../components/three/AtmosphericScene';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';
import { atmosphericService } from '../services/atmosphericService';
import { replayClock } from '../services/replayClockService';
import { ConvectiveStage, CameraPreset, VerticalProfileLevel } from '../types';
import {
  Box,
  Layers,
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  ArrowUp,
  ArrowDown,
  Zap,
  CloudRain,
  Snowflake,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  Compass,
  Info,
  Maximize2,
  Scan,
  GitBranch,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Camera,
  ChevronDown,
  ChevronUp,
  X,
  Radio,
  Mountain
} from 'lucide-react';

const timelineSteps: { key: TimelinePoint; label: string; desc: string; stage: ConvectiveStage }[] = [
  { key: '-3h', label: '-3h', desc: 'Boundary Layer Accumulation', stage: 'STABLE' },
  { key: '-2h', label: '-2h', desc: 'Cumulus Congestus Growth', stage: 'INITIATION' },
  { key: '-1h', label: '-1h', desc: 'Capping Inversion Breach', stage: 'DEVELOPING' },
  { key: 'NOW', label: 'NOW', desc: 'Mature Deep Convection (Focus: CX-017)', stage: 'MATURE' },
  { key: '+30m', label: '+30m', desc: 'Peak Overshooting Top', stage: 'EXTREME' },
  { key: '+1h', label: '+1h', desc: 'Cold Pool Squall Outflow', stage: 'EXTREME' },
  { key: '+3h', label: '+3h', desc: 'Stratiform Anvil Dispersion', stage: 'MATURE' },
  { key: '+6h', label: '+6h', desc: 'Cell Dissipation', stage: 'STABLE' },
];

export const DigitalTwinPage: React.FC = () => {
  const {
    layers,
    toggleLayer,
    resetLayers,
    timelinePoint,
    setTimelinePoint,
    selectedCell,
    setSelectedCellId,
    cells
  } = useAtmosphere();

  // Advanced Visualization States
  const [isXRayMode, setIsXRayMode] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('STORM');
  const [selectedAltitudeKm, setSelectedAltitudeKm] = useState<number>(4); // Freezing level default
  const [showFuturesModal, setShowFuturesModal] = useState<boolean>(false);
  const [showOrographicLift, setShowOrographicLift] = useState<boolean>(true);
  const [showGapHighlight, setShowGapHighlight] = useState<boolean>(false);

  // Responsive panel collapses
  const [layersPanelOpen, setLayersPanelOpen] = useState<boolean>(true);
  const [soundingPanelOpen, setSoundingPanelOpen] = useState<boolean>(true);

  // Timeline Playback & ReplayClock Synchronization
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [replayMinute, setReplayMinute] = useState<number>(replayClock.getCurrentMinute());

  // Synchronize 3D Digital Twin with master ReplayClock
  useEffect(() => {
    const unsub = replayClock.subscribe((min) => {
      setReplayMinute(min);
      if (min <= -150) setTimelinePoint('-3h');
      else if (min <= -90) setTimelinePoint('-2h');
      else if (min <= -47) setTimelinePoint('-1h');
      else setTimelinePoint('NOW');
    });
    return () => unsub();
  }, [setTimelinePoint]);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setTimelinePoint((prev) => {
          const idx = timelineSteps.findIndex((s) => s.key === prev);
          const nextIdx = (idx + 1) % timelineSteps.length;
          const nextKey = timelineSteps[nextIdx].key;
          if (nextKey === '-3h') replayClock.setTime(-180);
          else if (nextKey === '-2h') replayClock.setTime(-120);
          else if (nextKey === '-1h') replayClock.setTime(-60);
          else if (nextKey === 'NOW') replayClock.setTime(0);
          return nextKey;
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, setTimelinePoint]);

  const handleStepForward = () => {
    const idx = timelineSteps.findIndex((s) => s.key === timelinePoint);
    const nextIdx = (idx + 1) % timelineSteps.length;
    const nextKey = timelineSteps[nextIdx].key;
    if (nextKey === '-3h') replayClock.setTime(-180);
    else if (nextKey === '-2h') replayClock.setTime(-120);
    else if (nextKey === '-1h') replayClock.setTime(-60);
    else if (nextKey === 'NOW') replayClock.setTime(0);
    setTimelinePoint(nextKey);
  };

  const handleResetTimeline = () => {
    setIsPlaying(false);
    replayClock.setTime(-180);
    setTimelinePoint('-3h');
  };

  // Metric for current timeline point
  const currentMetric = atmosphericService.getTimelineMetric(timelinePoint);
  const activeStage: ConvectiveStage = currentMetric.stage;

  // Selected Altitude Profile Sounding
  const soundingProfile: VerticalProfileLevel =
    atmosphericService.getVerticalSoundingByAltitude(selectedAltitudeKm) ||
    atmosphericService.getVerticalSoundings()[4];

  // Visual Layer HUD configuration
  const layerItems: { key: keyof VisualLayerState; label: string; icon: any; color: string }[] = [
    { key: 'cloud', label: 'Cloud Volume', icon: Cloud, color: 'text-slate-200' },
    { key: 'moisture', label: 'Moisture Field', icon: Droplets, color: 'text-observation' },
    { key: 'wind', label: 'Wind Vectors', icon: Wind, color: 'text-cyan-400' },
    { key: 'temperature', label: 'Temperature Grid', icon: Thermometer, color: 'text-amber-400' },
    { key: 'updraft', label: 'Updraft Core', icon: ArrowUp, color: 'text-red-400' },
    { key: 'downdraft', label: 'Downdraft Shaft', icon: ArrowDown, color: 'text-blue-400' },
    { key: 'lightning', label: 'Lightning Activity', icon: Zap, color: 'text-amber-300' },
    { key: 'precipitation', label: 'Precipitation Volume', icon: CloudRain, color: 'text-observation-light' },
    { key: 'hailZone', label: 'Hail Growth Zone', icon: Snowflake, color: 'text-predictability-light' },
  ];

  return (
    <div className="space-y-4 flex flex-col h-full font-sans text-xs">
      {/* =================================================================== */}
      {/* TOP SCIENTIFIC TOOLBAR */}
      {/* =================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-graphite-900 border border-scientific-border p-3.5 rounded-lg shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-base font-heading font-bold text-slate-100">
                3D Atmospheric Digital Twin (0–12 km)
              </h2>
              <SimulatedDataBadge size="sm" />
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Interactive Volumetric Reconstruction · Focus: <strong className="text-sky-400 font-mono font-semibold">{selectedCell.id}</strong> ({selectedCell.region})
            </p>
          </div>
        </div>

        {/* Action Buttons: ReplayClock Sync, X-Ray & Explore Possible Futures */}
        <div className="flex flex-wrap items-center gap-2">
          {/* ReplayClock Sync Indicator */}
          <div className="flex items-center space-x-2 px-2.5 py-1 rounded-md bg-graphite-950 border border-scientific-border text-xs font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-medium">Replay:</span>
            <span className="text-sky-400 font-mono font-semibold">
              {replayMinute === 0 ? 'T0' : `T${replayMinute}m`}
            </span>
          </div>

          {/* ATMOSPHERIC X-RAY TOGGLE BUTTON */}
          <button
            onClick={() => setIsXRayMode(!isXRayMode)}
            className={`px-3 py-1.5 rounded-md font-sans text-xs font-medium border transition-colors flex items-center space-x-1.5 ${
              isXRayMode
                ? 'bg-rose-500/20 text-rose-200 border-rose-500/50 shadow-xs'
                : 'bg-graphite-950 text-slate-300 border-scientific-border hover:border-slate-700 hover:text-white'
            }`}
            title="Toggle Atmospheric X-Ray Cross Section: Reveal internal core, updrafts, and hail-growth zones"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Atmospheric X-Ray</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/40">
              {isXRayMode ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* EXPLORE POSSIBLE FUTURES BUTTON */}
          <button
            onClick={() => setShowFuturesModal(true)}
            className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md font-sans text-xs font-medium transition-colors flex items-center space-x-1.5 shadow-xs"
            title="Preview alternative atmospheric futures"
          >
            <GitBranch className="w-3.5 h-3.5 text-purple-400" />
            <span>Explore Possible Futures</span>
          </button>

          {/* Reset Layers */}
          <button
            onClick={resetLayers}
            className="px-2.5 py-1.5 bg-graphite-950 hover:bg-graphite-850 text-slate-400 hover:text-slate-200 border border-scientific-border rounded-md flex items-center space-x-1 font-sans text-xs transition-colors"
            title="Reset layer visibility defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECONDARY TOOLBAR: CAMERA PRESETS & CELL SWITCHER */}
      {/* =================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-graphite-900/80 border border-scientific-border px-3.5 py-2 rounded-lg shrink-0 text-xs">
        {/* Camera Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 font-sans">
          <span className="text-slate-400 mr-1 flex items-center space-x-1 text-xs font-medium">
            <Camera className="w-3.5 h-3.5" />
            <span>Camera:</span>
          </span>
          {(
            [
              { key: 'REGIONAL', label: 'Regional' },
              { key: 'STORM', label: 'Storm' },
              { key: 'CROSS_SECTION', label: 'Cross Section' },
              { key: 'TOP_DOWN', label: 'Top Down' },
              { key: 'GROUND_VIEW', label: 'Ground View' },
            ] as const
          ).map((preset) => (
            <button
              key={preset.key}
              onClick={() => setCameraPreset(preset.key)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                cameraPreset === preset.key
                  ? 'bg-sky-500/15 text-sky-200 font-semibold border border-sky-500/30 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 bg-graphite-950 border border-scientific-border'
              }`}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => setCameraPreset('REGIONAL')}
            className="px-2 py-1 text-slate-400 hover:text-white bg-graphite-950 rounded-md border border-scientific-border text-xs transition-colors"
            title="Reset camera viewpoint"
          >
            Reset
          </button>
        </div>

        {/* 3D Cell Focus Selector */}
        <div className="flex items-center space-x-2 text-xs font-sans">
          <span className="text-slate-400 font-medium">Focus Cell:</span>
          {cells.map((cell) => (
            <button
              key={cell.id}
              onClick={() => {
                setSelectedCellId(cell.id);
                setCameraPreset('STORM');
              }}
              className={`px-2.5 py-0.5 rounded-md font-mono text-xs transition-colors border ${
                selectedCell.id === cell.id
                  ? 'bg-sky-500/15 text-sky-200 font-semibold border-sky-500/40 shadow-xs'
                  : 'bg-graphite-950 text-slate-400 border-scientific-border hover:text-slate-200 hover:bg-graphite-850'
              }`}
            >
              {cell.id}
            </button>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3D CANVAS VIEWPORT WITH FLOATING SCIENTIFIC HUD PANELS */}
      {/* =================================================================== */}
      <div className="relative flex-1 min-h-[540px] bg-graphite-950 border border-scientific-border rounded-lg overflow-hidden flex flex-col">
        {/* Main 3D Canvas */}
        <div className="w-full flex-1 relative">
          <AtmosphericScene
            layers={layers}
            timelinePoint={timelinePoint}
            stage={activeStage}
            isXRayMode={isXRayMode}
            cameraPreset={cameraPreset}
            selectedCellId={selectedCell.id}
            onSelectCell={(id) => {
              setSelectedCellId(id);
              setCameraPreset('STORM');
            }}
            selectedAltitudeKm={selectedAltitudeKm}
            onSelectAltitude={(km) => {
              setSelectedAltitudeKm(km);
              setSoundingPanelOpen(true);
            }}
            showGapHighlight={showGapHighlight}
            showOrographicLift={showOrographicLift}
            autoRotate={false}
          />

          {/* =============================================================== */}
          {/* FLOATING HUD: PREDICTABILITY TRANSITION INSTRUMENT (TOP-CENTER) */}
          {/* =============================================================== */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-graphite-900/94 border border-scientific-border px-4 py-2.5 rounded-lg shadow-2xl backdrop-blur-md flex items-center space-x-4 select-none pointer-events-none">
            {/* Event Risk */}
            <div className="text-center font-sans">
              <span className="text-[10px] font-medium text-slate-400 block uppercase tracking-wide">Event Risk</span>
              <span className={`text-base font-semibold font-mono tabular-nums ${currentMetric.stormRisk >= 70 ? 'text-rose-400' : 'text-amber-400'}`}>
                {currentMetric.stormRisk}%
              </span>
            </div>

            <div className="w-px h-6 bg-slate-700/60" />

            {/* Predictability */}
            <div className="text-center font-sans">
              <span className="text-[10px] font-medium text-purple-300 block uppercase tracking-wide">Predictability</span>
              <span className={`text-base font-semibold font-mono tabular-nums ${currentMetric.predictability >= 70 ? 'text-purple-300' : 'text-slate-400'}`}>
                {currentMetric.predictability}%
              </span>
            </div>

            <div className="w-px h-6 bg-slate-700/60" />

            {/* Observation Confidence */}
            <div className="text-center font-sans">
              <span className="text-[10px] font-medium text-sky-400 block uppercase tracking-wide">Obs. Confidence</span>
              <span className="text-base font-semibold font-mono text-sky-300 tabular-nums">
                {currentMetric.observationConfidence}%
              </span>
            </div>

            {/* Restrained Threshold Crossed Marker */}
            {currentMetric.isThresholdCrossed && (
              <div className="pl-2 border-l border-slate-700/60 flex items-center space-x-1.5 text-emerald-400 font-sans">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-medium uppercase tracking-wide whitespace-nowrap">
                  Threshold Crossed
                </span>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* FLOATING HUD: LAYER CONTROLS (TOP-LEFT) */}
          {/* =============================================================== */}
          <div className="absolute top-4 left-4 z-10 bg-graphite-900/94 border border-scientific-border rounded-lg shadow-xl backdrop-blur-md max-w-xs w-64 select-none">
            <div
              onClick={() => setLayersPanelOpen(!layersPanelOpen)}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-graphite-850 rounded-t-lg border-b border-scientific-border"
            >
              <div className="flex items-center space-x-2 text-slate-200 font-heading font-semibold text-xs">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Atmospheric Layers</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono text-slate-400">
                  {Object.values(layers).filter(Boolean).length}/9
                </span>
                {layersPanelOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </div>

            {layersPanelOpen && (
              <div className="p-2.5 space-y-1 max-h-56 overflow-y-auto pr-1">
                {layerItems.map((item) => {
                  const Icon = item.icon;
                  const isEnabled = layers[item.key];

                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleLayer(item.key)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors text-left text-xs font-sans ${
                        isEnabled
                          ? 'bg-sky-500/10 text-slate-100 border border-sky-500/20 font-medium'
                          : 'text-slate-400 hover:text-slate-200 bg-graphite-950/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isEnabled ? item.color : 'text-slate-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span
                        className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center text-[10px] font-mono font-bold ${
                          isEnabled
                            ? 'bg-sky-500 text-slate-950'
                            : 'border border-slate-700 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                    </button>
                  );
                })}

                {/* Additional Feature Toggles */}
                <div className="pt-2 border-t border-scientific-border/80 space-y-1">
                  <button
                    onClick={() => setShowOrographicLift(!showOrographicLift)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors text-xs font-sans ${
                      showOrographicLift
                        ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20 font-medium'
                        : 'text-slate-400 bg-graphite-950/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Mountain className="w-3.5 h-3.5" />
                      <span>Orographic Lift</span>
                    </div>
                    <span className="text-[10px] font-mono">{showOrographicLift ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => setShowGapHighlight(!showGapHighlight)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors text-xs font-sans ${
                      showGapHighlight
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium'
                        : 'text-slate-400 bg-graphite-950/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Scan className="w-3.5 h-3.5" />
                      <span>Observation Gap</span>
                    </div>
                    <span className="text-[10px] font-mono">{showGapHighlight ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* FLOATING HUD: VERTICAL SOUNDING PROFILE (TOP-RIGHT) */}
          {/* =============================================================== */}
          <div className="absolute top-4 right-4 z-10 bg-graphite-900/94 border border-scientific-border rounded-lg shadow-xl backdrop-blur-md max-w-xs w-72 select-none">
            <div
              onClick={() => setSoundingPanelOpen(!soundingPanelOpen)}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-graphite-850 rounded-t-lg border-b border-scientific-border"
            >
              <div>
                <span className="font-heading font-semibold text-xs text-slate-200 block">
                  Vertical Sounding Profile
                </span>
                <span className="text-[10px] text-amber-400 font-sans">
                  Simulated Profile
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sky-300 font-mono text-xs font-semibold">
                  {selectedAltitudeKm} km
                </span>
                {soundingPanelOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </div>

            {soundingPanelOpen && (
              <div className="p-3 space-y-2.5">
                {/* Clickable Altitude Selector Ticks */}
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block mb-1">
                    Altitude Level:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {[0, 1, 2, 3, 4, 6, 8, 10, 12].map((km) => (
                      <button
                        key={km}
                        onClick={() => setSelectedAltitudeKm(km)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                          selectedAltitudeKm === km
                            ? 'bg-sky-500 text-slate-950 font-semibold'
                            : 'bg-graphite-950 text-slate-400 hover:text-white border border-scientific-border'
                        }`}
                      >
                        {km}k
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sounding Telemetry Grid */}
                <div className="bg-graphite-950 p-2.5 rounded-md border border-scientific-border space-y-1.5 text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pressure:</span>
                    <span className="text-slate-200 font-mono font-semibold tabular-nums">
                      {soundingProfile.pressureHpa} hPa
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Temperature:</span>
                    <span className="text-amber-400 font-mono font-semibold tabular-nums">
                      {soundingProfile.temperatureC} °C
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Relative Humidity:</span>
                    <span className="text-sky-300 font-mono font-semibold tabular-nums">
                      {soundingProfile.relativeHumidity}% (DP: {soundingProfile.dewPointC}°C)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Wind Vector:</span>
                    <span className="text-sky-200 font-mono font-semibold tabular-nums text-[11px]">
                      {soundingProfile.windSpeedMs} m/s ({soundingProfile.windSpeedKnots} kt) @ {soundingProfile.windDirectionDeg}° {soundingProfile.windDirectionText}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vertical Velocity:</span>
                    <span className="text-rose-400 font-mono font-semibold tabular-nums">
                      +{soundingProfile.verticalVelocityMs} m/s
                    </span>
                  </div>
                </div>

                <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                  {soundingProfile.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* TIME MACHINE CONTROLS BAR (-3h, -2h, -1h, NOW, +30m, +1h, +3h, +6h) */}
        {/* =================================================================== */}
        <div className="bg-graphite-900 border-t border-scientific-border p-3.5 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Playback Controls & Status */}
            <div className="flex items-center space-x-2 font-sans">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-1.5 rounded-md font-medium text-xs flex items-center space-x-1.5 transition-colors ${
                  isPlaying
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-200 border border-sky-500/30'
                }`}
                title="Play through atmospheric lifecycle stages"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={handleStepForward}
                className="px-2.5 py-1.5 bg-graphite-950 hover:bg-graphite-850 text-slate-200 border border-scientific-border rounded-md flex items-center space-x-1 text-xs transition-colors"
                title="Step forward one stage"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Step</span>
              </button>

              <button
                onClick={handleResetTimeline}
                className="p-1.5 bg-graphite-950 hover:bg-graphite-850 text-slate-400 hover:text-slate-200 border border-scientific-border rounded-md transition-colors"
                title="Reset to beginning (-3h)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="pl-3 border-l border-scientific-border text-xs hidden md:flex items-center space-x-2">
                <span className="text-slate-400">Stage:</span>
                <span className="text-sky-300 font-heading font-semibold">{currentMetric.stage}</span>
                <span className="text-slate-400">({currentMetric.title})</span>
              </div>
            </div>

            {/* Stepped Timeline Buttons */}
            <div className="flex items-center space-x-1 bg-graphite-950 p-1 rounded-md border border-scientific-border overflow-x-auto max-w-full font-mono text-xs">
              {timelineSteps.map((step) => {
                const isCurrent = timelinePoint === step.key;
                return (
                  <button
                    key={step.key}
                    onClick={() => setTimelinePoint(step.key)}
                    className={`px-3 py-1 rounded transition-colors whitespace-nowrap font-medium ${
                      isCurrent
                        ? 'bg-sky-500/20 text-sky-200 font-semibold border border-sky-500/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-graphite-900'
                    }`}
                  >
                    {step.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* ATMOSPHERIC FUTURES PREVIEW MODAL */}
      {/* =================================================================== */}
      {showFuturesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-graphite-900 border border-scientific-border rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-scientific-border pb-3">
              <div className="flex items-center space-x-2">
                <GitBranch className="w-5 h-5 text-purple-400" />
                <h3 className="font-heading font-semibold text-sm text-slate-100 uppercase tracking-wide">
                  Atmospheric Futures Preview (Demo Ensembles)
                </h3>
              </div>
              <button
                onClick={() => setShowFuturesModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Alternative atmospheric evolution trajectories derived from multi-model perturbation ensembles. Labeled as demonstration ensemble futures (not operational predictions).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-graphite-950 p-3.5 rounded-lg border border-slate-700/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-heading font-semibold text-slate-300">1. Dissipation</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">18% LIKELIHOOD</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Mid-level dry air entrainment at 650 hPa cuts off updraft root. Capping inversion holds.
                </p>
              </div>

              <div className="bg-graphite-950 p-3.5 rounded-lg border border-sky-800/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-heading font-semibold text-sky-300">2. Ordinary Convection</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300">32% LIKELIHOOD</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Moderate single-cell rain showers with localized 20-minute downpours (15-25 mm/h).
                </p>
              </div>

              <div className="bg-graphite-950 p-3.5 rounded-lg border border-rose-800/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-heading font-semibold text-rose-300">3. Severe Convection</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300">36% LIKELIHOOD</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Supercell split with intense meso-cyclonic updraft, severe hail, and gusts &gt;75 km/h.
                </p>
              </div>

              <div className="bg-graphite-950 p-3.5 rounded-lg border border-purple-800/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-heading font-semibold text-purple-300">4. Extreme Rainfall</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300">14% LIKELIHOOD</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Stationary convective training anchored by Ghats topography triggering cloudburst (&gt;100 mm/h).
                </p>
              </div>
            </div>

            <div className="p-3 bg-graphite-950 rounded-md border border-scientific-border text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Scientific Note:</strong> These four attractors represent competing dynamical phase space paths. Full parameter breakdowns and member trajectories are available on the <strong className="text-purple-300">Future Ensembles</strong> page.
            </div>

            <div className="flex justify-end pt-2 border-t border-scientific-border">
              <button
                onClick={() => setShowFuturesModal(false)}
                className="px-4 py-1.5 bg-graphite-850 hover:bg-graphite-800 text-slate-200 border border-scientific-border font-medium text-xs rounded-md transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
