/**
 * Image Processing Utilities
 * Comprehensive dithering and effect algorithms
 */

export type DitheringAlgorithm =
  | 'floyd-steinberg'
  | 'atkinson'
  | 'jarvis-judice-ninke'
  | 'stucki'
  | 'burkes'
  | 'sierra'
  | 'sierra-lite'
  | 'two-row-sierra'
  | 'bayer-2x2'
  | 'bayer-4x4'
  | 'bayer-8x8'
  | 'ordered'
  | 'random'
  | 'crosshatch'
  | 'halftone-dots'
  | 'newspaper'
  | 'stipple'
  | 'horizontal-lines'
  | 'vertical-lines'
  | 'diagonal-lines'
  | 'grid-pattern'
  | 'spiral'
  | 'noise-texture'
  | 'blue-noise'
  | 'clustered-dot'
  | 'white-noise'
  | 'riemersma'
  | 'variable-error';

export type ColorPalette =
  // Full Color
  | 'full-color'
  // Basic
  | 'black-white'
  | 'red-black'
  | 'blue-white'
  | 'green-black'
  // Retro
  | 'sepia'
  | 'gameboy'
  | 'commodore64'
  | 'amber-crt'
  | 'green-terminal'
  // Neon
  | 'cyan-magenta'
  | 'neon-pink'
  | 'electric-blue'
  | 'lime-purple'
  | 'hot-pink-cyan'
  // Vintage
  | 'orange-blue'
  | 'purple-yellow'
  | 'teal-orange'
  | 'burgundy-cream'
  // Nature
  | 'forest-green'
  | 'ocean-blue'
  | 'sunset-red'
  | 'lavender-sage';

export interface ProcessingParams {
  brightness: number;
  contrast: number;
  threshold: number;
  ditherIntensity: number;
  effect: 'none' | 'dithering' | 'threshold' | 'edge-detect';
  ditheringAlgorithm: DitheringAlgorithm;
  // Advanced dithering parameters
  invert: boolean;
  ditherContrast: number;
  midtones: number;
  highlights: number;
  luminanceThreshold: number;
  blur: number;
  depth: number;
  effectScale: number;
  effectSize: number;
  colorPalette: ColorPalette;
}

// Bayer matrices for ordered dithering
const BAYER_2X2 = [
  [0, 2],
  [3, 1]
];

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

const BAYER_8X8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21]
];

// Blue noise matrix (8x8 optimized for high-quality dithering)
const BLUE_NOISE_8X8 = [
  [32, 8, 48, 24, 36, 12, 52, 28],
  [16, 56, 0, 40, 20, 60, 4, 44],
  [50, 26, 34, 10, 54, 30, 38, 14],
  [2, 42, 18, 58, 6, 46, 22, 62],
  [35, 11, 51, 27, 33, 9, 49, 25],
  [19, 59, 3, 43, 17, 57, 1, 41],
  [53, 29, 37, 13, 55, 31, 39, 15],
  [5, 45, 21, 61, 7, 47, 23, 63]
];

// Clustered dot matrix (8x8 for halftone printing simulation)
const CLUSTERED_DOT_8X8 = [
  [24, 10, 12, 26, 35, 47, 49, 37],
  [8, 0, 2, 14, 45, 59, 61, 51],
  [6, 4, 1, 16, 43, 57, 63, 53],
  [22, 18, 20, 28, 33, 41, 55, 39],
  [34, 46, 48, 36, 25, 11, 13, 27],
  [44, 58, 60, 50, 9, 1, 3, 15],
  [42, 56, 62, 52, 7, 5, 2, 17],
  [32, 40, 54, 38, 23, 19, 21, 29]
];

/**
 * Convert to grayscale
 */
function toGrayscale(r: number, g: number, b: number): number {
  return r * 0.299 + g * 0.587 + b * 0.114;
}

/**
 * Apply blur (optimized separable box blur)
 */
function applyBlur(imageData: ImageData, radius: number): ImageData {
  if (radius === 0) return imageData;

  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  // Limit radius for performance
  const r = Math.min(20, Math.max(1, Math.floor(radius)));

  // Horizontal pass
  const temp = new Uint8ClampedArray(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sumR = 0, sumG = 0, sumB = 0, count = 0;

      const xStart = Math.max(0, x - r);
      const xEnd = Math.min(width - 1, x + r);

      for (let xi = xStart; xi <= xEnd; xi++) {
        const idx = (y * width + xi) * 4;
        sumR += data[idx];
        sumG += data[idx + 1];
        sumB += data[idx + 2];
        count++;
      }

      const idx = (y * width + x) * 4;
      temp[idx] = sumR / count;
      temp[idx + 1] = sumG / count;
      temp[idx + 2] = sumB / count;
      temp[idx + 3] = 255;
    }
  }

  // Vertical pass
  const result = new Uint8ClampedArray(data.length);
  for (let y = 0; y < height; y++) {
    const yStart = Math.max(0, y - r);
    const yEnd = Math.min(height - 1, y + r);

    for (let x = 0; x < width; x++) {
      let sumR = 0, sumG = 0, sumB = 0, count = 0;

      for (let yi = yStart; yi <= yEnd; yi++) {
        const idx = (yi * width + x) * 4;
        sumR += temp[idx];
        sumG += temp[idx + 1];
        sumB += temp[idx + 2];
        count++;
      }

      const idx = (y * width + x) * 4;
      result[idx] = sumR / count;
      result[idx + 1] = sumG / count;
      result[idx + 2] = sumB / count;
      result[idx + 3] = 255;
    }
  }

  return new ImageData(result, width, height);
}

