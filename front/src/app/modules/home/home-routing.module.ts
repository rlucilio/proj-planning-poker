import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { HomeRoomComponent } from './components/home-room/home-room.component';
import { HomeRoomCreateComponent } from './components/home-room-create/home-room-create.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: HomeRoomComponent,
        data: {
          animation: 'HomePage'
        }
      },
      {
        path: 'create',
        component: HomeRoomCreateComponent,
        data: {
          animation: 'HomeCreatePage'
        }
      },
      {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
