import { Component, Input } from '@angular/core';
import { ITransactionItem } from '../../models/transaction.interface';
import { CommonModule } from '@angular/common';
import { FormatBalancePipe } from '../../pipes/format-balance.pipe';
import { TransactionStatus } from '../../enums/TransactionStatus';
import { TransactionType } from '../../enums/TransactionType';
import { Router } from '@angular/router';
import { InitialPipe } from '../../pipes/initial.pipe';

@Component({
  selector: 'app-transaction-item',
  standalone: true,
  imports: [CommonModule, FormatBalancePipe, InitialPipe],
  templateUrl: './transaction-item.component.html',
  styleUrl: './transaction-item.component.css'
})
export class TransactionItemComponent {
  @Input({ required: true }) transaction!: ITransactionItem;
  transactionStatus = TransactionStatus;
  transactionType = TransactionType;

  constructor(private router: Router) { }

  navigateToTransactionDetail(transactionId: string): void {
    console.log(transactionId);
    
    this.router.navigate([`/client/transactions/${transactionId}`]);

  }

}
