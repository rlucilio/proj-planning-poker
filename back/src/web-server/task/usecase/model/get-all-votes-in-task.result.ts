export interface IGetAllVotesInTaskResult {
    task: {
        title: string;
        id: string;
        result: number;
    },
    votes: Array<{
        userName: string;
        userId: string;
        vote: number
    }>
}
