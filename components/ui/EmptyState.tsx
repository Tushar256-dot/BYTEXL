import React from 'react';
import { cn } from '@/lib/utils';
import { SearchX, LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = SearchX,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl',
        'border border-dashed border-zinc-800 bg-zinc-950/50',
        className
      )}
    >
      <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
        <Icon className="w-6 h-6 text-zinc-400" />
      </div>

      <h3 className="text-base sm:text-lg font-medium text-white mb-1.5 font-sans">
        {title}
      </h3>
      <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-md bg-zinc-100 text-zinc-950 font-semibold hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent"
            >
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
