import { IGetAllVotesInTaskModel } from './model/get-all-votes-in-task.model';
import { RoomGateway } from '../../../gateway/room.gateway';
import { GenerateResultTaskUsecase } from './generate-result-task.usecase';
import { ErrorBase } from '../../../error/error-base';
import { ErrorTypes } from '../../../error/error-types';
import { IGetAllVotesInTaskResult } from './model/get-all-votes-in-task.result';

export class GetAllVotesInTaskUsecase {
  private roomGateway = new RoomGateway();
  private generateResultTask = new GenerateResultTaskUsecase();
  execute (getAllVotesIntaskModel: IGetAllVotesInTaskModel): IGetAllVotesInTaskResult {
    const resultVoteTask = this.generateResultTask.execute(getAllVotesIntaskModel.roomName, getAllVotesIntaskModel.taskId);

    const task = this.roomGateway.findTaskById(getAllVotesIntaskModel.roomName, getAllVotesIntaskModel.taskId);

    if (!task) {
      throw new ErrorBase('Task invalid', ErrorTypes.Role, getAllVotesIntaskModel);
    }

    if (!task.resultVoting) {
      throw new ErrorBase('Task not flip', ErrorTypes.Role, getAllVotesIntaskModel);
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
