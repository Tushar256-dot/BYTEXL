'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import SkillBadge from '@/components/ui/SkillBadge';
import ToolBadge from '@/components/ui/ToolBadge';
import VerificationBadge from '@/components/ui/VerificationBadge';
import PortfolioCard from '@/components/cards/PortfolioCard';
import PortfolioDetailDialog from '@/components/portfolio/PortfolioDetailDialog';
import InviteToProjectDialog from '@/components/invitation/InviteToProjectDialog';
import { mockCreators } from '@/lib/data/creators';
import { useShortlist } from '@/lib/hooks/useShortlist';
import { formatCurrency } from '@/lib/utils';
import {
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  Bookmark,
  Layers,
  ArrowLeft,
  X,
  Award,
  Film,
  CheckCircle2,
  AlertCircle,
  Scale,
  Workflow,
  Check,
  Info,
} from 'lucide-react';
import { PortfolioItem } from '@/types';

export default function CreatorProfilePage() {
  const params = useParams();
  const creatorId = params?.id as string;
  const creator = mockCreators.find((c) => c.id === creatorId);

  const { isShortlisted, toggleShortlist } = useShortlist();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);

  if (!creator) {
    notFound();
  }

  const shortlisted = isShortlisted(creator.id);
  const isIdentityVerified = creator.verification?.isIdentityVerified;
  const isCommercialCleared = creator.verification?.isCommercialClearanceCertified;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Breadcrumbs & Top Navigation Bar */}
      <div>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors mb-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-lime-accent"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Discover</span>
        </Link>

        <PageHeader
          title={creator.displayName}
          subtitle={creator.tagline}
          breadcrumbs={[
            { label: 'Discover', href: '/discover' },
            { label: 'Directors', href: '/discover' },
            { label: creator.displayName },
          ]}
          actions={
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => toggleShortlist(creator.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider border transition-colors ${
                  shortlisted
                    ? 'bg-lime-accent text-zinc-950 border-lime-accent font-bold shadow-glow-lime'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                }`}
                aria-label={shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${shortlisted ? 'fill-current' : ''}`} />
                <span>{shortlisted ? 'Shortlisted' : 'Shortlist'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsInviteOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider bg-lime-accent text-zinc-950 font-bold hover:bg-lime-hover transition-colors shadow-glow-lime focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Invite to Project</span>
              </button>
            </div>
          }
        />
      </div>

      {/* 2. Profile Grid: Sidebar (Bio, Trust & Rates) + Main (Portfolio Showcase) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Creator Bio, Trust & Verification Audit, Rates */}
        <div className="space-y-6">
          {/* Main Profile Info Card */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-[#121215] space-y-5">
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 shrink-0">
                <Image
                  src={creator.avatarUrl}
                  alt={creator.displayName}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-lg font-bold text-white font-sans truncate">
                    {creator.displayName}
                  </h2>
                  {isIdentityVerified ? (
                    <VerificationBadge type="identity" size="sm" />
                  ) : (
                    <VerificationBadge type="self_reported" size="sm" />
                  )}
                </div>

                <p className="text-xs font-mono text-zinc-400">@{creator.handle}</p>

                {/* Optional Location or Timezone (Graceful rendering) */}
                {(creator.location || creator.timezone) && (
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    {[creator.location, creator.timezone].filter(Boolean).join(' • ')}
                  </p>
                )}
              </div>
            </div>

            {/* Availability Badge */}
            {creator.availability && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300">
                <span
                  className={`w-2 h-2 rounded-full ${
                    creator.availability === 'immediate'
                      ? 'bg-emerald-400 animate-pulse'
                      : creator.availability === 'within_2_weeks'
                      ? 'bg-amber-400'
                      : 'bg-zinc-500'
                  }`}
                />
                <span className="capitalize">
                  {creator.availability === 'immediate'
                    ? 'Available for Immediate Production'
                    : creator.availability === 'within_2_weeks'
                    ? 'Available in Next 2 Weeks'
                    : 'Currently Booked Out'}
                </span>
              </div>
            )}

            {/* Biography */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                Director Biography
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {creator.bio || creator.tagline}
              </p>
            </div>

            {/* Rates & Turnaround Times */}
            {(creator.dayRateUSD || creator.turnaroundDaysAverage) && (
              <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-2 gap-4">
                {creator.dayRateUSD && (
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                      Indicative Day Rate
                    </span>
                    <span className="text-base font-bold text-white font-mono">
                      {formatCurrency(creator.dayRateUSD)}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono block">
                      Min budget: {formatCurrency(creator.minimumProjectBudgetUSD || 2500)}
                    </span>
                  </div>
                )}
                {creator.turnaroundDaysAverage && (
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                      Avg Turnaround
                    </span>
                    <span className="text-base font-bold text-white font-mono">
                      {creator.turnaroundDaysAverage} days
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono block">
                      Per deliverable
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Trust and Verification Breakdown Card */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-[#121215] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verification Scope</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                Audited
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Identity Status:</span>
                {isIdentityVerified ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified ID
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-zinc-400 border border-dashed border-zinc-700 px-1.5 py-0.5 rounded text-[11px]">
                    Creator-reported
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Commercial Clearance:</span>
                {isCommercialCleared ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                    <Scale className="w-3.5 h-3.5" />
                    Certified Cleared
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-400 text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {creator.commercialCapability}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Delivered Projects:</span>
                <span className="text-zinc-200 font-semibold">
                  {creator.verification?.verifiedDeliveriesCount || 0} Projects Completed
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Client Rating:</span>
                <span className="text-lime-accent font-semibold flex items-center gap-1">
                  ★ {creator.verification?.clientRating || 5.0} / 5.0
                </span>
              </div>
            </div>

            {/* Audit Evidence Note */}
            {creator.verification?.evidenceNote && (
              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/60 space-y-1 text-xs font-mono">
                <span className="text-[10px] uppercase text-zinc-400 font-bold block tracking-wider">
                  Audited Evidence Note:
                </span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  {creator.verification.evidenceNote}
                </p>
              </div>
            )}

            <div className="pt-2 text-[10px] font-mono text-zinc-500 leading-tight">
              * Verification in this demo is illustrative for platform evaluation and audit benchmarking.
            </div>
          </div>

          {/* Production Toolchain & Skills Card */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-[#121215] space-y-5">
            {/* Specialization */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2.5">
                Specializations & Genres
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {creator.specialties.map((s) => (
                  <SkillBadge key={s} specialty={s} size="sm" />
                ))}
              </div>
            </div>

            {/* Skills & Generative Techniques */}
            {creator.skills && creator.skills.length > 0 && (
              <div className="pt-4 border-t border-zinc-800/80">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2.5">
                  Production Skills & Techniques
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {creator.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded text-xs font-mono bg-zinc-900 text-zinc-200 border border-zinc-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Supported Formats & Aspect Ratios */}
            <div className="pt-4 border-t border-zinc-800/80 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Delivery Specifications
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-zinc-500">Aspect Ratios:</span>
                  {(creator.supportedAspectRatios || ['16:9']).map((ar) => (
                    <span
                      key={ar}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium"
                    >
                      {ar}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-zinc-500">Deliverables:</span>
                  {(creator.supportedContentTypes || ['Commercial Spots']).map((ct) => (
                    <span
                      key={ct}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
                    >
                      {ct}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Verified vs Self-Reported Toolchains */}
            <div className="pt-4 border-t border-zinc-800/80 space-y-3">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Production Tools (Audited)</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(creator.verification?.verifiedTools || []).map((t) => (
                    <ToolBadge key={t} tool={t} isVerified size="sm" />
                  ))}
                </div>
              </div>

              {creator.verification?.selfReportedTools &&
                creator.verification.selfReportedTools.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Creator-Reported Tools (Unvetted)</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {creator.verification.selfReportedTools.map((t) => (
                        <ToolBadge key={t} tool={t} isVerified={false} size="sm" />
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Right Column: Visually Rich Portfolio Showcase */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-sans flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lime-accent" />
                <span>Production Portfolio & Workflow Showcase</span>
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Click any case study to inspect the multi-stage AI generation pipeline and licensing terms.
              </p>
            </div>

            <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              {creator.portfolio.length} Projects
            </span>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creator.portfolio.map((item) => (
              <div key={item.id} className="cursor-pointer" onClick={() => setSelectedPortfolioItem(item)}>
                <PortfolioCard
                  item={item}
                  creatorName={creator.displayName}
                  onInspectWorkflow={() => setSelectedPortfolioItem(item)}
                />
              </div>
            ))}
          </div>

          {/* Workflow Sequence Spotlight for Featured Project */}
          {creator.portfolio[0] && creator.portfolio[0].workflowStages && (
            <div className="p-6 rounded-2xl border border-zinc-800 bg-[#121215] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-lime-accent" />
                  <span>Audited AI Generation Pipeline: {creator.portfolio[0].title}</span>
                </h3>
                <span className="text-[11px] font-mono text-zinc-500">
                  4-Phase Methodology
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {creator.portfolio[0].workflowStages.map((stage) => (
                  <div
                    key={stage.stageNumber}
                    className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-white">{stage.stageName}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded border ${
                          stage.evidenceType === 'reviewed_node_graph'
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {stage.evidenceType === 'reviewed_node_graph' ? 'Verified' : 'Reported'}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 font-mono leading-relaxed line-clamp-2">
                      {stage.methodology}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {stage.toolsUsed.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.2 text-[10px] font-mono bg-zinc-800/80 rounded border border-zinc-700/60 text-zinc-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500">
                  Full node graph, seed weights, and color space transforms available.
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPortfolioItem(creator.portfolio[0])}
                  className="text-lime-accent hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open Full Inspector</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Portfolio Detail Dialog */}
      <PortfolioDetailDialog
        item={selectedPortfolioItem}
        creatorName={creator.displayName}
        onClose={() => setSelectedPortfolioItem(null)}
      />

      {/* 4. Project Invitation Dialog */}
      <InviteToProjectDialog
        isOpen={isInviteOpen}
        creator={creator}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={(briefTitle) => {
          setInviteSuccessMsg(`Invitation dispatched to ${creator.displayName} for "${briefTitle}"!`);
          setTimeout(() => setInviteSuccessMsg(null), 4000);
        }}
      />

      {/* Success Notification Toast */}
      {inviteSuccessMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-lime-accent/50 bg-[#121215] text-zinc-100 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-lime-accent/20 flex items-center justify-center text-lime-accent shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-mono text-lime-accent font-semibold">Success</p>
            <p className="text-xs text-zinc-300">{inviteSuccessMsg}</p>
          </div>
          <button
            type="button"
            onClick={() => setInviteSuccessMsg(null)}
            className="p-1 rounded text-zinc-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
