export interface IGetLastTaskResultModel {
    id: string;
    title: string;
    description: string;
    resultVoting?: number;
    votes: {
        votting?: number;
        user: {
            idSocket: string;
            name: string;
        };
    }[];
}
