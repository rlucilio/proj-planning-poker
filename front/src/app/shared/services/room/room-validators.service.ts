import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { debounceTime, switchMap, map, catchError, tap, first } from 'rxjs/operators';
import { RoomProviderService } from './room-provider.service';
import { of } from 'rxjs';
import { IGetRoomResponse } from './models/provider-room-responses';

@Injectable()
export class RoomValidatorsService  {

  constructor(
    private roomProvider: RoomProviderService
  ) { }

  verifyRoomExist() {
    return (control: AbstractControl) => control
      .valueChanges
      .pipe(debounceTime(500))
      .pipe(switchMap((room: string) => this.roomProvider.getRoom(room.replace(/ /g, '_'))))
      .pipe(catchError(() => of(null)))
      .pipe(map((room: IGetRoomResponse | null) => room ? { roomExist: true } : null))
      .pipe(first());
  }

  verifyRoomNotExist() {
    return (control: AbstractControl) => control
      .valueChanges
      .pipe(debounceTime(500))
      .pipe(switchMap((room: string) => this.roomProvider.getRoom(room.replace(/ /g, '_'))))
      .pipe(catchError(() => of(null)))
      .pipe(map((room: IGetRoomResponse | null) => !room ? { roomNotExist: true } : null))
      .pipe(first());
  }
}
