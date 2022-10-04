import socketServer from '../../socket-server';
import { Log } from '../../../log/log';
import { VerifyIfConnectedRoomUsecase } from '../usecase/verify-connected-room.usecase';
import { EventsEmmiterSocket } from '../../events-emmiter';
import { IUserResultModel } from '../usecase/model/user-result.model';
import { stringify } from 'flatted';

export class DisconnectHandler {
  onDisconnect () {
    socketServer.getHandler().subscribe(socket => {
      try {
        socket.on('disconnect', () => {
          Log.info(`Socket disconnect -> ${socket.id}`);
          Log.info(`User -> ${socket.handshake.query.user}`);
          const userInRoom = new VerifyIfConnectedRoomUsecase().execute(socket.handshake.query.room, socket.handshake.query.uuid, socket.id);

          if (userInRoom as IUserResultModel) {
            socket.in(socket.handshake.query.room).emit(EventsEmmiterSocket.userDisconnected, userInRoom);
          }
        });
      } catch (error) {
        Log.error('Error in socket');
        Log.error(stringify(error));
      }
    });
  }
}
