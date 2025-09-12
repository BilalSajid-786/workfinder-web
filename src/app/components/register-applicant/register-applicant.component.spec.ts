import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterApplicantComponent } from './register-applicant.component';

describe('RegisterApplicantComponent', () => {
  let component: RegisterApplicantComponent;
  let fixture: ComponentFixture<RegisterApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterApplicantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
