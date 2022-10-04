import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRoomCreateComponent } from './home-room-create.component';

describe('HomeRoomCreateComponent', () => {
  let component: HomeRoomCreateComponent;
  let fixture: ComponentFixture<HomeRoomCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeRoomCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRoomCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
