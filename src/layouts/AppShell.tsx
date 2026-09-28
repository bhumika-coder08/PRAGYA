import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Radio,
  Box,
  Compass,
  GitBranch,
  FlaskConical,
  History,
  Waves,
  EyeOff,
  BarChart3,
  Bell,
  BookOpen,
  Settings,
  ChevronRight,
  Shield,
  ShieldAlert,
  Clock,
  Database,
  ExternalLink,
  Menu,
  X,
  RefreshCw,
  Users,
  Cpu
} from 'lucide-react';
import { useAtmosphere } from '../context/AtmosphericContext';
import { SimulatedDataBadge } from '../components/common/SimulatedDataBadge';
import { JudgeModeTour } from '../components/common/JudgeModeTour';
import { SystemHealthDrawer } from '../components/common/SystemHealthDrawer';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: string;
}

interface NavGroup {
  category: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    category: 'COMMAND',
    items: [
      { path: '/app/overview', label: 'Overview', icon: Activity },
      { path: '/app/digital-twin', label: '3D Digital Twin', icon: Box, highlight: true },
      { path: '/app/authority', label: 'Authority Command', icon: ShieldAlert, highlight: true },
    ],
  },
  {
    category: 'RESEARCH',
    items: [
      { path: '/app/predictability', label: 'Predictability', icon: Compass },
      { path: '/app/ensembles', label: 'Future Ensembles', icon: GitBranch },
      { path: '/app/laboratory', label: 'Storm Laboratory', icon: FlaskConical },
      { path: '/app/replay', label: 'Historical Replay', icon: History },
      { path: '/app/impact', label: 'Impact Simulator', icon: Waves },
      { path: '/app/gaps', label: 'Observation Gaps', icon: EyeOff },
      { path: '/app/performance', label: 'Model Performance', icon: BarChart3 },
      { path: '/app/research', label: 'Research Data & Adapters', icon: BookOpen },
    ],
  },
  {
    category: 'PUBLIC SAFETY',
    items: [
      { path: '/app/citizen', label: 'Citizen Safety', icon: Shield, badge: 'PUBLIC' },
      { path: '/app/alerts', label: 'Citizen Alerts (Trilingual)', icon: Bell },
    ],
  },
];

