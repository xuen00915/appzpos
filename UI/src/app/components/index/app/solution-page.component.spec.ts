import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SolutionPageComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/solution-page/solution-page.component';

@Component({
  standalone: true,
  imports: [SolutionPageComponent],
  template: `<app-solution-page>
    <header solutionHero>Solution hero</header>
    <section id="features"><button (click)="selected = true">Select feature</button></section>
    <form id="requestdemo"><input name="email"></form>
    <a solutionFloating class="btn-whatsapp" href="https://wa.me/6583109631">WhatsApp</a>
  </app-solution-page>`
})
class SolutionPageHost {
  selected = false;
}

describe('SolutionPageComponent', () => {
  it('projects route content and preserves its events, anchors and contact hooks', () => {
    const fixture = TestBed.configureTestingModule({ imports: [SolutionPageHost] })
      .createComponent(SolutionPageHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('#content').length).toBe(1);
    expect(root.querySelector('app-solution-page > header')).not.toBeNull();
    expect(root.querySelector('#content .content-wrap > #features')).not.toBeNull();
    expect(root.querySelector('#content #requestdemo input[name="email"]')).not.toBeNull();
    expect(root.querySelector('app-solution-page > .btn-whatsapp')?.getAttribute('href'))
      .toBe('https://wa.me/6583109631');
    root.querySelector<HTMLButtonElement>('#features button')!.click();
    expect(fixture.componentInstance.selected).toBeTrue();
  });
});
