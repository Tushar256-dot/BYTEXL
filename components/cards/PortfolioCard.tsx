'use client';

import React from 'react';
import Image from 'next/image';
import { PortfolioItem } from '@/types';
import { cn } from '@/lib/utils';
import { Play, Sparkles, ShieldCheck, Layers } from 'lucide-react';
import ToolBadge from '@/components/ui/ToolBadge';

export interface PortfolioCardProps {
  item: PortfolioItem;
  creatorName?: string;
  onInspectWorkflow?: (item: PortfolioItem) => void;
  className?: string;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  item,
  creatorName,
  onInspectWorkflow,
  className,
}) => {
  const isCommercial = item.commercialRightsStatus === 'commercial_cleared';

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-xl overflow-hidden border border-zinc-800 bg-[#121215] transition-all duration-200',
        'hover:border-zinc-700 hover:shadow-card-subtle',
        className
      )}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
        <Image
          src={item.thumbnailUrl}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <ToolBadge tool={item.primaryModel} isVerified size="sm" />
          
          <div className="flex items-center gap-1.5">
            {isCommercial ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                Cleared
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900/80 text-zinc-400 border border-zinc-700/60">
                Experimental
              </span>
            )}

            {item.durationSeconds && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/70 text-zinc-300 border border-zinc-800">
                {item.durationSeconds}s
              </span>
            )}
          </div>
        </div>

        {/* Play / Inspect Overlay */}
        {onInspectWorkflow && (
          <button
            type="button"
            onClick={() => onInspectWorkflow(item)}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]"
            aria-label={`Inspect workflow for ${item.title}`}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/95 border border-zinc-700 text-xs font-mono uppercase tracking-wider text-white shadow-xl hover:bg-zinc-800 transition-colors">
              <Layers className="w-3.5 h-3.5 text-lime-accent" />
              <span>Inspect Workflow</span>
            </div>
          </button>
        )}
      </div>

      {/* Content Details */}
      <div className="flex flex-col p-4 flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400">
              {item.category}
            </span>
            {creatorName && (
              <span className="text-xs text-zinc-400 truncate">
                by {creatorName}
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold text-white group-hover:text-zinc-200 transition-colors line-clamp-1">
            {item.title}
          </h3>

          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Pipeline steps count indicator */}
        <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-zinc-500" />
            <span>{item.pipelineSteps.length} Pipeline Steps</span>
          </div>
          {onInspectWorkflow && (
            <button
              type="button"
              onClick={() => onInspectWorkflow(item)}
              className="text-zinc-400 hover:text-lime-accent transition-colors focus:outline-none"
            >
              View Node Graph →
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default PortfolioCard;
