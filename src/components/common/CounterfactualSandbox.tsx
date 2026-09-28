import React, { useState, useMemo } from 'react';
import {
  FlaskConical,
  Sliders,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Info,
  Layers,
  Wind
} from 'lucide-react';
import { predictabilityEngine } from '../../services/predictabilityEngine';
import { CounterfactualParameters, CounterfactualResult, FutureCategory } from '../../types';

interface CounterfactualSandboxProps {
  className?: string;
  onApplyParameters?: (params: CounterfactualParameters) => void;
}

const DEFAULT_PARAMS: CounterfactualParameters = {
  moisture: 75,       // %
  cape: 2480,         // J/kg
  cin: -42,           // J/kg
  windShear: 22,      // m/s
  convergence: 3.5,   // g/kg/hr
};

export const CounterfactualSandbox: React.FC<CounterfactualSandboxProps> = ({
  className = '',
  onApplyParameters,
}) => {
  const [params, setParams] = useState<CounterfactualParameters>(DEFAULT_PARAMS);

  // Compute counterfactual result via central research engine
  const result: CounterfactualResult = useMemo(() => {
    return predictabilityEngine.computeCounterfactualResponse(params);
  }, [params]);

  const baselineResult: CounterfactualResult = useMemo(() => {
    return predictabilityEngine.computeCounterfactualResponse(DEFAULT_PARAMS);
  }, []);

  const updateParam = (key: keyof CounterfactualParameters, val: number) => {
    const updated = { ...params, [key]: val };
    setParams(updated);
    if (onApplyParameters) onApplyParameters(updated);
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    if (onApplyParameters) onApplyParameters(DEFAULT_PARAMS);
  };

  const applyPreset = (p: CounterfactualParameters) => {
    setParams(p);
    if (onApplyParameters) onApplyParameters(p);
  };

  const presets = [
    {
      name: 'Baseline Atmosphere',
      desc: 'Observed pre-convective sounding at T-60m',
      p: { moisture: 75, cape: 2480, cin: -42, windShear: 22, convergence: 3.5 }
    },
    {
      name: 'Mid-Level Dry Air Entrainment',
      desc: '700-500 hPa dry slot erodes updraft buoyancy',
      p: { moisture: 48, cape: 1850, cin: -85, windShear: 14, convergence: 1.8 }
    },
    {
      name: 'Capping Inversion Collapse',
      desc: 'Marine air advection removes lid entirely',
      p: { moisture: 92, cape: 3400, cin: -10, windShear: 32, convergence: 6.8 }
    },
    {
      name: 'Shear-Deficient Pulse Decay',
      desc: 'Weak steering flow causes cold pool to choke updraft',
      p: { moisture: 82, cape: 2200, cin: -30, windShear: 8, convergence: 2.4 }
    }
  ];

  const riskDelta = result.simulatedRisk - baselineResult.simulatedRisk;
  const predDelta = result.simulatedPredictability - baselineResult.simulatedPredictability;
  const currentRegime = predictabilityEngine.classifyRegime(result.simulatedPredictability);

  // Helper to extract category probability from distribution
  const getCatProb = (cat: FutureCategory) => {
    const found = result.distribution.find((d) => d.category === cat);
    return found ? found.probability : 0;
  };

  return (
    <div className={`bg-scientific-card border border-scientific-border rounded-lg p-5 flex flex-col space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-scientific-border pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded bg-graphite-900 border border-scientific-border text-observation">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-mono font-bold tracking-wider text-slate-100 uppercase">
                Near-Miss Laboratory: "What-If" Atmosphere
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-observation/15 text-observation border border-observation/30">
                SANDBOX SIMULATION
              </span>
            </div>
            <p className="text-xs font-mono text-scientific-muted">
              Perturb pre-convective thermodynamic and kinematic fields to test storm bifurcation thresholds.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-graphite-900 hover:bg-graphite-800 border border-scientific-border text-xs font-mono text-slate-300 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Presets Row */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono text-scientific-muted uppercase tracking-wider flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Atmospheric Bifurcation Presets</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {presets.map((pr) => (
            <button
              key={pr.name}
              onClick={() => applyPreset(pr.p)}
              className="text-left p-2.5 rounded bg-graphite-900 hover:bg-graphite-800 border border-scientific-border/80 hover:border-observation/60 transition-all group"
            >
              <div className="text-xs font-mono font-bold text-slate-200 group-hover:text-observation transition-colors">
                {pr.name}
              </div>
              <div className="text-[10px] font-mono text-scientific-muted line-clamp-1 mt-0.5">
                {pr.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Control Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-graphite-950/70 p-4 rounded-lg border border-scientific-border">
        {/* Moisture Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300 flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-observation" />
              <span>Boundary Moisture (RH)</span>
            </span>
            <span className="font-bold text-observation">{params.moisture}%</span>
          </div>
          <input
            type="range"
            min="40"
            max="100"
            step="1"
            value={params.moisture}
            onChange={(e) => updateParam('moisture', parseInt(e.target.value))}
            className="w-full accent-observation bg-graphite-800 h-1.5 rounded cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-scientific-muted">
            <span>40% (Dry Slot)</span>
            <span>75% (Base)</span>
            <span>100% (Saturated)</span>
          </div>
        </div>

        {/* CAPE Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300 flex items-center space-x-1">
              <Sliders className="w-3.5 h-3.5 text-risk" />
              <span>Convective Instability (CAPE)</span>
            </span>
            <span className="font-bold text-risk">{params.cape} J/kg</span>
          </div>
          <input
            type="range"
            min="1000"
            max="4000"
            step="50"
            value={params.cape}
            onChange={(e) => updateParam('cape', parseInt(e.target.value))}
            className="w-full accent-risk bg-graphite-800 h-1.5 rounded cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-scientific-muted">
            <span>1,000 J/kg</span>
            <span>2,480 J/kg (Base)</span>
            <span>4,000 J/kg (Extreme)</span>
          </div>
        </div>

        {/* CIN Lid Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300 flex items-center space-x-1">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Capping Inversion (CIN)</span>
            </span>
            <span className="font-bold text-amber-400">{params.cin} J/kg</span>
          </div>
          <input
            type="range"
            min="-120"
            max="0"
            step="2"
            value={params.cin}
            onChange={(e) => updateParam('cin', parseInt(e.target.value))}
            className="w-full accent-amber-400 bg-graphite-800 h-1.5 rounded cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-scientific-muted">
            <span>-120 J/kg (Capped)</span>
            <span>-42 J/kg (Base)</span>
            <span>0 J/kg (No Lid)</span>
          </div>
        </div>

        {/* 0-6km Wind Shear Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300 flex items-center space-x-1">
              <Wind className="w-3.5 h-3.5 text-blue-400" />
              <span>Deep Wind Shear (0-6km)</span>
            </span>
            <span className="font-bold text-blue-400">{params.windShear} m/s</span>
          </div>
          <input
            type="range"
            min="5"
            max="40"
            step="1"
            value={params.windShear}
            onChange={(e) => updateParam('windShear', parseInt(e.target.value))}
            className="w-full accent-blue-400 bg-graphite-800 h-1.5 rounded cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-scientific-muted">
            <span>5 m/s (Pulse)</span>
            <span>22 m/s (Base)</span>
            <span>40 m/s (Supercell)</span>
          </div>
        </div>

        {/* Boundary Convergence Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300 flex items-center space-x-1">
              <Sliders className="w-3.5 h-3.5 text-predictability" />
              <span>Boundary Convergence</span>
            </span>
            <span className="font-bold text-predictability">{params.convergence.toFixed(1)} g/kg/h</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="8.0"
            step="0.1"
            value={params.convergence}
            onChange={(e) => updateParam('convergence', parseFloat(e.target.value))}
            className="w-full accent-predictability bg-graphite-800 h-1.5 rounded cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-scientific-muted">
            <span>0.5 (Diffuse)</span>
            <span>3.5 (Base)</span>
            <span>8.0 (Intense Front)</span>
          </div>
        </div>

        {/* Active Regime & Primary Attractor Indicator */}
        <div className="flex flex-col justify-center bg-graphite-900 p-3 rounded border border-scientific-border">
          <span className="text-[10px] font-mono text-scientific-muted uppercase">Dominant Attractor</span>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs font-mono font-bold text-observation">
              {result.primaryAttractor}
            </span>
          </div>
          <span className="text-[9px] font-mono text-scientific-muted mt-1">
            Regime: <strong className="text-slate-200">{currentRegime}</strong> | FDI: <strong className="text-amber-400">{result.simulatedDivergenceIndex}</strong>
          </span>
        </div>
      </div>

      {/* Results Comparison Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk Shift Card */}
        <div className="bg-graphite-900/90 border border-scientific-border rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-scientific-muted uppercase tracking-wider">Severe Convective Risk</span>
            <span className="flex items-center space-x-1 font-bold">
              {riskDelta > 0 ? (
                <span className="text-rose-400 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +{riskDelta}%
                </span>
              ) : riskDelta < 0 ? (
                <span className="text-emerald-400 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-0.5" /> {riskDelta}%
                </span>
              ) : (
                <span className="text-slate-400">0%</span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm font-mono pt-1">
            <div className="text-center">
              <div className="text-[10px] text-scientific-muted">ORIGINAL BASELINE</div>
              <div className="text-lg font-bold text-slate-200">{baselineResult.simulatedRisk}%</div>
            </div>
            <ArrowRight className="w-4 h-4 text-scientific-muted" />
            <div className="text-center">
              <div className="text-[10px] text-scientific-muted">WHAT-IF PERTURBED</div>
              <div
                className={`text-lg font-bold ${
                  result.simulatedRisk >= 70
                    ? 'text-rose-400'
                    : result.simulatedRisk >= 40
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {result.simulatedRisk}%
              </div>
            </div>
          </div>

          {/* Progress comparison visual */}
          <div className="h-2 w-full bg-graphite-950 rounded-full overflow-hidden flex">
            <div
              className="bg-risk transition-all duration-300"
              style={{ width: `${result.simulatedRisk}%` }}
            />
          </div>
        </div>

        {/* Predictability Shift Card */}
        <div className="bg-graphite-900/90 border border-scientific-border rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-scientific-muted uppercase tracking-wider">Predictability (State Distinguishability)</span>
            <span className="flex items-center space-x-1 font-bold">
              {predDelta > 0 ? (
                <span className="text-emerald-400 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +{predDelta}%
                </span>
              ) : predDelta < 0 ? (
                <span className="text-rose-400 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-0.5" /> {predDelta}%
                </span>
              ) : (
                <span className="text-slate-400">0%</span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm font-mono pt-1">
            <div className="text-center">
              <div className="text-[10px] text-scientific-muted">ORIGINAL BASELINE</div>
              <div className="text-lg font-bold text-slate-200">{baselineResult.simulatedPredictability}%</div>
            </div>
            <ArrowRight className="w-4 h-4 text-scientific-muted" />
            <div className="text-center">
              <div className="text-[10px] text-scientific-muted">WHAT-IF PERTURBED</div>
              <div className="text-lg font-bold text-predictability-light">
                {result.simulatedPredictability}%
              </div>
            </div>
          </div>

          {/* Progress comparison visual */}
          <div className="h-2 w-full bg-graphite-950 rounded-full overflow-hidden flex">
            <div
              className="bg-predictability transition-all duration-300"
              style={{ width: `${result.simulatedPredictability}%` }}
            />
          </div>
        </div>
      </div>

      {/* Outcome Distribution Bar */}
      <div className="space-y-2 bg-graphite-900/70 p-3.5 rounded-lg border border-scientific-border">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-300 font-bold uppercase tracking-wider">
            Predicted Convective Multiverse Distribution
          </span>
          <span className="text-[10px] text-scientific-muted">20-MEMBER ENSEMBLE RESPONSE</span>
        </div>

        {/* Stacked bar */}
        <div className="h-4 w-full bg-graphite-950 rounded overflow-hidden flex text-[10px] font-mono font-bold text-graphite-950">
          <div
            style={{ width: `${getCatProb('Dissipation')}%` }}
            className="bg-slate-400 flex items-center justify-center transition-all duration-300"
            title={`Dissipation: ${getCatProb('Dissipation')}%`}
          >
            {getCatProb('Dissipation') > 12 && `${getCatProb('Dissipation')}%`}
          </div>
          <div
            style={{ width: `${getCatProb('Ordinary Convection')}%` }}
            className="bg-observation flex items-center justify-center transition-all duration-300"
            title={`Ordinary Convection: ${getCatProb('Ordinary Convection')}%`}
          >
            {getCatProb('Ordinary Convection') > 12 && `${getCatProb('Ordinary Convection')}%`}
          </div>
          <div
            style={{ width: `${getCatProb('Severe Thunderstorm')}%` }}
            className="bg-amber-400 flex items-center justify-center transition-all duration-300"
            title={`Severe Thunderstorm: ${getCatProb('Severe Thunderstorm')}%`}
          >
            {getCatProb('Severe Thunderstorm') > 12 && `${getCatProb('Severe Thunderstorm')}%`}
          </div>
          <div
            style={{ width: `${getCatProb('Extreme Rainfall')}%` }}
            className="bg-rose-500 flex items-center justify-center transition-all duration-300 text-white"
            title={`Extreme Cloudburst: ${getCatProb('Extreme Rainfall')}%`}
          >
            {getCatProb('Extreme Rainfall') > 12 && `${getCatProb('Extreme Rainfall')}%`}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-[10px] font-mono pt-1 text-slate-300">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-400" />
            <span>Dissipation ({getCatProb('Dissipation')}%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-observation" />
            <span>Ordinary Convection ({getCatProb('Ordinary Convection')}%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
            <span>Severe Convection ({getCatProb('Severe Thunderstorm')}%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
            <span>Extreme Cloudburst ({getCatProb('Extreme Rainfall')}%)</span>
          </div>
        </div>
      </div>

      {/* Scientific Narrative Interpretation */}
      <div className="bg-graphite-950 p-3.5 rounded border border-scientific-border text-xs font-mono space-y-1.5">
        <div className="flex items-center space-x-1.5 text-observation font-bold">
          <Info className="w-4 h-4 shrink-0" />
          <span>Thermodynamic Sensitivity Interpretation</span>
        </div>
        <p className="text-scientific-muted leading-relaxed">
          {result.sensitivityInterpretation}
        </p>
      </div>

      {/* Bottom disclaimer */}
      <div className="text-[10px] font-mono text-scientific-muted/80 flex items-center justify-between pt-1">
        <span>EXPERIMENT PROTOCOL: NUMERICAL PERTURBATION RUN</span>
        <span className="text-amber-400/90">DEMO SENSITIVITY CALCULATOR</span>
      </div>
    </div>
  );
};
