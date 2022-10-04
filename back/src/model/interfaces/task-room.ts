import { IVote } from './votes';
import { IRoom } from './room';

export interface ITaskRoom {
    id: string;
    title: string;
    description: string;
    resultVoting?: number;
    votes: IVote[];
    room?: IRoom;
}
