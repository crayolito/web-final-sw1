import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucessStripeComponent } from './sucess-stripe.component';

describe('SucessStripeComponent', () => {
  let component: SucessStripeComponent;
  let fixture: ComponentFixture<SucessStripeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucessStripeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SucessStripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
