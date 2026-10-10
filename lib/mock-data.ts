import { mockCreators, mockPortfolioItems } from './data/creators';
import { computeFacetOptions } from './search-filters';
import { FilterOption } from '@/types';

export { mockCreators, mockPortfolioItems };

const facets = computeFacetOptions(mockCreators);

export const specialtyFilterOptions: FilterOption[] = [
  { label: 'All Specialties', value: 'all' },
  ...facets.specialties,
];

export const toolFilterOptions: FilterOption[] = facets.tools;

export const availabilityFilterOptions: FilterOption[] = [
  { label: 'All Availability', value: 'all' },
  { label: 'Available Now', value: 'immediate', count: mockCreators.filter(c => c.availability === 'immediate').length },
  { label: 'Next 2 Weeks', value: 'within_2_weeks', count: mockCreators.filter(c => c.availability === 'within_2_weeks').length },
  { label: 'Booked Out', value: 'booked', count: mockCreators.filter(c => c.availability === 'booked').length },
];
