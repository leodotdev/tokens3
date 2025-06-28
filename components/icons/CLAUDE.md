# Icons Directory

This directory contains Fluent Emoji implementations for tokens3.

## Implementation
We use Microsoft's official Fluent Emoji assets from their GitHub repository. The emoji are fetched directly from the GitHub CDN to avoid bundling large assets.

## Files
- `FluentEmojiReal.tsx` - Main implementation using actual Fluent Emoji images
- `FluentEmoji.tsx` - Alternative implementation (kept for reference)

## Features
- Supports all 4 Fluent Emoji variants: 3D (default), Color, Flat, High Contrast
- Images are loaded from GitHub CDN on demand
- Consistent sizing and styling across the app
- Type-safe emoji names

## Usage
```tsx
import { FluentEmoji, SparklesEmoji } from '../icons/FluentEmojiReal';

// Basic usage
<FluentEmoji name="ShoppingCart" size={32} />

// With variant
<FluentEmoji name="Heart" size={24} variant="Color" />

// Convenience components
<SparklesEmoji size={40} />
```

## Emoji Mapping
- ShoppingCart → shopping_cart
- Sparkles → sparkles  
- Heart → red_heart
- Star → star
- Plus → plus
- Search → magnifying_glass_tilted_left
- Filter → filter
- Delete → wastebasket
- Edit → pencil
- Check → check_mark
- CheckboxChecked → check_box_with_check
- CheckboxUnchecked → white_square_button
- Close → cross_mark

## Design Philosophy
Using Fluent Emoji aligns with our Family Values:
- **Simplicity**: Direct CDN loading, no complex setup
- **Fluidity**: Smooth loading with proper sizing
- **Delight**: Beautiful 3D emoji add personality and emotion

---
*Generated 2025-01-12 by Claude Code*