import socketServer from '../../socket-server';
import { EventsReceivedsSocket } from '../../events-receiveds';
import { VoteUsecase } from '../usecase/vote.usecase';
import { IVoteRequest } from './request/vote.request';
import { EventsEmmiterSocket } from '../../events-emmiter';
import { FlipVotesUsecase } from '../usecase/flip-votes.usecase';
import { IFlipRequest } from './request/flip.request';
import { Log } from '../../../log/log';

export class VoteHandler {
  onVote () {
    socketServer.getHandler().subscribe(socket => {
      socket.on(EventsReceivedsSocket.voteTask, (voteRequest: IVoteRequest) => {
        Log.info(`Vote in task -> ${socket.id}`);
        Log.info(`Room -> ${socket.handshake.query.room}`);

        try {
          new VoteUsecase().execute(voteRequest).subscribe(result => {
            socket.in(voteRequest.roomName).emit(result.event, result.user);
            socket.emit(result.event, result.user);
          }, error => socket.emit(EventsEmmiterSocket.error, {
            event: EventsReceivedsSocket.voteTask,
            error,
            params: voteRequest
          }));
        } catch (error) {
          socket.emit(EventsEmmiterSocket.error, {
            event: EventsReceivedsSocket.voteTask,
            error,
            params: voteRequest
          });
        }
      });
    });
  }

  onFlip () {
    socketServer.getHandler().subscribe(socket => {
      socket.on(EventsReceivedsSocket.flipVotes, (flipRequest: IFlipRequest) => {
        Log.info(`Flip in votes -> ${socket.id}`);
        Log.info(`Room -> ${socket.handshake.query.room}`);

        try {
          const result = new FlipVotesUsecase().execute({
            nameRoom: flipRequest.roomName,
            taskId: flipRequest.taskId
          });
          socket.in(flipRequest.roomName).emit(EventsEmmiterSocket.flipVotesResult, result);
          socket.emit(EventsEmmiterSocket.flipVotesResult, result);
        } catch (error) {
          socket.emit(EventsEmmiterSocket.error, {
            event: EventsReceivedsSocket.flipVotes,
            error,
            params: flipRequest
          });
        }
      });
    });
  }
}
