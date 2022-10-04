import webServer from './web-server';
import { RoomController } from './room/entrypoint/room.controller';
import { RoutersWebServer } from './routers';
import { TaskController } from './task/entrypoint/task.controller';
import { Log } from '../log/log';
import { UserController } from './user/entrypoint/user.controller';

export class RouterManager {
  registerRouters () {
    Log.info('Register Routers');
    webServer.serve.use(RoutersWebServer.room.base, new RoomController().route);
    webServer.serve.use(RoutersWebServer.task.base, new TaskController().route);
    webServer.serve.use(RoutersWebServer.user.base, new UserController().route);
  }
}
