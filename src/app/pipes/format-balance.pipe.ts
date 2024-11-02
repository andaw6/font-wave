import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatBalance',
  standalone: true
})
export class FormatBalancePipe implements PipeTransform {

  transform(balance: number|undefined, currency: string = 'FCFA'): string {
    if(balance==undefined)
      balance = 0;
    return `${balance} ${currency}`; 
  }
}
