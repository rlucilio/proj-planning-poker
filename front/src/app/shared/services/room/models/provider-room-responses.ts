export interface IGetListTasksResponse {
    title: string;
    id: string;
}

export interface IGetRoomResponse {
    description: string;
    name: string;
    observers: {
        idSocket: string;
    }[];
    settingsRoom: {
        autoFlipCards: boolean;
        changeVoteAfterReveal: boolean;
        enableFlipCardsTimeout: boolean;
        enableObserver: boolean;
        keepHistory: boolean;
        timeoutFlipCards: number;
        typeRoom: string;
    };
    tasks: {
        description: string;
        id: string;
        title: string;
        votes: {
            votting: number
            user: {
                idSocket: string;
                name: string;
                uuid: string;
            }
        }[],
        resultVoting?: number
    }[];
    users: {
        idSocket: string;
        name: string;
        uuid: string;
    }[];
}

export interface IGetUserResponse {
    name: string;
    id: string;
}

export interface ICreateRoomRequest {
    name: string;
    description: string;
    settingsRoom: {
        autoFlipCards: boolean;
        enableFlipCardsTimeout: boolean;
        enableObserver: boolean;
        changeVoteAfterReveal: boolean;
        keepHistory: boolean;
        timeoutFlipCards: number;
        typeRoom: string;
    };
}

export interface IGetLastTask {
    description: string;
    id: string;
    title: string;
    votes: {
        user: {
            idSocket: string;
            name: string;
            uuid: string;
        },
        votting?: number;
    }[];
    resultVoting?: number;
}

export interface IGetHistoryTask {
    title: string;
    resultVoting: number;
}
