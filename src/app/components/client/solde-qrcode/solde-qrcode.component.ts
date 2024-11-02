import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';
import { QrCodeService } from '../../../services/qr-code.service';
import { FormatBalancePipe } from '../../../pipes/format-balance.pipe';
import { CryptoService } from '../../../services/crypto.service';


@Component({
  selector: 'app-solde-qrcode',
  standalone: true,
  imports: [CommonModule, FormatBalancePipe],
  templateUrl: './solde-qrcode.component.html',
  styleUrls: ['./solde-qrcode.component.css'] // Correction ici
})
export class SoldeQrcodeComponent implements OnInit, OnDestroy {
  private qrCodeInitial!: string;
  showBalance: boolean = false;
  @Input() walletBalance: number | undefined = 0;
  @Input() currency: string | undefined = "FCFA";
  @Input() qrcode: string = "https://via.placeholder.com/128";

  private destroy$ = new Subject<void>();

  constructor(
    private qrcodeService: QrCodeService,
    private cryptageService: CryptoService
  ) { }

  ngOnInit(): void {
    this.qrCodeInitial = this.qrcode;
    this.scheduleQrCodeUpdate();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleBalance(): void {
    this.showBalance = !this.showBalance;
  }

  private scheduleQrCodeUpdate(): void {
    this.updateQRCode();
    interval(2 * 60 * 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateQRCode());
  }

  private updateQRCode() {

    if (this.qrCodeInitial) {

      const expirationTime = new Date((new Date()).getTime() + 2 * 60000);
      const expirationISO = this.cryptageService.encrypt(expirationTime.toISOString());

      const milieu = Math.ceil(expirationISO.length / 2);
      const start = expirationISO.slice(0, milieu);
      const end = expirationISO.slice(milieu);
      console.log(expirationTime, start, end);
      const qrCodeData = `${this.qrCodeInitial}.${start}.${end}`;
      this.qrcodeService.generateQRCode(qrCodeData)
        .then(res => this.qrcode = res)
        .catch(err => console.error('Erreur lors de la génération du QR Code', err));
    }
  }

  private async isQRCodeValid(qrCodeData: string): Promise<boolean> {
    const [_, startDateCrypted, endDateCrypted] = qrCodeData.split('/');
    const now = new Date();


    // Décoder les dates
    const startDate: string = await this.cryptageService.decrypt(startDateCrypted);
    const endDate: string = await this.cryptageService.decrypt(endDateCrypted);
    // const [startDate, endDate] = [startDateCrypted, endDateCrypted]
    return now >= new Date(startDate) && now <= new Date(endDate);
  }
}
