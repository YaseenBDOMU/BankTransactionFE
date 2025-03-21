import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'severityColor'
})
export class SeverityColorPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