/**
 * Adjust midtones and highlights
 */
function adjustTones(imageData: ImageData, midtones: number, highlights: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data);

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const value = data[i + c];
      const normalized = value / 255;

      // Apply midtones (affects 0.3-0.7 range)
      let adjusted = normalized;
      if (normalized > 0.3 && normalized < 0.7) {
        const midFactor = 1 + (midtones / 100);
        adjusted = 0.3 + (normalized - 0.3) * midFactor;
      }

      // Apply highlights (affects 0.7-1.0 range)
      if (adjusted > 0.7) {
        const highlightFactor = 1 + (highlights / 100);
        adjusted = 0.7 + (adjusted - 0.7) * highlightFactor;
      }

      data[i + c] = Math.min(255, Math.max(0, adjusted * 255));
    }
  }

  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * Apply luminance threshold
 */
function applyLuminanceThreshold(imageData: ImageData, threshold: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const thresholdValue = (threshold / 100) * 255;

  for (let i = 0; i < data.length; i += 4) {
    const lum = toGrayscale(data[i], data[i + 1], data[i + 2]);
    if (lum < thresholdValue) {
      // Darken pixels below threshold
      data[i] *= 0.5;
      data[i + 1] *= 0.5;
      data[i + 2] *= 0.5;
    }
  }

  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * Apply depth (posterization)
 */
function applyDepth(imageData: ImageData, depth: number): ImageData {
  if (depth >= 100) return imageData;

  const data = new Uint8ClampedArray(imageData.data);
  const levels = Math.max(2, Math.floor((depth / 100) * 256));
  const step = 256 / levels;

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      data[i + c] = Math.floor(data[i + c] / step) * step;
    }
  }

  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * Invert colors
 */
function invertColors(imageData: ImageData): ImageData {
  const data = new Uint8ClampedArray(imageData.data);

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }

  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * Floyd-Steinberg dithering
 */
export function applyFloydSteinberg(imageData: ImageData, intensity: number = 1, _scale: number = 1, _size: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const cellSize = Math.max(1, Math.floor(_size));

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);
      const threshold = 128 / _scale;
      const newGray = gray < threshold ? 0 : 255;
      const error = (gray - newGray) * intensity;

      // Apply to entire cell
      for (let dy = 0; dy < cellSize && y + dy < height; dy++) {
        for (let dx = 0; dx < cellSize && x + dx < width; dx++) {
          const cellIdx = ((y + dy) * width + (x + dx)) * 4;
          data[cellIdx] = data[cellIdx + 1] = data[cellIdx + 2] = newGray;
        }
      }

      // Distribute error to neighboring cells
      const step = cellSize;
      if (x + step < width) {
        const rightIdx = (y * width + (x + step)) * 4;
        data[rightIdx] += error * 7 / 16;
        data[rightIdx + 1] += error * 7 / 16;
        data[rightIdx + 2] += error * 7 / 16;
      }

      if (y + step < height) {
        if (x > 0) {
          const bottomLeftIdx = ((y + step) * width + (x - step)) * 4;
          data[bottomLeftIdx] += error * 3 / 16;
          data[bottomLeftIdx + 1] += error * 3 / 16;
          data[bottomLeftIdx + 2] += error * 3 / 16;
        }

        const bottomIdx = ((y + step) * width + x) * 4;
        data[bottomIdx] += error * 5 / 16;
        data[bottomIdx + 1] += error * 5 / 16;
        data[bottomIdx + 2] += error * 5 / 16;

        if (x + step < width) {
          const bottomRightIdx = ((y + step) * width + (x + step)) * 4;
          data[bottomRightIdx] += error * 1 / 16;
          data[bottomRightIdx + 1] += error * 1 / 16;
          data[bottomRightIdx + 2] += error * 1 / 16;
        }
      }
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Atkinson dithering
 */
