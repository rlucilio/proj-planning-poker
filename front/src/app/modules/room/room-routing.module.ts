import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomComponent } from './components/room/room.component';
import { RoomStorageGuard } from './guards/room-storage.guard';

const routes: Routes = [
  {
    path: '',
    component: RoomComponent,
    canActivate: [RoomStorageGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
