// Generates PWA icons, apple-touch-icon and favicon from public/icons/icon.svg.
// Run with: npm run icons
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = path.join(root, "public/icons");
const svg = await fs.readFile(path.join(iconsDir, "icon.svg"));

// Full-bleed square variant (no rounded corners) for maskable / apple icons:
// the OS applies its own mask.
const squareSvg = Buffer.from(svg.toString().replace('rx="116"', 'rx="0"'));
// Maskable icons get cropped to a circle: shrink the mascot into the safe zone.
const maskableSvg = Buffer.from(
  squareSvg.toString().replace('translate(31 22) scale(2.25)', 'translate(76 71) scale(1.8)'),
);

async function png(source, size, file) {
  const img = sharp(source, { density: 384 }).resize(size, size);
  const buf = await img.png().toBuffer();
  if (file) await fs.writeFile(path.join(iconsDir, file), buf);
  console.log(`✓ ${file ?? "buffer"} (${size}x${size})`);
  return buf;
}

await png(svg, 192, "icon-192.png");
await png(svg, 512, "icon-512.png");
await png(maskableSvg, 192, "maskable-192.png");
await png(maskableSvg, 512, "maskable-512.png");
await png(squareSvg, 180, "apple-touch-icon.png");

// favicon.ico with embedded PNGs (16, 32, 48).
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(svg, s)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = 6 + 16 * images.length;
const entries = images.map((buf, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i], 0);
  e.writeUInt8(sizes[i], 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(buf.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += buf.length;
  return e;
});
await fs.writeFile(path.join(root, "app/favicon.ico"), Buffer.concat([header, ...entries, ...images]));
console.log("✓ app/favicon.ico");
