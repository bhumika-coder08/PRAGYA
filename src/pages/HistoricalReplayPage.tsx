import React, { useState, useEffect } from 'react';
import { atmosphericService } from '../services/atmosphericService';
import { predictabilityEngine } from '../services/predictabilityEngine';
import { HistoricalEvent, HistoricalStep } from '../types';
import { RiskGauge } from '../components/common/RiskGauge';
import { PredictabilityGauge } from '../components/common/PredictabilityGauge';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';
import { ResearchEventLogList } from '../components/common/ResearchEventLogList';
import { ObservationSufficiencyCard } from '../components/common/ObservationSufficiencyCard';
import { DataAvailabilityMatrix } from '../components/common/DataAvailabilityMatrix';
import { DataProvenanceModal } from '../components/common/DataProvenanceModal';
import { dataQualityEngine } from '../services/dataQualityEngine';
import { replayClock } from '../services/replayClockService';
import { DataProvenance } from '../types/observation';
import {
  History,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  Clock,
  Radio,
  Zap,
  Info,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

export const HistoricalReplayPage: React.FC = () => {
  const events = atmosphericService.getHistoricalEvents();
  const [selectedEventId, setSelectedEventId] = useState(events[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // Starts at T-180
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlindReplayActive, setIsBlindReplayActive] = useState(true);

  const event = events.find((e) => e.id === selectedEventId) || events[0];
  const currentStep = event.steps[currentStepIndex];
  const isThresholdPassed = currentStep.isThresholdCrossed;

  const currentRegime = predictabilityEngine.classifyRegime(currentStep.predictability);

  // Data Provenance Modal State
  const [provenanceModalOpen, setProvenanceModalOpen] = useState<boolean>(false);
  const [inspectedVariable, setInspectedVariable] = useState<string>('Radar Reflectivity');
  const [inspectedProvenance, setInspectedProvenance] = useState<DataProvenance>(() =>
    dataQualityEngine.getProvenance('radarreflectivity', currentStep.minute)
  );

  const handleOpenProvenance = (varName: string) => {
    setInspectedVariable(varName);
    setInspectedProvenance(dataQualityEngine.getProvenance(varName, currentStep.minute));
    setProvenanceModalOpen(true);
  };

  // Synchronize master ReplayClock
  useEffect(() => {
    replayClock.setTime(currentStep.minute);
  }, [currentStep.minute]);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < event.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, event.steps.length]);

  const handleStepForward = () => {
    if (currentStepIndex < event.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Header & Event Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-graphite-900 border border-scientific-border p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-observation/15 border border-observation/40 text-observation">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-mono text-base font-bold text-slate-100">
                HISTORICAL BLIND REPLAY TESTBED
              </h2>
              <SimulatedDataBadge size="sm" />
            </div>
            <p className="text-xs text-scientific-muted font-mono">
              Strict causal verification: Replaying past extreme events with future observations locked (no future data leakage).
            </p>
          </div>
        </div>

        {/* Controls: Blind Replay Toggle & Event Dropdown */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          {/* Blind Replay Mode Toggle */}
          <button
            onClick={() => setIsBlindReplayActive(!isBlindReplayActive)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded border transition-colors ${
              isBlindReplayActive
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                : 'bg-graphite-950 border-scientific-border text-scientific-muted'
            }`}
          >
            {isBlindReplayActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>BLIND REPLAY: {isBlindReplayActive ? 'STRICT LOCKED' : 'OPEN AUDIT'}</span>
          </button>

          {/* Event Select Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-scientific-muted">CASE:</span>
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setCurrentStepIndex(0);
                setIsPlaying(false);
              }}
              className="bg-graphite-950 text-slate-200 border border-scientific-border px-3 py-1.5 rounded font-mono focus:outline-none"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.code} — {ev.name} ({ev.date})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* EXPLICIT EVENT PROVENANCE & BENCHMARK CLASSIFICATION */}
      <div className="bg-graphite-950 border border-purple-500/40 p-3.5 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2.5">
          <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-500/50 font-bold text-[10px]">
            PROVENANCE: SIMULATED DEMONSTRATION CASE
          </span>
          <span className="text-slate-300">
            Case Code: <strong className="text-white">{event.code}</strong> | Outcome: {event.actualOutcome}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 max-w-xl leading-relaxed">
          *Synthetic research benchmark configured to evaluate predictability algorithms under strictly controlled conditions. This record is NOT an official IMD historical disaster report.
        </p>
      </div>

      {/* ===================================================================== */}
      {/* PLAYBACK CONTROL CONSOLE */}
      {/* ===================================================================== */}
      <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-scientific-border pb-4 mb-5">
          {/* Controls Buttons */}
          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded font-bold flex items-center space-x-2 transition-colors ${
                isPlaying
                  ? 'bg-amber-500 text-graphite-950'
                  : 'bg-observation text-graphite-950 hover:bg-observation-light'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'PAUSE REPLAY' : 'START REPLAY'}</span>
            </button>

            <button
              onClick={handleStepForward}
              disabled={currentStepIndex >= event.steps.length - 1}
              className="px-3.5 py-2 bg-graphite-950 hover:bg-graphite-800 disabled:opacity-40 text-slate-200 border border-scientific-border rounded flex items-center space-x-1.5 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              <span>STEP FORWARD (+15M)</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3.5 py-2 bg-graphite-950 hover:bg-graphite-800 text-slate-300 border border-scientific-border rounded flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET TO T-180</span>
            </button>
          </div>

          {/* Current Replay Time & Regime Readout */}
          <div className="flex items-center space-x-3 font-mono">
            <div className="flex items-center space-x-2 bg-graphite-950 px-3 py-1.5 rounded border border-scientific-border">
              <Clock className="w-4 h-4 text-observation" />
              <span className="text-slate-400 text-xs">REPLAY CLOCK:</span>
              <span className="text-base font-bold text-observation tabular-nums">
                {currentStep.label}
              </span>
            </div>

            <div className="px-2.5 py-1.5 rounded bg-graphite-950 border border-scientific-border text-xs">
              <span className="text-scientific-muted mr-1.5">REGIME:</span>
              <span className="text-slate-200 font-bold">{currentRegime}</span>
            </div>

            <div className="text-xs text-scientific-muted hidden lg:block">
              STEP {currentStepIndex + 1} OF {event.steps.length}
            </div>
          </div>
        </div>

        {/* THRESHOLD CROSSING NOTIFICATION BANNER */}
        {isThresholdPassed ? (
          <div className="bg-emerald-950/40 border border-emerald-500/50 p-4 rounded-lg flex items-center justify-between mb-5 animate-subtle-pulse">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <span className="font-mono font-bold text-sm text-emerald-300 tracking-wider block">
                  ★ PREDICTABILITY HORIZON REACHED
                </span>
                <p className="text-xs font-mono text-emerald-200/80">
                  Earliest defensible warning verified at {currentStep.label} (Lead time: 47 minutes before severe rainfall onset).
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded bg-emerald-500 text-graphite-950 font-mono font-bold text-xs">
              DEFENSIBLE
            </span>
          </div>
        ) : (
          <div className="bg-graphite-950 border border-scientific-border p-3.5 rounded-lg flex items-center space-x-2.5 mb-5 text-xs font-mono text-scientific-muted">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Atmospheric information currently below the 70% threshold. Precursor signals remain indistinguishable from background synoptic fluctuations.
            </span>
          </div>
        )}

        {/* Instruments at Current Minute */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <RiskGauge
            value={currentStep.eventRisk}
            label={`EVENT RISK AT ${currentStep.label}`}
          />
          <PredictabilityGauge
            value={currentStep.predictability}
            label={`PREDICTABILITY AT ${currentStep.label}`}
            threshold={70}
          />
        </div>

        {/* Step Telemetry with Data Provenance Inspector Triggers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs mb-6">
          <div
            onClick={() => handleOpenProvenance('radarreflectivity')}
            className="bg-graphite-950 p-3 rounded border border-scientific-border hover:border-observation/80 transition-all cursor-pointer group"
            title="Click to inspect Data Provenance for Doppler Radar"
          >
            <div className="flex items-center justify-between">
              <span className="text-scientific-muted block text-[10px]">RADAR REFLECTIVITY</span>
              <span className="text-[9px] text-observation group-hover:underline">PROVENANCE ›</span>
            </div>
            <span className="text-base font-bold text-observation tabular-nums mt-0.5 block">
              {currentStep.radarReflectivity} dBZ
            </span>
          </div>

          <div
            onClick={() => handleOpenProvenance('cloudtoptemperature')}
            className="bg-graphite-950 p-3 rounded border border-scientific-border hover:border-purple-400/80 transition-all cursor-pointer group"
            title="Click to inspect Data Provenance for Satellite IR"
          >
            <div className="flex items-center justify-between">
              <span className="text-scientific-muted block text-[10px]">CLOUD-TOP IR TEMP</span>
              <span className="text-[9px] text-purple-300 group-hover:underline">PROVENANCE ›</span>
            </div>
            <span className="text-base font-bold text-purple-300 tabular-nums mt-0.5 block">
              {currentStep.satelliteTempC} °C
            </span>
          </div>

          <div
            onClick={() => handleOpenProvenance('lightning')}
            className="bg-graphite-950 p-3 rounded border border-scientific-border hover:border-amber-400/80 transition-all cursor-pointer group"
            title="Click to inspect Data Provenance for Lightning Detection"
          >
            <div className="flex items-center justify-between">
              <span className="text-scientific-muted block text-[10px]">LIGHTNING STRIKES</span>
              <span className="text-[9px] text-amber-400 group-hover:underline">PROVENANCE ›</span>
            </div>
            <span className="text-base font-bold text-amber-400 tabular-nums mt-0.5 block">
              {currentStep.lightningDetected} flashes
            </span>
          </div>
        </div>

        {/* Revealed Observations Box */}
        <div className="bg-graphite-950 p-4 rounded-lg border border-scientific-border space-y-2 text-xs font-mono">
          <div className="flex items-center space-x-2 text-slate-300 font-bold">
            <Unlock className="w-4 h-4 text-observation" />
            <span>OBSERVATION REVEALED AT THIS TIMESTEP:</span>
          </div>
          <p className="text-slate-100 pl-6">{currentStep.revealedObservation}</p>

          <div className="flex items-center space-x-2 text-slate-400 pt-2 border-t border-scientific-border/60">
            <span className="text-predictability font-bold">› Precursor Status:</span>
            <span className="text-slate-300">{currentStep.precursorSignalStatus}</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DATA AVAILABILITY MATRIX (CAUSAL TIME LOCKING) */}
      {/* ===================================================================== */}
      <DataAvailabilityMatrix
        onSelectTimestep={(offset) => {
          const idx = event.steps.findIndex((s) => s.minute === offset);
          if (idx !== -1) setCurrentStepIndex(idx);
        }}
      />

      {/* ===================================================================== */}
      {/* SYNCHRONIZED RESEARCH EVENT LOG & OBSERVATION SUFFICIENCY */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ResearchEventLogList
            activeMinuteOffset={currentStep.minute}
            onSelectOffset={(offset) => {
              const idx = event.steps.findIndex((s) => s.minute === offset);
              if (idx !== -1) setCurrentStepIndex(idx);
            }}
          />
        </div>
        <div className="lg:col-span-5">
          <ObservationSufficiencyCard minuteOffset={currentStep.minute} />
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TIMELINE PROGRESSION T-180 TO T-0 (WITH LOCKED FUTURE STATES) */}
      {/* ===================================================================== */}
      <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5">
        <div className="flex items-center justify-between border-b border-scientific-border pb-3 mb-4">
          <span className="font-mono text-xs font-bold text-slate-200 uppercase">
            CAUSAL REPLAY PROGRESSION ({isBlindReplayActive ? 'FUTURE INFORMATION LOCKED' : 'UNLOCKED AUDIT'})
          </span>
          <span className="text-[10px] font-mono text-scientific-muted">
            TIMELINE HORIZON: 180 MINUTES
          </span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {event.steps.map((step, idx) => {
            const isPastOrCurrent = !isBlindReplayActive || idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.minute}
                onClick={() => isPastOrCurrent && setCurrentStepIndex(idx)}
                className={`p-3 rounded border flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-scientific-panel border-observation ring-1 ring-observation/60 shadow'
                    : isPastOrCurrent
                    ? 'bg-graphite-950 border-scientific-border text-slate-300 hover:border-slate-600 cursor-pointer'
                    : 'bg-graphite-950/40 border-slate-800/40 text-slate-600 cursor-not-allowed select-none'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {isPastOrCurrent ? (
                    <span className="w-5 h-5 rounded-full bg-observation/20 text-observation flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  <div>
                    <span className={`font-bold ${isCurrent ? 'text-observation' : ''}`}>
                      {step.label}
                    </span>
                    <span className="text-[11px] text-scientific-muted ml-3 hidden sm:inline">
                      {isPastOrCurrent ? step.revealedObservation.substring(0, 55) + '...' : 'Locked causal state'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-[11px]">
                  {isPastOrCurrent ? (
                    <>
                      <span>Risk: <strong className="text-red-400">{step.eventRisk}%</strong></span>
                      <span>Pred: <strong className="text-predictability">{step.predictability}%</strong></span>
                      {step.isThresholdCrossed && (
                        <span className="text-emerald-400 font-bold hidden md:inline">
                          ★ THRESHOLD
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-slate-600 uppercase text-[10px] tracking-wider">
                      FUTURE INFORMATION LOCKED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DATA PROVENANCE INSPECTOR MODAL */}
      <DataProvenanceModal
        isOpen={provenanceModalOpen}
        onClose={() => setProvenanceModalOpen(false)}
        variableName={inspectedVariable}
        provenance={inspectedProvenance}
      />
    </div>
  );
};
