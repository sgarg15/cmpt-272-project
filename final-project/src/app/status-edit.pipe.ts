import { Pipe, PipeTransform } from '@angular/core';
import { Status } from './util/status.module';

@Pipe({
  name: 'statusEdit',
})
export class StatusEditPipe implements PipeTransform {
  transform(status: any, type: String): any {
    switch (type) {
      case 'string':
        switch (status) {
          case 'Ready for Pickup':
            return Status.READYFORPICKUP;
          case 'Retrieved':
            return Status.RETRIEVED;
          default:
            return Status.READYFORPICKUP;
        }
      case 'status':
        switch (status) {
          case Status.READYFORPICKUP:
            return 'READY FOR PICKUP';
          case Status.RETRIEVED:
            return 'RETRIEVED';
        }
    }
  }
}
