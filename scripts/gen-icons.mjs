// Generates PNG icons using pure JavaScript (no external deps)
// Creates simple colored PNG files

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'public', 'icons');
mkdirSync(iconsDir, { recursive: true });

// Minimal PNG encoder
function createPNG(size) {
  // Create pixel data for a gradient square icon
  const pixels = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const t = (x + y) / (size * 2);
      // Gradient: brand blue (#0ea5e9) to accent purple (#d946ef)
      const r = Math.round(0x0e + (0xd9 - 0x0e) * t);
      const g = Math.round(0xa5 + (0x46 - 0xa5) * t);
      const b = Math.round(0xe9 + (0xef - 0xe9) * t);

      const idx = (y * size + x) * 4;
      pixels[idx] = r;
      pixels[idx + 1] = g;
      pixels[idx + 2] = b;
      pixels[idx + 3] = 255;
    }
  }

  return pixels;
}

// Use a very simple approach: write a base64 encoded minimal PNG
// This is a valid 1x1 blue PNG that scales
const BASE64_16 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSIVBzuIOGSoThZERRy1CkWoEGqFVh1MLv2CJg1JioujIK64+LFYdXBx1tXBVRAEHyCOTk6KLlLi/5JCixgPjvvx7t7j7h0g1MtMNTvGAI22jWQsKqYzq2LwFQH0oB99GJCZZcylpDg8x9c9fHy9i/Is73N/jh41azHAJxLPMsO0ideJpzdtg/M+cYQVZZX4nHjMpAsSP3Jd8fiNc8FlgWdGzHRyjjhCLBa6WOliVjQ14iHiqKrplC9kPFY5b3HWylXWuid/YTCnryxzneYQ4lnEAhIQoaCKEsqwEaFVJ8VCkvajHv5B1y+RSyFXCYwcC6hAhez6wf/gd7dWfjLhJYWiQNeLw3keBYK7QKPmON/HjtM4AQLPwJXe9lfqwMwn6bW2Fj8Cem3g4rqtKXvA5Q4w9GTIpuxKQVpCLge8n9E3ZYCBWyCz5vXW3MfpA5CirrU3wMEhMFKk7HWfd/d09vbvmVb/fgBPOHKFQlUjfQAAAAlwSFlzAAALEwAACxMBAJqcGAAAABFJREFUOI1jYGBg+M9ABQAABAAB/xMT4IAAAAAASUVORK5CYII=';

// Write the same icon for all sizes (Chrome will scale it)
for (const size of [16, 32, 48, 128]) {
  const buffer = Buffer.from(BASE64_16, 'base64');
  writeFileSync(join(iconsDir, `icon${size}.png`), buffer);
  console.log(`Written icon${size}.png`);
}

console.log('Icons ready in public/icons/');
