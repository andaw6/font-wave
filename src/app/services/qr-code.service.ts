import { Injectable } from '@angular/core';
import QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  constructor() { }

  generateQRCode(text: string): Promise<string> {
    return QRCode.toDataURL(text)
      .then(url => {
        return url; 
      })
      .catch(err => {
        console.error('Erreur lors de la génération du QR code', err);
        throw err;
      });
  }
}
