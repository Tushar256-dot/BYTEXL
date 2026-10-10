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
        'group flex flex-col rounded-2xl border border-[#233058] bg-[#131b36] overflow-hidden transition-all duration-300',
        'hover:border-lime-accent/60 hover:shadow-card-navy hover:-translate-y-1',
        className
      )}
    >
      {/* 1. Portfolio Preview Visual */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0b1021]">
        {topPortfolio ? (
          <Image
            src={topPortfolio.thumbnailUrl}
            alt={`${creator.displayName}'s production work: ${topPortfolio.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full bg-[#0b1021] flex items-center justify-center text-slate-500 font-mono text-xs">
            No portfolio preview
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#131b36] via-transparent to-black/60" />

        {/* Top Floating Actions: Availability Pill & Shortlist Button */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#0b1021]/90 backdrop-blur-md border border-[#233058] text-slate-200">
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                creator.availability === 'immediate'
                  ? 'bg-lime-accent animate-pulse'
                  : creator.availability === 'within_2_weeks'
                  ? 'bg-amber-400'
                  : 'bg-slate-500'
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
                'p-2 rounded-full backdrop-blur-md border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent',
                isShortlisted
                  ? 'bg-lime-accent text-zinc-950 border-lime-accent shadow-glow-lime'
                  : 'bg-black/60 text-slate-300 border-slate-700/80 hover:bg-black/90 hover:text-white'
              )}
            >
              <Bookmark className={cn('w-4 h-4', isShortlisted && 'fill-current')} />
            </button>
          )}
        </div>

        {/* Featured Case Study Overlay */}
        {topPortfolio && (
          <div className="absolute bottom-2.5 left-3.5 right-3.5 text-left">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-lime-accent uppercase tracking-wider font-bold">
              <Sparkles className="w-3 h-3 text-lime-accent" />
              <span>Featured Work ({topPortfolio.aspectRatio})</span>
            </div>
            <span className="text-xs text-white font-bold line-clamp-1">
              {topPortfolio.title}
            </span>
          </div>
        )}
      </div>

      {/* 2. Creator Info Body */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Avatar, Name, Primary Specialization & Verification State */}
          <div className="flex items-start gap-3.5">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-lime-accent/40 bg-[#0b1021] shrink-0">
              <Image
                src={creator.avatarUrl}
                alt={creator.displayName}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  href={`/creators/${creator.id}`}
                  className="text-base font-bold text-white hover:text-lime-accent transition-colors truncate focus:outline-none"
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
              <div className="flex items-center gap-1.5 text-xs text-violet-300 font-mono mt-0.5 font-semibold truncate">
                <span>{creator.specialties?.[0] || 'AI Director'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 text-[11px] font-normal">{creator.location}</span>
              </div>
            </div>
          </div>

          {/* Concise Biography */}
          <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
            {creator.bio || creator.tagline}
          </p>

          {/* Selected Skills Badges */}
          {creator.skills && creator.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3.5">
              {creator.skills.slice(0, 2).map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono bg-[#182346] text-slate-200 border border-[#2d3e70]"
                >
                  {skill}
                </span>
              ))}
              {creator.skills.length > 2 && (
                <span className="px-1.5 py-0.5 text-[9px] font-mono text-slate-400 rounded-lg bg-[#182346]/60 border border-[#2d3e70]">
                  +{creator.skills.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Verified Toolchains & Commercial Clearance Status */}
          <div className="mt-3.5 pt-3.5 border-t border-[#233058]">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
              <span>Verified Tools</span>
              {creator.verification?.isCommercialClearanceCertified ? (
                <span className="text-lime-accent flex items-center gap-1 text-[10px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Commercial Cleared
                </span>
              ) : (
                <span className="text-slate-400 text-[10px]">
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
                <span className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 rounded bg-[#182346] border border-[#2d3e70]">
                  +{((creator.verification?.verifiedTools?.length || 0) +
                    (creator.verification?.selfReportedTools?.length || 0)) - 4}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Indicative Rate & Action Controls */}
        <div className="pt-3.5 border-t border-[#233058] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Indicative Rate
            </span>
            {creator.dayRateUSD ? (
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-white font-mono">
                  {formatCurrency(creator.dayRateUSD)}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">/day</span>
              </div>
            ) : (
              <span className="text-xs text-slate-400 font-mono">Upon Request</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onInvite && (
              <button
                type="button"
                onClick={() => onInvite(creator)}
                className="px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider border border-[#2d3e70] bg-[#182346] text-white hover:border-lime-accent hover:text-lime-accent transition-colors focus:outline-none"
              >
                Invite
              </button>
            )}

            <Link
              href={`/creators/${creator.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider bg-white text-zinc-950 font-extrabold hover:bg-slate-100 transition-colors shadow-sm focus:outline-none"
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
