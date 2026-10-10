import {
  CreativeBrief,
  Creator,
  BriefMatchResult,
  MatchScoreFactor,
  AiTool,
} from '@/types';

/**
 * Helper to normalize string for case-insensitive matching
 */
function normalize(str: string): string {
  return (str || '').trim().toLowerCase();
}

/**
 * 1. Toolchain Alignment Factor (Weight: 25)
 * Distinguishes verified tool matches (100% credit) from self-reported matches (50% credit).
 * Unspecified brief requirements receive a 100 score with explicit neutral rationale.
 */
function evaluateToolchain(
  brief: CreativeBrief,
  creator: Creator
): MatchScoreFactor {
  const weight = 25;
  const required = brief.requiredTools || [];

  if (required.length === 0) {
    return {
      dimension: 'Toolchain Alignment',
      weight,
      score: 100,
      rationale: 'No specific AI tools required by brief.',
    };
  }

  const verified = (creator.verification?.verifiedTools || []).map((t) => ({
    original: t,
    norm: normalize(t),
  }));
  const selfReported = (creator.verification?.selfReportedTools || []).map((t) => ({
    original: t,
    norm: normalize(t),
  }));

  let totalCredit = 0;
  const matchedVerified: string[] = [];
  const matchedSelfReported: string[] = [];
  const missingTools: string[] = [];

  required.forEach((reqTool) => {
    const reqNorm = normalize(reqTool);
    const verMatch = verified.find((v) => v.norm === reqNorm);
    if (verMatch) {
      totalCredit += 1.0;
      matchedVerified.push(verMatch.original);
      return;
    }

    const selfMatch = selfReported.find((s) => s.norm === reqNorm);
    if (selfMatch) {
      totalCredit += 0.5;
      matchedSelfReported.push(selfMatch.original);
      return;
    }

    missingTools.push(reqTool);
  });

  const score = Math.round((totalCredit / required.length) * 100);

  const parts: string[] = [];
  parts.push(`${matchedVerified.length + matchedSelfReported.length} of ${required.length} required tools matched`);
  const details: string[] = [];
  if (matchedVerified.length > 0) {
    details.push(`${matchedVerified.length} verified: ${matchedVerified.join(', ')}`);
  }
  if (matchedSelfReported.length > 0) {
    details.push(`${matchedSelfReported.length} self-reported: ${matchedSelfReported.join(', ')}`);
  }
  if (missingTools.length > 0) {
    details.push(`${missingTools.length} missing: ${missingTools.join(', ')}`);
  }

  const rationale = `${parts.join('')} (${details.join('; ')}).`;

  return {
    dimension: 'Toolchain Alignment',
    weight,
    score: Math.min(100, Math.max(0, score)),
    rationale,
  };
}

/**
 * 2. Specialization & Skills Factor (Weight: 20)
 * Matches brief keywords and deliverable type against creator specialties and skills.
 */
