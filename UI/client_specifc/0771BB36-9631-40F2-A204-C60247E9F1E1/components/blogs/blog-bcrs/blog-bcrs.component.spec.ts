import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogBcrsComponent } from './blog-bcrs.component';

describe('BlogBcrsComponent', () => {
  let component: BlogBcrsComponent;
  let fixture: ComponentFixture<BlogBcrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogBcrsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlogBcrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
