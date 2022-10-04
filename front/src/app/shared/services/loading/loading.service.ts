import { Injectable, Inject } from '@angular/core';
import { AnimationBuilder, style, animate } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLElement;
  private app: HTMLElement;
  constructor(
    private animationBuilder: AnimationBuilder,
    @Inject(DOCUMENT) private document: HTMLDocument,
    private router: Router
  ) {
    this.init();
  }

  private init() {
    this.loading = this.document.querySelector('loading-init');
    this.app = this.document.querySelector('app-root');

    if (this.loading) {
      this.router.events.pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        first()
      ).subscribe(() => timer(5000).subscribe(() => this.hide()));
    }
  }

  show() {

    const animation = this.animationBuilder.build([
      style({
        display: 'flex',
        opacity: '0',
        'z-index': -1
      }),
      animate('500ms ease', style({
        opacity: '1',
        'z-index': 999999
      }))
    ]).create(this.loading);

    animation.play();
    animation.onStart(() => {
      this.loading.querySelector('.label > p').classList.add('.enter-focus-animate');
    });
  }

  hide() {
    const animation = this.animationBuilder.build([
      style({
        opacity: '1',
        'z-index': 999999
      }),
      animate('500ms ease', style({
        opacity: '0',
        'z-index': -1
      }))
    ]).create(this.loading);

    animation.play();

    animation.onDone(() => {
      this.loading.querySelector('.enter-focus-animate').classList.remove('.enter-focus-animate');
      this.loading.style.display = 'none';
    });
  }
}
