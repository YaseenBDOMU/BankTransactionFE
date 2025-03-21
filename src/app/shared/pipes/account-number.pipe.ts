import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'accountNumber'
})
export class AccountNumberPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
