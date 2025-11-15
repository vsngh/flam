/**
 * Camera Module - WebRTC camera capture and stream management
 * Equivalent to Android Camera2 API
 */

export class CameraCapture {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;

  async requestPermission(): Promise<boolean> {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      return false;
    }
  }

  attachToVideo(videoElement: HTMLVideoElement): void {
    if (!this.stream) {
      throw new Error('Camera stream not initialized');
    }

    this.videoElement = videoElement;
    videoElement.srcObject = this.stream;
    videoElement.play();
  }

  getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  getResolution(): { width: number; height: number } {
    if (!this.videoElement) {
      return { width: 0, height: 0 };
    }
    return {
      width: this.videoElement.videoWidth,
      height: this.videoElement.videoHeight,
    };
  }

  stop(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }
  }

  isActive(): boolean {
    return this.stream !== null && this.stream.active;
  }
}
