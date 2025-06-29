import { Platform } from 'react-native';

const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnthropicResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  id: string;
  model: string;
  role: 'assistant';
  stop_reason: string;
  stop_sequence: null;
  type: 'message';
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class AnthropicAI {
  private apiKey: string;

  constructor() {
    if (!ANTHROPIC_API_KEY) {
      throw new Error('EXPO_PUBLIC_ANTHROPIC_API_KEY is not set');
    }
    this.apiKey = ANTHROPIC_API_KEY;
  }

  async chat(messages: AnthropicMessage[], options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }): Promise<string> {
    const {
      model = 'claude-3-sonnet-20240229',
      maxTokens = 1000,
      temperature = 0.7,
      systemPrompt
    } = options || {};

    try {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          temperature,
          system: systemPrompt,
          messages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Anthropic API error: ${response.status} - ${errorData}`);
      }

      const data: AnthropicResponse = await response.json();
      return data.content[0]?.text || '';
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw error;
    }
  }

  // Parse person from natural language
  async parsePerson(input: string): Promise<{
    name: string;
    relationship?: string;
    age?: number;
    birthday?: string;
    interests?: string[];
    address?: string;
    notes?: string;
    confidence: number;
  }> {
    const systemPrompt = `You are an AI assistant that parses natural language descriptions of people into structured data for a gift-giving app.

Extract the following information from the user's input:
- name (required)
- relationship (mother, father, friend, partner, etc.)
- age (if mentioned)
- birthday (convert to YYYY-MM-DD format if possible)
- interests (array of specific interests, hobbies, activities)
- address (if mentioned)
- notes (any other relevant context)

Return ONLY a valid JSON object with these fields. If information isn't provided, omit the field. Include a confidence score (0-1) based on how clear the information is.

Examples:
Input: "Add my mom Mary, 68 years old, born June 5th, loves gardening and cooking"
Output: {"name": "Mary", "relationship": "mother", "age": 68, "birthday": "2024-06-05", "interests": ["gardening", "cooking"], "confidence": 0.9}

Input: "My friend John who likes tech and gaming"
Output: {"name": "John", "relationship": "friend", "interests": ["technology", "gaming"], "confidence": 0.8}`;

    const response = await this.chat([
      { role: 'user', content: input }
    ], {
      systemPrompt,
      temperature: 0.3,
      maxTokens: 500
    });

    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse person JSON:', error);
      throw new Error('Failed to parse person information');
    }
  }

  // Generate gift recommendations
  async recommendGifts(context: {
    person: {
      name: string;
      relationship?: string;
      age?: number;
      interests?: string[];
    };
    occasion?: string;
    budget?: { min?: number; max?: number };
    previousGifts?: string[];
    daysUntil?: number;
  }): Promise<{
    recommendations: Array<{
      category: string;
      items: Array<{
        name: string;
        description: string;
        priceRange: string;
        reasoning: string;
        tags: string[];
        urgency?: 'low' | 'medium' | 'high';
      }>;
    }>;
    reasoning: string;
  }> {
    const { person, occasion, budget, previousGifts, daysUntil } = context;

    const systemPrompt = `You are a gift recommendation expert with deep knowledge of high-quality, well-reviewed products from sources like Wirecutter, The Spruce, and other premium review sites.

Recommend thoughtful, high-quality gifts based on:
1. The person's interests and demographic
2. The occasion and relationship
3. Budget constraints
4. Time until the event
5. Previously given gifts (to avoid duplicates)

Focus on:
- Products that have received excellent reviews from trusted sources
- Items that show thoughtfulness and consideration
- Practical gifts that will be used and appreciated
- Quality over quantity

Provide 3-5 categories with 2-3 specific product recommendations each. Include reasoning for each suggestion and consider the relationship dynamic.

Return a JSON object with recommendations and overall reasoning.`;

    const budgetText = budget 
      ? `Budget: $${budget.min || 0}-${budget.max || 'unlimited'}`
      : 'No budget specified';

    const userPrompt = `Please recommend gifts for:
- Name: ${person.name}
- Relationship: ${person.relationship || 'unknown'}
- Age: ${person.age || 'unknown'}
- Interests: ${person.interests?.join(', ') || 'none specified'}
- Occasion: ${occasion || 'general gift'}
- ${budgetText}
- Days until event: ${daysUntil || 'not specified'}
- Previous gifts: ${previousGifts?.join(', ') || 'none'}

Focus on high-quality, well-reviewed products that would be meaningful for this relationship and occasion.`;

    const response = await this.chat([
      { role: 'user', content: userPrompt }
    ], {
      systemPrompt,
      temperature: 0.8,
      maxTokens: 1500
    });

    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse gift recommendations:', error);
      throw new Error('Failed to generate gift recommendations');
    }
  }

  // Enhanced product search with AI curation
  async searchProducts(query: string, context?: {
    person?: string;
    occasion?: string;
    budget?: number;
    interests?: string[];
  }): Promise<{
    searchTerms: string[];
    categories: string[];
    reasoning: string;
    filters: {
      priceRange?: { min: number; max: number };
      tags?: string[];
      urgency?: 'low' | 'medium' | 'high';
    };
  }> {
    const systemPrompt = `You are an AI shopping assistant that interprets search queries in the context of gift-giving and product discovery.

Transform user queries into:
1. Enhanced search terms (including synonyms, related products)
2. Relevant product categories
3. Appropriate filters (price range, tags, etc.)
4. Reasoning for the recommendations

Focus on high-quality, well-reviewed products that would make excellent gifts.

Return a JSON object with the enhanced search strategy.`;

    const contextText = context ? `
Context:
- Person: ${context.person || 'unknown'}
- Occasion: ${context.occasion || 'general'}
- Budget: $${context.budget || 'flexible'}
- Interests: ${context.interests?.join(', ') || 'none'}
` : '';

    const userPrompt = `Search query: "${query}"${contextText}

Provide enhanced search terms and filtering strategy for finding the best gift products.`;

    const response = await this.chat([
      { role: 'user', content: userPrompt }
    ], {
      systemPrompt,
      temperature: 0.6,
      maxTokens: 800
    });

    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse search enhancement:', error);
      throw new Error('Failed to enhance search query');
    }
  }

  // Generate smart product descriptions
  async enhanceProductDescription(product: {
    name: string;
    description?: string;
    category?: string;
    price?: number;
    amazonLink?: string;
  }): Promise<{
    enhancedDescription: string;
    giftSuggestions: string[];
    idealFor: string[];
    tags: string[];
    quality: 'excellent' | 'good' | 'average' | 'unknown';
  }> {
    const systemPrompt = `You are a product analysis expert who evaluates items for their gift-giving potential.

Analyze the product and provide:
1. Enhanced description focusing on gift-worthiness
2. Who this would make a great gift for
3. Occasions when this would be appropriate
4. Quality assessment based on known information
5. Relevant tags for discoverability

Focus on the emotional and practical value of the product as a gift.`;

    const userPrompt = `Product: ${product.name}
Description: ${product.description || 'No description provided'}
Category: ${product.category || 'Unknown'}
Price: ${product.price ? `$${product.price}` : 'Unknown'}

Analyze this product's potential as a gift and provide enhancement details.`;

    const response = await this.chat([
      { role: 'user', content: userPrompt }
    ], {
      systemPrompt,
      temperature: 0.7,
      maxTokens: 1000
    });

    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse product enhancement:', error);
      throw new Error('Failed to enhance product description');
    }
  }
}

// Singleton instance
export const anthropicAI = new AnthropicAI();