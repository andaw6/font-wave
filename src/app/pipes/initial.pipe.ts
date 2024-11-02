import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initial',
  standalone: true
})
export class InitialPipe implements PipeTransform {
  transform(name: string): string {
    const words = name.split(' ');
    let initials = '';

    for (const word of words) {
      if (word) {
        initials += word.charAt(0).toUpperCase();
      }
    }

    return initials;
  }
}
