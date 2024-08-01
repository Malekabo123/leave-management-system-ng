import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class Filter implements PipeTransform {
  //filter table components by text entered in search field
  transform(items: string[][], searchTerm: string): string[][] {
    if (!items || !searchTerm) {
      return items;
    }
    searchTerm = searchTerm.toLowerCase();
    return items.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(searchTerm))
    );
  }
}
