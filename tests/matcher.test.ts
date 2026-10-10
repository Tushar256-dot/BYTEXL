import { mockCreators } from '@/lib/data/creators';
import { matchCreatorToBrief, matchCreatorsToBrief } from '@/lib/matcher';
import { CreativeBrief, Creator } from '@/types';

console.log('=== RUNNING KAMPUS.VC MATCHING ENGINE TEST SUITE ===\n');

let allPassed = true;
function assert(testName: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
  } else {
    console.error(`✗ FAIL: ${testName} - ${detail || ''}`);
    allPassed = false;
  }
}

// Base mock brief
const sampleBrief: CreativeBrief = {
  id: 'brief-test-1',
  title: 'Luxury Perfume Commercial Spec',
  brandName: 'Maison Noir',
  deliverableType: 'commercial_spot',
  aspectRatio: '16:9',
  targetDurationSeconds: 30,
  budgetUSD: { min: 3000, max: 7500 },
  deadline: 'Nov 12, 2026',
  urgency: 'standard',
  requiredTools: ['Runway Gen-3', 'ComfyUI'],
  aestheticKeywords: ['Hyperreal Commercials', 'Fluid Dynamics Simulation'],
  requiredVerification: 'commercial_cleared_only',
  narrativeDescription: 'High-end luxury fragrance commercial.',
  createdAt: '2026-10-10',
  status: 'open',
};

// 1. Perfect Match Test
const perfectCreator: Creator = {
  id: 'creator-perfect',
  handle: 'perfect_dir',
  displayName: 'Perfect Director',
  tagline: 'Master director',
  bio: 'Expert in Hyperreal Commercials and Fluid Dynamics Simulation.',
  avatarUrl: 'https://example.com/avatar.jpg',
  availability: 'immediate',
  dayRateUSD: 1400,
  minimumProjectBudgetUSD: 5000,
  turnaroundDaysAverage: 4,
  specialties: ['Hyperreal Commercials'],
  skills: ['Fluid Dynamics Simulation'],
  supportedContentTypes: ['Commercial Spots'],
  supportedAspectRatios: ['16:9'],
  commercialCapability: 'Full Commercial Clearance',
  verification: {
    isIdentityVerified: true,
    isCommercialClearanceCertified: true,
    verifiedDeliveriesCount: 15,
    clientRating: 4.95,
    verifiedTools: ['Runway Gen-3', 'ComfyUI'],
    selfReportedTools: [],
  },
  portfolio: [],
};

const perfectResult = matchCreatorToBrief(sampleBrief, perfectCreator);
assert(
  'Perfect Match scores 100 and is eligible',
  perfectResult.isEligible && perfectResult.overallScore === 100,
  `Score: ${perfectResult.overallScore}, Eligible: ${perfectResult.isEligible}`
);

// 2. Verified vs Self-Reported Tools Distinction
const selfReportedCreator: Creator = {
  ...perfectCreator,
  id: 'creator-self-reported',
  verification: {
    ...perfectCreator.verification,
    verifiedTools: [],
    selfReportedTools: ['Runway Gen-3', 'ComfyUI'],
  },
};
const selfReportedResult = matchCreatorToBrief(sampleBrief, selfReportedCreator);
const toolFactor = selfReportedResult.breakdown.find((f) => f.dimension === 'Toolchain Alignment');
assert(
  'Self-reported tools receive 50% credit compared to verified tools',
  toolFactor?.score === 50 && selfReportedResult.overallScore < perfectResult.overallScore,
  `Tool factor score: ${toolFactor?.score}, Rationale: ${toolFactor?.rationale}`
);

// 3. Hard Commercial Clearance Disqualification
const nonClearedCreator: Creator = {
  ...perfectCreator,
  id: 'creator-editorial',
  commercialCapability: 'Editorial & Non-Commercial',
  verification: {
    ...perfectCreator.verification,
    isCommercialClearanceCertified: false,
  },
};
const nonClearedResult = matchCreatorToBrief(sampleBrief, nonClearedCreator);
assert(
  'Creator lacking commercial clearance is marked ineligible when required',
  !nonClearedResult.isEligible && Boolean(nonClearedResult.disqualificationReason),
  `Reason: ${nonClearedResult.disqualificationReason}`
);

