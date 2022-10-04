import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomStorageGuard } from './modules/room/guards/room-storage.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'room/:room',
    loadChildren: () => import('./modules/room/room.module').then(m => m.RoomModule),
    canActivate: [RoomStorageGuard]
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
