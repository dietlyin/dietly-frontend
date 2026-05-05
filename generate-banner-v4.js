/**
 * Dietly Banner v4 — PREMIUM PRINT BANNER
 * ────────────────────────────────────────
 * 10800 × 7200 px  (36 × 24 in @ 300 DPI)
 *
 * Layout (top → bottom):
 *   ┌────────────────────────────────────────┐
 *   │ ▓▓▓▓▓▓ GREEN TOP BAR ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
 *   │ [Zomato]                    [Swiggy]   │
 *   │                                        │
 *   │           ╔══════════════╗              │
 *   │           ║    DIETLY    ║              │
 *   │           ╚══════════════╝              │
 *   │    "Supporting your fitness goals       │
 *   │               daily..!"                 │
 *   │     Fresh • Healthy • Delivered         │
 *   │                                         │
 *   │   ┌──────────┐     ┌──────────┐        │
 *   │   │  PANEER  │     │  MASALA  │        │
 *   │   │  BHURJI  │     │ SPROUTS  │        │
 *   │   └──────────┘     └──────────┘        │
 *   │                                         │
 *   │ ▓▓ 📞 9011154118 │ 🌐 dietly.in ▓▓▓▓  │
 *   │ ▓ Chef-Crafted | Macro-Balanced ▓▓▓▓  │
 *   └────────────────────────────────────────┘
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

// ── Assets ──
const DIETLY_DIR = path.join(__dirname, 'frontend', 'src', 'assets', 'dietly');
const LOGO_PATH  = path.join(DIETLY_DIR, 'dietly logo text new.png');
const FOOD_LEFT  = path.join(DIETLY_DIR, 'paneer bhurji.jpg');
const FOOD_RIGHT = path.join(DIETLY_DIR, 'masala chana sprouts.jpg');

// ── Brand Colors ──
const C = {
  green:      '#1B7A2B',
  greenDark:  '#145E22',
  greenLight: '#22C55E',
  greenPale:  '#E8F5E9',
  greenMint:  '#F0FAF0',
  orange:     '#F97316',
  white:      '#FFFFFF',
  cream:      '#FFFDF8',
  textDark:   '#1A1A1A',
  textMed:    '#444444',
  textSub:    '#777777',
  zomato:     '#E23744',
  swiggy:     '#FC8019',
};


async function generate() {
  console.log('═══════════════════════════════════════════');
  console.log('  DIETLY BANNER v4 — Premium Print Banner');
  console.log('  10800 × 7200 px  |  300 DPI  |  36×24 in');
  console.log('═══════════════════════════════════════════\n');

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  1. BACKGROUND
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  step(1, 'Background');

  // White → soft mint gradient (vertical)
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0,    '#FFFFFF');
  bg.addColorStop(0.3,  '#FEFFFE');
  bg.addColorStop(0.5,  '#F8FDF8');
  bg.addColorStop(0.8,  '#F2FAF2');
  bg.addColorStop(1,    '#EDF7ED');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Soft warm glow behind center (where logo sits)
  const glow = ctx.createRadialGradient(W / 2, H * 0.25, 100, W / 2, H * 0.25, 2800);
  glow.addColorStop(0, 'rgba(255, 252, 242, 0.5)');
  glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  2. TOP GREEN BAR
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  step(2, 'Top bar');

  const topBarH = 90;
  ctx.fillStyle = C.green;
  ctx.fillRect(0, 0, W, topBarH);
  ctx.fillStyle = C.orange;
  ctx.fillRect(0, topBarH, W, 12);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  3. ZOMATO & SWIGGY BADGES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  step(3, 'Partner badges');

  const badgeY = topBarH + 12 + 70;
  drawBadge(ctx, SAFE + 40, badgeY, 'zomato', C.zomato);
  drawBadge(ctx, W - SAFE - 1500, badgeY, 'Swiggy', C.swiggy);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  4. LOGO — Centered, large, sharp
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  step(4, 'Logo');

  const logoAreaTop = badgeY + 350;
  let logoBottomY = logoAreaTop + 700; // fallback

  try {
    const logo = await loadImage(LOGO_PATH);
    // Logo width: ~50% of canvas for prominence
    const logoMaxW = 5000;
    const scale = logoMaxW / logo.width;
    const logoW = logo.width * scale;
    const logoH = logo.height * scale;
    const logoX = (W - logoW) / 2;
    const logoY = logoAreaTop;

    ctx.drawImage(logo, logoX, logoY, logoW, logoH);
    logoBottomY = logoY + logoH;
  } catch (e) {
    console.warn('  ⚠ Logo failed, text fallback');
    ctx.font = 'bold 500px "Segoe UI"';
    ctx.fillStyle = C.green;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DIETLY', W / 2, logoAreaTop + 350);
    logoBottomY = logoAreaTop + 700;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  5. TAGLINE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  step(5, 'Tagline');

  const tagAreaTop = logoBottomY + 100;

  // Decorative green line + diamond
  const lineW = 900;
  const lineY = tagAreaTop;
  ctx.strokeStyle = C.greenLight;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - lineW / 2, lineY);
  ctx.lineTo(W / 2 + lineW / 2, lineY);
  ctx.stroke();
  ctx.fillStyle = C.greenLight;
  ctx.save();
  ctx.translate(W / 2, lineY);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-16, -16, 32, 32);
  ctx.restore();

  // Main tagline — bold, large
  const tagTextY = lineY + 80;
  ctx.font = 'bold 180px "Segoe UI"';
  ctx.fillStyle = C.textDark;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('"Supporting your fitness goals daily..!"', W / 2, tagTextY);

  // Sub tagline
  const subTagY = tagTextY + 260;
  ctx.font = '400 110px "Segoe UI"';
  ctx.fillStyle = C.textSub;
  ctx.fillText('Fresh  •  Healthy  •  Delivered to your door', W / 2, subTagY);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  6. FOOD IMAGES — Two large panels
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  step(6, 'Food images');

  const foodAreaTop = subTagY + 250;
  const foodAreaBottom = H - 640; // leave room for contact bars
  const foodImgH = foodAreaBottom - foodAreaTop;
  const foodImgW = 4200; // each image wider, less center gap
  const foodGap = W - 2 * foodImgW - 2 * SAFE - 200; // gap between images
  const foodRadius = 50;

  const foodLeftX = SAFE + 100;
  const foodRightX = W - SAFE - 100 - foodImgW;

  // LEFT — Paneer Bhurji
  try {
    const imgL = await loadImage(FOOD_LEFT);
    drawFoodCard(ctx, imgL, foodLeftX, foodAreaTop, foodImgW, foodImgH, foodRadius);
  } catch (e) { console.warn('  ⚠ Left food failed'); }

  // (no label — food images are self-explanatory)

  // RIGHT — Masala Sprouts
  try {
    const imgR = await loadImage(FOOD_RIGHT);
    drawFoodCard(ctx, imgR, foodRightX, foodAreaTop, foodImgW, foodImgH, foodRadius);
  } catch (e) { console.warn('  ⚠ Right food failed'); }

  // (no label — food images are self-explanatory)

  // Clean gap between images — no clutter

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  7. CONTACT BAR — Bold green band
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  step(7, 'Contact bar');

  const contactBarH = 380;
  const contactBarY = H - 200 - contactBarH;

  // Green band
  ctx.fillStyle = C.green;
  ctx.fillRect(0, contactBarY, W, contactBarH);

  // Orange accent on top
  ctx.fillStyle = C.orange;
  ctx.fillRect(0, contactBarY, W, 10);

  const contactMid = contactBarY + contactBarH / 2;

  // PHONE — left
  drawIconCircle(ctx, W * 0.2 - 300, contactMid, 90, C.orange, '✆');
  ctx.font = 'bold 220px "Segoe UI"';
  ctx.fillStyle = C.white;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('9011154118', W * 0.2 - 170, contactMid + 10);

  // Separator line
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(W / 2 - 4, contactBarY + 50, 8, contactBarH - 100);

  // WEBSITE — right
  drawIconCircle(ctx, W * 0.67 - 300, contactMid, 90, C.orange, '◉');
  ctx.font = 'bold 220px "Segoe UI"';
  ctx.fillStyle = C.white;
  ctx.textAlign = 'left';
  ctx.fillText('www.dietly.in', W * 0.67 - 170, contactMid + 10);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  8. BOTTOM STRIP — USPs
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  step(8, 'Bottom strip');

  const stripH = 190;
  const stripY = H - stripH;

  ctx.fillStyle = C.greenDark;
  ctx.fillRect(0, stripY, W, stripH);
  ctx.fillStyle = C.orange;
  ctx.fillRect(0, stripY, W, 6);

  ctx.font = 'bold 80px "Segoe UI"';
  ctx.fillStyle = C.white;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    'Chef-Crafted   |   Macro-Balanced   |   Preservative Free   |   Delivered Daily',
    W / 2, stripY + stripH / 2 + 5
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  EXPORT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n  Exporting...');

  const outDir = path.join(__dirname, 'banner-output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const buf = canvas.toBuffer('image/png');

  const pngFile = path.join(outDir, 'dietly-banner-v4.png');
  fs.writeFileSync(pngFile, buf);
  fileLog('PNG', pngFile, buf.length);

  try {
    const tiffFile = path.join(outDir, 'dietly-banner-v4.tiff');
    await sharp(buf).tiff({ compression: 'lzw', quality: 100 }).toFile(tiffFile);
    fileLog('TIFF', tiffFile, fs.statSync(tiffFile).size);
  } catch (e) { console.warn('  ⚠ TIFF:', e.message); }

  try {
    const jpgFile = path.join(outDir, 'dietly-banner-v4.jpg');
    await sharp(buf).jpeg({ quality: 98, chromaSubsampling: '4:4:4' }).toFile(jpgFile);
    fileLog('JPEG', jpgFile, fs.statSync(jpgFile).size);
  } catch (e) { console.warn('  ⚠ JPEG:', e.message); }

  try {
    await sharp(buf).resize(1620, 1080).jpeg({ quality: 88 }).toFile(path.join(outDir, 'preview-v4.jpg'));
    console.log('  ✅ Preview saved');
  } catch (e) {}

  console.log('\n  ✅ Done!  →  ' + outDir);
  console.log('═══════════════════════════════════════════\n');
}


// ════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════

/** Draw food image in a clean rounded card with frame + shadow */
function drawFoodCard(ctx, img, x, y, w, h, r) {
  // Drop shadow
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x + 15, y + 18, w, h, r);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
  ctx.fill();
  ctx.restore();

  // White frame
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x - 10, y - 10, w + 20, h + 20, r + 6);
  ctx.fillStyle = C.white;
  ctx.fill();
  ctx.strokeStyle = C.greenLight;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.restore();

  // Clip & draw image (cover fit)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.clip();
  drawCover(ctx, img, x, y, w, h);
  ctx.restore();
}

