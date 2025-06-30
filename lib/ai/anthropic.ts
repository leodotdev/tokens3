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
      console.error('❌ EXPO_PUBLIC_ANTHROPIC_API_KEY is not set in environment variables');
      throw new Error('EXPO_PUBLIC_ANTHROPIC_API_KEY is not set - please add your Anthropic API key to .env');
    }
    this.apiKey = ANTHROPIC_API_KEY;
    console.log('✅ Anthropic AI initialized successfully');
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

  // Parse events from natural language
  async parseEvent(input: string): Promise<{
    name: string;
    date: string;
    person_name?: string;
    category?: string;
    recurrence_type?: 'annual' | 'monthly' | 'weekly' | 'none';
    reminder_days_before?: number;
    confidence: number;
  }> {
    const systemPrompt = `You are an AI assistant that parses natural language descriptions of events and special dates.

Extract the following information from the user's input:
- name (required): The event name
- date (required): Convert to YYYY-MM-DD format, assume current year if not specified
- person_name (optional): If a person is mentioned
- category (optional): birthday, anniversary, graduation, wedding, holiday, etc.
- recurrence_type (default: "none"): annual, monthly, weekly, none
- reminder_days_before (default: 14): days before to remind
- confidence (0-1): how confident you are in the parsing

Return ONLY a valid JSON object with these fields.

Examples:
Input: "Sarah's birthday is March 15th"
Output: {"name": "Sarah's Birthday", "date": "2024-03-15", "person_name": "Sarah", "category": "birthday", "recurrence_type": "annual", "reminder_days_before": 14, "confidence": 0.9}

Input: "My anniversary is June 10"
Output: {"name": "Anniversary", "date": "2024-06-10", "category": "anniversary", "recurrence_type": "annual", "reminder_days_before": 30, "confidence": 0.8}

Input: "Christmas party December 25"
Output: {"name": "Christmas Party", "date": "2024-12-25", "category": "holiday", "recurrence_type": "annual", "reminder_days_before": 14, "confidence": 0.9}`;

    const response = await this.chat([
      { role: 'user', content: input }
    ], {
      systemPrompt,
      temperature: 0.3,
      maxTokens: 400
    });

    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse event JSON:', error);
      throw new Error('Failed to parse event information');
    }
  }

  // Handle conversational AI interactions
  async handleConversation(
    message: string, 
    context?: {
      user_id?: string;
      existing_people?: string[];
      recent_events?: string[];
      conversation_history?: Array<{role: 'user' | 'assistant', content: string}>;
    }
  ): Promise<{
    response: string;
    intent: 'gift_search' | 'add_person' | 'create_event' | 'general' | 'follow_up';
    actions: Array<{
      type: 'add_person' | 'create_event' | 'search_products' | 'ask_follow_up';
      label: string;
      data: any;
    }>;
    products_query?: string;
  }> {
    const systemPrompt = `You are an AI gift-giving assistant that helps users find gifts, manage people in their lives, and track important dates.

CONTEXT:
${context?.existing_people ? `User's People: ${context.existing_people.join(', ')}` : 'No people added yet'}
${context?.recent_events ? `Recent Events: ${context.recent_events.join(', ')}` : 'No recent events'}

YOUR CAPABILITIES:
1. **Gift Suggestions**: Recommend specific, well-reviewed products based on person, relationship, interests, budget
2. **People Management**: Help users add family, friends, colleagues to their profile
3. **Event Tracking**: Create birthdays, anniversaries, holidays for gift reminders
4. **Smart Follow-ups**: Ask relevant questions to improve recommendations

CONVERSATION GUIDELINES:
- Be conversational, helpful, and enthusiastic about gift-giving
- When someone asks for gifts, provide 2-3 specific suggestions and ask if they want to see more
- When gifts are mentioned for a person not in their profile, suggest adding them
- Always ask follow-up questions to understand the recipient better
- Suggest creating events/reminders for important dates
- Keep responses concise but warm and personal

RESPONSE FORMAT (JSON):
{
  "response": "Your conversational response",
  "intent": "gift_search|add_person|create_event|general|follow_up", 
  "actions": [
    {"type": "add_person", "label": "Add Mom to Profile", "data": {"name": "Mom", "relationship": "mother"}},
    {"type": "search_products", "label": "Browse Kitchen Gifts", "data": {"category": "Kitchen", "query": "cooking gifts"}},
    {"type": "create_event", "label": "Add Mom's Birthday", "data": {"name": "Mom's Birthday", "date": "2024-06-15"}}
  ],
  "products_query": "optional search terms for products"
}

EXAMPLES:
User: "gifts for my mom"
Response: {
  "response": "I'd love to help find the perfect gift for your mom! What does she enjoy doing? For now, here are some universally loved options: a cozy cashmere scarf, a beautiful jewelry box, or a premium tea collection. Would you like me to add your mom to your profile so I can give you personalized reminders for her birthday and other special occasions?",
  "intent": "gift_search",
  "actions": [
    {"type": "add_person", "label": "Add Mom to Profile", "data": {"name": "Mom", "relationship": "mother"}},
    {"type": "search_products", "label": "Browse Gifts for Moms", "data": {"query": "gifts for mom mother parent"}}
  ],
  "products_query": "gifts for mom mother parent"
}`;

    const conversationHistory = context?.conversation_history || [];
    const messages = [
      ...conversationHistory.slice(-4), // Keep last 4 messages for context
      { role: 'user' as const, content: message }
    ];

    const response = await this.chat(messages, {
      systemPrompt,
      temperature: 0.8,
      maxTokens: 600
    });

    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse conversation JSON:', error);
      // Fallback response
      return {
        response: response,
        intent: 'general',
        actions: []
      };
    }
  }

  // Generate search suggestions for autocomplete
  async generateSearchSuggestions(query: string): Promise<string[]> {
    if (!query.trim()) return [];

    const systemPrompt = `You are a search suggestion assistant for a gift and product discovery platform. 
    
Generate 5-7 relevant search suggestions based on the user's partial query. Suggestions should be:
- Complete, actionable search terms
- Diverse in scope (different categories, price points, occasions)
- Gift-focused when appropriate
- Natural and conversational

Return ONLY a JSON array of strings, no other text.`;

    const userPrompt = `Generate search suggestions for: "${query}"`;

    try {
      const response = await this.chat([
        { role: 'user', content: userPrompt }
      ], {
        systemPrompt,
        temperature: 0.6,
        maxTokens: 300
      });

      const suggestions = JSON.parse(response);
      return Array.isArray(suggestions) ? suggestions : [];
    } catch (error) {
      console.error('Failed to generate search suggestions:', error);
      return [];
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

// Service exports for easy access
export const anthropicService = {
  // Person parsing
  parsePerson: (input: string) => anthropicAI.parsePerson(input),
  
  // Gift recommendations
  recommendGifts: (context: {
    person: { name: string; relationship?: string; age?: number; interests?: string[]; };
    occasion?: string;
    budget?: { min?: number; max?: number; };
    avoidRepeats?: string[];
  }) => anthropicAI.recommendGifts(context),
  
  // Search enhancement
  enhanceProductSearch: (query: string) => anthropicAI.enhanceProductSearch(query),
  generateSearchSuggestions: (query: string) => anthropicAI.generateSearchSuggestions(query),
  
  // Event parsing
  parseEvent: (input: string) => anthropicAI.parseEvent(input),
  
  // Conversation handling
  handleConversation: (message: string, context?: any) => anthropicAI.handleConversation(message, context),
  
  // Product enhancement
  enhanceProductDescription: (product: any) => anthropicAI.enhanceProductDescription(product)
};