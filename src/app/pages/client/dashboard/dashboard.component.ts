import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransactionHistoriqueComponent } from '../../../components/client/transaction-historique/transaction-historique.component';
import { AccountInfoComponent } from '../../../components/client/account-info/account-info.component';
import { SoldeQrcodeComponent } from '../../../components/client/solde-qrcode/solde-qrcode.component';
import { IUser, IUserSettings } from '../../../models/user.interface';
import { ITransaction, ITransactionItem } from '../../../models/transaction.interface';
import { Subject, takeUntil } from 'rxjs';
import { LayoutStateService } from '../../../services/layout-state.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TransactionHistoriqueComponent, AccountInfoComponent, SoldeQrcodeComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser!: IUser;
  transactions!: ITransactionItem[];
  userSetting!: IUserSettings;
  currency: string = "FCFA";
  walletBalance: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private layoutStateService: LayoutStateService) { }

  ngOnInit() {
    this.layoutStateService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
          this.currency = user.account?.currency || "FCFA";
          this.userSetting = {
            id: user.id,
            plafond: user.account?.plafond || 0,
            name: user.name,
            currency: this.currency
          }
          this.walletBalance = user.account?.balance || 0;
          this.transactions =this.layoutStateService.getTransactionFormUser(user).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());          
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
