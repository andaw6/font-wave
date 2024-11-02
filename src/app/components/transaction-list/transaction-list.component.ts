import { Component, Input } from '@angular/core';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';
import { ITransactionItem } from '../../models/transaction.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [TransactionItemComponent, CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent {
  @Input({ required: true }) transactions!: ITransactionItem[];
}
