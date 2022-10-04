import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteCardUserComponent } from './vote-card-user.component';

describe('VoteCardUserComponent', () => {
  let component: VoteCardUserComponent;
  let fixture: ComponentFixture<VoteCardUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteCardUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteCardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
