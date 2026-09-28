import React, { useState, useMemo } from 'react';
import {
  ListFilter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Clock,
  Compass,
  Radio,
  GitBranch,
  ShieldCheck,
  Search
} from 'lucide-react';
import { predictabilityEngine } from '../../services/predictabilityEngine';
import { ResearchEventLogItem } from '../../types';

interface ResearchEventLogListProps {
  activeMinuteOffset?: number;
  maxItems?: number;
  compact?: boolean;
  className?: string;
  onSelectOffset?: (offset: number) => void;
}

export const ResearchEventLogList: React.FC<ResearchEventLogListProps> = ({
  activeMinuteOffset,
  maxItems,
  compact = false,
  className = '',
  onSelectOffset
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allLogs: ResearchEventLogItem[] = useMemo(() => {
    return predictabilityEngine.getResearchEventLog();
  }, []);

  const filteredLogs = useMemo(() => {
    return allLogs.filter((item) => {
      const matchesCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesSearch =
        item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.timestamp.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `T${item.minuteOffset}`.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).slice(0, maxItems || undefined);
  }, [allLogs, selectedCategory, searchQuery, maxItems]);

  const categories = ['ALL', 'OBSERVATION', 'REGIME', 'THRESHOLD', 'RISK', 'DIVERGENCE'];

  const getSeverityStyle = (severity: ResearchEventLogItem['severity']) => {
    switch (severity) {
      case 'SUCCESS':
        return {
          icon: ShieldCheck,
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/40',
          bgColor: 'bg-emerald-950/20'
        };
      case 'ALERT':
        return {
          icon: AlertOctagon,
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/40',
          bgColor: 'bg-rose-950/20'
        };
      case 'WATCH':
        return {
          icon: AlertTriangle,
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/40',
          bgColor: 'bg-amber-950/20'
        };
      case 'INFO':
      default:
        return {
          icon: Info,
          textColor: 'text-observation',
          borderColor: 'border-observation/30',
          bgColor: 'bg-observation/10'
        };
    }
  };

  const getCategoryIcon = (category: ResearchEventLogItem['category']) => {
    switch (category) {
      case 'OBSERVATION':
        return Radio;
      case 'REGIME':
        return Compass;
      case 'DIVERGENCE':
        return GitBranch;
      case 'THRESHOLD':
      case 'RISK':
      default:
        return CheckCircle2;
    }
  };

  return (
    <div className={`bg-scientific-card border border-scientific-border rounded-lg overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-3.5 border-b border-scientific-border bg-graphite-900 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-observation" />
          <h3 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
            Synchronized Research Event Log
          </h3>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-graphite-800 text-scientific-muted border border-scientific-border">
            {filteredLogs.length} Events
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-scientific-muted" />
            <input
              type="text"
              placeholder="Filter log..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2 py-1 text-[11px] font-mono bg-graphite-950 border border-scientific-border rounded text-slate-200 focus:outline-none focus:border-observation w-28 sm:w-36"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      {!compact && (
        <div className="px-3 py-2 border-b border-scientific-border/60 bg-graphite-950/60 flex items-center space-x-1 overflow-x-auto text-[10px] font-mono">
          <ListFilter className="w-3 h-3 text-scientific-muted mr-1.5 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-observation text-graphite-950 font-bold'
                  : 'bg-graphite-900 text-scientific-muted hover:text-slate-200 border border-scientific-border/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Log List */}
      <div className="divide-y divide-scientific-border/40 max-h-[380px] overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-6 text-center text-xs font-mono text-scientific-muted">
            No research events match the current criteria.
          </div>
        ) : (
          filteredLogs.map((item) => {
            const sev = getSeverityStyle(item.severity);
            const SevIcon = sev.icon;
            const CatIcon = getCategoryIcon(item.category);
            const isHorizonEvent = item.message.includes('PREDICTABILITY HORIZON');
            const isActive = activeMinuteOffset !== undefined && Math.abs(activeMinuteOffset - item.minuteOffset) <= 5;

            return (
              <div
                key={item.id}
                onClick={() => onSelectOffset && onSelectOffset(item.minuteOffset)}
                className={`p-3 text-xs font-mono transition-colors cursor-pointer ${
                  isHorizonEvent
                    ? 'bg-emerald-950/30 border-l-4 border-l-emerald-500'
                    : isActive
                    ? 'bg-observation/10 border-l-4 border-l-observation'
                    : 'hover:bg-graphite-800/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center space-x-2">
                    <SevIcon className={`w-3.5 h-3.5 ${sev.textColor} shrink-0 mt-0.5`} />
                    <span className="font-bold text-slate-200">{item.timestamp}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${
                        item.minuteOffset < -60
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : item.minuteOffset < 0
                          ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                          : 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {item.minuteOffset === 0 ? 'T0 (Initiation)' : `T${item.minuteOffset}m`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className="flex items-center space-x-1 text-[9px] px-1.5 py-0.2 rounded bg-graphite-900 border border-scientific-border text-scientific-muted">
                      <CatIcon className="w-2.5 h-2.5" />
                      <span>{item.category}</span>
                    </span>
                  </div>
                </div>

                <p
                  className={`text-[11px] leading-relaxed pl-5.5 ${
                    isHorizonEvent
                      ? 'text-emerald-300 font-semibold'
                      : 'text-scientific-muted hover:text-slate-200'
                  }`}
                >
                  {item.message}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-scientific-border bg-graphite-950/80 px-3 flex items-center justify-between text-[10px] font-mono text-scientific-muted">
        <span>TIMELINE SYNCHRONIZED AUDIT TRAIL</span>
        <span className="text-amber-400">HISTORICAL TESTBED DATA</span>
      </div>
    </div>
  );
};
