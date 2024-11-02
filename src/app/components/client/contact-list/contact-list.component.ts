import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactCardComponent } from '../contact-card/contact-card.component';
import { IContact } from '../../../models/contact.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [ContactCardComponent, CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent {
  @Input() title: string = "Contacts";
  @Input({ required: true }) contacts!: IContact []
  @Output() contactSelected = new EventEmitter<IContact>();

  onContactClick(contact: IContact) {
    this.contactSelected.emit(contact);
  } 
}
