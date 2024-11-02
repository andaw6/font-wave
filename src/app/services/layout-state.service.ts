import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../models/user.interface';
import { ITransactionItem } from '../models/transaction.interface';
import { ITransaction } from '../models/transaction.interface';

@Injectable({
  providedIn: 'root'
})
export class LayoutStateService {
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  setCurrentUser(user: IUser) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): Observable<IUser | null> {
    return this.currentUser$;
  }

  mapToTransactionItem(transaction: ITransaction, isSender: boolean): ITransactionItem {
    const baseTransaction = {
      id: transaction.id,
      amount: transaction.amount,
      feeAmount: transaction.feeAmount,
      currency: transaction.currency,
      transactionType: transaction.transactionType,
      status: transaction.status,
      createdAt: transaction.createdAt
    };

    if (transaction.creditPurchase) {
      return {
        ...baseTransaction,
        user: {
          id: transaction.creditPurchase.id,
          name: transaction.creditPurchase.receiverName ?? '',
          email: transaction.creditPurchase.receiverEmail ?? '',
          phoneNumber: transaction.creditPurchase.receiverPhoneNumber ?? '',
        }
      };
    }

    return {
      ...baseTransaction,
      user: isSender ? transaction.receiver : transaction.sender
    };
  }


  getTransactionFormUser(user: IUser): ITransactionItem[] {
    return [
      ...(user.transactions?.map(transaction => this.mapToTransactionItem(transaction, true)) || []),
      ...(user.received?.map(transaction => this.mapToTransactionItem(transaction, false)) || [])
    ]
  }
}