export function applyAtkinson(imageData: ImageData, intensity: number = 1, _scale: number = 1, _size: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const cellSize = Math.max(1, Math.floor(_size));

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);
      const threshold = 128 / _scale;
      const newGray = gray < threshold ? 0 : 255;
      const error = (gray - newGray) * intensity / 8;

      // Apply to entire cell
      for (let dy = 0; dy < cellSize && y + dy < height; dy++) {
        for (let dx = 0; dx < cellSize && x + dx < width; dx++) {
          const cellIdx = ((y + dy) * width + (x + dx)) * 4;
          data[cellIdx] = data[cellIdx + 1] = data[cellIdx + 2] = newGray;
        }
      }

      // Atkinson: distribute to 6 neighbor cells
      const step = cellSize;
      if (x + step < width) {
        const r1 = (y * width + (x + step)) * 4;
        data[r1] += error; data[r1 + 1] += error; data[r1 + 2] += error;
      }
      if (x + step * 2 < width) {
        const r2 = (y * width + (x + step * 2)) * 4;
        data[r2] += error; data[r2 + 1] += error; data[r2 + 2] += error;
      }
      if (y + step < height) {
        if (x >= step) {
          const bl = ((y + step) * width + (x - step)) * 4;
          data[bl] += error; data[bl + 1] += error; data[bl + 2] += error;
        }
        const b = ((y + step) * width + x) * 4;
        data[b] += error; data[b + 1] += error; data[b + 2] += error;
        if (x + step < width) {
          const br = ((y + step) * width + (x + step)) * 4;
          data[br] += error; data[br + 1] += error; data[br + 2] += error;
        }
      }
      if (y + step * 2 < height) {
        const b2 = ((y + step * 2) * width + x) * 4;
        data[b2] += error; data[b2 + 1] += error; data[b2 + 2] += error;
      }
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Jarvis-Judice-Ninke dithering
 */
export function applyJarvisJudiceNinke(imageData: ImageData, intensity: number = 1, _scale: number = 1, _size: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);
      const newGray = gray < 128 ? 0 : 255;
      const error = (gray - newGray) * intensity;

      data[idx] = data[idx + 1] = data[idx + 2] = newGray;

      const diffuse = (dx: number, dy: number, amount: number) => {
        if (x + dx >= 0 && x + dx < width && y + dy < height) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          data[i] += error * amount / 48;
          data[i + 1] += error * amount / 48;
          data[i + 2] += error * amount / 48;
        }
      };

      diffuse(1, 0, 7); diffuse(2, 0, 5);
      diffuse(-2, 1, 3); diffuse(-1, 1, 5); diffuse(0, 1, 7); diffuse(1, 1, 5); diffuse(2, 1, 3);
      diffuse(-2, 2, 1); diffuse(-1, 2, 3); diffuse(0, 2, 5); diffuse(1, 2, 3); diffuse(2, 2, 1);
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Stucki dithering
 */
export function applyStucki(imageData: ImageData, intensity: number = 1, _scale: number = 1, _size: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);
      const newGray = gray < 128 ? 0 : 255;
      const error = (gray - newGray) * intensity;

      data[idx] = data[idx + 1] = data[idx + 2] = newGray;

      const diffuse = (dx: number, dy: number, amount: number) => {
        if (x + dx >= 0 && x + dx < width && y + dy < height) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          data[i] += error * amount / 42;
          data[i + 1] += error * amount / 42;
          data[i + 2] += error * amount / 42;
        }
      };

      diffuse(1, 0, 8); diffuse(2, 0, 4);
      diffuse(-2, 1, 2); diffuse(-1, 1, 4); diffuse(0, 1, 8); diffuse(1, 1, 4); diffuse(2, 1, 2);
      diffuse(-2, 2, 1); diffuse(-1, 2, 2); diffuse(0, 2, 4); diffuse(1, 2, 2); diffuse(2, 2, 1);
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Burkes dithering
 */
export function applyBurkes(imageData: ImageData, intensity: number = 1, _scale: number = 1, _size: number = 1): ImageData{
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);
      const newGray = gray < 128 ? 0 : 255;
      const error = (gray - newGray) * intensity;

      data[idx] = data[idx + 1] = data[idx + 2] = newGray;

      const diffuse = (dx: number, dy: number, amount: number) => {
        if (x + dx >= 0 && x + dx < width && y + dy < height) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          data[i] += error * amount / 32;
          data[i + 1] += error * amount / 32;
          data[i + 2] += error * amount / 32;
        }
      };

      diffuse(1, 0, 8); diffuse(2, 0, 4);
      diffuse(-2, 1, 2); diffuse(-1, 1, 4); diffuse(0, 1, 8); diffuse(1, 1, 4); diffuse(2, 1, 2);
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Sierra dithering
 */
export function applySierra(imageData: ImageData, intensity: number = 1, _scale: number = 1, _size: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);
      const newGray = gray < 128 ? 0 : 255;
      const error = (gray - newGray) * intensity;

      data[idx] = data[idx + 1] = data[idx + 2] = newGray;

      const diffuse = (dx: number, dy: number, amount: number) => {
        if (x + dx >= 0 && x + dx < width && y + dy < height) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          data[i] += error * amount / 32;
          data[i + 1] += error * amount / 32;
          data[i + 2] += error * amount / 32;
        }
      };

      diffuse(1, 0, 5); diffuse(2, 0, 3);
      diffuse(-2, 1, 2); diffuse(-1, 1, 4); diffuse(0, 1, 5); diffuse(1, 1, 4); diffuse(2, 1, 2);
      diffuse(-1, 2, 2); diffuse(0, 2, 3); diffuse(1, 2, 2);
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Sierra Lite dithering
 */
