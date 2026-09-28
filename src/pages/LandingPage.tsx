import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Shield,
  Activity,
  Box,
  Layers,
  Cpu,
  AlertTriangle,
  GitBranch,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { HeroAtmosphericCanvas } from '../components/three/HeroAtmosphericCanvas';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-graphite-950 text-scientific-text font-sans selection:bg-predictability selection:text-white flex flex-col">
      {/* Top minimal scientific bar */}
      <header className="h-14 border-b border-scientific-border/80 px-6 flex items-center justify-between z-20 bg-graphite-950/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded bg-graphite-900 border border-observation/40 flex items-center justify-center text-observation font-mono font-bold text-xs">
            PЯ
          </div>
          <div>
            <span className="font-mono font-bold text-sm tracking-widest text-slate-100">
              PRAGYA
            </span>
            <span className="text-[10px] font-mono text-scientific-muted ml-2">
              ATMOSPHERIC RESEARCH PROTOTYPE
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <SimulatedDataBadge size="sm" />
          <button
            onClick={() => navigate('/app/overview')}
            className="px-3.5 py-1.5 bg-observation-dark hover:bg-observation text-graphite-950 font-mono font-bold text-xs rounded transition-all flex items-center space-x-1.5 shadow"
          >
            <span>ENTER COMMAND CENTRE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* HERO SECTION WITH THREE.JS ATMOSPHERIC VISUAL */}
      <section className="relative min-h-[92vh] flex flex-col justify-center px-6 lg:px-16 overflow-hidden">
        {/* Background 3D Atmospheric Volume Canvas */}
        <div className="absolute inset-0 z-0">
          <HeroAtmosphericCanvas />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-4xl py-12">
          {/* Status indicators */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="px-2.5 py-1 rounded bg-predictability/15 border border-predictability/40 text-predictability-light font-mono text-xs uppercase font-semibold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-predictability animate-pulse" />
              <span>RESEARCH PROTOTYPE</span>
            </span>
            <SimulatedDataBadge size="md" />
            <span className="px-2.5 py-1 rounded bg-graphite-900/80 border border-scientific-border text-scientific-muted font-mono text-xs">
              MESOSCALE CONVECTIVE NOWCASTING (0–6H)
            </span>
          </div>

          {/* Hero Titles */}
          <h1 className="font-mono text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
            PRAGYA
          </h1>
          <p className="font-mono text-sm sm:text-base text-observation tracking-wider uppercase mb-6 font-semibold">
            Predictability & Rapid Atmospheric Genesis Intelligence Architecture
          </p>

          <div className="border-l-2 border-predictability pl-5 mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight mb-3">
              "Finding the moment extreme weather becomes predictable."
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              An experimental atmospheric intelligence platform for studying the predictability of rapidly developing severe convection.
            </p>
          </div>

          {/* Core Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/app/overview')}
              className="px-6 py-3 bg-observation hover:bg-observation-light text-graphite-950 font-mono font-bold text-sm rounded shadow-lg transition-all flex items-center space-x-2"
            >
              <span>ENTER COMMAND CENTRE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/app/research')}
              className="px-5 py-3 bg-graphite-900/90 hover:bg-graphite-800 text-slate-200 border border-scientific-border font-mono text-sm rounded transition-all flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4 text-predictability" />
              <span>VIEW RESEARCH CONCEPT</span>
            </button>
            <button
              onClick={() => navigate('/app/digital-twin')}
              className="px-5 py-3 bg-graphite-900/90 hover:bg-graphite-800 text-slate-200 border border-predictability/30 font-mono text-sm rounded transition-all flex items-center space-x-2"
            >
              <Box className="w-4 h-4 text-observation" />
              <span>EXPLORE 3D DIGITAL TWIN</span>
            </button>
          </div>

          {/* Scientific Paradigm Banner: Risk vs Predictability */}
          <div className="mt-12 bg-graphite-900/90 border border-scientific-border p-5 rounded-lg max-w-2xl backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>THE CORE SCIENTIFIC PRINCIPLE OF PRAGYA</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-slate-300">
              <div className="bg-graphite-950/80 p-3 rounded border border-scientific-border/80">
                <span className="text-red-400 font-bold block mb-1">1. EVENT RISK</span>
                <p className="text-scientific-muted leading-tight">
                  How likely severe convection is to form in the domain.
                </p>
              </div>
              <div className="bg-graphite-950/80 p-3 rounded border border-scientific-border/80">
                <span className="text-predictability font-bold block mb-1">2. PREDICTABILITY</span>
                <p className="text-scientific-muted leading-tight">
                  How confidently the atmosphere currently allows that event to be distinguished from plausible alternative futures.
                </p>
              </div>
            </div>
            <p className="mt-2.5 text-[11px] font-mono text-slate-400 italic">
              These two dimensions are mathematically distinct and must NEVER be treated as the same value.
            </p>
          </div>
        </div>
      </section>

      {/* 3-STAGE MISSION ARCHITECTURE SECTION: OBSERVE -> UNDERSTAND -> COMMUNICATE */}
      <section className="py-16 px-6 lg:px-16 border-t border-scientific-border bg-graphite-950">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono text-observation uppercase tracking-wider font-semibold">
              SCIENTIFIC CONTINUUM
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
              From Raw Atmospheric Physics to Protective Action
            </h3>
            <p className="text-sm font-mono text-scientific-muted leading-relaxed">
              PRAGYA bridges raw thermodynamic observations, mathematical predictability horizons, and operational public safety through three tightly coupled stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Stage 1 */}
            <div className="bg-graphite-900 border border-scientific-border p-6 rounded-lg space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-observation" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-observation tracking-wider">STAGE 01</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-observation/10 text-observation border border-observation/30">
                  ASSIMILATE
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-100">OBSERVE</h4>
              <p className="text-scientific-muted leading-relaxed text-[11px]">
                Multi-sensor ingestion across IMD Doppler radar volumes, INSAT-3DR satellite radiometers, AWS surface networks, and numerical reanalysis with rigorous telemetry latency modeling.
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-scientific-border/60">
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-observation" />
                  <span>Sub-hourly rapid convective updates</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-observation" />
                  <span>Strict zero-future-leakage time gating</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-observation" />
                  <span>Sensor health &amp; gap quantification</span>
                </li>
              </ul>
            </div>

            {/* Stage 2 */}
            <div className="bg-graphite-900 border border-scientific-border p-6 rounded-lg space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-predictability" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-predictability-light tracking-wider">STAGE 02</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-predictability/10 text-predictability-light border border-predictability/30">
                  REASON
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-100">UNDERSTAND</h4>
              <p className="text-scientific-muted leading-relaxed text-[11px]">
                Predictability Horizon tracking, Future Divergence indexing, 3D volumetric analysis, and precursor signal convergence to isolate the exact moment ambiguity collapses.
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-scientific-border/60">
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-predictability" />
                  <span>Independent Risk vs Predictability</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-predictability" />
                  <span>20-member physics ensemble futures</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-predictability" />
                  <span>Near-miss atmospheric bifurcation</span>
                </li>
              </ul>
            </div>

            {/* Stage 3 */}
            <div className="bg-graphite-900 border border-scientific-border p-6 rounded-lg space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 tracking-wider">STAGE 03</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  TRANSLATE
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-100">COMMUNICATE</h4>
              <p className="text-scientific-muted leading-relaxed text-[11px]">
                Empowering authorities with structured decision support windows, while delivering calm, actionable, non-alarmist public guidance in English, Hindi, and Marathi.
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-scientific-border/60">
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Multi-agency decision timeline</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Trilingual citizen safety cards</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Clear alignment with official IMD alerts</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Persona Direct Entry Links */}
          <div className="p-4 bg-graphite-900/60 border border-scientific-border rounded-lg flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-mono text-slate-300">
              Direct Access to System Personas:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigate('/app/overview')}
                className="px-3 py-1.5 rounded bg-graphite-800 hover:bg-graphite-700 text-slate-200 border border-scientific-border font-mono text-xs flex items-center space-x-1.5"
              >
                <span>🔬 Scientific Research Workstation</span>
              </button>
              <button
                onClick={() => navigate('/app/authority')}
                className="px-3 py-1.5 rounded bg-graphite-800 hover:bg-graphite-700 text-amber-300 border border-amber-500/30 font-mono text-xs flex items-center space-x-1.5"
              >
                <span>🏛️ Authority Command Centre</span>
              </button>
              <button
                onClick={() => navigate('/app/citizen')}
                className="px-3 py-1.5 rounded bg-graphite-800 hover:bg-graphite-700 text-emerald-300 border border-emerald-500/30 font-mono text-xs flex items-center space-x-1.5"
              >
                <span>🛡️ Public Citizen Safety</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* KEY RESEARCH CAPABILITIES GRID */}
      <section className="py-16 px-6 lg:px-16 border-t border-scientific-border bg-graphite-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <span className="text-xs font-mono text-observation uppercase tracking-wider font-semibold">
              SCIENTIFIC WORKSTATION CAPABILITIES
            </span>
            <h3 className="text-2xl font-bold font-mono text-slate-100 mt-1">
              Integrated Convective Prediction Architecture
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Box 1 */}
            <div
              onClick={() => navigate('/app/digital-twin')}
              className="bg-graphite-900 border border-scientific-border p-5 rounded-lg hover:border-observation/60 transition-all cursor-pointer group"
            >
              <Box className="w-6 h-6 text-observation mb-3 group-hover:scale-105 transition-transform" />
              <h4 className="text-sm font-bold text-slate-100 mb-2">3D Atmospheric Digital Twin</h4>
              <p className="text-scientific-muted leading-relaxed mb-4">
                Interactive 0–12 km atmospheric volume visualizing terrain, vertical grids, updrafts, downdrafts, moisture flux, and hail-growth zones across -3h to +6h timelines.
              </p>
              <span className="text-observation inline-flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Open Digital Twin</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Box 2 */}
            <div
              onClick={() => navigate('/app/predictability')}
              className="bg-graphite-900 border border-scientific-border p-5 rounded-lg hover:border-predictability/60 transition-all cursor-pointer group"
            >
              <Compass className="w-6 h-6 text-predictability mb-3 group-hover:scale-105 transition-transform" />
              <h4 className="text-sm font-bold text-slate-100 mb-2">Predictability Horizon Analysis</h4>
              <p className="text-scientific-muted leading-relaxed mb-4">
                Quantitative tracking of phase space divergence and information entropy to establish the earliest defensible warning window before event onset.
              </p>
              <span className="text-predictability-light inline-flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>View Predictability Instruments</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Box 3 */}
            <div
              onClick={() => navigate('/app/laboratory')}
              className="bg-graphite-900 border border-scientific-border p-5 rounded-lg hover:border-amber-400/60 transition-all cursor-pointer group"
            >
              <GitBranch className="w-6 h-6 text-amber-400 mb-3 group-hover:scale-105 transition-transform" />
              <h4 className="text-sm font-bold text-slate-100 mb-2">Atmospheric Difference Finder</h4>
              <p className="text-scientific-muted leading-relaxed mb-4">
                Synchronized counterfactual comparison between events where severe convection developed vs similar environments where convection failed.
              </p>
              <span className="text-amber-400 inline-flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Enter Storm Laboratory</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SCIENTIFIC INTEGRITY FOOTER */}
      <footer className="mt-auto border-t border-scientific-border bg-graphite-950 px-6 py-8 text-xs font-mono text-scientific-muted">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-slate-300">PRAGYA</span>
            <span>|</span>
            <span>RESEARCH PROTOTYPE</span>
            <span>|</span>
            <SimulatedDataBadge size="sm" />
          </div>

          <p className="text-center sm:text-right text-[11px] text-slate-500 max-w-md">
            PRAGYA is an experimental scientific research architecture. All demonstration values are synthetic and do not replace official meteorological forecasts.
          </p>
        </div>
      </footer>
    </div>
  );
};
