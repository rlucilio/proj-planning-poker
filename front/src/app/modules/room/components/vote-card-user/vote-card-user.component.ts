import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-vote-card-user',
  templateUrl: './vote-card-user.component.html',
  styleUrls: ['./vote-card-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoteCardUserComponent implements OnInit {
  @Input() player: string;
  @Input() value: number;

  constructor() { }

  ngOnInit(): void {
  }

}
