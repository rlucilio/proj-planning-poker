import { RoomGateway } from '../../../gateway/room.gateway';
import { GenerateResultTaskUsecase } from '../../../socket-server/task/usecase/generate-result-task.usecase';
import { ErrorBase } from '../../../error/error-base';
import { ErrorTypes } from '../../../error/error-types';
import { IGetAllVotesInTaskResult } from './model/get-all-votes-in-task.result';

export class GetAllVotesInTaskUsecase {
  private roomGateway = new RoomGateway();
  private generateResultTask = new GenerateResultTaskUsecase();
  execute (taskId: string, roomName: string): IGetAllVotesInTaskResult {
    const resultVoteTask = this.generateResultTask.execute(roomName, taskId);

    const task = this.roomGateway.findTaskById(roomName, taskId);

    if (!task) {
      throw new ErrorBase('Task inválida', ErrorTypes.Role, { roomName, taskId });
    }

    if (!task.resultVoting) {
      throw new ErrorBase('Não há votos', ErrorTypes.Role, { roomName, taskId });
    }

    const result: IGetAllVotesInTaskResult = {
      task: {
        title: task.title,
        id: task.id,
        result: resultVoteTask
      },
      votes: task.votes.map(vote => ({
        userName: vote.user.name,
        userId: vote.user.idSocket,
        uuid: vote.user.uuid,
        vote: vote.votting
      }))
    };

    return result;
  }
}
