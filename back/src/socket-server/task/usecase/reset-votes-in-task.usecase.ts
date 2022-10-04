import { ErrorBase } from '../../../error/error-base';
import { ErrorTypes } from '../../../error/error-types';
import { RoomGateway } from '../../../gateway/room.gateway';

export class ResetVotesInTaskUsecase {
    private roomGateway = new RoomGateway();

    execute (taskId: string, roomName: string) {
      const room = this.roomGateway.findRoomByName(roomName);

      if (!room) { throw new ErrorBase('Sala inválida', ErrorTypes.Role, { taskId, roomName }); }

      const task = room.tasks.find(task => task.id === taskId);

      if (!task) { throw new ErrorBase('Task Inválida', ErrorTypes.Role, { taskId, roomName }); }

      task.resultVoting = undefined;
      task.votes = [];

      this.roomGateway.updateTask(roomName, task);
    }
}