function evaluateSpecializationAndSkills(
  brief: CreativeBrief,
  creator: Creator
): MatchScoreFactor {
  const weight = 20;

  // Build target keywords from aestheticKeywords
  const keywords: string[] = [...(brief.aestheticKeywords || [])];

  if (keywords.length === 0) {
    return {
      dimension: 'Specialization & Skills',
      weight,
      score: 100,
      rationale: 'No specific aesthetic keywords specified in brief.',
    };
  }

  const creatorTerms = [
    ...(creator.specialties || []),
    ...(creator.skills || []),
    creator.tagline || '',
    creator.bio || '',
  ].map(normalize);

  let matchedCount = 0;
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  keywords.forEach((kw) => {
    const kwNorm = normalize(kw);
    const found = creatorTerms.some((term) => term.includes(kwNorm) || kwNorm.includes(term));
    if (found) {
      matchedCount++;
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const score = Math.round((matchedCount / keywords.length) * 100);
  let rationale = `Matched ${matchedCount} of ${keywords.length} brief specialization keywords`;
  if (matchedKeywords.length > 0) {
    rationale += ` ('${matchedKeywords.join("', '")}')`;
  }
  rationale += '.';

  return {
    dimension: 'Specialization & Skills',
    weight,
    score: Math.min(100, Math.max(0, score)),
    rationale,
  };
}

/**
 * 3. Verification & Clearance Factor (Weight: 20)
 * Evaluates verified delivery track record, commercial clearance, and identity verification.
 */
function evaluateVerificationAndClearance(
  brief: CreativeBrief,
  creator: Creator
): MatchScoreFactor {
  const weight = 20;
  const ver = creator.verification;

  if (!ver) {
    return {
      dimension: 'Verification & Clearance',
      weight,
      score: 0,
      rationale: 'Creator verification data unavailable.',
    };
  }

  let score = 0;
  const claims: string[] = [];

  // Commercial clearance certified (50 pts)
  if (ver.isCommercialClearanceCertified && creator.commercialCapability === 'Full Commercial Clearance') {
    score += 50;
    claims.push('Certified Full Commercial Clearance');
  } else if (creator.commercialCapability === 'Full Commercial Clearance') {
    score += 30;
    claims.push('Full Commercial Capability (Pending Certificate)');
  } else {
    claims.push(`Limited Clearance (${creator.commercialCapability || 'Unspecified'})`);
  }

  // Identity verified (30 pts)
  if (ver.isIdentityVerified) {
    score += 30;
    claims.push('Verified Identity');
  } else {
    claims.push('Unverified Identity');
  }

  // Delivery track record & client rating (20 pts)
  if ((ver.verifiedDeliveriesCount || 0) >= 5 && (ver.clientRating || 0) >= 4.8) {
    score += 20;
    claims.push(`Strong Track Record (${ver.verifiedDeliveriesCount} deliveries, ${ver.clientRating} rating)`);
  } else if ((ver.verifiedDeliveriesCount || 0) > 0) {
    score += 10;
    claims.push(`${ver.verifiedDeliveriesCount} verified deliveries`);
  }

  const rationale = claims.join('; ') + '.';

  return {
    dimension: 'Verification & Clearance',
    weight,
    score: Math.min(100, Math.max(0, score)),
    rationale,
  };
}

/**
 * 4. Content & Format Compatibility Factor (Weight: 15)
 * Checks supported content types and supported aspect ratios against brief.
 * Does not assume missing data means compatible.
 */
function evaluateContentAndFormat(
  brief: CreativeBrief,
  creator: Creator
): MatchScoreFactor {
  const weight = 15;
  let matches = 0;
  let totalChecks = 0;
  const details: string[] = [];

  // Check Aspect Ratio
  if (brief.aspectRatio) {
    totalChecks++;
    if (!creator.supportedAspectRatios) {
      details.push(`Aspect ratio data missing (requested ${brief.aspectRatio})`);
    } else if (creator.supportedAspectRatios.includes(brief.aspectRatio)) {
      matches++;
      details.push(`Supports requested ${brief.aspectRatio} aspect ratio`);
    } else {
      details.push(`Does not list ${brief.aspectRatio} aspect ratio`);
    }
  }

  // Check Deliverable / Content Type
  if (brief.deliverableType) {
    totalChecks++;
    if (!creator.supportedContentTypes) {
      details.push(`Content type data missing (requested ${brief.deliverableType})`);
    } else {
      const delNorm = normalize(brief.deliverableType.replace(/_/g, ' '));
      const hasContentMatch = creator.supportedContentTypes.some((ct) =>
        normalize(ct).includes(delNorm) || delNorm.includes(normalize(ct))
      );

      if (hasContentMatch) {
        matches++;
        details.push(`Supports deliverable format`);
      } else {
        details.push(`Deliverable type '${brief.deliverableType}' not in supported content list`);
      }
    }
  }

  if (totalChecks === 0) {
    return {
      dimension: 'Content & Format',
      weight,
      score: 100,
      rationale: 'No specific content type or aspect ratio specified in brief.',
    };
  }

  const score = Math.round((matches / totalChecks) * 100);
  const rationale = details.join('; ') + '.';

  return {
    dimension: 'Content & Format',
    weight,
    score: Math.min(100, Math.max(0, score)),
    rationale,
  };
}

/**
 * 5. Budget Feasibility Factor (Weight: 10)
 * Compares brief project budget max/min with minimumProjectBudgetUSD when available.
 * If dayRateUSD and turnaroundDaysAverage are available, calculates total project cost.
 * Explains when data is insufficient rather than making assumptions.
 */
function evaluateBudgetFeasibility(
  brief: CreativeBrief,
  creator: Creator
): MatchScoreFactor {
  const weight = 10;
  const budgetMax = brief.budgetUSD?.max || 0;
  const budgetMin = brief.budgetUSD?.min || 0;

  if (budgetMax === 0 && budgetMin === 0) {
    return {
      dimension: 'Budget Feasibility',
      weight,
      score: 100,
      rationale: 'No budget constraints specified in brief.',
    };
  }

  const minProjectBudget = creator.minimumProjectBudgetUSD;
  const dayRate = creator.dayRateUSD;
  const avgDays = creator.turnaroundDaysAverage;

  if (minProjectBudget !== undefined && minProjectBudget !== null) {
    if (minProjectBudget <= budgetMax) {
      let rationale = `Creator minimum project budget ($${minProjectBudget.toLocaleString()}) fits brief budget max ($${budgetMax.toLocaleString()})`;
      if (dayRate && avgDays) {
        const estimatedTotal = dayRate * avgDays;
        rationale += ` (Indicative: $${dayRate.toLocaleString()}/day over ~${avgDays} days = $${estimatedTotal.toLocaleString()})`;
      }
      rationale += '.';
      return {
        dimension: 'Budget Feasibility',
        weight,
        score: 100,
        rationale,
      };
    } else {
      const overpct = Math.round(((minProjectBudget - budgetMax) / budgetMax) * 100);
      const score = Math.max(0, 100 - overpct);
      return {
        dimension: 'Budget Feasibility',
        weight,
        score,
        rationale: `Creator minimum project budget ($${minProjectBudget.toLocaleString()}) exceeds brief max ($${budgetMax.toLocaleString()}) by ${overpct}%.`,
      };
    }
  }

  // Fallback to dayRate * avgDays estimation
  if (dayRate && avgDays) {
    const estimatedTotal = dayRate * avgDays;
    if (estimatedTotal <= budgetMax) {
      return {
        dimension: 'Budget Feasibility',
        weight,
        score: 100,
        rationale: `Estimated project cost ($${estimatedTotal.toLocaleString()} based on $${dayRate}/day x ${avgDays} days) fits brief budget max ($${budgetMax.toLocaleString()}).`,
      };
    } else {
      const overpct = Math.round(((estimatedTotal - budgetMax) / budgetMax) * 100);
      const score = Math.max(0, 100 - overpct);
      return {
        dimension: 'Budget Feasibility',
        weight,
        score,
        rationale: `Estimated total ($${estimatedTotal.toLocaleString()}) exceeds brief budget max ($${budgetMax.toLocaleString()}) by ${overpct}%.`,
      };
    }
  }

  // Insufficient data
  return {
    dimension: 'Budget Feasibility',
    weight,
    score: 0,
    rationale: 'Total cost cannot be reliably estimated: creator minimum budget and rate data missing.',
  };
}

/**
 * 6. Deadline & Availability Feasibility Factor (Weight: 10)
 * Evaluates creator availability and turnaround days against brief requirement.
 * Never assumes missing availability data means available.
 */
function evaluateDeadlineAndAvailability(
  brief: CreativeBrief,
  creator: Creator
): MatchScoreFactor {
  const weight = 10;
  const avail = creator.availability;
  const turnaround = creator.turnaroundDaysAverage;

  if (!avail) {
    return {
      dimension: 'Deadline & Availability',
      weight,
      score: 0,
      rationale: 'Creator availability data unavailable; cannot confirm turnaround.',
    };
  }

  if (avail === 'booked') {
    return {
      dimension: 'Deadline & Availability',
      weight,
      score: 0,
      rationale: 'Creator is currently booked out for production.',
    };
  }

  let score = avail === 'immediate' ? 100 : 70;
  let statusText = avail === 'immediate' ? 'Available immediately' : 'Available within 2 weeks';

  if (turnaround !== undefined && turnaround !== null) {
    statusText += ` with ~${turnaround}-day average turnaround`;
  }

  return {
    dimension: 'Deadline & Availability',
    weight,
    score,
    rationale: `${statusText}.`,
  };
}

/**
 * Evaluates hard eligibility rules independently of numeric score.
 */
function checkEligibility(
  brief: CreativeBrief,
  creator: Creator
): { isEligible: boolean; disqualificationReason?: string } {
  const reqVer = brief.requiredVerification;

  if (reqVer === 'commercial_cleared_only') {
    const isCert = creator.verification?.isCommercialClearanceCertified === true;
    const isFullCap = creator.commercialCapability === 'Full Commercial Clearance';

    if (!isCert || !isFullCap) {
      return {
        isEligible: false,
        disqualificationReason: `Brief requires certified Full Commercial Clearance, but creator has ${
          creator.commercialCapability || 'unverified clearance'
        }${!isCert ? ' (uncertified)' : ''}.`,
      };
    }
  }

  if (reqVer === 'identity_verified') {
    const isIdVer = creator.verification?.isIdentityVerified === true;
    if (!isIdVer) {
      return {
        isEligible: false,
        disqualificationReason: 'Brief requires verified identity, but creator identity is unverified.',
      };
    }
  }

  return { isEligible: true };
}

/**
 * Generates evidence-backed highlight badges.
 * Never invents credentials or certifications.
 */
function generateHighlights(
  brief: CreativeBrief,
  creator: Creator,
  factors: MatchScoreFactor[]
): string[] {
  const highlights: string[] = [];

  // Verified tool match highlight
  const requiredTools = brief.requiredTools || [];
  const verifiedTools = creator.verification?.verifiedTools || [];
  const hasVerifiedToolMatch = requiredTools.some((reqTool) =>
    verifiedTools.some((verTool) => normalize(verTool) === normalize(reqTool))
  );

  if (hasVerifiedToolMatch) {
    highlights.push('Verified Tool Match');
  }

  // Strong Specialization Fit
  const specFactor = factors.find((f) => f.dimension === 'Specialization & Skills');
  if (specFactor && specFactor.score >= 80) {
    highlights.push('Strong Specialization Fit');
  }

  // Commercial Clearance Confirmed
  if (
    creator.verification?.isCommercialClearanceCertified &&
    creator.commercialCapability === 'Full Commercial Clearance'
  ) {
    highlights.push('Commercial Clearance Confirmed');
  }

  // Immediate Availability
  if (creator.availability === 'immediate') {
    highlights.push('Immediate Availability');
  }

  return highlights;
}

/**
 * Pure deterministic function to match a single creator against a creative brief.
 */
export function matchCreatorToBrief(
  brief: CreativeBrief,
  creator: Creator
): BriefMatchResult {
  const factors: MatchScoreFactor[] = [
    evaluateToolchain(brief, creator),
    evaluateSpecializationAndSkills(brief, creator),
    evaluateVerificationAndClearance(brief, creator),
    evaluateContentAndFormat(brief, creator),
    evaluateBudgetFeasibility(brief, creator),
    evaluateDeadlineAndAvailability(brief, creator),
  ];

  // Weighted average calculation (sum of weights = 100)
  const weightedSum = factors.reduce((sum, f) => sum + f.score * (f.weight / 100), 0);
  const overallScore = Math.min(100, Math.max(0, Math.round(weightedSum)));

  // Hard eligibility check
  const { isEligible, disqualificationReason } = checkEligibility(brief, creator);

  // Evidence-backed highlights
  const highlights = generateHighlights(brief, creator, factors);
  const highlightBadge = highlights.length > 0 ? highlights[0] : undefined;

  return {
    briefId: brief.id,
    creatorId: creator.id,
    creator,
    overallScore,
    isEligible,
    disqualificationReason,
    breakdown: factors,
    highlights,
    highlightBadge,
  };
}

/**
 * Deterministically matches and ranks a list of creators against a creative brief.
 * Sorts eligible creators first by score descending, followed by ineligible creators,
 * with deterministic tie-breaking by creator ID.
 */
export function matchCreatorsToBrief(
  brief: CreativeBrief,
  creators: Creator[]
): BriefMatchResult[] {
  if (!creators || creators.length === 0) {
    return [];
  }

  const results = creators.map((creator) => matchCreatorToBrief(brief, creator));

  return results.sort((a, b) => {
    // 1. Eligible creators first
    if (a.isEligible !== b.isEligible) {
      return a.isEligible ? -1 : 1;
    }

    // 2. Score descending
    if (b.overallScore !== a.overallScore) {
      return b.overallScore - a.overallScore;
    }

    // 3. Deterministic tie-breaker by creator ID
    return a.creatorId.localeCompare(b.creatorId);
  });
}
