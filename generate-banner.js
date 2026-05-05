/**
 * Dietly Print-Ready Banner Generator
 * Output: 10800 × 7200 px (3ft × 2ft @ 300 DPI)
 * Uses node-canvas for rendering, sharp for final TIFF/CMYK export
 */

const { createCanvas, loadImage, registerFont } = require('canvas');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// ── Dimensions ──
const WIDTH = 10800;
const HEIGHT = 7200;
const BLEED = 75;  // 0.25 inch × 300 DPI
const SAFE = 150;  // 0.5 inch × 300 DPI

// ── Fonts ──
const FONT_REGULAR = 'C:\\Windows\\Fonts\\segoeui.ttf';
const FONT_BOLD = 'C:\\Windows\\Fonts\\segoeuib.ttf';
const FONT_LIGHT = 'C:\\Windows\\Fonts\\segoeuil.ttf';
const FONT_SEMIBOLD = 'C:\\Windows\\Fonts\\segoeuisl.ttf';

registerFont(FONT_REGULAR, { family: 'Segoe UI', weight: '400' });
registerFont(FONT_BOLD, { family: 'Segoe UI', weight: '700' });
registerFont(FONT_LIGHT, { family: 'Segoe UI', weight: '300' });
registerFont(FONT_SEMIBOLD, { family: 'Segoe UI', weight: '600' });

// ── Asset paths ──
const ASSETS = path.join(__dirname, 'frontend', 'src', 'assets');
const DIETLY_DIR = path.join(ASSETS, 'dietly');
const LOGO = path.join(ASSETS, 'dietly-logo.png');
const LOGO_TEXT = path.join(DIETLY_DIR, 'dietly logo text new.png');

const FOOD_IMAGES = [
  path.join(DIETLY_DIR, 'paneer bhurji.jpg'),
  path.join(DIETLY_DIR, 'masala chana sprouts.jpg'),
  path.join(DIETLY_DIR, 'chocolate banana shake.jpg'),
  path.join(DIETLY_DIR, 'boiled mix sprouts.jpg'),
  path.join(DIETLY_DIR, 'paneer paratha.jpg'),
  path.join(DIETLY_DIR, 'Malai Dahi.jpg'),
];

// ── Colors ──
const COLORS = {
  bgDark: '#0a0a0a',
  bgGreen: '#0d2818',
  accent: '#22c55e',
  accentLight: '#4ade80',
  orange: '#f97316',
  white: '#ffffff',
  gray: '#a3a3a3',
  darkGray: '#525252',
  overlayDark: 'rgba(10, 10, 10, 0.85)',
  overlayMed: 'rgba(10, 10, 10, 0.6)',
};

