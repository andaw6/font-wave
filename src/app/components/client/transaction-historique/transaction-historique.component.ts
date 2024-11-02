import { Component, Input } from '@angular/core';
import { TransactionListComponent } from '../../transaction-list/transaction-list.component';
import { ITransactionItem } from '../../../models/transaction.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-transaction-historique',
  standalone: true,
  imports: [TransactionListComponent, RouterModule],
  templateUrl: './transaction-historique.component.html',
  styleUrl: './transaction-historique.component.css'
})
export class TransactionHistoriqueComponent {
  @Input() transactions!: ITransactionItem[];
}
