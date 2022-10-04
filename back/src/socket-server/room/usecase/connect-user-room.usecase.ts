import { IConnectRoomModel } from './model/connect-room.model';
import { EventsEmmiterSocket } from '../../events-emmiter';
import { IUser } from '../../../model/interfaces/user';
import { IConnectRoomResult } from './model/connect-room-result.model';
import { RoomGateway } from '../../../gateway/room.gateway';
import { Log } from '../../../log/log';

export class ConnectUserRoomUsecase {
    private roomGateway = new RoomGateway();

    execute (model: IConnectRoomModel, socketId: string): IConnectRoomResult {
      Log.info('ConnectUserRoomUsecase Execute');
      const userExist = this.roomGateway.findUserInRoomByUUID(model.room, model.uuid);

      if (userExist) {
        Log.info(`ConnectUserRoomUsecase Send event ${EventsEmmiterSocket.returnRoom}`);
        userExist.idSocket = socketId;
        this.roomGateway.updateUserInRoom(model.room, userExist, model.uuid);

        return {
          event: EventsEmmiterSocket.returnRoom,
          msg: 'Retornou à sala',
          user: userExist.name,
          uuid: model.uuid
        };
      } else {
        Log.info(`ConnectUserRoomUsecase Send event ${EventsEmmiterSocket.joinRoom}`);

        const newUser: IUser = {
          idSocket: socketId,
          name: model.user,
          uuid: model.uuid,
          votes: []
        };

        this.roomGateway.addUserInRoom(model.room, newUser);

        return {
          event: EventsEmmiterSocket.joinRoom,
          msg: 'Entrou na sala',
          user: model.user,
          uuid: model.uuid
        };
      }
    }
}