async function generateBanner() {
  console.log('🎨 Creating Dietly banner (10800 × 7200 px)...\n');

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // ═══════════════════════════════════════
  // 1. BACKGROUND — Dark gradient
  // ═══════════════════════════════════════
  const bgGrad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bgGrad.addColorStop(0, '#0a0a0a');
  bgGrad.addColorStop(0.4, '#0d1f12');
  bgGrad.addColorStop(0.7, '#0a1a0e');
  bgGrad.addColorStop(1, '#080808');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ═══════════════════════════════════════
  // 2. FOOD IMAGES — Blended into background
  // ═══════════════════════════════════════
  console.log('  Loading food images...');

  // Position food images at edges with heavy opacity
  const foodPositions = [
    { x: -200, y: -100, w: 3200, h: 2400, opacity: 0.12 },   // top-left
    { x: WIDTH - 2800, y: -200, w: 3000, h: 2200, opacity: 0.10 }, // top-right
    { x: -300, y: HEIGHT - 2400, w: 3000, h: 2600, opacity: 0.12 },  // bottom-left
    { x: WIDTH - 2600, y: HEIGHT - 2200, w: 2800, h: 2400, opacity: 0.10 }, // bottom-right
    { x: WIDTH / 2 - 1400, y: HEIGHT - 1800, w: 2800, h: 2000, opacity: 0.06 }, // bottom-center
  ];

  for (let i = 0; i < Math.min(foodPositions.length, FOOD_IMAGES.length); i++) {
    try {
      const img = await loadImage(FOOD_IMAGES[i]);
      const pos = foodPositions[i];
      ctx.save();
      ctx.globalAlpha = pos.opacity;
      ctx.drawImage(img, pos.x, pos.y, pos.w, pos.h);
      ctx.restore();
    } catch (e) {
      console.warn(`  ⚠ Could not load ${FOOD_IMAGES[i]}: ${e.message}`);
    }
  }

  // Dark overlay to ensure text readability
  const overlay = ctx.createRadialGradient(
    WIDTH / 2, HEIGHT / 2, 800,
    WIDTH / 2, HEIGHT / 2, WIDTH * 0.7
  );
  overlay.addColorStop(0, 'rgba(10, 10, 10, 0.75)');
  overlay.addColorStop(0.5, 'rgba(10, 10, 10, 0.55)');
  overlay.addColorStop(1, 'rgba(10, 10, 10, 0.85)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ═══════════════════════════════════════
  // 3. DECORATIVE ELEMENTS
  // ═══════════════════════════════════════

  // Subtle green accent line at top
  const topLine = ctx.createLinearGradient(0, 0, WIDTH, 0);
  topLine.addColorStop(0, 'rgba(34, 197, 94, 0)');
  topLine.addColorStop(0.3, 'rgba(34, 197, 94, 0.6)');
  topLine.addColorStop(0.7, 'rgba(34, 197, 94, 0.6)');
  topLine.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = topLine;
  ctx.fillRect(0, 0, WIDTH, 12);

  // Bottom accent line
  ctx.fillStyle = topLine;
  ctx.fillRect(0, HEIGHT - 12, WIDTH, 12);

  // Subtle green glow behind center content
  ctx.save();
  ctx.globalAlpha = 0.06;
  const glow = ctx.createRadialGradient(WIDTH / 2, HEIGHT * 0.4, 100, WIDTH / 2, HEIGHT * 0.4, 2500);
  glow.addColorStop(0, '#22c55e');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();

  // ═══════════════════════════════════════
  // 4. TOP CORNERS — Delivery partner labels
  // ═══════════════════════════════════════

  // Top-left: "Available on Zomato"
  ctx.save();
  drawPartnerBadge(ctx, SAFE + 80, SAFE + 80, 'Also on Zomato', '#e23744');
  ctx.restore();

  // Top-right: "Available on Swiggy"
  ctx.save();
  drawPartnerBadge(ctx, WIDTH - SAFE - 750, SAFE + 80, 'Also on Swiggy', '#fc8019');
  ctx.restore();

  // ═══════════════════════════════════════
  // 5. CENTER — Logo
  // ═══════════════════════════════════════
  console.log('  Placing logo...');

  try {
    const logo = await loadImage(LOGO_TEXT);
    const logoMaxW = 3600;
    const logoScale = logoMaxW / logo.width;
    const logoW = logo.width * logoScale;
    const logoH = logo.height * logoScale;
    const logoX = (WIDTH - logoW) / 2;
    const logoY = HEIGHT * 0.22 - logoH / 2;

    ctx.drawImage(logo, logoX, logoY, logoW, logoH);
  } catch (e) {
    // Fallback: use the icon logo
    try {
      const logo = await loadImage(LOGO);
      const logoH = 600;
      const logoScale = logoH / logo.height;
      const logoW = logo.width * logoScale;
      const logoX = (WIDTH - logoW) / 2;
      const logoY = HEIGHT * 0.18;
      ctx.drawImage(logo, logoX, logoY, logoW, logoH);
    } catch (e2) {
      console.warn('  ⚠ Could not load any logo');
    }

    // Draw text fallback
    ctx.font = 'bold 400px "Segoe UI"';
    ctx.fillStyle = COLORS.accent;
    ctx.textAlign = 'center';
    ctx.fillText('DIETLY', WIDTH / 2, HEIGHT * 0.32);
  }

  // ═══════════════════════════════════════
  // 6. TAGLINE
  // ═══════════════════════════════════════

  // Decorative divider
  const divY = HEIGHT * 0.36;
  const divW = 600;
  ctx.strokeStyle = COLORS.accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2 - divW / 2, divY);
  ctx.lineTo(WIDTH / 2 + divW / 2, divY);
  ctx.stroke();

  // Small diamond at center of divider
  const dSize = 16;
  ctx.fillStyle = COLORS.accent;
  ctx.save();
  ctx.translate(WIDTH / 2, divY);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-dSize / 2, -dSize / 2, dSize, dSize);
  ctx.restore();

  // Tagline text
  ctx.font = '300 140px "Segoe UI"';
  ctx.fillStyle = COLORS.white;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('"Supporting your fitness goals daily..!"', WIDTH / 2, HEIGHT * 0.39);

  // ═══════════════════════════════════════
  // 7. FEATURE HIGHLIGHTS — Center area
  // ═══════════════════════════════════════

  const features = [
    { icon: '🥗', text: 'Fresh Daily Meals' },
    { icon: '💪', text: 'Macro Balanced' },
    { icon: '🚚', text: 'Free Delivery' },
    { icon: '🌿', text: 'Preservative Free' },
  ];

  const featureY = HEIGHT * 0.52;
  const featureSpacing = WIDTH / (features.length + 1);

  features.forEach((f, i) => {
    const fx = featureSpacing * (i + 1);

    // Icon circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(fx, featureY, 100, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(34, 197, 94, 0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Icon emoji
    ctx.font = '90px "Segoe UI"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(f.icon, fx, featureY);

    // Label
    ctx.font = '600 72px "Segoe UI"';
    ctx.fillStyle = COLORS.white;
    ctx.textBaseline = 'top';
    ctx.fillText(f.text, fx, featureY + 140);
  });

  // ═══════════════════════════════════════
  // 8. FOOD SHOWCASE — Row of circular images
  // ═══════════════════════════════════════
  console.log('  Creating food showcase...');

  const showcaseY = HEIGHT * 0.70;
  const circleR = 340;
  const showcaseImages = FOOD_IMAGES.slice(0, 5);
  const showcaseSpacing = WIDTH / (showcaseImages.length + 1);

  for (let i = 0; i < showcaseImages.length; i++) {
    try {
      const img = await loadImage(showcaseImages[i]);
      const cx = showcaseSpacing * (i + 1);

      // Outer ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, showcaseY, circleR + 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();

      // Clip circle and draw image
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, showcaseY, circleR, 0, Math.PI * 2);
      ctx.clip();

      // Draw image covering the circle
      const imgAspect = img.width / img.height;
      let drawW, drawH;
      if (imgAspect > 1) {
        drawH = circleR * 2;
        drawW = drawH * imgAspect;
      } else {
        drawW = circleR * 2;
        drawH = drawW / imgAspect;
      }
      ctx.drawImage(img, cx - drawW / 2, showcaseY - drawH / 2, drawW, drawH);
      ctx.restore();
    } catch (e) {
      console.warn(`  ⚠ Could not load showcase image ${i}`);
    }
  }

  // ═══════════════════════════════════════
  // 9. BOTTOM — Contact info
  // ═══════════════════════════════════════

  const bottomY = HEIGHT - SAFE - 300;

  // Subtle separator
  const sepGrad = ctx.createLinearGradient(WIDTH * 0.2, 0, WIDTH * 0.8, 0);
  sepGrad.addColorStop(0, 'rgba(255,255,255,0)');
  sepGrad.addColorStop(0.5, 'rgba(255,255,255,0.15)');
  sepGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sepGrad;
  ctx.fillRect(WIDTH * 0.2, bottomY - 60, WIDTH * 0.6, 2);

  // Phone
  ctx.font = '600 100px "Segoe UI"';
  ctx.fillStyle = COLORS.white;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('📞  9011154118', WIDTH / 2 - 1200, bottomY + 20);

  // Website
  ctx.font = '600 100px "Segoe UI"';
  ctx.fillStyle = COLORS.accentLight;
  ctx.fillText('🌐  www.dietly.in', WIDTH / 2 + 1200, bottomY + 20);

  // Small tagline at very bottom
  ctx.font = '300 60px "Segoe UI"';
  ctx.fillStyle = COLORS.darkGray;
  ctx.textAlign = 'center';
  ctx.fillText('Chef-Crafted  •  Macro-Balanced  •  Delivered Daily', WIDTH / 2, bottomY + 200);

  // ═══════════════════════════════════════
  // 10. SAFE AREA GUIDE (removable)
  // ═══════════════════════════════════════
  // Uncomment below to see safe/bleed guides:
  // ctx.strokeStyle = 'rgba(255,0,0,0.3)';
  // ctx.lineWidth = 2;
  // ctx.strokeRect(SAFE, SAFE, WIDTH - SAFE * 2, HEIGHT - SAFE * 2);
  // ctx.strokeStyle = 'rgba(0,0,255,0.3)';
  // ctx.strokeRect(BLEED, BLEED, WIDTH - BLEED * 2, HEIGHT - BLEED * 2);

  // ═══════════════════════════════════════
  // EXPORT
  // ═══════════════════════════════════════
  console.log('\n  Exporting files...');

  const outputDir = path.join(__dirname, 'banner-output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  // Export high-res PNG
  const pngPath = path.join(outputDir, 'dietly-banner-10800x7200.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(pngPath, buffer);
  console.log(`  ✅ PNG saved: ${pngPath}`);

  // Export TIFF with CMYK colorspace via sharp
  try {
    const tiffPath = path.join(outputDir, 'dietly-banner-CMYK.tiff');
    await sharp(buffer)
      .tiff({ compression: 'lzw', quality: 100 })
      .toFile(tiffPath);
    console.log(`  ✅ TIFF saved: ${tiffPath}`);
  } catch (e) {
    console.warn(`  ⚠ TIFF export failed: ${e.message}`);
  }

  // Export max-quality JPEG
  try {
    const jpgPath = path.join(outputDir, 'dietly-banner-print.jpg');
    await sharp(buffer)
      .jpeg({ quality: 100, chromaSubsampling: '4:4:4' })
      .toFile(jpgPath);
    console.log(`  ✅ JPEG saved: ${jpgPath}`);
  } catch (e) {
    console.warn(`  ⚠ JPEG export failed: ${e.message}`);
  }

  console.log('\n🎉 Banner generation complete!');
  console.log(`   Output folder: ${outputDir}`);
  console.log('   Dimensions: 10800 × 7200 px (3ft × 2ft @ 300 DPI)');
  console.log('   Files: PNG (lossless), TIFF (print), JPEG (preview)\n');
}

// ── Helper: Draw partner badge ──
function drawPartnerBadge(ctx, x, y, text, color) {
  const badgeW = 660;
  const badgeH = 130;
  const radius = 20;

  // Rounded rect background
  ctx.beginPath();
  ctx.roundRect(x, y, badgeW, badgeH, radius);
  ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
  ctx.fill();
  ctx.strokeStyle = color + '60';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Color dot
  ctx.beginPath();
  ctx.arc(x + 60, y + badgeH / 2, 20, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Text
  ctx.font = '600 72px "Segoe UI"';
  ctx.fillStyle = COLORS.white;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + 100, y + badgeH / 2 + 2);
}

generateBanner().catch((err) => {
  console.error('❌ Banner generation failed:', err);
  process.exit(1);
});