export function applySierraLite(imageData: ImageData, intensity: number = 1, _scale: number = 1, _size: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);
      const newGray = gray < 128 ? 0 : 255;
      const error = (gray - newGray) * intensity;

      data[idx] = data[idx + 1] = data[idx + 2] = newGray;

      const diffuse = (dx: number, dy: number, amount: number) => {
        if (x + dx >= 0 && x + dx < width && y + dy < height) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          data[i] += error * amount / 4;
          data[i + 1] += error * amount / 4;
          data[i + 2] += error * amount / 4;
        }
      };

      diffuse(1, 0, 2);
      diffuse(-1, 1, 1); diffuse(0, 1, 1);
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Two-Row Sierra dithering
 */
export function applyTwoRowSierra(imageData: ImageData, intensity: number = 1, _scale: number = 1, _size: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);
      const newGray = gray < 128 ? 0 : 255;
      const error = (gray - newGray) * intensity;

      data[idx] = data[idx + 1] = data[idx + 2] = newGray;

      const diffuse = (dx: number, dy: number, amount: number) => {
        if (x + dx >= 0 && x + dx < width && y + dy < height) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          data[i] += error * amount / 16;
          data[i + 1] += error * amount / 16;
          data[i + 2] += error * amount / 16;
        }
      };

      diffuse(1, 0, 4); diffuse(2, 0, 3);
      diffuse(-2, 1, 1); diffuse(-1, 1, 2); diffuse(0, 1, 3); diffuse(1, 1, 2); diffuse(2, 1, 1);
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Bayer matrix dithering
 */
function applyBayerMatrix(imageData: ImageData, matrix: number[][], matrixSize: number, _scale: number = 1, _size: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const cellSize = Math.max(1, Math.floor(_size));
  const factor = 256 / (matrixSize * matrixSize);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);

      // Apply cell-based sampling for size control
      const cellX = Math.floor(x / cellSize);
      const cellY = Math.floor(y / cellSize);
      const threshold = (matrix[cellY % matrixSize][cellX % matrixSize] + 1) * factor  * _scale;

      const newGray = gray > threshold ? 255 : 0;
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }

  return new ImageData(data, width, height);
}

export function applyBayer2x2(imageData: ImageData, _scale: number = 1, _size: number = 1): ImageData {
  return applyBayerMatrix(imageData, BAYER_2X2, 2, _scale, _size);
}

export function applyBayer4x4(imageData: ImageData, _scale: number = 1, _size: number = 1): ImageData {
  return applyBayerMatrix(imageData, BAYER_4X4, 4, _scale, _size);
}

export function applyBayer8x8(imageData: ImageData, _scale: number = 1, _size: number = 1): ImageData {
  return applyBayerMatrix(imageData, BAYER_8X8, 8, _scale, _size);
}

/**
 * Random dithering
 */
export function applyRandomDither(imageData: ImageData, intensity: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);
      const threshold = 128 + (Math.random() - 0.5) * 128 * intensity;
      const newGray = gray > threshold ? 255 : 0;
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Crosshatch pattern dithering
 */
export function applyCrosshatch(imageData: ImageData, _scale: number = 1, _size: number = 4): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);

      // Create crosshatch pattern based on luminance
      const spacing = Math.max(1, Math.floor(_size));
      const diagonalSpacing = Math.max(1, Math.floor(_size * 1.5));
      const horizontalLine = (y % spacing) === 0;
      const verticalLine = (x % spacing) === 0;
      const diagonalLine1 = ((x + y) % diagonalSpacing) === 0;
      const diagonalLine2 = ((x - y) % diagonalSpacing) === 0;

      let newGray = 255;
      const threshold1 = 192  * _scale;
      const threshold2 = 128  * _scale;
      const threshold3 = 64  * _scale;

      if (gray < threshold1 && (horizontalLine || verticalLine)) newGray = 0;
      if (gray < threshold2 && (diagonalLine1 || diagonalLine2)) newGray = 0;
      if (gray < threshold3) newGray = 0;

      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Halftone dots (newspaper style)
 */
export function applyHalftoneDots(imageData: ImageData, _scale: number = 1, _size: number = 6): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const dotSize = Math.max(2, Math.floor(_size));

  for (let y = 0; y < height; y += dotSize) {
    for (let x = 0; x < width; x += dotSize) {
      // Sample the center of each cell
      const centerX = Math.min(x + dotSize / 2, width - 1);
      const centerY = Math.min(y + dotSize / 2, height - 1);
      const idx = (Math.floor(centerY) * width + Math.floor(centerX)) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);

      // Calculate dot radius based on luminance
      const radius = (1 - gray / 255) * (dotSize / 2)  * _scale;

      // Draw dot
      for (let dy = 0; dy < dotSize; dy++) {
        for (let dx = 0; dx < dotSize; dx++) {
          const px = x + dx;
          const py = y + dy;
          if (px < width && py < height) {
            const dist = Math.sqrt((dx - dotSize/2) ** 2 + (dy - dotSize/2) ** 2);
            const pIdx = (py * width + px) * 4;
            const value = dist < radius ? 0 : 255;
            data[pIdx] = data[pIdx + 1] = data[pIdx + 2] = value;
          }
        }
      }
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Newspaper/magazine print effect
 */
export function applyNewspaper(imageData: ImageData, _scale: number = 1, _size: number = 8): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const cellSize = Math.max(2, Math.floor(_size));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);

      // Create newspaper dot pattern
      const cellX = x % cellSize;
      const cellY = y % cellSize;
      const centerDist = Math.sqrt((cellX - cellSize/2) ** 2 + (cellY - cellSize/2) ** 2);
      const threshold = (gray / 255) * (cellSize * 0.6)  * _scale;

      const newGray = centerDist < threshold ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Stipple/pointillism effect
 */
