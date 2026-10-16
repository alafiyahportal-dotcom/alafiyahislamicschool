const sharp = require('C:/alafiyahislamicschool/node_modules/sharp');
const fs = require('fs');
const path = require('path');

const src = 'C:/Users/HP/.gemini/antigravity-ide/brain/093a45ae-4f3f-4bf2-9e90-4aa0a17fe6e6/.user_uploaded/media_1792144331525.jpg';
const outDir = 'C:/alafiyahislamicschool/public/images/hero';

function isTealBg(r, g, b) {
  const brightness = (r + g + b) / 3;
  if (brightness < 68 && r < 48 && g < 98 && b < 105) return true;
  return false;
}

// 1. QURAN
async function generateQuran() {
  const { data, info } = await sharp(src)
    .extract({ left: 835, top: 610, width: 165, height: 180 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const out = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const oIdx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];

      out[oIdx] = r;
      out[oIdx + 1] = g;
      out[oIdx + 2] = b;

      // Top line fragment
      if (y < 8 || (y < 14 && x < 65)) {
        out[oIdx + 3] = 0;
        continue;
      }
      // Top-left diagonal cut for letter 'S' outline
      if (x < 18 || (x < 36 && y < 52 && (36 - x) > (52 - y) * 0.8)) {
        out[oIdx + 3] = 0;
        continue;
      }
      // Bottom banner white
      if (y > 165 && x > 85) {
        out[oIdx + 3] = 0;
        continue;
      }

      const isBgTeal = (r < 48 && g < 98 && b < 105);
      const isWhiteText = (r > 190 && g > 190 && b > 190 && (x < 35 || y > 135));

      if (isBgTeal || isWhiteText) {
        out[oIdx + 3] = 0;
      } else {
        out[oIdx + 3] = 255;
      }
    }
  }

  // BFS keep from book seed (100, 100)
  const visited = new Uint8Array(width * height);
  const quranComp = [];
  const queue = [100, 100];
  visited[100 * width + 100] = 1;
  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++], cy = queue[head++];
    quranComp.push(cy * width + cx);
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

  const keep = new Set(quranComp);
  for (let y = 120; y < height; y++) {
    for (let x = 0; x < 65; x++) {
      const i = y * width + x;
      const r = out[i * 4], g = out[i * 4 + 1], b = out[i * 4 + 2];
      if (r > 120 && g > 80 && b < 70) keep.add(i);
    }
  }

  for (let i = 0; i < width * height; i++) {
    if (!keep.has(i)) out[i * 4 + 3] = 0;
  }

  // Feather
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
          feathered[i * 4 + 3] = Math.round(255 * (1 - empty / 10));
        }
      }
    }
  }

  const dest = path.join(outDir, 'smp-elem-quran.png');
  await sharp(feathered, { raw: { width, height, channels: 4 } })
    .trim()
    .png()
    .toFile(dest);
  console.log('Saved:', dest);
}

// 2. TROPHY
async function generateTrophy() {
  const { data, info } = await sharp(src)
    .extract({ left: 695, top: 190, width: 195, height: 235 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const out = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const oIdx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];

      out[oIdx] = r;
      out[oIdx + 1] = g;
      out[oIdx + 2] = b;

      // Cut off frame on left: frame is strictly x < 26
      if (x < 26) {
        out[oIdx + 3] = 0;
        continue;
      }
      // Below base
      if (y > 175 && (x < 45 || x > 140)) {
        out[oIdx + 3] = 0;
        continue;
      }
      if (y > 185) {
        out[oIdx + 3] = 0;
        continue;
      }

      const isGold = (r > 68 && g > 68 && (r + g) > (b * 2.0));
      const isRibbon = (g > 105 && g > r * 1.2);

      if (isGold || isRibbon) {
        out[oIdx + 3] = 255;
      } else {
        out[oIdx + 3] = 0;
      }
    }
  }

  // BFS keep from center seed (100, 100)
  const visited = new Uint8Array(width * height);
  const queue = [100, 100];
  const trophyComp = [];
  visited[100 * width + 100] = 1;
  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++], cy = queue[head++];
    trophyComp.push(cy * width + cx);
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

  const keep = new Set(trophyComp);
  for (let y = 15; y < 180; y++) {
    for (let x = 26; x < 185; x++) {
      const i = y * width + x;
      if (out[i * 4 + 3] > 0) keep.add(i);
    }
  }

  for (let i = 0; i < width * height; i++) {
    if (!keep.has(i)) out[i * 4 + 3] = 0;
  }

  // Feather
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
          feathered[i * 4 + 3] = Math.round(255 * (1 - empty / 9));
        }
      }
    }
  }

  const dest = path.join(outDir, 'smp-elem-trophy.png');
  await sharp(feathered, { raw: { width, height, channels: 4 } })
    .trim()
    .png()
    .toFile(dest);
  console.log('Saved:', dest);
}

