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

export type VerificationStateScope =
  | 'identity_verified'
  | 'evidence_reviewed'
  | 'creator_reported'
  | 'verification_pending';

export interface CreatorVerification {
  isIdentityVerified: boolean;
  isCommercialClearanceCertified: boolean;
  verifiedDeliveriesCount: number;
  clientRating: number;
  evidenceNote?: string;
  verifiedTools: AiTool[];
  selfReportedTools: AiTool[];
}

export type WorkflowStageName =
  | '1. Concept & Reference Development'
  | '2. Image & Video Generation'
  | '3. Refinement & Consistency Work'
  | '4. Editing & Final Delivery';

export interface WorkflowStage {
  stageNumber: number;
  stageName: WorkflowStageName;
  toolsUsed: (AiTool | string)[];
  methodology: string;
  evidenceType: 'reviewed_node_graph' | 'generation_logs' | 'creator_reported';
}

export interface PipelineStep {
  stepNumber: number;
  phase: 'Concept & Prompting' | 'Generation' | 'Motion Synthesis' | 'Post & Upscaling' | string;
  tool: AiTool | string;
  technique: string;
}

export type ItemVerificationStatus = 'evidence_reviewed' | 'creator_reported' | 'verification_pending';

export interface PortfolioItem {
  id: string;
  title: string;
  client?: string;
  category: CreatorSpecialty;
  thumbnailUrl: string;
  videoPreviewUrl?: string;
  aspectRatio: AspectRatio;
  outputFormat?: string; // e.g. "4K 60fps ProRes 4444"
  durationSeconds?: number;
  description: string;
  primaryModel: AiTool;
  toolsUsed?: (AiTool | string)[];
  skillsDemonstrated?: string[];
  pipelineSteps: PipelineStep[];
  workflowStages?: WorkflowStage[];
  commercialRightsStatus: 'commercial_cleared' | 'editorial_only' | 'experimental';
  licensingDetails?: string;
  verificationStatus?: ItemVerificationStatus;
  verificationEvidence?: string;
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
  location?: string;
  timezone?: string;
  availability?: AvailabilityStatus;
  dayRateUSD?: number;
  minimumProjectBudgetUSD?: number;
  specialties: CreatorSpecialty[];
  skills: string[];
  supportedContentTypes?: ContentType[];
  supportedAspectRatios?: AspectRatio[];
  commercialCapability: CommercialCapability;
  verification: CreatorVerification;
  portfolio: PortfolioItem[];
  turnaroundDaysAverage?: number;
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

export type MatchDimension =
  | 'Toolchain Alignment'
  | 'Specialization & Skills'
  | 'Verification & Clearance'
  | 'Content & Format'
  | 'Budget Feasibility'
  | 'Deadline & Availability'
  | 'Toolchain'
  | 'Budget Alignment'
  | 'Aesthetic / Style'
  | 'Turnaround';

export interface MatchScoreFactor {
  dimension: MatchDimension;
  weight: number;
  score: number;
  rationale: string;
}

export interface BriefMatchResult {
  briefId: string;
  creatorId: string;
  creator?: Creator;
  overallScore: number;
  isEligible: boolean;
  disqualificationReason?: string;
  breakdown: MatchScoreFactor[];
  highlights?: string[];
  highlightBadge?: string;
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
