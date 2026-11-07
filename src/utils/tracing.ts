/*
 * Handwriting check for the "Learn to write" tab.
 * Pure maths, no network: the child's strokes are compared with the shape of the letter.
 * Everything runs on the child's own phone.
 */

export interface Pt {
  x: number; // 0..1 (left to right)
  y: number; // 0..1 (top to bottom)
}

export const GRID = 120;

/** Turns finger strokes into a grid of "ink" cells (thick line, like a marker). */
export function rasterizeStrokes(strokes: Pt[][], size = GRID, radius = 4): Uint8Array {
  const mask = new Uint8Array(size * size);
  const stamp = (cx: number, cy: number) => {
    const x0 = Math.max(0, Math.floor(cx - radius));
    const x1 = Math.min(size - 1, Math.ceil(cx + radius));
    const y0 = Math.max(0, Math.floor(cy - radius));
    const y1 = Math.min(size - 1, Math.ceil(cy + radius));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy <= radius * radius) mask[y * size + x] = 1;
      }
    }
  };
  for (const stroke of strokes) {
    if (stroke.length === 0) continue;
    if (stroke.length === 1) {
      stamp(stroke[0].x * (size - 1), stroke[0].y * (size - 1));
      continue;
    }
    for (let i = 1; i < stroke.length; i++) {
      const ax = stroke[i - 1].x * (size - 1);
      const ay = stroke[i - 1].y * (size - 1);
      const bx = stroke[i].x * (size - 1);
      const by = stroke[i].y * (size - 1);
      const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay)));
      for (let s = 0; s <= steps; s++) {
        stamp(ax + ((bx - ax) * s) / steps, ay + ((by - ay) * s) / steps);
      }
    }
  }
  return mask;
}

/** Grows every filled cell by `r` cells in each direction (square window, separable and fast). */
export function dilate(mask: Uint8Array, size: number, r: number): Uint8Array {
  const tmp = new Uint8Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!mask[y * size + x]) continue;
      const from = Math.max(0, x - r);
      const to = Math.min(size - 1, x + r);
      for (let xx = from; xx <= to; xx++) tmp[y * size + xx] = 1;
    }
  }
  const out = new Uint8Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!tmp[y * size + x]) continue;
      const from = Math.max(0, y - r);
      const to = Math.min(size - 1, y + r);
      for (let yy = from; yy <= to; yy++) out[yy * size + x] = 1;
    }
  }
  return out;
}

export interface TracingScore {
  /** How much of the letter the child covered (0..1). */
  coverage: number;
  /** How much of the child's ink stayed on the letter (0..1). */
  precision: number;
  inkCells: number;
  passed: boolean;
  stars: 1 | 2 | 3;
}

/** Child-friendly scoring: finger painting is never perfect, so it is lenient. */
export function scoreTracing(guide: Uint8Array, ink: Uint8Array, size = GRID, tolerance = 5): TracingScore {
  let guideCount = 0;
  let inkCount = 0;
  for (let i = 0; i < guide.length; i++) {
    if (guide[i]) guideCount++;
    if (ink[i]) inkCount++;
  }
  if (guideCount === 0 || inkCount === 0) {
    return { coverage: 0, precision: 0, inkCells: inkCount, passed: false, stars: 1 };
  }
  const nearGuide = dilate(guide, size, tolerance);
  const nearInk = dilate(ink, size, tolerance);
  let covered = 0;
  let onLetter = 0;
  for (let i = 0; i < guide.length; i++) {
    if (guide[i] && nearInk[i]) covered++;
    if (ink[i] && nearGuide[i]) onLetter++;
  }
  const coverage = covered / guideCount;
  const precision = onLetter / inkCount;
  const passed = coverage >= 0.62 && precision >= 0.6 && inkCount >= 40;
  const average = (coverage + precision) / 2;
  const stars: 1 | 2 | 3 = average >= 0.82 ? 3 : average >= 0.68 ? 2 : 1;
  return { coverage, precision, inkCells: inkCount, passed, stars };
}
