import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  const checksum = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(checksum, 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generateIconPNG(size, isMaskable = false) {
  const width = size;
  const height = size;
  const bytesPerPixel = 4; // RGBA
  const rawData = Buffer.alloc((width * bytesPerPixel + 1) * height);

  const radius = width * (isMaskable ? 0.40 : 0.45);
  const cx = width / 2;
  const cy = height / 2;

  let pos = 0;
  for (let y = 0; y < height; y++) {
    rawData[pos++] = 0; // Filter type 0: None
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep dark sleek background (#09090b to #18181b gradient)
      let r = 15;
      let g = 17;
      let b = 23;
      let a = 255;

      if (!isMaskable) {
        // Rounded square background
        const cornerR = size * 0.22;
        const qx = Math.max(0, Math.abs(dx) - (size * 0.48 - cornerR));
        const qy = Math.max(0, Math.abs(dy) - (size * 0.48 - cornerR));
        const cornerDist = Math.sqrt(qx * qx + qy * qy);
        if (cornerDist > cornerR) {
          a = 0; // Transparent outside rounded squircle
        }
      }

      if (a > 0) {
        // Background gradient: Indigo / Violet top-left to Slate bottom-right
        const grad = (x + y) / (width + height);
        r = Math.round(79 * (1 - grad) + 16 * grad);   // 79 -> #4f46e5 (indigo-600)
        g = Math.round(70 * (1 - grad) + 24 * grad);
        b = Math.round(229 * (1 - grad) + 40 * grad);

        // Draw an inner glowing checklist / task badge
        // Central box: 45% of width
        const boxSize = size * 0.46;
        const inBox = Math.abs(dx) <= boxSize / 2 && Math.abs(dy) <= boxSize / 2;
        if (inBox) {
          // Checkmark line:
          // start: (-boxSize*0.25, 0) -> midpoint: (-boxSize*0.05, boxSize*0.2) -> end: (boxSize*0.3, -boxSize*0.22)
          const p1 = { x: -boxSize * 0.26, y: 0 };
          const p2 = { x: -boxSize * 0.06, y: boxSize * 0.20 };
          const p3 = { x: boxSize * 0.28, y: -boxSize * 0.22 };

          function distToSegment(px, py, ax, ay, bx, by) {
            const l2 = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
            if (l2 === 0) return Math.hypot(px - ax, py - ay);
            let t = ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / l2;
            t = Math.max(0, Math.min(1, t));
            return Math.hypot(px - (ax + t * (bx - ax)), py - (ay + t * (by - ay)));
          }

          const d1 = distToSegment(dx, dy, p1.x, p1.y, p2.x, p2.y);
          const d2 = distToSegment(dx, dy, p2.x, p2.y, p3.x, p3.y);
          const minD = Math.min(d1, d2);
          const thickness = size * 0.045;

          if (minD <= thickness) {
            // Crisp white checkmark
            const blend = Math.max(0, Math.min(1, (thickness - minD) / 1.5));
            r = Math.round(255 * blend + r * (1 - blend));
            g = Math.round(255 * blend + g * (1 - blend));
            b = Math.round(255 * blend + b * (1 - blend));
          }
        }
      }

      rawData[pos++] = r;
      rawData[pos++] = g;
      rawData[pos++] = b;
      rawData[pos++] = a;
    }
  }

  // Compress IDAT
  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression method
  ihdr[11] = 0; // Filter method
  ihdr[12] = 0; // Interlace method

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 192x192
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generateIconPNG(192, false));
// 512x512
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generateIconPNG(512, false));
// 512x512 maskable (has padded background extending to edge)
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generateIconPNG(512, true));
// 180x180 apple touch icon
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generateIconPNG(180, false));
// favicon
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generateIconPNG(64, false));

console.log('✅ Generated all PWA icons successfully in /public');
