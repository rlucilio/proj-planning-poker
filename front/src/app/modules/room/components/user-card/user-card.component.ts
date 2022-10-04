import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent{
  @Input() player: {
    idSocket: string;
    name: string;
    voted?: boolean;
  };

  constructor(
    private crd: ChangeDetectorRef
  ) { }

  update(): void {
    this.crd.detectChanges();
  }

}
