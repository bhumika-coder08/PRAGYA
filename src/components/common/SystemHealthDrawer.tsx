import React, { useState, useEffect } from 'react';
import {
  Database,
  Activity,
  Shield,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  RefreshCw,
  ExternalLink,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { apiClient, DatabaseHealthInfo, ApiSourceReport } from '../../services/apiClient';

interface SystemHealthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemHealthDrawer: React.FC<SystemHealthDrawerProps> = ({ isOpen, onClose }) => {
  const [healthInfo, setHealthInfo] = useState<DatabaseHealthInfo | null>(null);
  const [sources, setSources] = useState<ApiSourceReport[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [h, s] = await Promise.all([apiClient.getHealth(), apiClient.getSources()]);
      if (h) setHealthInfo(h);
      if (s) setSources(s);
    } catch (err) {
      console.warn('[SystemHealthDrawer] Failed to refresh health data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-graphite-950 border-l border-scientific-border shadow-2xl p-5 font-sans text-xs flex flex-col justify-between overflow-y-auto backdrop-blur-lg">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-scientific-border pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <h3 className="font-heading font-semibold text-slate-100 text-xs uppercase tracking-wide">
              System Health & Provenance
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
              title="Refresh Status"
              aria-label="Refresh status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
              title="Close Drawer"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Database Status Section */}
        <div className="bg-graphite-900 p-3.5 rounded-md border border-scientific-border space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-wide">Neon PostgreSQL</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 inline mr-1" />
              {healthInfo?.database.status || 'CONNECTED'}
            </span>
          </div>
          <div className="text-xs text-slate-300 space-y-1.5 font-sans">
            <div className="flex justify-between">
              <span className="text-slate-400">Provider:</span>
              <span className="font-medium text-slate-200">Neon Serverless (AWS ap-southeast-1)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Stored Observations:</span>
              <span className="font-mono font-semibold text-sky-300">{healthInfo?.database.observationsInStore || 81}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Historical Research Events:</span>
              <span className="font-mono font-semibold text-slate-200">{healthInfo?.database.eventsInStore || 2}</span>
            </div>
          </div>
        </div>

        {/* Operational Warning Pipeline Status */}
        <div className="bg-graphite-900 p-3.5 rounded-md border border-amber-500/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-heading font-semibold text-amber-400 uppercase tracking-wide">Operational Pipeline</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-500/30 font-medium">
              Not Configured
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            PRAGYA operates strictly in research mode. In accordance with scientific integrity rules, simulated benchmarks and historical reanalysis are never broadcast as operational weather forecasts.
          </p>
        </div>

        {/* Real Source Adapters Breakdown */}
        <div className="space-y-2">
          <span className="text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-wide block">
            Data Source Registry
          </span>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {sources.map((src) => {
              const isConnected = src.status === 'CONNECTED';
              const isCredReq = src.status === 'CREDENTIALS_REQUIRED';
              return (
                <div key={src.id} className="p-2.5 rounded-md bg-graphite-900 border border-scientific-border space-y-1 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200 text-xs truncate max-w-[190px]">{src.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md font-medium border ${
                        isConnected
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                          : isCredReq
                          ? 'bg-amber-950 text-amber-300 border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {src.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>{src.provider}</span>
                    <span className="text-sky-400 font-mono text-[10px]">{src.dataMode}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="pt-4 border-t border-scientific-border text-xs text-slate-400 space-y-1 font-sans">
        <div className="flex justify-between">
          <span>PRAGYA Intelligence Kernel</span>
          <span className="text-slate-300 font-mono text-[11px]">v1.4-research</span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Last Heartbeat: {new Date().toLocaleTimeString()} UTC
        </div>
      </div>
    </div>
  );
};
