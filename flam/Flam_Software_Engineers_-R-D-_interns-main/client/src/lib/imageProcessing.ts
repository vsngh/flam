/**
 * Image Processing Module - OpenCV-style algorithms
 * Implements Canny Edge Detection, Sobel, Grayscale, etc.
 * Equivalent to JNI/C++ OpenCV processing
 */

export class ImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Cannot create 2D context');
    }
    this.ctx = ctx;
  }

  /**
   * Convert to grayscale using luminance formula
   */
  grayscale(imageData: ImageData): ImageData {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = data[i + 1] = data[i + 2] = gray;
    }
    return imageData;
  }

  /**
   * Gaussian blur for noise reduction (used in Canny)
   */
  private gaussianBlur(imageData: ImageData, radius: number = 2): ImageData {
    const { width, height, data } = imageData;
    const output = new ImageData(width, height);
    const kernel = this.createGaussianKernel(radius);
    const kernelSize = kernel.length;
    const half = Math.floor(kernelSize / 2);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0;
        
        for (let ky = 0; ky < kernelSize; ky++) {
          for (let kx = 0; kx < kernelSize; kx++) {
            const px = Math.min(width - 1, Math.max(0, x + kx - half));
            const py = Math.min(height - 1, Math.max(0, y + ky - half));
            const i = (py * width + px) * 4;
            const weight = kernel[ky][kx];
            
            r += data[i] * weight;
            g += data[i + 1] * weight;
            b += data[i + 2] * weight;
            a += data[i + 3] * weight;
          }
        }
        
        const idx = (y * width + x) * 4;
        output.data[idx] = r;
        output.data[idx + 1] = g;
        output.data[idx + 2] = b;
        output.data[idx + 3] = a;
      }
    }
    
    return output;
  }

  private createGaussianKernel(radius: number): number[][] {
    const size = radius * 2 + 1;
    const kernel: number[][] = [];
    const sigma = radius / 2;
    let sum = 0;

    for (let y = 0; y < size; y++) {
      kernel[y] = [];
      for (let x = 0; x < size; x++) {
        const exponent = -((x - radius) ** 2 + (y - radius) ** 2) / (2 * sigma ** 2);
        kernel[y][x] = Math.exp(exponent);
        sum += kernel[y][x];
      }
    }

    // Normalize
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        kernel[y][x] /= sum;
      }
    }

    return kernel;
  }

  /**
   * Sobel operator for edge detection
   */
  sobel(imageData: ImageData): { magnitude: ImageData; direction: Float32Array } {
    const { width, height } = imageData;
    const gray = this.grayscale(new ImageData(
      new Uint8ClampedArray(imageData.data),
      width,
      height
    ));

    const sobelX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ];

    const sobelY = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ];

    const magnitude = new ImageData(width, height);
    const direction = new Float32Array(width * height);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0, gy = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const pixel = gray.data[idx];
            gx += pixel * sobelX[ky + 1][kx + 1];
            gy += pixel * sobelY[ky + 1][kx + 1];
          }
        }

        const mag = Math.sqrt(gx * gx + gy * gy);
        const dir = Math.atan2(gy, gx);
        
        const idx = (y * width + x) * 4;
        magnitude.data[idx] = magnitude.data[idx + 1] = magnitude.data[idx + 2] = mag;
        magnitude.data[idx + 3] = 255;
        direction[y * width + x] = dir;
      }
    }

    return { magnitude, direction };
  }

  /**
   * Non-maximum suppression for Canny
   */
  private nonMaxSuppression(
    magnitude: ImageData,
    direction: Float32Array
  ): ImageData {
    const { width, height } = magnitude;
    const suppressed = new ImageData(width, height);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const angle = direction[idx];
        const mag = magnitude.data[idx * 4];

        // Determine gradient direction
        let dx = 0, dy = 0;
        const absAngle = Math.abs(angle);

        if (absAngle < Math.PI / 8 || absAngle >= 7 * Math.PI / 8) {
          dx = 1; dy = 0;
        } else if (absAngle >= Math.PI / 8 && absAngle < 3 * Math.PI / 8) {
          dx = 1; dy = angle > 0 ? 1 : -1;
        } else if (absAngle >= 3 * Math.PI / 8 && absAngle < 5 * Math.PI / 8) {
          dx = 0; dy = 1;
        } else {
          dx = 1; dy = angle > 0 ? -1 : 1;
        }

        const mag1 = magnitude.data[((y + dy) * width + (x + dx)) * 4];
        const mag2 = magnitude.data[((y - dy) * width + (x - dx)) * 4];

        const pixel = mag >= mag1 && mag >= mag2 ? mag : 0;
        const outIdx = idx * 4;
        suppressed.data[outIdx] = suppressed.data[outIdx + 1] = suppressed.data[outIdx + 2] = pixel;
        suppressed.data[outIdx + 3] = 255;
      }
    }

    return suppressed;
  }

  /**
   * Double threshold and edge tracking for Canny
   */
  private doubleThreshold(
    imageData: ImageData,
    lowThreshold: number,
    highThreshold: number
  ): ImageData {
    const { width, height, data } = imageData;
    const result = new ImageData(width, height);
    const strong = 255;
    const weak = 75;

    for (let i = 0; i < data.length; i += 4) {
      const pixel = data[i];
      let value = 0;

      if (pixel >= highThreshold) {
        value = strong;
      } else if (pixel >= lowThreshold) {
        value = weak;
      }

      result.data[i] = result.data[i + 1] = result.data[i + 2] = value;
      result.data[i + 3] = 255;
    }

    // Edge tracking by hysteresis
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        if (result.data[idx] === weak) {
          let hasStrong = false;
          
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nIdx = ((y + dy) * width + (x + dx)) * 4;
              if (result.data[nIdx] === strong) {
                hasStrong = true;
                break;
              }
            }
            if (hasStrong) break;
          }

          result.data[idx] = result.data[idx + 1] = result.data[idx + 2] = hasStrong ? strong : 0;
        }
      }
    }

    return result;
  }

  /**
   * Canny Edge Detection - full implementation
   */
  cannyEdgeDetection(
    imageData: ImageData,
    lowThreshold: number = 50,
    highThreshold: number = 150
  ): ImageData {
    // Step 1: Gaussian blur
    const blurred = this.gaussianBlur(imageData, 2);

    // Step 2: Sobel operator
    const { magnitude, direction } = this.sobel(blurred);

    // Step 3: Non-maximum suppression
    const suppressed = this.nonMaxSuppression(magnitude, direction);

    // Step 4: Double threshold and edge tracking
    const edges = this.doubleThreshold(suppressed, lowThreshold, highThreshold);

    return edges;
  }

  /**
   * Simple threshold
   */
  threshold(imageData: ImageData, thresholdValue: number = 128): ImageData {
    const gray = this.grayscale(new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height
    ));

    const data = gray.data;
    for (let i = 0; i < data.length; i += 4) {
      const value = data[i] > thresholdValue ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = value;
    }

    return gray;
  }

  /**
   * Extract ImageData from video element
   */
  extractFrame(video: HTMLVideoElement): ImageData {
    this.canvas.width = video.videoWidth;
    this.canvas.height = video.videoHeight;
    this.ctx.drawImage(video, 0, 0);
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }
}
