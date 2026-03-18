import { TestBed } from '@angular/core/testing';

import { SchooldegreeService } from './schooldegree.service';

describe('SchooldegreeService', () => {
  let service: SchooldegreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchooldegreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
