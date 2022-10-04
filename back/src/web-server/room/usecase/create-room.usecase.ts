import { ErrorBase } from '../../../error/error-base';
import { ErrorTypes } from '../../../error/error-types';
import { IRoom } from '../../../model/interfaces/room';
import { CreateRoomModel, CreateSettingsModel } from './model/create-session.model';
import { TypesRoom } from '../../../model/enums/types-room';
import { RoomGateway } from '../../../gateway/room.gateway';

export class CreateRoomUsecase {
  roomGateway = new RoomGateway();
  execute (createSessionModel: CreateRoomModel) {
    if (!createSessionModel || !createSessionModel.name) { throw new ErrorBase('Request body invalid', ErrorTypes.Params, createSessionModel); }

    const roomName = createSessionModel.name.split(' ').join('_');

    if (this.roomGateway.findRoomByName(roomName)) { throw new ErrorBase('There is already a room with that name', ErrorTypes.Role, createSessionModel); }

    const newRoom: IRoom = {
      name: roomName,
      description: createSessionModel.description,
      users: [],
      tasks: [],
      observers: []
    };
    this.setSettingsRoom(newRoom, createSessionModel.settingsRoom);
    this.roomGateway.saveRoomBy(newRoom);
    return newRoom;
  }

  private setSettingsRoom (room: IRoom, settings?: CreateSettingsModel) {
    if (!settings) {
      room.settingsRoom = {
        autoFlipCards: false,
        enableFlipCardsTimeout: false,
        enableObserver: true,
        changeVoteAfterReveal: false,
        keepHistory: false,
        timeoutFlipCards: -1,
        typeRoom: TypesRoom.hours
      };

      return;
    };

    room.settingsRoom = {
      autoFlipCards: settings.autoFlipCards,
      enableFlipCardsTimeout: settings.enableFlipCardsTimeout,
      enableObserver: settings.enableObserver,
      changeVoteAfterReveal: settings.changeVoteAfterReveal,
      keepHistory: settings.keepHistory,
      timeoutFlipCards: settings.timeoutFlipCards,
      typeRoom: settings.typeRoom
    };
  }
}
