/**
 * Dietly Banner v3 — PREMIUM FOOD BRAND AD
 * ──────────────────────────────────────────
 * 10800 × 7200 px  (3:2, 3 ft × 2 ft @ 300 DPI)
 *
 * Layout (inspired by Zomato/Swiggy ads):
 *   ┌─────────────────────────────────────────────┐
 *   │ ■■■■■■■■  GREEN BAR  ■■■■■■■■■■■■■■■■■■■■  │
 *   │ [Zomato]                          [Swiggy]  │
 *   │                                             │
 *   │  ┌──────┐     D I E T L Y      ┌──────┐    │
 *   │  │ FOOD │     ─── ◆ ───        │ FOOD │    │
 *   │  │ IMG  │   "Tagline here"      │ IMG  │    │
 *   │  │  1   │  Fresh • Healthy      │  2   │    │
 *   │  └──────┘                       └──────┘    │
 *   │                                             │
 *   │ ■■■  📞 9011154118  |  🌐 www.dietly.in  ■■ │
 *   └─────────────────────────────────────────────┘
 */

const { createCanvas, loadImage, registerFont } = require('canvas');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// ── Canvas ──
const W = 10800;
const H = 7200;
const SAFE = 200;

// ── Fonts ──
registerFont('C:\\Windows\\Fonts\\segoeui.ttf',  { family: 'Segoe UI', weight: '400' });
registerFont('C:\\Windows\\Fonts\\segoeuib.ttf', { family: 'Segoe UI', weight: '700' });
registerFont('C:\\Windows\\Fonts\\segoeuil.ttf', { family: 'Segoe UI', weight: '300' });
registerFont('C:\\Windows\\Fonts\\arialbd.ttf',  { family: 'Arial',    weight: '700' });

// ── Assets ──
const DIETLY_DIR = path.join(__dirname, 'frontend', 'src', 'assets', 'dietly');
const LOGO_PATH  = path.join(DIETLY_DIR, 'dietly logo text new.png');

// Two hero food images (best quality, white-ish backgrounds)
const FOOD_LEFT  = path.join(DIETLY_DIR, 'paneer bhurji.jpg');
const FOOD_RIGHT = path.join(DIETLY_DIR, 'masala chana sprouts.jpg');

// ── Brand Colors ──
const C = {
  bgWhite:    '#FFFFFF',
  bgCream:    '#FDFBF7',
  bgMint:     '#F5FDF5',
  green:      '#1B7A2B',
  greenDark:  '#0F5C1C',
  greenLight: '#22C55E',
  greenPale:  '#E8F5E9',
  orange:     '#F97316',
  orangeDark: '#EA580C',
  white:      '#FFFFFF',
  textDark:   '#1A1A1A',
  textMed:    '#3D3D3D',
  textSub:    '#6B6B6B',
  zomato:     '#E23744',
  swiggy:     '#FC8019',
};


