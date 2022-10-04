import { RoomGateway } from '../../../gateway/room.gateway';
import { IGetLastTaskResultModel } from './model/get-last-task-result.model';
import { ErrorBase } from '../../../error/error-base';
import { ErrorTypes } from '../../../error/error-types';

export class GetLastTaskUsecase {
    private roomGateway = new RoomGateway();
    execute (roomName: string): IGetLastTaskResultModel {
      const room = this.roomGateway.findRoomByName(roomName);

      if (!room) {
        throw new ErrorBase('Invalid room', ErrorTypes.Role, roomName);
      }
      const lastTask = room.tasks[room.tasks.length - 1];
      if (!lastTask) {
        throw new ErrorBase('Invalid task', ErrorTypes.Role, roomName);
      }
      return {
        description: lastTask.description,
        id: lastTask.id,
        title: lastTask.title,
        votes: lastTask.resultVoting ? lastTask.votes.map(vote => ({
          user: {
            idSocket: vote.user.idSocket,
            name: vote.user.name,
            uuid: vote.user.uuid
          },
          votting: vote.votting
        })) : lastTask.votes.map(vote => ({
          user: {
            idSocket: vote.user.idSocket,
            name: vote.user.name,
            uuid: vote.user.uuid
          }
        })),
        resultVoting: lastTask.resultVoting
      };
    }
}
