import { ConnectHandler } from './room/handler/connect.handler';
import { Log } from '../log/log';
import { TaskHandler } from './task/entrypoint/task.handler';
import { VoteHandler } from './vote/entrypoint/vote.handler';
import { DisconnectHandler } from './room/handler/disconnect.handler';

export class SocketEventsManager {
  connectListner?: ConnectHandler;
  private connectHandler = new ConnectHandler();
  private taskHandler = new TaskHandler();
  private voteHandler = new VoteHandler();
  private disconnectHandler = new DisconnectHandler();

  registerEventsListeners () {
    Log.info('Register Events Listeners');
    this.connectHandler.onConnection();
    this.taskHandler.onCreateNewTask();
    this.taskHandler.onResetTask();
    this.voteHandler.onFlip();
    this.voteHandler.onVote();
    this.disconnectHandler.onDisconnect();
  }
}
