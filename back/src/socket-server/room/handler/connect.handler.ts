import { Log } from '../../../log/log';
import socketServer from '../../socket-server';
import { ConnectRoomUsecase } from '../usecase/connect-room.usecase';
import { stringify } from 'flatted';
import { EventsEmmiterSocket } from '../../events-emmiter';
import { ErrorBase } from '../../../error/error-base';

export class ConnectHandler {
  onConnection () {
    socketServer.getHandler().subscribe(socket => {
      Log.info(`New Socket connection -> ${socket.id}`);
      Log.info(`User -> ${socket.handshake.query.user}`);

      try {
        const connectRoomResult = new ConnectRoomUsecase().execute({
          room: socket.handshake.query.room,
          user: socket.handshake.query.user,
          uuid: socket.handshake.query.uuid
        }, socket.id);

        socket.join(socket.handshake.query.room);

        socket
          .in(socket.handshake.query.room)
          .emit(connectRoomResult.event, {
            msg: connectRoomResult.msg,
            user: connectRoomResult.user,
            uuid: connectRoomResult.uuid,
            socketId: socket.id
          });

        socket
          .emit(connectRoomResult.event, {
            msg: connectRoomResult.msg,
            user: connectRoomResult.user,
            uuid: connectRoomResult.uuid,
            socketId: socket.id
          });
      } catch (error) {
        socket.emit(EventsEmmiterSocket.error, {
          event: 'Connect',
          error,
          params: {
            room: socket.handshake.query.room,
            user: socket.handshake.query.user
          }
        });

        socket?.disconnect();
        Log.error('Error in socket');
        Log.error(stringify(error));
      }
    });
  }
}
