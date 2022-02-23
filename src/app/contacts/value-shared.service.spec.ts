import { TestBed } from '@angular/core/testing';

import { ValueSharedService } from './value-shared.service';

describe('ValueSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValueSharedService = TestBed.get(ValueSharedService);
    expect(service).toBeTruthy();
  });
});
