export interface IVoteResult {
    event: string;
    user?: {
        name: string;
        socketId: string;
        uuid?: string
    };
}