export function applyStipple(imageData: ImageData, _scale: number = 1, _size: number = 11): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const dotSpacing = Math.max(2, Math.floor(_size));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);

      // Create stipple dots with density based on luminance
      const dotChance = (1 - gray / 255) * 0.6  * _scale;
      const inDot = ((x + y * 7) % dotSpacing) < (dotChance * dotSpacing);

      const newGray = inDot ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Horizontal lines pattern
 */
export function applyHorizontalLines(imageData: ImageData, _scale: number = 1, _size: number = 5): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const spacing = Math.max(2, Math.floor(_size));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);

      const lineThickness = Math.floor((1 - gray / 255) * 4 * _scale) + 1;
      const isLine = (y % spacing) < lineThickness;

      const newGray = isLine ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Vertical lines pattern
 */
export function applyVerticalLines(imageData: ImageData, _scale: number = 1, _size: number = 5): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const spacing = Math.max(2, Math.floor(_size));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);

      const lineThickness = Math.floor((1 - gray / 255) * 4 * _scale) + 1;
      const isLine = (x % spacing) < lineThickness;

      const newGray = isLine ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Diagonal lines pattern
 */
export function applyDiagonalLines(imageData: ImageData, _scale: number = 1, _size: number = 8): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const spacing = Math.max(2, Math.floor(_size));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);

      const lineThickness = Math.floor((1 - gray / 255) * 5 * _scale) + 1;
      const isLine = ((x + y) % spacing) < lineThickness;

      const newGray = isLine ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Grid pattern dithering
 */
export function applyGridPattern(imageData: ImageData, _scale: number = 1, _size: number = 8): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const gridSize = Math.max(2, Math.floor(_size));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);

      const isGridLine = (x % gridSize === 0) || (y % gridSize === 0);
      const fillDensity = (1 - gray / 255)  * _scale;
      const shouldFill = ((x + y) % 4) < (fillDensity * 4);

      const newGray = (isGridLine || (shouldFill && !isGridLine)) ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Spiral pattern dithering
 */
export function applySpiral(imageData: ImageData, _scale: number = 1, _size: number = 16): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const spiralSize = Math.max(4, Math.floor(_size));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);

      // Create spiral pattern
      const centerX = x % spiralSize - spiralSize / 2;
      const centerY = y % spiralSize - spiralSize / 2;
      const angle = Math.atan2(centerY, centerX);
      const radius = Math.sqrt(centerX ** 2 + centerY ** 2);
      const spiralValue = (angle + radius * 0.5 * _scale) % (Math.PI * 2);

      const threshold = (gray / 255) * Math.PI * 2;
      const newGray = spiralValue < threshold ? 0 : 255;

      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Noise texture dithering
 */
export function applyNoiseTexture(imageData: ImageData, _scale: number = 1, _size: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const noiseScale = Math.max(0.1, _size);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);

      // Pseudo-random noise based on position
      const noise = Math.abs(Math.sin(x * 12.9898 * noiseScale + y * 78.233 * noiseScale) * 43758.5453) % 1;
      const threshold = (gray / 255)  * _scale;

      const newGray = noise < threshold ? 255 : 0;
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Blue Noise Dithering
 * High-quality ordered dithering with blue noise characteristics
 */
export function applyBlueNoise(imageData: ImageData, _scale: number = 1, _size: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const cellSize = Math.max(1, Math.floor(_size));
  const matrixSize = 8;
  const factor = 256 / (matrixSize * matrixSize);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);
      const cellX = Math.floor(x / cellSize);
      const cellY = Math.floor(y / cellSize);
      const threshold = (BLUE_NOISE_8X8[cellY % matrixSize][cellX % matrixSize] + 1) * factor  * _scale;
      const newGray = gray > threshold ? 255 : 0;
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Clustered Dot Dithering
 * Simulates traditional halftone printing with clustered dots
 */
export function applyClusteredDot(imageData: ImageData, _scale: number = 1, _size: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const cellSize = Math.max(1, Math.floor(_size));
  const matrixSize = 8;
  const factor = 256 / (matrixSize * matrixSize);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);
      const cellX = Math.floor(x / cellSize);
      const cellY = Math.floor(y / cellSize);
      const threshold = (CLUSTERED_DOT_8X8[cellY % matrixSize][cellX % matrixSize] + 1) * factor  * _scale;
      const newGray = gray > threshold ? 255 : 0;
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }

  return new ImageData(data, width, height);
}

