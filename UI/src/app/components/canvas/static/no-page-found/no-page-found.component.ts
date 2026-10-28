import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-no-page-found',
  templateUrl: './no-page-found.component.html',
  styleUrls: ['./no-page-found.component.css']
})
export class NoPageFoundComponent {

  constructor(private readonly titleService: Title, private readonly meta: Meta) {
    this.titleService.setTitle('Page Not Found | APPZPOS');
    this.meta.updateTag({
      name: 'description',
      content: 'The APPZPOS page you are looking for could not be found. Return home or request a POS demo for your business.'
    });
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
  }

}
