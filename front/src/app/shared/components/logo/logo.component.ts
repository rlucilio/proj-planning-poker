import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent implements OnInit {
  @Input() isNormal = true;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goHome() {
    this.router.navigate(['home']);
  }
}
