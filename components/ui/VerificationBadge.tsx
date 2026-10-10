import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, Scale, Award, AlertCircle } from 'lucide-react';

export type VerificationType =
  | 'identity'
  | 'commercial_clearance'
  | 'verified_deliveries'
  | 'self_reported';

export interface VerificationBadgeProps {
  type: VerificationType;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
  showTooltip?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type,
  count,
  size = 'md',
  className,
}) => {
  const isSm = size === 'sm';

  switch (type) {
    case 'identity':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 font-mono tracking-tight rounded border transition-colors',
            'bg-zinc-900/90 text-zinc-200 border-zinc-700/80',
            isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
            className
          )}
          title="Creator identity verified by platform"
        >
          <ShieldCheck className={cn('text-lime-400 shrink-0', isSm ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
          <span>Verified ID</span>
        </span>
      );

    case 'commercial_clearance':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 font-mono tracking-tight rounded border transition-colors',
            'bg-emerald-950/30 text-emerald-300 border-emerald-800/60',
            isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
            className
          )}
          title="Verified commercial clearance: Generative models cleared for commercial client distribution"
        >
          <Scale className={cn('text-emerald-400 shrink-0', isSm ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
          <span>Commercial Clearance</span>
        </span>
      );

    case 'verified_deliveries':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 font-mono tracking-tight rounded border transition-colors',
            'bg-violet-950/30 text-violet-300 border-violet-800/60',
            isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
            className
          )}
          title={`${count || 0} completed commercial deliveries on FRAME`}
        >
          <Award className={cn('text-violet-400 shrink-0', isSm ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
          <span>{count ?? 0} Completed</span>
        </span>
      );

    case 'self_reported':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 font-mono tracking-tight rounded border border-dashed transition-colors',
            'bg-zinc-900/40 text-zinc-400 border-zinc-800',
            isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
            className
          )}
          title="Self-reported by creator — awaiting platform workflow verification"
        >
          <AlertCircle className={cn('text-zinc-500 shrink-0', isSm ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
          <span>Self-Reported</span>
        </span>
      );

    default:
      return null;
  }
};

export default VerificationBadge;
