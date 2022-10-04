import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IRoom } from 'src/app/shared/models/room';
import { RoomEventsService } from 'src/app/shared/services/room/room-events.service';
import { StorageService } from 'src/app/shared/services/storage/storage.service';

@Component({
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent implements OnInit {
  formTask: FormGroup;
  roomStorage: IRoom;

  constructor(
    private eventsSocket: RoomEventsService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskCreateComponent>,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.createFormTask();
    this.formTask.markAllAsTouched();
  }

  createTask() {
    if (this.formTask.valid && this.roomStorage) {
      this.toast.show('Criando a task');
      this.eventsSocket.sendCreateTask({
        description: this.formTask.get('description').value,
        roomName: this.roomStorage.roomName,
        taskName: this.formTask.get('title').value.trim().replace(/ /g, '_')
      });
      this.dialogRef.close();
    }
  }
  
  cancelTask() {
    this.dialogRef.close();
  }

  private createFormTask() {
    this.formTask = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      description: ['', [Validators.maxLength(240)]]
    });
  }
}
