import React, { useState } from 'react';
import { atmosphericService } from '../services/atmosphericService';
import {
  Bell,
  AlertTriangle,
  Languages,
  Clock,
  ShieldAlert,
  CloudRain,
  Zap,
  Wind,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  PhoneCall
} from 'lucide-react';

type Lang = 'en' | 'hi' | 'mr';

export const CitizenAlertsPage: React.FC = () => {
  const alert = atmosphericService.getActiveCitizenAlert();
  const [lang, setLang] = useState<Lang>('en');

  const text = alert.translations[lang];
  const guidanceList = alert.safetyGuidance[lang];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar with Language Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-graphite-900 border border-scientific-border p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-amber-500/15 border border-amber-500/40 text-amber-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-mono text-base font-bold text-slate-100">
              CITIZEN-FACING EARLY ADVISORY INTERFACE
            </h2>
            <p className="text-xs text-scientific-muted font-mono">
              Simplified, high-clarity warning translation designed for public comprehension.
            </p>
          </div>
        </div>

        {/* Trilingual Selector */}
        <div className="flex items-center space-x-1 font-mono text-xs bg-graphite-950 p-1 rounded border border-scientific-border">
          <Languages className="w-4 h-4 text-scientific-muted ml-2 mr-1" />
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded transition-all font-semibold ${
              lang === 'en'
                ? 'bg-scientific-panel text-observation border border-scientific-border shadow'
                : 'text-scientific-muted hover:text-slate-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-3 py-1.5 rounded transition-all font-semibold ${
              lang === 'hi'
                ? 'bg-scientific-panel text-observation border border-scientific-border shadow'
                : 'text-scientific-muted hover:text-slate-200'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLang('mr')}
            className={`px-3 py-1.5 rounded transition-all font-semibold ${
              lang === 'mr'
                ? 'bg-scientific-panel text-observation border border-scientific-border shadow'
                : 'text-scientific-muted hover:text-slate-200'
            }`}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MANDATORY CITIZEN DEMO DISCLAIMER BANNER */}
      {/* ===================================================================== */}
      <div className="bg-red-950/30 border-2 border-red-500/60 p-4 rounded-lg flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
          <div>
            <span className="font-mono font-bold text-sm text-red-300 uppercase tracking-wider block">
              DEMO ALERT — NOT AN OFFICIAL WARNING
            </span>
            <p className="text-xs font-mono text-red-200/80">
              PRAGYA is an experimental scientific research architecture. In real emergencies, follow broadcasts from the India Meteorological Department (IMD) and State Disaster Management Authorities.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded bg-red-900/60 text-red-200 font-mono text-xs font-bold shrink-0 hidden sm:inline-block">
          SYNTHETIC TEST
        </span>
      </div>

      {/* ===================================================================== */}
      {/* PRIMARY CITIZEN ALERT CARD */}
      {/* ===================================================================== */}
      <div className="bg-graphite-900 border border-scientific-border rounded-xl p-6 lg:p-8 space-y-6 shadow-2xl">
        {/* Watch Alert Header */}
        <div className="border-b border-scientific-border pb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                LEVEL: WATCH (निगरानी / सतर्कता)
              </span>
              <span className="text-xs font-mono text-scientific-muted">
                ALERT ID: {alert.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {text.title}
            </h1>
            <p className="text-sm font-medium text-amber-400 mt-1">
              {alert.eventType}
            </p>
          </div>

          <div className="bg-graphite-950 px-4 py-3 rounded-lg border border-scientific-border text-right font-mono">
            <span className="text-[10px] text-scientific-muted uppercase block">
              {lang === 'en' ? 'ESTIMATED ARRIVAL' : lang === 'hi' ? 'संभावित आगमन' : 'अपेक्षित वेळ'}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-observation tabular-nums">
              42 – 65 min
            </span>
          </div>
        </div>

        {/* Arrival & Confidence Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-graphite-950 p-4 rounded-lg border border-scientific-border flex items-center space-x-3">
            <Clock className="w-5 h-5 text-observation shrink-0" />
            <div>
              <span className="text-xs text-scientific-muted block font-mono">
                {text.arrival}
              </span>
              <span className="text-sm font-semibold text-slate-200">
                Window: 11:00 – 11:25 AM Local Time
              </span>
            </div>
          </div>

          <div className="bg-graphite-950 p-4 rounded-lg border border-scientific-border flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-predictability-light shrink-0" />
            <div>
              <span className="text-xs text-scientific-muted block font-mono">
                {text.confidence}
              </span>
              <span className="text-sm font-semibold text-predictability-light">
                {alert.predictabilityState}
              </span>
            </div>
          </div>
        </div>

        {/* Potential Hazards Grid */}
        <div>
          <h3 className="text-sm font-bold font-mono text-slate-200 uppercase mb-3 flex items-center space-x-2">
            <span>{text.hazardsText}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-graphite-950 p-3.5 rounded-lg border border-scientific-border flex items-center space-x-3">
              <CloudRain className="w-5 h-5 text-observation shrink-0" />
              <div className="text-xs font-mono">
                <span className="font-bold text-slate-100 block">Heavy Rainfall</span>
                <span className="text-scientific-muted">50–80 mm/hr peak</span>
              </div>
            </div>

            <div className="bg-graphite-950 p-3.5 rounded-lg border border-scientific-border flex items-center space-x-3">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-xs font-mono">
                <span className="font-bold text-slate-100 block">Lightning</span>
                <span className="text-scientific-muted">Frequent cloud-to-ground</span>
              </div>
            </div>

            <div className="bg-graphite-950 p-3.5 rounded-lg border border-scientific-border flex items-center space-x-3">
              <Wind className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="text-xs font-mono">
                <span className="font-bold text-slate-100 block">Strong Winds</span>
                <span className="text-scientific-muted">Gusts exceeding 65 km/h</span>
              </div>
            </div>

            <div className="bg-graphite-950 p-3.5 rounded-lg border border-scientific-border flex items-center space-x-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <div className="text-xs font-mono">
                <span className="font-bold text-slate-100 block">Ghat Waterlogging</span>
                <span className="text-scientific-muted">Low-lying causeways</span>
              </div>
            </div>
          </div>
        </div>

        {/* Affected Regions */}
        <div className="p-3.5 rounded-lg bg-graphite-950 border border-scientific-border font-mono text-xs flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold">
            {lang === 'en' ? 'AFFECTED SECTORS:' : lang === 'hi' ? 'प्रभावित क्षेत्र:' : 'बाधित भाग:'}
          </span>
          {alert.affectedDistricts.map((dist, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-graphite-900 border border-scientific-border text-slate-200">
              {dist}
            </span>
          ))}
        </div>

        {/* Safety Guidance Checklist */}
        <div className="pt-2">
          <h3 className="text-sm font-bold font-mono text-slate-200 uppercase mb-3 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{text.guidanceHeader}</span>
          </h3>

          <div className="space-y-2.5">
            {guidanceList.map((item, idx) => (
              <div
                key={idx}
                className="bg-graphite-950 p-3.5 rounded-lg border border-scientific-border flex items-start space-x-3"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
