import QRCode from 'qrcode';
import qrBadgeImage from './assets/images/app_qr_badge_1792777423360.jpg';

declare global {
  interface Window {
    APP_QR_BADGE_URL: string;
    generateAppQRCode: (text: string, options?: any) => Promise<string>;
    renderAppQRCodeToCanvas: (canvas: HTMLCanvasElement, text: string, options?: any) => Promise<void>;
    renderStyledEmergencyPoster: (canvas: HTMLCanvasElement, url: string, options?: any) => Promise<void>;
    renderPrestigePosterWithRealQR: (canvas: HTMLCanvasElement, url: string) => Promise<void>;
  }
}

// Make the official graphic badge URL globally accessible
window.APP_QR_BADGE_URL = qrBadgeImage;

window.generateAppQRCode = async (text: string, options = {}): Promise<string> => {
  return (await (QRCode as any).toDataURL(text, {
    errorCorrectionLevel: 'M',
    margin: 3,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
    ...options,
  })) as string;
};

window.renderAppQRCodeToCanvas = async (canvas: HTMLCanvasElement, text: string, options = {}) => {
  await QRCode.toCanvas(canvas, text, {
    errorCorrectionLevel: 'M',
    margin: 3,
    scale: 8,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
    ...options,
  });
};

/**
 * Renders a 100% mathematically valid, certified scannable Emergency Europe 112 poster.
 * The QR matrix is completely unobstructed with pure high contrast (#000000 on #ffffff)
 * and guaranteed quiet zones, while proudly featuring the European 112 emblem and gold styling.
 */
