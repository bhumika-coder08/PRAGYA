import React from 'react';
import { AlertCircle } from 'lucide-react';

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
      className={`inline-flex items-center space-x-1.5 font-mono uppercase tracking-wider font-semibold rounded border ${
        size === 'sm'
          ? 'px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30'
          : 'px-2.5 py-1 text-xs bg-amber-500/15 text-amber-300 border-amber-500/40'
      } ${className}`}
      title="Scientific Integrity Rule: All demonstration metrics are synthetic/simulated."
    >
      <AlertCircle className={size === 'sm' ? 'w-3 h-3 text-amber-400' : 'w-3.5 h-3.5 text-amber-300'} />
      <span>DEMO / SIMULATED DATA</span>
    </span>
  );
};
