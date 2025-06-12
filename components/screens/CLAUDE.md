# Screens Directory

Main application screens following Family Values design principles.

## MainScreen.tsx
The primary interface for tokens3, designed with:

### Simplicity
- Single screen that does everything
- Fundamentals at fingertips (search, add, view)
- Progressive disclosure of advanced features

### Fluidity
- Smooth Reanimated entrance animations
- Spring-based micro-interactions
- Seamless transitions between states
- Debounced search for responsive feel

### Delight
- FluentUI emoji for personality
- Gentle scaling and fade animations
- Thoughtful empty states with encouragement
- Magical moments in everyday interactions

## Design Philosophy
Every element serves both functional and emotional purposes:
- Search feels immediate and responsive
- Empty state encourages first action
- FAB appears with anticipation-building delay
- Header scales in to establish presence

## Animation Timing
- Header: 100ms delay + spring (damping: 15, stiffness: 150)
- List: 300ms delay + 800ms fade
- FAB: 600ms delay + spring (damping: 12, stiffness: 200)

This creates a choreographed entrance that feels alive.

---
*Generated 2025-01-12 by Claude Code*