import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  FileCode
} from 'lucide-react';
import { LeakageTestRunner, LeakageTestSuiteSummary } from '../../services/leakageTestRunner';

interface LeakageTestConsoleProps {
  className?: string;
}

export const LeakageTestConsole: React.FC<LeakageTestConsoleProps> = ({
  className = ''
}) => {
  const [testSummary, setTestSummary] = useState<LeakageTestSuiteSummary>(() => {
    return LeakageTestRunner.runAllTests();
  });
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const summary = LeakageTestRunner.runAllTests();
      setTestSummary(summary);
      setIsRunning(false);
    }, 400);
  };

  return (
    <div className={`bg-graphite-950 border border-scientific-border rounded-lg p-5 font-mono text-xs space-y-4 ${className}`}>
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-scientific-border pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
                TEMPORAL CAUSALITY & FUTURE DATA LEAKAGE TEST SUITE
              </h3>
              <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                {testSummary.allPassed ? 'ALL TESTS PASSED' : 'LEAKAGE DETECTED'}
              </span>
            </div>
            <p className="text-[11px] text-scientific-muted">
              Architectural verification that observations with timestamp &gt; T are strictly inaccessible at time T.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-observation text-graphite-950 font-bold hover:bg-observation-light disabled:opacity-50 transition-colors shadow-sm"
        >
          {isRunning ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isRunning ? 'RUNNING SUITE...' : 'RE-RUN AUTOMATED TESTS'}</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-graphite-900 p-2.5 rounded border border-scientific-border">
          <span className="text-[10px] text-scientific-muted block">TOTAL ASSERTIONS</span>
          <span className="text-base font-bold text-slate-100">{testSummary.totalTests} Tests</span>
        </div>
        <div className="bg-graphite-900 p-2.5 rounded border border-scientific-border">
          <span className="text-[10px] text-scientific-muted block">PASSED VERIFICATIONS</span>
          <span className="text-base font-bold text-emerald-400">{testSummary.passedTests} / {testSummary.totalTests}</span>
        </div>
        <div className="bg-graphite-900 p-2.5 rounded border border-scientific-border">
          <span className="text-[10px] text-scientific-muted block">LEAKAGE VIOLATIONS</span>
          <span className={`text-base font-bold ${testSummary.failedTests > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            {testSummary.failedTests} Violations
          </span>
        </div>
        <div className="bg-graphite-900 p-2.5 rounded border border-scientific-border">
          <span className="text-[10px] text-scientific-muted block">EXECUTION TIMESTAMP</span>
          <span className="text-xs font-semibold text-slate-300 truncate block mt-0.5">
            {testSummary.executionTimestamp.substring(11, 19)} UTC
          </span>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="space-y-2.5">
        {testSummary.results.map((tc) => (
          <div
            key={tc.id}
            className={`p-3.5 rounded-lg border transition-all ${
              tc.passed
                ? 'bg-graphite-900 border-scientific-border/80'
                : 'bg-rose-950/30 border-rose-500/60'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center space-x-2">
                {tc.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-200">{tc.name}</span>
                  <span className="text-[10px] text-slate-400 ml-2 font-mono">[{tc.id}]</span>
                </div>
              </div>

              <span
                className={`text-[9px] px-2 py-0.5 rounded font-bold border ${
                  tc.passed
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border-rose-800'
                }`}
              >
                {tc.passed ? 'PASSED (NO LEAK)' : 'FAILED (LEAK DETECTED)'}
              </span>
            </div>

            <p className="text-[11px] text-scientific-muted pl-6 leading-relaxed mb-2">
              {tc.description}
            </p>

            <div className="pl-6 pt-2 border-t border-scientific-border/40 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-slate-500 block">TIME CONTEXT:</span>
                <span className="text-slate-300 font-semibold">{tc.timeContext}</span>
              </div>
              <div>
                <span className="text-slate-500 block">ASSERTION CONTRACT:</span>
                <span className="text-observation font-mono truncate block" title={tc.assertion}>
                  {tc.assertion}
                </span>
              </div>
            </div>

            <div className="pl-6 mt-1.5 text-[10px] text-emerald-400/90 font-mono">
              › {tc.details}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
