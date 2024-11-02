import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-qrcode',
  standalone: true,
  imports: [],
  templateUrl: './button-qrcode.component.html',
  styleUrl: './button-qrcode.component.css'
})
export class ButtonQrcodeComponent {
  @Input({ required: true }) title!: string;
}
