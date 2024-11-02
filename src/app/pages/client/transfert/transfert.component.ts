import { Component, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms'; // Assurez-vous d'importer ReactiveFormsModule si vous utilisez Reactive Forms
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';
import { IUser } from '../../../models/user.interface';
import { IContact } from '../../../models/contact.interface';
import { LayoutStateService } from '../../../services/layout-state.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { ContactListComponent } from '../../../components/client/contact-list/contact-list.component';
import { ButtonAddComponent } from '../../../components/button-add/button-add.component';
import { CommonModule } from '@angular/common';
import { state, style, transition, trigger } from '@angular/animations';
import { animate } from '@angular/animations';
import { ButtonQrcodeComponent } from '../../../components/button-qrcode/button-qrcode.component';
import { QrScannerComponent } from '../../../components/qr-scanner/qr-scanner.component';
import { TransactionService } from '../../../services/transaction.service';
import { ITransaction } from '../../../models/transaction.interface';
import { ApiResponse } from '../../../models/api-response.interface';
import { ErrorDisplayComponent } from '../../../components/error-display/error-display.component';
import { SubmitButtonComponent } from '../../../components/submit-button/submit-button.component';
import { ErrorDisplay } from '../../../models/interface';

@Component({
  selector: 'app-transfert',
  standalone: true,
  imports: [
    FormsModule, MatCardModule, HeaderComponent, MatIconModule, ErrorDisplayComponent, SubmitButtonComponent,
    MatInputModule, MatFormFieldModule, ReactiveFormsModule, QrScannerComponent,
    ContactListComponent, ButtonAddComponent, CommonModule, ButtonQrcodeComponent],
  templateUrl: './transfert.component.html',
  styleUrl: './transfert.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ transform: 'translateY(-20px)', opacity: 0 })),
      ]),
    ]),
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', minHeight: '0', opacity: 0 })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('expanded <=> collapsed', animate('300ms ease-out')),
    ]),
  ]
})
export class TransfertComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  currentUser!: IUser;
  searchQuery: string = '';
  beneficiaireName: string = 'Andaw Ciss';
  beneficiairePhone: string = '+221774565467'
  favorites: IContact[] = [];
  contacts: IContact[] = [];
  errorList: ErrorDisplay[] = [];
  filteredContacts: IContact[] = [];
  @Input() isModalOpen = false;
  isContactSelected: boolean = false; // État pour gérer la sélection du contact
  montantAccount: number = 0; // Montant du compte
  // @Output() closeModal = new EventEmitter<void>();
  scan: boolean = false;
  transfertForm!: FormGroup;
  showFrais = false;
  focusedField: string | null = null;
  readonly minMontant: number = 5;


  constructor(private fb: FormBuilder, private layoutStateService: LayoutStateService, private transactionService: TransactionService) { }


  closeModal(): void {
    this.transfertForm.reset();
    this.isModalOpen = false;
  }

  openModal(): void {
    this.isModalOpen = true;
  }


  ngOnInit() {
    this.layoutStateService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
          this.favorites = [
            ...(user.contacts?.filter(contact => contact.favorite) || [])
          ];
          this.contacts = user.contacts?.filter(contact => !contact.favorite) || [];
          this.filteredContacts = [...this.contacts];
          this.montantAccount = this.currentUser.account?.balance || 0;
        }
      });

    this.transfertForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+221(77|78|76|70|75)\d{7}$/)]],
      montant: [null, [Validators.required, Validators.min(this.minMontant)]],
      recu: [null, [Validators.required, Validators.min(0)]]
    });

    // Écouter les changements du montant pour calculer les frais
    this.transfertForm.get('montant')?.valueChanges.subscribe(value => {
      this.updateFraisTransaction(value);
    });

  }

  isLoading = false;
  isSuccess = false;




  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    this.filteredContacts = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      contact.phoneNumber.includes(this.searchQuery)
    );
  }

  isValidInput(): boolean {
    return this.transfertForm.valid;
  }


  onContactSelected(contact: IContact) {
    console.log("Le contact sélectionné", contact);
    this.transfertForm.patchValue({
      name: contact.name,
      phoneNumber: contact.phoneNumber
    });
    this.transfertForm.get('name')?.disable();
    this.transfertForm.get('phoneNumber')?.disable();
    this.isContactSelected = true;
    this.openModal();
  }

  toggleFrais() {
    this.showFrais = !this.showFrais;
  }

  onFocus(field: string) {
    this.focusedField = field;
  }

  onBlur(field: string) {
    if (this.focusedField === field) {
      this.focusedField = null;
    }
  }

  isFocused(field: string): boolean {
    return this.focusedField === field;
  }

  updateFraisTransaction(montant: number | null) {
    montant = Number(montant);
    if (montant && montant >= this.minMontant) {
      const frais: number = Math.max(this.minMontant, montant * 0.01); // Calculer les frais (1%)
      console.log("frais", frais);

      const total = Number(montant + frais);
      console.log(this.montantAccount, total, montant, frais);

      // Vérifiez si le total dépasse le solde du compte
      if (total > this.montantAccount) {
        this.transfertForm.get('montant')?.setErrors({ insufficientFunds: true });
        this.transfertForm.patchValue({ recu: null }, { emitEvent: false }); // Réinitialiser le champ recu
      } else {
        this.transfertForm.patchValue({ recu: montant - frais }, { emitEvent: false }); // Mettre à jour le champ recu sans émettre d'événement
      }
    } else {
      this.transfertForm.patchValue({ recu: null }, { emitEvent: false }); // Réinitialiser le champ recu si le montant est invalide
    }
  }

  onSubmit() {
    this.errorList = [];
    if (this.transfertForm.valid) {
      const montant: number = Number(this.transfertForm.value.montant);
      const frais = Math.max(100, montant * 0.01);
      const total = montant + frais;

      // Vérifiez si le total dépasse le solde du compte avant de soumettre
      if (total > this.montantAccount) {
        // Afficher un message d'erreur ou une alerte à l'utilisateur
        alert('Fonds insuffisants pour cette transaction.');
        return;
      }
      // Assurez-vous que receiverPhoneNumber est bien récupéré du formulaire
      const receiverPhoneNumber: string = this.transfertForm.get('phoneNumber')?.value as string;
      console.log(receiverPhoneNumber);

      this.isLoading = true;
      this.isSuccess = false;
      // Appel au service de transaction pour effectuer le transfert
      this.transactionService.transfert({
        amount: montant,
        receiverPhoneNumber: receiverPhoneNumber,
        feeAmount: frais
      }).subscribe({
        next: (response: ApiResponse<{ sendTransaction: ITransaction, receiveTransaction: ITransaction }>) => {
          console.log('Transaction réussie :', response);
          this.transfertForm.reset();

          this.isLoading = false;
          this.isSuccess = true;
          setTimeout(() => {
            this.isSuccess = false;
            this.closeModal();
          }, 2000);
          this.currentUser?.transactions?.push(response.data.sendTransaction);
          this.currentUser?.received?.push(response.data.receiveTransaction);
          this.layoutStateService.setCurrentUser({ ...this.currentUser });
        },
        error: (response: any) => {
          // console.error('Erreur lors de la transaction :', error);
          const error: ApiResponse<any> = response.error;
          let message: string = error.error as string;
          if (error.error == true)
            message = error.message;
          this.closeModal();
          this.isLoading = false;
          this.isSuccess = false;
          this.addError({ title: "Envoie d'argent", message })
        },
        complete: () => {
          console.log('Transaction complétée.');
        }
      });
    } else {
      // this.closeModal();
      this.addError({ title: "Formulaire", message: "Formulaire non valide" })
      // alert("Formulaire invalide. Veuillez vérifier les informations saisies.");
    }
  }

  private addError(error: { title: string, message: string }) {
    this.errorList.push(error);
    setTimeout(() => {
      this.errorList = [];
    }, 3000);
  }



  startScanner() {
    this.scan = true;
  }




}
