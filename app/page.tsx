'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import SearchInput from '@/components/ui/SearchInput';
import FilterGroup from '@/components/ui/FilterGroup';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import CreatorCard from '@/components/cards/CreatorCard';
import PortfolioCard from '@/components/cards/PortfolioCard';
import VerificationBadge from '@/components/ui/VerificationBadge';
import ToolBadge from '@/components/ui/ToolBadge';
import {
  mockCreators,
  mockPortfolioItems,
  specialtyFilterOptions,
  toolFilterOptions,
} from '@/lib/mock-data';
import { Creator, PortfolioItem } from '@/types';
import {
  Sparkles,
  SlidersHorizontal,
  Bookmark,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  FilePlus2,
} from 'lucide-react';

export default function DiscoverPage() {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [onlyCommercialCleared, setOnlyCommercialCleared] = useState(false);
  const [activeTab, setActiveTab] = useState<'creators' | 'portfolios'>('creators');

  // Shortlist State (in-memory for Phase 1, persisted in Phase 2)
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(['creator-3']);

  // Modal / Interaction State
  const [inspectingPortfolio, setInspectingPortfolio] = useState<PortfolioItem | null>(null);
  const [invitingCreator, setInvitingCreator] = useState<Creator | null>(null);
  const [isInviteConfirmed, setIsInviteConfirmed] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // Toggle Shortlist
  const handleToggleShortlist = (creatorId: string) => {
    setShortlistedIds((prev) =>
      prev.includes(creatorId)
        ? prev.filter((id) => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  // Filtered Creators
  const filteredCreators = useMemo(() => {
    return mockCreators.filter((creator) => {
      // Search matching (name, tagline, bio, tools)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        creator.displayName.toLowerCase().includes(q) ||
        creator.tagline.toLowerCase().includes(q) ||
        creator.handle.toLowerCase().includes(q) ||
        creator.verification.verifiedTools.some((t) => t.toLowerCase().includes(q)) ||
        creator.specialties.some((s) => s.toLowerCase().includes(q));

      // Specialty matching
      const matchesSpecialty =
        selectedSpecialties.length === 0 ||
        selectedSpecialties.includes('all') ||
        creator.specialties.some((s) => selectedSpecialties.includes(s));

      // Tool matching
      const matchesTool =
        selectedTools.length === 0 ||
        creator.verification.verifiedTools.some((t) => selectedTools.includes(t)) ||
        creator.verification.selfReportedTools.some((t) => selectedTools.includes(t));

      // Commercial clearance
      const matchesCommercial =
        !onlyCommercialCleared || creator.verification.isCommercialClearanceCertified;

      return matchesSearch && matchesSpecialty && matchesTool && matchesCommercial;
    });
  }, [searchQuery, selectedSpecialties, selectedTools, onlyCommercialCleared]);

  // Filtered Portfolios
  const filteredPortfolios = useMemo(() => {
    return mockPortfolioItems.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.primaryModel.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      const matchesCommercial =
        !onlyCommercialCleared || item.commercialRightsStatus === 'commercial_cleared';

      return matchesSearch && matchesCommercial;
    });
  }, [searchQuery, onlyCommercialCleared]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedSpecialties([]);
    setSelectedTools([]);
    setOnlyCommercialCleared(false);
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedSpecialties.length > 0 ||
    selectedTools.length > 0 ||
    onlyCommercialCleared;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header with Contextual Actions */}
      <PageHeader
        title="Curated AI Filmmakers & Directors"
        subtitle="Discover verified generative directors, prompt architects, and animators. Transparent production pipelines, model disclosures, and commercial clearance."
        badge={
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-zinc-900 border border-zinc-700/80 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-lime-accent animate-pulse" />
            <span>{mockCreators.length} Available Directors</span>
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/briefs/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider bg-lime-accent text-zinc-950 font-bold hover:bg-lime-hover transition-colors shadow-glow-lime focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              <span>Match Brief</span>
            </Link>

            <Link
              href="/shortlist"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-zinc-400" />
              <span>Shortlist ({shortlistedIds.length})</span>
            </Link>
          </div>
        }
      />

      {/* Discovery Control Center: Search & Filter Rail */}
      <section className="p-4 sm:p-5 rounded-xl border border-zinc-800 bg-[#121215]/80 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by creator name, visual style, or toolchain (e.g., Runway Gen-3, ComfyUI, Flux)..."
            />
          </div>

          {/* View Mode Toggle: Creators vs Showcase */}
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 p-1 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('creators')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-colors ${
                activeTab === 'creators'
                  ? 'bg-zinc-800 text-white font-medium border border-zinc-700/80 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Creators ({filteredCreators.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('portfolios')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-colors ${
                activeTab === 'portfolios'
                  ? 'bg-zinc-800 text-white font-medium border border-zinc-700/80 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Portfolio Workflows ({filteredPortfolios.length})
            </button>
          </div>
        </div>

        {/* Facet Filters */}
        <div className="pt-3 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FilterGroup
            label="Specialty & Genre"
            options={specialtyFilterOptions.filter((o) => o.value !== 'all')}
            selectedValues={selectedSpecialties}
            onChange={setSelectedSpecialties}
            pillVariant="default"
          />

          <FilterGroup
            label="Verified Toolchain"
            options={toolFilterOptions}
            selectedValues={selectedTools}
            onChange={setSelectedTools}
            pillVariant="lime"
          />
        </div>

        {/* Quick Clearance Toggle Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyCommercialCleared}
              onChange={(e) => setOnlyCommercialCleared(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-lime-accent focus:ring-lime-accent focus:ring-offset-0"
            />
            <span className="flex items-center gap-1.5 text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Only Commercial Clearance Certified</span>
            </span>
          </label>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs text-lime-accent hover:underline focus:outline-none"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </section>

      {/* Main Content Grid or Empty State */}
      {activeTab === 'creators' ? (
        filteredCreators.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                isShortlisted={shortlistedIds.includes(creator.id)}
                onToggleShortlist={handleToggleShortlist}
                onInvite={(c) => setInvitingCreator(c)}
              />
            ))}
          </section>
        ) : (
          <EmptyState
            title="No Creators Match These Criteria"
            description="We couldn't find any creators matching your current combination of toolchains and specialties. Try resetting your filters."
            actionLabel="Reset All Filters"
            onAction={resetAllFilters}
          />
        )
      ) : filteredPortfolios.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolios.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onInspectWorkflow={(portfolio) => setInspectingPortfolio(portfolio)}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No Portfolio Items Found"
          description="Try broadening your search term or unchecking the commercial clearance filter."
          actionLabel="Reset Search"
          onAction={resetAllFilters}
        />
      )}

      {/* Workflow Deep-Dive Inspector Modal */}
      {inspectingPortfolio && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0" onClick={() => setInspectingPortfolio(null)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-[#121215] p-6 shadow-2xl z-10 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400">
                  {inspectingPortfolio.category}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {inspectingPortfolio.title}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <ToolBadge tool={inspectingPortfolio.primaryModel} isVerified size="sm" />
                  <span className="text-xs text-zinc-400 font-mono">
                    Clearance: {inspectingPortfolio.commercialRightsStatus}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectingPortfolio(null)}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Production Narrative
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {inspectingPortfolio.description}
              </p>
            </div>

            {/* Pipeline Step Architecture */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-lime-accent" />
                <span>Generative Pipeline Node Graph ({inspectingPortfolio.pipelineSteps.length} Steps)</span>
              </h3>

              <div className="space-y-2.5">
                {inspectingPortfolio.pipelineSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="flex items-start gap-3 p-3 rounded-lg border border-zinc-800/80 bg-zinc-900/60"
                  >
                    <span className="w-6 h-6 rounded flex items-center justify-center bg-zinc-800 text-zinc-200 font-mono text-xs font-bold shrink-0">
                      {step.stepNumber}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-lime-accent">
                          {step.phase}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-xs font-mono text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/60">
                          {step.tool}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 font-mono">
                        {step.technique}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectingPortfolio(null)}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-md bg-zinc-100 text-zinc-950 font-bold hover:bg-white"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Creator Invitation */}
      {invitingCreator && (
        <ConfirmationDialog
          isOpen={Boolean(invitingCreator)}
          onClose={() => setInvitingCreator(null)}
          onConfirm={() => {
            setIsInviteConfirmed(true);
            setTimeout(() => {
              setInvitingCreator(null);
              setIsInviteConfirmed(false);
            }, 1000);
          }}
          title={`Invite ${invitingCreator.displayName} to Brief?`}
          description={`This will send an invitation notification to @${invitingCreator.handle} with your project scope and schedule their production review. Their day rate is $${invitingCreator.dayRateUSD}/day.`}
          confirmLabel={isInviteConfirmed ? 'Invited ✓' : 'Send Invitation'}
          variant="lime"
        />
      )}
    </div>
  );
}
