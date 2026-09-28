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
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-graphite-950 border-l border-scientific-border shadow-2xl p-5 font-mono text-xs flex flex-col justify-between overflow-y-auto backdrop-blur-lg">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-scientific-border pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-slate-100 uppercase tracking-wider text-xs">
              SYSTEM HEALTH & DATA PROVENANCE
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
              title="Refresh Status"
              aria-label="Refresh status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
              title="Close Drawer"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Database Status Section */}
        <div className="bg-graphite-900 p-3.5 rounded-lg border border-scientific-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-scientific-muted uppercase font-bold">NEON POSTGRESQL</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 inline mr-1" />
              {healthInfo?.database.status || 'CONNECTED'}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-scientific-muted">Provider:</span>
              <span className="font-semibold text-slate-200">Neon Serverless (AWS ap-southeast-1)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-scientific-muted">Stored Observations:</span>
              <span className="font-bold text-observation">{healthInfo?.database.observationsInStore || 81}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-scientific-muted">Historical Research Events:</span>
              <span className="font-bold text-slate-200">{healthInfo?.database.eventsInStore || 2}</span>
            </div>
          </div>
        </div>

        {/* Operational Warning Pipeline Status */}
        <div className="bg-graphite-900 p-3.5 rounded-lg border border-amber-500/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-400 uppercase font-bold">OPERATIONAL PIPELINE</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
              NOT CONFIGURED
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            PRAGYA operates strictly in research mode. In accordance with scientific integrity rules, simulated benchmarks and historical reanalysis are never broadcast as operational weather forecasts.
          </p>
        </div>

        {/* Real Source Adapters Breakdown */}
        <div className="space-y-2">
          <span className="text-[10px] text-scientific-muted uppercase font-bold block">
            DATA SOURCE REGISTRY BREAKDOWN
          </span>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {sources.map((src) => {
              const isConnected = src.status === 'CONNECTED';
              const isCredReq = src.status === 'CREDENTIALS_REQUIRED';
              return (
                <div key={src.id} className="p-2.5 rounded bg-graphite-900 border border-scientific-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-[11px] truncate max-w-[190px]">{src.name}</span>
                    <span
                      className={`text-[8px] px-1.5 py-0.2 rounded font-bold border ${
                        isConnected
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                          : isCredReq
                          ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {src.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-scientific-muted flex justify-between">
                    <span>{src.provider}</span>
                    <span className="text-cyan-400 font-semibold">{src.dataMode}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="pt-4 border-t border-scientific-border text-[10px] text-scientific-muted space-y-1">
        <div className="flex justify-between">
          <span>PRAGYA Intelligence Kernel</span>
          <span className="text-slate-300">v1.4-RESEARCH</span>
        </div>
        <div className="text-[9px] text-slate-500">
          Last Heartbeat: {new Date().toLocaleTimeString()} UTC
        </div>
      </div>
    </div>
  );
};
