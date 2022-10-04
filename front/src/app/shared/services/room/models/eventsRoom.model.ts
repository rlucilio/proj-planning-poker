export interface IReturnUserEvent {
    msg: string;
    user: string;
    socketId: string;
    uuid: string;
}

export interface IReturnTask {
    id: string;
    title: string;
    description: string;
    value?: number;
}

export interface IReturnVote {
    name: string;
    socketId: string;
    uuid: string;
    votting: number | null;
}

export interface IReturnFlipVote {
    event: string;
    resultTask: {
        task: {
            title: string;
            id: string;
            result: number;
        },
        votes: Array<{
            userName: string;
            userId: string;
            vote: number;
            uuid: string;
        }>
    };
}

export interface IDisconnectUserReturn {
    name?: string;
    socketId?: string;
    uuid?: string;
}
