import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mobile'
})
export class MobilePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any {
    if(!value || value == 'null'|| value == '0') return '';
    else if(value.length == 10 && value.substring(0, 1) != '0') return '0' + value.substring(0, 3) + '-' + value.substring(3);
    else if(value.length == 11 && value.substring(0, 1) == '0' && value.substring(4, 5) != '-') return value.substring(0, 4) + '-' + value.substring(4);
    else return value;
  }

}
