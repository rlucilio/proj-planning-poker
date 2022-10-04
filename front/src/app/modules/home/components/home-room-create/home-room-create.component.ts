import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoomValidatorsService } from 'src/app/shared/services/room/room-validators.service';
import { RoomService } from 'src/app/shared/services/room/room.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { RoomEventsService } from 'src/app/shared/services/room/room-events.service';
import { switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './home-room-create.component.html',
  styleUrls: ['./home-room-create.component.scss']
})
export class HomeRoomCreateComponent implements OnInit {
  formRoom: FormGroup;
  formTask: FormGroup;
  formVotes: FormGroup;

  constructor(
    private fb: FormBuilder,
    private roomValidator: RoomValidatorsService,
    private roomService: RoomService,
    private toast: ToastrService,
    private loading: LoadingService,
    private roomEvents: RoomEventsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createFormRoom();
    this.createFormTask();
    this.createFormVotes();
  }

  createRoom() {
    const roomCreateRequest = {
      room: Object.assign({}, this.formRoom.value),
      task: Object.assign({}, this.formTask.value),
      votes: Object.assign({}, this.formVotes.value)
    };
    roomCreateRequest.room.nameRoom = roomCreateRequest.room.nameRoom.trim();
    this.roomService.create(roomCreateRequest)
    .subscribe({
      next: room => {
        this.toast.success('Sala Criada');
        this.toast.show('Faça a conexão na sala agora como observador ou jogador...');
        this.router.navigate(['/home'], {
          queryParams: {
            room: room.replace(/_/g, ' ')
          }
        });
      },
      error: err => this.toast.error('Erro ao criar a sala')
    });
  }

  private createFormVotes() {
    this.formRoom = this.fb.group({
      nameRoom: ['', [Validators.required , Validators.minLength(3)], this.roomValidator.verifyRoomExist()],
      description: ['', [Validators.maxLength(60)]],
      observables: ['', []]
    });
  }

  private createFormTask() {
    this.formTask = this.fb.group({
      timeout: ['', []],
      timeForTimeout: ['', [Validators.min(1)]],
      history: ['', []],
    });
  }

  private createFormRoom() {
    this.formVotes = this.fb.group({
      alterVotesAfter: ['', []],
      autoFlip: ['', []],
      typeVote: ['', []]
    });
  }

}
