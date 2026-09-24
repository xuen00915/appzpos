import { Component, AfterViewInit, HostListener } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  ngAfterViewInit() {
    $.getScript('assets/template/canvas/js/functions.js');
    this.updateScrollTopVisibility();
  }

  @HostListener('window:scroll')
  updateScrollTopVisibility(): void {
    document.body.classList.toggle('gototop-active', window.scrollY > 240);
  }
}
