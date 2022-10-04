import { TestBed } from '@angular/core/testing';

import { RoomStorageGuard } from './room-storage.guard';

describe('RoomStorageGuard', () => {
  let guard: RoomStorageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoomStorageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