export const AppShell: React.FC = () => {
  const {
    isDemoMode,
    dataSource,
    utcTime,
    istTime,
    isSettingsOpen,
    setIsSettingsOpen,
    cells,
    selectedCell,
    setSelectedCellId,
  } = useAtmosphere();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isJudgeTourOpen, setIsJudgeTourOpen] = useState(false);
  const [isHealthDrawerOpen, setIsHealthDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Active persona mode
  const currentMode = location.pathname.includes('/authority')
    ? 'AUTHORITY'
    : location.pathname.includes('/citizen')
    ? 'CITIZEN'
    : 'RESEARCH';

  return (
    <div className="min-h-screen bg-graphite-950 text-scientific-text flex flex-col font-sans selection:bg-predictability selection:text-white">
      {/* ========================================================================= */}
      {/* TOP COMMAND BAR */}
      {/* ========================================================================= */}
      <header className="h-14 bg-graphite-900 border-b border-scientific-border px-4 flex items-center justify-between z-30 shrink-0">
        {/* Left: Brand & Prototype Status */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-scientific-muted hover:text-white hover:bg-graphite-800 rounded"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-left group"
            title="Return to PRAGYA Overview Landing"
          >
            <div className="w-7 h-7 rounded bg-graphite-950 border border-observation/40 flex items-center justify-center text-observation font-mono font-bold text-xs group-hover:border-observation transition-colors">
              PЯ
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold tracking-wider text-sm text-slate-100 group-hover:text-observation transition-colors">
                  PRAGYA
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-graphite-800 border border-scientific-border text-scientific-muted hidden sm:inline-block">
                  v1.4-EXP
                </span>
              </div>
              <span className="text-[9px] font-mono text-scientific-muted hidden lg:block leading-none">
                Predictability & Rapid Atmospheric Genesis Intelligence Architecture
              </span>
            </div>
          </button>

          {/* Mode Switcher Tabs */}
          <div className="hidden sm:flex items-center space-x-1 font-mono text-[10px] bg-graphite-950 p-1 rounded border border-scientific-border ml-2">
            <button
              onClick={() => navigate('/app/overview')}
              className={`px-2 py-0.5 rounded transition-all font-bold ${
                currentMode === 'RESEARCH'
                  ? 'bg-scientific-panel text-observation border border-scientific-border'
                  : 'text-scientific-muted hover:text-slate-200'
              }`}
            >
              RESEARCH
            </button>
            <button
              onClick={() => navigate('/app/authority')}
              className={`px-2 py-0.5 rounded transition-all font-bold ${
                currentMode === 'AUTHORITY'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                  : 'text-scientific-muted hover:text-slate-200'
              }`}
            >
              AUTHORITY
            </button>
            <button
              onClick={() => navigate('/app/citizen')}
              className={`px-2 py-0.5 rounded transition-all font-bold ${
                currentMode === 'CITIZEN'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  : 'text-scientific-muted hover:text-slate-200'
              }`}
            >
              CITIZEN
            </button>
          </div>
        </div>

        {/* Center: Active Cell Quick Status */}
        <div className="hidden md:flex items-center space-x-3 text-xs font-mono">
          <SimulatedDataBadge size="sm" />

          <div className="flex items-center space-x-1.5 bg-graphite-950 px-2.5 py-1 rounded border border-scientific-border">
            <span className="text-scientific-muted">FOCUS:</span>
            <select
              value={selectedCell.id}
              onChange={(e) => setSelectedCellId(e.target.value)}
              className="bg-transparent text-observation font-bold font-mono focus:outline-none cursor-pointer"
            >
              {cells.map((c) => (
                <option key={c.id} value={c.id} className="bg-graphite-900 text-slate-200">
                  {c.id} — {c.region.substring(0, 18)}...
                </option>
              ))}
            </select>
            <span
              className={`w-2 h-2 rounded-full ${
                selectedCell.eventRisk >= 70
                  ? 'bg-red-500 animate-pulse'
                  : selectedCell.eventRisk >= 40
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
            />
          </div>
        </div>

        {/* Right: Data Feed, Clocks & Settings */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          {/* Live System Health Drawer Trigger */}
          <button
            onClick={() => setIsHealthDrawerOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-graphite-950 hover:bg-graphite-800 border border-scientific-border text-[11px] text-slate-200 transition-colors"
            title="Inspect Neon Database & Real Data Source Health"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden xl:inline">SYSTEM HEALTH</span>
          </button>

          {/* UTC & IST live clocks */}
          <div className="flex items-center space-x-2 text-[11px] text-scientific-muted bg-graphite-950 px-2 py-1 rounded border border-scientific-border">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-200 tabular-nums">{utcTime.substring(11, 19)} UTC</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 tabular-nums hidden sm:inline">{istTime.substring(0, 8)} IST</span>
          </div>

          {/* JUDGE DEMO guided tour launcher */}
          <button
            onClick={() => setIsJudgeTourOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold transition-all shadow-sm shadow-amber-500/10 cursor-pointer"
            title="Launch 14-Step Interactive Judge Evaluation Tour"
          >
            <span className="text-amber-400">★</span>
            <span>JUDGE DEMO</span>
          </button>

          {/* Settings button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 text-scientific-muted hover:text-slate-100 hover:bg-graphite-800 rounded border border-transparent hover:border-scientific-border transition-colors"
            title="System Configuration & Scientific Parameters"
            aria-label="System Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN BODY: SIDEBAR + CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Left Sidebar */}
        <aside className="w-60 bg-graphite-900 border-r border-scientific-border hidden md:flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="p-3 space-y-4">
            {navGroups.map((group) => (
              <div key={group.category} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-scientific-muted font-bold">
                  {group.category}
                </div>

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive: active }) =>
                        `flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-colors ${
                          active
                            ? 'bg-scientific-panel text-observation font-semibold border-l-2 border-observation pl-2.5'
                            : 'text-scientific-muted hover:text-slate-200 hover:bg-graphite-800'
                        } ${item.highlight ? 'ring-1 ring-predictability/30' : ''}`
                      }
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-observation' : 'text-scientific-muted'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {item.badge}
                        </span>
                      )}
                      {item.highlight && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-predictability/20 text-predictability-light border border-predictability/40">
                          PRO
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer: Scientific Integrity Notice */}
          <div className="p-3 border-t border-scientific-border/80 bg-graphite-950/60 text-[10px] text-scientific-muted font-mono space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-semibold">SCIENTIFIC INTEGRITY</span>
              <span className="text-emerald-400">AUDITED</span>
            </div>
            <p className="text-[9px] leading-tight text-slate-500">
              Research prototype. Event Risk, Predictability, and Confidence are strictly orthogonal.
            </p>
            <div className="pt-1 flex items-center justify-between text-[9px] text-scientific-muted">
              <button
                onClick={() => navigate('/')}
                className="hover:text-observation underline flex items-center space-x-1"
              >
                <span>Landing Page</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
              <span>VITE + R3F</span>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/80 md:hidden flex" onClick={() => setMobileMenuOpen(false)}>
            <div
              className="w-64 bg-graphite-900 h-full border-r border-scientific-border p-4 flex flex-col justify-between overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-scientific-border">
                  <span className="font-mono font-bold text-sm text-slate-100">PRAGYA NAVIGATION</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-scientific-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {navGroups.map((group) => (
                  <div key={group.category} className="space-y-1">
                    <span className="text-[10px] font-mono text-scientific-muted uppercase font-bold px-2 block">
                      {group.category}
                    </span>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded text-xs font-mono ${
                              isActive
                                ? 'bg-scientific-panel text-observation font-bold'
                                : 'text-scientific-muted hover:text-white'
                            }`
                          }
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-scientific-border text-[10px] font-mono text-scientific-muted">
                <span>PRAGYA Experimental Workstation</span>
              </div>
            </div>
          </div>
        )}

        {/* Primary Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-graphite-950 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Global Judge Mode Guided Tour Panel */}
      <JudgeModeTour isOpen={isJudgeTourOpen} onClose={() => setIsJudgeTourOpen(false)} />

      {/* Global System Health & Data Provenance Drawer */}
      <SystemHealthDrawer isOpen={isHealthDrawerOpen} onClose={() => setIsHealthDrawerOpen(false)} />
    </div>
  );
};
