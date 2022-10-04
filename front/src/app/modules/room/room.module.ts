import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


import { RoomRoutingModule } from './room-routing.module';
import { RoomComponent } from './components/room/room.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { UserCardComponent } from './components/user-card/user-card.component';
import { VoteCardComponent } from './components/vote-card/vote-card.component';
import { TaskHistoryComponent } from './components/task-history/task-history.component';
import { TaskComponent } from './components/task/task.component';
import { VoteCardUserComponent } from './components/vote-card-user/vote-card-user.component';
import { TaskCreateComponent } from './components/task-create/task-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomService } from 'src/app/shared/services/room/room.service';
import { RoomProviderService } from 'src/app/shared/services/room/room-provider.service';
import { RoomStorageGuard } from './guards/room-storage.guard';


@NgModule({
  declarations: [
    RoomComponent,
    UserCardComponent,
    VoteCardComponent,
    TaskHistoryComponent,
    TaskComponent,
    VoteCardUserComponent,
    TaskCreateComponent,
  ],
  imports: [
    CommonModule,
    RoomRoutingModule,
    ComponentsModule,
    MatBadgeModule,
    MatButtonModule,
    MatTooltipModule,
    NgScrollbarModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  entryComponents: [
    TaskCreateComponent
  ],
  providers: [
    RoomProviderService,
    RoomService,
    RoomStorageGuard
  ]
})
export class RoomModule { }
