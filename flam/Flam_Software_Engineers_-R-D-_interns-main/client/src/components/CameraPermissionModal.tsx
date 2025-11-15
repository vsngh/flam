import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CameraPermissionModalProps {
  open: boolean;
  onRequestPermission: () => void;
  error?: string;
}

export function CameraPermissionModal({
  open,
  onRequestPermission,
  error,
}: CameraPermissionModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" data-testid="modal-camera-permission">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-primary/10">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl">Camera Access Required</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            This application requires access to your camera to perform real-time image processing and edge detection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">What we'll do with camera access:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Capture live video frames from your webcam</li>
              <li>Process frames using computer vision algorithms</li>
              <li>Render processed output with WebGL</li>
              <li>Display real-time performance statistics</li>
            </ul>
          </div>

          <Button
            onClick={onRequestPermission}
            className="w-full"
            size="lg"
            data-testid="button-request-camera"
          >
            <Camera className="mr-2 h-5 w-5" />
            Enable Camera Access
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your camera feed is processed locally in your browser.
            No data is sent to any server.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