// 4. Hard Identity Verification Disqualification
const identityBrief: CreativeBrief = {
  ...sampleBrief,
  requiredVerification: 'identity_verified',
};
const unverifiedCreator: Creator = {
  ...perfectCreator,
  id: 'creator-unverified-id',
  verification: {
    ...perfectCreator.verification,
    isIdentityVerified: false,
  },
};
const unverifiedResult = matchCreatorToBrief(identityBrief, unverifiedCreator);
assert(
  'Creator with unverified identity is marked ineligible when identity verification is required',
  !unverifiedResult.isEligible && Boolean(unverifiedResult.disqualificationReason),
  `Reason: ${unverifiedResult.disqualificationReason}`
);

// 5. Safe Missing Data Handling
const missingDataCreator: Creator = {
  id: 'creator-missing-data',
  handle: 'missing_data',
  displayName: 'Missing Data Director',
  tagline: '',
  bio: '',
  avatarUrl: '',
  specialties: ['Hyperreal Commercials'],
  skills: [],
  commercialCapability: 'Experimental / Lab',
  verification: {
    isIdentityVerified: false,
    isCommercialClearanceCertified: false,
    verifiedDeliveriesCount: 0,
    clientRating: 4.0,
    verifiedTools: [],
    selfReportedTools: [],
  },
  portfolio: [],
};
const missingDataResult = matchCreatorToBrief(sampleBrief, missingDataCreator);
const budgetFactor = missingDataResult.breakdown.find((f) => f.dimension === 'Budget Feasibility');
const availFactor = missingDataResult.breakdown.find((f) => f.dimension === 'Deadline & Availability');
assert(
  'Missing budget and availability data score 0 with explicit explanatory rationales',
  budgetFactor?.score === 0 && availFactor?.score === 0,
  `Budget rationale: ${budgetFactor?.rationale}; Avail rationale: ${availFactor?.rationale}`
);

// 6. Unspecified Brief Requirements Handling
const unspecifiedBrief: CreativeBrief = {
  ...sampleBrief,
  requiredTools: [],
  aestheticKeywords: [],
  requiredVerification: 'open_to_all',
  deliverableType: 'commercial_spot',
  aspectRatio: '16:9',
  budgetUSD: { min: 0, max: 0 },
};
const unspecifiedResult = matchCreatorToBrief(unspecifiedBrief, perfectCreator);
assert(
  'Unspecified brief requirements do not penalize creators',
  unspecifiedResult.overallScore === 100,
  `Overall score: ${unspecifiedResult.overallScore}`
);

// 7. Budget & Deadline Constraints Test
const expensiveCreator: Creator = {
  ...perfectCreator,
  id: 'creator-expensive',
  minimumProjectBudgetUSD: 20000,
  availability: 'booked',
};
const expensiveResult = matchCreatorToBrief(sampleBrief, expensiveCreator);
const expBudgetFactor = expensiveResult.breakdown.find((f) => f.dimension === 'Budget Feasibility');
const expAvailFactor = expensiveResult.breakdown.find((f) => f.dimension === 'Deadline & Availability');
assert(
  'Incompatible budget and booked status correctly penalize numeric scores',
  expBudgetFactor?.score === 0 && expAvailFactor?.score === 0,
  `Budget score: ${expBudgetFactor?.score}, Avail score: ${expAvailFactor?.score}`
);

// 8. Empty Creator List Handling
const emptyResults = matchCreatorsToBrief(sampleBrief, []);
assert(
  'Empty creator list returns empty results array',
  Array.isArray(emptyResults) && emptyResults.length === 0
);

// 9. Stable Deterministic Ordering
const multiMatch = matchCreatorsToBrief(sampleBrief, mockCreators);
const eligibleList = multiMatch.filter((r) => r.isEligible);
const ineligibleList = multiMatch.filter((r) => !r.isEligible);

const isEligibleSorted = eligibleList.every((r, idx) => {
  if (idx === 0) return true;
  return eligibleList[idx - 1].overallScore >= r.overallScore;
});

assert(
  'Results sort eligible creators first, followed by score descending with tie-breaking',
  multiMatch.length === mockCreators.length &&
    multiMatch[0].isEligible &&
    isEligibleSorted &&
    ineligibleList.length > 0,
  `Top match: ${multiMatch[0].creator?.displayName} (${multiMatch[0].overallScore} pts). Ineligible count: ${ineligibleList.length}`
);

// 10. Score Boundaries Clamping (0-100)
const allScoresValid = multiMatch.every(
  (r) => r.overallScore >= 0 && r.overallScore <= 100 && Number.isInteger(r.overallScore)
);
assert('All match scores are integers clamped between 0 and 100', allScoresValid);

console.log('\n======================================================');
if (allPassed) {
  console.log('ALL MATCHING ENGINE TESTS PASSED! ✓');
} else {
  console.error('MATCHING ENGINE TESTS FAILED ✗');
  process.exit(1);
}