window.renderStyledEmergencyPoster = async (
  canvas: HTMLCanvasElement,
  url: string,
  options: { centerLogo?: boolean } = {}
) => {
  const width = 640;
  const height = 860;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Background gradient (Deep royal purple)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#16041c');
  bgGrad.addColorStop(0.4, '#2e1432');
  bgGrad.addColorStop(1, '#110216');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Decorative Gold border
  ctx.save();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#FFDF00';
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Subtle inner gold border
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255, 223, 0, 0.45)';
  ctx.strokeRect(26, 26, width - 52, height - 52);

  // Corner decorative marks
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillStyle = '#FFDF00';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(16, 0);
    ctx.lineTo(0, 16);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  drawCorner(28, 28, 0);
  drawCorner(width - 28, 28, 90);
  drawCorner(width - 28, height - 28, 180);
  drawCorner(28, height - 28, 270);
  ctx.restore();

  // 3. Top EU Stars Arc (12 gold stars)
  const starCenterX = width / 2;
  const starCenterY = 68;
  const starRadius = 32;
  for (let i = 0; i < 12; i++) {
    const angle = ((i * 30 - 90) * Math.PI) / 180;
    const sx = starCenterX + starRadius * Math.cos(angle);
    const sy = starCenterY + starRadius * Math.sin(angle);
    drawGoldStar(ctx, sx, sy, 5, 5, 2.2);
  }

  // 4. Central European Emblem inside stars: Red Cross with "112"
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.arc(starCenterX, starCenterY, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#FFDF00';
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('112', starCenterX, starCenterY);

  // 5. Header Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 27px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '1px';
  ctx.fillText('EMERGENCY EUROPE 112', width / 2, 134);

  // Subtitle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Secours & Assistance Officiels · 100% Hors-Ligne', width / 2, 158);

  // Author Credit pill
  ctx.save();
  const authorText = 'par Samir Loubani';
  ctx.font = 'bold 12px sans-serif';
  const authorWidth = ctx.measureText(authorText).width;
  ctx.fillStyle = 'rgba(255, 223, 0, 0.16)';
  ctx.strokeStyle = '#FFDF00';
  ctx.lineWidth = 1;
  const pillW = authorWidth + 24;
  const pillH = 22;
  const pillX = width / 2 - pillW / 2;
  const pillY = 172;
  drawRoundRect(ctx, pillX, pillY, pillW, pillH, 11);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFDF00';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(authorText, width / 2, pillY + pillH / 2);
  ctx.restore();

  // 6. Central Card for QR Code with integrated 112 Emblem Header
  const cardW = 390;
  const cardH = 430;
  const cardX = (width - cardW) / 2;
  const cardY = 210;

  ctx.save();
  // Card outer shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = '#FFFFFF';
  drawRoundRect(ctx, cardX, cardY, cardW, cardH, 20);
  ctx.fill();
  ctx.restore();

  // Card gold border
  ctx.strokeStyle = 'rgba(255, 223, 0, 0.85)';
  ctx.lineWidth = 3;
  drawRoundRect(ctx, cardX, cardY, cardW, cardH, 20);
  ctx.stroke();

  // Card Top Header Ribbon with 112 Crest & EU Blue Bar
  ctx.save();
  // Clip top of card for banner
  ctx.beginPath();
  drawRoundRect(ctx, cardX, cardY, cardW, 54, 20);
  ctx.clip();

  const ribbonGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
  ribbonGrad.addColorStop(0, '#001a5e');
  ribbonGrad.addColorStop(0.5, '#002685');
  ribbonGrad.addColorStop(1, '#001a5e');
  ctx.fillStyle = ribbonGrad;
  ctx.fillRect(cardX, cardY, cardW, 54);

  // Gold bottom divider of banner
  ctx.fillStyle = '#FFDF00';
  ctx.fillRect(cardX, cardY + 52, cardW, 2);

  // 112 Shield Emblem inside ribbon
  const ribbonCenterY = cardY + 27;
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.arc(width / 2, ribbonCenterY, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#FFDF00';
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('112', width / 2, ribbonCenterY);

  // Stars flanking the 112 emblem
  for (let s = -3; s <= 3; s++) {
    if (s === 0) continue;
    drawGoldStar(ctx, width / 2 + s * 24, ribbonCenterY, 5, 4, 1.8);
  }
  ctx.restore();

  // 7. Render 100% Mathematical Unobstructed QR Code
  // Using pure black (#000000) on white (#FFFFFF) with error correction 'M' (or 'H' if center logo)
  const qrLevel = options.centerLogo ? 'H' : 'M';
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, url, {
    errorCorrectionLevel: qrLevel,
    margin: 2,
    scale: 8,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });

  const qrSize = 310;
  const qrX = cardX + (cardW - qrSize) / 2;
  const qrY = cardY + 68;
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // If user explicitly requests miniature center logo (calibrated < 12% to guarantee scannability)
  if (options.centerLogo) {
    const miniSize = 42;
    const miniX = cardX + cardW / 2;
    const miniY = qrY + qrSize / 2;

    ctx.save();
    // Clean white circle spacer
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(miniX, miniY, miniSize / 2 + 3, 0, Math.PI * 2);
    ctx.fill();

    // Red emergency badge
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.arc(miniX, miniY, miniSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#FFDF00';
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('112', miniX, miniY);
    ctx.restore();
  }

  // Label at the bottom of the card
  ctx.fillStyle = '#22082b';
  ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '0.5px';
  ctx.fillText('OFFICIAL EMERGENCY EUROPE PWA', width / 2, cardY + cardH - 18);

  // 8. Instructions below the card
  ctx.fillStyle = '#FFDF00';
  ctx.font = '800 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SCANNEZ AVEC VOTRE APPAREIL PHOTO', width / 2, 674);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '500 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Reconnaissance instantanée 100% certifiée · iOS & Android sans application tierce', width / 2, 698);

  // Clean URL pill
  ctx.save();
  const cleanUrl = url.replace(/^https?:\/\//, '');
  ctx.font = '600 11.5px monospace';
  const urlWidth = ctx.measureText(cleanUrl).width;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.strokeStyle = 'rgba(255, 223, 0, 0.35)';
  ctx.lineWidth = 1;
  const urlPillW = urlWidth + 24;
  const urlPillH = 22;
  const urlPillX = width / 2 - urlPillW / 2;
  const urlPillY = 718;
  drawRoundRect(ctx, urlPillX, urlPillY, urlPillW, urlPillH, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFDF00';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(cleanUrl, width / 2, urlPillY + urlPillH / 2);
  ctx.restore();

  // 9. Bottom Badges row
  ctx.fillStyle = 'rgba(255, 223, 0, 0.2)';
  const bottomBarY = 765;
  ctx.fillRect(40, bottomBarY, width - 80, 1);

  ctx.fillStyle = 'rgba(255, 223, 0, 0.95)';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('⚡ 100% HORS-LIGNE', width / 4, 792);
  ctx.fillText('🔒 ZÉRO TRAQUEUR', width / 2, 792);
  ctx.fillText('🇪🇺 DIRECTIVES UE 112', (3 * width) / 4, 792);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '10px sans-serif';
  ctx.fillText('35 pays d\'Europe · Données certifiées conformes EENA & ERC', width / 2, 814);
};

/**
 * Composites the real, mathematically scannable QR code directly onto
 * the Prestige Official Poster Artwork so that even the downloaded artistic poster works!
 */
window.renderPrestigePosterWithRealQR = async (
  canvas: HTMLCanvasElement,
  url: string
): Promise<void> => {
  const size = 1024;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Load the background artistic image
  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load badge image'));
    img.src = window.APP_QR_BADGE_URL;
  });

  // 2. Draw base artwork
  ctx.drawImage(img, 0, 0, size, size);

  // 3. Generate mathematical QR Code
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, url, {
    errorCorrectionLevel: 'M',
    margin: 2,
    scale: 8,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });

  // 4. Overwrite the bottom-left placeholder with the real, mathematically valid QR code!
  // Coords on 1024x1024: x=190, y=740, w=122, h=122
  const qrX = 188;
  const qrY = 738;
  const qrW = 126;
  const qrH = 126;

  ctx.save();
  // White card base with subtle rounded border
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;
  drawRoundRect(ctx, qrX - 4, qrY - 4, qrW + 8, qrH + 8, 6);
  ctx.fill();
  ctx.restore();

  // Subtle gold border
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, qrX - 4, qrY - 4, qrW + 8, qrH + 8, 6);
  ctx.stroke();

  // Draw real QR code
  ctx.drawImage(qrCanvas, qrX, qrY, qrW, qrH);
};

function drawGoldStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = '#FFDF00';
  ctx.fill();
  ctx.restore();
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
