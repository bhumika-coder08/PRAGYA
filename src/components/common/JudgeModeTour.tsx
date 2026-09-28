import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Minimize2,
  Maximize2,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { predictabilityEngine } from '../../services/predictabilityEngine';
import { JudgeStep } from '../../types';

interface JudgeModeTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeModeTour: React.FC<JudgeModeTourProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const steps: JudgeStep[] = predictabilityEngine.getJudgeTourSteps();
  const currentStep = steps[currentStepIndex];

  // Navigate whenever step changes if tour is open
  useEffect(() => {
    if (isOpen && currentStep && location.pathname !== currentStep.route) {
      navigate(currentStep.route);
    }
  }, [isOpen, currentStepIndex]);

  if (!isOpen || !currentStep) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStepIndex(index);
  };

  return (
    <aside
      aria-label="Judge evaluation tour panel"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-4xl transition-all duration-300 drop-shadow-2xl"
    >
      <div className="bg-graphite-950/95 border-2 border-amber-500/80 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl">
        {/* Top Mini Command Header */}
        <div className="bg-gradient-to-r from-amber-950/80 via-graphite-900 to-graphite-950 px-4 py-2 border-b border-amber-500/40 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-amber-400 tracking-wider">JUDGE EVALUATION TOUR</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                STEP {currentStep.stepNumber} OF {steps.length}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-graphite-800 transition-colors"
              title={isMinimized ? 'Expand tour window' : 'Minimize tour window'}
              aria-label={isMinimized ? 'Expand tour window' : 'Minimize tour window'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-graphite-800 transition-colors"
              title="Exit Judge Tour"
              aria-label="Exit Judge Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Minimized Bar */}
        {isMinimized ? (
          <div className="p-3 flex items-center justify-between text-xs font-mono bg-graphite-900">
            <span className="text-slate-300 font-bold truncate">
              {currentStep.title} — {currentStep.subtitle}
            </span>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="px-2 py-1 rounded bg-graphite-800 disabled:opacity-30 text-slate-200"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-3 py-1 rounded bg-amber-500 text-graphite-950 font-bold"
              >
                {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        ) : (
          /* Full Tour Card */
          <div className="p-4 sm:p-5 flex flex-col space-y-4">
            {/* Step Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              {/* Left 2 Cols: Title & Detailed Description */}
              <div className="md:col-span-2 space-y-2">
                <div>
                  <div className="text-[11px] font-mono text-amber-400/90 uppercase tracking-widest">
                    {currentStep.subtitle}
                  </div>
                  <h2 className="text-base sm:text-lg font-mono font-bold text-slate-100 flex items-center space-x-2">
                    <span>{currentStep.title}</span>
                  </h2>
                </div>

                <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
                  {currentStep.description}
                </p>

                <div className="flex items-center space-x-2 text-[11px] font-mono text-scientific-muted pt-1">
                  <span>Current View:</span>
                  <span className="text-observation bg-graphite-900 px-2 py-0.5 rounded border border-scientific-border flex items-center space-x-1">
                    <span>{currentStep.route}</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Right Col: Key Scientific Takeaway Box */}
              <div className="bg-amber-950/20 border border-amber-500/40 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-mono font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Key Research Takeaway</span>
                </div>
                <p className="text-xs font-mono text-amber-200/90 leading-relaxed">
                  "{currentStep.keyTakeaway}"
                </p>
              </div>
            </div>

            {/* Stepper Navigation Dots */}
            <div className="flex items-center justify-between border-t border-scientific-border/80 pt-3">
              {/* Dots / Step Selector */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1 max-w-[55%]">
                {steps.map((st, idx) => (
                  <button
                    key={st.stepNumber}
                    onClick={() => handleJumpToStep(idx)}
                    className={`w-6 h-6 rounded-full text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                      idx === currentStepIndex
                        ? 'bg-amber-500 text-graphite-950 scale-110 ring-2 ring-amber-400/50'
                        : idx < currentStepIndex
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : 'bg-graphite-900 text-slate-500 border border-scientific-border hover:text-slate-300'
                    }`}
                    title={st.title}
                  >
                    {idx < currentStepIndex ? '✓' : st.stepNumber}
                  </button>
                ))}
              </div>

              {/* Control Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded bg-graphite-900 hover:bg-graphite-800 disabled:opacity-30 disabled:cursor-not-allowed border border-scientific-border text-xs font-mono text-slate-200 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Back</span>
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-graphite-950 text-xs font-mono font-bold transition-all shadow-md shadow-amber-500/20"
                >
                  <span>{currentStepIndex === steps.length - 1 ? 'Complete Tour' : 'Next Step'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
