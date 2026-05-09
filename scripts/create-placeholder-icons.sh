#!/bin/bash
# Creates minimal PNG icons using ImageMagick (if available) or SVG fallback
# Run: bash scripts/create-placeholder-icons.sh

ICONS_DIR="public/icons"
mkdir -p "$ICONS_DIR"

if command -v convert &>/dev/null; then
  for SIZE in 16 32 48 128; do
    convert -size ${SIZE}x${SIZE} \
      gradient:'#0ea5e9-#d946ef' \
      -font Arial -pointsize $((SIZE/3)) \
      -fill white -gravity center \
      -annotate 0 "AI" \
      "$ICONS_DIR/icon${SIZE}.png"
    echo "Created icon${SIZE}.png"
  done
else
  echo "ImageMagick not found. Creating SVG placeholder..."
  for SIZE in 16 32 48 128; do
    cat > "$ICONS_DIR/icon${SIZE}.svg" << EOF
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0ea5e9"/>
      <stop offset="100%" style="stop-color:#d946ef"/>
    </linearGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" rx="${SIZE/5}" fill="url(#g)"/>
  <text x="${SIZE/2}" y="${SIZE/2}" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Arial" font-weight="bold" font-size="${SIZE*0.38}">AI</text>
</svg>
EOF
    echo "Created icon${SIZE}.svg (convert SVG to PNG for Chrome)"
  done
fi
