import React, { useState } from 'react';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';
import { ExperimentWorkflowRunner } from '../components/common/ExperimentWorkflowRunner';
import { DataAvailabilityMatrix } from '../components/common/DataAvailabilityMatrix';
import { DataIngestionPanel } from '../components/common/DataIngestionPanel';
import { LeakageTestConsole } from '../components/common/LeakageTestConsole';
import { ScientificLimitationsPanel } from '../components/common/ScientificLimitationsPanel';
import { SystemArchitectureDiagram } from '../components/common/SystemArchitectureDiagram';
import {
  BookOpen,
  HelpCircle,
  Lightbulb,
  Workflow,
  Cpu,
  GitBranch,
  ShieldAlert,
  FileCheck,
  Compass,
  AlertTriangle,
  History,
  Layers,
  FlaskConical,
  Database,
  Terminal,
  Scale
} from 'lucide-react';

export const ResearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'blueprint' | 'architecture' | 'experiment' | 'availability' | 'ingestion' | 'leakage' | 'limitations'
  >('blueprint');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-mono text-xs">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-graphite-900 border border-scientific-border p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-predictability/15 border border-predictability/40 text-predictability-light">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-100">
                PRAGYA RESEARCH HEADQUARTERS & SCIENTIFIC TESTBED
              </h2>
              <SimulatedDataBadge size="sm" />
            </div>
            <p className="text-scientific-muted">
              Predictability & Rapid Atmospheric Genesis Intelligence Architecture | Research Protocols & Data Infrastructure
            </p>
          </div>
        </div>

        <span className="text-scientific-muted px-2.5 py-1 rounded bg-graphite-950 border border-scientific-border">
          DOC ID: PRAGYA-SPEC-2026-V2.1
        </span>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto bg-graphite-900 p-1.5 rounded-lg border border-scientific-border text-[11px]">
        {[
          { id: 'blueprint', label: 'Research Blueprint & Hypotheses', icon: BookOpen },
          { id: 'architecture', label: 'Pipeline Architecture Flow', icon: Workflow },
          { id: 'experiment', label: 'Experiment Dashboard', icon: FlaskConical },
          { id: 'availability', label: 'Data Availability Matrix', icon: Layers },
          { id: 'ingestion', label: 'Authoritative Adapters & Ingestion', icon: Database },
          { id: 'leakage', label: 'Causality & Leakage Tests', icon: Terminal },
          { id: 'limitations', label: 'Scientific Limitations & Ethics', icon: Scale },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-observation text-graphite-950 font-bold shadow'
                  : 'text-scientific-muted hover:text-slate-200 hover:bg-graphite-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BLUEPRINT & HYPOTHESES */}
      {activeTab === 'blueprint' && (
        <div className="space-y-6">
          {/* Prominent Disclaimer */}
          <div className="bg-graphite-900 border-2 border-amber-500/60 p-5 rounded-lg flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-sm text-amber-300 uppercase tracking-wide block">
                OFFICIAL METEOROLOGICAL DISCLAIMER
              </span>
              <p className="text-slate-200 text-sm leading-relaxed">
                "PRAGYA is an experimental research prototype and does not replace official meteorological forecasts or emergency warnings."
              </p>
              <p className="text-scientific-muted text-[11px] pt-1">
                All operational warnings in the Republic of India are under the statutory mandate of the India Meteorological Department (IMD) and National Disaster Management Authority (NDMA).
              </p>
            </div>
          </div>

          {/* 1. Research Question */}
          <section className="bg-graphite-900 border border-scientific-border rounded-lg p-6 space-y-3">
            <div className="flex items-center space-x-2 text-observation font-bold uppercase pb-2 border-b border-scientific-border">
              <HelpCircle className="w-4 h-4" />
              <span>1. Central Research Question</span>
            </div>

            <blockquote className="border-l-2 border-observation pl-4 py-1 text-sm font-semibold text-slate-100 italic">
              "When does a rapidly developing localized extreme convective event first become reliably predictable from the atmospheric information available at that time?"
            </blockquote>

            <p className="text-scientific-muted leading-relaxed text-xs">
              Operational Numerical Weather Prediction (NWP) models excel at synoptic and mesoscale environment characterization, but struggle with localized convective initiation timing and peak precipitation intensity. PRAGYA investigates the temporal boundary where atmospheric entropy transitions from stochastic chaos to defensible deterministic certainty.
            </p>
          </section>

          {/* 2. Working Hypothesis */}
          <section className="bg-graphite-900 border border-scientific-border rounded-lg p-6 space-y-3">
            <div className="flex items-center space-x-2 text-predictability-light font-bold uppercase pb-2 border-b border-scientific-border">
              <Lightbulb className="w-4 h-4" />
              <span>2. Working Scientific Hypothesis</span>
            </div>

            <p className="text-slate-200 text-xs leading-relaxed">
              <strong>The Bifurcation Collapse Hypothesis:</strong> Prior to deep moist convective genesis, the boundary layer and lower troposphere enter an attractor basin characterized by rapid phase space convergence. By monitoring the joint divergence of high-cadence Doppler velocity, satellite infrared cooling rates, and orographic convergence lines, the moment of irreversible convective commitment can be detected <strong>35 to 65 minutes before severe ground precipitation onset</strong>, well before traditional radar reflectivity exceeds 50 dBZ.
            </p>
          </section>

          {/* 3. Orthogonal Distinction: Risk vs Predictability */}
          <section className="bg-graphite-900 border border-scientific-border rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2 text-amber-400 font-bold uppercase pb-2 border-b border-scientific-border">
              <Compass className="w-4 h-4" />
              <span>3. Orthogonal Distinction: Event Risk vs Predictability</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-graphite-950 p-4 rounded border border-scientific-border">
                <span className="text-red-400 font-bold block mb-1">EVENT RISK (LIKELIHOOD)</span>
                <p className="text-scientific-muted leading-relaxed text-xs">
                  Measures the unconditional or conditional probability that severe convective phenomena (heavy downbursts, hail, lightning) will manifest within a geographic area. High CAPE with low CIN often yields high risk, even if the timing is completely uncertain.
                </p>
              </div>

              <div className="bg-graphite-950 p-4 rounded border border-scientific-border">
                <span className="text-predictability font-bold block mb-1">PREDICTABILITY (CONFIDENCE HORIZON)</span>
                <p className="text-scientific-muted leading-relaxed text-xs">
                  Measures how confidently current atmospheric observations permit this specific trajectory to be distinguished from competing null scenarios (e.g. capping inversion holding or anvil shearing). High risk in a high-entropy state is not actionable; defensible warnings require high predictability.
                </p>
              </div>
            </div>

            <div className="p-3 bg-graphite-950 rounded border border-scientific-border text-[11px] text-slate-400">
              <strong className="text-slate-200">Rule:</strong> An operational alert should only be issued when <strong>Predictability</strong> crosses the defensible threshold (typically &ge; 70%), irrespective of background risk level.
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: ARCHITECTURE FLOW */}
      {activeTab === 'architecture' && (
        <SystemArchitectureDiagram />
      )}

      {/* TAB 3: EXPERIMENT DASHBOARD */}
      {activeTab === 'experiment' && (
        <ExperimentWorkflowRunner />
      )}

      {/* TAB 4: DATA AVAILABILITY MATRIX */}
      {activeTab === 'availability' && (
        <DataAvailabilityMatrix />
      )}

      {/* TAB 5: AUTHORITATIVE INGESTION & ADAPTERS */}
      {activeTab === 'ingestion' && (
        <DataIngestionPanel />
      )}

      {/* TAB 6: LEAKAGE TEST SUITE */}
      {activeTab === 'leakage' && (
        <LeakageTestConsole />
      )}

      {/* TAB 7: SCIENTIFIC LIMITATIONS */}
      {activeTab === 'limitations' && (
        <ScientificLimitationsPanel />
      )}
    </div>
  );
};
