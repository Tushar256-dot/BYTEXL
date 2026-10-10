'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import ToolBadge from '@/components/ui/ToolBadge';
import CreatorCard from '@/components/cards/CreatorCard';
import InviteToProjectDialog from '@/components/invitation/InviteToProjectDialog';
import { toolFilterOptions, mockCreators } from '@/lib/mock-data';
import { matchCreatorsToBrief } from '@/lib/matcher';
import { useShortlist } from '@/lib/hooks/useShortlist';
import { CreativeBrief, BriefMatchResult, Creator, AspectRatio } from '@/types';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Bookmark,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  Info,
} from 'lucide-react';

export default function CreateBriefPage() {
  const [title, setTitle] = useState('');
  const [deliverableType, setDeliverableType] = useState<'commercial_spot' | 'teaser' | 'music_video' | 'social_campaign' | 'concept_art'>('commercial_spot');
  const [targetDuration, setTargetDuration] = useState('30s');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [selectedTools, setSelectedTools] = useState<string[]>(['Runway Gen-3', 'Flux.1']);
  const [budgetMin, setBudgetMin] = useState('3000');
  const [budgetMax, setBudgetMax] = useState('7500');
  const [requiredVerification, setRequiredVerification] = useState<'commercial_cleared_only' | 'identity_verified' | 'open_to_all'>('commercial_cleared_only');
  const [description, setDescription] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedBrief, setSubmittedBrief] = useState<CreativeBrief | null>(null);
  const [matchResults, setMatchResults] = useState<BriefMatchResult[]>([]);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  // Shortlist hook & invitation state
  const { shortlistedIds, toggleShortlist, isShortlisted } = useShortlist();
  const [invitingCreator, setInvitingCreator] = useState<Creator | null>(null);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Extract aesthetic keywords from brief description and title
    const rawWords = `${title} ${description}`
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .filter((w) => w.length > 3);
    const aestheticKeywords = Array.from(new Set(rawWords)).slice(0, 6);

    const newBrief: CreativeBrief = {
      id: `brief-${Date.now()}`,
      title: title || 'Untitled Creative Spec',
      brandName: 'Brand Partner',
      deliverableType,
      aspectRatio,
      targetDurationSeconds: parseInt(targetDuration) || 30,
      budgetUSD: {
        min: parseInt(budgetMin) || 1000,
        max: parseInt(budgetMax) || 10000,
      },
      deadline: 'Nov 20, 2026',
      urgency: 'standard',
      requiredTools: selectedTools as any[],
      aestheticKeywords,
      requiredVerification,
      narrativeDescription: description,
      createdAt: new Date().toISOString(),
      status: 'matched',
    };

    const results = matchCreatorsToBrief(newBrief, mockCreators);

    setSubmittedBrief(newBrief);
    setMatchResults(results);
    setIsSubmitted(true);
    if (results.length > 0) {
      setExpandedMatchId(results[0].creatorId);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedBrief(null);
    setMatchResults([]);
  };

  const eligibleMatches = matchResults.filter((m) => m.isEligible);
  const ineligibleMatches = matchResults.filter((m) => !m.isEligible);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      <div>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors mb-4 focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Discover</span>
        </Link>

        <PageHeader
          title="Create Creative Brief & Match Directors"
          subtitle="Define production specifications, required toolchains, and commercial clearance rules to run our explainable deterministic director matching engine."
          breadcrumbs={[
            { label: 'Discover', href: '/discover' },
            { label: 'Create Brief' },
          ]}
        />
      </div>

      {isSubmitted && submittedBrief ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
          {/* Matcher Results Banner */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-[#121215] space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-lime-accent/20 border border-lime-accent/40 flex items-center justify-center text-lime-accent shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-sans">
                    Matching Complete for &ldquo;{submittedBrief.title}&rdquo;
                  </h2>
                  <p className="text-xs font-mono text-zinc-400">
                    Evaluated {mockCreators.length} verified directors across 6 explainable match dimensions.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Create Another Brief</span>
              </button>
            </div>

            {/* Brief Specification Summary Pills */}
            <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-300">
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
                Deliverable: <strong className="text-white">{submittedBrief.deliverableType}</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
                Aspect Ratio: <strong className="text-white">{submittedBrief.aspectRatio}</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
                Budget: <strong className="text-lime-accent">${submittedBrief.budgetUSD.min.toLocaleString()} - ${submittedBrief.budgetUSD.max.toLocaleString()}</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
                Required Tools: <strong className="text-white">{submittedBrief.requiredTools.join(', ') || 'None'}</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
                Clearance Req: <strong className="text-white">{submittedBrief.requiredVerification}</strong>
              </span>
            </div>
          </div>

          {/* Matches List Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300 font-semibold uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-lime-accent" />
                <span>Ranked Director Matches ({eligibleMatches.length} Eligible, {ineligibleMatches.length} Ineligible)</span>
              </span>
              <span className="text-zinc-500">Sorted by Match Score &amp; Eligibility</span>
            </div>

            <div className="space-y-6">
              {matchResults.map((result, index) => {
                const creator = result.creator || mockCreators.find((c) => c.id === result.creatorId)!;
                const isExpanded = expandedMatchId === result.creatorId;
                const shortlisted = isShortlisted(creator.id);

                return (
                  <div
                    key={result.creatorId}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      result.isEligible
                        ? 'border-zinc-800 bg-[#121215] hover:border-zinc-700'
                        : 'border-zinc-800/80 bg-[#0f0f12] opacity-90'
                    }`}
                  >
                    {/* Header Row: Rank, Score Badge, Creator Info, Actions */}
                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Rank & Match Score */}
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center justify-center shrink-0">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Rank</span>
                          <span className="text-lg font-bold font-mono text-zinc-300">#{index + 1}</span>
                        </div>

                        <div className="relative flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                            Match Score
                          </span>
                          <span
                            className={`text-2xl font-black font-mono ${
                              result.overallScore >= 85
                                ? 'text-lime-accent'
                                : result.overallScore >= 65
                                ? 'text-amber-400'
                                : 'text-zinc-400'
                            }`}
                          >
                            {result.overallScore}%
                          </span>
                        </div>

                        {/* Creator Summary */}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/creators/${creator.id}`}
                              className="text-base font-bold text-white hover:text-lime-accent transition-colors font-sans"
                            >
                              {creator.displayName}
                            </Link>

                            {/* Eligibility Badge */}
                            {result.isEligible ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                Fully Eligible
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-rose-950/60 text-rose-300 border border-rose-800/60 font-medium">
                                <AlertTriangle className="w-3 h-3" />
                                Ineligible / Non-Compliant
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-zinc-400 font-mono mt-1">
                            @{creator.handle} • {creator.specialties?.[0] || 'AI Director'} • Indicative: ${creator.dayRateUSD}/day
                          </p>

                          {/* Disqualification Explanation (if ineligible) */}
                          {!result.isEligible && result.disqualificationReason && (
                            <p className="text-xs font-mono text-rose-300 mt-2 p-2 rounded-lg bg-rose-950/30 border border-rose-900/40">
                              ⚠️ <strong>Disqualification Condition:</strong> {result.disqualificationReason}
                            </p>
                          )}

                          {/* Highlights Badges */}
                          {result.highlights && result.highlights.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                              {result.highlights.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-lime-accent border border-zinc-800"
                                >
                                  ★ {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => toggleShortlist(creator.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider border transition-colors ${
                            shortlisted
                              ? 'bg-lime-accent text-zinc-950 border-lime-accent font-bold shadow-glow-lime'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 inline mr-1 ${shortlisted ? 'fill-current' : ''}`} />
                          <span>{shortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setInvitingCreator(creator)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider bg-lime-accent text-zinc-950 font-bold hover:bg-lime-hover transition-colors shadow-glow-lime"
                        >
                          Invite to Project
                        </button>

                        <Link
                          href={`/creators/${creator.id}`}
                          className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700"
                          title="View Director Profile"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setExpandedMatchId(isExpanded ? null : result.creatorId)}
                          className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                          aria-label={isExpanded ? 'Collapse match breakdown' : 'Expand match breakdown'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Factor Breakdown Drawer */}
                    {isExpanded && (
                      <div className="p-5 border-t border-zinc-800/80 bg-zinc-950/60 space-y-4 animate-in slide-in-from-top-1 duration-150">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-lime-accent" />
                            <span>Explainable Match Score Matrix (6 Dimensions)</span>
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-500">
                            Weights sum to 100%
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {result.breakdown.map((factor) => (
                            <div
                              key={factor.dimension}
                              className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-2"
                            >
                              <div className="flex items-center justify-between text-xs font-mono">
                                <span className="font-semibold text-white">{factor.dimension}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-zinc-500">Weight: {factor.weight}%</span>
                                  <span
                                    className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                                      factor.score >= 80
                                        ? 'bg-lime-accent/20 text-lime-accent border border-lime-accent/30'
                                        : factor.score >= 50
                                        ? 'bg-amber-950/40 text-amber-300 border border-amber-800/50'
                                        : 'bg-zinc-800 text-zinc-400'
                                    }`}
                                  >
                                    {factor.score}%
                                  </span>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all ${
                                    factor.score >= 80
                                      ? 'bg-lime-accent'
                                      : factor.score >= 50
                                      ? 'bg-amber-400'
                                      : 'bg-zinc-600'
                                  }`}
                                  style={{ width: `${factor.score}%` }}
                                />
                              </div>

                              <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                                {factor.rationale}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Invitation Modal */}
          {invitingCreator && (
            <InviteToProjectDialog
              isOpen={Boolean(invitingCreator)}
              creator={invitingCreator}
              onClose={() => setInvitingCreator(null)}
              onSuccess={(bTitle) => {
                setInviteSuccessMsg(`Invitation successfully dispatched to ${invitingCreator.displayName} for "${bTitle}"!`);
                setTimeout(() => setInviteSuccessMsg(null), 4000);
              }}
            />
          )}

          {inviteSuccessMsg && (
            <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-lime-accent/50 bg-[#121215] text-zinc-100 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200">
              <CheckCircle2 className="w-5 h-5 text-lime-accent" />
              <p className="text-xs font-mono text-zinc-200">{inviteSuccessMsg}</p>
            </div>
          )}
        </div>
      ) : (
        /* Brief Form */
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-xl border border-zinc-800 bg-[#121215] space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Ultra-Luxe Autumn Perfume Launch Spec"
              className="w-full h-11 px-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-lime-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                Deliverable Type
              </label>
              <select
                value={deliverableType}
                onChange={(e) => setDeliverableType(e.target.value as any)}
                className="w-full h-11 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-600"
              >
                <option value="commercial_spot">Commercial Spot (15-60s)</option>
                <option value="teaser">Brand Teaser</option>
                <option value="music_video">Music Video</option>
                <option value="concept_art">Concept Art &amp; Animatic</option>
                <option value="social_campaign">Social Campaign (9:16)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full h-11 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-600"
              >
                <option value="16:9">16:9 Widescreen</option>
                <option value="9:16">9:16 Vertical Reel</option>
                <option value="1:1">1:1 Square</option>
                <option value="2.39:1">2.39:1 Anamorphic Scope</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                Target Duration
              </label>
              <input
                type="text"
                value={targetDuration}
                onChange={(e) => setTargetDuration(e.target.value)}
                placeholder="e.g., 30s"
                className="w-full h-11 px-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                Estimated Budget Range (USD)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="Min ($)"
                  className="w-full h-11 px-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none"
                />
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="Max ($)"
                  className="w-full h-11 px-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                Required Verification Level
              </label>
              <select
                value={requiredVerification}
                onChange={(e) => setRequiredVerification(e.target.value as any)}
                className="w-full h-11 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-600"
              >
                <option value="commercial_cleared_only">Certified Commercial Clearance Only</option>
                <option value="identity_verified">Verified Identity Required</option>
                <option value="open_to_all">Open to All Directors</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
              Preferred / Required Toolchain
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {toolFilterOptions.map((opt) => (
                <ToolBadge
                  key={opt.value}
                  tool={opt.label}
                  active={selectedTools.includes(opt.value)}
                  onClick={() => toggleTool(opt.value)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
              Creative Brief &amp; Narrative Direction
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe desired aesthetic, fluid dynamics, camera choreography, and clearance constraints..."
              className="w-full p-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider bg-lime-accent text-zinc-950 font-bold hover:bg-lime-hover transition-colors shadow-glow-lime focus:outline-none focus-visible:ring-2 focus-visible:ring-white flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit Brief &amp; Run Matcher</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
