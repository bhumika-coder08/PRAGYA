import React from 'react';

interface SimulatedDataBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const SimulatedDataBadge: React.FC<SimulatedDataBadgeProps> = ({
  className = '',
  size = 'sm'
}) => {
  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-sans font-medium rounded-full border border-slate-700/70 bg-slate-900/70 text-slate-300 transition-colors ${
        size === 'sm'
          ? 'px-2.5 py-0.5 text-[11px]'
          : 'px-3 py-1 text-xs'
      } ${className}`}
      title="Scientific Integrity Protocol: Current experimental calculations use simulated benchmark data."
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/90 shrink-0" />
      <span>Simulated Demonstration Data</span>
    </span>
  );
};

