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

  @HostListener('window:resize')
  @HostListener('window:scroll')
  updateScrollTopVisibility(): void {
    document.body.classList.toggle('gototop-active', window.scrollY > 240);
    document.body.classList.toggle('appz-past-intro', window.scrollY > Math.max(320, window.innerHeight - 76));
    // Yield the persistent action to the actual conversion form, including on
    // small screens where its keyboard and validation feedback need the space.
    const formVisible = Array.from(document.querySelectorAll<HTMLElement>(
      '.appz-demo, .contact-main, .features-api-panel'
    )).some(element => {
      const bounds = element.getBoundingClientRect();
      return bounds.width > 0 && bounds.bottom > 76 && bounds.top < window.innerHeight;
    });
    document.body.classList.toggle('appz-form-visible', formVisible);
  }
}
