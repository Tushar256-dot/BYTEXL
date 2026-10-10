'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Creator } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import { Bookmark, ArrowUpRight, ShieldCheck, Scale, Star, Sparkles } from 'lucide-react';
import SkillBadge from '@/components/ui/SkillBadge';
import ToolBadge from '@/components/ui/ToolBadge';
import VerificationBadge from '@/components/ui/VerificationBadge';

export interface CreatorCardProps {
  creator: Creator;
  isShortlisted?: boolean;
  onToggleShortlist?: (creatorId: string) => void;
  onInvite?: (creator: Creator) => void;
  className?: string;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  isShortlisted = false,
  onToggleShortlist,
  onInvite,
  className,
}) => {
  const topPortfolio = creator.portfolio && creator.portfolio.length > 0 ? creator.portfolio[0] : null;

  return (
    <article
      className={cn(
        'group flex flex-col rounded-xl border border-zinc-800 bg-[#121215] overflow-hidden transition-all duration-200',
        'hover:border-zinc-700 hover:shadow-card-subtle',
        className
      )}
    >
      {/* 1. Portfolio Preview Visual */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950">
        {topPortfolio ? (
          <Image
            src={topPortfolio.thumbnailUrl}
            alt={`${creator.displayName}'s production work: ${topPortfolio.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-95"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600 font-mono text-xs">
            No portfolio preview
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-black/60" />

        {/* Top Floating Actions: Availability Pill & Shortlist Button */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/75 backdrop-blur-md border border-zinc-800 text-zinc-300">
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                creator.availability === 'immediate'
                  ? 'bg-emerald-400'
                  : creator.availability === 'within_2_weeks'
                  ? 'bg-amber-400'
                  : 'bg-zinc-500'
              )}
            />
            <span>
              {creator.availability === 'immediate'
                ? 'Available Now'
                : creator.availability === 'within_2_weeks'
                ? 'Available 2w'
                : 'Booked Out'}
            </span>
          </div>

          {onToggleShortlist && (
            <button
              type="button"
              onClick={() => onToggleShortlist(creator.id)}
              aria-label={
                isShortlisted
                  ? `Remove ${creator.displayName} from shortlist`
                  : `Add ${creator.displayName} to shortlist`
              }
              className={cn(
                'p-2 rounded-full backdrop-blur-md border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent',
                isShortlisted
                  ? 'bg-lime-accent text-zinc-950 border-lime-accent shadow-glow-lime'
                  : 'bg-black/60 text-zinc-300 border-zinc-700/80 hover:bg-black/90 hover:text-white'
              )}
            >
              <Bookmark className={cn('w-3.5 h-3.5', isShortlisted && 'fill-current')} />
            </button>
          )}
        </div>

        {/* Featured Case Study Overlay */}
        {topPortfolio && (
          <div className="absolute bottom-2 left-3 right-3 text-left">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5 text-lime-accent" />
              <span>Featured Work ({topPortfolio.aspectRatio})</span>
            </div>
            <span className="text-xs text-white font-medium line-clamp-1">
              {topPortfolio.title}
            </span>
          </div>
        )}
      </div>

      {/* 2. Creator Info Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Avatar, Name, Primary Specialization & Verification State */}
          <div className="flex items-start gap-3">
            <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 shrink-0">
              <Image
                src={creator.avatarUrl}
                alt={creator.displayName}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  href={`/creators/${creator.id}`}
                  className="text-sm font-bold text-white hover:text-zinc-200 transition-colors truncate focus:outline-none focus-visible:underline"
                >
                  {creator.displayName}
                </Link>
                {creator.verification?.isIdentityVerified ? (
                  <VerificationBadge type="identity" size="sm" />
                ) : (
                  <VerificationBadge type="self_reported" size="sm" />
                )}
              </div>

              {/* Specialization & Location Subheader */}
              <div className="flex items-center gap-1.5 text-xs text-violet-400 font-mono mt-0.5 font-medium truncate">
                <span>{creator.specialties?.[0] || 'AI Filmmaker'}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400 text-[11px] font-normal">{creator.location}</span>
              </div>
            </div>
          </div>

          {/* Concise Biography */}
          <p className="text-xs text-zinc-400 mt-2.5 line-clamp-2 leading-relaxed">
            {creator.bio || creator.tagline}
          </p>

          {/* Selected Skills Badges */}
          {creator.skills && creator.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {creator.skills.slice(0, 2).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800"
                >
                  {skill}
                </span>
              ))}
              {creator.skills.length > 2 && (
                <span className="px-1.5 py-0.5 text-[9px] font-mono text-zinc-500 rounded bg-zinc-900/60 border border-zinc-800">
                  +{creator.skills.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Verified Toolchains & Commercial Clearance Status */}
          <div className="mt-3 pt-3 border-t border-zinc-800/60">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
              <span>Tools / Pipeline</span>
              {creator.verification?.isCommercialClearanceCertified ? (
                <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                  <ShieldCheck className="w-3 h-3" />
                  Commercial Cleared
                </span>
              ) : (
                <span className="text-zinc-500 text-[10px]">
                  {creator.commercialCapability}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {creator.verification?.verifiedTools?.slice(0, 3).map((tool) => (
                <ToolBadge key={tool} tool={tool} isVerified size="sm" />
              ))}
              {creator.verification?.selfReportedTools?.slice(0, 1).map((tool) => (
                <ToolBadge key={tool} tool={tool} isVerified={false} size="sm" />
              ))}
              {((creator.verification?.verifiedTools?.length || 0) +
                (creator.verification?.selfReportedTools?.length || 0)) > 4 && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 rounded bg-zinc-900 border border-zinc-800">
                  +{((creator.verification?.verifiedTools?.length || 0) +
                    (creator.verification?.selfReportedTools?.length || 0)) - 4}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Indicative Rate & Action Controls */}
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
              Indicative Rate
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-white font-mono">
                {formatCurrency(creator.dayRateUSD)}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">/day</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onInvite && (
              <button
                type="button"
                onClick={() => onInvite(creator)}
                className="px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider border border-zinc-700 bg-zinc-900 text-zinc-200 hover:text-white hover:border-zinc-600 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-lime-accent"
              >
                Invite
              </button>
            )}

            <Link
              href={`/creators/${creator.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider bg-zinc-100 text-zinc-950 font-semibold hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent"
            >
              <span>Profile</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CreatorCard;
