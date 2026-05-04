import sharp from 'sharp';
import { writeFileSync } from 'fs';

const svgIcon = (size) => {
  const r = size / 2;
  const cx = r;
  const cy = r;
  const rx = r * 0.21;  // border-radius ~21% for rounded square look

  // radar rings radii (% of half-size)
  const r1 = r * 0.73;
  const r2 = r * 0.52;
  const r3 = r * 0.31;

  // sweep line end point (approx 330deg = upper-right)
  const angle = -30 * (Math.PI / 180);
  const lx = (cx + r1 * Math.cos(angle)).toFixed(2);
  const ly = (cy + r1 * Math.sin(angle)).toFixed(2);

  // sweep wedge: from 270deg (top) to 330deg, arc of 60deg
  const startAngle = -90 * (Math.PI / 180);
  const endAngle = -30 * (Math.PI / 180);
  const sx = (cx + r1 * Math.cos(startAngle)).toFixed(2);
  const sy = (cy + r1 * Math.sin(startAngle)).toFixed(2);

  // blip positions
  const b1x = (cx + r2 * 0.6 * Math.cos(endAngle)).toFixed(2);
  const b1y = (cy + r2 * 0.6 * Math.sin(endAngle)).toFixed(2);
  const b2x = (cx + r3 * 1.1 * Math.cos(-55 * Math.PI / 180)).toFixed(2);
  const b2y = (cy + r3 * 1.1 * Math.sin(-55 * Math.PI / 180)).toFixed(2);

  const dot = (r * 0.025).toFixed(1);
  const blip1 = (r * 0.042).toFixed(1);
  const blip2 = (r * 0.027).toFixed(1);
  const sw = (r * 0.016).toFixed(1);
  const cross = (r * 0.01).toFixed(1);
  const ringW = (r * 0.016).toFixed(1);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${rx}" fill="#0f172a"/>
  <line x1="${cx - r1}" y1="${cy}" x2="${cx + r1}" y2="${cy}" stroke="#1e3a5f" stroke-width="${cross}"/>
  <line x1="${cx}" y1="${cy - r1}" x2="${cx}" y2="${cy + r1}" stroke="#1e3a5f" stroke-width="${cross}"/>
  <circle cx="${cx}" cy="${cy}" r="${r1}" fill="none" stroke="#1e3a5f" stroke-width="${ringW}"/>
  <circle cx="${cx}" cy="${cy}" r="${r2}" fill="none" stroke="#1e3a5f" stroke-width="${ringW}"/>
  <circle cx="${cx}" cy="${cy}" r="${r3}" fill="none" stroke="#1e3a5f" stroke-width="${ringW}"/>
  <path d="M${cx} ${cy} L${sx} ${sy} A${r1} ${r1} 0 0 1 ${lx} ${ly} Z" fill="#22d3ee" opacity="0.18"/>
  <line x1="${cx}" y1="${cy}" x2="${lx}" y2="${ly}" stroke="#22d3ee" stroke-width="${sw}" stroke-linecap="round"/>
  <circle cx="${b1x}" cy="${b1y}" r="${blip1}" fill="#22d3ee" opacity="0.95"/>
  <circle cx="${b2x}" cy="${b2y}" r="${blip2}" fill="#22d3ee" opacity="0.65"/>
  <circle cx="${cx}" cy="${cy}" r="${dot}" fill="#22d3ee"/>
</svg>`;
};

const outDir = 'public/icons';

for (const size of [192, 512]) {
  const svg = Buffer.from(svgIcon(size));
  await sharp(svg).png().toFile(`${outDir}/icon-${size}.png`);
  console.log(`✓ icon-${size}.png`);
}

// Also write the raw SVG for browser favicon
writeFileSync(`${outDir}/icon.svg`, svgIcon(512));
console.log('✓ icon.svg');
