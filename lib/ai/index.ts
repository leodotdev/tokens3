export * from './anthropic';

// AI-powered gift recommendation types
export interface PersonProfile {
  id: string;
  name: string;
  relationship?: string;
  age?: number;
  birthday?: string;
  interests?: string[];
  address?: string;
  notes?: string;
  aiContext?: any;
}

export interface GiftRecommendation {
  id: string;
  name: string;
  description: string;
  category: string;
  priceRange: string;
  reasoning: string;
  tags: string[];
  confidence: number;
  urgency?: 'low' | 'medium' | 'high';
  amazonSearchQuery?: string;
  idealFor: string[];
  occasion?: string;
}

export interface GiftContext {
  person: PersonProfile;
  occasion?: string;
  budget?: { min?: number; max?: number };
  daysUntil?: number;
  previousGifts?: string[];
  urgency?: 'low' | 'medium' | 'high';
}

export interface AISearchResult {
  searchTerms: string[];
  categories: string[];
  filters: {
    priceRange?: { min: number; max: number };
    tags?: string[];
    occasions?: string[];
  };
  reasoning: string;
}

// Quality levels for products
export type ProductQuality = 'excellent' | 'good' | 'average' | 'unknown';

// AI-enhanced product metadata
export interface ProductAIData {
  qualityScore: number;
  giftWorthiness: number;
  idealOccasions: string[];
  targetAgeRange?: { min: number; max: number };
  reviewSummary?: string;
  expertRecommendation?: boolean;
  lastAnalyzed: string;
}