async function generateBanner() {
  console.log('═══════════════════════════════════════');
  console.log('  DIETLY BANNER v3 — Premium Food Ad');
  console.log('  10800 × 7200 px | 300 DPI | 3×2 ft');
  console.log('═══════════════════════════════════════\n');

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // ─────────────────────────────────────
  //  1. BACKGROUND — Clean light gradient
  // ─────────────────────────────────────
  log(1, 'Background');

  // Solid white base
  ctx.fillStyle = C.bgWhite;
  ctx.fillRect(0, 0, W, H);

  // Subtle warm cream radial glow from center
  const warmCenter = ctx.createRadialGradient(W / 2, H * 0.45, 300, W / 2, H * 0.45, W * 0.55);
  warmCenter.addColorStop(0, 'rgba(255, 250, 240, 0.6)');
  warmCenter.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = warmCenter;
  ctx.fillRect(0, 0, W, H);

  // Very light green tint along edges
  const edgeTint = ctx.createLinearGradient(0, 0, W, 0);
  edgeTint.addColorStop(0,    'rgba(232, 245, 233, 0.3)');
  edgeTint.addColorStop(0.15, 'rgba(255, 255, 255, 0)');
  edgeTint.addColorStop(0.85, 'rgba(255, 255, 255, 0)');
  edgeTint.addColorStop(1,    'rgba(232, 245, 233, 0.3)');
  ctx.fillStyle = edgeTint;
  ctx.fillRect(0, 0, W, H);

  // ─────────────────────────────────────
  //  2. TOP GREEN BAR + ORANGE ACCENT
  // ─────────────────────────────────────
  log(2, 'Top bar');

  ctx.fillStyle = C.green;
  ctx.fillRect(0, 0, W, 90);
  ctx.fillStyle = C.orange;
  ctx.fillRect(0, 90, W, 14);

  // ─────────────────────────────────────
  //  3. ZOMATO & SWIGGY BADGES
  // ─────────────────────────────────────
  log(3, 'Partner badges');

  const badgeY = 160;
  drawZomatoBadge(ctx, SAFE + 40, badgeY);
  drawSwiggyBadge(ctx, W - SAFE - 1500, badgeY);

  // ─────────────────────────────────────
  //  4. FOOD IMAGE — LEFT (large, clean)
  // ─────────────────────────────────────
  log(4, 'Food images');

  // Food images in rounded rectangles on left and right sides
  const foodTopY = H * 0.22;
  const foodW = 2800;
  const foodH = 3200;
  const foodRadius = 60;

  // LEFT food image
  try {
    const imgL = await loadImage(FOOD_LEFT);
    const fx = SAFE + 100;
    const fy = foodTopY;

    // Soft shadow behind
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(fx + 20, fy + 25, foodW, foodH, foodRadius);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fill();
    ctx.restore();

    // White border frame
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(fx - 12, fy - 12, foodW + 24, foodH + 24, foodRadius + 8);
    ctx.fillStyle = C.white;
    ctx.fill();
    ctx.strokeStyle = C.greenLight;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();

    // Clip & draw image
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(fx, fy, foodW, foodH, foodRadius);
    ctx.clip();
    drawCover(ctx, imgL, fx, fy, foodW, foodH);
    ctx.restore();

    // Label below
    ctx.font = 'bold 80px "Segoe UI"';
    ctx.fillStyle = C.textDark;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Paneer Bhurji', fx + foodW / 2, fy + foodH + 40);
  } catch (e) {
    console.warn('  ⚠ Left food image failed');
  }

  // RIGHT food image
  try {
    const imgR = await loadImage(FOOD_RIGHT);
    const fx = W - SAFE - 100 - foodW;
    const fy = foodTopY;

    // Shadow
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(fx + 20, fy + 25, foodW, foodH, foodRadius);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fill();
    ctx.restore();

    // White border frame
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(fx - 12, fy - 12, foodW + 24, foodH + 24, foodRadius + 8);
    ctx.fillStyle = C.white;
    ctx.fill();
    ctx.strokeStyle = C.greenLight;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();

    // Clip & draw
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(fx, fy, foodW, foodH, foodRadius);
    ctx.clip();
    drawCover(ctx, imgR, fx, fy, foodW, foodH);
    ctx.restore();

    // Label below
    ctx.font = 'bold 80px "Segoe UI"';
    ctx.fillStyle = C.textDark;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Masala Sprouts', fx + foodW / 2, fy + foodH + 40);
  } catch (e) {
    console.warn('  ⚠ Right food image failed');
  }

  // ─────────────────────────────────────
  //  5. CENTER — LOGO (large, green)
  // ─────────────────────────────────────
  log(5, 'Logo');

  // Center column area
  const centerX = W / 2;
  const logoTargetY = H * 0.24;

  try {
    const logo = await loadImage(LOGO_PATH);
    const logoMaxW = 3200;
    const logoScale = logoMaxW / logo.width;
    const logoW = logo.width * logoScale;
    const logoH = logo.height * logoScale;
    const logoX = centerX - logoW / 2;

    ctx.drawImage(logo, logoX, logoTargetY, logoW, logoH);
  } catch (e) {
    console.warn('  ⚠ Logo failed, text fallback');
    ctx.font = 'bold 440px "Segoe UI"';
    ctx.fillStyle = C.green;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DIETLY', centerX, logoTargetY + 250);
  }

  // ─────────────────────────────────────
  //  6. TAGLINE — Big, bold, centered
  // ─────────────────────────────────────
  log(6, 'Tagline');

  const tagY = H * 0.47;

  // Decorative divider
  const divW = 700;
  ctx.strokeStyle = C.greenLight;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(centerX - divW / 2, tagY - 80);
  ctx.lineTo(centerX + divW / 2, tagY - 80);
  ctx.stroke();

  // Diamond accent
  ctx.fillStyle = C.greenLight;
  ctx.save();
  ctx.translate(centerX, tagY - 80);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-14, -14, 28, 28);
  ctx.restore();

  // Main tagline
  ctx.font = 'bold 170px "Segoe UI"';
  ctx.fillStyle = C.textDark;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('"Supporting your fitness', centerX, tagY);
  ctx.fillText('goals daily..!"', centerX, tagY + 210);

  // Sub tagline
  ctx.font = '400 100px "Segoe UI"';
  ctx.fillStyle = C.textSub;
  ctx.fillText('Fresh  •  Healthy  •  Delivered to your door', centerX, tagY + 480);

  // ─────────────────────────────────────
  //  7. CONTACT BAR — Large green band
  // ─────────────────────────────────────
  log(7, 'Contact bar');

  const barY = H - 550;
  const barH = 370;

  // Green band
  ctx.fillStyle = C.green;
  ctx.fillRect(0, barY, W, barH);

  // Orange accent on top
  ctx.fillStyle = C.orange;
  ctx.fillRect(0, barY, W, 10);

  const barMid = barY + barH / 2;

  // Phone — LEFT
  drawPhoneIcon(ctx, W * 0.22 - 380, barMid, 85);
  ctx.font = 'bold 220px "Segoe UI"';
  ctx.fillStyle = C.white;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('9011154118', W * 0.22 - 260, barMid + 8);

  // Separator
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(W / 2 - 4, barY + 50, 8, barH - 100);

  // Website — RIGHT
  drawGlobeIcon(ctx, W * 0.68 - 380, barMid, 85);
  ctx.font = 'bold 220px "Segoe UI"';
  ctx.fillStyle = C.white;
  ctx.textAlign = 'left';
  ctx.fillText('www.dietly.in', W * 0.68 - 260, barMid + 8);

  // ─────────────────────────────────────
  //  8. BOTTOM STRIP — Brand USPs
  // ─────────────────────────────────────
  log(8, 'Bottom strip');

  const stripY = H - 180;
  const stripH = 180;

  // Dark green bottom
  ctx.fillStyle = C.greenDark;
  ctx.fillRect(0, stripY, W, stripH);

  // Orange top line
  ctx.fillStyle = C.orange;
  ctx.fillRect(0, stripY, W, 6);

  ctx.font = 'bold 76px "Segoe UI"';
  ctx.fillStyle = C.white;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    'Chef-Crafted   |   Macro-Balanced   |   Preservative Free   |   Delivered Daily',
    W / 2,
    stripY + stripH / 2 + 4
  );

  // ─────────────────────────────────────
  //  EXPORT
  // ─────────────────────────────────────
  console.log('\n  Exporting...');

  const outDir = path.join(__dirname, 'banner-output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const buf = canvas.toBuffer('image/png');

  const pngPath = path.join(outDir, 'dietly-banner-v3.png');
  fs.writeFileSync(pngPath, buf);
  logFile('PNG', pngPath, buf.length);

  try {
    const tiffPath = path.join(outDir, 'dietly-banner-v3.tiff');
    await sharp(buf).tiff({ compression: 'lzw', quality: 100 }).toFile(tiffPath);
    logFile('TIFF', tiffPath, fs.statSync(tiffPath).size);
  } catch (e) { console.warn('  ⚠ TIFF failed:', e.message); }

  try {
    const jpgPath = path.join(outDir, 'dietly-banner-v3.jpg');
    await sharp(buf).jpeg({ quality: 98, chromaSubsampling: '4:4:4' }).toFile(jpgPath);
    logFile('JPEG', jpgPath, fs.statSync(jpgPath).size);
  } catch (e) { console.warn('  ⚠ JPEG failed:', e.message); }

  // Thumbnail
  try {
    await sharp(buf).resize(1080, 720).jpeg({ quality: 85 }).toFile(path.join(outDir, 'preview-v3.jpg'));
    console.log('  ✅ Preview thumb saved');
  } catch (e) {}

  console.log('\n  ✅ All done!');
  console.log('═══════════════════════════════════════\n');
}