/** Draw image as cover (fill & crop) */
function drawCover(ctx, img, x, y, w, h) {
  const ir = img.width / img.height;
  const br = w / h;
  let sx, sy, sw, sh;
  if (ir > br) {
    sh = img.height; sw = sh * br;
    sx = (img.width - sw) / 2; sy = 0;
  } else {
    sw = img.width; sh = sw / br;
    sx = 0; sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/** Partner badge */
function drawBadge(ctx, x, y, name, color) {
  const bW = 1400, bH = 300, r = 36;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, bW, bH, r);
  ctx.fillStyle = C.white;
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.restore();

  // Color dot
  ctx.beginPath();
  ctx.arc(x + 100, y + bH / 2, 44, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.font = '400 70px "Segoe UI"';
  ctx.fillStyle = C.textSub;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Available on', x + 175, y + 28);

  ctx.font = 'bold 130px "Segoe UI"';
  ctx.fillStyle = color;
  ctx.textBaseline = 'bottom';
  ctx.fillText(name, x + 175, y + bH - 20);
}

/** Small icon in colored circle */
function drawIconCircle(ctx, x, y, r, bgColor, symbol) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = bgColor;
  ctx.fill();
  ctx.font = `bold ${r}px "Segoe UI"`;
  ctx.fillStyle = C.white;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, x, y + 3);
  ctx.restore();
}

function step(n, label) { console.log(`  [${n}/8] ${label}...`); }
function fileLog(t, p, b) { console.log(`  ✅ ${t.padEnd(4)} → ${p}  (${(b / 1048576).toFixed(1)} MB)`); }

generate().catch(err => { console.error('❌', err); process.exit(1); });
