/**
 * Dietly Print-Ready Banner v2 — PROFESSIONAL FOOD BRAND DESIGN
 * ─────────────────────────────────────────────────────────────
 * 10800 × 7200 px  (3 ft × 2 ft @ 300 DPI)
 *
 * Design: Light cream/green gradient, large readable type,
 *         clean layout, food images on bottom, high contrast text.
 */

const { createCanvas, loadImage, registerFont } = require('canvas');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// ── Canvas ──
const W = 10800;
const H = 7200;
const SAFE = 250; // generous safe margin for print

// ── Fonts ──
registerFont('C:\\Windows\\Fonts\\segoeui.ttf',  { family: 'Segoe UI', weight: '400' });
registerFont('C:\\Windows\\Fonts\\segoeuib.ttf', { family: 'Segoe UI', weight: '700' });
registerFont('C:\\Windows\\Fonts\\segoeuil.ttf', { family: 'Segoe UI', weight: '300' });
registerFont('C:\\Windows\\Fonts\\calibri.ttf',  { family: 'Calibri',  weight: '400' });
registerFont('C:\\Windows\\Fonts\\calibrib.ttf', { family: 'Calibri',  weight: '700' });
registerFont('C:\\Windows\\Fonts\\arialbd.ttf',  { family: 'Arial',    weight: '700' });

// ── Assets ──
const DIETLY_DIR = path.join(__dirname, 'frontend', 'src', 'assets', 'dietly');
const LOGO_PATH  = path.join(DIETLY_DIR, 'dietly logo text new.png');

// Best 4 food images for clean layout
const FOOD_IMAGES = [
  path.join(DIETLY_DIR, 'paneer bhurji.jpg'),
  path.join(DIETLY_DIR, 'masala chana sprouts.jpg'),
  path.join(DIETLY_DIR, 'chocolate banana shake.jpg'),
  path.join(DIETLY_DIR, 'paneer paratha.jpg'),
];

// ── Color Palette (food brand: warm, clean, appetizing) ──
const C = {
  cream:       '#FFF8F0',
  creamDark:   '#F5EDE0',
  softGreen:   '#E8F5E9',
  mintLight:   '#F0FFF4',
  green:       '#1B7A2B',   // primary brand green
  greenDark:   '#14612A',
  greenAccent: '#22C55E',
  orange:      '#F97316',
  orangeDark:  '#EA580C',
  white:       '#FFFFFF',
  textDark:    '#1A1A1A',
  textMed:     '#3D3D3D',
  textLight:   '#6B6B6B',
  zomato:      '#E23744',
  swiggy:      '#FC8019',
};


