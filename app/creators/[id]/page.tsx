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
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
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
} from 'lucide-react';
import { PortfolioItem } from '@/types';

export default function CreatorProfilePage() {
  const params = useParams();
  const creatorId = params?.id as string;
  const creator = mockCreators.find((c) => c.id === creatorId);

  const { isShortlisted, toggleShortlist } = useShortlist();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inspectingPortfolio, setInspectingPortfolio] = useState<PortfolioItem | null>(null);

  if (!creator) {
    notFound();
  }

  const shortlisted = isShortlisted(creator.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Back button & Page Header */}
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
            { label: 'Creators', href: '/discover' },
            { label: creator.displayName },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleShortlist(creator.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider border transition-colors ${
                  shortlisted
                    ? 'bg-lime-accent text-zinc-950 border-lime-accent font-bold shadow-glow-lime'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${shortlisted ? 'fill-current' : ''}`} />
                <span>{shortlisted ? 'Shortlisted' : 'Shortlist'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsInviteOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider bg-lime-accent text-zinc-950 font-bold hover:bg-lime-hover transition-colors shadow-glow-lime focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Invite to Brief</span>
              </button>
            </div>
          }
        />
      </div>

      {/* Creator Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Bio, Verification, Rates, Skills */}
        <div className="space-y-6">
          {/* Avatar and Bio Card */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-[#121215] space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900">
                <Image
                  src={creator.avatarUrl}
                  alt={creator.displayName}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">{creator.displayName}</h2>
                <p className="text-xs font-mono text-zinc-400">@{creator.handle}</p>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  {creator.location} • {creator.timezone}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {creator.bio}
            </p>

            {/* Verification Status Breakdown */}
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Trust & Verification Breakdown
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Identity:</span>
                  <VerificationBadge
                    type={creator.verification.isIdentityVerified ? 'identity' : 'self_reported'}
                    size="sm"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Commercial Clearance:</span>
                  <VerificationBadge
                    type={
                      creator.verification.isCommercialClearanceCertified
                        ? 'commercial_clearance'
                        : 'self_reported'
                    }
                    size="sm"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Completed Projects:</span>
                  <VerificationBadge
                    type="verified_deliveries"
                    count={creator.verification.verifiedDeliveriesCount}
                    size="sm"
                  />
                </div>
              </div>

              {/* Evidence Note */}
              {creator.verification.evidenceNote && (
                <div className="p-2.5 rounded-lg border border-zinc-800/80 bg-zinc-900/50 text-[11px] font-mono text-zinc-400 leading-relaxed">
                  <span className="text-zinc-300 font-semibold block mb-0.5">Audit Note:</span>
                  {creator.verification.evidenceNote}
                </div>
              )}
            </div>

            {/* Rates & Turnaround */}
            <div className="pt-4 border-t border-zinc-800 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Day Rate
                </span>
                <span className="text-base font-bold text-white font-mono">
                  {formatCurrency(creator.dayRateUSD)}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Avg Turnaround
                </span>
                <span className="text-base font-bold text-white font-mono">
                  {creator.turnaroundDaysAverage} days
                </span>
              </div>
            </div>
          </div>

          {/* Specialties, Skills & Toolchains */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-[#121215] space-y-5">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Specialties
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {creator.specialties.map((s) => (
                  <SkillBadge key={s} specialty={s} size="sm" />
                ))}
              </div>
            </div>

            {creator.skills && creator.skills.length > 0 && (
              <div className="pt-4 border-t border-zinc-800">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Skills & Generative Techniques
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {creator.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-zinc-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Supported Content & Aspect Ratios
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-500 text-[11px]">Formats:</span>
                  {creator.supportedAspectRatios?.map((ar) => (
                    <span key={ar} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {ar}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-500 text-[11px]">Deliverables:</span>
                  {creator.supportedContentTypes?.map((ct) => (
                    <span key={ct} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {ct}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Verified Production Toolchains
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {creator.verification.verifiedTools.map((t) => (
                  <ToolBadge key={t} tool={t} isVerified size="sm" />
                ))}
              </div>
            </div>

            {creator.verification.selfReportedTools.length > 0 && (
              <div className="pt-4 border-t border-zinc-800">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                  Self-Reported Tools (Unvetted)
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

        {/* Right Column: Portfolio & Case Studies */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lime-accent" />
              <span>Production Portfolio & Workflows</span>
            </h2>
            <span className="text-xs font-mono text-zinc-400">
              {creator.portfolio.length} Projects
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creator.portfolio.map((item) => (
              <PortfolioCard
                key={item.id}
                item={item}
                creatorName={creator.displayName}
                onInspectWorkflow={(p) => setInspectingPortfolio(p)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Inspect Workflow Modal */}
      {inspectingPortfolio && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0" onClick={() => setInspectingPortfolio(null)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-[#121215] p-6 shadow-2xl z-10 space-y-6">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400">
                  {inspectingPortfolio.category}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {inspectingPortfolio.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setInspectingPortfolio(null)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-zinc-300">
              {inspectingPortfolio.description}
            </p>

            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Step-by-Step Production Pipeline
              </h3>
              <div className="space-y-2">
                {inspectingPortfolio.pipelineSteps.map((s) => (
                  <div key={s.stepNumber} className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/60">
                    <span className="text-xs font-mono text-lime-accent font-bold">
                      Step {s.stepNumber}: {s.phase}
                    </span>
                    <p className="text-xs text-zinc-400 mt-1 font-mono">
                      Tool: {s.tool} — {s.technique}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectingPortfolio(null)}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded bg-zinc-100 text-zinc-950 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isInviteOpen && (
        <ConfirmationDialog
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          onConfirm={() => {
            alert(`Project brief invitation sent to ${creator.displayName}`);
            setIsInviteOpen(false);
          }}
          title={`Invite ${creator.displayName} to Project?`}
          description={`Send an invitation with project scope to ${creator.displayName} (@${creator.handle}). Day rate: $${creator.dayRateUSD}/day.`}
          confirmLabel="Send Invite"
          variant="lime"
        />
      )}
    </div>
  );
}
