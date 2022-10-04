import { ErrorBase } from '../../../error/error-base';
import { ErrorTypes } from '../../../error/error-types';
import { RoomGateway } from '../../../gateway/room.gateway';

export class GetObserversInRoomUsecase {
    private roomGateway = new RoomGateway();

    execute (nameRoom: string) {
      const room = this.roomGateway.findRoomByName(nameRoom);

      if (!room) {
        throw new ErrorBase('Sala inválida', ErrorTypes.Params, nameRoom);
      }

      return room.observers;
    }
}
