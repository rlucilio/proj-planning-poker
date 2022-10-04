import socketServer from '../../socket-server';
import { EventsReceivedsSocket } from '../../events-receiveds';
import { ICreateNewTaskModel } from '../usecase/model/create-new-task.model';
import { CreateNewTaskUsecase } from '../usecase/create-new-task.usecase';
import { ICreateNewTaskResult } from '../usecase/model/create-new-task.result';
import { IResetVotesInTaskRequest } from './requests/reset-votes-in-task.request';
import { EventsEmmiterSocket } from '../../events-emmiter';
import { Log } from '../../../log/log';
import { ResetVotesInTaskUsecase } from '../usecase/reset-votes-in-task.usecase';

export class TaskHandler {
  onCreateNewTask () {
    socketServer.getHandler().subscribe(socket => {
      socket.on(EventsReceivedsSocket.requestNewCreateTask, (createNewTaskModel: ICreateNewTaskModel) => {
        Log.info(`New task -> ${socket.id}`);
        Log.info(`Room -> ${createNewTaskModel.roomName}`);

        new CreateNewTaskUsecase().execute(createNewTaskModel).subscribe((result: ICreateNewTaskResult) => {
          socket.in(createNewTaskModel.roomName).emit(result?.event, result.task);
          socket.emit(result.event, result.task);
        },
        error => socket.emit(EventsEmmiterSocket.error, {
          error,
          event: EventsReceivedsSocket.requestNewCreateTask,
          params: createNewTaskModel
        }));
      });
    });
  }

  onResetTask () {
    socketServer.getHandler().subscribe(socket => {
      socket.on(EventsReceivedsSocket.resetVotes, (resetVotes: IResetVotesInTaskRequest) => {
        Log.info(`Reset Task -> ${socket.id}`);
        Log.info('Room -> ');

        try {
          new ResetVotesInTaskUsecase().execute(resetVotes.taskId, resetVotes.roomName);
          socket.in(resetVotes.roomName).emit(EventsEmmiterSocket.resetTask);
          socket.emit(EventsEmmiterSocket.resetTask);
        } catch (error) {
          socket.emit(EventsEmmiterSocket.error, {
            event: EventsReceivedsSocket.resetVotes,
            error,
            params: resetVotes
          });
        }
      });
    });
  }
}
