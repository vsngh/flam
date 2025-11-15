import { z } from "zod";

// Frame statistics
export const frameStatsSchema = z.object({
  fps: z.number(),
  width: z.number(),
  height: z.number(),
  processingTime: z.number(), // milliseconds
  timestamp: z.number(),
});

export type FrameStats = z.infer<typeof frameStatsSchema>;

// Processing modes
export enum ProcessingMode {
  RAW = "raw",
  EDGE_DETECTION = "edge",
  GRAYSCALE = "grayscale",
  SOBEL = "sobel",
  THRESHOLD = "threshold",
}

export const processingModeSchema = z.nativeEnum(ProcessingMode);

// Shader effects
export enum ShaderEffect {
  NONE = "none",
  INVERT = "invert",
  SEPIA = "sepia",
  BRIGHTNESS = "brightness",
  CONTRAST = "contrast",
}

export const shaderEffectSchema = z.nativeEnum(ShaderEffect);

// Processing parameters
export const processingParamsSchema = z.object({
  cannyLowThreshold: z.number().min(0).max(255).default(50),
  cannyHighThreshold: z.number().min(0).max(255).default(150),
  sobelThreshold: z.number().min(0).max(255).default(128),
  brightnessValue: z.number().min(-100).max(100).default(0),
  contrastValue: z.number().min(-100).max(100).default(0),
});

export type ProcessingParams = z.infer<typeof processingParamsSchema>;

// Camera state
export enum CameraState {
  IDLE = "idle",
  REQUESTING_PERMISSION = "requesting",
  ACTIVE = "active",
  ERROR = "error",
  PROCESSING = "processing",
}

export const cameraStateSchema = z.nativeEnum(CameraState);

// WebSocket message for frame streaming (optional feature)
export const frameMessageSchema = z.object({
  type: z.literal("frame"),
  data: z.string(), // base64 encoded image
  stats: frameStatsSchema,
  mode: processingModeSchema,
});

export type FrameMessage = z.infer<typeof frameMessageSchema>;
