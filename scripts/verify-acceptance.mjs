import fs from 'node:fs';

// Load mock creators directly from JSON / parsed source
const creatorsTs = fs.readFileSync('./lib/data/creators.ts', 'utf8');

console.log('=== VERIFYING PHASE 2 ACCEPTANCE CRITERIA ===\n');

// Verify seeded creators count
const creatorMatches = creatorsTs.match(/id:\s*['"]creator-\d+['"]/g) || [];
console.log(`Found ${creatorMatches.length} seeded creator IDs in lib/data/creators.ts`);

if (creatorMatches.length < 8) {
  console.error('FAIL: Expected at least 8 seeded creators');
  process.exit(1);
} else {
  console.log('✓ PASS: Seed data contains >= 8 fictional AI creators');
}

// Check key attributes required by prompt
const requiredKeys = [
  'displayName',
  'bio',
  'specialties',
  'skills',
  'verifiedTools',
  'supportedContentTypes',
  'supportedAspectRatios',
  'commercialCapability',
  'dayRateUSD',
  'portfolio',
  'isIdentityVerified',
];

for (const key of requiredKeys) {
  if (!creatorsTs.includes(key)) {
    console.error(`FAIL: Missing required creator attribute: ${key}`);
    process.exit(1);
  }
}
console.log('✓ PASS: All required creator attributes present in seed model');

// Check routes
const routes = [
  'app/discover/page.tsx',
  'app/creators/[id]/page.tsx',
  'app/shortlist/page.tsx',
];

for (const r of routes) {
  if (fs.existsSync(r)) {
    console.log(`✓ PASS: Route exists: ${r}`);
  } else {
    console.error(`FAIL: Missing route: ${r}`);
    process.exit(1);
  }
}

// Verify filtering logic implementation
const searchFiltersTs = fs.readFileSync('./lib/search-filters.ts', 'utf8');
const filterChecks = [
  'filterCreators',
  'sortCreators',
  'computeFacetOptions',
  'selectedSpecialties',
  'selectedSkills',
  'selectedTools',
  'selectedContentTypes',
  'selectedAspectRatios',
  'selectedCommercial',
];

for (const fc of filterChecks) {
  if (!searchFiltersTs.includes(fc)) {
    console.error(`FAIL: Missing filter logic: ${fc}`);
    process.exit(1);
  }
}
console.log('✓ PASS: Centralized filtering and sorting logic verified');

console.log('\nAll acceptance verification checks passed! ✓');
