import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './components/home/home.component';
import { HomeRoomComponent } from './components/home-room/home-room.component';
import { HomeRoomCreateComponent } from './components/home-room-create/home-room-create.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomValidatorsService } from 'src/app/shared/services/room/room-validators.service';
import { RoomProviderService } from 'src/app/shared/services/room/room-provider.service';
import { RoomService } from 'src/app/shared/services/room/room.service';
import { NgScrollbarModule } from 'ngx-scrollbar';


@NgModule({
  declarations: [
    HomeComponent,
    HomeRoomComponent,
    HomeRoomCreateComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ComponentsModule,
    MatStepperModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule
  ],
  providers: [
    RoomValidatorsService,
    RoomProviderService,
    RoomService
  ]
})
export class HomeModule { }
