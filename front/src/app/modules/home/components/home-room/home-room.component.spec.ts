import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRoomComponent } from './home-room.component';

describe('HomeRoomComponent', () => {
  let component: HomeRoomComponent;
  let fixture: ComponentFixture<HomeRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
