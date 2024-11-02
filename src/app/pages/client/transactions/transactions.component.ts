import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ITransaction, ITransactionItem } from '../../../models/transaction.interface';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { LayoutStateService } from '../../../services/layout-state.service';
import { IUser } from '../../../models/user.interface';
import { Observable, of, Subject } from 'rxjs';
import { TransactionListComponent } from '../../../components/transaction-list/transaction-list.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { TransactionService } from '../../../services/transaction.service';
import { ApiResponse } from '../../../models/api-response.interface';
import { IParams } from '../../../models/interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionType } from '../../../enums/TransactionType';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [TransactionListComponent, PaginationComponent, CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {
  currentUser!: IUser;
  transactions!: ITransactionItem[];
  transactionAlls!: ITransactionItem[];
  filteredTransactions!: ITransactionItem[];
  totalPages: number = 1;
  currentPage: number = 1;
  loading: boolean = false;
  searchQuery: string = '';
  limit: number = 5;
  activePeriod: string = "all";
  private destroy$ = new Subject<void>();

  constructor(private layoutStateService: LayoutStateService, private transactionService: TransactionService) { }

  ngOnInit() {
    this.layoutStateService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
          this.loadTransaction([...user.transactions || [], ...user.received || []]);
        }
      });
  }


  loadTransaction(transactions: ITransaction[]) {
    this.transactionAlls = transactions.map(transaction => this.mapToTransactionItem(transaction)) || [];
    console.log(this.transactionAlls.find(trans=>trans.transactionType == TransactionType.PURCHASE));
    
    this.updateFilteredTransactions();
  }


  filterByDate(period: string): void {
    this.activePeriod = period;
    this.updateFilteredTransactions(); // Mettre à jour les transactions filtrées
  }

  onSearchChange(): void {
    this.updateFilteredTransactions(); // Mettre à jour lors d'un changement de recherche
  }

  private updateFilteredTransactions(): void {
    const today = new Date();

    // Filtrer par période
    this.filteredTransactions = this.transactionAlls.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt);

      switch (this.activePeriod) {
        case 'today':
          return transactionDate.toDateString() === today.toDateString();
        case 'week':
          const startOfWeek = new Date(today);
          const dayOfWeek = today.getDay();
          const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
          startOfWeek.setDate(today.getDate() + diff);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
        case 'month':
          return transactionDate.getMonth() === today.getMonth() && transactionDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    }).filter(transaction => // Ajouter la recherche
      transaction.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      transaction.user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    // Trier les transactions filtrées du plus récent au moins ancien
    this.filteredTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Mettre à jour le nombre total de pages et la page actuelle
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.limit);
    this.currentPage = 1; // Réinitialiser à la première page
    this.updateCurrentPageTransactions(); // Mettre à jour les transactions affichées
  }

  private updateCurrentPageTransactions(): void {
    const startIndex = (this.currentPage - 1) * this.limit;
    this.transactions = this.filteredTransactions.slice(startIndex, startIndex + this.limit);
  }

  private mapToTransactionItem(transaction: ITransaction): ITransactionItem {
    let sender = transaction.receiverId !== this.currentUser.id;
    return this.layoutStateService.mapToTransactionItem(transaction, sender);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateCurrentPageTransactions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
