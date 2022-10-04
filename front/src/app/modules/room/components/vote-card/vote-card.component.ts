import { Component, ChangeDetectionStrategy, Input, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IRoom } from 'src/app/shared/models/room';
import { RoomEventsService } from 'src/app/shared/services/room/room-events.service';
import { StorageService } from 'src/app/shared/services/storage/storage.service';

export declare type TypesCard = 'ballon' | 'sword' | 'littleFlower' | 'heart';


@Component({
  selector: 'app-vote-card',
  templateUrl: './vote-card.component.html',
  styleUrls: ['./vote-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoteCardComponent {
  @Input() typeCard: TypesCard;
  @Input() value: number;
  @Input() hide: boolean;
  @Input() room: IRoom;
  @Output() cardSelected = new EventEmitter<{
    value: number,
    isSelected: boolean
  }>();
  isSelected = false;
  enable = true;

  constructor(
    private element: ElementRef,
    private roomEvents: RoomEventsService,
    private storage: StorageService,
    private toast: ToastrService
  ) { }

  @HostListener('click')
  onClick() {
    if (this.enable && this.vote()) {
      this.isSelected = !this.isSelected;
      this.update();
      this.cardSelected.emit({
        isSelected: this.isSelected,
        value: this.value
      });
    } else {
      if (!this.enable) {
        this.toast.show('Não é possível alterar o voto');
      }
    }

  }

  update() {
    const nativeElement: HTMLElement = this.element.nativeElement;
    if (this.isSelected) {
      nativeElement.classList.add('card-selected');
      nativeElement.classList.remove('card-not-selected');
    } else {
      nativeElement.classList.remove('card-selected');
      nativeElement.classList.add('card-not-selected');
    }
  }

  private vote(): boolean {
    this.room = this.storage.getObject<IRoom>('room');

    if (this.room.roomName && this.room.task?.id && this.value && !this.isSelected) {
      this.roomEvents.sendVote({
        roomName: this.room.roomName,
        socketId: this.room.user?.socketID,
        uuid: this.room.user?.uuid,
        value: this.value,
        taskId: this.room.task?.id
      });
      this.toast.show('Enviando Voto');
      return true;
    } else {
      this.toast.show('Não é possível votar');
      return false;
    }
  }
}
