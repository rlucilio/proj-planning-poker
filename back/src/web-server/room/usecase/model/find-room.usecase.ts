export interface IFindRoomUsecase {
    name: string;
    description: string;
    tasks: {
        id: string;
        title: string;
        description: string;
        resultVoting?: number;
        votes: {
            votting: number | null;
            user: {
                idSocket: string;
                name: string;
                uuid?: string;
            };
        }[];
    }[];
    users: {
        idSocket: string;
        name: string;
        uuid?: string;
    }[];
    observers: {
        idSocket: string;
    }[];
    settingsRoom: {
        timeoutFlipCards: number;
        enableFlipCardsTimeout: boolean;
        enableObserver: boolean;
        keepHistory: boolean;
        changeVoteAfterReveal: boolean;
        autoFlipCards: boolean;
        typeRoom: string;
    };
}
