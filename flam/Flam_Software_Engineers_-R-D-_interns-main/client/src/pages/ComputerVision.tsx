import { useEffect, useRef, useState, useCallback } from "react";
import { CameraCapture } from "@/lib/camera";
import { ImageProcessor } from "@/lib/imageProcessing";
import { WebGLRenderer } from "@/lib/webglRenderer";
import { ProcessingMode, ShaderEffect, CameraState, type FrameStats, type ProcessingParams } from "@shared/schema";
import { StatsOverlay } from "@/components/StatsOverlay";
import { ControlPanel } from "@/components/ControlPanel";
import { CameraPermissionModal } from "@/components/CameraPermissionModal";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ComputerVision() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number>();
  
  const cameraRef = useRef<CameraCapture>();
  const processorRef = useRef<ImageProcessor>();
  const rendererRef = useRef<WebGLRenderer>();

  const [cameraState, setCameraState] = useState<CameraState>(CameraState.IDLE);
  const [processingMode, setProcessingMode] = useState<ProcessingMode>(ProcessingMode.RAW);
  const [shaderEffect, setShaderEffect] = useState<ShaderEffect>(ShaderEffect.NONE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [permissionError, setPermissionError] = useState<string>();
  
  const [params, setParams] = useState<ProcessingParams>({
    cannyLowThreshold: 50,
    cannyHighThreshold: 150,
    sobelThreshold: 128,
    brightnessValue: 0,
    contrastValue: 0,
  });

  const [stats, setStats] = useState<FrameStats>({
    fps: 0,
    width: 0,
    height: 0,
    processingTime: 0,
    timestamp: Date.now(),
  });

  const fpsCounterRef = useRef({
    frames: 0,
    lastTime: performance.now(),
  });

  const { toast } = useToast();

  // Initialize modules
  useEffect(() => {
    cameraRef.current = new CameraCapture();
    processorRef.current = new ImageProcessor();

    if (canvasRef.current) {
      rendererRef.current = new WebGLRenderer(canvasRef.current);
    }

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (rendererRef.current) {
        rendererRef.current.destroy();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const requestCameraPermission = useCallback(async () => {
    if (!cameraRef.current || !videoRef.current) return;

    setCameraState(CameraState.REQUESTING_PERMISSION);
    setPermissionError(undefined);

    const granted = await cameraRef.current.requestPermission();

    if (granted) {
      cameraRef.current.attachToVideo(videoRef.current);
      
      videoRef.current.onloadedmetadata = () => {
        setCameraState(CameraState.ACTIVE);
        setIsProcessing(true);
        
        toast({
          title: "Camera activated",
          description: "Real-time processing started",
        });
      };
    } else {
      setCameraState(CameraState.ERROR);
      setPermissionError("Camera permission denied. Please enable camera access in your browser settings.");
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      setCameraState(CameraState.IDLE);
      setIsProcessing(false);
      
      toast({
        title: "Camera stopped",
        description: "Processing paused",
      });
    }
  }, [toast]);

  const toggleProcessing = useCallback(() => {
    setIsProcessing(prev => !prev);
  }, []);

  // Main processing loop
  const processFrame = useCallback(() => {
    if (!isProcessing || !cameraRef.current?.isActive() || !videoRef.current || !processorRef.current || !rendererRef.current) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const startTime = performance.now();

    try {
      // Extract frame from video
      let imageData = processorRef.current.extractFrame(videoRef.current);

      // Apply processing based on mode
      switch (processingMode) {
        case ProcessingMode.GRAYSCALE:
          imageData = processorRef.current.grayscale(imageData);
          break;
        case ProcessingMode.EDGE_DETECTION:
          imageData = processorRef.current.cannyEdgeDetection(
            imageData,
            params.cannyLowThreshold,
            params.cannyHighThreshold
          );
          break;
        case ProcessingMode.SOBEL:
          const { magnitude } = processorRef.current.sobel(imageData);
          imageData = magnitude;
          break;
        case ProcessingMode.THRESHOLD:
          imageData = processorRef.current.threshold(imageData, params.sobelThreshold);
          break;
        case ProcessingMode.RAW:
        default:
          // No processing
          break;
      }

      // Apply shader effect
      rendererRef.current.setShaderEffect(
        shaderEffect,
        params.brightnessValue,
        params.contrastValue
      );

      // Render to WebGL canvas
      rendererRef.current.renderFrame(imageData);

      const processingTime = performance.now() - startTime;

      // Update FPS
      const counter = fpsCounterRef.current;
      counter.frames++;
      const now = performance.now();
      const elapsed = now - counter.lastTime;

      if (elapsed >= 1000) {
        const fps = (counter.frames * 1000) / elapsed;
        const resolution = cameraRef.current.getResolution();

        setStats({
          fps,
          width: resolution.width,
          height: resolution.height,
          processingTime,
          timestamp: Date.now(),
        });

        counter.frames = 0;
        counter.lastTime = now;
      }
    } catch (error) {
      console.error('Frame processing error:', error);
    }

    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [isProcessing, processingMode, shaderEffect, params]);

  // Start processing loop
  useEffect(() => {
    if (isProcessing) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isProcessing, processFrame]);

  const handleParamsChange = useCallback((newParams: Partial<ProcessingParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <Camera className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Real-Time Computer Vision</h1>
            <p className="text-xs text-muted-foreground">WebGL Rendering • Edge Detection • TypeScript</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {cameraState === CameraState.ACTIVE && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleProcessing}
                data-testid="button-toggle-processing"
              >
                {isProcessing ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={stopCamera}
                data-testid="button-stop-camera"
              >
                <CameraOff className="mr-2 h-4 w-4" />
                Stop Camera
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 relative bg-background/50 flex items-center justify-center p-4">
          {cameraState === CameraState.IDLE && (
            <div className="flex flex-col items-center gap-6 max-w-md text-center">
              <div className="p-6 rounded-full bg-muted/50">
                <Camera className="h-16 w-16 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">Camera Not Active</h2>
                <p className="text-muted-foreground">
                  Click the button below to enable camera access and start real-time processing
                </p>
              </div>
              <Button
                size="lg"
                onClick={requestCameraPermission}
                data-testid="button-start-camera"
              >
                <Camera className="mr-2 h-5 w-5" />
                Start Camera
              </Button>
            </div>
          )}

          {cameraState !== CameraState.IDLE && (
            <>
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full border border-border rounded-md shadow-lg"
                data-testid="canvas-webgl"
              />
              <video
                ref={videoRef}
                className="hidden"
                autoPlay
                playsInline
                muted
              />
              <StatsOverlay stats={stats} cameraActive={cameraState === CameraState.ACTIVE} />
            </>
          )}
        </div>

        {/* Control Panel */}
        <ControlPanel
          processingMode={processingMode}
          shaderEffect={shaderEffect}
          params={params}
          onProcessingModeChange={setProcessingMode}
          onShaderEffectChange={setShaderEffect}
          onParamsChange={handleParamsChange}
          cameraActive={cameraState === CameraState.ACTIVE}
        />
      </div>

      {/* Camera Permission Modal */}
      <CameraPermissionModal
        open={cameraState === CameraState.REQUESTING_PERMISSION || cameraState === CameraState.ERROR}
        onRequestPermission={requestCameraPermission}
        error={permissionError}
      />
    </div>
  );
}
