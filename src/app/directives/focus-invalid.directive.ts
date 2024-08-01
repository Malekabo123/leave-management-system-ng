import {
  ContentChildren,
  Directive,
  HostListener,
  QueryList,
} from '@angular/core';
import { FormGroup, NgControl } from '@angular/forms';

@Directive({
  selector: '[focusInvalidInput]',
})
export class FocusInvalidInputDirective {
  @ContentChildren(NgControl) formControls!: QueryList<NgControl>;

  @HostListener('submit')
  check(formControls?: QueryList<NgControl>) {
    const controls = formControls
      ? formControls.toArray()
      : this.formControls.toArray();

    for (let field of controls) {
      if (field.invalid) {
        (field.valueAccessor as any)._elementRef.nativeElement.focus();
        break;
      }
    }
  }
}
