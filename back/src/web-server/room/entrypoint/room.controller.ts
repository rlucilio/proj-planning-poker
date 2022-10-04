import { Router } from 'express';
import { CreateRoomUsecase } from '../usecase/create-room.usecase';
import { FindRoomUsecase } from '../usecase/find-room.usecase';
import { Log } from '../../../log/log';
import { RoutersWebServer } from '../../routers';
import { stringify } from 'flatted';
import { GetObserversInRoomUsecase } from '../usecase/get-observers-in-roon.usecase';

export class RoomController {
  private createRoomUsecase = new CreateRoomUsecase();
  private findRoomUsecase = new FindRoomUsecase();
  private getObserversInRoom = new GetObserversInRoomUsecase();
  private routerManager = Router();

  get route () {
    this.createRoom();
    this.getRoom();
    this.getObservers();
    return this.routerManager;
  }

  private createRoom () {
    this.routerManager.post('/', (req, res) => {
      Log.info(`Request body -> ${stringify(req.body)}`);

      try {
        const response = this.createRoomUsecase.execute(req.body);
        res.status(200).json(response);
      } catch (error) {
        Log.error(`Erro in request -> ${stringify(error)}`);
        res.status(400).json(error);
      }
    });
  }

  private getRoom () {
    this.routerManager.get(RoutersWebServer.room.find, (request, response) => {
      Log.info(`Request body -> ${request.params.name}`);

      try {
        const res = this.findRoomUsecase.execute(request.params.name, (request.query.user as string));
        response.status(200).json(res);
      } catch (error) {
        Log.error(`Erro in request -> ${stringify(error)}`);
        response.status(400).json(error);
      }
    });
  }

  private getObservers () {
    this.routerManager.get(RoutersWebServer.room.observers, (request, response) => {
      Log.info(`Request body -> ${request.params}`);

      try {
        const res = this.getObserversInRoom.execute(request.params.name);
        response.status(200).json(res);
      } catch (error) {
        Log.error(`Error in request -> ${error}`);
        response.status(400).json(error);
      }
    });
  }
}
