import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveJobsComponent } from './inactive-jobs.component';

describe('InactiveJobsComponent', () => {
  let component: InactiveJobsComponent;
  let fixture: ComponentFixture<InactiveJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InactiveJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InactiveJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
