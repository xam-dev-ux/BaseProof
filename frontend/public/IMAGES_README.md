# Required Images for Base Mini App

For proper Base Mini App indexing, you need to create and add these images to the `/public` folder:

## Required Images

1. **icon.png** (512x512px)
   - App icon
   - Appears in search results and app list
   - Square format, PNG

2. **splash.png** (1200x630px)
   - Splash screen when app launches
   - Horizontal format, PNG

3. **hero.png** (1200x630px)
   - Hero image for Farcaster frame
   - Horizontal format, PNG

4. **og-image.png** (1200x630px)
   - Open Graph image for social sharing
   - Horizontal format, PNG

5. **screenshot1.png, screenshot2.png, screenshot3.png** (750x1334px)
   - App screenshots showing key features
   - Vertical (mobile) format, PNG
   - Example screenshots:
     - Certification page
     - Verification result
     - Certificate details

## Quick Creation Guide

### Using Figma/Canva:
1. Create designs matching the BaseProof brand (blue #2563eb, gold #eab308)
2. Export as PNG at required dimensions
3. Place in `/public` folder

### Temporary Placeholders:
You can use solid color images temporarily:

```bash
cd public

# Icon (512x512)
convert -size 512x512 xc:'#2563eb' \
  -fill white -pointsize 200 -gravity center -annotate +0+0 'BP' \
  icon.png

# Splash/Hero/OG (1200x630)
convert -size 1200x630 gradient:'#2563eb-#7c3aed' \
  -fill white -pointsize 100 -gravity center \
  -annotate +0+0 'BaseProof\nDocument Certification' \
  splash.png

cp splash.png hero.png
cp splash.png og-image.png

# Screenshots (750x1334)
convert -size 750x1334 xc:'#f9fafb' \
  -fill '#2563eb' -pointsize 60 -gravity center \
  -annotate +0-400 'BaseProof' \
  -fill '#6b7280' -pointsize 30 \
  -annotate +0-300 'Screenshot 1\nCertify Documents' \
  screenshot1.png

# Repeat for screenshot2.png and screenshot3.png
```

## After Deployment

1. Update `farcaster.json` with your actual domain (currently: base-proof-frontend.vercel.app)
2. Ensure all image URLs are accessible
3. Share your Mini App URL in Farcaster feed to trigger indexing
4. Verify manifest at: https://warpcast.com/~/developers/miniapps

## Notes

- Images must be publicly accessible
- Use absolute URLs in farcaster.json
- PNG format recommended for best quality
- Keep file sizes reasonable (<500KB per image)
