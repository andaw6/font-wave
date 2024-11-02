import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IUser } from '../../../models/user.interface';
import { IContact } from '../../../models/contact.interface';
import { LayoutStateService } from '../../../services/layout-state.service';;
import { HeaderComponent } from '../../../components/header/header.component';
import { ContactListComponent } from '../../../components/client/contact-list/contact-list.component';
import { ButtonAddComponent } from '../../../components/button-add/button-add.component';
import { TransactionService } from '../../../services/transaction.service';
import { ApiResponse } from '../../../models/api-response.interface';
import { ITransaction } from '../../../models/transaction.interface';
import { ErrorDisplayComponent } from '../../../components/error-display/error-display.component';
import { ErrorDisplay } from '../../../models/interface';
import { style, transition, trigger } from '@angular/animations';
import { animate } from '@angular/animations';

@Component({
  selector: 'app-buy-credit',
  standalone: true,
  imports: [HeaderComponent, ContactListComponent, CommonModule, ButtonAddComponent, FormsModule, ErrorDisplayComponent],
  templateUrl: './buy-credit.component.html',
  styleUrls: ['./buy-credit.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class BuyCreditComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  currentUser!: IUser;
  favorites: IContact[] = [];
  contacts: IContact[] = [];
  filteredContacts: IContact[] = [];
  isModalOpen = false;
  buyCredit = { phoneNumber: "", montant: 100, userName: "" };
  searchQuery: string = ''; // Ajoutez cette ligne
  isDisabled: boolean = false;
  errorList: ErrorDisplay[] = [];
  isLoading = false;
  isSuccess = false;

  constructor(
    private layoutStateService: LayoutStateService,
    private transactionService: TransactionService
  ) { }

  ngOnInit() {
    this.layoutStateService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
          this.favorites = [
            this.createUserContact(user),
            ...(user.contacts?.filter(contact => contact.favorite) || [])
          ];
          this.contacts = user.contacts?.filter(contact => !contact.favorite) || [];
          this.filteredContacts = [...this.contacts];
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isValidPhone(): boolean {
    const phoneNumberPattern = /^\+221(77|78|76|70|75)\d{7}$/;
    return phoneNumberPattern.test(this.buyCredit.phoneNumber);
  }
  isValidMontant = (): boolean => this.buyCredit.montant >= 100;
  isValidName = (): boolean => this.buyCredit.userName.length > 0;
  isValidForm = (): boolean => this.isValidMontant() && this.isValidName() && this.isValidPhone();

  onSearch(): void {
    this.filteredContacts = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      contact.phoneNumber.includes(this.searchQuery)
    );
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.buyCredit = { phoneNumber: "", montant: 100, userName: "" };
    this.isModalOpen = false;
    this.isDisabled = false;
  }

  createUserContact(user: IUser): IContact {
    return {
      id: new Date().toString(),
      userId: user.id,
      name: "Mon Numéro",
      phoneNumber: user.phoneNumber,
      email: user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: user,
      favorite: true,
    };
  }

  onSubmit(): void {
    console.log('Achat de crédit validé:', this.buyCredit);
    this.isLoading = true;
    this.isSuccess = false;
    this.transactionService.credit({
      receiverName: this.buyCredit.userName,
      receiverPhoneNumber: this.buyCredit.phoneNumber,
      feeAmount: 0,
      amount: this.buyCredit.montant
    }).subscribe({
      next: (response: ApiResponse<ITransaction>) => {
        this.isSuccess = true;
        this.currentUser?.transactions?.push(response.data);
        this.layoutStateService.setCurrentUser({ ...this.currentUser });
        setTimeout(() => {
          this.isLoading = false;
          this.closeModal();
        }, 2000);
      },
      error: (response: any) => {
        this.isLoading = false;
        const error: ApiResponse<any> = response.error;
        let message: string = error.error as string;
        if (error.error == true)
          message = error.message;
        this.isSuccess = false;
        this.closeModal();
        this.addError({ title: "Envoie d'argent", message })
      }
    });
  }

  private addError(error: { title: string, message: string }) {
    this.errorList.push(error);
    setTimeout(() => {
      this.errorList = [];
    }, 3000);
  }


  onContactSelected(contact: IContact) {
    console.log("le contact selectionner", contact);
    this.buyCredit.phoneNumber = contact.phoneNumber;

    this.buyCredit.userName = (contact.name === "Mon Numéro") ? this.currentUser.name : contact.name;
    this.isDisabled = true;
    this.openModal();
  }
}
