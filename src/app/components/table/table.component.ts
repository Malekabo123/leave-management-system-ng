import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input() tableHeaders!: string[];
  @Input() dataToDisplay!: string[][];
  @Input() search!: string;
  @Output() selectedEmployee = new EventEmitter();

  onClick(employeeId: string) {
    this.selectedEmployee.emit(employeeId);
  }

  isDate(item: string) {
    if (item.length > 6) {
      const date = new Date(item);

      return !isNaN(date.getTime());
    }
    return false;
  }
}
