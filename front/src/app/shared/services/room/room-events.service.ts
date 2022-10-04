import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { StorageService } from '../storage/storage.service';
import { EventsRoom } from './models/eventsRoom';
import { Subscription, Observable, ReplaySubject, BehaviorSubject } from 'rxjs';
import { tap, map, switchMap, take } from 'rxjs/operators';
import { IRoom } from '../../models/room';
import { v4 as uuidv4 } from 'uuid';
import { IDisconnectUserReturn, IReturnFlipVote, IReturnTask, IReturnUserEvent, IReturnVote } from './models/eventsRoom.model';

interface ICreateTask {
  roomName: string;
  taskName: string;
  description: string;
}

interface IVoteTask {
  value: number;
  socketId: string;
  uuid: string;
  roomName: string;
  taskId: string;
}

interface IRequestsVotes {
  roomName: string;
  taskId: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomEventsService {
  private subjectConnect = new BehaviorSubject<boolean>(false);
  events: Subscription[] = [];

  constructor(
    private socketService: SocketService,
    private storage: StorageService,
  ) { }

  reconnect(): boolean {
    return this.socketService.connect();
  }

  connect(room: string, nameUser?: string): Observable<boolean> {
    let roomStorage =  this.storage.getObject<IRoom>('room');
    const uuidStorage = this.storage.getValue('uuid');
    const uuid = uuidStorage ? uuidStorage : uuidv4();

    roomStorage = {
      roomName: room,
      user: {
        name: roomStorage?.user?.name,
        uuid
      }
    };

    this.storage.setObject('room', roomStorage);
    this.storage.setValue('uuid', uuid);
    this.socketService.createConnectionRoom(room, roomStorage.user.uuid, nameUser);
    this.events.forEach(event => event.unsubscribe());

    this.events.push(this.socketService.fromEvent(EventsRoom.error_socket).subscribe(
      (result: { event: string; msg?: string, error: any, params: any }) => {
        this.sendError(result);
      }));

    this.events.push(this.socketService.fromEvent(EventsRoom.error).subscribe(
      (result: { event: string; error: any, params: any }) => {
        this.sendError(result);
      }));

    this.subjectConnect.next(true);
    return this.subjectConnect.pipe(take(2));
  }

  disconnect() {
    this.socketService.disconnect();
  }

  clear() {
    this.storage.clear();
    this.socketService.disconnect();
  }

  get onConnectObserver(): Observable<boolean> {
    return this.subjectConnect.pipe(
      switchMap(() => this.socketService.fromEvent(EventsRoom.newObserver).pipe(
        tap((response: { msg: string, user: string, socketId: string }) => {
          const room = this.storage.getObject<IRoom>('room');

          room.user = {
            socketID: response.socketId
          };

          this.storage.setObject('room', room);

        }),
        map(response => !!response)
      ))
    );
  }

  get onConnectUser(): Observable<IReturnUserEvent> {
    return this.subjectConnect.pipe(
      switchMap(() => this.socketService.fromEvent(EventsRoom.joinRoom).pipe(
        tap((response: IReturnUserEvent) => {
          const room = this.storage.getObject<IRoom>('room');

          room.user = {
            name: response.user,
            socketID: response.socketId,
            uuid: room.user.uuid
          };

          this.storage.setObject('room', room);
        }),
      ))
    );
  }

  get onJoinUser(): Observable<IReturnUserEvent> {
    return this.subjectConnect
    .pipe(switchMap(() => this.socketService.fromEvent<IReturnUserEvent>(EventsRoom.joinRoom)));
  }

  get onJoinObserver(): Observable<IReturnUserEvent> {
    return this.subjectConnect
    .pipe(switchMap(() => this.socketService.fromEvent<IReturnUserEvent>(EventsRoom.newObserver)));
  }

  get onReturnUser(): Observable<IReturnUserEvent> {
    return this.subjectConnect
      .pipe(switchMap(() => this.socketService.fromEvent<IReturnUserEvent>(EventsRoom.returnRoom)));
  }

  get onUserDisconnect(): Observable<IDisconnectUserReturn> {
    return this.subjectConnect
      .pipe(switchMap(() => this.socketService.fromEvent<IDisconnectUserReturn>(EventsRoom.userDisconnected)));
  }

  get onNewTask(): Observable<IReturnTask> {
    return this.subjectConnect
      .pipe(switchMap(() => this.socketService.fromEvent<IReturnTask>(EventsRoom.newTask)));
  }

  get onResetTask(): Observable<void> {
    return this.subjectConnect
      .pipe(switchMap(() => this.socketService.fromEvent<void>(EventsRoom.resetTask)));
  }

  get onVote(): Observable<IReturnVote> {
    return this.subjectConnect
      .pipe(switchMap(() => this.socketService.fromEvent<IReturnVote>(EventsRoom.newVote)));
  }

  get onFlip(): Observable<IReturnFlipVote> {
    return this.subjectConnect
      .pipe(switchMap(() => this.socketService.fromEvent<IReturnFlipVote>(EventsRoom.flipVotesResult)));
  }

  get onVoteAfterReveal(): Observable<IReturnVote> {
    return this.subjectConnect
      .pipe(switchMap(() => this.socketService.fromEvent<IReturnVote>(EventsRoom.voteAfterReveal)));
  }

  get onAllUserVoted(): Observable<void> {
    return this.subjectConnect
      .pipe(switchMap(() => this.socketService.fromEvent<void>(EventsRoom.allUserVote)));
  }

  get onTimeoutFlipCards(): Observable<IReturnTask> {
    return this.subjectConnect
      .pipe(switchMap(() => this.socketService.fromEvent<IReturnTask>(EventsRoom.timeoutFlipCards)));
  }


  sendCreateTask(params: ICreateTask) {
    if (params.roomName && params.taskName) {
      this.socketService.emitEvent('request_create_task', params);
    }
  }

  private sendError(result: any) {
    console.log('Error -> ', result);
    this.subjectConnect.error(result);
    this.subjectConnect.unsubscribe();
    this.subjectConnect = new BehaviorSubject<boolean>(false);

    if (result?.event === 'Connect') {
      this.socketService.clear();
      this.storage.clear();
      this.events.forEach(event => event.unsubscribe());
    }
  }

  sendVote(vote: IVoteTask) {
    if (vote && vote.roomName && vote.uuid && vote.taskId && vote.value) {
      this.socketService.emitEvent('vote_task', vote);
    }
  }

  sendFlipVotes(flipVotes: IRequestsVotes) {
    if (flipVotes && flipVotes.taskId) {
      this.socketService.emitEvent('flip_votes', flipVotes);
    }
  }

  resetVotes(resetVotes: IRequestsVotes) {
    if (resetVotes && resetVotes.taskId) {
      this.socketService.emitEvent('reset_votes', resetVotes);
    }
  }
}
