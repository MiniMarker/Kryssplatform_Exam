import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyDetailer',
})
export class CurrencyDetailerPipe implements PipeTransform {

  /**
   * Appends the displayed text in app to value+kr
   * @param {number} value value to use
   */
  transform(value: number, ...args) {
    return value + "kr"
  }
}
