import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../../src/app/services/shared_function/common-function.service';
import { Meta, Title } from "@angular/platform-browser";
import { MatDialog } from '@angular/material/dialog';
import { ModalRequestDemoComponent } from '../../modal-request-demo/modal-request-demo.component';

@Component({
  selector: 'app-blog-main-page',
  templateUrl: './blog-main-page.component.html',
  styleUrls: ['./blog-main-page.component.css']
})
export class BlogMainPageComponent {

  constructor(private titleService: Title, private commonFunctionService: CommonFunctionService, private meta: Meta, public dialog: MatDialog) {
    this.titleService.setTitle("BCRS Singapore 2026: What Every Retailer Needs to Know About the Beverage Container Return Scheme");
  };

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    //Primary SEO
    this.meta.updateTag({ name: 'description', content: 'BCRS-ready POS system for Singapore F&B & retail businesses. Manage beverage container return scheme deposits, orders, sales & delivery integration. WhatsApp +65 8310 9631' });
    this.meta.updateTag({ name: 'keywords', content: 'BCRS Singapore, POS system Singapore, F&B POS, beverage container return scheme, APPZPOS, retail POS Singapore, BCRS compliant POS' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'author', content: 'APPZPOS Singapore' });

    //Open Graph (Facebook / LinkedIn preview)
    this.meta.updateTag({ property: 'og:title', content: 'BCRS Singapore 2026 – What Every Retailer Needs to Know | APPZPOS' });
    this.meta.updateTag({ property: 'og:description', content: 'Singapore Beverage Container Return Scheme launches April 2026. Learn how APPZPOS POS system is BCRS- ready from Day 1.' });
    this.meta.updateTag({ property: 'og:image', content: this.BindURL_Image('blog/blog-bcrs.jpg')});
    this.meta.updateTag({ property: 'og:url', content: 'https://appzpos.com/blog-bcrs' });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'APPZPOS' });
    this.meta.updateTag({ property: 'og:locale', content: 'en_SG' });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'BCRS Singapore 2026 – APPZPOS is Ready' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Everything Singapore retailers need to know about the Beverage Container Return Scheme and how APPZPOS handles it automatically.' });
    this.meta.updateTag({ name: 'twitter:image', content: this.BindURL_Image('blog/blog-bcrs.jpg') });

    //Article-specific
    this.meta.updateTag({ property: 'article:published_time', content: '2026-03-18T00:00:00+08:00' });
    this.meta.updateTag({ property: 'article:author', content: 'APPZPOS Singapore' });
    this.meta.updateTag({ property: 'article:section', content: 'Business & Technology' });
    this.meta.updateTag({ property: 'article:tag', content: 'BCRS, POS System, Singapore, F&B, Retail' });

    // Canonical & Geo
    this.meta.updateTag({ name: 'geo.region', content: 'SG' });
    this.meta.updateTag({ name: 'geo.placename', content: 'Singapore' });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ModalRequestDemoComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
