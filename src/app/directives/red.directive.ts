import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appRed]',
})
export class RedDirective {
  constructor(private readonly el: ElementRef) {
    el.nativeElement.style.color = '#E35E6B';
  }
}
