import dotenv from 'dotenv';
import webServer from './web-server/web-server';
import socketServer from './socket-server/socket-server';
import log4js from 'log4js';
import { Log } from './log/log';

class App {
  main () {
    Log.info('Init');
    dotenv.config();

    webServer.initWebServer();
    socketServer.initSocketServer();
  }
}

new App().main();
