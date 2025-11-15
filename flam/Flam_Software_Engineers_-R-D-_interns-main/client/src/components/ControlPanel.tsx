import { ProcessingMode, ShaderEffect, type ProcessingParams } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Activity, Zap, Image as ImageIcon, Sliders } from "lucide-react";

interface ControlPanelProps {
  processingMode: ProcessingMode;
  shaderEffect: ShaderEffect;
  params: ProcessingParams;
  onProcessingModeChange: (mode: ProcessingMode) => void;
  onShaderEffectChange: (effect: ShaderEffect) => void;
  onParamsChange: (params: Partial<ProcessingParams>) => void;
  cameraActive: boolean;
}

export function ControlPanel({
  processingMode,
  shaderEffect,
  params,
  onProcessingModeChange,
  onShaderEffectChange,
  onParamsChange,
  cameraActive,
}: ControlPanelProps) {
  
  const processingModes = [
    { value: ProcessingMode.RAW, label: 'Raw Feed', icon: ImageIcon },
    { value: ProcessingMode.GRAYSCALE, label: 'Grayscale', icon: Activity },
    { value: ProcessingMode.EDGE_DETECTION, label: 'Edge Detection', icon: Zap },
    { value: ProcessingMode.SOBEL, label: 'Sobel', icon: Activity },
    { value: ProcessingMode.THRESHOLD, label: 'Threshold', icon: Sliders },
  ];

  const shaderEffects = [
    { value: ShaderEffect.NONE, label: 'None' },
    { value: ShaderEffect.INVERT, label: 'Invert' },
    { value: ShaderEffect.SEPIA, label: 'Sepia' },
    { value: ShaderEffect.BRIGHTNESS, label: 'Brightness' },
    { value: ShaderEffect.CONTRAST, label: 'Contrast' },
  ];

  return (
    <div className="w-full md:w-[380px] h-full overflow-y-auto bg-card border-l border-border p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Processing Controls</h2>
        <p className="text-sm text-muted-foreground">Configure real-time image processing</p>
      </div>

      <Separator />

      {/* Processing Mode Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Processing Mode
          </Label>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {processingModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = processingMode === mode.value;
            return (
              <Button
                key={mode.value}
                variant={isActive ? "default" : "outline"}
                className="justify-start gap-2 h-auto py-3"
                onClick={() => onProcessingModeChange(mode.value)}
                disabled={!cameraActive}
                data-testid={`button-mode-${mode.value}`}
              >
                <Icon className="h-4 w-4" />
                <span>{mode.label}</span>
                {isActive && (
                  <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Shader Effects Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            WebGL Shader Effects
          </Label>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {shaderEffects.map((effect) => {
            const isActive = shaderEffect === effect.value;
            return (
              <Button
                key={effect.value}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onShaderEffectChange(effect.value)}
                disabled={!cameraActive}
                data-testid={`button-shader-${effect.value}`}
              >
                {effect.label}
              </Button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Parameters Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Parameters
          </Label>
        </div>

        {/* Canny Thresholds */}
        {processingMode === ProcessingMode.EDGE_DETECTION && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="canny-low" className="text-sm">Low Threshold</Label>
                <span className="text-sm font-mono text-muted-foreground" data-testid="text-canny-low">
                  {params.cannyLowThreshold}
                </span>
              </div>
              <Slider
                id="canny-low"
                min={0}
                max={255}
                step={1}
                value={[params.cannyLowThreshold]}
                onValueChange={([value]) => onParamsChange({ cannyLowThreshold: value })}
                disabled={!cameraActive}
                data-testid="slider-canny-low"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="canny-high" className="text-sm">High Threshold</Label>
                <span className="text-sm font-mono text-muted-foreground" data-testid="text-canny-high">
                  {params.cannyHighThreshold}
                </span>
              </div>
              <Slider
                id="canny-high"
                min={0}
                max={255}
                step={1}
                value={[params.cannyHighThreshold]}
                onValueChange={([value]) => onParamsChange({ cannyHighThreshold: value })}
                disabled={!cameraActive}
                data-testid="slider-canny-high"
              />
            </div>
          </div>
        )}

        {/* Sobel Threshold */}
        {processingMode === ProcessingMode.SOBEL && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="sobel-threshold" className="text-sm">Sobel Threshold</Label>
              <span className="text-sm font-mono text-muted-foreground" data-testid="text-sobel-threshold">
                {params.sobelThreshold}
              </span>
            </div>
            <Slider
              id="sobel-threshold"
              min={0}
              max={255}
              step={1}
              value={[params.sobelThreshold]}
              onValueChange={([value]) => onParamsChange({ sobelThreshold: value })}
              disabled={!cameraActive}
              data-testid="slider-sobel-threshold"
            />
          </div>
        )}

        {/* Brightness */}
        {shaderEffect === ShaderEffect.BRIGHTNESS && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="brightness" className="text-sm">Brightness</Label>
              <span className="text-sm font-mono text-muted-foreground" data-testid="text-brightness">
                {params.brightnessValue > 0 ? '+' : ''}{params.brightnessValue}
              </span>
            </div>
            <Slider
              id="brightness"
              min={-100}
              max={100}
              step={1}
              value={[params.brightnessValue]}
              onValueChange={([value]) => onParamsChange({ brightnessValue: value })}
              disabled={!cameraActive}
              data-testid="slider-brightness"
            />
          </div>
        )}

        {/* Contrast */}
        {shaderEffect === ShaderEffect.CONTRAST && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="contrast" className="text-sm">Contrast</Label>
              <span className="text-sm font-mono text-muted-foreground" data-testid="text-contrast">
                {params.contrastValue > 0 ? '+' : ''}{params.contrastValue}
              </span>
            </div>
            <Slider
              id="contrast"
              min={-100}
              max={100}
              step={1}
              value={[params.contrastValue]}
              onValueChange={([value]) => onParamsChange({ contrastValue: value })}
              disabled={!cameraActive}
              data-testid="slider-contrast"
            />
          </div>
        )}
      </div>
    </div>
  );
}
