# Tokens3 - AI-Powered Gift Management Platform

## Project Vision
**Tokens3** transforms gift giving from stressful to magical. The third iteration of the tokens series, built with AI-first architecture to deliver personalized gift suggestions and relationship management.

### Core Philosophy: Family Values Design Manifesto
Following https://benji.org/family-values principles:

**Simplicity**: AI handles complexity, users get instant value
**Fluidity**: Seamless navigation between people, dates, and gifts
**Delight**: Magical AI moments that feel genuinely helpful

## Tech Stack - AI-Enhanced & Elegant
- **React Native + Expo** (v53) - Cross-platform foundation
- **Supabase** - Database, auth, real-time, people & gift tracking
- **Anthropic Claude** - AI-powered person parsing and gift suggestions
- **React Native Reanimated** - Fluid micro-interactions
- **FluentUI Emoji** - Consistent visual language
- **NativeWind** - Responsive styling system
- **TypeScript** - Type safety throughout

## New Architecture - People-First Design

### Core Features Implemented
1. **Dashboard Home** - Welcome screen for authenticated users
2. **People Management** - Add people via AI natural language input
3. **Special Dates Tracking** - Birthdays, anniversaries, custom events
4. **Gift History** - Track what you've given to prevent duplicates
5. **Product Discovery** - Enhanced with AI search coming soon
6. **Responsive Navigation** - Floating tabs on mobile, top tabs on desktop

### Database Schema
- `people` - Core person profiles with AI context
- `special_dates` - Events with recurrence patterns
- `gifts_given` - Historical gift tracking
- `person_product_bookmarks` - Wishlist management per person
- Enhanced `products` table with AI-ready metadata

### AI Integration Points (Coming Soon)
1. **Person Creation**: "Add my mom Mary, 68, loves gardening and cooking"
2. **Gift Suggestions**: Context-aware recommendations per person
3. **Event Planning**: "Get them a housewarming gift in 2 weeks"
4. **Smart Reminders**: Proactive notifications with curated suggestions

## User Journey - Magical Gift Giving
1. **Sign Up** → Dashboard with people management
2. **Add People** → AI parses natural language descriptions
3. **Track Dates** → Important occasions with smart reminders
4. **Discover Gifts** → AI-curated suggestions based on person profile
5. **Never Repeat** → Automatic filtering of previously given gifts
6. **Effortless Giving** → One-click to Amazon with affiliate support

## Revenue Model - Transparent & Ethical
- **No ads ever** - Clean, focused experience
- **No data selling** - Privacy-first approach
- **Affiliate commissions** - Small percentage from Amazon purchases
- **Premium features** (future) - Advanced AI insights and automation

## Responsive Design Strategy
- **Mobile (≤500px)**: 1 column, horizontal cards, floating bottom nav
- **Tablet (501-960px)**: 2 columns, vertical cards, top navigation
- **Desktop (>960px)**: 4 columns, rich vertical cards, top navigation

## Development Principles
- **AI-First**: Every feature considers how AI can enhance the experience
- **Privacy-First**: User data never leaves secure boundaries
- **Delight-First**: Micro-interactions create emotional connection
- **Mobile-First**: Touch-optimized experiences scale up beautifully

## Key Technical Decisions
- **Supabase RLS**: Row-level security ensures data privacy
- **Platform-Specific UI**: Different layouts optimize for each screen size
- **Real-time Sync**: Live updates across devices
- **Type Safety**: Full TypeScript coverage for reliability

## Current Status (December 2024)
✅ Core product management and discovery
✅ User authentication and profiles  
✅ People and special dates tracking
✅ Responsive navigation system
✅ Dashboard with AI person input
✅ About page with transparent mission

🚧 **Next Phase**: AI integration with Anthropic Claude for person parsing and gift suggestions

## Development Heuristics
- Always check with user before major changes
- Create CLAUDE.md files in each significant folder
- Commit frequently with meaningful messages
- Follow Family Values in every interaction design
- Use only specified tech stack (no additional dependencies without approval)
- Prioritize user delight over feature completeness

---
*Updated 2025-01-12 - AI-Enhanced Gift Platform Architecture*