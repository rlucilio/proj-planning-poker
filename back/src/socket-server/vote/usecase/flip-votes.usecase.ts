import { EventsEmmiterSocket } from '../../events-emmiter';
import { GetAllVotesInTaskUsecase } from '../../task/usecase/get-all-votes-in-task.usecase';
import { IFlipModel } from './model/flip.model';
import { IFlipResult } from './model/flip.result';

export class FlipVotesUsecase {
  private getAllVotesInTaskUsecase = new GetAllVotesInTaskUsecase();

  execute (flipVotesModel: IFlipModel): IFlipResult {
    const votesUser = this.getAllVotesInTaskUsecase.execute({
      roomName: flipVotesModel.nameRoom,
      taskId: flipVotesModel.taskId
    });

    return {
      event: EventsEmmiterSocket.flipVotesResult,
      resultTask: votesUser
    };
  }
}
