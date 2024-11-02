import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validNumberSenegal',
  standalone: true
})
export class SenegalePhoneNumberPipe implements PipeTransform {
  transform(phoneNumber: string): boolean {
    const phoneNumberPattern = /^\+221(77|78|76|70|75)\d{7}$/;
    return phoneNumberPattern.test(phoneNumber);
  }
}
