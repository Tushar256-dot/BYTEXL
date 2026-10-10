'use client';

import React, { useState, useMemo, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import SearchInput from '@/components/ui/SearchInput';
import FilterGroup from '@/components/ui/FilterGroup';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import CreatorCard from '@/components/cards/CreatorCard';
import { mockCreators } from '@/lib/data/creators';
import {
  filterCreators,
  sortCreators,
  computeFacetOptions,
  DEFAULT_FILTER_STATE,
} from '@/lib/search-filters';
import { useShortlist } from '@/lib/hooks/useShortlist';
import {
  Creator,
  DiscoveryFilterState,
  DiscoverySortOption,
  CreatorSpecialty,
  AiTool,
  ContentType,
  AspectRatio,
  CommercialCapability,
} from '@/types';
import {
  SlidersHorizontal,
  Bookmark,
  FilePlus2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  X,
  Layers,
  Check,
} from 'lucide-react';

function DiscoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Initial State from URL Search Params
  const initialFilters: DiscoveryFilterState = useMemo(() => {
    const q = searchParams.get('q') || '';
    const specialties = (searchParams.get('specialties')?.split(',').filter(Boolean) || []) as CreatorSpecialty[];
    const skills = searchParams.get('skills')?.split(',').filter(Boolean) || [];
    const tools = (searchParams.get('tools')?.split(',').filter(Boolean) || []) as AiTool[];
    const contentTypes = (searchParams.get('contentTypes')?.split(',').filter(Boolean) || []) as ContentType[];
    const aspectRatios = (searchParams.get('aspectRatios')?.split(',').filter(Boolean) || []) as AspectRatio[];
    const commercialCapabilities = (searchParams.get('commercial')?.split(',').filter(Boolean) || []) as CommercialCapability[];
    const sort = (searchParams.get('sort') || 'relevance') as DiscoverySortOption;

    return {
      search: q,
      specialties,
      skills,
      tools,
      contentTypes,
      aspectRatios,
      commercialCapabilities,
      sort,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<DiscoveryFilterState>(initialFilters);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [invitingCreator, setInvitingCreator] = useState<Creator | null>(null);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);

  // Shortlist hook with localStorage persistence
  const { shortlistedIds, toggleShortlist, isShortlisted } = useShortlist(['creator-3']);

  // Dynamic facet options based on seeded creators
  const facetOptions = useMemo(() => computeFacetOptions(mockCreators), []);

  // 2. Synchronize filters to URL query parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('q', filters.search);
    if (filters.specialties.length > 0) params.set('specialties', filters.specialties.join(','));
    if (filters.skills.length > 0) params.set('skills', filters.skills.join(','));
    if (filters.tools.length > 0) params.set('tools', filters.tools.join(','));
    if (filters.contentTypes.length > 0) params.set('contentTypes', filters.contentTypes.join(','));
    if (filters.aspectRatios.length > 0) params.set('aspectRatios', filters.aspectRatios.join(','));
    if (filters.commercialCapabilities.length > 0) params.set('commercial', filters.commercialCapabilities.join(','));
    if (filters.sort !== 'relevance') params.set('sort', filters.sort);

    const queryString = params.toString();
    const newPath = queryString ? `/discover?${queryString}` : '/discover';
    window.history.replaceState(null, '', newPath);
  }, [filters]);

  // 3. Filtered & Sorted Creators
  const filteredAndSortedCreators = useMemo(() => {
    const filtered = filterCreators(mockCreators, filters);
    return sortCreators(filtered, filters.sort);
  }, [filters]);

  // Filter modifiers
  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleSpecialtiesChange = useCallback((values: string[]) => {
    setFilters((prev) => ({ ...prev, specialties: values as CreatorSpecialty[] }));
  }, []);

  const handleSkillsChange = useCallback((values: string[]) => {
    setFilters((prev) => ({ ...prev, skills: values }));
  }, []);

  const handleToolsChange = useCallback((values: string[]) => {
    setFilters((prev) => ({ ...prev, tools: values as AiTool[] }));
  }, []);

  const handleContentTypesChange = useCallback((values: string[]) => {
    setFilters((prev) => ({ ...prev, contentTypes: values as ContentType[] }));
  }, []);

  const handleAspectRatiosChange = useCallback((values: string[]) => {
    setFilters((prev) => ({ ...prev, aspectRatios: values as AspectRatio[] }));
  }, []);

  const handleCommercialChange = useCallback((values: string[]) => {
    setFilters((prev) => ({ ...prev, commercialCapabilities: values as CommercialCapability[] }));
  }, []);

  const handleSortChange = useCallback((sort: DiscoverySortOption) => {
    setFilters((prev) => ({ ...prev, sort }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER_STATE);
  }, []);

  // Compute active filter count
  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    filters.specialties.length +
    filters.skills.length +
    filters.tools.length +
    filters.contentTypes.length +
    filters.aspectRatios.length +
    filters.commercialCapabilities.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Page Heading and Marketplace Explanation */}
      <PageHeader
        title="Discover AI Filmmakers & Directors"
        subtitle="The verified marketplace for generative cinema, stylized animation, and commercial AI content. Discover directors with audited generation pipelines, commercial clearance, and prompt architecture."
        badge={
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-zinc-900 border border-zinc-700/80 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-lime-accent animate-pulse" />
            <span>{mockCreators.length} Verified Directors</span>
          </span>
        }
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              href="/briefs/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider bg-lime-accent text-zinc-950 font-bold hover:bg-lime-hover transition-colors shadow-glow-lime focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              <span>Post Creative Brief</span>
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

      {/* 2. Interactive Discovery Search & Filter Console */}
      <section
        className="p-5 rounded-xl border border-zinc-800 bg-[#121215]/90 space-y-5 shadow-sm"
        aria-label="Creator Filters and Search"
      >
        {/* Row 1: Search Input & Sort Selector */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex-1">
            <SearchInput
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search by creator name, tool (e.g. Runway, ComfyUI), skill, or genre..."
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="sort-select" className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Sort:
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={filters.sort}
                onChange={(e) => handleSortChange(e.target.value as DiscoverySortOption)}
                className="h-11 px-3 pr-8 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-lime-accent appearance-none cursor-pointer"
              >
                <option value="relevance">Relevance & Verified</option>
                <option value="portfolio-count">Portfolio Count (High to Low)</option>
                <option value="rate-asc">Indicative Rate (Low to High)</option>
                <option value="rate-desc">Indicative Rate (High to Low)</option>
                <option value="rating-desc">Client Rating (Highest)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Toggle Advanced Filters Button */}
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`h-11 px-3 rounded-lg border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                showAdvancedFilters || activeFiltersCount > 0
                  ? 'bg-zinc-800 text-white border-zinc-700'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
              aria-expanded={showAdvancedFilters}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-lime-accent text-zinc-950 font-bold text-[10px] flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Primary Quick Filters (Specialization & Tools) */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-4">
          <FilterGroup
            label="Specialization"
            options={facetOptions.specialties}
            selectedValues={filters.specialties}
            onChange={handleSpecialtiesChange}
            pillVariant="default"
          />

          <FilterGroup
            label="AI Tools & Generation Models"
            options={facetOptions.tools.slice(0, 8)}
            selectedValues={filters.tools}
            onChange={handleToolsChange}
            pillVariant="lime"
          />
        </div>

        {/* Row 3: Collapsible Advanced Filters (Skills, Content Types, Formats, Commercial Clearance) */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-zinc-800/80 space-y-4 animate-in slide-in-from-top-2 duration-150">
            {/* Skills */}
            <FilterGroup
              label="Production Skills & Techniques"
              options={facetOptions.skills}
              selectedValues={filters.skills}
              onChange={handleSkillsChange}
              pillVariant="violet"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {/* Content Types */}
              <FilterGroup
                label="Content Type"
                options={facetOptions.contentTypes}
                selectedValues={filters.contentTypes}
                onChange={handleContentTypesChange}
              />

              {/* Aspect Ratios & Formats */}
              <FilterGroup
                label="Aspect Ratio & Formats"
                options={facetOptions.aspectRatios}
                selectedValues={filters.aspectRatios}
                onChange={handleAspectRatiosChange}
              />

              {/* Commercial Clearance */}
              <FilterGroup
                label="Commercial-Use Clearance"
                options={facetOptions.commercialCapabilities}
                selectedValues={filters.commercialCapabilities}
                onChange={handleCommercialChange}
              />
            </div>
          </div>
        )}

        {/* Results Bar with Result Count and Clear Filters */}
        <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="font-semibold text-white">
              {filteredAndSortedCreators.length}
            </span>
            <span>
              {filteredAndSortedCreators.length === 1 ? 'Creator Found' : 'Creators Found'}
            </span>
            {activeFiltersCount > 0 && (
              <span className="text-zinc-500">
                (filtered from {mockCreators.length} total)
              </span>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 text-xs text-lime-accent hover:text-white transition-colors focus:outline-none focus-visible:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All Filters ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </section>

      {/* 3. Creator Cards Grid or Recovery Empty State */}
      {filteredAndSortedCreators.length > 0 ? (
        <section
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="Creators List"
        >
          {filteredAndSortedCreators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              isShortlisted={isShortlisted(creator.id)}
              onToggleShortlist={toggleShortlist}
              onInvite={(c) => setInvitingCreator(c)}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No Creators Match Your Filter Criteria"
          description="We couldn't find any creators matching your current combination of skills, tools, and aspect ratios. Try removing some filters or clearing search terms to explore all available directors."
          actionLabel="Clear All Filters"
          onAction={handleClearFilters}
          secondaryActionLabel="Explore All Directors"
          onSecondaryAction={() => {
            handleClearFilters();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* 4. Confirmation Dialog for Creator Invitation */}
      {invitingCreator && (
        <ConfirmationDialog
          isOpen={Boolean(invitingCreator)}
          onClose={() => setInvitingCreator(null)}
          onConfirm={() => {
            const name = invitingCreator.displayName;
            setInvitingCreator(null);
            setInviteSuccessMsg(`Invitation successfully dispatched to ${name}!`);
            setTimeout(() => setInviteSuccessMsg(null), 4000);
          }}
          title={`Invite ${invitingCreator.displayName} to Project Brief?`}
          description={`Send an invitation to @${invitingCreator.handle} (${invitingCreator.specialties?.[0] || 'AI Director'}). Indicative rate: $${invitingCreator.dayRateUSD}/day. Average turnaround: ${invitingCreator.turnaroundDaysAverage} days.`}
          confirmLabel="Send Project Invitation"
          variant="lime"
        />
      )}

      {/* Toast alert on invitation success */}
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

export default function DiscoverPage() {
  return (
    <Suspense fallback={<LoadingState message="Hydrating AI creator directory..." variant="cards" count={6} />}>
      <DiscoverContent />
    </Suspense>
  );
}
