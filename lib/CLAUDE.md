# Lib Directory - AI-Enhanced Core Utilities

Core utilities and configuration for tokens3's AI-first architecture.

## Files
- `supabase.ts` - Supabase client configuration with AI-ready database types
- `ai/anthropic.ts` - **Anthropic Claude integration** for person parsing and gift suggestions
- `queries.ts` - Type-safe database queries for people, dates, and products
- `animations.ts` - Reanimated shared values and animation utilities
- `utils.ts` - General utility functions
- `constants.ts` - App constants and configuration

## AI Integration (Anthropic Claude)

### Person Parsing
- **Natural Language Input**: "Add my mom Mary, 68, loves gardening and cooking"
- **Structured Output**: Extracts name, relationship, age, interests, birthday
- **Confidence Scoring**: AI provides reliability assessment of parsed data

### Gift Recommendations
- **Context-Aware**: Analyzes person profile, relationship, and occasion
- **Wirecutter-Quality**: Focuses on well-reviewed, high-quality products
- **Anti-Repetition**: Filters out previously given gifts
- **Budget-Conscious**: Respects price constraints and preferences

### Search Enhancement
- **Query Expansion**: "coffee" becomes "espresso machine, french press, specialty coffee beans"
- **Smart Filtering**: AI suggests relevant categories and price ranges
- **Personalization**: Considers user's past searches and preferences

## Database Schema (AI-Ready)

### People Management
```typescript
interface Person {
  id: string;
  user_id: string;
  name: string;
  relationship?: string;
  age?: number;
  birthday?: string;
  interests?: string[];
  address?: string;
  notes?: string;
  ai_context?: {
    raw_input: string;
    parsed_data: any;
    confidence: number;
  };
}
```

### Enhanced Products
- `is_public` - Curated vs user-added products
- `tags` - AI-generated searchable keywords
- `category` - Smart categorization for filtering

## Key Features
- Type-safe Supabase client with generated types
- AI-powered natural language processing
- Reusable animation presets following Family Values fluidity
- Utility functions for common operations
- Environment configuration management

## Architecture Notes
- All database operations go through typed Supabase client
- AI operations are centralized in `ai/anthropic.ts`
- Animation utilities provide consistent motion language
- Utils follow functional programming patterns
- Constants enable easy theming and configuration changes

---
*Updated 2025-01-12 - AI-Enhanced Core Architecture*