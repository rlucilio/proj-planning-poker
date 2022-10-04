import { Router } from 'express';
import { RoutersWebServer } from '../../routers';
import { Log } from '../../../log/log';
import { stringify } from 'flatted';
import { GetUsersInRoomUsecase } from '../usecase/get-users-in-room.usecase';

export class UserController {
  routerManager = Router();
  private getUsersInRoomUsecase = new GetUsersInRoomUsecase();
  get route () {
    this.getUsers();
    return this.routerManager;
  }

  private getUsers () {
    this.routerManager.get(RoutersWebServer.user.getAllUsersInRoom, (req, res) => {
      try {
        Log.info(`Request param -> ${stringify(req.params)}`);
        const result = this.getUsersInRoomUsecase.execute(req.params.room);
        Log.info(`Response -> ${stringify(result)}`);
        res.status(200).json(result);
      } catch (error) {
        Log.error(`Erro in request -> ${stringify(error)}`);
        res.status(400).json(error);
      }
    });
  }
}
