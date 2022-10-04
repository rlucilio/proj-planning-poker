import { RoomGateway } from '../../../gateway/room.gateway';
import { ErrorBase } from '../../../error/error-base';
import { ErrorTypes } from '../../../error/error-types';

export class GetListTasksUsecase {
    roomGateway = new RoomGateway();
    execute (roomName: string): {title: string, id: string}[] {
      const room = this.roomGateway.findRoomByName(roomName);

      if (!room) { throw new ErrorBase('Room not exist', ErrorTypes.Role, roomName); }

      return room.tasks.map(task => ({ title: task.title, id: task.id }));
    }
}
