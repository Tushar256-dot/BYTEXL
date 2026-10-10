import React from 'react';
import { AiTool } from '@/types';
import { cn } from '@/lib/utils';
import { Cpu, CheckCircle2 } from 'lucide-react';

export interface ToolBadgeProps {
  tool: AiTool | string;
  isVerified?: boolean;
  size?: 'sm' | 'md';
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ToolBadge: React.FC<ToolBadgeProps> = ({
  tool,
  isVerified = false,
  size = 'md',
  active = false,
  onClick,
  className,
}) => {
  const isClickable = Boolean(onClick);

  return (
    <span
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      title={isVerified ? `Verified toolchain: ${tool}` : `Reported tool: ${tool}`}
      className={cn(
        'inline-flex items-center gap-1 font-mono tracking-tight rounded border transition-colors',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        active
          ? 'bg-lime-accent text-zinc-950 font-semibold border-lime-accent'
          : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-700',
        isClickable && 'cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-lime-accent focus:outline-none',
        className
      )}
    >
      <Cpu className={cn('shrink-0', size === 'sm' ? 'w-2.5 h-2.5 text-zinc-400' : 'w-3 h-3 text-zinc-400')} />
      <span>{tool}</span>
      {isVerified && (
        <CheckCircle2
          className={cn(
            'shrink-0 text-lime-400',
            size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'
          )}
          aria-label="Verified tool"
        />
      )}
    </span>
  );
};

export default ToolBadge;
