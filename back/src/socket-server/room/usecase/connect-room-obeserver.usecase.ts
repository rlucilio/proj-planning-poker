import { IConnectRoomResult } from './model/connect-room-result.model';
import { EventsEmmiterSocket } from '../../events-emmiter';
import { RoomGateway } from '../../../gateway/room.gateway';
import { Log } from '../../../log/log';
import { ErrorBase } from '../../../error/error-base';
import { ErrorTypes } from '../../../error/error-types';

export class ConnectRoomObserver {
  private roomGateway = new RoomGateway();
  execute (roomName: string, socketId: string): IConnectRoomResult {
    Log.info('Execute');
    const room = this.roomGateway.findRoomByName(roomName);

    if (!room.settingsRoom?.enableObserver) { throw new ErrorBase('Não é possível observar essa sala', ErrorTypes.Role, { roomName, socketId }); }
    this.roomGateway.addObserserInRoom(roomName, {
      idSocket: socketId
    });

    return {
      event: EventsEmmiterSocket.newObserver,
      msg: 'Novo observador',
      user: 'observador'
    };
  }
}
