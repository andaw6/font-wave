import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SubmitButtonComponent {
  @Input() isDisabled = false;
  @Input() isLoading = false;
  @Input() buttonText = 'Envoyer';
  @Input() loadingText = 'Transfert en cours...';
  @Output() submitted = new EventEmitter<void>();

  onSubmit() {
    if (!this.isDisabled && !this.isLoading) {
      this.submitted.emit();
    }
  }
}