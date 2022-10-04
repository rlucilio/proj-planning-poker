import { RoomGateway } from '../../../gateway/room.gateway';
import { IUserResultModel } from './model/user-result.model';

export class VerifyIfConnectedRoomUsecase {
    roomGateway = new RoomGateway();

    execute (roomName: string, uuid: string, socketId: string): null | IUserResultModel {
      const room = this.roomGateway.findRoomByName(roomName);
      if (!room) { return null; }

      const userExist = room.users.find(user => user.uuid === uuid);

      const newArrayUsers = room.users.filter(user => user.uuid !== uuid);
      const newArrayObserves = room.observers.filter(obs => obs.idSocket !== socketId);
      room.users = newArrayUsers;
      room.observers = newArrayObserves;
      this.roomGateway.saveRoomBy(room);

      return {
        name: userExist?.name,
        socketId: socketId,
        uuid: userExist?.uuid
      };
    }
}
