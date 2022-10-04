import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoomEventsService } from 'src/app/shared/services/room/room-events.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RoomValidatorsService } from 'src/app/shared/services/room/room-validators.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { Subscription } from 'rxjs';
import { RoomProviderService } from 'src/app/shared/services/room/room-provider.service';

@Component({
  templateUrl: './home-room.component.html',
  styleUrls: ['./home-room.component.scss']
})
export class HomeRoomComponent implements OnInit, OnDestroy {
  formConnect: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(
    private roomService: RoomEventsService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private roomValidator: RoomValidatorsService,
    private router: Router,
    private loading: LoadingService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.formConnect.markAllAsTouched();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private createForm() {
    this.formConnect = this.fb.group({
      room: ['', [Validators.required, Validators.minLength(3)], this.roomValidator.verifyRoomNotExist()],
      user: ['', [Validators.minLength(3)]]
    });

    if (this.activeRoute.snapshot.queryParams.room) {
      this.formConnect.get('room').setValue(this.activeRoute.snapshot.queryParams.room);
    }
  }

  connectUser() {
    if (this.formConnect.get('room').value && this.formConnect.get('user').value) {
      this.connect(this.formConnect.get('room').value.replace(/ /g, '_'), this.formConnect.get('user').value);
    } else {
      let field = this.formConnect.get('room').invalid ? 'Nome da sala, ' : '';
      field += !this.formConnect.get('user').invalid ? 'Nome' : '';
      this.showWarning(field);
    }
  }

  private connect(room: string, user?: string) {
    this.roomService.clear();
    this.subscriptions.push(this.roomService.connect(room, user)
      .subscribe({
        next: result => {
          if (result) {
            this.toast.info('Conectando');
          }
        },
        error: result => {
          this.toast.error(result.error.msg, 'Erro ao conectar');
          this.subscriptions.forEach(sub => sub.unsubscribe());
        }
      }));

    this.subscriptions.push(this.roomService.onConnectObserver.subscribe(result => {
      if (result) {
        this.toast.success('Observador entrando na sala');
        this.goToRoom(room);
      }
    }));

    this.subscriptions.push(this.roomService.onConnectUser.subscribe(result => {
      if (result) {
        this.toast.success(result.user, 'Usuário entrando na sala');
        this.goToRoom(room);
      }
    }));
  }

  private goToRoom(room: string) {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.loading.show();
    this.router.navigate(['/room', room]);
    this.roomService.disconnect();
  }

  private showWarning(field: string) {
    this.formConnect.markAllAsTouched();
    this.toast.warning(`Campo ${field} inválido(s)`, 'Não é possível conectar');
  }

  connectObserver() {
    if (this.formConnect.get('room').value) {
      this.connect(this.formConnect.get('room').value.replace(/ /g, '_'));
    } else {
      if (this.formConnect.get('room').invalid) { this.showWarning('Nome da sala'); }
    }
  }
}
