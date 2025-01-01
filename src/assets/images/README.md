# Image Assets

This directory contains image assets for the OpenAlgo web portal.

## Directory Structure

```
images/
├── logos/         # Brand logos and icons
├── features/      # Feature illustrations and screenshots
├── platforms/     # Platform-specific images
├── ui/           # UI elements and decorative images
└── blog/         # Blog post images
```

## Guidelines

1. **Image Formats**
   - Use SVG for logos and icons
   - Use WebP for photographs with JPEG fallback
   - Use PNG for screenshots or when transparency is needed

2. **Naming Convention**
   - Use kebab-case: `feature-name.webp`
   - Include dimensions if relevant: `hero-banner-1920x1080.webp`
   - Use descriptive names: `amibroker-integration-screenshot.webp`

3. **Optimization**
   - Compress all images appropriately
   - Provide responsive images using Next.js Image component
   - Include alt text for accessibility

4. **Organization**
   - Keep images organized in appropriate subdirectories
   - Use semantic naming for directories
   - Document any special usage requirements

## Usage

```jsx
import Image from 'next/image'
import featureImage from '@/assets/images/features/feature-name.webp'

// In your component
<Image
  src={featureImage}
  alt="Feature description"
  width={800}
  height={600}
  priority={true}
/>
```
