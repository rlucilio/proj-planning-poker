import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class RoomStorageGuard implements CanActivate {

  constructor(
    private router: Router,
    private storage: StorageService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const roomStorage = this.storage.getObject('room');
      if (!roomStorage) {
        this.router.navigate(['/home'], {
          queryParams: {
            room: (next.params.room as string).replace(/_/g, ' ')
          }
        });
        return false;
      } else {
        return true;
      }
  }

}
