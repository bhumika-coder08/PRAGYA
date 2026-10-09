import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  Clock,
  Compass,
  AlertTriangle,
  Activity,
  Layers,
  CheckCircle2,
  Info,
  Radio,
  Eye,
  EyeOff,
  Bell,
  ArrowUpRight,
  TrendingUp,
  Volume2,
  ExternalLink,
  ChevronRight,
  Sliders,
  Sparkles,
  Languages
} from 'lucide-react';
import { useAtmosphere } from '../context/AtmosphericContext';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';
import { ImpactZoneMap } from '../components/common/ImpactZoneMap';
import { apiClient } from '../services/apiClient';

type Lang = 'en' | 'hi' | 'mr';

export const AuthorityCommandPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCell, cells } = useAtmosphere();

  const [activeTimelineOffset, setActiveTimelineOffset] = useState<number>(-30); // T-30 default
  const [features, setFeatures] = useState<any | null>(null);
  const [precursors, setPrecursors] = useState<any[]>([]);
  const [infoValue, setInfoValue] = useState<any | null>(null);
  const [previewLang, setPreviewLang] = useState<Lang>('en');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Fetch real/simulated scientific analysis
  useEffect(() => {
    const replayTime = activeTimelineOffset === -30
      ? '2023-07-09T11:15:00Z'
      : activeTimelineOffset === -60
      ? '2023-07-09T10:45:00Z'
      : activeTimelineOffset === -120
      ? '2023-07-09T09:45:00Z'
      : '2023-07-09T11:45:00Z';

    Promise.all([
      apiClient.getFeatures({ eventId: 'evt-2023-dhr', replayTime }),
      apiClient.getPrecursors({ eventId: 'evt-2023-dhr', replayTime }),
      apiClient.getInformationValueReport(replayTime),
    ]).then(([f, p, iv]) => {
      if (f) setFeatures(f);
      if (p) setPrecursors(p);
      if (iv) setInfoValue(iv);
    }).catch(console.error);
  }, [activeTimelineOffset]);

  const fData = features?.features || {};
  const cape = fData['cape']?.value ?? 3450;
  const pw = fData['precipitable_water']?.value ?? 62.4;
  const ref = fData['radar_reflectivity']?.value ?? 54.0;
  const w = fData['vertical_velocity']?.value ?? 14.8;
  const ctt = fData['cloud_top_temperature']?.value ?? -58.0;

  // Predictability metrics
  const eventRisk = activeTimelineOffset >= -30 ? 82 : activeTimelineOffset >= -60 ? 58 : 28;
  const predictability = activeTimelineOffset >= -30 ? 76 : activeTimelineOffset >= -60 ? 46 : 22;
  const observationConfidence = 84;
  const horizonCrossed = activeTimelineOffset >= -35;

  // Deterministic atmospheric story template
  const generateAtmosphericStory = () => {
    const lines = [];
    if (pw > 50) {
      lines.push(`Deep-layer moisture convergence has concentrated precipitable water to ${pw.toFixed(1)} mm.`);
    }
    if (cape > 2500) {
      lines.push(`Thermodynamic instability is elevated (CAPE: ${cape.toFixed(0)} J/kg) with strong buoyant potential.`);
    }
    if (w > 10) {
      lines.push(`Severe updraft velocity pulses (${w.toFixed(1)} m/s) indicate active vertical acceleration.`);
    }
    if (ctt < -50) {
      lines.push(`Infrared satellite scans show cloud-top cooling reaching ${ctt.toFixed(1)}°C.`);
    }
    if (horizonCrossed) {
      lines.push('Ensemble future trajectories have converged on a dominant localized downburst corridor.');
    } else {
      lines.push('Atmospheric futures remain partially divergent; ongoing monitoring required.');
    }
    return lines.join(' ');
  };

  // Trilingual advisory wording
  const advisoryMessages = {
    en: {
      headline: 'PRAGYA CONVECTIVE RESEARCH EARLY ADVISORY',
      location: 'Dhaula Kuan & South-West NCT Corridor',
      situation: 'Rapid convective organization detected. High probability of localized severe rain downburst within 35–50 minutes.',
      window: '11:35 – 12:45 UTC (17:05 – 18:15 IST)',
      confidence: 'High Research Confidence (84%)',
      actions: [
        'Alert drainage maintenance personnel at underpasses and low-lying arterial roads.',
        'Verify radar telemetry stream availability at Palam Doppler node.',
        'Review agency protocol for localized urban waterlogging.',
      ],
      disclaimer: 'PRAGYA is an experimental research architecture. Follow official IMD broadcasts for emergency instructions.',
    },
    hi: {
      headline: 'प्रज्ञा संवहनीय अनुसंधान पूर्व-परामर्श',
      location: 'धौला कुआँ एवं दक्षिण-पश्चिम दिल्ली क्षेत्र',
      situation: 'तीव्र संवहनीय वायुमंडलीय संगठन दर्ज किया गया। अगले ३५-५० मिनट में अत्यधिक स्थानीय वर्षा का तीव्र जोखिम।',
      window: '१७:०५ - १८:१५ भारतीय मानक समय (IST)',
      confidence: 'उच्च अनुसंधान विश्वसनीयता (८४%)',
      actions: [
        'निचले अंडरपास और जलभराव संभावित मार्गों पर जल निकासी दल को सतर्क करें।',
        'पालम डॉप्लर रडार डेटा स्ट्रीम की उपलब्धता सुनिश्चित करें।',
        'स्थानीय आपदा प्रबंधन मानक संचालन प्रक्रिया की समीक्षा करें।',
      ],
      disclaimer: 'प्रज्ञा एक प्रयोगात्मक अनुसंधान प्रणाली है। आधिकारिक चेतावनी हेतु भारत मौसम विज्ञान विभाग (IMD) के निर्देशों का पालन करें।',
    },
    mr: {
      headline: 'प्रज्ञा वातावरणीय संशोधन पूर्व-सूचना',
      location: 'धौला कुआँ आणि नैऋत्य दिल्ली परिसर',
      situation: 'तीव्र वातावरणीय संवहन निर्मितीचे संकेत. पुढील ३५-५० मिनिटांत मुसळधार स्थानिक पर्जन्यवृष्टीची शक्यता.',
      window: '१७:०५ - १८:१५ भारतीय प्रमाणवेळ (IST)',
      confidence: 'उच्च संशोधन विश्वासार्हता (८४%)',
      actions: [
        'खोलगट रस्ते व भुयारी मार्गांवर आपत्कालीन निचरा यंत्रणा सज्ज ठेवा.',
        'हवामान रडार टेलिमेट्रीची निरंतरता तपासा.',
        'स्थानिक आपत्ती व्यवस्थापन प्राधिकरणाच्या नियमावलीचे पुनरावलोकन करा.',
      ],
      disclaimer: 'प्रज्ञा हे प्रायोगिक संशोधन व्यासपीठ आहे. अधिकृत सूचनांसाठी भारतीय हवामान विभाग (IMD) चे पालन करा.',
    },
  };

  const currentAdvisory = advisoryMessages[previewLang];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-xs">
      {/* Top Authority Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-graphite-900 border border-scientific-border p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-base font-heading font-bold text-slate-100">
                Authority Command Centre
              </h2>
              <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Demonstration Case
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Decision-support translation layer synthesizing predictability horizons into actionable agency situational awareness.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => navigate('/app/digital-twin')}
            className="px-3 py-1.5 rounded-md bg-graphite-950 hover:bg-graphite-850 text-slate-200 border border-scientific-border flex items-center space-x-1.5 text-xs font-medium transition-colors"
          >
            <span>3D Command Twin</span>
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
          </button>
          <button
            onClick={() => setPreviewModalOpen(true)}
            className="px-3.5 py-1.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 font-medium flex items-center space-x-1.5 text-xs transition-colors shadow-xs"
          >
            <Bell className="w-3.5 h-3.5 text-amber-300" />
            <span>Preview Citizen Message</span>
          </button>
        </div>
      </div>

      {/* Six Key Questions Overview Card */}
      <div className="bg-graphite-900 border border-scientific-border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-scientific-border pb-3">
          <span className="text-xs font-heading font-semibold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>Executive Atmospheric Situational Report</span>
          </span>
          <span className="text-xs font-sans text-slate-400">
            Target Domain: <span className="text-slate-300 font-medium">Dhaula Kuan Research Corridor</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Q1: WHAT */}
          <div className="p-3.5 rounded-md bg-graphite-950 border border-scientific-border space-y-1.5">
            <span className="text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-wide block">1. What is developing?</span>
            <h4 className="font-heading font-semibold text-slate-100 text-xs text-amber-300">
              Severe Localized Downburst & Micro-Genesis
            </h4>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              Reflectivity surging &gt;52 dBZ with violent updraft pulses (&gt;14 m/s). Precipitable water exceeds 62 mm.
            </p>
          </div>

          {/* Q2: WHERE */}
          <div className="p-3.5 rounded-md bg-graphite-950 border border-scientific-border space-y-1.5">
            <span className="text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-wide block">2. Where could it matter?</span>
            <h4 className="font-heading font-semibold text-slate-100 text-xs text-sky-300">
              Dhaula Kuan Underpasses & South-West NCT
            </h4>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              Vulnerable drainage bottleneck along Ring Road / Vande Mataram Marg elevation depression.
            </p>
          </div>

          {/* Q3: WHEN */}
          <div className="p-3.5 rounded-md bg-graphite-950 border border-scientific-border space-y-1.5">
            <span className="text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-wide block">3. When could it matter?</span>
            <h4 className="font-heading font-semibold text-slate-100 text-xs text-emerald-300">
              Impact Window: 17:15 – 18:00 IST (T+15m to T+60m)
            </h4>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              Earliest core rainfall onset projected within 20–35 minutes based on radar reflectivity growth.
            </p>
          </div>

          {/* Q4: HOW PREDICTABLE */}
          <div className="p-3.5 rounded-md bg-graphite-950 border border-scientific-border space-y-1.5">
            <span className="text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-wide block">4. How predictable is it?</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-base font-semibold font-mono text-purple-300">{predictability}%</span>
              <span className="text-[11px] font-sans font-medium text-emerald-400">
                {horizonCrossed ? 'Horizon Crossed (35m Lead)' : 'Below Horizon'}
              </span>
            </div>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              Ensemble divergence has dropped to 0.24. 18 of 20 members converge on severe rainfall.
            </p>
          </div>

          {/* Q5: HOW CONFIDENT */}
          <div className="p-3.5 rounded-md bg-graphite-950 border border-scientific-border space-y-1.5">
            <span className="text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-wide block">5. How confident are observations?</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-base font-semibold font-mono text-slate-100">{observationConfidence}%</span>
              <span className="text-[11px] font-sans font-medium text-slate-300">High Observation Health</span>
            </div>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              Dual-polarization Doppler radar and surface AWS reporting on scheduled cadence.
            </p>
          </div>

          {/* Q6: WHAT IS MISSING */}
          <div className="p-3.5 rounded-md bg-graphite-950 border border-scientific-border space-y-1.5">
            <span className="text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-wide block">6. What is missing?</span>
            <h4 className="font-heading font-semibold text-slate-100 text-xs text-rose-300">
              Low-Level Microwave Sounding Profile
            </h4>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              Boundary layer moisture sounding is ~45 min stale; surface AWS moisture convergence used as proxy.
            </p>
          </div>
        </div>
      </div>

      {/* Decision Timeline Bar */}
      <div className="bg-graphite-900 border border-scientific-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading font-semibold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Decision Timeline Navigation (Minutes to Event Onset)</span>
          </span>
          <span className="text-xs font-sans text-slate-400">
            Current Replay: <strong className="font-mono text-slate-200 font-semibold">T{activeTimelineOffset >= 0 ? `+${activeTimelineOffset}` : activeTimelineOffset}m</strong>
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {[-180, -120, -60, -30, 0, 30, 60].map((t) => {
            const isSelected = activeTimelineOffset === t;
            return (
              <button
                key={t}
                onClick={() => setActiveTimelineOffset(t)}
                className={`p-2.5 rounded-md border text-center transition-colors ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-200 font-semibold shadow-xs'
                    : 'bg-graphite-950 border-scientific-border hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-mono font-semibold">{t === 0 ? 'Onset (T0)' : `T${t > 0 ? `+${t}` : t}m`}</div>
                <div className="text-[11px] font-sans text-slate-400 mt-0.5 truncate">
                  {t === -180 ? 'Equilibrium' : t === -60 ? 'Precursors' : t === -30 ? 'Horizon Locked' : t === 0 ? 'Cloudburst' : 'Dissipation'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Geographic Impact & What Changed */}
        <div className="lg:col-span-7 space-y-5">
          {/* Interactive Geographic Impact Zone */}
          <ImpactZoneMap
            centerLat={28.5921}
            centerLon={77.1611}
            locationName="Dhaula Kuan Corridor (NCT Delhi)"
            impactRadiusKm={7.8}
            uncertaintyRadiusKm={16.5}
            isSimulated={true}
          />

          {/* Atmospheric Story Panel */}
          <div className="bg-graphite-900 border border-scientific-border rounded-lg p-4 space-y-2.5">
            <span className="text-xs font-heading font-semibold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>The Atmospheric Story</span>
            </span>
            <p className="text-xs font-sans text-slate-300 leading-relaxed bg-graphite-950 p-3.5 rounded-md border border-scientific-border/80 italic">
              "{generateAtmosphericStory()}"
            </p>
          </div>

          {/* What Changed in the Last 30 Minutes? */}
          <div className="bg-graphite-900 border border-scientific-border rounded-lg p-4 space-y-3">
            <span className="text-xs font-heading font-semibold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>What Changed in the Last 30 Minutes?</span>
            </span>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-md bg-graphite-950 border border-scientific-border">
                <span className="text-[11px] font-sans text-slate-400 block">Radar Echo</span>
                <span className="font-mono font-semibold text-rose-400 block text-xs mt-0.5">↑ +18 dBZ <span className="font-sans text-[10px] text-slate-400">(surging)</span></span>
              </div>
              <div className="p-2.5 rounded-md bg-graphite-950 border border-scientific-border">
                <span className="text-[11px] font-sans text-slate-400 block">Precipitable Water</span>
                <span className="font-mono font-semibold text-amber-400 block text-xs mt-0.5">↑ +6.2 mm <span className="font-sans text-[10px] text-slate-400">(accumulating)</span></span>
              </div>
              <div className="p-2.5 rounded-md bg-graphite-950 border border-scientific-border">
                <span className="text-[11px] font-sans text-slate-400 block">Future Divergence</span>
                <span className="font-mono font-semibold text-emerald-400 block text-xs mt-0.5">↓ -0.42 <span className="font-sans text-[10px] text-slate-400">(converging)</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Explainability, Uncertainty & Decision Support */}
        <div className="lg:col-span-5 space-y-5">
          {/* Why PRAGYA is Concerned vs What Limits Confidence */}
          <div className="bg-graphite-900 border border-scientific-border rounded-lg p-4 space-y-3.5">
            <div className="space-y-2">
              <span className="text-xs font-heading font-semibold text-amber-400 uppercase tracking-wide flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Why is PRAGYA Concerned?</span>
              </span>
              <ul className="space-y-1.5 text-xs font-sans text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong className="text-slate-200">Moisture Saturation:</strong> Boundary layer mixing ratio reached 19.2 g/kg.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong className="text-slate-200">Thermodynamic Instability:</strong> CAPE exceeds 3,400 J/kg with minimal CIN (-4 J/kg).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong className="text-slate-200">Ensemble Consensus:</strong> 90% of model members predict rapid downburst onset.</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-scientific-border space-y-2">
              <span className="text-xs font-heading font-semibold text-sky-400 uppercase tracking-wide flex items-center space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>What Limits Confidence?</span>
              </span>
              <ul className="space-y-1 text-xs font-sans text-slate-400">
                <li>• Radiosonde sounding interval is 12-hourly; micro-layer capping inferred from AWS.</li>
                <li>• Orographic ridge interaction can cause micro-deflection not captured at 1km grid.</li>
              </ul>
            </div>
          </div>

          {/* Three Representative Futures (Simplified Multiverse for Authorities) */}
          <div className="bg-graphite-900 border border-scientific-border rounded-lg p-4 space-y-3">
            <span className="text-xs font-heading font-semibold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Representative Atmospheric Futures</span>
            </span>

            <div className="space-y-2">
              <div className="p-2.5 rounded-md bg-graphite-950 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="font-heading font-semibold text-emerald-400 text-xs block">Low Impact (15% prob)</span>
                  <span className="text-xs font-sans text-slate-400">Cell shears north; rain stays &lt;25 mm/hr</span>
                </div>
                <span className="text-xs font-sans text-emerald-300 font-medium">Dissipation</span>
              </div>

              <div className="p-2.5 rounded-md bg-graphite-950 border border-amber-500/40 flex items-center justify-between">
                <div>
                  <span className="font-heading font-semibold text-amber-400 text-xs block">Central Scenario (65% prob)</span>
                  <span className="text-xs font-sans text-slate-400">Torrential rain core 70–90 mm/hr over Dhaula Kuan</span>
                </div>
                <span className="text-xs font-sans text-amber-300 font-medium">Cloudburst</span>
              </div>

              <div className="p-2.5 rounded-md bg-graphite-950 border border-rose-500/40 flex items-center justify-between">
                <div>
                  <span className="font-heading font-semibold text-rose-400 text-xs block">High Impact (20% prob)</span>
                  <span className="text-xs font-sans text-slate-400">Severe squall with hail accretion &gt;110 mm/hr</span>
                </div>
                <span className="text-xs font-sans text-rose-300 font-medium">Supercell</span>
              </div>
            </div>
          </div>

          {/* Decision Support (Not Automated Orders) */}
          <div className="bg-graphite-900 border border-scientific-border rounded-lg p-4 space-y-2.5">
            <span className="text-xs font-heading font-semibold text-slate-200 uppercase tracking-wide block">
              Decision Support Protocol (Recommended Considerations)
            </span>
            <ul className="space-y-1.5 text-xs font-sans text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Verify pump readiness at Dhaula Kuan & Moti Bagh underpasses.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Increase Doppler radar volumetric sweep cadence to 5 minutes.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Review agency protocol for localized urban waterlogging.</span>
              </li>
            </ul>
            <span className="text-[11px] font-sans text-slate-400 block pt-1 border-t border-scientific-border/40">
              PRAGYA assists command decisions; operational escalation follows official agency hierarchy.
            </span>
          </div>

          {/* What Data Would Help Most Now? (Information Value Experiment Integration) */}
          <div className="bg-graphite-900 border border-scientific-border rounded-lg p-4 space-y-2">
            <span className="text-xs font-heading font-semibold text-sky-300 uppercase tracking-wide block">
              Sensor Priority (What Data Would Help Most?)
            </span>
            <div className="space-y-1.5 text-xs font-sans">
              <div className="flex items-center justify-between p-2 rounded-md bg-graphite-950 border border-scientific-border">
                <span className="text-slate-300">1. Doppler Radar Volumetric Core</span>
                <span className="text-sky-400 font-mono font-semibold">+28% Confidence</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-graphite-950 border border-scientific-border">
                <span className="text-slate-300">2. Valley X-Band Micro-Radar Node</span>
                <span className="text-sky-400 font-mono font-semibold">+18% Confidence</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-graphite-950 border border-scientific-border">
                <span className="text-slate-300">3. High-Rate 5-min Satellite Rapid Scan</span>
                <span className="text-slate-400 font-mono font-semibold">+12% Confidence</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trilingual Communication Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-graphite-950 border border-amber-500/40 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-scientific-border pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="font-heading font-semibold text-xs text-slate-100 uppercase tracking-wide">
                  Citizen Advisory Preview (Demo Only)
                </span>
              </div>
              <div className="flex items-center space-x-1 font-sans">
                {(['en', 'hi', 'mr'] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setPreviewLang(l)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      previewLang === l ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40' : 'bg-graphite-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {l === 'en' ? 'EN' : l === 'hi' ? 'हिन्दी' : 'मराठी'}
                  </button>
                ))}
                <button onClick={() => setPreviewModalOpen(false)} className="text-slate-400 hover:text-white ml-2 text-base">×</button>
              </div>
            </div>

            <div className="bg-graphite-900 p-4 rounded-lg border border-amber-500/30 space-y-2 text-xs font-sans">
              <h4 className="font-heading font-semibold text-amber-300 text-sm">{currentAdvisory.headline}</h4>
              <div className="text-xs text-slate-300"><strong>Location:</strong> {currentAdvisory.location}</div>
              <p className="text-slate-200 leading-relaxed">{currentAdvisory.situation}</p>
              <div className="text-xs text-sky-300"><strong>Time Window:</strong> {currentAdvisory.window}</div>
              <div className="text-xs text-purple-300"><strong>Confidence:</strong> {currentAdvisory.confidence}</div>

              <div className="pt-2 border-t border-scientific-border space-y-1">
                <span className="font-heading font-semibold text-xs text-slate-200 block">Recommended Actions:</span>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {currentAdvisory.actions.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-xs font-sans text-amber-400/90 italic">
              *{currentAdvisory.disclaimer}
            </p>

            <div className="flex justify-end space-x-2 pt-2 border-t border-scientific-border">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-1.5 rounded-md bg-graphite-850 hover:bg-graphite-800 text-slate-200 text-xs font-medium border border-scientific-border transition-colors"
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
