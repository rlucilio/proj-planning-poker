import { RoomGateway } from '../../../gateway/room.gateway';
import { ErrorBase } from '../../../error/error-base';
import { ErrorTypes } from '../../../error/error-types';
import { TypesRoom } from '../../../model/enums/types-room';

export class GenerateResultTaskUsecase {
    private roomGateway = new RoomGateway();

    execute (roomName: string, taskId: string): number {
      const room = this.roomGateway.findRoomByName(roomName);
      const task = room.tasks.find(task => task.id === taskId);

      if (!task) { throw new ErrorBase('Task not found', ErrorTypes.Role, { roomName, taskId }); }

      let resultVotting = 0;
      switch (room.settingsRoom?.typeRoom) {
        case TypesRoom.score:
          resultVotting = task?.votes.map(vote => vote.votting).reduce((prev, curr) => prev + curr, 0);
          resultVotting /= task.votes.length;
          break;

        case TypesRoom.hours:
          resultVotting = task?.votes.map(vote => vote.votting).reduce((prev, curr) => prev > curr ? prev : curr, 0);
          break;
      }

      task.resultVoting = resultVotting;
      this.roomGateway.updateTask(roomName, task);

      return resultVotting;
    }
}
