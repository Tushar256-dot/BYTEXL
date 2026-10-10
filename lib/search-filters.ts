import {
  Creator,
  DiscoveryFilterState,
  DiscoverySortOption,
  CreatorSpecialty,
  AiTool,
  ContentType,
  AspectRatio,
  CommercialCapability,
  FilterOption,
} from '@/types';

export const DEFAULT_FILTER_STATE: DiscoveryFilterState = {
  search: '',
  specialties: [],
  skills: [],
  tools: [],
  contentTypes: [],
  aspectRatios: [],
  commercialCapabilities: [],
  sort: 'relevance',
};

/**
 * Filter creators deterministically according to multi-faceted criteria.
 * Safe against missing, empty, or undefined fields.
 */
export function filterCreators(
  creators: Creator[],
  filters: Partial<DiscoveryFilterState>
): Creator[] {
  const query = (filters.search || '').trim().toLowerCase();
  const selectedSpecialties = filters.specialties || [];
  const selectedSkills = filters.skills || [];
  const selectedTools = filters.tools || [];
  const selectedContentTypes = filters.contentTypes || [];
  const selectedAspectRatios = filters.aspectRatios || [];
  const selectedCommercial = filters.commercialCapabilities || [];

  return creators.filter((creator) => {
    if (!creator) return false;

    // 1. Text Search across name, bio, tagline, handle, skills, tools, and specialties
    if (query) {
      const nameMatch = creator.displayName?.toLowerCase().includes(query) ?? false;
      const handleMatch = creator.handle?.toLowerCase().includes(query) ?? false;
      const taglineMatch = creator.tagline?.toLowerCase().includes(query) ?? false;
      const bioMatch = creator.bio?.toLowerCase().includes(query) ?? false;
      const specialtyMatch =
        creator.specialties?.some((s) => s.toLowerCase().includes(query)) ?? false;
      const skillMatch =
        creator.skills?.some((s) => s.toLowerCase().includes(query)) ?? false;
      const toolMatch =
        (creator.verification?.verifiedTools?.some((t) => t.toLowerCase().includes(query)) ||
          creator.verification?.selfReportedTools?.some((t) =>
            t.toLowerCase().includes(query)
          )) ??
        false;
      const contentMatch =
        creator.supportedContentTypes?.some((ct) => ct.toLowerCase().includes(query)) ??
        false;

      if (
        !nameMatch &&
        !handleMatch &&
        !taglineMatch &&
        !bioMatch &&
        !specialtyMatch &&
        !skillMatch &&
        !toolMatch &&
        !contentMatch
      ) {
        return false;
      }
    }

    // 2. Specialization Filter (Multi-select OR matching)
    if (selectedSpecialties.length > 0) {
      const hasMatchingSpecialty = creator.specialties?.some((s) =>
        selectedSpecialties.includes(s)
      );
      if (!hasMatchingSpecialty) return false;
    }

    // 3. Skills Filter (Multi-select OR matching)
    if (selectedSkills.length > 0) {
      const hasMatchingSkill = creator.skills?.some((s) =>
        selectedSkills.includes(s)
      );
      if (!hasMatchingSkill) return false;
    }

    // 4. Tools & Models Filter (Matches verified OR self-reported)
    if (selectedTools.length > 0) {
      const allCreatorTools = [
        ...(creator.verification?.verifiedTools || []),
        ...(creator.verification?.selfReportedTools || []),
      ];
      const hasMatchingTool = allCreatorTools.some((t) =>
        selectedTools.includes(t as AiTool)
      );
      if (!hasMatchingTool) return false;
    }

    // 5. Content Type Filter
    if (selectedContentTypes.length > 0) {
      const hasMatchingContentType = creator.supportedContentTypes?.some((ct) =>
        selectedContentTypes.includes(ct)
      );
      if (!hasMatchingContentType) return false;
    }

    // 6. Aspect Ratio Filter
    if (selectedAspectRatios.length > 0) {
      const hasMatchingAspectRatio = creator.supportedAspectRatios?.some((ar) =>
        selectedAspectRatios.includes(ar)
      );
      if (!hasMatchingAspectRatio) return false;
    }

    // 7. Commercial-Use Capability Filter
    if (selectedCommercial.length > 0) {
      if (!selectedCommercial.includes(creator.commercialCapability)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Deterministically sorts creators by selected option.
 */
export function sortCreators(
  creators: Creator[],
  sortOption: DiscoverySortOption = 'relevance'
): Creator[] {
  const list = [...creators];

  switch (sortOption) {
    case 'relevance':
      return list.sort((a, b) => {
        // Verified first
        const aVerified = a.verification?.isCommercialClearanceCertified ? 1 : 0;
        const bVerified = b.verification?.isCommercialClearanceCertified ? 1 : 0;
        if (bVerified !== aVerified) return bVerified - aVerified;

        // Then client rating
        const ratingA = a.verification?.clientRating || 0;
        const ratingB = b.verification?.clientRating || 0;
        if (ratingB !== ratingA) return ratingB - ratingA;

        // Then deliveries
        const delA = a.verification?.verifiedDeliveriesCount || 0;
        const delB = b.verification?.verifiedDeliveriesCount || 0;
        return delB - delA;
      });

    case 'portfolio-count':
      return list.sort((a, b) => {
        const countA = a.portfolio?.length || 0;
        const countB = b.portfolio?.length || 0;
        if (countB !== countA) return countB - countA;
        return (b.verification?.verifiedDeliveriesCount || 0) - (a.verification?.verifiedDeliveriesCount || 0);
      });

    case 'rate-asc':
      return list.sort((a, b) => {
        const rateA = a.dayRateUSD || 999999;
        const rateB = b.dayRateUSD || 999999;
        return rateA - rateB;
      });

    case 'rate-desc':
      return list.sort((a, b) => {
        const rateA = a.dayRateUSD || 0;
        const rateB = b.dayRateUSD || 0;
        return rateB - rateA;
      });

    case 'rating-desc':
      return list.sort((a, b) => {
        const ratingA = a.verification?.clientRating || 0;
        const ratingB = b.verification?.clientRating || 0;
        if (ratingB !== ratingA) return ratingB - ratingA;
        return (b.verification?.verifiedDeliveriesCount || 0) - (a.verification?.verifiedDeliveriesCount || 0);
      });

    default:
      return list;
  }
}

/**
 * Helper to compute facet counts dynamically from a pool of creators
 */
export function computeFacetOptions(
  allCreators: Creator[]
): {
  specialties: FilterOption[];
  skills: FilterOption[];
  tools: FilterOption[];
  contentTypes: FilterOption[];
  aspectRatios: FilterOption[];
  commercialCapabilities: FilterOption[];
} {
  const specialtyCounts: Record<string, number> = {};
  const skillCounts: Record<string, number> = {};
  const toolCounts: Record<string, number> = {};
  const contentTypeCounts: Record<string, number> = {};
  const aspectRatioCounts: Record<string, number> = {};
  const commercialCounts: Record<string, number> = {};

  allCreators.forEach((c) => {
    c.specialties?.forEach((s) => {
      specialtyCounts[s] = (specialtyCounts[s] || 0) + 1;
    });

    c.skills?.forEach((sk) => {
      skillCounts[sk] = (skillCounts[sk] || 0) + 1;
    });

    const allTools = [
      ...(c.verification?.verifiedTools || []),
      ...(c.verification?.selfReportedTools || []),
    ];
    allTools.forEach((t) => {
      toolCounts[t] = (toolCounts[t] || 0) + 1;
    });

    c.supportedContentTypes?.forEach((ct) => {
      contentTypeCounts[ct] = (contentTypeCounts[ct] || 0) + 1;
    });

    c.supportedAspectRatios?.forEach((ar) => {
      aspectRatioCounts[ar] = (aspectRatioCounts[ar] || 0) + 1;
    });

    if (c.commercialCapability) {
      commercialCounts[c.commercialCapability] =
        (commercialCounts[c.commercialCapability] || 0) + 1;
    }
  });

  const toOptions = (counts: Record<string, number>): FilterOption[] =>
    Object.entries(counts)
      .map(([value, count]) => ({ label: value, value, count }))
      .sort((a, b) => (b.count || 0) - (a.count || 0));

  return {
    specialties: toOptions(specialtyCounts),
    skills: toOptions(skillCounts),
    tools: toOptions(toolCounts),
    contentTypes: toOptions(contentTypeCounts),
    aspectRatios: toOptions(aspectRatioCounts),
    commercialCapabilities: toOptions(commercialCounts),
  };
}
