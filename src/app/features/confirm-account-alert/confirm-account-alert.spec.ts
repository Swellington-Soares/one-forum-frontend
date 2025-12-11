import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAccountAlert } from './confirm-account-alert';

describe('ConfirmAccountAlert', () => {
  let component: ConfirmAccountAlert;
  let fixture: ComponentFixture<ConfirmAccountAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmAccountAlert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmAccountAlert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
