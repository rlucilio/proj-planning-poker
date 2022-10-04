import http from 'http';
import socketIO from 'socket.io';
import webServer from '../web-server/web-server';
import { SocketEventsManager } from './socket-events-manager';
import { Log } from '../log/log';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { stringify } from 'flatted';

class SocketServer {
  private serve?: http.Server;
  private socketEventsManager = new SocketEventsManager();
  private onHandler = new BehaviorSubject<socketIO.Socket | null>(null);
  socket?: socketIO.Server;

  private createServe () {
    this.serve = http.createServer(webServer.serve);
    this.socket = socketIO(this.serve);
  }

  private listenServe () {
    this.serve?.listen(process.env.PORT || process.env.port);
    Log.info(`Server running -> ${process.env.host}:${process.env.PORT || process.env.port}`);
    this.socket?.on('connection', socket => {
      try {
        Log.info('OnConnection');
        this.onHandler.next(socket);
      } catch (error) {
        socket.disconnect();
        Log.error('Error');
        Log.error(stringify(error));
        this.onHandler.error(error);
      }
    });
  }

  getHandler () {
    return this.onHandler.pipe(filter(socket => socket !== null)) as Observable<socketIO.Socket>;
  }

  initSocketServer () {
    this.createServe();
    this.listenServe();
    this.socketEventsManager.registerEventsListeners();
  }
}

export default new SocketServer();
