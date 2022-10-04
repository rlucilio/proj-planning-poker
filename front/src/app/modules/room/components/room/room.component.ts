import { Component, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IRoom } from 'src/app/shared/models/room';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { IGetRoomResponse, IGetLastTask } from 'src/app/shared/services/room/models/provider-room-responses';
import { RoomEventsService } from 'src/app/shared/services/room/room-events.service';
import { RoomService } from 'src/app/shared/services/room/room.service';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { TaskCreateComponent } from '../task-create/task-create.component';

import { UserCardComponent } from '../user-card/user-card.component';
import { VoteCardComponent } from '../vote-card/vote-card.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  @ViewChildren(UserCardComponent) playersCards: UserCardComponent[];
  @ViewChildren(VoteCardComponent) votes: VoteCardComponent[];

  room: IGetRoomResponse;
  private infoRoom: IRoom;
  players: {
    idSocket: string;
    name: string;
    uuid: string;
    voted?: boolean;
  }[];

  constructor(
    private dialog: MatDialog,
    private loading: LoadingService,
    private roomService: RoomService,
    private router: Router,
    private storage: StorageService,
    private roomEvents: RoomEventsService,
    private toast: ToastrService,
  ) { }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.roomEvents.disconnect();
  }

  ngOnInit(): void {
    this.infoRoom = this.storage.getObject<IRoom>('room');

    if (this.roomEvents.reconnect()) {
      this.getRoom();
    } else {
      this.subs.push(this.roomEvents
        .connect(this.infoRoom.roomName, this.infoRoom.user?.name)
        .subscribe({
          next: () => this.getRoom(),
          error: result => {
            if (result.event === 'Connect') {
              this.router.navigate(['/home']);
            }
            this.loading.hide();
            this.toast.error(result.error.msg, 'Erro ao conectar');
          }
        }));
    }

    this.subscribeJoinUser();
  }

  private subscribeJoinUser() {
    this.subs.push(this.roomEvents.onJoinUser.subscribe({
      next: result => {
        const newPlayer = this.room?.users?.find(player => player.uuid === result.uuid);
        if (!newPlayer) {
          this.room?.users.push({
            idSocket: result.socketId,
            name: result.user,
            uuid: result.uuid
          });
        } else {
          newPlayer.idSocket = result.socketId;
          newPlayer.name = result.user;
        }
        this.setPlayers(this.room);
      },
      error: err => this.printErrorInEvent('Erro no evento, usuário entrou na sala.', err)
    }));

    this.subs.push(this.roomEvents.onReturnUser.subscribe({
      error: err => this.printErrorInEvent('Erro no evento, usuário retornou à sala.', err),
      next: result => {
        const newPlayer = this.room?.users?.find(player => player.uuid === result.uuid);
        if (newPlayer) {
          newPlayer.idSocket = result.socketId;
          newPlayer.name = result.user;
          this.setPlayers(this.room);
        }
      }
    }));

    this.subs.push(this.roomEvents.onJoinObserver.subscribe({
      error: err => this.printErrorInEvent('Erro no evento, novo observador.', err),
      next: () => {
        this.subs.push(this.roomService.getRoom(this.infoRoom.roomName).subscribe(response => {
          this.room.observers = response.observers;
        }));
      }
    }));

    this.subs.push(this.roomEvents.onUserDisconnect.subscribe({
      error: err => this.printErrorInEvent('Erro no evento, desconectar usuário.', err),
      next: result => {
        if (result.uuid && this.room && this.room.users && this.room.users.length) {
          this.room.users = this.room?.users?.filter(usr => usr.uuid !== result.uuid);
        }

        this.roomService.getObservers(this.infoRoom.roomName).subscribe(obs => {
          this.room.observers = obs;
        });
        this.setPlayers(this.room);
      }
    }));
  }

  private printErrorInEvent(msg: string, err: any) {
    console.log(err);
    this.toast.error(msg);
  }

  private getRoom() {
    this.subs.push(this.roomService.getRoom(this.infoRoom.roomName, this.infoRoom.user.uuid).subscribe({
      next: response => {
        this.room = response;
        this.setPlayers(response);
        this.loading.hide();
      },
      error: () => {
        this.router.navigate(['/home']);
        this.loading.hide();
      }
    }));
  }

  private setPlayers(room: IGetRoomResponse) {
    this.players = room
      ? room.users.map(user => ({ idSocket: user.idSocket, name: user.name, voted: false, uuid: user.uuid }))
      : [];

    if (!this.players.find(plr => plr.uuid === this.infoRoom.user.uuid)) {
      this.players.push({
        name: this.infoRoom.user.name,
        idSocket: this.infoRoom.user.socketID,
        uuid: this.infoRoom.user.uuid,
        voted: false
      });
    }

    const lastTask = room?.tasks[room.tasks.length - 1];

    lastTask?.votes.forEach(vote => {
      const playerVote = this.players.find(player => player.uuid === vote.user.uuid);

      if (playerVote) {
        playerVote.voted = true;
      }

    });

    const playerCurrentVoted = lastTask?.votes?.find(vote => vote.user.uuid === this.infoRoom.user.uuid);
    if (playerCurrentVoted) {
      const vote = this.votes.find(voteCard => voteCard.value === playerCurrentVoted.votting);
      vote.isSelected = true;
      vote.update();

      if (lastTask.resultVoting && !this.room.settingsRoom.changeVoteAfterReveal) {
        this.votes.forEach(voteCurrent => {
          voteCurrent.enable = false;
          voteCurrent.update();
        });
      }
    }
    this.playersCards?.forEach(playerCard => playerCard.update());
  }

  get title(): string {
    return this.room ? this.room.name.replace(/_/g, ' ') : '';
  }

  get isPlayer(): boolean {
    return !!this.infoRoom.user?.name;
  }

  changeTask(task: IGetLastTask) {
    if (!task.votes.length) {
      this.players.forEach(player => player.voted = false);
      this.playersCards?.forEach(playerCard => playerCard.update());
      this.votes.forEach(vote => {
        vote.isSelected = false;
        vote.enable = true;
        vote.update();
      });
    } else {
      task?.votes?.forEach(vote => {
        const player = this.players?.find(plr => plr.uuid === vote.user.uuid);

        if (player) {
          player.voted = true;
        }
      });

      if (task.resultVoting && !this.room.settingsRoom.changeVoteAfterReveal) {
        this.votes.forEach(vote => {
          vote.enable = false;
          vote.update();
        });
      }

      this.playersCards?.forEach(playerCard => playerCard.update());
    }
  }

  addTask() {
    const component = this.dialog.open(TaskCreateComponent);
    component.componentInstance.roomStorage = this.infoRoom;
  }

  onVote(voteEvent: { value: number, isSelected: boolean }) {
    this.votes
      .filter(voteCard => voteCard.value !== voteEvent.value)
      .filter(voteCard => voteCard.isSelected)
      .forEach(voteCard => {
        voteCard.isSelected = false;
        voteCard.update();
      });
  }

  flipVotes() {
    const room = this.storage.getObject<IRoom>('room');

    if (room.task?.id) {
      this.roomEvents.sendFlipVotes({
        roomName: room.roomName,
        taskId: room.task?.id
      });
      this.toast.show('Virando cartas');
    }
  }

  resetVotes() {
    const room = this.storage.getObject<IRoom>('room');

    if (room.task?.id) {
      this.roomEvents.resetVotes({
        roomName: room.roomName,
        taskId: room.task?.id
      });
      this.toast.show('Reiniciando task');
    }
  }
}
