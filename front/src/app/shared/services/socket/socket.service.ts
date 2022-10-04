import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: typeof io.Socket;

  createConnectionRoom(room: string, uuid: string, nameUser?: string): void {
    const query: {
      room: string,
      user?: string,
      uuid: string
    } = {
      room,
      uuid
    };

    if (nameUser) {
      query.user = nameUser;
    }

    if (this.socket){
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }

    this.socket = io(environment.socket.baseUrl, {
      query,
      transports: ['websocket']
    });

  }

  connect() {
    if (this.socket) {
      this.socket.connect();
      return true;
    }
    return false;
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }
  }

  fromEvent<T>(event: string): Observable<T> {
    return fromEvent(this.socket, event);
  }

  clear() {
    this.socket = null;
  }

  emitEvent<T>(key: string, params: T): void {
    this.socket.emit(key, params);
  }

}
