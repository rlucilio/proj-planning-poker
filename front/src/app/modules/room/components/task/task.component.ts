import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IRoom } from 'src/app/shared/models/room';
import { IReturnVote } from 'src/app/shared/services/room/models/eventsRoom.model';
import { IGetLastTask } from 'src/app/shared/services/room/models/provider-room-responses';
import { RoomEventsService } from 'src/app/shared/services/room/room-events.service';
import { RoomProviderService } from 'src/app/shared/services/room/room-provider.service';
import { StorageService } from 'src/app/shared/services/storage/storage.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent implements OnInit, OnDestroy {
  infoRoom: IRoom;
  task: IGetLastTask;
  private subs: Subscription[] = [];

  @Output() changeTask = new EventEmitter<IGetLastTask>();
  @Input() typeVote: string;

  constructor(
    private storage: StorageService,
    private roomProvider: RoomProviderService,
    private cdr: ChangeDetectorRef,
    private roomEvents: RoomEventsService,
    private toast: ToastrService
  ) { }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.infoRoom = this.storage.getObject<IRoom>('room');

    this.getLastTask();
    this.subEvents();
  }

  private getLastTask() {
    this.subs.push(this.roomProvider.getLastTask(this.infoRoom.roomName)
      .pipe(catchError(() => of({ title: 'Crie uma nova task, para começar...' } as IGetLastTask)))
      .subscribe(task => {
        this.task = task;
        this.task.title = this.task.title.replace(/_/g, ' ');
        this.emitTask();
      }));
  }

  private subEvents() {
    this.subs.push(this.roomEvents.onNewTask.subscribe({
      error: err => this.printErrorInEvent('Erro no evento de nova task', err),
      next: newTask => {
        this.toast.show('Nova task criada');
        this.task = {
          description: newTask.description,
          id: newTask.id,
          title: newTask.title.replace(/_/g, ' '),
          resultVoting: null,
          votes: []
        };

        this.emitTask();
      }
    }));

    this.subs.push(this.roomEvents.onResetTask.subscribe({
      error: err => this.printErrorInEvent('Erro no evento de reset de task', err),
      next: () => {
        this.toast.show('Task reiniciada');
        this.task.votes = [];
        this.task.resultVoting = null;
        this.emitTask();
      }
    }));

    this.subs.push(this.roomEvents.onVote.subscribe({
      error: err => this.printErrorInEvent('Erro no evento de voto de task', err),
      next: newVote => {
        this.setVote(newVote);
        this.emitTask();
      }
    }));

    this.subs.push(this.roomEvents.onTimeoutFlipCards.subscribe({
      error: err => this.printErrorInEvent('Erro no evento de timeout da task', err),
      next: timeout => {
        this.task.resultVoting = timeout.value;

        this.subs.push(this.roomProvider.getLastTask(this.infoRoom.roomName)
          .subscribe(task => {
            this.task.resultVoting = task.resultVoting;

            task.votes.forEach(vote => {
              const playerCurrent = this.task.votes.find(voteCurrent => voteCurrent.user.uuid === vote.user.uuid);

              if (playerCurrent) {
                playerCurrent.votting = vote.votting;
              }
            });
            this.cdr.detectChanges();
          }));
      }
    }));

    this.subs.push(this.roomEvents.onFlip.subscribe({
      error: err => this.printErrorInEvent('Erro no evento de flip de task', err),
      next: resultFlip => {
        this.task.resultVoting = resultFlip.resultTask.task.result;

        resultFlip.resultTask.votes.forEach(newVote => {
          const playerVoted = this.task.votes.find(voteCurrent => voteCurrent.user.uuid === newVote.uuid);

          if (playerVoted) {
            playerVoted.votting = newVote.vote;
          }
        });

        this.emitTask();
      }
    }));

    this.subs.push(this.roomEvents.onVoteAfterReveal.subscribe({
      error: err => this.printErrorInEvent('Erro no evento de voto depois do resultado de task', err),
      next: vote => this.setVote(vote)
    }));

    this.subs.push(this.roomEvents.onAllUserVoted.subscribe({
      error: err => this.printErrorInEvent('Erro no evento todo usuário votarão de task', err),
      next: () => {
        this.subs.push(this.roomProvider.getLastTask(this.infoRoom.roomName)
          .subscribe(task => {
            this.task.resultVoting = task.resultVoting;

            task.votes.forEach(vote => {
              const playerCurrent = this.task.votes.find(voteCurrent => voteCurrent.user.uuid === vote.user.uuid);

              if (playerCurrent) {
                playerCurrent.votting = vote.votting;
              }
            });
            this.cdr.detectChanges();
          }));
      }
    }));

  }

  private setVote(newVote: IReturnVote) {
    const userVoted = this.task.votes.find(vote => vote.user.uuid === newVote.uuid);

    if (!userVoted) {
      this.task.votes.push({
        user: {
          idSocket: newVote.socketId,
          name: newVote.name,
          uuid: newVote.uuid
        },
        votting: newVote.votting
      });
    } else {
      userVoted.votting = newVote.votting;

      this.subs.push(this.roomProvider.getLastTask(this.infoRoom.roomName)
        .subscribe(task => {
          this.task.resultVoting = task.resultVoting;
          this.cdr.detectChanges();
        }));
    }
  }

  private emitTask() {
    this.infoRoom.task = {
      id: this.task.id
    };
    this.storage.setObject('room', this.infoRoom);
    this.changeTask.emit(this.task);
    this.cdr.detectChanges();
  }

  private printErrorInEvent(msg: string, err: any) {
    console.log(err);
    this.toast.error(msg);
  }

  get labelResult(): string {
    if (this.typeVote === 'room_hours') {
      return 'Maior voto';
    } else if (this.typeVote === 'room_scores') {
      return 'Média dos pontos';
    }
  }
}