/**
 * White Noise Dithering
 * Simple random threshold dithering
 */
export function applyWhiteNoise(imageData: ImageData, _scale: number = 1, _size: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);
      const threshold = (Math.random() * 255)  * _scale;
      const newGray = gray > threshold ? 255 : 0;
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Riemersma Dithering
 * Space-filling curve dithering using Hilbert curve traversal
 */
export function applyRiemersma(imageData: ImageData, intensity: number = 1, _scale: number = 1, _size: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const errorQueueSize = 16;
  const errorQueue: number[] = [];
  const weights: number[] = [];

  // Initialize exponentially decaying weights
  for (let i = 0; i < errorQueueSize; i++) {
    weights[i] = Math.exp(-(i / errorQueueSize) * 4);
  }

  // Simple Hilbert curve approximation using Morton curve (Z-order)
  const points: Array<{x: number, y: number}> = [];
  const maxDim = Math.max(width, height);
  const levels = Math.ceil(Math.log2(maxDim));

  for (let i = 0; i < width * height; i++) {
    let x = 0, y = 0;
    for (let j = 0; j < levels; j++) {
      x |= ((i >> (j * 2)) & 1) << j;
      y |= ((i >> (j * 2 + 1)) & 1) << j;
    }
    if (x < width && y < height) {
      points.push({x, y});
    }
  }

  // Process pixels along curve
  for (const {x, y} of points) {
    const idx = (y * width + x) * 4;
    const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);

    // Calculate weighted error
    let weightedError = 0;
    let totalWeight = 0;
    for (let i = 0; i < errorQueue.length; i++) {
      weightedError += errorQueue[i] * weights[i];
      totalWeight += weights[i];
    }
    if (totalWeight > 0) {
      weightedError /= totalWeight;
    }

    const adjustedGray = gray + weightedError * intensity;
    const threshold = 128 / _scale;
    const newGray = adjustedGray < threshold ? 0 : 255;
    const error = adjustedGray - newGray;

    data[idx] = data[idx + 1] = data[idx + 2] = newGray;

    // Add error to queue
    errorQueue.unshift(error);
    if (errorQueue.length > errorQueueSize) {
      errorQueue.pop();
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Variable Coefficient Error Diffusion
 * Adaptive error diffusion based on pixel intensity
 */
export function applyVariableError(imageData: ImageData, intensity: number = 1, _scale: number = 1, _size: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const cellSize = Math.max(1, Math.floor(_size));

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      const idx = (y * width + x) * 4;
      const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);

      // Variable coefficients based on tone
      const normalized = gray / 255;
      let coeffRight, coeffBelowLeft, coeffBelow, coeffBelowRight;

      if (normalized < 0.25) {
        // Dark tones - more horizontal diffusion
        coeffRight = 9; coeffBelowLeft = 2; coeffBelow = 4; coeffBelowRight = 1;
      } else if (normalized < 0.5) {
        // Mid-dark - balanced
        coeffRight = 7; coeffBelowLeft = 3; coeffBelow = 5; coeffBelowRight = 1;
      } else if (normalized < 0.75) {
        // Mid-light - balanced
        coeffRight = 7; coeffBelowLeft = 1; coeffBelow = 5; coeffBelowRight = 3;
      } else {
        // Light tones - more vertical diffusion
        coeffRight = 4; coeffBelowLeft = 1; coeffBelow = 9; coeffBelowRight = 2;
      }

      const divisor = coeffRight + coeffBelowLeft + coeffBelow + coeffBelowRight;
      const threshold = 128 / _scale;
      const newGray = gray < threshold ? 0 : 255;
      const error = (gray - newGray) * intensity;

      // Apply to entire cell
      for (let dy = 0; dy < cellSize && y + dy < height; dy++) {
        for (let dx = 0; dx < cellSize && x + dx < width; dx++) {
          const cellIdx = ((y + dy) * width + (x + dx)) * 4;
          data[cellIdx] = data[cellIdx + 1] = data[cellIdx + 2] = newGray;
        }
      }

      // Distribute error with variable coefficients
      const baseX = x;
      const baseY = y;

      // Right
      if (baseX + cellSize < width) {
        const idx = (baseY * width + (baseX + cellSize)) * 4;
        data[idx] = data[idx + 1] = data[idx + 2] = Math.max(0, Math.min(255, data[idx] + error * coeffRight / divisor));
      }

      if (baseY + cellSize < height) {
        // Below-left
        if (baseX - cellSize >= 0) {
          const idx = ((baseY + cellSize) * width + (baseX - cellSize)) * 4;
          data[idx] = data[idx + 1] = data[idx + 2] = Math.max(0, Math.min(255, data[idx] + error * coeffBelowLeft / divisor));
        }
        // Below
        const idx = ((baseY + cellSize) * width + baseX) * 4;
        data[idx] = data[idx + 1] = data[idx + 2] = Math.max(0, Math.min(255, data[idx] + error * coeffBelow / divisor));

        // Below-right
        if (baseX + cellSize < width) {
          const idx = ((baseY + cellSize) * width + (baseX + cellSize)) * 4;
          data[idx] = data[idx + 1] = data[idx + 2] = Math.max(0, Math.min(255, data[idx] + error * coeffBelowRight / divisor));
        }
      }
    }
  }

  return new ImageData(data, width, height);
}