async function generateBanner() {
  console.log('────────────────────────────────────────');
  console.log(' DIETLY BANNER v2 — Professional Design');
  console.log(' 10800 × 7200 px  |  300 DPI  |  3×2 ft');
  console.log('────────────────────────────────────────\n');

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // ═══════════════════════════════════════════════
  // 1. BACKGROUND — Light warm gradient (NOT dark)
  // ═══════════════════════════════════════════════
  console.log('  [1/8] Background...');

  // Base: cream to soft mint gradient (top-left to bottom-right)
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0,    '#FFFFFF');
  bg.addColorStop(0.25, '#FAFFF5');
  bg.addColorStop(0.5,  '#F0FAF0');
  bg.addColorStop(0.75, '#F5FFF5');
  bg.addColorStop(1,    '#EAFAEA');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Very subtle radial warm glow at center-top (hero area warmth)
  const warmGlow = ctx.createRadialGradient(W / 2, H * 0.3, 200, W / 2, H * 0.3, 3000);
  warmGlow.addColorStop(0, 'rgba(255, 248, 230, 0.5)');
  warmGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = warmGlow;
  ctx.fillRect(0, 0, W, H);

  // ═══════════════════════════════════════════════
  // 2. TOP GREEN ACCENT BAR
  // ═══════════════════════════════════════════════
  console.log('  [2/8] Top accent bar...');

  // Solid green strip at very top (brand color)
  const barH = 80;
  ctx.fillStyle = C.green;
  ctx.fillRect(0, 0, W, barH);

  // Thin orange accent line below
  ctx.fillStyle = C.orange;
  ctx.fillRect(0, barH, W, 12);

  // ═══════════════════════════════════════════════
  // 3. ZOMATO (top-left) & SWIGGY (top-right)
  // ═══════════════════════════════════════════════
  console.log('  [3/8] Partner badges...');

  const badgeY = barH + 12 + 80;

  // — Zomato badge (top-left)  —
  drawZomatoBadge(ctx, SAFE + 60, badgeY);

  // — Swiggy badge (top-right) —
  drawSwiggyBadge(ctx, W - SAFE - 1500, badgeY);

  // ═══════════════════════════════════════════════
  // 4. LOGO — Large, centered, WHITE version
  // ═══════════════════════════════════════════════
  console.log('  [4/8] Logo...');

  const logoY = H * 0.16;

  try {
    const logo = await loadImage(LOGO_PATH);
    // Make logo large — 4200px wide
    const logoMaxW = 4200;
    const logoScale = logoMaxW / logo.width;
    const logoW = logo.width * logoScale;
    const logoH = logo.height * logoScale;
    const logoX = (W - logoW) / 2;

    // The logo is dark green on transparent.
    // To make it GREEN (brand) on light bg, draw it as-is (it's already green).
    // To make it white: draw to temp canvas, composite as source, fill white.
    // Since background is light, keep the GREEN logo for contrast:
    ctx.drawImage(logo, logoX, logoY, logoW, logoH);

  } catch (e) {
    console.warn('  ⚠ Logo load failed, using text fallback');
    ctx.font = 'bold 500px "Segoe UI"';
    ctx.fillStyle = C.green;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DIETLY', W / 2, logoY + 300);
  }

  // ═══════════════════════════════════════════════
  // 5. TAGLINE — Large, readable
  // ═══════════════════════════════════════════════
  console.log('  [5/8] Tagline...');

  const tagY = H * 0.38;

  // Decorative divider line
  const divW = 800;
  ctx.strokeStyle = C.greenAccent;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(W / 2 - divW / 2, tagY - 60);
  ctx.lineTo(W / 2 + divW / 2, tagY - 60);
  ctx.stroke();

  // Small leaf/diamond accent at center
  ctx.fillStyle = C.greenAccent;
  ctx.save();
  ctx.translate(W / 2, tagY - 60);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-14, -14, 28, 28);
  ctx.restore();

  // Tagline text — LARGE and bold
  ctx.font = 'bold 180px "Segoe UI"';
  ctx.fillStyle = C.textDark;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('"Supporting your fitness goals daily..!"', W / 2, tagY);

  // Sub-tagline
  ctx.font = '400 100px "Segoe UI"';
  ctx.fillStyle = C.textLight;
  ctx.fillText('Fresh  •  Healthy  •  Delivered to your door', W / 2, tagY + 260);

  // ═══════════════════════════════════════════════
  // 6. CONTACT INFO — GREEN BAR (high contrast)
  // ═══════════════════════════════════════════════
  console.log('  [6/8] Contact info bar...');

  const infoBarY = H * 0.52;
  const infoBarH = 380;

  // Green band for contact info
  ctx.fillStyle = C.green;
  ctx.fillRect(0, infoBarY, W, infoBarH);

  // Thin orange line at top of bar
  ctx.fillStyle = C.orange;
  ctx.fillRect(0, infoBarY, W, 8);

  // Phone — left side
  ctx.fillStyle = C.white;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const infoMidY = infoBarY + infoBarH / 2;

  // Phone icon (circle with phone symbol)
  drawPhoneIcon(ctx, W * 0.25 - 420, infoMidY, 80);
  ctx.font = 'bold 210px "Segoe UI"';
  ctx.fillStyle = C.white;
  ctx.textAlign = 'left';
  ctx.fillText('9011154118', W * 0.25 - 300, infoMidY + 10);

  // Vertical separator
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(W / 2 - 4, infoBarY + 50, 8, infoBarH - 100);

  // Website — right side
  drawGlobeIcon(ctx, W * 0.70 - 420, infoMidY, 80);
  ctx.font = 'bold 210px "Segoe UI"';
  ctx.fillStyle = C.white;
  ctx.textAlign = 'left';
  ctx.fillText('www.dietly.in', W * 0.70 - 300, infoMidY + 10);

  // ═══════════════════════════════════════════════
  // 7. FOOD IMAGES — Bottom section, 4 large circles
  // ═══════════════════════════════════════════════
  console.log('  [7/8] Food images...');

  const foodY = H * 0.73;
  const foodR = 520; // large circles
  const spacing = W / (FOOD_IMAGES.length + 1);

  for (let i = 0; i < FOOD_IMAGES.length; i++) {
    try {
      const img = await loadImage(FOOD_IMAGES[i]);
      const cx = spacing * (i + 1);

      // Drop shadow
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx + 10, foodY + 12, foodR + 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fill();
      ctx.restore();

      // White border ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, foodY, foodR + 18, 0, Math.PI * 2);
      ctx.fillStyle = C.white;
      ctx.fill();
      ctx.restore();

      // Green accent ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, foodY, foodR + 12, 0, Math.PI * 2);
      ctx.strokeStyle = C.greenAccent;
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.restore();

      // Clip circle and draw food image
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, foodY, foodR, 0, Math.PI * 2);
      ctx.clip();

      const imgAspect = img.width / img.height;
      let drawW, drawH;
      if (imgAspect > 1) {
        drawH = foodR * 2;
        drawW = drawH * imgAspect;
      } else {
        drawW = foodR * 2;
        drawH = drawW / imgAspect;
      }
      ctx.drawImage(img, cx - drawW / 2, foodY - drawH / 2, drawW, drawH);
      ctx.restore();
    } catch (e) {
      console.warn(`  ⚠ Food image ${i} failed: ${e.message}`);
    }
  }

  // Food labels below circles
  const foodLabels = ['Paneer Bhurji', 'Masala Sprouts', 'Banana Shake', 'Paneer Paratha'];
  ctx.font = 'bold 72px "Segoe UI"';
  ctx.fillStyle = C.textDark;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let i = 0; i < foodLabels.length; i++) {
    const cx = spacing * (i + 1);
    ctx.fillText(foodLabels[i], cx, foodY + foodR + 50);
  }

  // ═══════════════════════════════════════════════
  // 8. BOTTOM STRIP
  // ═══════════════════════════════════════════════
  console.log('  [8/8] Bottom strip...');

  const bottomBarH = 120;
  const bottomBarY = H - bottomBarH;

  // Green bottom bar matching top
  ctx.fillStyle = C.green;
  ctx.fillRect(0, bottomBarY, W, bottomBarH);

  // Thin orange line at top
  ctx.fillStyle = C.orange;
  ctx.fillRect(0, bottomBarY, W, 8);

  // Bottom tagline
  ctx.font = 'bold 64px "Segoe UI"';
  ctx.fillStyle = C.white;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    'Chef-Crafted  |  Macro-Balanced  |  Preservative Free  |  Delivered Daily',
    W / 2,
    bottomBarY + bottomBarH / 2 + 6
  );

  // ═══════════════════════════════════════════════
  // EXPORT
  // ═══════════════════════════════════════════════
  console.log('\n  Exporting...');

  const outDir = path.join(__dirname, 'banner-output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const buf = canvas.toBuffer('image/png');

  // PNG (master)
  const pngPath = path.join(outDir, 'dietly-banner-v2.png');
  fs.writeFileSync(pngPath, buf);
  console.log(`  ✅ PNG  → ${pngPath}  (${(buf.length / 1048576).toFixed(1)} MB)`);

  // TIFF (print)
  try {
    const tiffPath = path.join(outDir, 'dietly-banner-v2.tiff');
    await sharp(buf).tiff({ compression: 'lzw', quality: 100 }).toFile(tiffPath);
    const tiffSize = fs.statSync(tiffPath).size;
    console.log(`  ✅ TIFF → ${tiffPath}  (${(tiffSize / 1048576).toFixed(1)} MB)`);
  } catch (e) { console.warn('  ⚠ TIFF failed:', e.message); }

  // JPEG (preview)
  try {
    const jpgPath = path.join(outDir, 'dietly-banner-v2.jpg');
    await sharp(buf).jpeg({ quality: 98, chromaSubsampling: '4:4:4' }).toFile(jpgPath);
    const jpgSize = fs.statSync(jpgPath).size;
    console.log(`  ✅ JPEG → ${jpgPath}  (${(jpgSize / 1048576).toFixed(1)} MB)`);
  } catch (e) { console.warn('  ⚠ JPEG failed:', e.message); }

  console.log('\n  ✅ Done! Banner output in: ' + outDir);
  console.log('────────────────────────────────────────\n');
}


