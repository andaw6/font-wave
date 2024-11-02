import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import jsQR from 'jsqr';

interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
}

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.css'
})
export class QrScannerComponent {
  @ViewChild('qrVideo') qrVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('recentScans') recentScansList!: ElementRef<HTMLUListElement>;

  private stream: MediaStream | null = null;
  recentScans: string[] = [];

  ngOnInit(): void {
    this.startScanner();
  }

  ngOnDestroy(): void {
    this.closeScanner();
  }

  private async startScanner() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      this.qrVideo.nativeElement.srcObject = this.stream;
      this.qrVideo.nativeElement.play();
      requestAnimationFrame(() => this.scanQRCode());
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
    }
  }

  private scanQRCode() {
    if (!this.qrVideo.nativeElement.videoWidth) {
      requestAnimationFrame(() => this.scanQRCode());
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.qrVideo.nativeElement.videoWidth;
    canvas.height = this.qrVideo.nativeElement.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(this.qrVideo.nativeElement, 0, 0, canvas.width, canvas.height);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      console.log('QR Code detected:', code.data);
      this.addRecentScan(code.data);
      alert(`Code QR détecté: ${code.data}`);
    }

    requestAnimationFrame(() => this.scanQRCode());
  }

  toggleTorch() {
    if (!this.stream) return;
    const track = this.stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities() as ExtendedMediaTrackCapabilities;

    if (capabilities.torch) {
      const constraints = {
        advanced: [{ torch: true } as { [key: string]: boolean }]
      };
      track.applyConstraints(constraints)
        .then(() => {
          console.log('Torch toggled successfully');
          // Optionally update button state here
        })
        .catch(err => {
          console.error('Error toggling torch:', err);
        });
    } else {
      alert('La torche n\'est pas disponible sur cet appareil');
    }
  }

  closeScanner() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    // Handle closing logic, e.g., navigate away
  }

  private addRecentScan(data: string) {
    this.recentScans.unshift(data);
    if (this.recentScans.length > 5) {
      this.recentScans.pop();
    }
  }
}