/**
 * Threshold effect
 */
export function applyThreshold(imageData: ImageData, threshold: number = 128): ImageData {
  const data = new Uint8ClampedArray(imageData.data);

  for (let i = 0; i < data.length; i += 4) {
    const gray = toGrayscale(data[i], data[i + 1], data[i + 2]);
    const value = gray > threshold ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = value;
  }

  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * Edge detection
 */
export function applyEdgeDetection(imageData: ImageData): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const result = new Uint8ClampedArray(data.length);

  const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const gray = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);
          gx += gray * sobelX[ky + 1][kx + 1];
          gy += gray * sobelY[ky + 1][kx + 1];
        }
      }

      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const idx = (y * width + x) * 4;
      result[idx] = result[idx + 1] = result[idx + 2] = Math.min(255, magnitude);
      result[idx + 3] = 255;
    }
  }

  return new ImageData(result, width, height);
}

/**
 * Brightness adjustment
 */
export function adjustBrightness(imageData: ImageData, brightness: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const adjust = brightness * 2.55;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] + adjust));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + adjust));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + adjust));
  }

  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * Contrast adjustment
 */
export function adjustContrast(imageData: ImageData, contrast: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
    data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
    data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
  }

  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * Apply color palette
 */
function applyColorPalette(imageData: ImageData, palette: ColorPalette): ImageData {
  const data = new Uint8ClampedArray(imageData.data);

  // If full-color mode, return image unchanged
  if (palette === 'full-color') {
    return new ImageData(data, imageData.width, imageData.height);
  }

  const palettes: Record<Exclude<ColorPalette, 'full-color'>, { dark: [number, number, number], light: [number, number, number] }> = {
    // Basic
    'black-white': { dark: [0, 0, 0], light: [255, 255, 255] },
    'red-black': { dark: [0, 0, 0], light: [255, 0, 0] },
    'blue-white': { dark: [0, 50, 100], light: [255, 255, 255] },
    'green-black': { dark: [0, 0, 0], light: [0, 255, 0] },
    // Retro
    'sepia': { dark: [64, 32, 16], light: [255, 240, 200] },
    'gameboy': { dark: [15, 56, 15], light: [155, 188, 15] },
    'commodore64': { dark: [64, 50, 133], light: [120, 105, 196] },
    'amber-crt': { dark: [20, 10, 0], light: [255, 176, 0] },
    'green-terminal': { dark: [0, 20, 0], light: [0, 255, 65] },
    // Neon
    'cyan-magenta': { dark: [0, 150, 150], light: [255, 0, 150] },
    'neon-pink': { dark: [20, 0, 40], light: [255, 16, 240] },
    'electric-blue': { dark: [0, 0, 50], light: [0, 242, 255] },
    'lime-purple': { dark: [80, 0, 120], light: [200, 255, 0] },
    'hot-pink-cyan': { dark: [0, 230, 255], light: [255, 20, 147] },
    // Vintage
    'orange-blue': { dark: [0, 50, 100], light: [255, 150, 0] },
    'purple-yellow': { dark: [80, 0, 120], light: [255, 255, 100] },
    'teal-orange': { dark: [0, 128, 128], light: [255, 127, 80] },
    'burgundy-cream': { dark: [80, 0, 32], light: [255, 253, 208] },
    // Nature
    'forest-green': { dark: [13, 27, 42], light: [34, 139, 34] },
    'ocean-blue': { dark: [0, 47, 75], light: [64, 224, 208] },
    'sunset-red': { dark: [139, 0, 139], light: [255, 99, 71] },
    'lavender-sage': { dark: [85, 107, 47], light: [230, 230, 250] }
  };

  const colors = palettes[palette as Exclude<ColorPalette, 'full-color'>];

  for (let i = 0; i < data.length; i += 4) {
    const gray = toGrayscale(data[i], data[i + 1], data[i + 2]);
    const t = gray / 255;

    // Interpolate between dark and light colors
    data[i] = colors.dark[0] * (1 - t) + colors.light[0] * t;
    data[i + 1] = colors.dark[1] * (1 - t) + colors.light[1] * t;
    data[i + 2] = colors.dark[2] * (1 - t) + colors.light[2] * t;
  }

  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * Main processing pipeline
 */
export function processImage(
  sourceImageData: ImageData,
  params: ProcessingParams
): ImageData {
  let processed = new ImageData(
    new Uint8ClampedArray(sourceImageData.data),
    sourceImageData.width,
    sourceImageData.height
  );

  // Basic adjustments
  if (params.brightness !== 0) {
    processed = adjustBrightness(processed, params.brightness);
  }

  if (params.contrast !== 0) {
    processed = adjustContrast(processed, params.contrast);
  }

  // Apply advanced dithering parameters (only for dithering effect)
  if (params.effect === 'dithering') {
    if (params.blur > 0) {
      processed = applyBlur(processed, params.blur);
    }

    if (params.ditherContrast !== 100) {
      const contrastAdjust = (params.ditherContrast - 100) * 1.5;
      processed = adjustContrast(processed, contrastAdjust);
    }

    if (params.midtones !== 100 || params.highlights !== 100) {
      const midAdjust = (params.midtones - 100) * 0.5;
      const highAdjust = (params.highlights - 100) * 0.5;
      processed = adjustTones(processed, midAdjust, highAdjust);
    }

    if (params.luminanceThreshold !== 128) {
      processed = applyLuminanceThreshold(processed, (params.luminanceThreshold / 255) * 100);
    }

    if (params.depth < 100) {
      processed = applyDepth(processed, params.depth);
    }
  }

  // Apply main effect
  switch (params.effect) {
    case 'dithering':
      switch (params.ditheringAlgorithm) {
        case 'floyd-steinberg':
          processed = applyFloydSteinberg(processed, params.ditherIntensity, params.effectScale, params.effectSize);
          break;
        case 'atkinson':
          processed = applyAtkinson(processed, params.ditherIntensity, params.effectScale, params.effectSize);
          break;
        case 'jarvis-judice-ninke':
          processed = applyJarvisJudiceNinke(processed, params.ditherIntensity, params.effectScale, params.effectSize);
          break;
        case 'stucki':
          processed = applyStucki(processed, params.ditherIntensity, params.effectScale, params.effectSize);
          break;
        case 'burkes':
          processed = applyBurkes(processed, params.ditherIntensity, params.effectScale, params.effectSize);
          break;
        case 'sierra':
          processed = applySierra(processed, params.ditherIntensity, params.effectScale, params.effectSize);
          break;
        case 'sierra-lite':
          processed = applySierraLite(processed, params.ditherIntensity, params.effectScale, params.effectSize);
          break;
        case 'two-row-sierra':
          processed = applyTwoRowSierra(processed, params.ditherIntensity, params.effectScale, params.effectSize);
          break;
        case 'bayer-2x2':
          processed = applyBayer2x2(processed, params.effectScale, params.effectSize);
          break;
        case 'bayer-4x4':
          processed = applyBayer4x4(processed, params.effectScale, params.effectSize);
          break;
        case 'bayer-8x8':
          processed = applyBayer8x8(processed, params.effectScale, params.effectSize);
          break;
        case 'random':
          processed = applyRandomDither(processed, params.ditherIntensity);
          break;
        case 'ordered':
          processed = applyBayer4x4(processed, params.effectScale, params.effectSize);
          break;
        case 'crosshatch':
          processed = applyCrosshatch(processed, params.effectScale, params.effectSize);
          break;
        case 'halftone-dots':
          processed = applyHalftoneDots(processed, params.effectScale, params.effectSize);
          break;
        case 'newspaper':
          processed = applyNewspaper(processed, params.effectScale, params.effectSize);
          break;
        case 'stipple':
          processed = applyStipple(processed, params.effectScale, params.effectSize);
          break;
        case 'horizontal-lines':
          processed = applyHorizontalLines(processed, params.effectScale, params.effectSize);
          break;
        case 'vertical-lines':
          processed = applyVerticalLines(processed, params.effectScale, params.effectSize);
          break;
        case 'diagonal-lines':
          processed = applyDiagonalLines(processed, params.effectScale, params.effectSize);
          break;
        case 'grid-pattern':
          processed = applyGridPattern(processed, params.effectScale, params.effectSize);
          break;
        case 'spiral':
          processed = applySpiral(processed, params.effectScale, params.effectSize);
          break;
        case 'noise-texture':
          processed = applyNoiseTexture(processed, params.effectScale, params.effectSize);
          break;
        case 'blue-noise':
          processed = applyBlueNoise(processed, params.effectScale, params.effectSize);
          break;
        case 'clustered-dot':
          processed = applyClusteredDot(processed, params.effectScale, params.effectSize);
          break;
        case 'white-noise':
          processed = applyWhiteNoise(processed, params.effectScale, params.effectSize);
          break;
        case 'riemersma':
          processed = applyRiemersma(processed, params.ditherIntensity, params.effectScale, params.effectSize);
          break;
        case 'variable-error':
          processed = applyVariableError(processed, params.ditherIntensity, params.effectScale, params.effectSize);
          break;
      }

      // Apply invert last for dithering
      if (params.invert) {
        processed = invertColors(processed);
      }
      break;
    case 'threshold':
      processed = applyThreshold(processed, params.threshold);
      break;
    case 'edge-detect':
      processed = applyEdgeDetection(processed);
      break;
    case 'none':
    default:
      break;
  }

  // Apply color palette last
  processed = applyColorPalette(processed, params.colorPalette);

  return processed;
}

export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