// ─────────────────────────────────────
//  HELPER: Zomato Badge (top-left)
// ─────────────────────────────────────
function drawZomatoBadge(ctx, x, y) {
  const bW = 1400;
  const bH = 300;
  const r = 36;

  // White pill with red border
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, bW, bH, r);
  ctx.fillStyle = C.white;
  ctx.fill();
  ctx.strokeStyle = C.zomato;
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.restore();

  // Red dot
  ctx.beginPath();
  ctx.arc(x + 100, y + bH / 2, 44, 0, Math.PI * 2);
  ctx.fillStyle = C.zomato;
  ctx.fill();

  // "Available on" small text
  ctx.font = '400 72px "Segoe UI"';
  ctx.fillStyle = C.textLight;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Available on', x + 180, y + 30);

  // "zomato" large text
  ctx.font = 'bold 130px "Segoe UI"';
  ctx.fillStyle = C.zomato;
  ctx.textBaseline = 'bottom';
  ctx.fillText('zomato', x + 180, y + bH - 22);
}


// ─────────────────────────────────────
//  HELPER: Swiggy Badge (top-right)
// ─────────────────────────────────────
function drawSwiggyBadge(ctx, x, y) {
  const bW = 1400;
  const bH = 300;
  const r = 36;

  // White pill with orange border
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, bW, bH, r);
  ctx.fillStyle = C.white;
  ctx.fill();
  ctx.strokeStyle = C.swiggy;
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.restore();

  // Orange dot
  ctx.beginPath();
  ctx.arc(x + 100, y + bH / 2, 44, 0, Math.PI * 2);
  ctx.fillStyle = C.swiggy;
  ctx.fill();

  // "Available on" small text
  ctx.font = '400 72px "Segoe UI"';
  ctx.fillStyle = C.textLight;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Available on', x + 180, y + 30);

  // "Swiggy" large text
  ctx.font = 'bold 130px "Segoe UI"';
  ctx.fillStyle = C.swiggy;
  ctx.textBaseline = 'bottom';
  ctx.fillText('Swiggy', x + 180, y + bH - 22);
}


