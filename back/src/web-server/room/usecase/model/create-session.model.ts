import { TypesRoom } from '../../../../model/enums/types-room';

export interface CreateRoomModel {
    owner: string;
    name: string;
    tasks: CreateTaskModel[]
    settingsRoom: CreateSettingsModel;
    description: string;
}

export interface CreateTaskModel {
    title: string;
    description: string;
    resultVoting: number;
}

export interface CreateSettingsModel {
    timeoutFlipCards: number;
    enableFlipCardsTimeout: boolean;
    enableObserver: boolean;
    typeRoom: TypesRoom;
    changeVoteAfterReveal: boolean;
    keepHistory: boolean;
    autoFlipCards: boolean;
}
