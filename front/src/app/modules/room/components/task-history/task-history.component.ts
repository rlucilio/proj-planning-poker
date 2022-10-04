import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IRoom } from 'src/app/shared/models/room';
import { IGetHistoryTask, IGetLastTask } from 'src/app/shared/services/room/models/provider-room-responses';
import { RoomEventsService } from 'src/app/shared/services/room/room-events.service';
import { RoomProviderService } from 'src/app/shared/services/room/room-provider.service';
import { StorageService } from 'src/app/shared/services/storage/storage.service';

@Component({
  selector: 'app-task-history',
  templateUrl: './task-history.component.html',
  styleUrls: ['./task-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskHistoryComponent implements OnInit, OnDestroy {
  infoRoom: IRoom;
  tasks: IGetHistoryTask[] = [];
  subs: Subscription[] = [];

  constructor(
    private storage: StorageService,
    private roomProvider: RoomProviderService,
    private roomEvents: RoomEventsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.infoRoom = this.storage.getObject<IRoom>('room');
    this.update();
    this.subscriptionEventsTask();
  }

  get total(): number {
    return this.tasks?.reduce((valuePrev, task) => valuePrev += task.resultVoting,  0);
  }

  private subscriptionEventsTask() {
    this.subs.push(this.roomEvents.onNewTask.subscribe(() => this.update()));
    this.subs.push(this.roomEvents.onAllUserVoted.subscribe(() => this.update()));
    this.subs.push(this.roomEvents.onFlip.subscribe(() => this.update()));
    this.subs.push(this.roomEvents.onResetTask.subscribe(() => this.update()));
    this.subs.push(this.roomEvents.onTimeoutFlipCards.subscribe(() => this.update()));
    this.subs.push(this.roomEvents.onVoteAfterReveal.subscribe(() => this.update()));
  }

  update() {
    this.subs.push(this.roomProvider.getHistoryTasks(this.infoRoom.roomName)
      .pipe(catchError(() => of([])))
      .subscribe(tasks => {
        this.tasks = tasks;
        this.tasks.forEach(task => {
          task.title = task.title.replace(/_/g, ' ');
        });
        this.cdr.detectChanges();
      }));
  }

}
