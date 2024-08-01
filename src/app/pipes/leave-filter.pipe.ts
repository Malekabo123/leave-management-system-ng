import { Pipe, PipeTransform } from '@angular/core';
import { leavesFilter } from '../models/dashboard.model';

@Pipe({
  name: 'leaveFilter',
})
export class LeaveFilter implements PipeTransform {
  transform(items: leavesFilter[], searchTerm: string): leavesFilter[] {
    if (!items || !searchTerm) {
      return items;
    }
    searchTerm = searchTerm.toLowerCase();

    return items.filter((record) =>
      Object.values(record).some((value) =>
        value.toString().toLowerCase().includes(searchTerm)
      )
    );
  }
}
