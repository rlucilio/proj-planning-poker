import { IVoteModel } from './model/vote.model';
import { RoomGateway } from '../../../gateway/room.gateway';
import { ErrorBase } from '../../../error/error-base';
import { ErrorTypes } from '../../../error/error-types';
import { IVoteResult } from './model/vote.result';
import { Observable, ReplaySubject } from 'rxjs';
import { EventsEmmiterSocket } from '../../events-emmiter';
import { ITaskRoom } from '../../../model/interfaces/task-room';
import { IUser } from '../../../model/interfaces/user';
import { IRoom } from '../../../model/interfaces/room';
import { VerifyIfAllUserVotesUsecase } from './verify-if-all-user-votes.usecase';
import { IVote } from '../../../model/interfaces/votes';
import { GenerateResultTaskUsecase } from '../../task/usecase/generate-result-task.usecase';

export class VoteUsecase {
  private roomGateway = new RoomGateway();
  private resultObservable = new ReplaySubject<IVoteResult>(3);
  private verifyIfAllUserVotes = new VerifyIfAllUserVotesUsecase();
  private generateResultTaskUsecase = new GenerateResultTaskUsecase();

  execute (voteModel: IVoteModel): Observable<IVoteResult> {
    try {
      const room = this.roomGateway.findRoomByName(voteModel.roomName);
      const task = room.tasks.find(task => task.id === voteModel.taskId);
      const userVoting = room.users.find(userFind => userFind.uuid === voteModel.uuid);

      if (!room || !task || !userVoting) {
        throw new ErrorBase('Params vote invalid', ErrorTypes.Params, voteModel);
      }

      const voteExist = task.votes.find(vote =>
        (vote.user.uuid === voteModel.uuid && vote.task.id === voteModel.taskId));

      if (voteExist) {
        if (task.resultVoting) {
          if (room.settingsRoom?.changeVoteAfterReveal) {
            this.vote(room, task, voteModel.value, userVoting, voteExist, task.resultVoting);
          }
        } else {
          this.vote(room, task, voteModel.value, userVoting, voteExist);
        }
      } else {
        this.vote(room, task, voteModel.value, userVoting);
      }
    } catch (error) {
      this.resultObservable.error(error);
    }

    return this.resultObservable;
  }

  private vote (room: IRoom, task: ITaskRoom, votting: number, user: IUser, voteExist?: IVote, resultVoting?: number) {
    const userResult: {
      name: string,
      socketId: string,
      uuid?: string,
      votting?: number
    } = {
      name: user.name,
      socketId: user.idSocket,
      uuid: user.uuid
    };

    if (voteExist) {
      voteExist.votting = votting;
      this.roomGateway.saveRoomBy(room);

      if (resultVoting) {
        userResult.votting = votting;
        this.generateResultTaskUsecase.execute(room.name, task.id);

        this.resultObservable.next({
          event: EventsEmmiterSocket.voteAfterReveal,
          user: userResult
        });
      }
    } else {
      const newVote = {
        user: user,
        votting,
        task
      };
      task.votes.push(newVote);
      user.votes?.push(newVote);
      this.roomGateway.saveRoomBy(room);
    }

    this.resultObservable.next({
      event: EventsEmmiterSocket.newVote,
      user: userResult
    });

    if (this.verifyIfAllUserVotes.execute(room.name, task.id)) {
      this.generateResultTaskUsecase.execute(room.name, task.id);
      this.resultObservable.next({
        event: EventsEmmiterSocket.allUserVote
      });
    }

    this.resultObservable.complete();
  }
}
