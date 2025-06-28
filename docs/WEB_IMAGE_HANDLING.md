# Web Image Handling & CORS Configuration

## Overview
This document describes the web-specific image handling and CORS configuration implemented for the tokens3 project to ensure images load properly on web platforms.

## Components

### 1. WebImage Component (`components/ui/WebImage.tsx`)
A cross-platform image component that handles:
- CORS configuration for web platform
- Fallback UI when images fail to load
- Automatic URL processing for Supabase storage
- Error handling with graceful degradation

Key features:
- Sets `crossOrigin="anonymous"` for web platform
- Shows FluentEmoji icon as fallback
- Processes URLs through storage utility

### 2. Storage Utility (`lib/storage.ts`)
Handles Supabase storage URLs:
- Converts relative paths to full Supabase storage URLs
- Ensures HTTPS protocol on web
- Provides upload functionality with proper caching headers

### 3. Webpack Configuration (`webpack.config.js`)
Custom webpack config for Expo web:
- Adds CORS headers to dev server
- Configures file-loader for proper image handling
- Sets `esModule: false` for compatibility

### 4. CSS Enhancements (`global.css`)
Web-specific styles for images:
- Smooth loading transitions
- Graceful handling of broken images
- Responsive image sizing

### 5. Vercel Configuration (`vercel.json`)
Production headers for deployed app:
- CORS headers for asset files
- Cache control for performance
- Security headers for protection

## Usage

Replace standard React Native Image components with WebImage:

```tsx
import { WebImage } from '../ui/WebImage';

// Instead of:
<Image source={{ uri: product.image_url }} />

// Use:
<WebImage 
  source={{ uri: product.image_url }}
  fallbackIcon="Package"
  fallbackIconSize={40}
/>
```

## CORS Considerations

1. **Supabase Storage**: Public buckets allow cross-origin requests by default
2. **External Images**: May require proxy or server-side handling
3. **Development**: Webpack dev server configured with permissive CORS
4. **Production**: Vercel headers handle CORS for static assets

## Troubleshooting

If images still fail to load:
1. Check browser console for CORS errors
2. Verify Supabase storage bucket is public
3. Ensure image URLs use HTTPS
4. Check if external domains need whitelisting
5. Verify webpack.config.js is being used (restart dev server)

## Future Improvements

- Image optimization/resizing service
- Progressive loading with blur placeholders
- Offline caching strategy
- CDN integration for better performance