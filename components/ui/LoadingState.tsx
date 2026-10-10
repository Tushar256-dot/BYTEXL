import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  variant?: 'skeleton' | 'spinner' | 'cards';
  count?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading AI creator portfolio workflows...',
  variant = 'spinner',
  count = 6,
  className,
}) => {
  if (variant === 'spinner') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center p-12 text-center',
          className
        )}
        role="status"
        aria-live="polite"
      >
        <Loader2 className="w-8 h-8 text-lime-accent animate-spin mb-3" />
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          {message}
        </span>
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-pulse',
          className
        )}
        role="status"
        aria-label="Loading creators"
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-zinc-800" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-zinc-800 rounded w-1/2" />
                <div className="h-3 bg-zinc-850 rounded w-3/4" />
              </div>
            </div>

            <div className="h-40 bg-zinc-850 rounded-lg w-full" />

            <div className="flex gap-2">
              <div className="h-5 w-16 bg-zinc-800 rounded" />
              <div className="h-5 w-20 bg-zinc-800 rounded" />
            </div>

            <div className="pt-2 border-t border-zinc-800/60 flex justify-between">
              <div className="h-4 w-24 bg-zinc-800 rounded" />
              <div className="h-4 w-16 bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Basic skeleton lines
  return (
    <div className={cn('space-y-3 w-full animate-pulse', className)}>
      <div className="h-6 bg-zinc-800/80 rounded w-1/3" />
      <div className="h-4 bg-zinc-850/80 rounded w-2/3" />
      <div className="h-4 bg-zinc-850/80 rounded w-1/2" />
    </div>
  );
};

export default LoadingState;
