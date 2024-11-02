import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-add',
  standalone: true,
  imports: [],
  templateUrl: './button-add.component.html',
  styleUrl: './button-add.component.css'
})
export class ButtonAddComponent {
  @Input({ required: true }) title!: string;
}
