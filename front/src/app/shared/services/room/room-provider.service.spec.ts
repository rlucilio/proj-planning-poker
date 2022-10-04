import { TestBed } from '@angular/core/testing';

import { RoomProviderService } from './room-provider.service';

describe('RoomProviderService', () => {
  let service: RoomProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
