#!/bin/bash
# Simple script to create placeholder images for Base Mini App

# Colors
BG_COLOR='#2563eb'
GRADIENT_END='#7c3aed'
TEXT_COLOR='white'

echo "Creating Base Mini App images..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick not found. Install with: sudo apt-get install imagemagick"
    echo "Creating simple HTML-based placeholders instead..."
    
    # Create simple SVG placeholders
    cat > icon.svg << 'SVGEOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#2563eb"/>
  <text x="256" y="280" font-size="200" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">BP</text>
</svg>
SVGEOF

    cat > splash.svg << 'SVGEOF'
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#grad)"/>
  <text x="600" y="280" font-size="80" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">BaseProof</text>
  <text x="600" y="370" font-size="40" fill="white" text-anchor="middle" font-family="Arial">Document Certification</text>
</svg>
SVGEOF

    echo "✅ SVG placeholders created"
    echo "Convert to PNG using: https://svgtopng.com or similar tool"
    exit 0
fi

# Icon (512x512)
convert -size 512x512 xc:"$BG_COLOR" \
  -fill "$TEXT_COLOR" -pointsize 200 -font Arial-Bold -gravity center \
  -annotate +0+0 'BP' \
  icon.png

# Splash (1200x630)
convert -size 1200x630 gradient:"$BG_COLOR-$GRADIENT_END" \
  -fill "$TEXT_COLOR" -pointsize 80 -font Arial-Bold -gravity center \
  -annotate +0-80 'BaseProof' \
  -pointsize 40 -font Arial \
  -annotate +0+50 'Document Certification' \
  splash.png

# Hero (same as splash)
cp splash.png hero.png

# OG Image (same as splash)
cp splash.png og-image.png

# Screenshots (750x1334)
convert -size 750x1334 xc:'#f9fafb' \
  -fill "$BG_COLOR" -pointsize 60 -font Arial-Bold -gravity center \
  -annotate +0-400 'BaseProof' \
  -fill '#6b7280' -pointsize 30 -font Arial \
  -annotate +0-300 'Screenshot 1' \
  -pointsize 24 \
  -annotate +0-250 'Certify Documents' \
  screenshot1.png

convert -size 750x1334 xc:'#f9fafb' \
  -fill "$BG_COLOR" -pointsize 60 -font Arial-Bold -gravity center \
  -annotate +0-400 'BaseProof' \
  -fill '#6b7280' -pointsize 30 -font Arial \
  -annotate +0-300 'Screenshot 2' \
  -pointsize 24 \
  -annotate +0-250 'Verify Documents' \
  screenshot2.png

convert -size 750x1334 xc:'#f9fafb' \
  -fill "$BG_COLOR" -pointsize 60 -font Arial-Bold -gravity center \
  -annotate +0-400 'BaseProof' \
  -fill '#6b7280' -pointsize 30 -font Arial \
  -annotate +0-300 'Screenshot 3' \
  -pointsize 24 \
  -annotate +0-250 'Certificate Details' \
  screenshot3.png

echo "✅ All images created successfully!"
echo ""
echo "Created:"
echo "  - icon.png (512x512)"
echo "  - splash.png (1200x630)"
echo "  - hero.png (1200x630)"
echo "  - og-image.png (1200x630)"
echo "  - screenshot1.png (750x1334)"
echo "  - screenshot2.png (750x1334)"
echo "  - screenshot3.png (750x1334)"
