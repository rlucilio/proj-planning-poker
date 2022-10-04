import { TypesRoom } from '../enums/types-room';

export interface IRoomSettings {
    enableObserver: boolean;

    keepHistory: boolean;
    timeoutFlipCards: number;
    enableFlipCardsTimeout: boolean;

    changeVoteAfterReveal: boolean;
    autoFlipCards: boolean;
    typeRoom: TypesRoom;
}
