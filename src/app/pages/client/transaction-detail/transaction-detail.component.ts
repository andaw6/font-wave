import { Component, OnInit } from '@angular/core';
import { TransactionType } from '../../../enums/TransactionType';
import { ITransaction, ITransactionDetail, ITransactionHistoryItem } from '../../../models/transaction.interface';
import { IBeneficiaryDetail } from '../../../models/transaction.interface';
import { TransactionStatus } from '../../../enums/TransactionStatus';
import { FormatBalancePipe } from '../../../pipes/format-balance.pipe';
import { CommonModule, Location } from '@angular/common';
import { InitialPipe } from '../../../pipes/initial.pipe';
import { TransactionService } from '../../../services/transaction.service';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from '../../../models/api-response.interface';
import * as feather from 'feather-icons';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
  selector: 'app-transaction-detail',
  imports: [FormatBalancePipe, CommonModule, InitialPipe, HeaderComponent],
  standalone: true,
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.css'
})
export class TransactionDetailComponent implements OnInit {

  transaction!: ITransactionDetail;
  featherIcons: { [key: string]: string } = {};
  loading!: boolean;
  constructor(
    private route: ActivatedRoute, // Injection d'ActivatedRoute pour accéder aux paramètres de la route
    private transactionService: TransactionService,
    private location: Location
  ) { }

  ngOnInit(): void {
    // Récupère l'ID depuis les paramètres de la route
    const transactionId = this.route.snapshot.paramMap.get('id');
    if (transactionId) {
      this.loadTransaction(transactionId);

    }
    this.featherIcons = {
      check: feather.icons['check'].toSvg(),
      creditCard: feather.icons['credit-card'].toSvg(),
      printer: feather.icons['printer'].toSvg(),
      helpCircle: feather.icons['help-circle'].toSvg(),
      arrowLeft: feather.icons['arrow-left'].toSvg()
    };
  }

  // Méthode pour charger les détails de la transaction
  private loadTransaction(transactionId: string): void {
    this.loading = true;
    this.transactionService.getTransactionById(transactionId).subscribe({
      next: (response: ApiResponse<ITransaction>) => {
        console.log(response);
        
        this.transaction = this.formatTransactionData(response.data);
        this.loading = false;
      }, error: (error) => {
        console.error(error);
        this.loading = false;
        window.history.back();  
      }
    });
  }

  goBack() {
    this.location.back();
  }
  formatTransactionData(transaction: ITransaction, sender: boolean = true): ITransactionDetail {
    const beneficiary: IBeneficiaryDetail = {
      name: sender ? transaction.receiver.name : transaction.sender.name,
      email: sender ? transaction.receiver.email : transaction.sender.email,
      phone: sender ? transaction.receiver.phoneNumber : transaction.sender.phoneNumber,
    };
    const history: ITransactionHistoryItem[] = [
      {
        description: "Transaction complétée",
        date: new Date(transaction.updatedAt),
      },
      {
        description: "Paiement initié",
        date: new Date(transaction.createdAt),
      },
    ];
    const formattedTransaction: ITransactionDetail = {
      transactionId: transaction.id,
      status: transaction.status as TransactionStatus,
      type: transaction.transactionType as TransactionType,
      amount: transaction.amount,
      currency: transaction.currency,
      date: new Date(transaction.createdAt),
      beneficiary,
      history,
    };

    return formattedTransaction;
  }
}
