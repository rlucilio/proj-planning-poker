import { RoomGateway } from '../../../gateway/room.gateway';
import { ErrorBase } from '../../../error/error-base';
import { ErrorTypes } from '../../../error/error-types';
import { IGetListTasksModel } from './model/get-list-tasks.model';

export class GetListHistoryTasksUsecase {
  roomGateway = new RoomGateway();
  execute (roomName: string): IGetListTasksModel[] {
    const room = this.roomGateway.findRoomByName(roomName);

    if (!room) { throw new ErrorBase('Room not exist', ErrorTypes.Role, roomName); }

    if (!room?.settingsRoom?.keepHistory) {
      throw new ErrorBase('Room not keep history tasks', ErrorTypes.Role, roomName);
    }

    return this.roomGateway.getAllTasks(roomName).map(task => ({ title: task.title, resultVoting: task.resultVoting || 0 }));
  }
}