// ─────────────────────────────────────
//  HELPER: Phone icon (simple circle+phone)
// ─────────────────────────────────────
function drawPhoneIcon(ctx, x, y, r) {
  // Orange circle background
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = C.orange;
  ctx.fill();

  // Phone symbol (simple receiver shape)
  ctx.font = `${r}px "Segoe UI"`;
  ctx.fillStyle = C.white;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✆', x, y + 2);
  ctx.restore();
}


// ─────────────────────────────────────
//  HELPER: Globe icon (simple circle+lines)
// ─────────────────────────────────────
function drawGlobeIcon(ctx, x, y, r) {
  ctx.save();

  // Orange circle background
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = C.orange;
  ctx.fill();

  // Globe lines
  ctx.strokeStyle = C.white;
  ctx.lineWidth = 4;

  // Outer circle
  ctx.beginPath();
  ctx.arc(x, y, r * 0.65, 0, Math.PI * 2);
  ctx.stroke();

  // Horizontal line
  ctx.beginPath();
  ctx.moveTo(x - r * 0.65, y);
  ctx.lineTo(x + r * 0.65, y);
  ctx.stroke();

  // Vertical ellipse
  ctx.beginPath();
  ctx.ellipse(x, y, r * 0.3, r * 0.65, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}


// ── Run ──
generateBanner().catch(err => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
