import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { urlencoded, json } from 'body-parser';
import { RouterManager } from './router-manager';
import { Log } from '../log/log';

class WebServer {
  private _serve: Express = express();
  private routers = new RouterManager();

  private createMiddlewares () {
    Log.info('Init middlewares');
    this.serve.use(morgan('dev'));
    this.serve.use(urlencoded({ extended: false }));
    this.serve.use(json());
    this.serve.use(cors());
  }

  private createRoutes () {
    Log.info('Init routes');
  }

  get serve (): Express {
    return this._serve;
  }

  initWebServer () {
    this.createMiddlewares();
    this.createRoutes();
    this.routers.registerRouters();
  }
}

export default new WebServer();
