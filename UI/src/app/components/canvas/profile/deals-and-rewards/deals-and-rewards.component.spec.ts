import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsAndRewardsComponent } from './deals-and-rewards.component';

describe('DealsAndRewardsComponent', () => {
  let component: DealsAndRewardsComponent;
  let fixture: ComponentFixture<DealsAndRewardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DealsAndRewardsComponent]
    });
    fixture = TestBed.createComponent(DealsAndRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
