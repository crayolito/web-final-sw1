import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelStripeComponent } from './cancel-stripe.component';

describe('CancelStripeComponent', () => {
  let component: CancelStripeComponent;
  let fixture: ComponentFixture<CancelStripeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelStripeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelStripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
