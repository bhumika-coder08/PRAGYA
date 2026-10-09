import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Shield,
  Activity,
  Box,
  Layers,
  GitBranch,
  BookOpen,
  ArrowUpRight,
  Radio,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { HeroAtmosphericCanvas } from '../components/three/HeroAtmosphericCanvas';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-graphite-950 text-slate-100 font-sans selection:bg-observation/20 selection:text-white flex flex-col">
      {/* Top clean research bar */}
      <header className="h-16 border-b border-scientific-border/60 px-6 sm:px-10 flex items-center justify-between z-20 bg-graphite-950/80 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-md bg-graphite-900 border border-scientific-border flex items-center justify-center text-observation font-heading font-bold text-sm tracking-tight">
            PR
          </div>
          <div className="flex items-baseline space-x-2.5">
            <span className="font-heading font-bold text-base tracking-tight text-white">
              PRAGYA
            </span>
            <span className="text-xs text-slate-400 font-normal hidden sm:inline">
              Atmospheric Research Platform
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <SimulatedDataBadge size="sm" />
          <button
            onClick={() => navigate('/app/overview')}
            className="px-4 py-2 bg-observation-dark hover:bg-observation text-white hover:text-slate-950 font-sans font-medium text-xs rounded-md transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <span>Enter Command Centre</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* HERO SECTION WITH THREE.JS ATMOSPHERIC VISUAL */}
      <section className="relative min-h-[88vh] flex flex-col justify-center px-6 sm:px-12 lg:px-20 overflow-hidden">
        {/* Background 3D Atmospheric Volume Canvas */}
        <div className="absolute inset-0 z-0 opacity-80">
          <HeroAtmosphericCanvas />
        </div>

        {/* Subtle radial vignette gradient to ensure legibility */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-graphite-950/90 via-graphite-950/70 to-transparent pointer-events-none" />

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-3xl py-16">
          {/* Small understated research status */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-slate-700/60 bg-slate-900/60 text-xs text-slate-300 mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
            <span>Research Prototype · Simulated Demonstration Data</span>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4">
            PRAGYA
          </h1>

          <p className="font-heading text-base sm:text-lg font-medium text-observation mb-6">
            Predictability & Rapid Atmospheric Genesis Intelligence Architecture
          </p>

          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight mb-4">
            Finding the moment extreme weather becomes predictable.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-9">
            An atmospheric research platform for studying when rapidly developing convective events first become reliably predictable.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => navigate('/app/overview')}
              className="px-6 py-3 bg-observation hover:bg-observation-light text-graphite-950 font-sans font-semibold text-sm rounded-md shadow-sm transition-all flex items-center space-x-2"
            >
              <span>Enter Command Centre</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/app/digital-twin')}
              className="px-5 py-3 bg-graphite-900/80 hover:bg-graphite-800 text-slate-200 border border-scientific-border hover:border-slate-500 font-sans font-medium text-sm rounded-md transition-all flex items-center space-x-2 backdrop-blur-sm"
            >
              <Box className="w-4 h-4 text-observation" />
              <span>Explore 3D Digital Twin</span>
            </button>

            <button
              onClick={() => navigate('/app/research')}
              className="px-4 py-3 text-slate-400 hover:text-white font-sans font-medium text-sm transition-colors flex items-center space-x-1.5"
            >
              <span>Research Concept</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* RESEARCH CONCEPT SECTION: EDITORIAL / SCIENTIFIC LAYOUT */}
      <section className="py-20 px-6 sm:px-12 lg:px-20 border-t border-scientific-border bg-graphite-900/60">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-heading font-semibold uppercase tracking-wider text-observation">
              Core Paradigm
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1.5">
              Three Orthogonal Dimensions of Atmospheric Certainty
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mt-2.5">
              In operational nowcasting, danger and predictability are frequently conflated. PRAGYA evaluates physical favorability, state constraint, and sensor sufficiency independently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-scientific-border border border-scientific-border rounded-lg bg-graphite-950/60 overflow-hidden">
            {/* Dimension 1: Event Risk */}
            <div className="p-7 sm:p-8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-danger font-medium uppercase tracking-wider">
                  Dimension 01
                </span>
                <span className="w-2 h-2 rounded-full bg-danger" />
              </div>
              <h4 className="text-lg font-heading font-bold text-white">
                Event Risk
              </h4>
              <p className="text-sm text-slate-300 font-medium">
                How likely is the event to develop?
              </p>
              <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-scientific-border/60">
                Thermodynamic instability, CAPE, CIN erosion, and low-level boundary layer moisture convergence evaluating environmental potential.
              </p>
            </div>

            {/* Dimension 2: Predictability */}
            <div className="p-7 sm:p-8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-predictability-light font-medium uppercase tracking-wider">
                  Dimension 02
                </span>
                <span className="w-2 h-2 rounded-full bg-predictability" />
              </div>
              <h4 className="text-lg font-heading font-bold text-white">
                Predictability
              </h4>
              <p className="text-sm text-slate-300 font-medium">
                How confidently can the event be distinguished from alternative futures?
              </p>
              <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-scientific-border/60">
                Phase-space divergence and entropy analysis tracking when ensemble trajectories collapse to an inevitable outcome.
              </p>
            </div>

            {/* Dimension 3: Observation Confidence */}
            <div className="p-7 sm:p-8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-observation font-medium uppercase tracking-wider">
                  Dimension 03
                </span>
                <span className="w-2 h-2 rounded-full bg-observation" />
              </div>
              <h4 className="text-lg font-heading font-bold text-white">
                Observation Confidence
              </h4>
              <p className="text-sm text-slate-300 font-medium">
                How sufficient and reliable are the available observations?
              </p>
              <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-scientific-border/60">
                Data quality indexing, sensor health, and detection of radar terrain beam-blockage or satellite scan latency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION: CONNECTED PIPELINE DIAGRAM */}
      <section className="py-20 px-6 sm:px-12 lg:px-20 border-t border-scientific-border bg-graphite-950">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <span className="text-xs font-heading font-semibold uppercase tracking-wider text-observation">
              Architecture Workflow
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1.5">
              From atmospheric observations to actionable intelligence
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mt-2.5">
              Bridging raw physical instrumentation and decision support through three interconnected scientific stages.
            </p>
          </div>

          {/* Connected Process Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="border border-scientific-border rounded-lg p-6 bg-graphite-900/40 relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold text-observation tracking-wider">
                  01 — Observe
                </span>
                <Radio className="w-4 h-4 text-observation/80" />
              </div>
              <h4 className="text-base font-heading font-semibold text-white">
                Multi-source atmospheric observations
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Assimilation across Doppler weather radar volumes, rapid-scan satellite infrared radiometry, and surface AWS networks with strict telemetry latency gating.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border border-scientific-border rounded-lg p-6 bg-graphite-900/40 relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold text-predictability-light tracking-wider">
                  02 — Understand
                </span>
                <Compass className="w-4 h-4 text-predictability-light/80" />
              </div>
              <h4 className="text-base font-heading font-semibold text-white">
                Precursors, atmospheric fingerprints and predictability analysis
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Thermodynamic feature extraction, 20-member physics ensemble clustering, and bifurcation detection to isolate the exact horizon where ambiguity collapses.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border border-scientific-border rounded-lg p-6 bg-graphite-900/40 relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold text-watch tracking-wider">
                  03 — Support
                </span>
                <Shield className="w-4 h-4 text-watch/80" />
              </div>
              <h4 className="text-base font-heading font-semibold text-white">
                Translate scientific intelligence into decision support
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering authorities with transparent timing windows, multi-agency timelines, and delivering calm, actionable public guidance in English, Hindi, and Marathi.
              </p>
            </div>
          </div>

          {/* Persona Direct Entry Bar */}
          <div className="p-4 sm:p-5 border border-scientific-border rounded-lg bg-graphite-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-heading font-semibold text-slate-200 block">
                Target User Personas
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Role-specific workspaces powered by the same scientific backend.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigate('/app/overview')}
                className="px-3.5 py-1.5 rounded-md bg-graphite-800 hover:bg-graphite-700 text-slate-200 border border-scientific-border font-sans text-xs font-medium transition-colors"
              >
                Research Workstation
              </button>
              <button
                onClick={() => navigate('/app/authority')}
                className="px-3.5 py-1.5 rounded-md bg-graphite-800 hover:bg-graphite-700 text-amber-300 border border-amber-500/30 font-sans text-xs font-medium transition-colors"
              >
                Authority Command
              </button>
              <button
                onClick={() => navigate('/app/citizen')}
                className="px-3.5 py-1.5 rounded-md bg-graphite-800 hover:bg-graphite-700 text-emerald-300 border border-emerald-500/30 font-sans text-xs font-medium transition-colors"
              >
                Citizen Safety
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* KEY RESEARCH CAPABILITIES GRID */}
      <section className="py-20 px-6 sm:px-12 lg:px-20 border-t border-scientific-border bg-graphite-900/40">
        <div className="max-w-6xl mx-auto space-y-10">
          <div>
            <span className="text-xs font-heading font-semibold uppercase tracking-wider text-observation">
              Interactive Instruments
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1.5">
              Workstation Research Capabilities
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div
              onClick={() => navigate('/app/digital-twin')}
              className="border border-scientific-border rounded-lg p-6 bg-graphite-950/70 hover:border-slate-500 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-md bg-observation/10 border border-observation/25 flex items-center justify-center text-observation mb-4 group-hover:scale-105 transition-transform">
                <Box className="w-5 h-5" />
              </div>
              <h4 className="text-base font-heading font-semibold text-white mb-2">
                3D Atmospheric Digital Twin
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Interactive 0–12 km atmospheric volume visualizing orographic terrain, vertical grids, updrafts, downdrafts, moisture flux particles, and hail-growth zones across -3h to +6h timelines.
              </p>
              <span className="text-xs text-observation font-medium inline-flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Open Digital Twin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Box 2 */}
            <div
              onClick={() => navigate('/app/predictability')}
              className="border border-scientific-border rounded-lg p-6 bg-graphite-950/70 hover:border-slate-500 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-md bg-predictability/10 border border-predictability/25 flex items-center justify-center text-predictability-light mb-4 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-base font-heading font-semibold text-white mb-2">
                Predictability Horizon Analysis
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Quantitative tracking of phase-space divergence and information entropy to establish the earliest defensible warning window before convective release.
              </p>
              <span className="text-xs text-predictability-light font-medium inline-flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>View Predictability Instruments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Box 3 */}
            <div
              onClick={() => navigate('/app/laboratory')}
              className="border border-scientific-border rounded-lg p-6 bg-graphite-950/70 hover:border-slate-500 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-md bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-300 mb-4 group-hover:scale-105 transition-transform">
                <GitBranch className="w-5 h-5" />
              </div>
              <h4 className="text-base font-heading font-semibold text-white mb-2">
                Atmospheric Difference Finder
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Synchronized counterfactual comparison between events where severe convection developed versus similar environments where convection failed due to dry-slot intrusion.
              </p>
              <span className="text-xs text-amber-300 font-medium inline-flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Enter Storm Laboratory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SCIENTIFIC INTEGRITY FOOTER */}
      <footer className="mt-auto border-t border-scientific-border bg-graphite-950 px-6 sm:px-12 lg:px-20 py-8 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-heading font-bold text-slate-200">PRAGYA</span>
            <span className="text-slate-600">|</span>
            <span>Research Prototype</span>
            <span className="text-slate-600">|</span>
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

