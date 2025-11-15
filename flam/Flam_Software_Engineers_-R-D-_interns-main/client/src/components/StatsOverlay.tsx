import { type FrameStats } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface StatsOverlayProps {
  stats: FrameStats;
  cameraActive: boolean;
}

export function StatsOverlay({ stats, cameraActive }: StatsOverlayProps) {
  const getFpsColor = (fps: number): string => {
    if (fps >= 30) return 'text-green-500';
    if (fps >= 15) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (!cameraActive) {
    return null;
  }

  return (
    <Card className="absolute top-4 left-4 p-4 bg-black/90 backdrop-blur-xl border-border/50 min-w-[240px]" data-testid="stats-overlay">
      <div className="space-y-2 font-mono text-sm">
        <div className="flex justify-between items-baseline gap-4">
          <span className="text-muted-foreground">FPS</span>
          <span className={`text-2xl font-bold tabular-nums ${getFpsColor(stats.fps)}`} data-testid="text-fps">
            {stats.fps.toFixed(1)}
          </span>
        </div>
        
        <div className="flex justify-between items-baseline gap-4">
          <span className="text-muted-foreground">Resolution</span>
          <span className="text-foreground tabular-nums" data-testid="text-resolution">
            {stats.width}×{stats.height}
          </span>
        </div>
        
        <div className="flex justify-between items-baseline gap-4">
          <span className="text-muted-foreground">Process Time</span>
          <span className="text-foreground tabular-nums" data-testid="text-processing-time">
            {stats.processingTime.toFixed(2)}ms
          </span>
        </div>
        
        <div className="flex justify-between items-baseline gap-4">
          <span className="text-muted-foreground">Timestamp</span>
          <span className="text-muted-foreground text-xs tabular-nums">
            {new Date(stats.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </Card>
  );
}
