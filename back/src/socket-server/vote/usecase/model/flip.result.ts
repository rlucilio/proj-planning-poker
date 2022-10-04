export interface IFlipResult {
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
            uuid?: string;
        }>
    }
}
