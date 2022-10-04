import { ErrorBase } from '../../../error/error-base';
import { ErrorTypes } from '../../../error/error-types';
import { IConnectRoomModel } from './model/connect-room.model';
import { IRoom } from '../../../model/interfaces/room';
import { Log } from '../../../log/log';
import { ConnectUserRoomUsecase } from './connect-user-room.usecase';
import { ConnectRoomObserver } from './connect-room-obeserver.usecase';
import { IConnectRoomResult } from './model/connect-room-result.model';
import { RoomGateway } from '../../../gateway/room.gateway';

export class ConnectRoomUsecase {
  roomGateway = new RoomGateway();
  execute (connectRoomModel: IConnectRoomModel, userSocketId: string): IConnectRoomResult {
    Log.info('ConnectRoomUsecase.Execute');

    this.verifyExistRoom(connectRoomModel);

    if (connectRoomModel.user && connectRoomModel.uuid) {
      return new ConnectUserRoomUsecase().execute(connectRoomModel, userSocketId);
    } else {
      return new ConnectRoomObserver().execute(connectRoomModel.room, userSocketId);
    }
  }

  private verifyExistRoom (model: IConnectRoomModel) {
    const room: IRoom = this.roomGateway.findRoomByName(model.room);
    if (!room) { throw new ErrorBase('Sala não existe', ErrorTypes.Params, { model, room }); }
  }
}
