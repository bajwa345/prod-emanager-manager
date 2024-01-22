import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cnic'
})
export class CnicPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any {
    if(!value) return '';
    else if(value.length != 13) return value;
    else return value.substring(0, 5) + '-' + value.substring(5, 12) + '-' + value.substring(12);
  }

}
