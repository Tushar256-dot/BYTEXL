import React from 'react';
import { CreatorSpecialty } from '@/types';
import { cn } from '@/lib/utils';

export interface SkillBadgeProps {
  specialty: CreatorSpecialty | string;
  size?: 'sm' | 'md';
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  specialty,
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
      className={cn(
        'inline-flex items-center font-mono uppercase tracking-wider rounded border transition-colors',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        active
          ? 'bg-zinc-100 text-zinc-900 border-white font-medium'
          : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white',
        isClickable && 'cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-lime-accent focus:outline-none',
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-violet-400/80" />
      {specialty}
    </span>
  );
};

export default SkillBadge;