// ════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════

/** Draw image as "cover" (fill area, crop excess) */
function drawCover(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx, sy, sw, sh;
  if (imgRatio > boxRatio) {
    sh = img.height;
    sw = sh * boxRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / boxRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/** Zomato badge */
function drawZomatoBadge(ctx, x, y) {
  const bW = 1400, bH = 300, r = 36;

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

  ctx.font = '400 70px "Segoe UI"';
  ctx.fillStyle = C.textSub;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Available on', x + 175, y + 28);

  ctx.font = 'bold 130px "Segoe UI"';
  ctx.fillStyle = C.zomato;
  ctx.textBaseline = 'bottom';
  ctx.fillText('zomato', x + 175, y + bH - 20);
}

/** Swiggy badge */
function drawSwiggyBadge(ctx, x, y) {
  const bW = 1400, bH = 300, r = 36;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, bW, bH, r);
  ctx.fillStyle = C.white;
  ctx.fill();
  ctx.strokeStyle = C.swiggy;
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(x + 100, y + bH / 2, 44, 0, Math.PI * 2);
  ctx.fillStyle = C.swiggy;
  ctx.fill();

  ctx.font = '400 70px "Segoe UI"';
  ctx.fillStyle = C.textSub;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Available on', x + 175, y + 28);

  ctx.font = 'bold 130px "Segoe UI"';
  ctx.fillStyle = C.swiggy;
  ctx.textBaseline = 'bottom';
  ctx.fillText('Swiggy', x + 175, y + bH - 20);
}

/** Phone icon */
function drawPhoneIcon(ctx, x, y, r) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = C.orange;
  ctx.fill();
  ctx.font = `${r}px "Segoe UI"`;
  ctx.fillStyle = C.white;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✆', x, y + 3);
  ctx.restore();
}

/** Globe icon */
function drawGlobeIcon(ctx, x, y, r) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = C.orange;
  ctx.fill();
  ctx.strokeStyle = C.white;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - r * 0.6, y);
  ctx.lineTo(x + r * 0.6, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(x, y, r * 0.28, r * 0.6, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function log(n, label) { console.log(`  [${n}/8] ${label}...`); }
function logFile(type, p, bytes) {
  console.log(`  ✅ ${type.padEnd(4)} → ${p}  (${(bytes / 1048576).toFixed(1)} MB)`);
}

// ── Run ──
generateBanner().catch(err => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
