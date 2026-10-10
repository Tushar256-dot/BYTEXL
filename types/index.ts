export type AiTool =
  | 'Midjourney v6'
  | 'Runway Gen-3'
  | 'Luma Dream Machine'
  | 'Kling AI'
  | 'ComfyUI'
  | 'Stable Diffusion XL'
  | 'Flux.1'
  | 'ElevenLabs'
  | 'Suno'
  | 'Topaz Video AI'
  | 'DaVinci Resolve'
  | 'After Effects'
  | 'Cinema 4D'
  | 'Blender (NeRF/Gaussian Splatting)';

export type CreatorSpecialty =
  | 'Cinematic Film'
  | 'Hyperreal Commercials'
  | 'Sci-Fi / Worldbuilding'
  | 'Music Visualizer'
  | 'Fashion & Beauty'
  | 'Anime & Stylized 3D'
  | 'Product CGI'
  | 'Documentary & Heritage';

export type ContentType =
  | 'Commercial Spots'
  | 'Brand Teasers'
  | 'Music Videos'
  | 'Social Media (9:16)'
  | 'Concept Art Animatics'
  | 'Product CGI'
  | 'Fashion Editorials';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '2.39:1';

export type CommercialCapability =
  | 'Full Commercial Clearance'
  | 'Editorial & Non-Commercial'
  | 'Experimental / Lab';

export type AvailabilityStatus = 'immediate' | 'within_2_weeks' | 'booked';

export interface CreatorVerification {
  isIdentityVerified: boolean;
  isCommercialClearanceCertified: boolean;
  verifiedDeliveriesCount: number;
  clientRating: number;
  evidenceNote?: string;
  verifiedTools: AiTool[];
  selfReportedTools: AiTool[];
}

export interface PipelineStep {
  stepNumber: number;
  phase: 'Concept & Prompting' | 'Generation' | 'Motion Synthesis' | 'Post & Upscaling';
  tool: AiTool | string;
  technique: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  client?: string;
  category: CreatorSpecialty;
  thumbnailUrl: string;
  videoPreviewUrl?: string;
  aspectRatio: AspectRatio;
  durationSeconds?: number;
  description: string;
  primaryModel: AiTool;
  pipelineSteps: PipelineStep[];
  commercialRightsStatus: 'commercial_cleared' | 'editorial_only' | 'experimental';
  featured: boolean;
  viewCount?: number;
  likesCount?: number;
}

export interface Creator {
  id: string;
  handle: string;
  displayName: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  coverImageUrl?: string;
  location: string;
  timezone: string;
  availability: AvailabilityStatus;
  dayRateUSD: number;
  minimumProjectBudgetUSD: number;
  specialties: CreatorSpecialty[];
  skills: string[];
  supportedContentTypes: ContentType[];
  supportedAspectRatios: AspectRatio[];
  commercialCapability: CommercialCapability;
  verification: CreatorVerification;
  portfolio: PortfolioItem[];
  turnaroundDaysAverage: number;
  isShortlisted?: boolean;
}

export interface CreativeBrief {
  id: string;
  title: string;
  brandName: string;
  brandLogoUrl?: string;
  deliverableType: 'commercial_spot' | 'teaser' | 'music_video' | 'social_campaign' | 'concept_art';
  aspectRatio: AspectRatio;
  targetDurationSeconds: number;
  budgetUSD: { min: number; max: number };
  deadline: string;
  urgency: 'urgent' | 'standard' | 'flexible';
  requiredTools: AiTool[];
  aestheticKeywords: string[];
  requiredVerification: 'commercial_cleared_only' | 'identity_verified' | 'open_to_all';
  narrativeDescription: string;
  createdAt: string;
  status: 'draft' | 'open' | 'matched' | 'in_production' | 'completed';
}

export interface MatchScoreFactor {
  dimension: 'Toolchain' | 'Budget Alignment' | 'Aesthetic / Style' | 'Verification & Clearance' | 'Turnaround';
  weight: number;
  score: number;
  rationale: string;
}

export interface BriefMatchResult {
  briefId: string;
  creatorId: string;
  overallScore: number;
  breakdown: MatchScoreFactor[];
  highlightBadge?: 'Top Tool Match' | 'Budget Friendly' | 'Verified Specialist';
}

export type EngagementStage = 'shortlisted' | 'invited' | 'in_discussion' | 'in_production' | 'delivered';

export interface ProjectEngagement {
  id: string;
  briefId: string;
  briefTitle: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  stage: EngagementStage;
  agreedBudgetUSD?: number;
  lastUpdated: string;
  notes?: string;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface DiscoveryFilterState {
  search: string;
  specialties: CreatorSpecialty[];
  skills: string[];
  tools: AiTool[];
  contentTypes: ContentType[];
  aspectRatios: AspectRatio[];
  commercialCapabilities: CommercialCapability[];
  sort: DiscoverySortOption;
}

export type DiscoverySortOption =
  | 'relevance'
  | 'portfolio-count'
  | 'rate-asc'
  | 'rate-desc'
  | 'rating-desc';
