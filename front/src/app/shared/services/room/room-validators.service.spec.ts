import { TestBed } from '@angular/core/testing';

import { RoomValidatorsService } from './room-validators.service';

describe('RoomValidatorService', () => {
  let service: RoomValidatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomValidatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
