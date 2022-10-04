import { RoomGateway } from '../../../gateway/room.gateway';
import { ErrorBase } from '../../../error/error-base';
import { ErrorTypes } from '../../../error/error-types';

export class GetUsersInRoomUsecase {
  private roomGateway = new RoomGateway();

  execute (roomName: string) {
    const room = this.roomGateway.findRoomByName(roomName);

    if (!room) { throw new ErrorBase('Room not exist', ErrorTypes.Role, roomName); }

    return room.users.map(user => ({ name: user.name, socketId: user.idSocket, uuid: user.uuid }));
  }
}
