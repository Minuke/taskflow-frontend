import { formatDate } from '@angular/common';
import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'friendlyDate',
})
export class FriendlyDatePipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) {
      return '';
    }

    const formatted = formatDate(value, 'd MMMM y', 'es-ES');
    const [day, month, year] = formatted.split(' ');
    return `${day} ${this.capitalize(month)} ${year}`;
  }

  private capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