// 3. MEDAL (Complete Star Medallion with Symmetry Reconstruction)
async function generateMedal() {
  const { data, info } = await sharp(src)
    .extract({ left: 110, top: 120, width: 130, height: 250 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const out = Buffer.alloc(width * height * 4);

  // First pass: extract ribbon and intact left half of medal star
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const oIdx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];

      out[oIdx] = r;
      out[oIdx + 1] = g;
      out[oIdx + 2] = b;

      // Ribbon bounds: x between 10 and 85, y < 110
      // Medal star bounds: x between 15 and 95, y between 105 and 200
      if (y > 200) {
        out[oIdx + 3] = 0;
        continue;
      }
      if (x < 10) {
        out[oIdx + 3] = 0;
        continue;
      }

      const isBg = (r < 55 && b > 75);
      const isMedalOrRibbon = (r > 65 && (r + g) > (b * 1.75));

      if (isMedalOrRibbon && !isBg) {
        out[oIdx + 3] = 255;
      } else {
        out[oIdx + 3] = 0;
      }
    }
  }

  // BFS keep from ribbon seed (55, 40)
  const visited = new Uint8Array(width * height);
  const queue = [55, 40];
  const medalComp = [];
  visited[40 * width + 55] = 1;
  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++], cy = queue[head++];
    medalComp.push(cy * width + cx);
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

  const keep = new Set(medalComp);
  for (let y = 105; y < 200; y++) {
    for (let x = 15; x <= 60; x++) {
      const i = y * width + x;
      if (out[i * 4 + 3] > 0) keep.add(i);
    }
  }

  for (let i = 0; i < width * height; i++) {
    if (!keep.has(i)) out[i * 4 + 3] = 0;
  }

  // Symmetry reconstruction for the star medallion (y >= 105)
  // Center axis of star is at x = 55
  const centerX = 55;
  for (let y = 105; y < 200; y++) {
    for (let dx = 1; dx <= 38; dx++) {
      const rx = centerX + dx;
      const lx = centerX - dx;
      if (rx < width && lx >= 0) {
        const leftIdx = (y * width + lx) * 4;
        const rightIdx = (y * width + rx) * 4;
        // Mirror from left to right
        out[rightIdx] = out[leftIdx];
        out[rightIdx + 1] = out[leftIdx + 1];
        out[rightIdx + 2] = out[leftIdx + 2];
        out[rightIdx + 3] = out[leftIdx + 3];
      }
    }
  }

  // Feather
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
          feathered[i * 4 + 3] = Math.round(255 * (1 - empty / 9));
        }
      }
    }
  }

  const dest = path.join(outDir, 'smp-elem-medal.png');
  await sharp(feathered, { raw: { width, height, channels: 4 } })
    .trim()
    .png()
    .toFile(dest);
  console.log('Saved:', dest);
}

// 4. LEAF
async function generateLeaf() {
  const { data, info } = await sharp(src)
    .extract({ left: 880, top: 380, width: 144, height: 230 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const out = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const oIdx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];

      out[oIdx] = r;
      out[oIdx + 1] = g;
      out[oIdx + 2] = b;

      const isLeafGreen = (g > 85 && g > r * 1.15 && g > b * 1.15);
      const isThinGrid = (r > 160 && g > 160 && b > 160);

      if (isLeafGreen && !isThinGrid) {
        out[oIdx + 3] = 255;
      } else {
        out[oIdx + 3] = 0;
      }
    }
  }

  const visited = new Uint8Array(width * height);
  let bestComp = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (visited[i] || out[i * 4 + 3] === 0) continue;
      const comp = [];
      const q = [x, y];
      visited[i] = 1;
      let head = 0;
      while (head < q.length) {
        const cx = q[head++], cy = q[head++];
        comp.push(cy * width + cx);
        for (const [nx, ny] of [[cx-1, cy], [cx+1, cy], [cx, cy-1], [cx, cy+1]]) {
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const ni = ny * width + nx;
            if (!visited[ni] && out[ni * 4 + 3] > 0) {
              visited[ni] = 1;
              q.push(nx, ny);
            }
          }
        }
      }
      if (comp.length > bestComp.length) bestComp = comp;
    }
  }

  const keep = new Set(bestComp);
  for (let i = 0; i < width * height; i++) {
    if (!keep.has(i)) out[i * 4 + 3] = 0;
  }

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
          feathered[i * 4 + 3] = Math.round(255 * (1 - empty / 9));
        }
      }
    }
  }

  const dest = path.join(outDir, 'smp-elem-leaf.png');
  await sharp(feathered, { raw: { width, height, channels: 4 } })
    .trim()
    .png()
    .toFile(dest);
  console.log('Saved:', dest);
}

async function run() {
  await generateQuran();
  await generateTrophy();
  await generateMedal();
  await generateLeaf();
  console.log('Finished updating production assets!');
}

run().catch(console.error);
