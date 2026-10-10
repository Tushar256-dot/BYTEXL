import { mockCreators } from '@/lib/data/creators';
import {
  filterCreators,
  sortCreators,
  computeFacetOptions,
} from '@/lib/search-filters';
import { CreatorSpecialty, AiTool } from '@/types';

console.log('=== RUNNING FRAME PHASE 2 DISCOVERY ACCEPTANCE TESTS ===\n');

let allPassed = true;
function assert(testName: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
  } else {
    console.error(`✗ FAIL: ${testName} - ${detail || ''}`);
    allPassed = false;
  }
}

// 1. Seed data creator count
assert(
  'Seed data has at least 8 distinct fictional AI creators',
  mockCreators.length >= 8,
  `Found ${mockCreators.length} creators`
);

// 2. Search by creator name
const nameResults = filterCreators(mockCreators, { search: 'Elena' });
assert(
  'Search by name ("Elena") returns Elena Rostova',
  nameResults.length === 1 && nameResults[0].displayName === 'Elena Rostova',
  `Expected 1 Elena, found: ${nameResults.map((c) => c.displayName).join(', ')}`
);

// 3. Search by tool in text search
const toolTextResults = filterCreators(mockCreators, { search: 'Runway' });
assert(
  'Search by tool ("Runway") returns Runway Gen-3 creators',
  toolTextResults.length > 0 &&
    toolTextResults.every((c) =>
      [...c.verification.verifiedTools, ...c.verification.selfReportedTools].some((t) =>
        t.toLowerCase().includes('runway')
      )
    ),
  `Found ${toolTextResults.length} creators`
);

// 4. Two simultaneous filters (Specialty = 'Sci-Fi / Worldbuilding' AND Tool = 'ComfyUI')
const dualFilterResults = filterCreators(mockCreators, {
  specialties: ['Sci-Fi / Worldbuilding' as CreatorSpecialty],
  tools: ['ComfyUI' as AiTool],
});
assert(
  'Two simultaneous filters (Sci-Fi + ComfyUI) correctly match',
  dualFilterResults.length >= 1 &&
    dualFilterResults.some((c) => c.displayName === 'Kai Takahashi'),
  `Found: ${dualFilterResults.map((c) => c.displayName).join(', ')}`
);

// 5. Multiple values working correctly (OR within facet)
const multiSpecialtyResults = filterCreators(mockCreators, {
  specialties: [
    'Anime & Stylized 3D' as CreatorSpecialty,
    'Product CGI' as CreatorSpecialty,
  ],
});
assert(
  'Multiple specialty filters correctly return union of creators',
  multiSpecialtyResults.length >= 3 &&
    multiSpecialtyResults.some((c) => c.displayName === 'Mira Solis') &&
    multiSpecialtyResults.some((c) => c.displayName === 'Marcus Sterling'),
  `Found: ${multiSpecialtyResults.map((c) => c.displayName).join(', ')}`
);

// 6. Zero-result filter test
const zeroResults = filterCreators(mockCreators, {
  search: 'NonExistentDirectorQuery12345XYZ',
});
assert(
  'Zero-result search returns empty array and never silently shows unrelated creators',
  zeroResults.length === 0,
  `Found ${zeroResults.length} creators`
);

// 7. Clear filters restores original results
const clearedResults = filterCreators(mockCreators, {});
assert(
  'Clearing filters restores complete seeded directory (all 9 creators)',
  clearedResults.length === mockCreators.length,
  `Expected ${mockCreators.length}, got ${clearedResults.length}`
);

// 8. Sorting: Indicative rate low-to-high
const sortedRateAsc = sortCreators(mockCreators, 'rate-asc');
assert(
  'Sort by rate-asc correctly places lowest day rate first',
  sortedRateAsc[0].dayRateUSD <= sortedRateAsc[1].dayRateUSD &&
    sortedRateAsc[0].displayName === 'Nova Vance',
  `First creator is ${sortedRateAsc[0].displayName} with rate $${sortedRateAsc[0].dayRateUSD}`
);

// 9. Sorting: Indicative rate high-to-low
const sortedRateDesc = sortCreators(mockCreators, 'rate-desc');
assert(
  'Sort by rate-desc correctly places highest day rate first',
  sortedRateDesc[0].dayRateUSD >= sortedRateDesc[1].dayRateUSD &&
    sortedRateDesc[0].displayName === 'Lucian & Maya',
  `First creator is ${sortedRateDesc[0].displayName} with rate $${sortedRateDesc[0].dayRateUSD}`
);

// 10. Facet options computation
const facets = computeFacetOptions(mockCreators);
assert(
  'Dynamic facets computed accurately across tools, specialties, formats, clearance',
  facets.tools.length >= 8 &&
    facets.specialties.length >= 5 &&
    facets.aspectRatios.length >= 4 &&
    facets.commercialCapabilities.length >= 3,
  `Facets summary: ${facets.tools.length} tools, ${facets.specialties.length} specialties, ${facets.aspectRatios.length} aspect ratios`
);

console.log('\n======================================================');
if (allPassed) {
  console.log('ALL PHASE 2 ACCEPTANCE TESTS PASSED SUCCESSFULLY! ✓');
} else {
  console.error('SOME ACCEPTANCE TESTS FAILED. ✗');
  process.exit(1);
}
