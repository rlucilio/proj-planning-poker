import { IUser } from './user';
import { ITaskRoom } from './task-room';

export interface IVote {
    votting: number;
    user: IUser;
    task: ITaskRoom;
}
