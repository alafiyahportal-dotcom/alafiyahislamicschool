const sharp = require('C:/alafiyahislamicschool/node_modules/sharp');
const fs = require('fs');
const path = require('path');

const userUploadedDir = 'C:/Users/HP/.gemini/antigravity-ide/brain/093a45ae-4f3f-4bf2-9e90-4aa0a17fe6e6/.user_uploaded/';
const outDir = 'C:/alafiyahislamicschool/public/images/hero';

async function extractClean(filename, destName, { blurSigma = 0, thresholdMin = 14, thresholdMax = 30 } = {}) {
  const srcPath = path.join(userUploadedDir, filename);
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const out = Buffer.alloc(width * height * 4);

  // 1. Thresholding and un-premultiplying black background
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];

    const maxVal = Math.max(r, g, b);

    if (maxVal <= thresholdMin) {
      out[i * 4] = 0;
      out[i * 4 + 1] = 0;
      out[i * 4 + 2] = 0;
      out[i * 4 + 3] = 0;
    } else if (maxVal >= thresholdMax) {
      out[i * 4] = r;
      out[i * 4 + 1] = g;
      out[i * 4 + 2] = b;
      out[i * 4 + 3] = 255;
    } else {
      const a = (maxVal - thresholdMin) / (thresholdMax - thresholdMin);
      out[i * 4] = Math.min(255, Math.round(r / a));
      out[i * 4 + 1] = Math.min(255, Math.round(g / a));
      out[i * 4 + 2] = Math.min(255, Math.round(b / a));
      out[i * 4 + 3] = Math.round(a * 255);
    }
  }

  // 2. Connected component analysis to drop detached jpeg noise speckles
  const visited = new Uint8Array(width * height);
  const components = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (visited[idx] || out[idx * 4 + 3] === 0) continue;

      const comp = [];
      const queue = [x, y];
      visited[idx] = 1;
      let head = 0;

      while (head < queue.length) {
        const cx = queue[head++];
        const cy = queue[head++];
        comp.push(cy * width + cx);

        for (const [nx, ny] of [[cx-1, cy], [cx+1, cy], [cx, cy-1], [cx, cy+1]]) {
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const ni = ny * width + nx;
            if (!visited[ni] && out[ni * 4 + 3] > 0) {
              visited[ni] = 1;
              queue.push(nx, ny);
            }
          }
        }
      }
      components.push(comp);
    }
  }

  // Keep major component (> 200 pixels)
  const keep = new Set();
  for (const c of components) {
    if (c.length > 200) {
      c.forEach(i => keep.add(i));
    }
  }

  for (let i = 0; i < width * height; i++) {
    if (!keep.has(i)) {
      out[i * 4 + 3] = 0;
    }
  }

  // 3. Smooth anti-alias edge
  const feathered = Buffer.from(out);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      if (out[i * 4 + 3] > 0) {
        let empty = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (out[((y + dy) * width + (x + dx)) * 4 + 3] === 0) empty++;
          }
        }
        if (empty >= 3) {
          feathered[i * 4 + 3] = Math.round(feathered[i * 4 + 3] * (1 - empty / 10));
        }
      }
    }
  }

  let pipeline = sharp(feathered, { raw: { width, height, channels: 4 } }).trim();

  if (blurSigma > 0) {
    pipeline = pipeline.blur(blurSigma);
  }

  const destPath = path.join(outDir, destName);
  await pipeline.png().toFile(destPath);
  console.log(`Extracted & saved HD asset to ${destPath}`);
}

async function run() {
  // 1. HD Quran (Sharp, no blur)
  await extractClean('media_1792166903617.jpg', 'smp-elem-quran.png', {
    blurSigma: 0,
    thresholdMin: 14,
    thresholdMax: 30
  });

  // 2. HD Trophy (Slightly blurred for 3D depth of field, as requested)
  await extractClean('media_1792166903653.jpg', 'smp-elem-trophy.png', {
    blurSigma: 1.5,
    thresholdMin: 14,
    thresholdMax: 30
  });

  // 3. HD Leaf (Slightly blurred for organic depth of field, as requested)
  await extractClean('media_1792166903587.jpg', 'smp-elem-leaf.png', {
    blurSigma: 1.5,
    thresholdMin: 12,
    thresholdMax: 28
  });

  // Remove cropped/obsolete medal file if present
  const medalPath = path.join(outDir, 'smp-elem-medal.png');
  if (fs.existsSync(medalPath)) {
    fs.unlinkSync(medalPath);
    console.log('Removed obsolete cropped medal asset:', medalPath);
  }

  console.log('All HD assets successfully extracted and placed in public/images/hero!');
}

run().catch(console.error);
