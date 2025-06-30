# Tokens3 - AI-Powered Gift Management Platform

## Project Vision
**Tokens3** transforms gift giving from stressful to magical. The third iteration of the tokens series, built with AI-first architecture to deliver personalized gift suggestions and relationship management.

### Core Philosophy: Family Values Design Manifesto
Following https://benji.org/family-values principles:

**Simplicity**: AI handles complexity, users get instant value
**Fluidity**: Seamless navigation between people, dates, and gifts
**Delight**: Magical AI moments that feel genuinely helpful

### AI-First Architecture
The entire platform is designed around Anthropic Claude AI:
- **Natural Language Input**: "Add my mom Mary, 68, loves gardening and cooking"
- **Contextual Gift Suggestions**: AI analyzes relationships, interests, and past gifts
- **Smart Search Enhancement**: Plain queries become sophisticated product filtering
- **Wirecutter-Quality Curation**: AI evaluates products for gift-worthiness
- **Proactive Reminders**: Intelligent notifications with personalized suggestions

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

### AI Integration Points (Active)
1. **Person Creation**: ✅ "Add my mom Mary, 68, loves gardening and cooking"
2. **Gift Suggestions**: 🚧 Context-aware recommendations per person
3. **Product Search**: ✅ AI-enhanced search with intelligent filtering
4. **Event Planning**: 🚧 "Get them a housewarming gift in 2 weeks"
5. **Smart Reminders**: 🚧 Proactive notifications with curated suggestions

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

## Styling Architecture - NativeWind Only
**STRICT CONSTRAINT**: All styling must use NativeWind/Tailwind classes exclusively.

### ✅ Correct Approach
```tsx
<View className="flex-1 bg-background border border-border rounded-2xl p-4">
  <Text className="text-xl font-bold text-foreground">Hello</Text>
</View>
```

### ❌ NEVER Use
```tsx
<View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Hello</Text>
</View>
```

### Theme System - NativeWind vars()
Using proper NativeWind theming with `vars()` for dynamic themes:

```tsx
// ThemeContext.tsx
import { vars } from 'nativewind';

const themes = {
  light: vars({
    '--color-background': '255 255 255',
    '--color-foreground': '24 24 27',
  }),
  dark: vars({
    '--color-background': '24 24 27', 
    '--color-foreground': '250 250 250',
  }),
};
```

### Design System Classes
- **Colors**: `bg-background`, `text-foreground`, `border-border`, `bg-accent`
- **Spacing**: `p-4`, `m-6`, `gap-4`, `px-6`, `py-2`
- **Layout**: `flex-1`, `flex-row`, `items-center`, `justify-between`
- **Typography**: `text-xl`, `font-bold`, `text-center`, `leading-relaxed`
- **Borders**: `border`, `border-2`, `rounded-2xl`, `rounded-full`

### Exceptions (Rare)
Only use inline `style` for:
- Platform-specific values (e.g., `paddingTop: insets.top`)
- Dynamic calculations that can't be expressed in Tailwind
- React Native Reanimated animated values

## Current Status (January 2025)
✅ Core product management and discovery
✅ User authentication and profiles  
✅ People and special dates tracking
✅ Responsive navigation system
✅ Dashboard with AI person input
✅ About page with transparent mission
✅ **Anthropic Claude AI Integration** - Person parsing and search enhancement

🚧 **Current Phase**: AI gift suggestion engine and curated product database

## Development Heuristics
- Always check with user before major changes
- Create CLAUDE.md files in each significant folder
- Commit frequently with meaningful messages
- Follow Family Values in every interaction design
- **Use ONLY FluentUI Emoji** - No other icon libraries, consistent visual language
- **STRICT: Use ONLY NativeWind classes** - No inline `style` props, always use Tailwind/NativeWind classes (https://www.nativewind.dev/)
- **Simple UI patterns** - Prefer simple buttons over complex controls (e.g., two buttons vs segmented control)
- **No shadows, borders only** - Use `border border-border` instead of shadows for clean, flat design
- Use only specified tech stack (no additional dependencies without approval)
- Prioritize user delight over feature completeness
- AI-first mindset: how can Claude enhance this experience?

---
*Updated 2025-01-12 - AI-Enhanced Gift Platform Architecture*