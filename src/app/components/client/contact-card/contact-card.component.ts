import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OperatorInfo } from '../../../models/interface';
import { IContact } from '../../../models/contact.interface';
import { CommonModule } from '@angular/common';
import { style, state, transition, animate } from '@angular/animations';
import { trigger } from '@angular/animations';


@Component({
  selector: 'app-contact-card',
  standalone: true,
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css'],
  imports: [CommonModule],
  animations: [
    trigger('pulseAnimation', [
      state('idle', style({
        transform: 'scale(1)'
      })),
      state('hovered', style({
        transform: 'scale(1.05)'
      })),
      transition('idle <=> hovered', animate('200ms ease-in-out'))
    ])
  ]
})
export class ContactCardComponent implements OnInit {
  @Input({ required: true }) contact!: IContact;
  @Output() contactClicked = new EventEmitter<IContact>();

  onContactClick() {
    this.contactClicked.emit(this.contact);
  }
  isHovered = false;
  operatorInfo: OperatorInfo = { name: 'Inconnu', operatorClass: 'bg-gray-400', textColorClass: 'text-gray-600', gradientClass: "" };

  private operatorMap: { [key: string]: OperatorInfo } = {
    '+22170': { name: 'Expresso', operatorClass: 'bg-red-500', textColorClass: 'text-white', gradientClass: 'bg-gradient-to-br from-red-400 to-red-600' },
    '+22176': { name: 'Free', operatorClass: 'bg-blue-400', textColorClass: 'text-black', gradientClass: 'bg-gradient-to-br from-blue-300 to-blue-500' },
    '+22175': { name: 'Promobile', operatorClass: 'bg-yellow-400', textColorClass: 'text-black', gradientClass: 'bg-gradient-to-br from-yellow-300 to-yellow-500' },
    '+22177': { name: 'Orange', operatorClass: 'bg-orange-400', textColorClass: 'text-white', gradientClass: 'bg-gradient-to-br from-orange-300 to-orange-500' },
    '+22178': { name: 'Orange', operatorClass: 'bg-orange-400', textColorClass: 'text-white', gradientClass: 'bg-gradient-to-br from-orange-300 to-orange-500' }
  };

  ngOnInit(): void {
    this.operatorInfo = this.getOperatorInfo();
  }

  private getOperatorInfo(): OperatorInfo {
    for (const prefix in this.operatorMap) {
      if (this.contact.phoneNumber.startsWith(prefix)) {
        return this.operatorMap[prefix];
      }
    }
    return this.operatorMap['+22177']; // Renvoie l'objet pour "Inconnu"
  }
}
